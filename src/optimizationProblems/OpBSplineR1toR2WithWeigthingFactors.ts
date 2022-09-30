import { BSplineR1toR2 } from "../bsplines/R1toR2/BSplineR1toR2"
import { DiagonalMatrix } from "../linearAlgebra/DiagonalMatrix"
import { ActiveControl } from "./BaseOpBSplineR1toR2"
import { OpBSplineR1toR2 } from "./OpBSplineR1toR2"

export class OpBSplineR1toR2WithWeigthingFactors extends OpBSplineR1toR2 {

    public weigthingFactors: number[] = []

    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial)
        for (let i = 0; i < this.spline.freeControlPoints.length * 2; i += 1) {
            this.weigthingFactors.push(1)
        }
        this.weigthingFactors[0] = 1000
        this.weigthingFactors[this.spline.freeControlPoints.length-1] = 1000
        this.weigthingFactors[this.spline.freeControlPoints.length] = 1000
        this.weigthingFactors[this.weigthingFactors.length -1] = 1000
    }

    get f0() {
        let result = 0
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i]
        }
        return 0.5 * result;
    }

    get gradient_f0() {
        let result: number[] = []
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result.push(this._gradient_f0[i] * this.weigthingFactors[i])
        }
        return result
    }

    get hessian_f0() {
        const n = this._gradient_f0.length;
        let result = new DiagonalMatrix(n)
        for (let i = 0; i < n; i += 1) {
            result.set(i, i, this.weigthingFactors[i])
        }
        return result
    }


    /**
     * The objective function value: f0(x + step)
     */
    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        const gradient = this.compute_gradient_f0(splineTemp)
        const n = gradient.length
        let result = 0
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i]
        }
        return 0.5 * result;
    }



}



export class OptimizationProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints extends OpBSplineR1toR2WithWeigthingFactors {


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial)
    }

    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }




}

export class OptimizationProblemBSplineR1toR2NoInactiveConstraints extends OpBSplineR1toR2 {


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2) {
        super(target, initial)
    }

    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }




}