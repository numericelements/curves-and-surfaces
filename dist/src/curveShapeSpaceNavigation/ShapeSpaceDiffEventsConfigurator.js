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
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithInflectionsSliding = exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithInflectionsNoSliding = exports.ShapeSpaceConfiguration = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
var CurveModel_1 = require("../newModels/CurveModel");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
var OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
var ClosedCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor");
var ShapeSpaceConfiguration = /** @class */ (function () {
    function ShapeSpaceConfiguration() {
        this._shapeSpaceConfigurationChange = true;
    }
    Object.defineProperty(ShapeSpaceConfiguration.prototype, "shapeSpaceConfigurationChange", {
        get: function () {
            return this._shapeSpaceConfigurationChange;
        },
        set: function (shapeSpaceConfigurationChange) {
            this._shapeSpaceConfigurationChange = shapeSpaceConfigurationChange;
        },
        enumerable: false,
        configurable: true
    });
    return ShapeSpaceConfiguration;
}());
exports.ShapeSpaceConfiguration = ShapeSpaceConfiguration;
var ShapeSpaceConfiguratorWithInflectionsNoSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithInflectionsNoSliding, _super);
    function ShapeSpaceConfiguratorWithInflectionsNoSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithInflectionsNoSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithInflectionsNoSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithInflectionsNoSliding = ShapeSpaceConfiguratorWithInflectionsNoSliding;
var ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, _super);
    function ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding;
var ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, _super);
    function ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding;
var ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding, _super);
    function ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a Dummy strategy
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        //     error.logMessageToConsole();
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding;
var ShapeSpaceConfiguratorWithInflectionsSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithInflectionsSliding, _super);
    function ShapeSpaceConfiguratorWithInflectionsSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithInflectionsSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithInflectionsSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithInflectionsSliding = ShapeSpaceConfiguratorWithInflectionsSliding;
var ShapeSpaceConfiguratorWithCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithCurvatureExtremaSliding, _super);
    function ShapeSpaceConfiguratorWithCurvatureExtremaSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithCurvatureExtremaSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithCurvatureExtremaSliding = ShapeSpaceConfiguratorWithCurvatureExtremaSliding;
var ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, _super);
    function ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding = ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding;
var ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding, _super);
    function ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding(curveShapeSpaceNavigator) {
        var _this = _super.call(this) || this;
        _this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        _this.shapeNavigableCurve = _this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        return _this;
    }
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding.prototype.monitorCurveUsingDifferentialEvents = function (shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a dummy strategy
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    };
    return ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding;
}(ShapeSpaceConfiguration));
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding = ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding;
