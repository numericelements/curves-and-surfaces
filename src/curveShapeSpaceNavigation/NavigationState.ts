import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER, 
        CurveShapeSpaceNavigator} from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents, RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { AbstractCurveAnalyzer, ClosedCurveAnalyzer, ClosedCurveDummyAnalyzer, OpenCurveAnalyzer, OPenCurveDummyAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { CurveModel } from "../newModels/CurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "./NavigationCurveModel";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint } from "./CurveConstraintStrategy";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { OptimizerReturnStatus } from "../mathematics/Optimizer";
import { CCurveShapeMonitoringStrategy, OCurveShapeMonitoringStrategy } from "../controllers/CurveShapeMonitoringStrategy";
import { NeighboringEvents, NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { OpenCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor";
import { DiffrentialEventVariation } from "../sequenceOfDifferentialEvents/DifferentialEventVariation";
import { OptProblemOPenBSplineR1toR2WithWeigthingFactors, OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities, OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints, OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace } from "../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2";
import { ExpensiveComputationResults } from "../bsplineOptimizationProblems/AbstractOptProblemBSplineR1toR2";
import { EventMgmtState } from "./ShapeSpaceDiffEventsStructure";
import { ORDER_CURVATURE_EXTREMUM } from "../sequenceOfDifferentialEvents/DifferentialEvent";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { splineRecomposition } from "../newBsplines/BernsteinDecompositionR1toR1";

export abstract class NavigationState {

    protected _navigationStateChange: boolean;
    protected _currentNeighboringEvents: Array<NeighboringEvents>;
    protected _transitionEvents: SequenceOfDifferentialEvents;

    constructor() {
        this._navigationStateChange = true;
        this._currentNeighboringEvents = [];
        this._transitionEvents =  new SequenceOfDifferentialEvents();
    }

    abstract setNavigationCurveModel(navigationCurveModel: NavigationCurveModel): void;

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

    abstract setNavigationStrictlyInsideShapeSpace(): void;

    abstract setNavigationThroughSimplerShapeSpaces(): void;

    abstract setNavigationWithoutShapeSpaceMonitoring(): void;

    abstract setCurrentCurve(curve: BSplineR1toR2Interface): void;

    abstract get curveAnalyserCurrentCurve(): CurveAnalyzerInterface;

    abstract get curveAnalyserOptimizedCurve(): CurveAnalyzerInterface;

    get navigationStateChange(): boolean {
        return this._navigationStateChange;
    }

    get transitionEvents(): SequenceOfDifferentialEvents {
        return this._transitionEvents;
    }

    get currentNeighboringEvents(): Array<NeighboringEvents> {
        return this._currentNeighboringEvents;
    }

    set navigationStateChange(navigationStateChange: boolean) {
        this._navigationStateChange = navigationStateChange;
    }

}

export abstract class OpenCurveNavigationState extends NavigationState{

    protected navigationCurveModel: OpenCurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected currentCurve: BSplineR1toR2;
    protected optimizedCurve: BSplineR1toR2;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if(this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessageToConsole();
            this.currentCurve = new BSplineR1toR2;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if(!this.navigationCurveModel.shapeNavigableCurve) {
            const warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setNavigationCurveModel(navigationCurveModel: OpenCurveShapeSpaceNavigator): void {
        this.navigationCurveModel = navigationCurveModel;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setCurrentCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve.clone();
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class OCurveNavigationWithoutShapeSpaceMonitoring extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OPenCurveDummyAnalyzer;
    private _curveAnalyserOptimizedCurve: OPenCurveDummyAnalyzer;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve =this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OPenCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OPenCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }

    get curveAnalyserCurrentCurve(): OPenCurveDummyAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OPenCurveDummyAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
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

export class OCurveNavigationThroughSimplerShapeSpaces extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: OpenCurveAnalyzer;
    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        this.curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }

    get curveAnalyserCurrentCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        console.log("navigationCurveModel current = "+JSON.stringify(this.navigationCurveModel.currentCurve.controlPoints))
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        let spline = new BSplineR1toR2();

        let curvatureExtrema_gradients: number[][] = [];
        let inflection_gradients: number[][] = [];
        let curvatureDerivative_gradientU = [];
        if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
            spline = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline.clone();

            let curvatureSecondDerivative;
            curvatureSecondDerivative = this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.derivative();
            const nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
            // let e: ExpensiveComputationResults = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.initExpansiveComputations();
            // e = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.expensiveComputation(spline);
            // const gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(
            //     e, this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            const gradient_curvatureExtrema = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.compute_curvatureExtremaConstraints_gradient(
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.curvatureExtremaConstraintsSign, []);
            console.log("spline current = "+JSON.stringify(spline.controlPoints))
                for( let i = 0; i < nbEvents; i++) {
                if(this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === ORDER_CURVATURE_EXTREMUM) {
                    const zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                    console.log("zero location[ "+i+" ] = "+zeroLoc);
                    curvatureDerivative_gradientU.push(curvatureSecondDerivative.evaluate(zeroLoc));

                    if(gradient_curvatureExtrema.shape[0] !== this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                        console.log('inconsistent sizes of control polygons !!')
                    }
                    const curvatureExtrema_gradientperCPComponent = [];
                    for(let k = 0; k < gradient_curvatureExtrema.shape[1]; k++) {
                        let gradient = [];
                        for(let j = 0; j < gradient_curvatureExtrema.shape[0]; j++) {
                            gradient.push(gradient_curvatureExtrema.get(j ,k));
                        }
                        const spline = new BSplineR1toR1(gradient, this.navigationCurveModel.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots);
                        curvatureExtrema_gradientperCPComponent.push(spline.evaluate(zeroLoc));
                    }
                    curvatureExtrema_gradients.push(curvatureExtrema_gradientperCPComponent);
                }
            }

        }
        try {
            let status: OptimizerReturnStatus = OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.init(spline);
                status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // const status: OptimizerReturnStatus = this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            if(status === OptimizerReturnStatus.SOLUTION_FOUND) {
                let curveModelOptimized = new CurveModel();
                if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.previousSpline instanceof BSplineR1toR2
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                    if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline !== this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.previousSpline) {
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
                        for(let i = 1; i < zerosPreviousCurve.length; i++) {
                            const interval = (zerosPreviousCurve[i] - zerosPreviousCurve[i - 1]);
                            const intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
                            const intervalVariation = intervalEstimated - interval;
                            if(intervalEstimated < 0.0) console.log("estimated interval[ "+i+" ] with zeros crossing");
                            if(intervalEstimated > interval) console.log("interval[ "+i+" ]"+" shrinks: "+intervalVariation);
                            if(intervalEstimated < interval) console.log("interval[ "+i+" ]"+" expands: "+intervalVariation);
                        }
                    }
                }
                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                this.optimizedCurve = curveModelOptimized.spline;

                const flattenedCPsplineInit = spline.flattenControlPointsArray();
                const flattenedCPsplineOptim = this.optimizedCurve.flattenControlPointsArray();
                const curvatureDerivativeVariationWrtCP = [];
                let variationCP = [];
                for(let i = 0; i < flattenedCPsplineInit.length; i ++) {
                    variationCP.push(flattenedCPsplineOptim[i] - flattenedCPsplineInit[i]);
                }
                for(let i = 0; i < curvatureExtrema_gradients.length; i++) {
                    let gradient = 0.0;
                    for(let j = 0; j < curvatureExtrema_gradients[i].length; j ++) {
                        gradient = gradient + curvatureExtrema_gradients[i][j] * variationCP[j];
                    }
                    curvatureDerivativeVariationWrtCP.push(gradient);
                }
                const zerosVariations = [];
                for(let i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
                    zerosVariations.push(- (curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientU[i]);
                }
                const zerosCurrentCurve = [0.0];
                const zerosEstimated = [0.0];
                const nbEvents = this.navigationCurveModel.seqDiffEventsCurrentCurve.length();
                console.log("estimation of zeros locations from current curve");
                for( let i = 0; i < nbEvents; i++) {
                    if(this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).order === ORDER_CURVATURE_EXTREMUM) {
                        const zeroLoc = this.navigationCurveModel.seqDiffEventsCurrentCurve.eventAt(i).location;
                        zerosCurrentCurve.push(zeroLoc);
                        console.log("estimated zero location[ "+i+" ] = "+(zeroLoc + zerosVariations[i])+" variation = "+zerosVariations[i]);
                        zerosEstimated.push(zeroLoc + zerosVariations[i]);
                    }
                }
                zerosCurrentCurve.push(1.0);
                zerosEstimated.push(1.0);
                for(let i = 1; i < zerosCurrentCurve.length; i++) {
                    const interval = (zerosCurrentCurve[i] - zerosCurrentCurve[i - 1]);
                    const intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
                    const intervalVariation = intervalEstimated - interval;
                    if(intervalEstimated < 0.0) console.log("estimated interval[ "+i+" ] with zeros crossing");
                    if(intervalEstimated > interval) console.log("interval[ "+i+" ]"+" shrinks: "+intervalVariation);
                    if(intervalEstimated < interval) console.log("interval[ "+i+" ]"+" expands: "+intervalVariation);
                }


                this._curveAnalyserOptimizedCurve.updateOptimized();
                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
                const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
                seqComparator.locateNeiboringEvents();
                this.curveShapeSpaceNavigator.eventStateAtCrvExtremities.monitorEventInsideCurve(seqComparator);
                if(seqComparator.neighboringEvents.length > 0) {
                    console.log("Nb neighboring events identified = "+seqComparator.neighboringEvents.length);
                }
                if(seqComparator.neighboringEvents.length > 0 && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === EventMgmtState.Active) {
                    const filteredSeqComparator = seqComparator.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
                    if(filteredSeqComparator.neighboringEvents.length === 1) {
                        if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities) {
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.configureBoundaryEnforcer(filteredSeqComparator);
                            this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
                            this._curveAnalyserCurrentCurve.updateCurrent();
                            this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                            this.navigationCurveModel.setTargetCurve();
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                            try {
                                let curveModelOptimized1 = new CurveModel();
                                if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy) {
                                    let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                    if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                                        && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2) {
                                        if(status === OptimizerReturnStatus.SOLUTION_FOUND) {
                                            curveModelOptimized1.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                        }
                                    }
                                }
                                const diffEvExtractor = new OpenCurveDifferentialEventsExtractor(curveModelOptimized1.spline);
                                const seqComparatorWithConstraintsAtExtremities = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor.sequenceOfDifferentialEvents);
                                seqComparatorWithConstraintsAtExtremities.locateNeiboringEvents();
                                const filteredSeqComparatorWithConstraints = seqComparatorWithConstraintsAtExtremities.filterOutneighboringEventsNestedShapeSpacesNavigation(this.curveShapeSpaceNavigator);
                                if(seqComparatorWithConstraintsAtExtremities.neighboringEvents.length === seqComparator.neighboringEvents.length
                                    && filteredSeqComparatorWithConstraints.neighboringEvents.length === 0) {
                                    console.log(" No match of events after applying constraints at extremities")
                                }
                                this.navigationCurveModel.optimizedCurve = curveModelOptimized1.spline;
                                this.optimizedCurve = curveModelOptimized1.spline;
                            } catch(e) {
                                console.error(e);
                            }
                        }
                    } else if(filteredSeqComparator.neighboringEvents.length > 1) {
                        const error = new ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                        error.logMessageToConsole();
                    }
                } else if(this.navigationCurveModel.seqDiffEventsCurrentCurve.length() === this.navigationCurveModel.seqDiffEventsOptimizedCurve.length()
                    && this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === EventMgmtState.Active) {
                    const nbInflectionsCurrrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbInflections()
                    const nbInflectionsOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbInflections()
                    const nbCurvExtCurrent = this.navigationCurveModel.seqDiffEventsCurrentCurve.nbCurvatureExtrema()
                    const nbCurvExtOpt = this.navigationCurveModel.seqDiffEventsOptimizedCurve.nbCurvatureExtrema()
                    console.log("There may be two different events evolving simultaneously nbICur = " + nbInflectionsCurrrent + " nbIOpt = " + nbInflectionsOpt + " nbCECur = " + nbCurvExtCurrent + " nbCEOpt = " + nbCurvExtOpt)
                }
                this.curveConstraintsMonitoring();
                if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                    && (this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOPenBSplineR1toR2WithWeigthingFactors
                    || this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints)) {
                    
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                }
            } else {
                let curveModelOptimized = new CurveModel();
                curveModelOptimized.setSpline(this.currentCurve);
                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                this.optimizedCurve = curveModelOptimized.spline;
            }
        }
        catch(e)
        {
            console.error(e);
        }
    }
}

