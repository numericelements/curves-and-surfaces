import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { CurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Optimizer } from "../mathematics/Optimizer";
import { Vector_2d } from "../mathematics/Vector_2d";
import { CurveModel } from "../models/CurveModel";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEvents } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveConstraints } from "./CurveConstraints";
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDesccriptor";
import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";
import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveModels2D } from "../models/CurveModels2D";
import { NavigationState, NavigationWithoutShapeSpaceMonitoring, NavigationStrictlyInsideShapeSpace } from "./NavigationState";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint} from "./CurveConstraintStrategy";
import { ShapeSpaceDiffEvventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveCategory } from "../curveModeler/CurveCategory";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding, ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { EventMgmtAtCurveExtremities } from "../curveModeler/EventMgmtAtCurveExtremities";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

export class CurveShapeSpaceNavigator {

    private _curveModeler: CurveModeler;
    public curveCategory: CurveCategory;
    public curveModel: CurveModel;
    private _selectedControlPoint?: number;
    private _currentCurve: BSpline_R1_to_R2;
    private currentControlPolygon: Vector_2d[];
    private displacementSelctdCP: Vector_2d;
    public seqDiffEventsCurrentCurve: SequenceOfDifferentialEvents;
    public curveAnalyserCurrentCurve: CurveAnalyzer;
    private _targetCurve: BSpline_R1_to_R2;
    private _displacementCurrentCurveControlPolygon: Vector_2d[] = [];
    private _optimizedCurve: BSpline_R1_to_R2;
    public seqDiffEventsOptimizedCurve: SequenceOfDifferentialEvents;
    public curveAnalyserOptimizedCurve: CurveAnalyzer;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private diffEvents: NeighboringEvents;
    //private _navigationParameters: ShapeSpaceDiffEventsStructure;
    private _curveConstraints: CurveConstraints;
    public optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation;
    public optimizer: Optimizer;
    private _optimizationProblemParam: OptimizationProblemCtrlParameters;

    public navigationState: NavigationState;
    public shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    public shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEvventsConfigurator;
    private _curveConstraintProcessor: CurveConstraintProcessor;
    private _eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private _slidingEventsAtExtremities: SlidingEventsAtExtremities;

    constructor(curveModeler: CurveModeler) {
        this._curveModeler = curveModeler;
        this.curveCategory = this.curveModeler.curveCategory;
        this.curveModel = new CurveModel();
        this._currentCurve = this.curveModel.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.displacementSelctdCP = new Vector_2d(0, 0);
        this._targetCurve = this.curveModel.spline.clone();
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector_2d(0.0, 0.0)))
        this.navigationState = new NavigationWithoutShapeSpaceMonitoring(this);
        this.shapeSpaceDiffEventsConfigurator = new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding;
        this.shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure(this._curveModeler, this.shapeSpaceDiffEventsConfigurator);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this._currentCurve);
        this._eventMgmtAtCurveExtremities = new EventMgmtAtCurveExtremities();
        this._slidingEventsAtExtremities = new CurveAnalyzerEventsSlidingOutOfInterval();
        this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this, this.slidingEventsAtExtremities);
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this._optimizedCurve = this._currentCurve;
        this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this._optimizedCurve, this,  this.slidingEventsAtExtremities);
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        this.diffEvents = new NeighboringEvents();
        //this._navigationParameters = new ShapeSpaceDiffEventsStructure();
        this._curveConstraintProcessor = new CurveConstraintClampedFirstControlPoint(this);
        this._curveConstraints = new CurveConstraints(this._curveConstraintProcessor, this);
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.currentCurve.clone(), this.currentCurve.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();

        this.changeNavigationState(new NavigationWithoutShapeSpaceMonitoring(this));
        console.log("end constructor curveShapeSpaceNavigator")
    }

    // set navigationParams(navigationParameters: ShapeSpaceDiffEventsStructure) {
    //     this._navigationParameters = navigationParameters;
    // }

    set curveConstraints(curveConstraints: CurveConstraints) {
        this._curveConstraints = curveConstraints;
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

    set eventMgmtAtCurveExtremities(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        this._eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    }

    set optimizedCurve(aBSpline: BSpline_R1_to_R2) {
        this._optimizedCurve = aBSpline;
    }

    // get navigationParams(): ShapeSpaceDiffEventsStructure {
    //     return this._navigationParameters;
    // }

    get curveModeler(): CurveModeler {
        return this._curveModeler;
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    get curveConstraints(): CurveConstraints {
        return this._curveConstraints;
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

    get eventMgmtAtCurveExtremities(): EventMgmtAtCurveExtremities {
        return this._eventMgmtAtCurveExtremities;
    }

    get currentCurve(): BSpline_R1_to_R2 {
        return this._currentCurve;
    }

    get targetCurve(): BSpline_R1_to_R2 {
        return this._targetCurve;
    }

    get optimizedCurve(): BSpline_R1_to_R2 {
        return this._optimizedCurve;
    }

    get displacementCurrentCurveControlPolygon(): Vector_2d[] {
        return this._displacementCurrentCurveControlPolygon;
    }

    get slidingEventsAtExtremities(): SlidingEventsAtExtremities {
        return this._slidingEventsAtExtremities;
    }

    get curveConstraintProcessor(): CurveConstraintProcessor {
        return this._curveConstraintProcessor;
    }

    changeNavigationState(state: NavigationState): void {
        this.navigationState = state;
        this.navigationState.setCurveShapeSpaceNavigator(this);
    }

    changeCurveState(state: CurveConstraintProcessor): void {
        this._curveConstraintProcessor = state;
    }

    navigateSpace(selectedControlPoint: number, x: number, y: number): void {
        let message = new WarningLog(this.constructor.name, "navigateSpace", this.navigationState.constructor.name + " "
        + this.shapeSpaceDiffEventsConfigurator.constructor.name + " "
        + this._eventMgmtAtCurveExtremities.eventState.constructor.name + " "
        + this._curveConstraints.curveConstraintProcessor.constructor.name + " "
        + this._curveModeler.curveCategory.constructor.name);
        message.logMessageToConsole();
        this._selectedControlPoint = selectedControlPoint;
        this.navigationState.navigate(selectedControlPoint, x, y);
    }

    // initializeNavigationStep(): void {
    //     const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
    //     this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    // }

    updateCurrentCurve(newCurve: CurveModel, newSelectedControlPoint: number, newDispSelctdCP: Vector_2d): void {
        this.curveModel = newCurve;
        this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = newSelectedControlPoint;
        this.displacementSelctdCP = newDispSelctdCP;
    }

    setTargetCurve(): void {
        if(this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve;
            this._targetCurve.setControlPoint(this.selectedControlPoint, this.displacementSelctdCP);
        } else {
            const error = new ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessageToConsole();
        }
        this.optimizationProblem.setTargetSpline(this.targetCurve);
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

    navigateUnderDevForTest(): void {
        this.curveAnalyserCurrentCurve.update();
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.setTargetCurve();
        this._optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this._optimizedCurve = this.optimizationProblem.spline.clone();
            this.curveDisplacement();
            this.curveAnalyserOptimizedCurve.update();
            this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.seqDiffEventsCurrentCurve, this.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
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
}