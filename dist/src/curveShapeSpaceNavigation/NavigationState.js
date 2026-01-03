"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCurveNavigationStrictlyInsideShapeSpace = exports.CCurveNavigationThroughSimplerShapeSpaces = exports.CCurveNavigationWithoutShapeSpaceMonitoring = exports.ClosedCurveNavigationState = exports.OCurveNavigationStrictlyInsideShapeSpace = exports.OCurveNavigationThroughSimplerShapeSpaces = exports.OCurveNavigationWithoutShapeSpaceMonitoring = exports.OpenCurveNavigationState = exports.NavigationState = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const CurveShapeSpaceNavigator_1 = require("./CurveShapeSpaceNavigator");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const CurveAnalyzer_1 = require("../curveShapeSpaceAnalysis/CurveAnalyzer");
const Vector2d_1 = require("../mathVector/Vector2d");
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const CurveModel_1 = require("../newModels/CurveModel");
const PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
const CurveConstraintStrategy_1 = require("./CurveConstraintStrategy");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const Optimizer_1 = require("../mathematics/Optimizer");
const CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
const DifferentialEventVariation_1 = require("../sequenceOfDifferentialEvents/DifferentialEventVariation");
const OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
const ShapeSpaceDiffEventsStructure_1 = require("./ShapeSpaceDiffEventsStructure");
const DifferentialEvent_1 = require("../sequenceOfDifferentialEvents/DifferentialEvent");
const BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
class NavigationState {
    constructor() {
        this._navigationStateChange = true;
        this._currentNeighboringEvents = [];
        this._transitionEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
    }
    get navigationStateChange() {
        return this._navigationStateChange;
    }
    get transitionEvents() {
        return this._transitionEvents;
    }
    get currentNeighboringEvents() {
        return this._currentNeighboringEvents;
    }
    set navigationStateChange(navigationStateChange) {
        this._navigationStateChange = navigationStateChange;
    }
}
exports.NavigationState = NavigationState;
class OpenCurveNavigationState extends NavigationState {
    constructor(navigationCurveModel) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if (this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessage();
            this.currentCurve = new BSplineR1toR2_1.BSplineR1toR2;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if (!this.navigationCurveModel.shapeNavigableCurve) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessage();
        }
    }
    setNavigationCurveModel(navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
    }
    setNavigationStrictlyInsideShapeSpace() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setNavigationThroughSimplerShapeSpaces() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setNavigationWithoutShapeSpaceMonitoring() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setCurrentCurve(curve) {
        this.currentCurve = curve.clone();
    }
}
exports.OpenCurveNavigationState = OpenCurveNavigationState;
class OCurveNavigationWithoutShapeSpaceMonitoring extends OpenCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OPenCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OPenCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationWithoutShapeSpaceMonitoring() {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }
    navigate(selectedControlPoint, x, y) {
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
    }
}
exports.OCurveNavigationWithoutShapeSpaceMonitoring = OCurveNavigationWithoutShapeSpaceMonitoring;
class OCurveNavigationThroughSimplerShapeSpaces extends OpenCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        this.curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationThroughSimplerShapeSpaces() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }
    navigate(selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        console.log("navigationCurveModel current = " + JSON.stringify(this.navigationCurveModel.currentCurve.controlPoints));
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        let spline = new BSplineR1toR2_1.BSplineR1toR2();
        let curvatureExtrema_gradients = [];
        let inflection_gradients = [];
        let curvatureDerivative_gradientU = [];
        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
            spline = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline.clone();
            let curvatureSecondDerivative;
            curvatureSecondDerivative = this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.derivative();
            const nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
            // let e: ExpensiveComputationResults = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.initExpansiveComputations();
            // e = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.expensiveComputation(spline);
            // const gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(
            //     e, this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            const gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            console.log("spline current = " + JSON.stringify(spline.controlPoints));
            for (let i = 0; i < nbEvents; i++) {
                if (this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                    const zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                    console.log("zero location[ " + i + " ] = " + zeroLoc);
                    curvatureDerivative_gradientU.push(curvatureSecondDerivative.evaluate(zeroLoc));
                    if (gradient_curvatureExtrema.shape[0] !== this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                        console.log('inconsistent sizes of control polygons !!');
                    }
                    const curvatureExtrema_gradientperCPComponent = [];
                    for (let k = 0; k < gradient_curvatureExtrema.shape[1]; k++) {
                        let gradient = [];
                        for (let j = 0; j < gradient_curvatureExtrema.shape[0]; j++) {
                            gradient.push(gradient_curvatureExtrema.get(j, k));
                        }
                        const spline = new BSplineR1toR1_1.BSplineR1toR1(gradient, this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots);
                        curvatureExtrema_gradientperCPComponent.push(spline.evaluate(zeroLoc));
                    }
                    curvatureExtrema_gradients.push(curvatureExtrema_gradientperCPComponent);
                }
            }
        }
        try {
            let status = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.init(spline);
                status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // const status: OptimizerReturnStatus = this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                let curveModelOptimized = new CurveModel_1.CurveModel();
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
                        const zerosPreviousCurve = [0.0];
                        const zerosEstimated = [0.0];
                        // for( let i = 0; i < zerosCuratureDerivPrevious.length; i++) {
                        //     const zeroLoc = zerosCuratureDerivPrevious[i];
                        //     zerosPreviousCurve.push(zeroLoc);
                        //     console.log("estimated zero from previous iter location[ "+i+" ] = "+(zeroLoc + zerosVariations[i])+" variation = "+zerosVariations[i]);
                        //     zerosEstimated.push(zeroLoc + zerosVariations[i]);
                        // }
                        zerosPreviousCurve.push(1.0);
                        zerosEstimated.push(1.0);
                        for (let i = 1; i < zerosPreviousCurve.length; i++) {
                            const interval = (zerosPreviousCurve[i] - zerosPreviousCurve[i - 1]);
                            const intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
                            const intervalVariation = intervalEstimated - interval;
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
                const flattenedCPsplineInit = spline.flattenControlPointsArray();
                const flattenedCPsplineOptim = this.optimizedCurve.flattenControlPointsArray();
                const curvatureDerivativeVariationWrtCP = [];
                let variationCP = [];
                for (let i = 0; i < flattenedCPsplineInit.length; i++) {
                    variationCP.push(flattenedCPsplineOptim[i] - flattenedCPsplineInit[i]);
                }
                for (let i = 0; i < curvatureExtrema_gradients.length; i++) {
                    let gradient = 0.0;
                    for (let j = 0; j < curvatureExtrema_gradients[i].length; j++) {
                        gradient = gradient + curvatureExtrema_gradients[i][j] * variationCP[j];
                    }
                    curvatureDerivativeVariationWrtCP.push(gradient);
                }
                const zerosVariations = [];
                for (let i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
                    zerosVariations.push(-(curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientU[i]);
                }
                const zerosCurrentCurve = [0.0];
                const zerosEstimated = [0.0];
                const nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
                console.log("estimation of zeros locations from current curve");
                for (let i = 0; i < nbEvents; i++) {
                    if (this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                        const zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                        zerosCurrentCurve.push(zeroLoc);
                        console.log("estimated zero location[ " + i + " ] = " + (zeroLoc + zerosVariations[i]) + " variation = " + zerosVariations[i]);
                        zerosEstimated.push(zeroLoc + zerosVariations[i]);
                    }
                }
                zerosCurrentCurve.push(1.0);
                zerosEstimated.push(1.0);
                for (let i = 1; i < zerosCurrentCurve.length; i++) {
                    const interval = (zerosCurrentCurve[i] - zerosCurrentCurve[i - 1]);
                    const intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
                    const intervalVariation = intervalEstimated - interval;
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
                const seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
                seqComparator.locateNeiboringEvents();
                this.curveShapeSpaceNavigator.eventStateAtCrvExtremities.monitorEventInsideCurve(seqComparator);
                if (seqComparator.neighboringEvents.length > 0) {
                    console.log("Nb neighboring events identified = " + seqComparator.neighboringEvents.length);
                }
                if (seqComparator.neighboringEvents.length > 0 && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                    const filteredSeqComparator = seqComparator.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
                    if (filteredSeqComparator.neighboringEvents.length === 1) {
                        if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.configureBoundaryEnforcer(filteredSeqComparator);
                            this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
                            this._curveAnalyserCurrentCurve.updateCurrent();
                            this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                            this.navigationCurveModel.setTargetCurve();
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                            try {
                                let curveModelOptimized1 = new CurveModel_1.CurveModel();
                                if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                                    let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                    if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                        && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                        if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                            curveModelOptimized1.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                        }
                                    }
                                }
                                const diffEvExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized1.spline);
                                const seqComparatorWithConstraintsAtExtremities = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor.sequenceOfDifferentialEvents);
                                seqComparatorWithConstraintsAtExtremities.locateNeiboringEvents();
                                const filteredSeqComparatorWithConstraints = seqComparatorWithConstraintsAtExtremities.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
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
                        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                        error.logMessage();
                    }
                }
                else if (this.navigationCurveModel.seqDiffEventsCurrentCurve.length() === this.navigationCurveModel.seqDiffEventsOptimizedCurve.length()
                    && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                    const nbInflectionsCurrrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbInflections();
                    const nbInflectionsOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbInflections();
                    const nbCurvExtCurrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbCurvatureExtrema();
                    const nbCurvExtOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbCurvatureExtrema();
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
                let curveModelOptimized = new CurveModel_1.CurveModel();
                curveModelOptimized.setSpline(this.currentCurve);
                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                this.optimizedCurve = curveModelOptimized.spline;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.OCurveNavigationThroughSimplerShapeSpaces = OCurveNavigationThroughSimplerShapeSpaces;
class OCurveNavigationStrictlyInsideShapeSpace extends OpenCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        this.curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationStrictlyInsideShapeSpace() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }
    navigate(selectedControlPoint, x, y) {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d_1.Vector2d(x, y));
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        let spline = new BSplineR1toR2_1.BSplineR1toR2();
        this._transitionEvents.clear();
        this._currentNeighboringEvents = [];
        this.navigationCurveModel.adjacentShapeSpaceCurve = undefined;
        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            spline = this.currentCurve.clone();
            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.clearIteratedCurves();
        }
        try {
            let status = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive())
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.deactivate();
            }
            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            let curveModelOptimized = new CurveModel_1.CurveModel();
            if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE || status === Optimizer_1.OptimizerReturnStatus.MAX_NB_ITER_REACHED) {
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
            const diffEvExtractorC = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.currentCurve);
            const diffEvExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.optimizedCurve);
            console.log("curveAnalyzer Opt" + diffEvExtractor.curvatureExtremaParametricLocations + " Cur = " + diffEvExtractorC.curvatureExtremaParametricLocations);
            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            console.log("Nb EVENTS opt = " + this.navigationCurveModel.seqDiffEventsOptimizedCurve.length());
            const seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
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
                    let updateDisplacement = false;
                    let updatedDisplacement = new Vector2d_1.Vector2d(x, y);
                    const filteredSeqComparator = seqComparator.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
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
                                            let threshold = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                            let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                            let curveModelOptimized = new CurveModel_1.CurveModel();
                                            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                }
                                                else if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                    const closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                    if (closestCurveToShapeSpaceBoundary !== undefined) {
                                                        curveModelOptimized.setSpline(closestCurveToShapeSpaceBoundary);
                                                    }
                                                    else {
                                                        curveModelOptimized.setSpline(spline);
                                                    }
                                                }
                                            }
                                            const diffEvExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized.spline);
                                            const seqComparatorWithoutTransition = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor.sequenceOfDifferentialEvents);
                                            seqComparatorWithoutTransition.locateNeiboringEvents();
                                            const filteredSeqComparatorWithoutTransition = seqComparatorWithoutTransition.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                            if (filteredSeqComparatorWithoutTransition.neighboringEvents.length !== 0) {
                                                // need to modify constraint bounds to keep local extrema on the correct side of U axis
                                                console.log("Inconsistent sequence of events after correction. Need further update");
                                                this._currentNeighboringEvents.push(filteredSeqComparatorWithoutTransition.neighboringEvents[0]);
                                                if (this._transitionEvents.length() > 0) {
                                                    console.log(" couple of curvature extrema modified");
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.newEventExist();
                                                    const firstCorrectedCurveAnalyser = new CurveAnalyzer_1.OpenCurveAnalyzer(curveModelOptimized.spline, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                                                    const currentCurveAnalyzer = this._curveAnalyserCurrentCurve;
                                                    const diffEventsVariation1 = new DifferentialEventVariation_1.DiffrentialEventVariation(currentCurveAnalyzer, firstCorrectedCurveAnalyser);
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
                                                        let threshold = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                                        let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                                        let curveModelOptimized2 = new CurveModel_1.CurveModel();
                                                        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                            if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                                curveModelOptimized2.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                            }
                                                            else if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                                this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                                const closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                                if (closestCurveToShapeSpaceBoundary !== undefined) {
                                                                    curveModelOptimized2.setSpline(closestCurveToShapeSpaceBoundary);
                                                                }
                                                                else {
                                                                    curveModelOptimized2.setSpline(spline);
                                                                }
                                                            }
                                                        }
                                                        const diffEvExtractor1 = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveModelOptimized2.spline);
                                                        const seqComparatorWithoutTransition1 = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor1.sequenceOfDifferentialEvents);
                                                        seqComparatorWithoutTransition1.locateNeiboringEvents();
                                                        const filteredSeqComparatorWithoutTransition1 = seqComparatorWithoutTransition1.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                                        if (filteredSeqComparatorWithoutTransition1.neighboringEvents.length !== 0) {
                                                            console.log('correction not sufficient. need to iterate');
                                                        }
                                                        curveModelOptimized.setSpline(curveModelOptimized2.spline);
                                                    }
                                                    catch (e) {
                                                        console.error(e);
                                                    }
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                                    this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                                                    this.optimizedCurve = curveModelOptimized.spline;
                                                    this._curveAnalyserOptimizedCurve.updateOptimized();
                                                    this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.removeNewEvent();
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.resetNeighboringEvents();
                                                }
                                            }
                                            else {
                                                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                                                this.optimizedCurve = curveModelOptimized.spline;
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
                                    for (const neighboringEvents of filteredSeqComparator.neighboringEvents) {
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser1 = this._curveAnalyserCurrentCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = this._curveAnalyserOptimizedCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = filteredSeqComparator.neighboringEvents;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
                                        const closestCurveToShapeSpaceBoundary1 = this.closestCurveToShapeSpaceBoundary();
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
                                            let status = Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
                                            let threshold = CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD;
                                            if (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD) {
                                                while (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < threshold) {
                                                    threshold = threshold / 10;
                                                }
                                            }
                                            status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
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
                                            let curveModelOptimized = new CurveModel_1.CurveModel();
                                            if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
                                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
                                                if (status === Optimizer_1.OptimizerReturnStatus.SOLUTION_FOUND) {
                                                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                }
                                                else if (status === Optimizer_1.OptimizerReturnStatus.FIRST_ITERATION || status === Optimizer_1.OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE
                                                    || closestCurveToShapeSpaceBoundary1 === undefined) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                    curveModelOptimized.setSpline(spline);
                                                }
                                                else if (closestCurveToShapeSpaceBoundary1 !== undefined) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = curveModelOptimized.spline;
                                                    curveModelOptimized.setSpline(closestCurveToShapeSpaceBoundary1);
                                                }
                                            }
                                            this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                                            this.optimizedCurve = curveModelOptimized.spline;
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
    }
    closestCurveToShapeSpaceBoundary() {
        let index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
        //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
        if (this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            let extremumValue = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValue;
            const iteratedCurves = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.iteratedCurves;
            for (let iCurve = 0; iCurve < iteratedCurves.length; iCurve++) {
                let iteratedCurveAnalyser = new CurveAnalyzer_1.OpenCurveAnalyzer(iteratedCurves[iCurve], this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
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
    }
}
exports.OCurveNavigationStrictlyInsideShapeSpace = OCurveNavigationStrictlyInsideShapeSpace;
class ClosedCurveNavigationState extends NavigationState {
    constructor(navigationCurveModel) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if (this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessage();
            this.currentCurve = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if (!this.navigationCurveModel.shapeNavigableCurve) {
            let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessage();
        }
    }
    setNavigationCurveModel(navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
    }
    setNavigationStrictlyInsideShapeSpace() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setNavigationThroughSimplerShapeSpaces() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setNavigationWithoutShapeSpaceMonitoring() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessage();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }
    setCurrentCurve(curve) {
        this.currentCurve = curve.clone();
    }
}
exports.ClosedCurveNavigationState = ClosedCurveNavigationState;
class CCurveNavigationWithoutShapeSpaceMonitoring extends ClosedCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationWithoutShapeSpaceMonitoring() {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }
    navigate(selectedControlPoint, x, y) {
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
    }
}
exports.CCurveNavigationWithoutShapeSpaceMonitoring = CCurveNavigationWithoutShapeSpaceMonitoring;
class CCurveNavigationThroughSimplerShapeSpaces extends ClosedCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationThroughSimplerShapeSpaces() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        // pb etat des contraintes incorrect: un seul pt alors que etat: 2 pts ancres
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }
    navigate(selectedControlPoint, x, y) {
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
            const seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch (e) {
        }
    }
}
exports.CCurveNavigationThroughSimplerShapeSpaces = CCurveNavigationThroughSimplerShapeSpaces;
class CCurveNavigationStrictlyInsideShapeSpace extends ClosedCurveNavigationState {
    constructor(navigationCurveModel) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if (curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new CurveAnalyzer_1.ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }
    get curveAnalyserCurrentCurve() {
        return this._curveAnalyserCurrentCurve;
    }
    get curveAnalyserOptimizedCurve() {
        return this._curveAnalyserOptimizedCurve;
    }
    setNavigationStrictlyInsideShapeSpace() {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessage();
    }
    curveConstraintsMonitoring() {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }
    navigate(selectedControlPoint, x, y) {
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
            const seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch (e) {
        }
    }
}
exports.CCurveNavigationStrictlyInsideShapeSpace = CCurveNavigationStrictlyInsideShapeSpace;
