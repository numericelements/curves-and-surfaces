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
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveCategory } from "../curveModeler/CurveCategory";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding, ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { EventMgmtAtCurveExtremities } from "../curveModeler/EventMgmtAtCurveExtremities";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { CurveControlStrategyInterface } from "../controllers/CurveControlStrategyInterface";
import { CurveControlState, HandleNoDiffEventNoSlidingState } from "../controllers/CurveControlState";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

/* JCL 2020/11/06 Add controls to monitor the location of the curvature extrema and inflection points */
export enum ActiveExtremaLocationControl {mergeExtrema, none, stopDeforming, extremumLeaving, extremumEntering}
export enum ActiveInflectionLocationControl {mergeExtremaAndInflection, none, stopDeforming}

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
    public shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    private _curveConstraintProcessor: CurveConstraintProcessor;
    private _eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private _slidingEventsAtExtremities: SlidingEventsAtExtremities;
    private curveControlState: CurveControlState;

    private _controlOfCurvatureExtrema: boolean;
    private _controlOfInflection: boolean;
    private _sliding: boolean;
    private _curveControl: CurveControlStrategyInterface;
    public activeExtremaLocationControl: ActiveExtremaLocationControl
    public activeInflectionLocationControl: ActiveInflectionLocationControl

    constructor(curveModeler: CurveModeler) {
        this._controlOfCurvatureExtrema = true;
        this._controlOfInflection = true;
        this._sliding = true;

        this._curveModeler = curveModeler;
        this.curveCategory = this.curveModeler.curveCategory;
        this.curveModel = new CurveModel();

        this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        // this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        this._curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this._curveModeler.activeLocationControl)

        this._currentCurve = this.curveModel.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.displacementSelctdCP = new Vector_2d(0, 0);
        this._targetCurve = this.curveModel.spline.clone();
        this._optimizedCurve = this._currentCurve;
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector_2d(0.0, 0.0)))
        this._curveConstraints = new CurveConstraints(this);
        this._curveConstraintProcessor = this._curveConstraints.curveConstraintProcessor;
        this.shapeSpaceDiffEventsConfigurator = new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding;
        this.shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure(this._curveModeler, this.shapeSpaceDiffEventsConfigurator, this);
        this.curveControlState = new HandleNoDiffEventNoSlidingState(this);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this._currentCurve);
        this._eventMgmtAtCurveExtremities = new EventMgmtAtCurveExtremities();
        this._slidingEventsAtExtremities = new CurveAnalyzerEventsSlidingOutOfInterval();
        // JCL Setting up the navigation state requires having defined the shapeSpaceDiffEventsStructure and its shapeSpaceDiffEventsConfigurator
        // JCL as well as the CurveShapeSpaceDescriptor
        this.navigationState = new NavigationWithoutShapeSpaceMonitoring(this);
        // JCL requires the setting of the navigationState
        this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this, this.slidingEventsAtExtremities);
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this._optimizedCurve, this,  this.slidingEventsAtExtremities);
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        this.diffEvents = new NeighboringEvents();
        //this._navigationParameters = new ShapeSpaceDiffEventsStructure();

        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.currentCurve.clone(), this.currentCurve.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();

        this.changeNavigationState(new NavigationWithoutShapeSpaceMonitoring(this));
        console.log("end constructor curveShapeSpaceNavigator")
    }

    get controlOfCurvatureExtrema() {
        return this._controlOfCurvatureExtrema;
    }

    set controlOfCurvatureExtrema(controlOfCurvatureExtrema: boolean) {
        this._controlOfCurvatureExtrema = controlOfCurvatureExtrema;
    }

    get controlOfInflection() {
        return this._controlOfInflection;
    }

    set controlOfInflection(controlOfInflection: boolean) {
        this._controlOfInflection = controlOfInflection;
    }

    get sliding() {
        return this._sliding
    }

    set sliding(sliding: boolean) {
        this._sliding = sliding
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

    set curveConstraintProcessor(curveConstraintProcessor: CurveConstraintProcessor) {
        this._curveConstraintProcessor = curveConstraintProcessor;
    }

    set currentCurve(curve: BSpline_R1_to_R2)  {
        this._currentCurve = curve;
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

    get curveControl() {
        return this._curveControl;
    }

    changeNavigationState(state: NavigationState): void {
        this.navigationState = state;
        this.navigationState.setCurveShapeSpaceNavigator(this);
    }

    changeCurveState(state: CurveConstraintProcessor): void {
        this._curveConstraintProcessor = state;
    }

    /* JCL test code debut */
    transitionTo(curveControlState: CurveControlState): void {
        this.curveControlState = curveControlState;
        this.curveControlState.setContext(this);
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

    updateCurrentCurve(newSelectedControlPoint: number, newDispSelctdCP: Vector_2d): void {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints;
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
        if(this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
            this.optimizationProblem.setTargetSpline(this.targetCurve);
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

    inputSelectNavigationProcess(navigationID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
        warning.logMessageToConsole();

        switch(navigationID) {
            case 0: {
                this.navigationState.setNavigationWithoutShapeSpaceMonitoring();
                break;
            }
            case 1: {
                this.navigationState.setNavigationThroughSimplerShapeSpaces();
                break;
            }
            case 2: {
                this.navigationState.setNavigationStrictlyInsideShapeSpace();
                break;
            }
            default: {
                let error = new ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessageToConsole();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        // this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    }

    toggleControlOfCurvatureExtrema() {
        this._curveControl.toggleControlOfCurvatureExtrema()
        this._controlOfCurvatureExtrema = !this._controlOfCurvatureExtrema
        //console.log("control of curvature extrema: " + this.controlOfCurvatureExtrema)

        /* JCL 2021/12/02 Add control state for new code architecture */
        /* JCL 2021/12/02 controlOfCurvatureExtrema can be used to characterize the control state and set it appropriately when changing the navigation mode */
        this.curveControlState.handleCurvatureExtrema();
    }

    toggleControlOfInflections() {
        this._curveControl.toggleControlOfInflections()
        this.controlOfInflection = ! this.controlOfInflection
        //console.log("control of inflections: " + this.controlOfInflection)

        /* JCL 2021/12/02 Add control state for new code architecture */
        /* JCL 2021/12/02 controlOfInflection can be used to characterize the control state and set it appropriately when changing the navigation mode */
        this.curveControlState.handleInflections();
    }

    toggleSliding() {
        if(this.curveModel !== undefined) {
            if(this._sliding) {
                this._sliding = false
                //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
                //console.log("constrol of inflections: " + this.controlOfInflection)
                this._curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this._curveModeler.activeLocationControl)
            }
            else {
                this._sliding = true
                //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
                //console.log("constrol of inflections: " + this.controlOfInflection)

                // this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
        } else throw new Error("Unable to slide curvature extrema and/or inflexion points. Undefined curve model")
    
        /* JCL 2021/10/12 Add curveControlState for new code architecture */
        this.curveControlState.handleSliding();
    }
    
}