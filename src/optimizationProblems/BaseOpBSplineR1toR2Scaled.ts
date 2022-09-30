import { ScaledBernsteinDecompositionR1toR1 } from "../bsplines/R1toR1/ScaledBernsteinDecompositionR1toR1";
import { IBSplineR1toR1 } from "../bsplines/R1toR1/IBSplineR1toR1";
import { IBSplineR1toR2 } from "../bsplines/R1toR2/IBSplineR1toR2";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix";
import { SymmetricMatrixInterface} from "../linearAlgebra/MatrixInterfaces";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { Vector2d } from "../mathVector/Vector2d";
import { IOpBSplineR1toR2 } from "./IOpBSplineR1toR2";


export abstract class BaseOpProblemBSplineR1toR2Scaled implements IOpBSplineR1toR2 {
    
    abstract spline: IBSplineR1toR2
    abstract setTargetSpline(spline: IBSplineR1toR2): void
    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): IBSplineR1toR1
    abstract compute_curvatureDerivativeNumerator_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    abstract compute_curvatureNumerator_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    //abstract computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]): number[]
    abstract computeInactiveConstraints(controlPoints: number[]): number[]

    abstract computeBasisFunctionsDerivatives(): void

    protected _spline: IBSplineR1toR2
    protected _target: IBSplineR1toR2

    protected _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    protected _hessian_f0: SymmetricMatrixInterface
    protected _f: number[]
    protected _gradient_f: DenseMatrix
    protected _hessian_f: SymmetricMatrix[] | undefined = undefined

    protected dBasisFunctions_du: ScaledBernsteinDecompositionR1toR1[] = []
    protected d2BasisFunctions_du2: ScaledBernsteinDecompositionR1toR1[] = []
    protected d3BasisFunctions_du3: ScaledBernsteinDecompositionR1toR1[] = []

    protected inflectionConstraintsSign: number[] = []
    protected _inflectionInactiveConstraints: number[] = []
    protected curvatureExtremaConstraintsSign: number[] = []
    protected _curvatureExtremaInactiveConstraints: number[] = []

    
    constructor(target: IBSplineR1toR2, initial: IBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        this._spline = initial.clone()
        this._target = target.clone()
        this.computeBasisFunctionsDerivatives()
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables)
        const e = this.expensiveComputation(this._spline)
        const curvatureNumerator = this.curvatureNumerator(e.cuXcuu)
        const g = this.curvatureDerivativeNumerator(e)
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
        this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX))
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this._spline)  
        const g = this.curvatureDerivativeNumerator(e)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        const curvatureNumerator = this.curvatureNumerator(e.cuXcuu)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)  
    }

     fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step))
        let e = this.expensiveComputation(splineTemp)
        const g = this.curvatureDerivativeNumerator(e)
        const curvatureNumerator = this.curvatureNumerator(e.cuXcuu)
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
    }

    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step))
        return this.compute_f0(this.compute_gradient_f0(splineTemp))
    }

    expensiveComputation(spline: IBSplineR1toR2) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots)
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const bdsxu = sxu.scaledBernsteinDecomposition()
        const bdsyu = syu.scaledBernsteinDecomposition()
        const bdsxuu = sxuu.scaledBernsteinDecomposition()
        const bdsyuu = syuu.scaledBernsteinDecomposition()
        const bdsxuuu = sxuuu.scaledBernsteinDecomposition()
        const bdsyuuu = syuuu.scaledBernsteinDecomposition()
        const cuDOTcu = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu))
        const cuXcuuu = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu))
        const cuDOTcuu = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu))
        const cuXcuu = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu))

        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            cuDOTcu: cuDOTcu,
            cuXcuuu: cuXcuuu,
            cuDOTcuu: cuDOTcuu,
            cuXcuu: cuXcuu
        }
    }



    compute_gradient_f0(spline: IBSplineR1toR2) {
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

    curvatureNumerator(h4: ScaledBernsteinDecompositionR1toR1) {
        return h4.flattenControlPointsArray()
    }

    curvatureDerivativeNumerator(e: ExpensiveComputationResults) {
        const g = (e.cuDOTcu.multiply(e.cuXcuuu)).subtract(e.cuDOTcuu.multiply(e.cuXcuu).multiplyByScalar(3))
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
                const m1 = this.compute_curvatureDerivativeNumerator_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
                const m2 = this.compute_curvatureNumerator_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
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
                return this.compute_curvatureDerivativeNumerator_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            }
            else {
                return this.compute_curvatureNumerator_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
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
    bdsxu: ScaledBernsteinDecompositionR1toR1
    bdsyu: ScaledBernsteinDecompositionR1toR1
    bdsxuu: ScaledBernsteinDecompositionR1toR1
    bdsyuu: ScaledBernsteinDecompositionR1toR1
    bdsxuuu: ScaledBernsteinDecompositionR1toR1
    bdsyuuu: ScaledBernsteinDecompositionR1toR1
    cuDOTcu: ScaledBernsteinDecompositionR1toR1
    cuXcuuu: ScaledBernsteinDecompositionR1toR1
    cuDOTcuu: ScaledBernsteinDecompositionR1toR1
    cuXcuu: ScaledBernsteinDecompositionR1toR1
}

export function convertStepToVector2d(step: number[]) {
    let n = step.length / 2
    let result: Vector2d[] = []
    for (let i = 0; i < n; i += 1) {
        result.push(new Vector2d(step[i], step[n + i]))
    }
    return result
}