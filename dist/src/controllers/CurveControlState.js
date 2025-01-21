"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleNoDiffEventSlidingState = exports.HandleInflectionsAndCurvatureExtremaSlidingState = exports.HandleCurvatureExtremaSlidingState = exports.HandleInflectionsSlidingState = exports.HandleNoDiffEventNoSlidingState = exports.HandleInflectionsAndCurvatureExtremaNoSlidingState = exports.HandleCurvatureExtremaNoSlidingState = exports.HandleInflectionsNoSlidingState = exports.CurveControlState = void 0;
var ClosedCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor");
var ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
var OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
var OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
var NavigationCurveModel_1 = require("../curveShapeSpaceNavigation/NavigationCurveModel");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var CurveModel_1 = require("../newModels/CurveModel");
var CurveShapeMonitoringStrategy_1 = require("./CurveShapeMonitoringStrategy");
var CurveControlState = /** @class */ (function () {
    function CurveControlState(curveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this._curveControlParamChange = true;
    }
    Object.defineProperty(CurveControlState.prototype, "curveControlParamChange", {
        get: function () {
            return this._curveControlParamChange;
        },
        set: function (curveControlParamChange) {
            this._curveControlParamChange = curveControlParamChange;
        },
        enumerable: false,
        configurable: true
    });
    return CurveControlState;
}());
exports.CurveControlState = CurveControlState;
var HandleInflectionsNoSlidingState = /** @class */ (function (_super) {
    __extends(HandleInflectionsNoSlidingState, _super);
    function HandleInflectionsNoSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleInflectionsNoSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsNoSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsNoSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsNoSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleInflectionsNoSlidingState;
}(CurveControlState));
exports.HandleInflectionsNoSlidingState = HandleInflectionsNoSlidingState;
var HandleCurvatureExtremaNoSlidingState = /** @class */ (function (_super) {
    __extends(HandleCurvatureExtremaNoSlidingState, _super);
    function HandleCurvatureExtremaNoSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleCurvatureExtremaNoSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaNoSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaNoSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaNoSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleCurvatureExtremaNoSlidingState;
}(CurveControlState));
exports.HandleCurvatureExtremaNoSlidingState = HandleCurvatureExtremaNoSlidingState;
var HandleInflectionsAndCurvatureExtremaNoSlidingState = /** @class */ (function (_super) {
    __extends(HandleInflectionsAndCurvatureExtremaNoSlidingState, _super);
    function HandleInflectionsAndCurvatureExtremaNoSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleInflectionsAndCurvatureExtremaNoSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaNoSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaNoSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaNoSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleInflectionsAndCurvatureExtremaNoSlidingState;
}(CurveControlState));
exports.HandleInflectionsAndCurvatureExtremaNoSlidingState = HandleInflectionsAndCurvatureExtremaNoSlidingState;
var HandleNoDiffEventNoSlidingState = /** @class */ (function (_super) {
    __extends(HandleNoDiffEventNoSlidingState, _super);
    function HandleNoDiffEventNoSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            if (_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents instanceof OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence) {
                // It is the initialization phase and this curve differential event extractor has been already set up when creating the OpenCurve
                var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", "curve differential event extractor has been already set up. No new creation");
                warning.logMessage();
            }
            else {
                _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
                _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
                _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            }
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleNoDiffEventNoSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventNoSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventNoSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventNoSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleNoDiffEventNoSlidingState;
}(CurveControlState));
exports.HandleNoDiffEventNoSlidingState = HandleNoDiffEventNoSlidingState;
var HandleInflectionsSlidingState = /** @class */ (function (_super) {
    __extends(HandleInflectionsSlidingState, _super);
    function HandleInflectionsSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleInflectionsSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleInflectionsSlidingState;
}(CurveControlState));
exports.HandleInflectionsSlidingState = HandleInflectionsSlidingState;
var HandleCurvatureExtremaSlidingState = /** @class */ (function (_super) {
    __extends(HandleCurvatureExtremaSlidingState, _super);
    function HandleCurvatureExtremaSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleCurvatureExtremaSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleCurvatureExtremaSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleCurvatureExtremaSlidingState;
}(CurveControlState));
exports.HandleCurvatureExtremaSlidingState = HandleCurvatureExtremaSlidingState;
var HandleInflectionsAndCurvatureExtremaSlidingState = /** @class */ (function (_super) {
    __extends(HandleInflectionsAndCurvatureExtremaSlidingState, _super);
    function HandleInflectionsAndCurvatureExtremaSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleInflectionsAndCurvatureExtremaSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleInflectionsAndCurvatureExtremaSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleInflectionsAndCurvatureExtremaSlidingState;
}(CurveControlState));
exports.HandleInflectionsAndCurvatureExtremaSlidingState = HandleInflectionsAndCurvatureExtremaSlidingState;
var HandleNoDiffEventSlidingState = /** @class */ (function (_super) {
    __extends(HandleNoDiffEventSlidingState, _super);
    function HandleNoDiffEventSlidingState(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        _this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        _this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
        _this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        var curveToAnalyze = _this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            _this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(_this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = _this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        _this.monitorCurveShape();
        return _this;
    }
    HandleNoDiffEventSlidingState.prototype.handleInflections = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventSlidingState.prototype.handleCurvatureExtrema = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventSlidingState.prototype.handleSliding = function () {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    };
    HandleNoDiffEventSlidingState.prototype.monitorCurveShape = function () {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return HandleNoDiffEventSlidingState;
}(CurveControlState));
exports.HandleNoDiffEventSlidingState = HandleNoDiffEventSlidingState;
