import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints, ActiveControl } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModel } from "../newModels/CurveModel";
import { Vector2d } from "../mathVector/Vector2d";
import { CurveSceneController } from "./CurveSceneController"
import { ActiveLocationControl } from "../curveModeler/CurveModeler";


export class NoSlidingStrategy implements CurveControlStrategyInterface {
    
    private optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints
    private optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: CurveModel
    /* JCL 2020/09/23 Add management of the curve location */
    private activeLocationControl: ActiveLocationControl

    constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean, activeLocationControl: ActiveLocationControl ) {
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
        this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.curveModel.spline)

        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
            /* JCL 2020/09/18 relocate the curve after the optimization process to clamp its first control point */
            /*console.log("optimize : " + this.curveSceneController.activeLocationControl)*/
            let delta: Vector2d[] = []
            for(let i = 0; i < this.curveModel.spline.controlPoints.length; i += 1) {
                let inc = this.optimizationProblem.spline.controlPoints[i].substract(this.curveModel.spline.controlPoints[i])
                delta.push(inc)
            }
            if(this.activeLocationControl === ActiveLocationControl.firstControlPoint) {
                /*console.log("optimize : s[0] " + delta[0].norm() + " s[n] " + delta[delta.length - 1].norm())*/
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.activeLocationControl)
            } else if(this.activeLocationControl === ActiveLocationControl.both) {
                if(Math.abs(delta[delta.length - 1].substract(delta[0]).norm()) < 1.0E-6) {
                    /*console.log("optimize: s0sn constant")*/
                    /* JCL 2020/09/27 the last control vertex moves like the first one and can be clamped */
                    delta[delta.length - 1] = delta[0]
                    this.optimizationProblem.spline.relocateAfterOptimization(delta, this.activeLocationControl)
                } else {
                    /*console.log("optimize: s0sn variable -> stop evolving")*/
                    this.activeLocationControl = ActiveLocationControl.stopDeforming
                    this.optimizationProblem.spline.relocateAfterOptimization(delta, this.activeLocationControl)
                }
            } else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.activeLocationControl)
            }

            this.curveModel.setSpline(this.optimizationProblem.spline.clone())
           }
           catch(e) {
            this.curveModel.setControlPointPosition(selectedControlPoint, p.x, p.y)
            console.log(e)
           }


    }
}