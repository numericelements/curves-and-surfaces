import { BSplineR1toR2 } from "../bsplines/R1toR2/BSplineR1toR2"
import { RationalBSplineR1toR2 } from "../bsplines/R1toR2/RationalBSplineR1toR2"
import { DiagonalMatrix } from "../linearAlgebra/DiagonalMatrix"
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix"
import { ActiveControl } from "./BaseOpBSplineR1toR2"
import { OpRationalBSplineR1toR2 } from "./OpRationalBSplineR1toR2"

export class OpRationalBSplineR1toR2WithWeightingFactors extends OpRationalBSplineR1toR2 {

    //public weightingFactors: number[] = []

    constructor(target: RationalBSplineR1toR2, initial: RationalBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial)
        /*
        for (let i = 0; i < this.spline.freeControlPoints.length * 3; i += 1) {
            this.weightingFactors.push(1)
        }
        */
        this.weightingFactors[0] = 1
        this.weightingFactors[this.spline.freeControlPoints.length-1] = 1
        this.weightingFactors[this.spline.freeControlPoints.length] = 1
        this.weightingFactors[2 * this.spline.freeControlPoints.length -1] = 1
        //this.weightingFactors[3 * this.spline.freeControlPoints.length] = 100
        //this.weightingFactors[3 * this.spline.freeControlPoints.length -1] = 100

    }

    


    homogeneous_f0(spline: RationalBSplineR1toR2, factor: number = 0.1) {
        let result = 0
        const n =  spline.freeControlPoints.length
        for (let i = 0; i < n; i += 1) {
            result += 0.5 * Math.pow((spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z), 2) * this.weightingFactors[i]
            result += 0.5 * Math.pow((spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z), 2) * this.weightingFactors[spline.freeControlPoints.length + i]
            result += 0.5 * Math.pow(spline.freeControlPoints[i].z - this._target.freeControlPoints[i].z, 2) * factor 
        }
        return result
    }
    
    homogeneous_gradient_f0(spline: RationalBSplineR1toR2, factor: number = 0.1) {
        let result: number[] = []
        const n =  spline.freeControlPoints.length
        for (let i = 0; i < n; i += 1) {
            result.push((spline.freeControlPoints[i].x  - this._target.freeControlPoints[i].x / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z) * this.weightingFactors[i])
        }
        for (let i = 0; i < n; i += 1) {
            result.push((spline.freeControlPoints[i].y  - this._target.freeControlPoints[i].y / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z) * this.weightingFactors[spline.freeControlPoints.length + i])
        }
        for (let i = 0; i < n; i += 1) {
            const t1 =  (spline.freeControlPoints[i].x  - this._target.freeControlPoints[i].x / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z ) * (- this._target.freeControlPoints[i].x / this._target.freeControlPoints[i].z) * this.weightingFactors[i]
            const t2 =  (spline.freeControlPoints[i].y  - this._target.freeControlPoints[i].y / this._target.freeControlPoints[i].z * spline.freeControlPoints[i].z ) * (- this._target.freeControlPoints[i].y / this._target.freeControlPoints[i].z) * this.weightingFactors[spline.freeControlPoints.length + i]
            const t3 =  (spline.freeControlPoints[i].z - this._target.freeControlPoints[i].z) * factor
            result.push(t1 + t2 + t3)
        }
        return result;
    }



    homogeneous_hessian_f0(factor: number = 0.1) {

        const startY = this._numberOfIndependentVariables * 1 / 3
        const startZ = this._numberOfIndependentVariables * 2 / 3
        const end = this._numberOfIndependentVariables

        let result = new SymmetricMatrix(this._numberOfIndependentVariables)
        for (let i = 0; i < this._numberOfIndependentVariables * 2 / 3; i += 1) {
            result.set(i, i, 1 * this.weightingFactors[i] )
        }
        for (let i = startZ; i < end; i += 1) {
            let cp = this._target.freeControlPoints[i - this._numberOfIndependentVariables * 2 / 3]
            result.set(i, i, (Math.pow(cp.x / cp.z, 2) + Math.pow(cp.y / cp.z, 2) + factor) )
        }
        for (let i = 0; i < startY; i += 1) {
            result.set(i, i + startZ, (- this._target.freeControlPoints[i].x / this._target.freeControlPoints[i].z) * this.weightingFactors[i])
            result.set(i + startY, i + startZ, (- this._target.freeControlPoints[i].y / this._target.freeControlPoints[i].z) * this.weightingFactors[this._numberOfIndependentVariables * 1 / 3 + i])
        }
        return result
    }
    



}


/*
export class OptimizationProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints extends OptimizationProblemBSplineR1toR2WithWeigthingFactors {


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial)
    }

    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }




}

export class OptimizationProblemBSplineR1toR2NoInactiveConstraints extends OptimizationProblemBSplineR1toR2 {


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2) {
        super(target, initial)
    }

    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }




}
*/