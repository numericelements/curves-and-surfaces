import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { ActiveControl, OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { CurveControlStrategyInterface } from "../controllers/CurveControlStrategyInterface";
import { DummyStrategy } from "../controllers/DummyStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Optimizer } from "../mathematics/Optimizer";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModel } from "../newModels/CurveModel";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEvents } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDescriptor";
import { ActiveExtremaLocationControl, ActiveInflectionLocationControl, CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER, MAX_TRUST_REGION_RADIUS } from "./CurveShapeSpaceNavigator";
import { CCurveNavigationWithoutShapeSpaceMonitoring, NavigationState, OCurveNavigationWithoutShapeSpaceMonitoring } from "./NavigationState";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";


export abstract class NavigationCurveModel {

    protected readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    protected readonly _shapeNavigableCurve: ShapeNavigableCurve;
    protected abstract _navigationState: NavigationState;
    protected _shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    protected abstract _curveControl: CurveControlStrategyInterface;
    protected abstract _currentCurve: BSplineR1toR2Interface;
    protected abstract _optimizedCurve: BSplineR1toR2Interface;
    protected abstract _targetCurve: BSplineR1toR2Interface;
    protected abstract _displacementCurrentCurveControlPolygon: Vector2d[];
    // protected abstract _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2;
    protected readonly controlOfInflections: boolean;
    protected readonly controlOfCurvatureExtrema: boolean;
    protected readonly sliding: boolean;
    protected _activeExtremaLocationControl: ActiveExtremaLocationControl;
    protected _activeInflectionLocationControl: ActiveInflectionLocationControl;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._shapeSpaceDiffEventsConfigurator = this._shapeSpaceDiffEventsStructure.shapeSpaceDiffEventsConfigurator;
        this.controlOfInflections = this._shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.sliding = this._curveShapeSpaceNavigator.sliding;
        this._shapeNavigableCurve = curveShapeSpaceNavigator.shapeNavigableCurve;
        this._activeExtremaLocationControl = ActiveExtremaLocationControl.none;
        this._activeInflectionLocationControl = ActiveInflectionLocationControl.none;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get navigationState(): NavigationState {
        return this._navigationState;
    }

    get curveControl(): CurveControlStrategyInterface {
        return this._curveControl;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure {
        return this._shapeSpaceDiffEventsStructure;
    }

    get shapeSpaceDiffEventsConfigurator(): ShapeSpaceDiffEventsConfigurator {
        return this._shapeSpaceDiffEventsConfigurator;
    }

    get activeExtremaLocationControl(): ActiveExtremaLocationControl {
        return this._activeExtremaLocationControl;
    }

    get activeInflectionLocationControl(): ActiveInflectionLocationControl {
        return this._activeInflectionLocationControl;
    }

    set navigationState(navigationState: NavigationState) {
        this._navigationState = navigationState;
    }

    set shapeSpaceDiffEventsConfigurator(shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator) {
        this._shapeSpaceDiffEventsConfigurator = shapeSpaceDiffEventsConfigurator;
    }

    set curveControl(curveControl: CurveControlStrategyInterface) {
        this._curveControl = curveControl;
    }

    abstract get currentCurve(): BSplineR1toR2Interface;

    abstract get optimizedCurve(): BSplineR1toR2Interface;

    abstract get displacementCurrentCurveControlPolygon(): Vector2d[];

    // abstract get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2;

    abstract set currentCurve(currentCurve: BSplineR1toR2Interface);

    abstract set optimizedCurve(optimizedCurve: BSplineR1toR2Interface);

    // abstract set optimizationProblem(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2);

    abstract navigateSpace(selectedControlPoint: number, x: number, y: number): void;

    abstract curveDisplacement(): void;

    abstract changeNavigationState(navigationState: NavigationState): void;

    abstract resetCurveToOptimize(): void;

}

export class OpenCurveShapeSpaceNavigator extends NavigationCurveModel{

    private curveCategory: CurveCategory;
    public curveModel: CurveModel;
    private _selectedControlPoint?: number;
    protected _currentCurve: BSplineR1toR2;
    private currentControlPolygon: Vector2d[];
    private locationSelectedCP: Vector2d;
    public seqDiffEventsCurrentCurve: SequenceOfDifferentialEvents;
    public curveAnalyserCurrentCurve: CurveAnalyzerInterface;
    protected _targetCurve: BSplineR1toR2;
    protected _displacementCurrentCurveControlPolygon: Vector2d[] = [];
    protected _optimizedCurve: BSplineR1toR2;
    public seqDiffEventsOptimizedCurve: SequenceOfDifferentialEvents;
    public curveAnalyserOptimizedCurve: CurveAnalyzerInterface;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private diffEvents: NeighboringEvents;
    // protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
    // public optimizer: Optimizer;
    private _optimizationProblemParam: OptimizationProblemCtrlParameters;
    protected _navigationState: NavigationState;
    // private _eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private _slidingEventsAtExtremities: SlidingEventsAtExtremities;
    protected _curveControl: CurveControlStrategyInterface;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);

        this.curveCategory = this._shapeNavigableCurve.curveCategory;
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this.curveModel = new CurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveControl = new NoSlidingStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);

        this._currentCurve = this.curveModel.spline;
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.locationSelectedCP = new Vector2d(0, 0);
        this._targetCurve = this.curveModel.spline;
        this._optimizedCurve = this._currentCurve.clone();
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector2d(0.0, 0.0)))

        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this._currentCurve);
        // this._eventMgmtAtCurveExtremities = new EventMgmtAtCurveExtremities();
        this._slidingEventsAtExtremities = new CurveAnalyzerEventsSlidingOutOfInterval();
        // JCL Setting up the navigation state requires having defined the shapeSpaceDiffEventsStructure and its shapeSpaceDiffEventsConfigurator
        // JCL as well as the CurveShapeSpaceDescriptor
        this._navigationState = new OCurveNavigationWithoutShapeSpaceMonitoring(this);
        this._curveShapeSpaceNavigator.navigationState = this._navigationState;
        // JCL requires the setting of the navigationState
        this.curveAnalyserCurrentCurve = this._navigationState.curveAnalyserCurrentCurve;
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = this._navigationState.curveAnalyserOptimizedCurve;
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        this.diffEvents = new NeighboringEvents();

        // this._optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone(), ActiveControl.curvatureExtrema);

        // this.optimizer = this.newOptimizer(this.optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();

        this.changeNavigationState(this._navigationState);
        console.log("end constructor curveShapeSpaceNavigator")
    }


    // set navigationParams(navigationParameters: ShapeSpaceDiffEventsStructure) {
    //     this._navigationParameters = navigationParameters;
    // }

    // set curveConstraints(curveConstraints: CurveConstraints) {
    //     this._curveConstraints = curveConstraints;
    // }

    // set optimizationProblem(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
    //     this._optimizationProblem = optimizationProblem;
    // }

    set optimizationProblemParam(optimPbParam: OptimizationProblemCtrlParameters) {
        this._optimizationProblemParam = optimPbParam;
    }

    set selectedControlPoint(cpIndex: number | undefined) {
        if(cpIndex !==  undefined) {
            this.selectedControlPoint = cpIndex;
        } else {
            const error =  new ErrorLog(this.constructor.name, 'set', 'the control point index must not be of type undefined.')
            error.logMessageToConsole();
        }
    }

    // set eventMgmtAtCurveExtremities(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
    //     this._eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    // }

    set optimizedCurve(aBSpline: BSplineR1toR2) {
        this._optimizedCurve = aBSpline.clone();
    }

    // set curveConstraintStrategy(curveConstraintStrategy: CurveConstraintInterface) {
    //     this._curveConstraintStrategy = curveConstraintStrategy;
    // }

    set currentCurve(curve: BSplineR1toR2) {
        this._currentCurve = curve.clone();
    }

    // get navigationParams(): ShapeSpaceDiffEventsStructure {
    //     return this._navigationParameters;
    // }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    get optimizationProblemParam(): OptimizationProblemCtrlParameters {
        return this._optimizationProblemParam;
    }

    get selectedControlPoint(): number | undefined {
        if(this._selectedControlPoint !== undefined) {
            return this._selectedControlPoint;
        } else {
            const error = new ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
            error.logMessageToConsole();
        }
    }

    // get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors {
    //     return this._optimizationProblem;
    // }

    // get eventMgmtAtCurveExtremities(): EventMgmtAtCurveExtremities {
    //     return this._eventMgmtAtCurveExtremities;
    // }

    get currentCurve(): BSplineR1toR2 {
        return this._currentCurve.clone();
    }

    get targetCurve(): BSplineR1toR2 {
        return this._targetCurve.clone();
    }

    get optimizedCurve(): BSplineR1toR2 {
        return this._optimizedCurve.clone();
    }

    get displacementCurrentCurveControlPolygon(): Vector2d[] {
        return this._displacementCurrentCurveControlPolygon;
    }

    get slidingEventsAtExtremities(): SlidingEventsAtExtremities {
        return this._slidingEventsAtExtremities;
    }

    changeNavigationState(state: NavigationState): void {
        this._navigationState = state;
        this.navigationState.setNavigationCurveModel(this);
    }

    navigateSpace(selectedControlPoint: number, x: number, y: number): void {
        // const message = new WarningLog(this.constructor.name, "navigateSpace", this.navigationState.constructor.name + " "
        // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
        // message.logMessageToConsole();
        this._selectedControlPoint = selectedControlPoint;
        this.navigationState.navigate(selectedControlPoint, x, y);
    }

    // initializeNavigationStep(): void {
    //     const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
    //     this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    // }

    updateCurrentCurve(newSelectedControlPoint: number, newDispSelctdCP: Vector2d): void {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    }

    setTargetCurve(): void {
        if(this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        } else {
            const error = new ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessageToConsole();
        }
        if(this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
                this.curveControl.optimizationProblem.setTargetSpline(this.targetCurve);
                // this.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    }

    resetCurveToOptimize(): void {
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this.curveModel = new CurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        if(this._curveControl instanceof NoSlidingStrategy) {
            this._curveControl = new NoSlidingStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else if(this._curveControl instanceof SlidingStrategy) {
            this.curveControl = new SlidingStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this._curveShapeSpaceNavigator);
        }
    }

    // updateOptimizerStatus(): void {
    //     if(this._navigationParameters.inflectionControl === false && this._navigationParameters.curvatureExtremaControl === false) this._optimizationProblemParam.optimizerStatus = false;
    //     if(this._navigationParameters.inflectionControl === true || this._navigationParameters.curvatureExtremaControl === true) this._optimizationProblemParam.optimizerStatus = true;
    // }

    curveDisplacement(): void {
        for(let i = 0; i < this.displacementCurrentCurveControlPolygon.length; i+=1) {
            this.displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    }

    // navigateUnderDevForTest(): void {
    //     this.curveAnalyserCurrentCurve.update();
    //     this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
    //     this.setTargetCurve();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    //     try {
    //         this.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
    //         this._optimizedCurve = this.optimizationProblem.spline.clone();
    //         this.curveDisplacement();
    //         this.curveAnalyserOptimizedCurve.update();
    //         this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    //         const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.seqDiffEventsCurrentCurve, this.seqDiffEventsOptimizedCurve);
    //         seqComparator.locateNeiboringEvents();
    //     }
    //     catch(e)
    //     {

    //     }
    // }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        //newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        //setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length-1] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length*2-1] = 10
    }
    
}

export class ClosedCurveShapeSpaceNavigator extends NavigationCurveModel{

    private curveCategory: CurveCategory;
    public curveModel: ClosedCurveModel;
    private _selectedControlPoint?: number;
    private locationSelectedCP: Vector2d;
    protected _navigationState: NavigationState;
    protected _currentCurve: PeriodicBSplineR1toR2;
    private currentControlPolygon: Vector2d[];
    protected _displacementCurrentCurveControlPolygon: Vector2d[] = [];
    protected _optimizedCurve: PeriodicBSplineR1toR2;
    protected _targetCurve: PeriodicBSplineR1toR2;
    public curveAnalyserCurrentCurve: CurveAnalyzerInterface;
    public curveAnalyserOptimizedCurve: CurveAnalyzerInterface;
    public seqDiffEventsCurrentCurve: SequenceOfDifferentialEvents;
    public seqDiffEventsOptimizedCurve: SequenceOfDifferentialEvents;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    protected _curveControl: CurveControlStrategyInterface;
    private _optimizationProblemParam: OptimizationProblemCtrlParameters;
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation;
    public optimizer: Optimizer;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.curveCategory = this._shapeNavigableCurve.curveCategory;
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this.curveModel = new ClosedCurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);

        this._currentCurve = this.curveModel.spline;
        this.currentControlPolygon = this.currentCurve.controlPoints.slice();
        this._selectedControlPoint = undefined;
        this.locationSelectedCP = new Vector2d(0, 0);
        this._targetCurve = this.curveModel.spline;
        this._optimizedCurve = this._currentCurve.clone();
        this.currentControlPolygon.forEach(() => this._displacementCurrentCurveControlPolygon.push(new Vector2d(0.0, 0.0)))
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this._currentCurve);
        this._navigationState = new CCurveNavigationWithoutShapeSpaceMonitoring(this);
        this._curveShapeSpaceNavigator.navigationState = this._navigationState;
        this.curveAnalyserCurrentCurve = this.navigationState.curveAnalyserCurrentCurve;
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = this.navigationState.curveAnalyserOptimizedCurve;
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;

        // JCL temporary setting before adapting the optimization problem setting to closed curves
        const dummyCurveModel = new CurveModel()
        this._optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(dummyCurveModel.spline, dummyCurveModel.spline);
        this.optimizer = this.newOptimizer(this._optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();
    }


    get currentCurve(): PeriodicBSplineR1toR2 {
        return this._currentCurve.clone();
    }

    get targetCurve(): PeriodicBSplineR1toR2 {
        return this._targetCurve.clone();
    }

    get optimizedCurve(): PeriodicBSplineR1toR2 {
        return this._optimizedCurve.clone();
    }

    get optimizationProblemParam(): OptimizationProblemCtrlParameters {
        return this._optimizationProblemParam;
    }

    get selectedControlPoint(): number | undefined {
        if(this._selectedControlPoint !== undefined) {
            return this._selectedControlPoint;
        } else {
            const error = new ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
            error.logMessageToConsole();
        }
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation {
        return this._optimizationProblem;
    }

    get displacementCurrentCurveControlPolygon(): Vector2d[] {
        return this._displacementCurrentCurveControlPolygon;
    }

    set currentCurve(curve: PeriodicBSplineR1toR2) {
        this._currentCurve = curve.clone();
    }

    set optimizedCurve(aBSpline: PeriodicBSplineR1toR2) {
        this._optimizedCurve = aBSpline.clone();
    }

    set optimizationProblem(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        this._optimizationProblem = optimizationProblem;
    }

    changeNavigationState(state: NavigationState): void {
        this._navigationState = state;
        this._navigationState.setNavigationCurveModel(this);
    }

    setTargetCurve(): void {
        if(this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        } else {
            const error = new ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessageToConsole();
        }
        if(this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
                // this.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    }

    resetCurveToOptimize(): void {
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this.curveModel = new ClosedCurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        //newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        //setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length-1] = 10
        optimizationProblem.weigthingFactors[this.currentControlPolygon.length*2-1] = 10
    }

    updateCurrentCurve(newSelectedControlPoint: number, newDispSelctdCP: Vector2d): void {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    }

    navigateSpace(selectedControlPoint: number, x: number, y: number): void {
        let message = new WarningLog(this.constructor.name, "navigateSpace", this._navigationState.constructor.name + " "
        + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
        // + this._curveWithGeomConstraints.curveCategory.constructor.name);
        message.logMessageToConsole();
        this._selectedControlPoint = selectedControlPoint;
        this._navigationState.navigate(selectedControlPoint, x, y);
    }

    curveDisplacement(): void {
        for(let i = 0; i < this._displacementCurrentCurveControlPolygon.length; i+=1) {
            this._displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    }
}