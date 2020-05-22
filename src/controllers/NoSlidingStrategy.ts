import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints, ActiveControl } from "../mathematics/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModel } from "../models/CurveModel";


export class NoSlidingStrategy implements CurveControlStrategyInterface {
    
    private optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints
    private optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: CurveModel

    constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean ) {
        let activeControl : ActiveControl = ActiveControl.both

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
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
        this.optimizer = this.newOptimizer(this.optimizationProblem)
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

    resetCurve(curveModel: CurveModel) {
        this.curveModel = curveModel
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone())
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    toggleControlOfCurvatureExtrema(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema")
        }
    }

    toggleControlOfInflections(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
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
        this.curveModel.setControlPoint(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.curveModel.spline)

        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
            this.curveModel.setSpline(this.optimizationProblem.spline.clone())
           }
           catch(e) {
            this.curveModel.setControlPoint(selectedControlPoint, p.x, p.y)
            console.log(e)
           }


    }
}