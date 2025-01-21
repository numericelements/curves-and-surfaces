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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCurveNavigationStrictlyInsideShapeSpace = exports.CCurveNavigationThroughSimplerShapeSpaces = exports.CCurveNavigationWithoutShapeSpaceMonitoring = exports.ClosedCurveNavigationState = exports.OCurveNavigationStrictlyInsideShapeSpace = exports.OCurveNavigationThroughSimplerShapeSpaces = exports.OCurveNavigationWithoutShapeSpaceMonitoring = exports.OpenCurveNavigationState = exports.NavigationState = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var CurveShapeSpaceNavigator_1 = require("./CurveShapeSpaceNavigator");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var CurveAnalyzer_1 = require("../curveShapeSpaceAnalysis/CurveAnalyzer");
var Vector2d_1 = require("../mathVector/Vector2d");
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var CurveModel_1 = require("../newModels/CurveModel");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
var CurveConstraintStrategy_1 = require("./CurveConstraintStrategy");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var Optimizer_1 = require("../mathematics/Optimizer");
var CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
var DifferentialEventVariation_1 = require("../sequenceOfDifferentialEvents/DifferentialEventVariation");
var OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
var ShapeSpaceDiffEventsStructure_1 = require("./ShapeSpaceDiffEventsStructure");
var DifferentialEvent_1 = require("../sequenceOfDifferentialEvents/DifferentialEvent");
var BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
var NavigationState = /** @class */ (function () {
    function NavigationState() {
        this._navigationStateChange = true;
        this._currentNeighboringEvents = [];
        this._transitionEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
    }
    Object.defineProperty(NavigationState.prototype, "navigationStateChange", {
        get: function () {
            return this._navigationStateChange;
        },
        set: function (navigationStateChange) {
            this._navigationStateChange = navigationStateChange;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationState.prototype, "transitionEvents", {
        get: function () {
            return this._transitionEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationState.prototype, "currentNeighboringEvents", {
        get: function () {
            return this._currentNeighboringEvents;
        },
        enumerable: false,
        configurable: true
    });
    return NavigationState;
}());
exports.NavigationState = NavigationState;
var OpenCurveNavigationState = /** @class */ (function (_super) {
    __extends(OpenCurveNavigationState, _super);
    function OpenCurveNavigationState(navigationCurveModel) {
        var _this = _super.call(this) || this;
        _this.navigationCurveModel = navigationCurveModel;
        _this.shapeNavigableCurve = _this.navigationCurveModel.shapeNavigableCurve;
        if (_this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            _this.currentCurve = _this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessage();
            _this.currentCurve = new BSplineR1toR2_1.BSplineR1toR2;
        }
        _this.navigationCurveModel.currentCurve = _this.currentCurve;
        _this.optimizedCurve = _this.currentCurve.clone();
        _this.navigationCurveModel.optimizedCurve = _this.optimizedCurve;
        if (!_this.navigationCurveModel.shapeNavigableCurve) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessage();
        }
        return _this;
    }
    OpenCurveNavigationState.prototype.setNavigationCurveModel = function (navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
    };
    OpenCurveNavigationState.prototype.setNavigationStrictlyInsideShapeSpace = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    OpenCurveNavigationState.prototype.setNavigationThroughSimplerShapeSpaces = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    OpenCurveNavigationState.prototype.setNavigationWithoutShapeSpaceMonitoring = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    OpenCurveNavigationState.prototype.setCurrentCurve = function (curve) {
        this.currentCurve = curve.clone();
    };
    return OpenCurveNavigationState;
}(NavigationState));
exports.OpenCurveNavigationState = OpenCurveNavigationState;
var OCurveNavigationWithoutShapeSpaceMonitoring = /** @class */ (function (_super) {
    __extends(OCurveNavigationWithoutShapeSpaceMonitoring, _super);
    function OCurveNavigationWithoutShapeSpaceMonitoring(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        var curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OPenCurveDummyAnalyzer(_this.currentCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OPenCurveDummyAnalyzer(_this.optimizedCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        return _this;
    }
    Object.defineProperty(OCurveNavigationWithoutShapeSpaceMonitoring.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OCurveNavigationWithoutShapeSpaceMonitoring.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    OCurveNavigationWithoutShapeSpaceMonitoring.prototype.setNavigationWithoutShapeSpaceMonitoring = function () {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessage();
    };
    OCurveNavigationWithoutShapeSpaceMonitoring.prototype.curveConstraintsMonitoring = function () {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    };
    OCurveNavigationWithoutShapeSpaceMonitoring.prototype.navigate = function (selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        // JCL pas nécessaire dans cette config si pas incompatible avec la connexion de l'optimiseur
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.targetCurve.clone();
        // this.shapeNavigableCurve.updateCurve();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.updateOptimized();
        this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    };
    return OCurveNavigationWithoutShapeSpaceMonitoring;
}(OpenCurveNavigationState));
exports.OCurveNavigationWithoutShapeSpaceMonitoring = OCurveNavigationWithoutShapeSpaceMonitoring;
var OCurveNavigationThroughSimplerShapeSpaces = /** @class */ (function (_super) {
    __extends(OCurveNavigationThroughSimplerShapeSpaces, _super);
    function OCurveNavigationThroughSimplerShapeSpaces(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        _this.curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (_this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || _this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            _this.curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.clampedPoints[0] = 0;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            _this.curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(_this.currentCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(_this.optimizedCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        return _this;
    }
    Object.defineProperty(OCurveNavigationThroughSimplerShapeSpaces.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OCurveNavigationThroughSimplerShapeSpaces.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    OCurveNavigationThroughSimplerShapeSpaces.prototype.setNavigationThroughSimplerShapeSpaces = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessage();
    };
    OCurveNavigationThroughSimplerShapeSpaces.prototype.curveConstraintsMonitoring = function () {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    };
    OCurveNavigationThroughSimplerShapeSpaces.prototype.navigate = function (selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        console.log("navigationCurveModel current = " + JSON.stringify(this.navigationCurveModel.currentCurve.controlPoints));
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        var spline = new BSplineR1toR2_1.BSplineR1toR2();
        var curvatureExtrema_gradients = [];
        var inflection_gradients = [];
        var curvatureDerivative_gradientU = [];
        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
            spline = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline.clone();
            var curvatureSecondDerivative = void 0;
            curvatureSecondDerivative = this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.derivative();
            var nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
            // let e: ExpensiveComputationResults = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.initExpansiveComputations();
            // e = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.expensiveComputation(spline);
            // const gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(
            //     e, this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            var gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            console.log("spline current = " + JSON.stringify(spline.controlPoints));
            for (var i = 0; i < nbEvents; i++) {
                if (this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                    var zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                    console.log("zero location[ " + i + " ] = " + zeroLoc);
                    curvatureDerivative_gradientU.push(curvatureSecondDerivative.evaluate(zeroLoc));
                    if (gradient_curvatureExtrema.shape[0] !== this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                        console.log('inconsistent sizes of control polygons !!');
                    }
                    var curvatureExtrema_gradientperCPComponent = [];
                    for (var k = 0; k < gradient_curvatureExtrema.shape[1]; k++) {
                        var gradient = [];
                        for (var j = 0; j < gradient_curvatureExtrema.shape[0]; j++) {
                            gradient.push(gradient_curvatureExtrema.get(j, k));
                        }
                        var spline_1 = new BSplineR1toR1_1.BSplineR1toR1(gradient, this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots);
                        curvatureExtrema_gradientperCPComponent.push(spline_1.evaluate(zeroLoc));
                    }
                    curvatureExtrema_gradients.push(curvatureExtrema_gradientperCPComponent);
                }
            }
        }
        try {
            var status_1 = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.init(spline);
                status_1 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // const status: OptimizerReturnStatus = this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            if (status_1 === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                var curveModelOptimized = new CurveModel_1.CurveModel();
                if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.previousSpline instanceof BSplineR1toR2_1.BSplineR1toR2
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                    if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline !== this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.previousSpline) {
                        console.log("estimate variations of zeros with last iteration of trust region");
                        // let curvatureExtrema_gradientsPrevious: number[][] = [];
                        // let curvatureDerivative_gradientUPrevious = [];
                        // const gradient_curvatureExtremaPrevious = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradientPreviousIteration(
                        //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
                        // let curvatureDerivativePrevious = new BSplineR1toR1(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureDerivativeNumeratorPreviousIteration(),
                        //                                     this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots);
                        // const zerosCuratureDerivPrevious = curvatureDerivativePrevious.zeros();
                        // let curvatureSecondDerivativePrevious = curvatureDerivativePrevious.derivative();
                        // for( let i = 0; i < zerosCuratureDerivPrevious.length; i++) {
                        //     console.log("zero location[ "+i+" ] = "+zerosCuratureDerivPrevious[i]);
                        //     curvatureDerivative_gradientUPrevious.push(curvatureSecondDerivativePrevious.evaluate(zerosCuratureDerivPrevious[i]));
                        //     if(gradient_curvatureExtremaPrevious.shape[0] !== this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                        //         console.log('inconsistent sizes of control polygons !!')
                        //     }
                        //     const curvatureExtrema_gradientperCPComponent = [];
                        //     for(let k = 0; k < gradient_curvatureExtremaPrevious.shape[1]; k++) {
                        //         let gradient = [];
                        //         for(let j = 0; j < gradient_curvatureExtremaPrevious.shape[0]; j++) {
                        //             gradient.push(gradient_curvatureExtremaPrevious.get(j ,k));
                        //         }
                        //         const spline = new BSplineR1toR1(gradient, this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots);
                        //         curvatureExtrema_gradientperCPComponent.push(spline.evaluate(zerosCuratureDerivPrevious[i]));
                        //     }
                        //     curvatureExtrema_gradientsPrevious.push(curvatureExtrema_gradientperCPComponent);
                        // }
                        // const flattenedCPsplinePrevious = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.previousSpline.flattenControlPointsArray();
                        // this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                        // this.optimizedCurve = curveModelOptimized.spline;
                        // const flattenedCPsplineOptim = this.optimizedCurve.flattenControlPointsArray();
                        // const curvatureDerivativeVariationWrtCP = [];
                        // let variationCP = [];
                        // for(let i = 0; i < flattenedCPsplinePrevious.length; i ++) {
                        //     variationCP.push(flattenedCPsplineOptim[i] - flattenedCPsplinePrevious[i]);
                        // }
                        // for(let i = 0; i < curvatureExtrema_gradientsPrevious.length; i++) {
                        //     let gradient = 0.0;
                        //     for(let j = 0; j < curvatureExtrema_gradientsPrevious[i].length; j ++) {
                        //         gradient = gradient + curvatureExtrema_gradientsPrevious[i][j] * variationCP[j];
                        //     }
                        //     curvatureDerivativeVariationWrtCP.push(gradient);
                        // }
                        // const zerosVariations = [];
                        // for(let i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
                        //     zerosVariations.push(- (curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientUPrevious[i]);
                        // }
                        var zerosPreviousCurve = [0.0];
                        var zerosEstimated_1 = [0.0];
                        // for( let i = 0; i < zerosCuratureDerivPrevious.length; i++) {
                        //     const zeroLoc = zerosCuratureDerivPrevious[i];
                        //     zerosPreviousCurve.push(zeroLoc);
                        //     console.log("estimated zero from previous iter location[ "+i+" ] = "+(zeroLoc + zerosVariations[i])+" variation = "+zerosVariations[i]);
                        //     zerosEstimated.push(zeroLoc + zerosVariations[i]);
                        // }
                        zerosPreviousCurve.push(1.0);
                        zerosEstimated_1.push(1.0);
                        for (var i = 1; i < zerosPreviousCurve.length; i++) {
                            var interval = (zerosPreviousCurve[i] - zerosPreviousCurve[i - 1]);
                            var intervalEstimated = (zerosEstimated_1[i] - zerosEstimated_1[i - 1]);
                            var intervalVariation = intervalEstimated - interval;
                            if (intervalEstimated < 0.0)
                                console.log("estimated interval[ " + i + " ] with zeros crossing");
                            if (intervalEstimated > interval)
                                console.log("interval[ " + i + " ]" + " shrinks: " + intervalVariation);
                            if (intervalEstimated < interval)
                                console.log("interval[ " + i + " ]" + " expands: " + intervalVariation);
                        }
                    }
                }
                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                this.optimizedCurve = curveModelOptimized.spline;
                var flattenedCPsplineInit = spline.flattenControlPointsArray();
                var flattenedCPsplineOptim = this.optimizedCurve.flattenControlPointsArray();
                var curvatureDerivativeVariationWrtCP = [];
                var variationCP = [];
                for (var i = 0; i < flattenedCPsplineInit.length; i++) {
                    variationCP.push(flattenedCPsplineOptim[i] - flattenedCPsplineInit[i]);
                }
                for (var i = 0; i < curvatureExtrema_gradients.length; i++) {
                    var gradient = 0.0;
                    for (var j = 0; j < curvatureExtrema_gradients[i].length; j++) {
                        gradient = gradient + curvatureExtrema_gradients[i][j] * variationCP[j];
                    }
                    curvatureDerivativeVariationWrtCP.push(gradient);
                }
                var zerosVariations = [];
                for (var i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
                    zerosVariations.push(-(curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientU[i]);
                }
                var zerosCurrentCurve = [0.0];
                var zerosEstimated = [0.0];
                var nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
                console.log("estimation of zeros locations from current curve");
                for (var i = 0; i < nbEvents; i++) {
                    if (this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                        var zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                        zerosCurrentCurve.push(zeroLoc);
                        console.log("estimated zero location[ " + i + " ] = " + (zeroLoc + zerosVariations[i]) + " variation = " + zerosVariations[i]);
                        zerosEstimated.push(zeroLoc + zerosVariations[i]);
                    }
                }
                zerosCurrentCurve.push(1.0);
                zerosEstimated.push(1.0);
                for (var i = 1; i < zerosCurrentCurve.length; i++) {
                    var interval = (zerosCurrentCurve[i] - zerosCurrentCurve[i - 1]);
                    var intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
                    var intervalVariation = intervalEstimated - interval;
                    if (intervalEstimated < 0.0)
                        console.log("estimated interval[ " + i + " ] with zeros crossing");
                    if (intervalEstimated > interval)
                        console.log("interval[ " + i + " ]" + " shrinks: " + intervalVariation);
                    if (intervalEstimated < interval)
                        console.log("interval[ " + i + " ]" + " expands: " + intervalVariation);
                }
                this._curveAnalyserOptimizedCurve.updateOptimized();
                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
                var seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
                seqComparator.locateNeiboringEvents();
                this.curveShapeSpaceNavigator.eventStateAtCrvExtremities.monitorEventInsideCurve(seqComparator);
                if (seqComparator.neighboringEvents.length > 0) {
                    console.log("Nb neighboring events identified = " + seqComparator.neighboringEvents.length);
                }
                if (seqComparator.neighboringEvents.length > 0 && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                    var filteredSeqComparator = seqComparator.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
                    if (filteredSeqComparator.neighboringEvents.length === 1) {
                        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.configureBoundaryEnforcer(filteredSeqComparator);
                            this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
                            this._curveAnalyserCurrentCurve.updateCurrent();
                            this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                            this.navigationCurveModel.setTargetCurve();
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                            try {
                                var curveModelOptimized1 = new CurveModel_1.CurveModel();
                                if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                                    var status_2 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                    if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                        && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                        if (status_2 === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                            curveModelOptimized1.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                        }
                                    }
                                }
                                var diffEvExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized1.spline);
                                var seqComparatorWithConstraintsAtExtremities = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor.sequenceOfDifferentialEvents);
                                seqComparatorWithConstraintsAtExtremities.locateNeiboringEvents();
                                var filteredSeqComparatorWithConstraints = seqComparatorWithConstraintsAtExtremities.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
                                if (seqComparatorWithConstraintsAtExtremities.neighboringEvents.length === seqComparator.neighboringEvents.length
                                    && filteredSeqComparatorWithConstraints.neighboringEvents.length === 0) {
                                    console.log(" No match of events after applying constraints at extremities");
                                }
                                this.navigationCurveModel.optimizedCurve = curveModelOptimized1.spline;
                                this.optimizedCurve = curveModelOptimized1.spline;
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                    else if (filteredSeqComparator.neighboringEvents.length > 1) {
                        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                        error.logMessage();
                    }
                }
                else if (this.navigationCurveModel.seqDiffEventsCurrentCurve.length() === this.navigationCurveModel.seqDiffEventsOptimizedCurve.length()
                    && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                    var nbInflectionsCurrrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbInflections();
                    var nbInflectionsOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbInflections();
                    var nbCurvExtCurrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbCurvatureExtrema();
                    var nbCurvExtOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbCurvatureExtrema();
                    console.log("There may be two different events evolving simultaneously nbICur = " + nbInflectionsCurrrent + " nbIOpt = " + nbInflectionsOpt + " nbCECur = " + nbCurvExtCurrent + " nbCEOpt = " + nbCurvExtOpt);
                }
                this.curveConstraintsMonitoring();
                if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                    && (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors
                        || this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints)) {
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                }
            }
            else {
                var curveModelOptimized = new CurveModel_1.CurveModel();
                curveModelOptimized.setSpline(this.currentCurve);
                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                this.optimizedCurve = curveModelOptimized.spline;
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    return OCurveNavigationThroughSimplerShapeSpaces;
}(OpenCurveNavigationState));
exports.OCurveNavigationThroughSimplerShapeSpaces = OCurveNavigationThroughSimplerShapeSpaces;
var OCurveNavigationStrictlyInsideShapeSpace = /** @class */ (function (_super) {
    __extends(OCurveNavigationStrictlyInsideShapeSpace, _super);
    function OCurveNavigationStrictlyInsideShapeSpace(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        _this.curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (_this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || _this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            _this.curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.clampedPoints[0] = 0;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            _this.curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(_this.currentCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(_this.optimizedCurve, _this.navigationCurveModel, _this.navigationCurveModel.slidingEventsAtExtremities);
        return _this;
    }
    Object.defineProperty(OCurveNavigationStrictlyInsideShapeSpace.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OCurveNavigationStrictlyInsideShapeSpace.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    OCurveNavigationStrictlyInsideShapeSpace.prototype.setNavigationStrictlyInsideShapeSpace = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessage();
    };
    OCurveNavigationStrictlyInsideShapeSpace.prototype.curveConstraintsMonitoring = function () {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    };
    OCurveNavigationStrictlyInsideShapeSpace.prototype.navigate = function (selectedControlPoint, x, y) {
        var e_1, _a;
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        var spline = new BSplineR1toR2_1.BSplineR1toR2();
        this._transitionEvents.clear();
        this._currentNeighboringEvents = [];
        this.navigationCurveModel.adjacentShapeSpaceCurve = undefined;
        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            spline = this.currentCurve.clone();
            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.clearIteratedCurves();
        }
        try {
            var status_3 = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive())
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.deactivate();
            }
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                status_3 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            var curveModelOptimized = new CurveModel_1.CurveModel();
            if (status_3 === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE || status_3 === Optimizer_1.OptimizerReturnStatus.MAX_NB_ITER_REACHED) {
                console.log('no solution found from the current curve');
            }
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
            }
            this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
            // console.log(" spline"+curveModelOptimized.spline.controlPoints);
            this.optimizedCurve = curveModelOptimized.spline;
            this._curveAnalyserOptimizedCurve.updateOptimized();
            var diffEvExtractorC = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.currentCurve);
            var diffEvExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.optimizedCurve);
            console.log("curveAnalyzer Opt" + diffEvExtractor.curvatureExtremaParametricLocations + " Cur = " + diffEvExtractorC.curvatureExtremaParametricLocations);
            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            console.log("Nb EVENTS opt = " + this.navigationCurveModel.seqDiffEventsOptimizedCurve.length());
            var seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
            if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.curvatureDerivativeCPOpt = diffEvExtractor.curvatureDerivativeNumerator.controlPoints;
                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.hasTransitionsOfEvents()) {
                    seqComparator.removeAllNeighboringEvents(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.neighboringEvents);
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                }
            }
            // console.log(" Nb of neighboring events after has Transition = "+seqComparator.neighboringEvents.length)
            if (seqComparator.neighboringEvents.length > 0) {
                if (seqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.moreThanOneEvent) {
                    console.log('More than one event to process. Not yet available');
                    this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve.clone();
                    this.optimizedCurve = this.currentCurve.clone();
                    this._curveAnalyserOptimizedCurve.updateOptimized();
                    this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                    this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
                    // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                    //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
                    //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                    // }
                    if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                        && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                    }
                }
                else {
                    var updateDisplacement = false;
                    var updatedDisplacement = new Vector2d_1.Vector2d(x, y);
                    var filteredSeqComparator = seqComparator.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                    if (filteredSeqComparator.neighboringEvents.length > 0) {
                        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                            // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.activate();
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.configureBoundaryEnforcer(filteredSeqComparator);
                        }
                        // console.log(" Nb of neighboring events = "+filteredSeqComparator.neighboringEvents.length+ " seq current length "+this.navigationCurveModel.seqDiffEventsCurrentCurve.sequence.length+ " seq opt length "+this.navigationCurveModel.seqDiffEventsOptimizedCurve.sequence.length);
                        if (this._transitionEvents.length() > 0)
                            updateDisplacement = true;
                        this._currentNeighboringEvents = filteredSeqComparator.neighboringEvents;
                        if (filteredSeqComparator.neighboringEvents.length > 1) {
                            console.log(" Nb of neighboring events2 = " + filteredSeqComparator.neighboringEvents.length + " seq current length " + this.navigationCurveModel.seqDiffEventsCurrentCurve.sequence.length + " seq opt length " + this.navigationCurveModel.seqDiffEventsOptimizedCurve.sequence.length);
                        }
                    }
                    if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                            // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                            //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
                            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isTransitionAtExtremity()) {
                                    if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isCurvatureExtTransitionAtExtremity()) {
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser1 = this._curveAnalyserCurrentCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = this._curveAnalyserOptimizedCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = filteredSeqComparator.neighboringEvents;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
                                        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, updatedDisplacement);
                                        this._curveAnalyserCurrentCurve.updateCurrent();
                                        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                                        this.navigationCurveModel.setTargetCurve();
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = true;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = false;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.clearIteratedCurves();
                                        try {
                                            var threshold = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                            var status_4 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                            var curveModelOptimized_1 = new CurveModel_1.CurveModel();
                                            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                if (status_4 === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                    curveModelOptimized_1.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                }
                                                else if (status_4 === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                    var closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                    if (closestCurveToShapeSpaceBoundary !== undefined) {
                                                        curveModelOptimized_1.setSpline(closestCurveToShapeSpaceBoundary);
                                                    }
                                                    else {
                                                        curveModelOptimized_1.setSpline(spline);
                                                    }
                                                }
                                            }
                                            var diffEvExtractor_1 = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized_1.spline);
                                            var seqComparatorWithoutTransition = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor_1.sequenceOfDifferentialEvents);
                                            seqComparatorWithoutTransition.locateNeiboringEvents();
                                            var filteredSeqComparatorWithoutTransition = seqComparatorWithoutTransition.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                            if (filteredSeqComparatorWithoutTransition.neighboringEvents.length !== 0) {
                                                // need to modify constraint bounds to keep local extrema on the correct side of U axis
                                                console.log("Inconsistent sequence of events after correction. Need further update");
                                                this._currentNeighboringEvents.push(filteredSeqComparatorWithoutTransition.neighboringEvents[0]);
                                                if (this._transitionEvents.length() > 0) {
                                                    console.log(" couple of curvature extrema modified");
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.newEventExist();
                                                    var firstCorrectedCurveAnalyser = new CurveAnalyzer_1.OpenCurveAnalyzer(curveModelOptimized_1.spline, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                                                    var currentCurveAnalyzer = this._curveAnalyserCurrentCurve;
                                                    var diffEventsVariation1 = new DifferentialEventVariation_1.DiffrentialEventVariation(currentCurveAnalyzer, firstCorrectedCurveAnalyser);
                                                    diffEventsVariation1.neighboringEvents = filteredSeqComparatorWithoutTransition.neighboringEvents;
                                                    diffEventsVariation1.variationDifferentialEvents();
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation = diffEventsVariation1;
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation = diffEventsVariation1;
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser1 = currentCurveAnalyzer;
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = firstCorrectedCurveAnalyser;
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = filteredSeqComparatorWithoutTransition.neighboringEvents;
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
                                                    updatedDisplacement = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateCPDisplacement(this.navigationCurveModel.currentCurve, selectedControlPoint, x, y);
                                                    this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, updatedDisplacement);
                                                    this._curveAnalyserCurrentCurve.updateCurrent();
                                                    this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                                                    this.navigationCurveModel.setTargetCurve();
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.clearIteratedCurves();
                                                    // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                                    try {
                                                        var threshold_1 = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                                        var status_5 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold_1, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                                        var curveModelOptimized2 = new CurveModel_1.CurveModel();
                                                        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                            if (status_5 === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                                curveModelOptimized2.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                            }
                                                            else if (status_5 === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                                this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                                var closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                                if (closestCurveToShapeSpaceBoundary !== undefined) {
                                                                    curveModelOptimized2.setSpline(closestCurveToShapeSpaceBoundary);
                                                                }
                                                                else {
                                                                    curveModelOptimized2.setSpline(spline);
                                                                }
                                                            }
                                                        }
                                                        var diffEvExtractor1 = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized2.spline);
                                                        var seqComparatorWithoutTransition1 = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor1.sequenceOfDifferentialEvents);
                                                        seqComparatorWithoutTransition1.locateNeiboringEvents();
                                                        var filteredSeqComparatorWithoutTransition1 = seqComparatorWithoutTransition1.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                                        if (filteredSeqComparatorWithoutTransition1.neighboringEvents.length !== 0) {
                                                            console.log('correction not sufficient. need to iterate');
                                                        }
                                                        curveModelOptimized_1.setSpline(curveModelOptimized2.spline);
                                                    }
                                                    catch (e) {
                                                        console.error(e);
                                                    }
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                                    this.navigationCurveModel.optimizedCurve = curveModelOptimized_1.spline;
                                                    this.optimizedCurve = curveModelOptimized_1.spline;
                                                    this._curveAnalyserOptimizedCurve.updateOptimized();
                                                    this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.removeNewEvent();
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.resetNeighboringEvents();
                                                }
                                            }
                                            else {
                                                this.navigationCurveModel.optimizedCurve = curveModelOptimized_1.spline;
                                                this.optimizedCurve = curveModelOptimized_1.spline;
                                                this._curveAnalyserOptimizedCurve.updateOptimized();
                                                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                            }
                                        }
                                        catch (e) {
                                            console.error(e);
                                        }
                                    }
                                }
                                if (!this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isTransitionAtExtremity()) {
                                    console.log("Couple neighboring events Curv Ex or Inflections");
                                    try {
                                        for (var _b = __values(filteredSeqComparator.neighboringEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                                            var neighboringEvents = _c.value;
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser1 = this._curveAnalyserCurrentCurve;
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = this._curveAnalyserOptimizedCurve;
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = filteredSeqComparator.neighboringEvents;
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
                                            var closestCurveToShapeSpaceBoundary1 = this.closestCurveToShapeSpaceBoundary();
                                            if (updateDisplacement && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.iteratedCurves.length > 0) {
                                                updatedDisplacement = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateCPDisplacement(this.navigationCurveModel.currentCurve, selectedControlPoint, x, y);
                                            }
                                            this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, updatedDisplacement);
                                            this._curveAnalyserCurrentCurve.updateCurrent();
                                            this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                                            this.navigationCurveModel.setTargetCurve();
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = true;
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = false;
                                            if (!updateDisplacement) {
                                                // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.cancelEvent();
                                                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                            }
                                            try {
                                                var status_6 = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
                                                var threshold = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD) {
                                                    while (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < threshold) {
                                                        threshold = threshold / 10;
                                                    }
                                                }
                                                status_6 = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                                // while (status === OptimizerReturnStatus.TERMINATION_WITHOUT_CONVERGENCE) {
                                                //     let updatedCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                //     const curveAnalyzerUpdatedCurve = new OpenCurveAnalyzer(updatedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                                                //     // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                //     // this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
                                                //     // this._curveAnalyserOptimizedCurve.updateOptimized();
                                                //     // this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                                //     // this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
                                                //     // const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
                                                //     // seqComparator.locateNeiboringEvents();
                                                //     // this._currentNeighboringEvents = seqComparator.neighboringEvents[0];
                                                //     // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = this._curveAnalyserOptimizedCurve;
                                                //     // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = seqComparator.neighboringEvents;
                                                //     // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
                                                //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateExtremumValueOptimized(curveAnalyzerUpdatedCurve.curvatureDerivativeNumerator);
                                                //     updatedDisplacement = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateCPDisplacement(this.navigationCurveModel.currentCurve, selectedControlPoint, x, y);
                                                //     this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, updatedDisplacement);
                                                //     this._curveAnalyserCurrentCurve.updateCurrent();
                                                //     this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                                                //     this.navigationCurveModel.setTargetCurve();
                                                //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = true;
                                                //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                                                //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = false;
                                                //     status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                                // }
                                                var curveModelOptimized_2 = new CurveModel_1.CurveModel();
                                                if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                    if (status_6 === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                        curveModelOptimized_2.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                    }
                                                    else if (status_6 === Optimizer_1.OptimizerReturnStatus.FIRST_ITERATION || status_6 === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE
                                                        || closestCurveToShapeSpaceBoundary1 === undefined) {
                                                        this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                        curveModelOptimized_2.setSpline(spline);
                                                    }
                                                    else if (closestCurveToShapeSpaceBoundary1 !== undefined) {
                                                        this.navigationCurveModel.adjacentShapeSpaceCurve = curveModelOptimized_2.spline;
                                                        curveModelOptimized_2.setSpline(closestCurveToShapeSpaceBoundary1);
                                                    }
                                                }
                                                this.navigationCurveModel.optimizedCurve = curveModelOptimized_2.spline;
                                                this.optimizedCurve = curveModelOptimized_2.spline;
                                                this._curveAnalyserOptimizedCurve.updateOptimized();
                                                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.resetEventsAtExtremities();
                                            }
                                            catch (e) {
                                                console.error(e);
                                                this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve;
                                                this.optimizedCurve = this.currentCurve.clone();
                                                this._curveAnalyserOptimizedCurve.updateOptimized();
                                                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                            }
                                            if (updateDisplacement) {
                                                updateDisplacement = false;
                                                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                            }
                                        }
                                    }
                                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                    finally {
                                        try {
                                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                    }
                                }
                                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.resetEventsAtExtremities();
                            }
                        }
                    }
                }
            }
            this.curveConstraintsMonitoring();
        }
        catch (e) {
            console.error(e);
            console.log('error in optimizer');
            this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve.clone();
            this.optimizedCurve = this.currentCurve.clone();
            this._curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
            //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
            }
        }
    };
    OCurveNavigationStrictlyInsideShapeSpace.prototype.closestCurveToShapeSpaceBoundary = function () {
        var index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
        //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            var extremumValue = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValue;
            var iteratedCurves = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.iteratedCurves;
            for (var iCurve = 0; iCurve < iteratedCurves.length; iCurve++) {
                var iteratedCurveAnalyser = new CurveAnalyzer_1.OpenCurveAnalyzer(iteratedCurves[iCurve], this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateExtremumValueOptimized(iteratedCurveAnalyser.curvatureDerivativeNumerator);
                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValue *
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt > 0.0
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumLocationOpt !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                    if (Math.abs(extremumValue) > Math.abs(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt)) {
                        extremumValue = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt;
                        index = iCurve;
                    }
                }
            }
            return iteratedCurves[index];
        }
    };
    return OCurveNavigationStrictlyInsideShapeSpace;
}(OpenCurveNavigationState));
exports.OCurveNavigationStrictlyInsideShapeSpace = OCurveNavigationStrictlyInsideShapeSpace;
var ClosedCurveNavigationState = /** @class */ (function (_super) {
    __extends(ClosedCurveNavigationState, _super);
    function ClosedCurveNavigationState(navigationCurveModel) {
        var _this = _super.call(this) || this;
        _this.navigationCurveModel = navigationCurveModel;
        _this.shapeNavigableCurve = _this.navigationCurveModel.shapeNavigableCurve;
        if (_this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            _this.currentCurve = _this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessage();
            _this.currentCurve = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence;
        }
        _this.navigationCurveModel.currentCurve = _this.currentCurve;
        _this.optimizedCurve = _this.currentCurve.clone();
        _this.navigationCurveModel.optimizedCurve = _this.optimizedCurve;
        if (!_this.navigationCurveModel.shapeNavigableCurve) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessage();
        }
        return _this;
    }
    ClosedCurveNavigationState.prototype.setNavigationCurveModel = function (navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
    };
    ClosedCurveNavigationState.prototype.setNavigationStrictlyInsideShapeSpace = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    ClosedCurveNavigationState.prototype.setNavigationThroughSimplerShapeSpaces = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    ClosedCurveNavigationState.prototype.setNavigationWithoutShapeSpaceMonitoring = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    };
    ClosedCurveNavigationState.prototype.setCurrentCurve = function (curve) {
        this.currentCurve = curve.clone();
    };
    return ClosedCurveNavigationState;
}(NavigationState));
exports.ClosedCurveNavigationState = ClosedCurveNavigationState;
var CCurveNavigationWithoutShapeSpaceMonitoring = /** @class */ (function (_super) {
    __extends(CCurveNavigationWithoutShapeSpaceMonitoring, _super);
    function CCurveNavigationWithoutShapeSpaceMonitoring(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        var curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveDummyAnalyzer(_this.currentCurve, _this.navigationCurveModel);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveDummyAnalyzer(_this.optimizedCurve, _this.navigationCurveModel);
        return _this;
    }
    Object.defineProperty(CCurveNavigationWithoutShapeSpaceMonitoring.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CCurveNavigationWithoutShapeSpaceMonitoring.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    CCurveNavigationWithoutShapeSpaceMonitoring.prototype.setNavigationWithoutShapeSpaceMonitoring = function () {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessage();
    };
    CCurveNavigationWithoutShapeSpaceMonitoring.prototype.curveConstraintsMonitoring = function () {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    };
    CCurveNavigationWithoutShapeSpaceMonitoring.prototype.navigate = function (selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        // JCL pas nécessaire dans cette config si pas incompatible avec la connexion de l'optimiseur
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.targetCurve;
        // this.shapeNavigableCurve.updateCurve();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.updateOptimized();
        this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    };
    return CCurveNavigationWithoutShapeSpaceMonitoring;
}(ClosedCurveNavigationState));
exports.CCurveNavigationWithoutShapeSpaceMonitoring = CCurveNavigationWithoutShapeSpaceMonitoring;
var CCurveNavigationThroughSimplerShapeSpaces = /** @class */ (function (_super) {
    __extends(CCurveNavigationThroughSimplerShapeSpaces, _super);
    function CCurveNavigationThroughSimplerShapeSpaces(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        var curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.clampedPoints[0] = 0;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(_this.currentCurve, _this.navigationCurveModel);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(_this.optimizedCurve, _this.navigationCurveModel);
        return _this;
    }
    Object.defineProperty(CCurveNavigationThroughSimplerShapeSpaces.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CCurveNavigationThroughSimplerShapeSpaces.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    CCurveNavigationThroughSimplerShapeSpaces.prototype.setNavigationThroughSimplerShapeSpaces = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessage();
    };
    CCurveNavigationThroughSimplerShapeSpaces.prototype.curveConstraintsMonitoring = function () {
        // pb etat des contraintes incorrect: un seul pt alors que etat: 2 pts ancres
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    };
    CCurveNavigationThroughSimplerShapeSpaces.prototype.navigate = function (selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        try {
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // requires optimization process for periodic B-Splines
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
            }
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            var seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch (e) {
        }
    };
    return CCurveNavigationThroughSimplerShapeSpaces;
}(ClosedCurveNavigationState));
exports.CCurveNavigationThroughSimplerShapeSpaces = CCurveNavigationThroughSimplerShapeSpaces;
var CCurveNavigationStrictlyInsideShapeSpace = /** @class */ (function (_super) {
    __extends(CCurveNavigationStrictlyInsideShapeSpace, _super);
    function CCurveNavigationStrictlyInsideShapeSpace(navigationCurveModel) {
        var _this = _super.call(this, navigationCurveModel) || this;
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        _this.optimizedCurve = _this.navigationCurveModel.optimizedCurve;
        var curveShapeSpaceNavigator = _this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
            _this.shapeNavigableCurve.clampedPoints[0] = 0;
            _this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(_this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = _this;
            _this.navigationCurveModel.navigationState = _this;
        }
        _this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(_this.currentCurve, _this.navigationCurveModel);
        _this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(_this.optimizedCurve, _this.navigationCurveModel);
        return _this;
    }
    Object.defineProperty(CCurveNavigationStrictlyInsideShapeSpace.prototype, "curveAnalyserCurrentCurve", {
        get: function () {
            return this._curveAnalyserCurrentCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CCurveNavigationStrictlyInsideShapeSpace.prototype, "curveAnalyserOptimizedCurve", {
        get: function () {
            return this._curveAnalyserOptimizedCurve;
        },
        enumerable: false,
        configurable: true
    });
    CCurveNavigationStrictlyInsideShapeSpace.prototype.setNavigationStrictlyInsideShapeSpace = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessage();
    };
    CCurveNavigationStrictlyInsideShapeSpace.prototype.curveConstraintsMonitoring = function () {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    };
    CCurveNavigationStrictlyInsideShapeSpace.prototype.navigate = function (selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        try {
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
            }
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            var seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch (e) {
        }
    };
    return CCurveNavigationStrictlyInsideShapeSpace;
}(ClosedCurveNavigationState));
exports.CCurveNavigationStrictlyInsideShapeSpace = CCurveNavigationStrictlyInsideShapeSpace;
