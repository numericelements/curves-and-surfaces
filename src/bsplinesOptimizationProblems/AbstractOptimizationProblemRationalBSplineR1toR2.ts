import { BernsteinDecompositionR1toR1, determinant2by2 } from "../bsplines/BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "../bsplines/BSplineR1toR1";
import { BSplineR1toR1Interface } from "../bsplines/BSplineR1toR1Interface";
import { RationalBSplineR1toR2 } from "../bsplines/RationalBSplineR1toR2";
import { ChenTerms, Derivatives } from "../bsplines/RationalBSplineR1toR2DifferentialProperties";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix";
import { SymmetricMatrixInterface} from "../linearAlgebra/MatrixInterfaces";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";


export abstract class AbstractOptimizationProblemRationalBSplineR1toR2 {
    
    abstract spline: RationalBSplineR1toR2
    abstract setTargetSpline(spline: RationalBSplineR1toR2): void
    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1Interface
    abstract compute_curvatureExtremaConstraints_gradient( d: Derivatives, ct: ChenTerms,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    abstract compute_inflectionConstraints_gradient( d: Derivatives, 
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    //abstract computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]): number[]
    abstract computeInactiveConstraints(controlPoints: number[]): number[]

    abstract computeBasisFunctionsDerivatives(): void

    protected _spline: RationalBSplineR1toR2
    protected _target: RationalBSplineR1toR2

    protected _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    protected _hessian_f0: SymmetricMatrixInterface
    protected _f: number[]
    protected _gradient_f: DenseMatrix
    protected _hessian_f: SymmetricMatrix[] | undefined = undefined

    protected basisFunctions: BernsteinDecompositionR1toR1[] = []
    protected dBasisFunctions_du: BernsteinDecompositionR1toR1[] = []
    protected d2BasisFunctions_du2: BernsteinDecompositionR1toR1[] = []
    protected d3BasisFunctions_du3: BernsteinDecompositionR1toR1[] = []

    protected inflectionConstraintsSign: number[] = []
    protected _inflectionInactiveConstraints: number[] = []
    protected curvatureExtremaConstraintsSign: number[] = []
    protected _curvatureExtremaInactiveConstraints: number[] = []

    
    constructor(target: RationalBSplineR1toR2, initial: RationalBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        this._spline = initial.clone()
        this._target = target.clone()
        this.computeBasisFunctionsDerivatives()
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 3
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables)

        const derivatives = computeDerivatives(this._spline)
        const ct = ComputeChenTerms(derivatives)

        const curvatureNumerator = this.curvatureNumerator(derivatives)
        const g = this.curvatureDerivativeNumerator(derivatives, ct)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(derivatives, ct, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
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
        const derivatives = computeDerivatives(this._spline)
        const ct = ComputeChenTerms(derivatives)
        const g = this.curvatureDerivativeNumerator(derivatives, ct)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        const curvatureNumerator = this.curvatureNumerator(derivatives)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(derivatives, ct, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)  
    }

     fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        const derivatives = computeDerivatives(splineTemp)
        const ct = ComputeChenTerms(derivatives)
        const g = this.curvatureDerivativeNumerator(derivatives, ct)
        const curvatureNumerator = this.curvatureNumerator(derivatives)
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
    }

    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        return this.compute_f0(this.compute_gradient_f0(splineTemp))
    }



