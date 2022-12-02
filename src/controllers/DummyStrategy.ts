import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints, ActiveControl } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { Vector2d } from "../mathVector/Vector2d";
import { ActiveLocationControl } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveModel } from "../newModels/CurveModel";


export class DummyStrategy implements CurveControlStrategyInterface {
    
    private _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints
    private _optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: ClosedCurveModel
    /* JCL 2020/09/23 Add management of the curve location */
    private activeLocationControl: ActiveLocationControl
    private dummyCurveModel: CurveModel

    constructor(curveModel: ClosedCurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean, activeLocationControl: ActiveLocationControl ) {
        let activeControl : ActiveControl = ActiveControl.both

        /* JCL 2020/09/23 Update the curve location control in accordance with the status of the clamping button and the status of curveSceneController.activeLocationControl */
        this.activeLocationControl = activeLocationControl

        if (!controlOfCurvatureExtrema) {
            activeControl = ActiveControl.inflections
        }
        else if (!controlOfInflection) {
            activeControl = ActiveControl.curvatureExtrema
        }

        if (!controlOfInflection && !controlOfCurvatureExtrema) {
            this.activeOptimizer = false
            //console.log("activeOptimizer in NoSlidingStrategy: " + this.activeOptimizer)
        }

        this.curveModel = curveModel
        this.dummyCurveModel = new CurveModel()
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), activeControl)
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    get optimizer(): Optimizer {
        return this._optimizer;
    }

    get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints {
        return this._optimizationProblem;
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curveModel: ClosedCurveModel) {
        this.curveModel = curveModel
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone())
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    toggleControlOfCurvatureExtrema(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.inflections)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.both)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema")
        }
    }

    toggleControlOfInflections(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.inflections)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.both)
            this._optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over inflections")
        }
    }
    
    toggleSliding(): void {
        throw new Error("Method not implemented.");
    }


    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {

        if (this.activeOptimizer === false) return
        
        const p = this.curveModel.spline.controlPoints[selectedControlPoint]
        this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.dummyCurveModel.spline)

        try {
            this.curveModel.setSpline(this.curveModel.spline)
        }
        catch(e) {
            this.curveModel.setControlPointPosition(selectedControlPoint, p.x, p.y)
            console.log(e)
        }

    }
}