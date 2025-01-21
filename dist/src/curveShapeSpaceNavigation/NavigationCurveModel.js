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
exports.ClosedCurveShapeSpaceNavigator = exports.OpenCurveShapeSpaceNavigator = exports.NavigationCurveModel = void 0;
var OptimizationProblemCtrlParameters_1 = require("../bsplineOptimizationProblems/OptimizationProblemCtrlParameters");
var CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
var ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties_1 = require("../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var CurveModel_1 = require("../newModels/CurveModel");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var CurveShapeSpaceDescriptor_1 = require("./CurveShapeSpaceDescriptor");
var NavigationState_1 = require("./NavigationState");
var NavigationCurveModel = /** @class */ (function () {
    function NavigationCurveModel(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._curveControlState = this._curveShapeSpaceNavigator.curveControlState;
        this.controlOfInflections = this._shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.sliding = this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
        this._shapeNavigableCurve = curveShapeSpaceNavigator.shapeNavigableCurve;
    }
    Object.defineProperty(NavigationCurveModel.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationCurveModel.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationCurveModel.prototype, "navigationState", {
        get: function () {
            return this._navigationState;
        },
        set: function (navigationState) {
            this._navigationState = navigationState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationCurveModel.prototype, "shapeSpaceDiffEventsStructure", {
        get: function () {
            return this._shapeSpaceDiffEventsStructure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationCurveModel.prototype, "curveShapeMonitoringStrategy", {
        // get activeExtremaLocationControl(): ActiveExtremaLocationControl {
        //     return this._activeExtremaLocationControl;
        // }
        get: function () {
            return this._curveShapeMonitoringStrategy;
        },
        set: function (curveShapeMonitoringStrategy) {
            this._curveShapeMonitoringStrategy = curveShapeMonitoringStrategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationCurveModel.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        set: function (curveControlState) {
            this._curveControlState = curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    NavigationCurveModel.prototype.changeCurveShapeMonitoring = function (strategy) {
        this._curveShapeMonitoringStrategy = strategy;
    };
    return NavigationCurveModel;
}());
exports.NavigationCurveModel = NavigationCurveModel;
var OpenCurveShapeSpaceNavigator = /** @class */ (function (_super) {
    __extends(OpenCurveShapeSpaceNavigator, _super);
    function OpenCurveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this._displacementCurrentCurveControlPolygon = [];
        if (_this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            _this._curveModel = _this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            _this._curveModel = new CurveModel_1.CurveModel();
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        _this._currentCurve = _this.curveModel.spline;
        _this.currentControlPolygon = _this.currentCurve.controlPoints;
        _this._selectedControlPoint = undefined;
        _this.locationSelectedCP = new Vector2d_1.Vector2d(0, 0);
        _this._targetCurve = _this.curveModel.spline;
        _this._optimizedCurve = _this._currentCurve.clone();
        _this.currentControlPolygon.forEach(function () { return _this.displacementCurrentCurveControlPolygon.push(new Vector2d_1.Vector2d(0.0, 0.0)); });
        _this._curveShapeMonitoringStrategy = new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(_this);
        _this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor_1.CurveShapeSpaceDescriptor(_this._currentCurve);
        // this._eventMgmtAtCurveExtremities = new EventMgmtAtCurveExtremities();
        _this._slidingEventsAtExtremities = new ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties_1.CurveAnalyzerEventsSlidingOutOfInterval();
        // JCL Setting up the navigation state requires having defined the shapeSpaceDiffEventsStructure and its shapeSpaceDiffEventsConfigurator
        // JCL as well as the CurveShapeSpaceDescriptor
        _this._navigationState = new NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring(_this);
        _this._curveShapeSpaceNavigator.navigationState = _this._navigationState;
        // JCL requires the setting of the navigationState
        _this.curveAnalyserCurrentCurve = _this._navigationState.curveAnalyserCurrentCurve;
        _this._seqDiffEventsCurrentCurve = _this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        _this.curveAnalyserOptimizedCurve = _this._navigationState.curveAnalyserOptimizedCurve;
        _this._seqDiffEventsOptimizedCurve = _this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        _this.diffEvents = new NeighboringEvents_1.NeighboringEvents();
        _this._optimizationProblemParam = new OptimizationProblemCtrlParameters_1.OptimizationProblemCtrlParameters();
        _this.changeNavigationState(_this._navigationState);
        console.log("end constructor curveShapeSpaceNavigator");
        return _this;
    }
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "seqDiffEventsCurrentCurve", {
        get: function () {
            return this._seqDiffEventsCurrentCurve;
        },
        set: function (seqDiffEventsCurrentCurve) {
            this._seqDiffEventsCurrentCurve = seqDiffEventsCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "seqDiffEventsOptimizedCurve", {
        get: function () {
            return this._seqDiffEventsOptimizedCurve;
        },
        set: function (seqDiffEventsOptimizedCurve) {
            this._seqDiffEventsOptimizedCurve = seqDiffEventsOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "optimizationProblemParam", {
        get: function () {
            return this._optimizationProblemParam;
        },
        set: function (optimPbParam) {
            this._optimizationProblemParam = optimPbParam;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "selectedControlPoint", {
        get: function () {
            if (this._selectedControlPoint !== undefined) {
                return this._selectedControlPoint;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
                error.logMessage();
            }
        },
        set: function (cpIndex) {
            if (cpIndex !== undefined) {
                this.selectedControlPoint = cpIndex;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'set', 'the control point index must not be of type undefined.');
                error.logMessage();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "optimizedCurve", {
        get: function () {
            return this._optimizedCurve.clone();
        },
        // set eventMgmtAtCurveExtremities(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        //     this._eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        // }
        set: function (aBSpline) {
            this._optimizedCurve = aBSpline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "currentCurve", {
        // get eventMgmtAtCurveExtremities(): EventMgmtAtCurveExtremities {
        //     return this._eventMgmtAtCurveExtremities;
        // }
        get: function () {
            return this._currentCurve.clone();
        },
        set: function (curve) {
            this._currentCurve = curve.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "adjacentShapeSpaceCurve", {
        get: function () {
            var _a;
            return (_a = this._adjacentShapeSpaceCurve) === null || _a === void 0 ? void 0 : _a.clone();
        },
        set: function (adjacentShapeSpaceCurve) {
            this._adjacentShapeSpaceCurve = adjacentShapeSpaceCurve;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "targetCurve", {
        get: function () {
            return this._targetCurve.clone();
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "displacementCurrentCurveControlPolygon", {
        get: function () {
            return this._displacementCurrentCurveControlPolygon;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveShapeSpaceNavigator.prototype, "slidingEventsAtExtremities", {
        get: function () {
            return this._slidingEventsAtExtremities;
        },
        enumerable: false,
        configurable: true
    });
    OpenCurveShapeSpaceNavigator.prototype.changeNavigationState = function (state) {
        this._navigationState = state;
        this.navigationState.setNavigationCurveModel(this);
    };
    OpenCurveShapeSpaceNavigator.prototype.navigateSpace = function (selectedControlPoint, x, y) {
        // const message = new WarningLog(this.constructor.name, "navigateSpace", this.navigationState.constructor.name + " "
        // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
        // message.logMessageToConsole();
        this._selectedControlPoint = selectedControlPoint;
        this.navigationState.navigate(selectedControlPoint, x, y);
    };
    // initializeNavigationStep(): void {
    //     const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
    //     this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    // }
    OpenCurveShapeSpaceNavigator.prototype.updateCurrentCurve = function (newSelectedControlPoint, newDispSelctdCP) {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    };
    OpenCurveShapeSpaceNavigator.prototype.setTargetCurve = function () {
        if (this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessage();
        }
        if (this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
            // this.curveControl.optimizationProblem.setTargetSpline(this.targetCurve);
            this._curveShapeMonitoringStrategy.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    };
    OpenCurveShapeSpaceNavigator.prototype.resetCurveToOptimize = function () {
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new CurveModel_1.CurveModel();
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        this._curveShapeMonitoringStrategy.resetAfterCurveChange();
    };
    OpenCurveShapeSpaceNavigator.prototype.curveDisplacement = function () {
        for (var i = 0; i < this.displacementCurrentCurveControlPolygon.length; i += 1) {
            this.displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    };
    return OpenCurveShapeSpaceNavigator;
}(NavigationCurveModel));
exports.OpenCurveShapeSpaceNavigator = OpenCurveShapeSpaceNavigator;
var ClosedCurveShapeSpaceNavigator = /** @class */ (function (_super) {
    __extends(ClosedCurveShapeSpaceNavigator, _super);
    function ClosedCurveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        var _this = _super.call(this, curveShapeSpaceNavigator) || this;
        _this._displacementCurrentCurveControlPolygon = [];
        if (_this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this._curveModel = _this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            _this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        // this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
        //     this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        _this._currentCurve = _this.curveModel.spline;
        _this.currentControlPolygon = _this.currentCurve.controlPoints.slice();
        _this._selectedControlPoint = undefined;
        _this.locationSelectedCP = new Vector2d_1.Vector2d(0, 0);
        _this._targetCurve = _this.curveModel.spline;
        _this._optimizedCurve = _this._currentCurve.clone();
        _this.currentControlPolygon.forEach(function () { return _this._displacementCurrentCurveControlPolygon.push(new Vector2d_1.Vector2d(0.0, 0.0)); });
        _this._curveShapeMonitoringStrategy = new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(_this);
        _this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor_1.CurveShapeSpaceDescriptor(_this._currentCurve);
        _this._navigationState = new NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring(_this);
        _this._curveShapeSpaceNavigator.navigationState = _this._navigationState;
        _this.curveAnalyserCurrentCurve = _this.navigationState.curveAnalyserCurrentCurve;
        _this._seqDiffEventsCurrentCurve = _this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        _this.curveAnalyserOptimizedCurve = _this.navigationState.curveAnalyserOptimizedCurve;
        _this._seqDiffEventsOptimizedCurve = _this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        // JCL temporary setting before adapting the optimization problem setting to closed curves
        // const dummyCurveModel = new CurveModel()
        _this._optimizationProblemParam = new OptimizationProblemCtrlParameters_1.OptimizationProblemCtrlParameters();
        return _this;
    }
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "seqDiffEventsCurrentCurve", {
        get: function () {
            return this._seqDiffEventsCurrentCurve;
        },
        set: function (seqDiffEventsCurrentCurve) {
            this._seqDiffEventsCurrentCurve = seqDiffEventsCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "seqDiffEventsOptimizedCurve", {
        get: function () {
            return this._seqDiffEventsOptimizedCurve;
        },
        set: function (seqDiffEventsOptimizedCurve) {
            this._seqDiffEventsOptimizedCurve = seqDiffEventsOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "currentCurve", {
        get: function () {
            return this._currentCurve.clone();
        },
        set: function (curve) {
            this._currentCurve = curve.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "targetCurve", {
        get: function () {
            return this._targetCurve.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "optimizedCurve", {
        get: function () {
            return this._optimizedCurve.clone();
        },
        set: function (aBSpline) {
            this._optimizedCurve = aBSpline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "adjacentShapeSpaceCurve", {
        get: function () {
            var _a;
            return (_a = this._adjacentShapeSpaceCurve) === null || _a === void 0 ? void 0 : _a.clone();
        },
        set: function (adjacentShapeSpaceCurve) {
            this._adjacentShapeSpaceCurve = adjacentShapeSpaceCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "optimizationProblemParam", {
        get: function () {
            return this._optimizationProblemParam;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "selectedControlPoint", {
        get: function () {
            if (this._selectedControlPoint !== undefined) {
                return this._selectedControlPoint;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
                error.logMessage();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "displacementCurrentCurveControlPolygon", {
        get: function () {
            return this._displacementCurrentCurveControlPolygon;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveShapeSpaceNavigator.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    ClosedCurveShapeSpaceNavigator.prototype.changeNavigationState = function (state) {
        this._navigationState = state;
        this._navigationState.setNavigationCurveModel(this);
    };
    ClosedCurveShapeSpaceNavigator.prototype.setTargetCurve = function () {
        if (this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessage();
        }
        if (this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
            this._curveShapeMonitoringStrategy.optimizationProblem.setTargetSpline(this.targetCurve);
            // this.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    };
    ClosedCurveShapeSpaceNavigator.prototype.resetCurveToOptimize = function () {
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        // this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
        //     this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        this._curveShapeMonitoringStrategy.resetAfterCurveChange();
    };
    ClosedCurveShapeSpaceNavigator.prototype.updateCurrentCurve = function (newSelectedControlPoint, newDispSelctdCP) {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    };
    ClosedCurveShapeSpaceNavigator.prototype.navigateSpace = function (selectedControlPoint, x, y) {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, "navigateSpace", this._navigationState.constructor.name + " "
            // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
            + this._curveControlState.constructor.name);
        message.logMessage();
        this._selectedControlPoint = selectedControlPoint;
        this._navigationState.navigate(selectedControlPoint, x, y);
    };
    ClosedCurveShapeSpaceNavigator.prototype.curveDisplacement = function () {
        for (var i = 0; i < this._displacementCurrentCurveControlPolygon.length; i += 1) {
            this._displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    };
    return ClosedCurveShapeSpaceNavigator;
}(NavigationCurveModel));
exports.ClosedCurveShapeSpaceNavigator = ClosedCurveShapeSpaceNavigator;
