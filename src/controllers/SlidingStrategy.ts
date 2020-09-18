import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, ActiveControl } from "../mathematics/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModel } from "../models/CurveModel";


export class SlidingStrategy implements CurveControlStrategyInterface {
    
    private optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors
    private optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: CurveModel

    constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean ) {
        this.curveModel = curveModel
        //enum ActiveControl {curvatureExtrema, inflections, both}
        let activeControl : ActiveControl = ActiveControl.both

        if (!controlOfCurvatureExtrema) {
            activeControl = ActiveControl.inflections
        }
        else if (!controlOfInflection) {
            activeControl = ActiveControl.curvatureExtrema
        } 

        if (!controlOfInflection && !controlOfCurvatureExtrema) {
            this.activeOptimizer = false
            //console.log("activeOptimizer in SlidingStrategy: " + this.activeOptimizer)
        }

        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curveModel: CurveModel) {
        this.curveModel = curveModel
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone())
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    toggleControlOfCurvatureExtrema(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema")
        }
    }

    toggleControlOfInflections(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
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
        /* JCL 2020/09/17 Take into account the increment of the optimizer*/
        console.log("optimize: ds0X " + this.optimizer.increment[0] + " ndcX " + ndcX + " ds0Y " + this.optimizer.increment[this.curveModel.spline.controlPoints.length] + " ndcY " + ndcY)
        ndcX = ndcX - this.optimizer.increment[0]
        ndcY = ndcY - this.optimizer.increment[this.curveModel.spline.controlPoints.length]
        console.log("optimize: ndcX " + ndcX + " ndcY " + ndcY)

        this.curveModel.setControlPoint(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.curveModel.spline)
        
        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
            console.log("inactive constraints: " + this.optimizationProblem.curvatureExtremaConstraintsFreeIndices)
            /* JCL 2020/09/18 relocate the curve after the optimization process to clamp its first control point */
            this.optimizationProblem.spline.relocateAfterOptimization(this.optimizer.increment)
            this.curveModel.setSpline(this.optimizationProblem.spline.clone())
           }
           catch(e) {
            this.curveModel.setControlPoint(selectedControlPoint, p.x, p.y)
            console.log(e)
           }


    }
}