import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1";
import { BSplineR1toR1Interface } from "../bsplines/BSplineR1toR1Interface";
import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix";
import { SymmetricMatrixInterface} from "../linearAlgebra/MatrixInterfaces";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { OptimizationProblemBSplineR1toR2Interface } from "./OptimizationProblemBSplineR1toR2Interface";


export abstract class AbstractOptimizationProblemBSplineR1toR2 implements OptimizationProblemBSplineR1toR2Interface {
    
    abstract spline: BSplineR1toR2Interface
    abstract setTargetSpline(spline: BSplineR1toR2Interface): void
    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1Interface
    abstract compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    abstract compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    //abstract computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]): number[]
    abstract computeInactiveConstraints(controlPoints: number[]): number[]

    abstract computeBasisFunctionsDerivatives(): void

    protected _spline: BSplineR1toR2Interface
    protected _target: BSplineR1toR2Interface

    protected _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    protected _hessian_f0: SymmetricMatrixInterface
    protected _f: number[]
    protected _gradient_f: DenseMatrix
    protected _hessian_f: SymmetricMatrix[] | undefined = undefined

    protected dBasisFunctions_du: BernsteinDecompositionR1toR1[] = []
    protected d2BasisFunctions_du2: BernsteinDecompositionR1toR1[] = []
    protected d3BasisFunctions_du3: BernsteinDecompositionR1toR1[] = []

    protected inflectionConstraintsSign: number[] = []
    protected _inflectionInactiveConstraints: number[] = []
    protected curvatureExtremaConstraintsSign: number[] = []
    protected _curvatureExtremaInactiveConstraints: number[] = []

    
    constructor(target: BSplineR1toR2Interface, initial: BSplineR1toR2Interface, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        this._spline = initial.clone()
        this._target = target.clone()
        this.computeBasisFunctionsDerivatives()
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables)
        const e = this.expensiveComputation(this._spline)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        if (this._f.length !== this._gradient_f.shape[0]) {
            throw new Error("Problem about f length and gradient_f shape in the optimization problem construtor")
        }
    }

    get inflectionInactiveConstraints() {
        return this._inflectionInactiveConstraints
    }

    get curvatureExtremaInactiveConstraints() {
        return this._curvatureExtremaInactiveConstraints
    }



    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables
    }

    get f0() {
        return this._f0
    }

    get gradient_f0() {
        return this._gradient_f0
    }

    get hessian_f0() {
        return this._hessian_f0
    }

    
    get numberOfConstraints() {
        switch (this.activeControl) {
            case ActiveControl.both: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length + this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length
            }
            case ActiveControl.curvatureExtrema: {
                return this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length
            }
            case ActiveControl.inflections: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length
            }
        }
    }
    

    get f() {
        return this._f
    }

    get gradient_f() {
        return this._gradient_f
    }

    get hessian_f() {
        return this._hessian_f
    }

    step(deltaX: number[]) {
        this.spline.optimizerStep(deltaX)
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this._spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)  
    }

     fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        let e = this.expensiveComputation(splineTemp)
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
    }

    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        return this.compute_f0(this.compute_gradient_f0(splineTemp))
    }

    expensiveComputation(spline: BSplineR1toR2Interface) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots)
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const bdsxu = sxu.bernsteinDecomposition()
        const bdsyu = syu.bernsteinDecomposition()
        const bdsxuu = sxuu.bernsteinDecomposition()
        const bdsyuu = syuu.bernsteinDecomposition()
        const bdsxuuu = sxuuu.bernsteinDecomposition()
        const bdsyuuu = syuuu.bernsteinDecomposition()
        const h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu))
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu))
        const h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu))
        const h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu))

        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        }
    }



    compute_gradient_f0(spline: BSplineR1toR2Interface) {
        let result: number[] = []
        const n =  spline.freeControlPoints.length
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x)
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y)
        }
        return result;
    }

    compute_f0(gradient_f0: number[]) {
        let result = 0
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2)
        }
        return 0.5 * result;
    }

    compute_curvatureExtremaConstraints(curvatureDerivativeNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]) {
        let result: number[] = []
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1
            } else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i])
            }
        }
        return result
    }

    compute_inflectionConstraints(curvatureNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]) {
        let result: number[] = []
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1
            } else {
                result.push(curvatureNumerator[i] * constraintsSign[i])
            }
        }
        return result
    }

    curvatureNumerator(h4: BernsteinDecompositionR1toR1) {
        return h4.flattenControlPointsArray()
    }

    curvatureDerivativeNumerator(  h1: BernsteinDecompositionR1toR1, 
        h2: BernsteinDecompositionR1toR1, 
        h3: BernsteinDecompositionR1toR1, 
        h4: BernsteinDecompositionR1toR1) {
        const g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3))
        return g.flattenControlPointsArray()
    }


    computeConstraintsSign(controlPoints: number[]) {
        let result: number[] = []
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            } else {
                result.push(1);
            }
        }
        return result
    }

    compute_f(curvatureNumerator: number[], inflectionConstraintsSign: number[], inflectionInactiveConstraints: number[], curvatureDerivativeNumerator: number[], curvatureExtremaConstraintsSign: number[], curvatureExtremaInactiveConstraints: number[]) {
        if (this.activeControl === ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            return r1.concat(r2)
        }

        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
        }
        else {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
        }
        
    }
    
    compute_gradient_f( e: ExpensiveComputationResults,
        inflectionConstraintsSign: number[],
        inflectionInactiveConstraints: number[],
        curvatureExtremaConstraintsSign: number[], 
        curvatureExtremaInactiveConstraints: number[]) {
            if (this.activeControl === ActiveControl.both) {
                const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
                const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
                const [row_m1, n] = m1.shape
                const [row_m2, ] = m2.shape
                const m = row_m1 + row_m2
                let result = new DenseMatrix(m, n)
                for (let i = 0; i < row_m1; i += 1) {
                    for (let j = 0; j < n; j += 1 ) {
                        result.set(i, j, m1.get(i, j))
                    }
                }
                for (let i = 0; i < row_m2; i += 1) {
                    for (let j = 0; j < n; j += 1 ) {
                        result.set(row_m1 + i, j, m2.get(i, j))
                    }
                }
                return result
            }
            else if (this.activeControl === ActiveControl.curvatureExtrema) {
                return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            }
            else {
                return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            }
    }
}


export enum ActiveControl {curvatureExtrema, inflections, both}

export interface ExpensiveComputationResults {
    /*
    * B-spline curve c(u) = x(u) i + y(u) j
    * @param sxu x_u
    * @param syu y_u
    * @param sxuu x_uu
    * @param syuu y_uu
    * @param sxuuu x_uuu
    * @param syuuu y_uuu
    * @param h1 c_u dot product c_u
    * @param h2 c_u cross product c_uuu
    * @param h3 c_u dot product c_uu
    * @param h4 c_u cross product c_uu
    */
    bdsxu: BernsteinDecompositionR1toR1
    bdsyu: BernsteinDecompositionR1toR1
    bdsxuu: BernsteinDecompositionR1toR1
    bdsyuu: BernsteinDecompositionR1toR1
    bdsxuuu: BernsteinDecompositionR1toR1 
    bdsyuuu: BernsteinDecompositionR1toR1 
    h1: BernsteinDecompositionR1toR1
    h2: BernsteinDecompositionR1toR1
    h3: BernsteinDecompositionR1toR1 
    h4: BernsteinDecompositionR1toR1 
}