export class OCurveNavigationStrictlyInsideShapeSpace extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: OpenCurveAnalyzer;
    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        this.curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            this.curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);

    }

    get curveAnalyserCurrentCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this._curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.curveAnalyserCurrentCurve = this._curveAnalyserCurrentCurve;
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        let spline = new BSplineR1toR2();
        this._transitionEvents.clear();
        this._currentNeighboringEvents = [];
        this.navigationCurveModel.adjacentShapeSpaceCurve = undefined;
        if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                spline = this.currentCurve.clone();
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.clearIteratedCurves();
            }
        try {
            let status: OptimizerReturnStatus = OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
            if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive())
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.deactivate();
            }
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy) {
                status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            let curveModelOptimized = new CurveModel();
            if(status === OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE || status === OptimizerReturnStatus.MAX_NB_ITER_REACHED) {
                console.log('no solution found from the current curve')
            }
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2) {
                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
            }
            this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
            // console.log(" spline"+curveModelOptimized.spline.controlPoints);
            this.optimizedCurve = curveModelOptimized.spline;
            this._curveAnalyserOptimizedCurve.updateOptimized();
            const diffEvExtractorC = new OpenCurveDifferentialEventsExtractor(this.currentCurve);
            const diffEvExtractor = new OpenCurveDifferentialEventsExtractor(this.optimizedCurve);
            console.log("curveAnalyzer Opt"+diffEvExtractor.curvatureExtremaParametricLocations+" Cur = "+diffEvExtractorC.curvatureExtremaParametricLocations)
            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            console.log("Nb EVENTS opt = "+this.navigationCurveModel.seqDiffEventsOptimizedCurve.length());
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
           if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.curvatureDerivativeCPOpt = diffEvExtractor.curvatureDerivativeNumerator.controlPoints;
                if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.hasTransitionsOfEvents()) {
                    seqComparator.removeAllNeighboringEvents(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.neighboringEvents);
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                }
            }
            // console.log(" Nb of neighboring events after has Transition = "+seqComparator.neighboringEvents.length)
            if(seqComparator.neighboringEvents.length > 0) {
                if(seqComparator.neighboringEvents[0].type === NeighboringEventsType.moreThanOneEvent) {
                    console.log('More than one event to process. Not yet available')
                    this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve.clone();
                    this.optimizedCurve = this.currentCurve.clone();
                    this._curveAnalyserOptimizedCurve.updateOptimized();
                    this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                    this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
                    // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                    //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
                    //     this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                    // }
                    if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                        && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
                    }
                } else {
                    let updateDisplacement = false;
                    let updatedDisplacement = new Vector2d(x, y);
                    const filteredSeqComparator = seqComparator.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                    if(filteredSeqComparator.neighboringEvents.length > 0) {
                        if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                            // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.activate();
                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.configureBoundaryEnforcer(filteredSeqComparator);
                        }
                        // console.log(" Nb of neighboring events = "+filteredSeqComparator.neighboringEvents.length+ " seq current length "+this.navigationCurveModel.seqDiffEventsCurrentCurve.sequence.length+ " seq opt length "+this.navigationCurveModel.seqDiffEventsOptimizedCurve.sequence.length);
                        if(this._transitionEvents.length() > 0) updateDisplacement = true;
                        this._currentNeighboringEvents = filteredSeqComparator.neighboringEvents;
                        if(filteredSeqComparator.neighboringEvents.length > 1) {
                            console.log(" Nb of neighboring events2 = "+filteredSeqComparator.neighboringEvents.length+ " seq current length "+this.navigationCurveModel.seqDiffEventsCurrentCurve.sequence.length+ " seq opt length "+this.navigationCurveModel.seqDiffEventsOptimizedCurve.sequence.length);
                        }
                    }
                    if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                        if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                            // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                            //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
                            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
        
                                if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isTransitionAtExtremity()) {
                                    if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isCurvatureExtTransitionAtExtremity()) {
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
                                            let threshold = CONVERGENCE_THRESHOLD;
                                            let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                            let curveModelOptimized = new CurveModel();
                                            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2) {
                                                if(status === OptimizerReturnStatus.SOLUTION_FOUND) {
                                                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                } else if(status === OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                    const closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                    if(closestCurveToShapeSpaceBoundary !== undefined) {
                                                        curveModelOptimized.setSpline(closestCurveToShapeSpaceBoundary);
                                                    } else {
                                                        curveModelOptimized.setSpline(spline);
                                                    }
                                                }
                                            }
                                            const diffEvExtractor = new OpenCurveDifferentialEventsExtractor(curveModelOptimized.spline);
                                            const seqComparatorWithoutTransition = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor.sequenceOfDifferentialEvents);
                                            seqComparatorWithoutTransition.locateNeiboringEvents();
                                            const filteredSeqComparatorWithoutTransition = seqComparatorWithoutTransition.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                            if(filteredSeqComparatorWithoutTransition.neighboringEvents.length !== 0) {
                                                // need to modify constraint bounds to keep local extrema on the correct side of U axis
                                                console.log("Inconsistent sequence of events after correction. Need further update")
                                                this._currentNeighboringEvents.push(filteredSeqComparatorWithoutTransition.neighboringEvents[0]);
                                                if(this._transitionEvents.length() > 0) {
                                                    console.log(" couple of curvature extrema modified")
                                                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.newEventExist();
                                                    const firstCorrectedCurveAnalyser = new OpenCurveAnalyzer(curveModelOptimized.spline, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                                                    const currentCurveAnalyzer = this._curveAnalyserCurrentCurve;
                                                    const diffEventsVariation1 = new DiffrentialEventVariation(currentCurveAnalyzer, firstCorrectedCurveAnalyser);
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
                                                        let threshold = CONVERGENCE_THRESHOLD;
                                                        let status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                                                        let curveModelOptimized2 = new CurveModel();
                                                        if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                                                            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2) {
                                                            if(status === OptimizerReturnStatus.SOLUTION_FOUND) {
                                                                curveModelOptimized2.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                            } else if(status === OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE) {
                                                                this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                                const closestCurveToShapeSpaceBoundary = this.closestCurveToShapeSpaceBoundary();
                                                                if(closestCurveToShapeSpaceBoundary !== undefined) {
                                                                    curveModelOptimized2.setSpline(closestCurveToShapeSpaceBoundary);
                                                                } else {
                                                                    curveModelOptimized2.setSpline(spline);
                                                                }
                                                            }
                                                        }
                                                        const diffEvExtractor1 = new OpenCurveDifferentialEventsExtractor(curveModelOptimized2.spline);
                                                        const seqComparatorWithoutTransition1 = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, diffEvExtractor1.sequenceOfDifferentialEvents);
                                                        seqComparatorWithoutTransition1.locateNeiboringEvents();
                                                        const filteredSeqComparatorWithoutTransition1 = seqComparatorWithoutTransition1.filterOutneighboringEvents(this.curveShapeSpaceNavigator);
                                                        if(filteredSeqComparatorWithoutTransition1.neighboringEvents.length !== 0) {
                                                            console.log('correction not sufficient. need to iterate')
                                                        }
                                                        curveModelOptimized.setSpline(curveModelOptimized2.spline);
                                                    } catch(e) {
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
                                            } else {
                                                this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
                                                this.optimizedCurve = curveModelOptimized.spline;
                                                this._curveAnalyserOptimizedCurve.updateOptimized();
                                                this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                            }
                                        } catch(e) {
                                            console.error(e);
                                        }
        
                                    }
        
                                }
                                if(!this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isTransitionAtExtremity()) {
                                    console.log("Couple neighboring events Curv Ex or Inflections")

                                    for(const neighboringEvents of filteredSeqComparator.neighboringEvents) {
        
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser1 = this._curveAnalyserCurrentCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.curveAnalyser2 = this._curveAnalyserOptimizedCurve;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.neighboringEvents = filteredSeqComparator.neighboringEvents;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.variationDifferentialEvents();
            
                                        const closestCurveToShapeSpaceBoundary1 = this.closestCurveToShapeSpaceBoundary();
                                        if(updateDisplacement && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.iteratedCurves.length > 0) {
                                            updatedDisplacement = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateCPDisplacement(this.navigationCurveModel.currentCurve, selectedControlPoint, x, y);
                                        }
                                        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, updatedDisplacement);
                                        this._curveAnalyserCurrentCurve.updateCurrent();
                                        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
                                        this.navigationCurveModel.setTargetCurve();
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = true;
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(spline);
                                        this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.updateConstraintBound = false;
                                        if(!updateDisplacement) {
                                            // this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.cancelEvent();
                                            this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.clearVariation();
                                        }
                                        try {
                                            let status: OptimizerReturnStatus = OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
                                            let threshold = CONVERGENCE_THRESHOLD;
                                            if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < CONVERGENCE_THRESHOLD) {
                                                while(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.f0 < threshold) {
                                                    threshold = threshold / 10;
                                                }
                                            }
                                            status = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(threshold, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
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
            
                                            let curveModelOptimized = new CurveModel();
                                            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                                                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline instanceof BSplineR1toR2) {
                                                if(status === OptimizerReturnStatus.SOLUTION_FOUND) {
                                                    curveModelOptimized.setSpline(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline);
                                                } else if(status === OptimizerReturnStatus.FIRST_ITERATION || status === OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE
                                                    || closestCurveToShapeSpaceBoundary1 === undefined) {
                                                    this.navigationCurveModel.adjacentShapeSpaceCurve = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
                                                    curveModelOptimized.setSpline(spline);
                                                } else if(closestCurveToShapeSpaceBoundary1 !== undefined) {
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
                                        catch(e)
                                        {
                                            console.error(e);
                                            this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve;
                                            this.optimizedCurve = this.currentCurve.clone();
                                            this._curveAnalyserOptimizedCurve.updateOptimized();
                                            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
                                        }
                                        if(updateDisplacement) {
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
        catch(e)
        {
            console.error(e);
            console.log('error in optimizer')
            this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.currentCurve.clone();
            this.optimizedCurve = this.currentCurve.clone();
            this._curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.curveAnalyserOptimizedCurve = this._curveAnalyserOptimizedCurve;
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
            //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
                && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.update(this.currentCurve);
            }
        }
    }

    closestCurveToShapeSpaceBoundary(): BSplineR1toR2 | undefined {
        let index = RETURN_ERROR_CODE;
        // if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
        //     && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
        if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy
            && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {

            let extremumValue = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValue;
            const iteratedCurves = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.iteratedCurves;
            for(let iCurve = 0; iCurve < iteratedCurves.length; iCurve++) {
                let iteratedCurveAnalyser = new OpenCurveAnalyzer(iteratedCurves[iCurve], this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.updateExtremumValueOptimized(iteratedCurveAnalyser.curvatureDerivativeNumerator);
                if(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValue *
                    this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt > 0.0
                    && this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumLocationOpt !== RETURN_ERROR_CODE) {
                    if(Math.abs(extremumValue) > Math.abs(this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt)) {
                        extremumValue = this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.diffEventsVariation.extremumValueOpt;
                        index = iCurve;
                    }
                }
            }
            return iteratedCurves[index];
        }
    }
}

export abstract class ClosedCurveNavigationState extends NavigationState{

    protected navigationCurveModel: ClosedCurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected currentCurve: PeriodicBSplineR1toR2;
    protected optimizedCurve: PeriodicBSplineR1toR2;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if(this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessageToConsole();
            this.currentCurve = new PeriodicBSplineR1toR2;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if(!this.navigationCurveModel.shapeNavigableCurve) {
            let warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setNavigationCurveModel(navigationCurveModel: ClosedCurveShapeSpaceNavigator): void {
        this.navigationCurveModel = navigationCurveModel;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setCurrentCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve.clone();
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class CCurveNavigationWithoutShapeSpaceMonitoring extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveDummyAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveDummyAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveDummyAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveDummyAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
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

export class CCurveNavigationThroughSimplerShapeSpaces extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        // pb etat des contraintes incorrect: un seul pt alors que etat: 2 pts ancres
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        try {
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // requires optimization process for periodic B-Splines
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.optimizedCurve =  this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
            }
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }

}

export class CCurveNavigationStrictlyInsideShapeSpace extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.updateCurrent();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        try {
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            }
            // this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            if(this.navigationCurveModel.curveShapeMonitoringStrategy instanceof CCurveShapeMonitoringStrategy) {
                this.navigationCurveModel.optimizedCurve =  this.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.spline;
            }
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.updateOptimized();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }
}