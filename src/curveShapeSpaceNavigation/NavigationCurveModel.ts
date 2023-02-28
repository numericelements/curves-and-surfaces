import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { CurveControlState, HandleCurvatureExtremaSlidingState, HandleInflectionsAndCurvatureExtremaNoSlidingState, HandleInflectionsAndCurvatureExtremaSlidingState, HandleInflectionsNoSlidingState, HandleInflectionsSlidingState, HandleNoDiffEventNoSlidingState, HandleNoDiffEventSlidingState } from "../controllers/CurveControlState";
import { CurveControlStrategyInterface } from "../controllers/CurveControlStrategyInterface";
import { CCurveShapeMonitoringStrategy, CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding, CurveShapeMonitoringStrategy, OCurveShapeMonitoringStrategy, OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding } from "../controllers/CurveShapeMonitoringStrategy";
import { DummyStrategy } from "../controllers/DummyStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEvents } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDescriptor";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { CCurveNavigationWithoutShapeSpaceMonitoring, NavigationState, OCurveNavigationWithoutShapeSpaceMonitoring } from "./NavigationState";
import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";


export abstract class NavigationCurveModel {

    protected readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    protected readonly _shapeNavigableCurve: ShapeNavigableCurve;
    protected abstract _curveModel: CurveModelInterface;
    protected abstract _navigationState: NavigationState;
    protected abstract _curveControl: CurveControlStrategyInterface;
    protected abstract _currentCurve: BSplineR1toR2Interface;
    protected abstract _optimizedCurve: BSplineR1toR2Interface;
    protected abstract _targetCurve: BSplineR1toR2Interface;
    protected abstract _displacementCurrentCurveControlPolygon: Vector2d[];
    protected readonly controlOfInflections: boolean;
    protected readonly controlOfCurvatureExtrema: boolean;
    protected readonly sliding: boolean;

    protected abstract _curveShapeMonitoringStrategy: CurveShapeMonitoringStrategy;
    protected _curveControlState: CurveControlState;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._curveControlState = this._curveShapeSpaceNavigator.curveControlState;

        this.controlOfInflections = this._shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.sliding = this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
        this._shapeNavigableCurve = curveShapeSpaceNavigator.shapeNavigableCurve;
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

    // get activeExtremaLocationControl(): ActiveExtremaLocationControl {
    //     return this._activeExtremaLocationControl;
    // }

    get curveShapeMonitoringStrategy(): CurveShapeMonitoringStrategy {
        return this._curveShapeMonitoringStrategy;
    }

    set navigationState(navigationState: NavigationState) {
        this._navigationState = navigationState;
    }

    set curveControl(curveControl: CurveControlStrategyInterface) {
        this._curveControl = curveControl;
    }

    get curveControlState() {
        return this._curveControlState;
    }

    set curveControlState(curveControlState: CurveControlState) {
        this._curveControlState = curveControlState;
    }

    set curveShapeMonitoringStrategy(curveShapeMonitoringStrategy: CurveShapeMonitoringStrategy) {
        this._curveShapeMonitoringStrategy = curveShapeMonitoringStrategy;
    }

    abstract get curveModel(): CurveModelInterface;

    abstract get currentCurve(): BSplineR1toR2Interface;

    abstract get optimizedCurve(): BSplineR1toR2Interface;

    abstract get displacementCurrentCurveControlPolygon(): Vector2d[];

    abstract set curveModel(curveModel: CurveModelInterface);

    abstract set currentCurve(currentCurve: BSplineR1toR2Interface);

    abstract set optimizedCurve(optimizedCurve: BSplineR1toR2Interface);

    abstract navigateSpace(selectedControlPoint: number, x: number, y: number): void;

    abstract curveDisplacement(): void;

    abstract changeNavigationState(navigationState: NavigationState): void;

    abstract resetCurveToOptimize(): void;

    changeCurveShapeMonitoring(strategy: CurveShapeMonitoringStrategy): void {
        this._curveShapeMonitoringStrategy = strategy;
    }

}

export class OpenCurveShapeSpaceNavigator extends NavigationCurveModel{

    protected _curveModel: CurveModel;
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
    private _optimizationProblemParam: OptimizationProblemCtrlParameters;
    protected _navigationState: NavigationState;
    // private _eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private _slidingEventsAtExtremities: SlidingEventsAtExtremities;
    protected _curveControl: CurveControlStrategyInterface;
    protected _curveShapeMonitoringStrategy: OCurveShapeMonitoringStrategy;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);

        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this._curveModel = new CurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveControl = new NoSlidingStrategy(this._curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);

        this._currentCurve = this.curveModel.spline;
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.locationSelectedCP = new Vector2d(0, 0);
        this._targetCurve = this.curveModel.spline;
        this._optimizedCurve = this._currentCurve.clone();
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector2d(0.0, 0.0)))
        this._curveShapeMonitoringStrategy = new OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this);
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

        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();

        this.changeNavigationState(this._navigationState);
        console.log("end constructor curveShapeSpaceNavigator")
    }

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

    set currentCurve(curve: BSplineR1toR2) {
        this._currentCurve = curve.clone();
    }

    set curveModel(curveModel: CurveModel) {
        this._curveModel = curveModel;
    }

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

    get curveModel(): CurveModel {
        return this._curveModel;
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
                this._curveShapeMonitoringStrategy.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    }

    resetCurveToOptimize(): void {
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this._curveModel = new CurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveShapeMonitoringStrategy.resetAfterCurveChange();

        if(this._curveControl instanceof NoSlidingStrategy) {
            this._curveControl = new NoSlidingStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else if(this._curveControl instanceof SlidingStrategy) {
            this.curveControl = new SlidingStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this._curveShapeSpaceNavigator);
        }
    }

    curveDisplacement(): void {
        for(let i = 0; i < this.displacementCurrentCurveControlPolygon.length; i+=1) {
            this.displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    }
}

export class ClosedCurveShapeSpaceNavigator extends NavigationCurveModel{

    protected _curveModel: ClosedCurveModel;
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

    protected _curveShapeMonitoringStrategy: CCurveShapeMonitoringStrategy;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this._curveModel = new ClosedCurveModel();
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
        this._curveShapeMonitoringStrategy = new CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this._currentCurve);
        this._navigationState = new CCurveNavigationWithoutShapeSpaceMonitoring(this);
        this._curveShapeSpaceNavigator.navigationState = this._navigationState;
        this.curveAnalyserCurrentCurve = this.navigationState.curveAnalyserCurrentCurve;
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = this.navigationState.curveAnalyserOptimizedCurve;
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;

        // JCL temporary setting before adapting the optimization problem setting to closed curves
        const dummyCurveModel = new CurveModel()
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

    get displacementCurrentCurveControlPolygon(): Vector2d[] {
        return this._displacementCurrentCurveControlPolygon;
    }

    get curveModel(): ClosedCurveModel {
        return this._curveModel;
    }

    set currentCurve(curve: PeriodicBSplineR1toR2) {
        this._currentCurve = curve.clone();
    }

    set optimizedCurve(aBSpline: PeriodicBSplineR1toR2) {
        this._optimizedCurve = aBSpline.clone();
    }

    set curveModel(curveModel: ClosedCurveModel) {
        this._curveModel = curveModel;
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
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        } else {
            this._curveModel = new ClosedCurveModel();
            const error = new ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessageToConsole();
        }
        this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
            this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
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
        // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
        + this._curveControlState.constructor.name);
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