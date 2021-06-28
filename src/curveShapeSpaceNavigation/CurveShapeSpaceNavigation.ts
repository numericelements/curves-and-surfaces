import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { CurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/curveDifferentialEventsExtraction";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Optimizer } from "../mathematics/Optimizer";
import { Vector_2d } from "../mathematics/Vector_2d";
import { CurveModel } from "../models/CurveModel";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveConstraints } from "./CurveConstraints";
import { ShapeNavigationParameters } from "./ShapeNavigationParameters";


export class CurveShapeSpaceNavigator {

    public curveModel: CurveModel;
    private _selectedControlPoint?: number;
    private currentCurve: BSpline_R1_to_R2;
    private currentControlPolygon: Vector_2d[];
    private displacementSelctdCP: Vector_2d;
    private seqDiffEventsCurrentCurve: SequenceOfDifferentialEvents;
    private _navigationParameters: ShapeNavigationParameters;
    private _curveConstraints: CurveConstraints;
    private optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation;
    private optimizer: Optimizer;
    private _optimizationProblemParam: OptimizationProblemCtrlParameters;

    constructor(curveModel: CurveModel) {
        this.curveModel = curveModel;
        this.currentCurve = this.curveModel.spline.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.displacementSelctdCP = new Vector_2d(0, 0);
        this._navigationParameters = new ShapeNavigationParameters();
        this._curveConstraints = new CurveConstraints();
        this.seqDiffEventsCurrentCurve = new SequenceOfDifferentialEvents();
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.currentCurve.clone(), this.currentCurve.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters();
    }

    set navigationParams(navigationParameters: ShapeNavigationParameters) {
        this._navigationParameters = navigationParameters;
    }

    set curveConstraints(curveConstraints: CurveConstraints) {
        this._curveConstraints = curveConstraints;
    }

    set selectedControlPoint(cpIndex: number | undefined) {
        if(cpIndex !==  undefined) {
            this.selectedControlPoint = cpIndex;
        } else {
            const error =  new ErrorLog(this.constructor.name, 'set', 'the control point index must not be of type undefined.')
        }
    }

    get navigationParams(): ShapeNavigationParameters {
        return this._navigationParameters;
    }

    get curveConstraints(): CurveConstraints {
        return this._curveConstraints;
    }

    get selectedControlPoint(): number | undefined {
        if(this._selectedControlPoint !== undefined) {
            return this._selectedControlPoint;
        } else {
            const error = new ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
            error.logMessageToConsole();
        }
    }

    initializeNavigationStep(): void {
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
        this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
        
    }

    updateCurrentCurve(newCurve: BSpline_R1_to_R2, newSelectedControlPoint: number, newDispSelctdCP: Vector_2d): void {
        this.currentCurve = newCurve.clone();
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = newSelectedControlPoint;
        this.displacementSelctdCP = newDispSelctdCP;
    }

    setTargetCurve(): void {
        if(this.selectedControlPoint !== undefined) {
            this.currentCurve.setControlPoint(this.selectedControlPoint, this.displacementSelctdCP);
        } else {
            const error = new ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessageToConsole();
        }
        this.optimizationProblem.setTargetSpline(this.currentCurve);

    }

    updateOptimizerStatus(): void {
        if(this._navigationParameters.inflectionControl === false && this._navigationParameters.curvatureExtremaControl === false) this._optimizationProblemParam.optimizerStatus = false;
        if(this._navigationParameters.inflectionControl === true || this._navigationParameters.curvatureExtremaControl === true) this._optimizationProblemParam.optimizerStatus = true;
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        //newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
            this.setWeightingFactor(optimizationProblem)
            return new Optimizer(optimizationProblem)
        }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        //setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
            optimizationProblem.weigthingFactors[0] = 10
            optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
            optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
            optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
        }
}