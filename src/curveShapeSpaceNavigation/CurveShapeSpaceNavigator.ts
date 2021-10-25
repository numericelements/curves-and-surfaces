import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { CurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
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
import { NavigationState, NavigationThroughSimplerShapeSpaces, NavigationStrictlyInsideShapeSpace } from "./NavigationState";
import { CurveConstraintNoConstraint} from "./CurveConstraintStrategy";
import { ShapeSpaceDiffEvventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveCategory } from "../curveModeler/CurveCategory";
import { ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

export class CurveShapeSpaceNavigator {

    public curveModeler: CurveModeler;
    public curveCategory: CurveCategory;
    public curveModel: CurveModel;
    private _selectedControlPoint?: number;
    private currentCurve: BSpline_R1_to_R2;
    private currentControlPolygon: Vector_2d[];
    private displacementSelctdCP: Vector_2d;
    public seqDiffEventsCurrentCurve: SequenceOfDifferentialEvents;
    public curveAnalyserCurrentCurve: CurveAnalyzer;
    private targetCurve: BSpline_R1_to_R2;
    private displacementCurrentCurveControlPolygon: Vector_2d[] = [];
    public optimizedCurve: BSpline_R1_to_R2;
    public seqDiffEventsOptimizedCurve: SequenceOfDifferentialEvents;
    public curveAnalyserOptimizedtCurve: CurveAnalyzer;
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
    private curveConstraintProcessor: CurveConstraintProcessor;
    public curveEventAtExtremityMayVanish: boolean;
    private slidingEventsAtExtremities: SlidingEventsAtExtremities;

    constructor(curveModeler: CurveModeler) {
        this.curveModeler = curveModeler;
        this.curveCategory = this.curveModeler.curveCategory;
        this.curveModel = new CurveModel();
        this.currentCurve = this.curveModel.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.displacementSelctdCP = new Vector_2d(0, 0);
        this.targetCurve = this.curveModel.spline.clone();
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector_2d(0.0, 0.0)))
        this.navigationState = new NavigationStrictlyInsideShapeSpace(this);
        this.shapeSpaceDiffEventsConfigurator = new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding;
        this.shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure(this.curveModeler, this.shapeSpaceDiffEventsConfigurator);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor(this.currentCurve);
        this.curveEventAtExtremityMayVanish = true;
        this.slidingEventsAtExtremities = new CurveAnalyzerEventsSlidingOutOfInterval();
        this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this, this.slidingEventsAtExtremities);
        this.seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.optimizedCurve = this.currentCurve;
        this.curveAnalyserOptimizedtCurve = new CurveAnalyzer(this.optimizedCurve, this,  this.slidingEventsAtExtremities);
        this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedtCurve.sequenceOfDifferentialEvents;
        this.diffEvents = new NeighboringEvents();
        //this._navigationParameters = new ShapeSpaceDiffEventsStructure();
        this.curveConstraintProcessor = new CurveConstraintNoConstraint();
        this._curveConstraints = new CurveConstraints(this.curveConstraintProcessor);
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.currentCurve.clone(), this.currentCurve.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();

        this.navigationState = new NavigationThroughSimplerShapeSpaces(this);
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

    // get navigationParams(): ShapeSpaceDiffEventsStructure {
    //     return this._navigationParameters;
    // }

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

    changeNavigationState(state: NavigationState): void {
        this.navigationState = state;
    }

    changeCurveState(state: CurveConstraintProcessor): void {
        this.curveConstraintProcessor = state;
    }

    // initializeNavigationStep(): void {
    //     const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
    //     this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    // }

    updateCurrentCurve(newCurve: CurveModel, newSelectedControlPoint: number, newDispSelctdCP: Vector_2d): void {
        this.curveModel = newCurve;
        this.currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = newSelectedControlPoint;
        this.displacementSelctdCP = newDispSelctdCP;
    }

    setTargetCurve(): void {
        if(this.selectedControlPoint !== undefined) {
            this.targetCurve = this.currentCurve;
            this.targetCurve.setControlPoint(this.selectedControlPoint, this.displacementSelctdCP);
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
            this.optimizedCurve = this.optimizationProblem.spline.clone();
            this.curveDisplacement();
            this.curveAnalyserOptimizedtCurve.update();
            this.seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedtCurve.sequenceOfDifferentialEvents;
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