    compute_gradient_f0(spline: RationalBSplineR1toR2) {
        let result: number[] = []
        const n =  spline.freeControlPoints.length
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x)
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y)
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].z - this._target.freeControlPoints[i].z)
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

    curvatureNumerator(s: Derivatives) {
        // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
        const t1 = determinant2by2(s.xu, s.yu, s.xuu, s.yuu).multiply(s.w)
        const t2 = determinant2by2(s.x, s.y, s.xuu, s.yuu).multiply(s.wu)
        const t3 = determinant2by2(s.xu, s.yu, s.x, s.y).multiply(s.wuu)
        return (t1.subtract(t2).subtract(t3)).flattenControlPointsArray()
    }

    curvatureDerivativeNumerator(s: Derivatives, ct: ChenTerms) {
            const t0 = (ct.D1x.multiply(ct.D1x)).add(ct.D1y.multiply(ct.D1y))
            const t1 = determinant2by2(ct.D1x, ct.D1y, ct.D3x, ct.D3y)
            const t2 = determinant2by2(ct.D1x, ct.D1y, ct.D21x, ct.D21y)
            const t3 = determinant2by2(ct.D1x, ct.D1y, ct.D2x, ct.D2y)
            const t4 = s.wu.multiplyByScalar(2)
            const t5 = (ct.D1x.multiply(ct.D2x)).add(ct.D1y.multiply(ct.D2y)).multiplyByScalar(3)
            return ((t1.add(t2)).multiply(t0).multiply(s.w)).add(t4.multiply(t3).multiply(t0)).subtract(t5.multiply(t3).multiply(s.w)).flattenControlPointsArray()
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
    
    compute_gradient_f( d: Derivatives, ct: ChenTerms,
        inflectionConstraintsSign: number[],
        inflectionInactiveConstraints: number[],
        curvatureExtremaConstraintsSign: number[], 
        curvatureExtremaInactiveConstraints: number[]) {
            if (this.activeControl === ActiveControl.both) {
                const m1 = this.compute_curvatureExtremaConstraints_gradient(d, ct, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
                const m2 = this.compute_inflectionConstraints_gradient(d, inflectionConstraintsSign, inflectionInactiveConstraints)
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
                return this.compute_curvatureExtremaConstraints_gradient(d, ct, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            }
            else {
                return this.compute_inflectionConstraints_gradient(d, inflectionConstraintsSign, inflectionInactiveConstraints)
            }
    }
}


export enum ActiveControl {curvatureExtrema, inflections, both}



export function computeDerivatives(spline: RationalBSplineR1toR2) {
    const sx = new BSplineR1toR1(spline.getControlPointsX(), spline.knots)
    const sy = new BSplineR1toR1(spline.getControlPointsY(), spline.knots)
    const sw = new BSplineR1toR1(spline.getControlPointsW(), spline.knots)
    const sxu = sx.derivative()
    const syu = sy.derivative()
    const swu = sw.derivative()
    const sxuu = sxu.derivative()
    const syuu = syu.derivative()
    const swuu = swu.derivative()
    const sxuuu = sxuu.derivative()
    const syuuu = syuu.derivative()
    const swuuu = swuu.derivative()
    return {
        x: sx.bernsteinDecomposition(),
        y: sy.bernsteinDecomposition(),
        w: sw.bernsteinDecomposition(),
        xu: sxu.bernsteinDecomposition(),
        yu: syu.bernsteinDecomposition(),
        wu: swu.bernsteinDecomposition(),
        xuu: sxuu.bernsteinDecomposition(),
        yuu: syuu.bernsteinDecomposition(),
        wuu: swuu.bernsteinDecomposition(),
        xuuu: sxuuu.bernsteinDecomposition(),
        yuuu: syuuu.bernsteinDecomposition(),
        wuuu: swuuu.bernsteinDecomposition()
    };
}

export function ComputeChenTerms(s: Derivatives) {
    // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
    return {
        w: s.w,
        wu: s.wu,
        D1x: (s.xu.multiply(s.w)).subtract(s.x.multiply(s.wu)),
        D1y: (s.yu.multiply(s.w)).subtract(s.y.multiply(s.wu)),
        D2x: (s.xuu.multiply(s.w)).subtract(s.x.multiply(s.wuu)),
        D2y: (s.yuu.multiply(s.w)).subtract(s.y.multiply(s.wuu)),
        D3x: (s.xuuu.multiply(s.w)).subtract(s.x.multiply(s.wuuu)),
        D3y: (s.yuuu.multiply(s.w)).subtract(s.y.multiply(s.wuuu)),
        D21x: (s.xuu.multiply(s.wu)).subtract(s.xu.multiply(s.wuu)),
        D21y: (s.yuu.multiply(s.wu)).subtract(s.yu.multiply(s.wuu))
    }
}
