import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1";
import { BSplineR1toR1Interface } from "../bsplines/BSplineR1toR1Interface";
import { Derivatives } from "../bsplines/BSplineR1toR3DifferentialProperties";
import { BSplineR1toR3Interface } from "../bsplines/BSplineR1toR3Interface";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix";
import { SymmetricMatrixInterface} from "../linearAlgebra/MatrixInterfaces";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { ActiveControl } from "../models/CurveModel3d";
import { OptimizationProblemBSplineR1toR3Interface } from "./OptimizationProblemBSplineR1toR3Interface";


export abstract class AbstractOptimizationProblemBSplineR1toR3 implements OptimizationProblemBSplineR1toR3Interface {
    
    abstract spline: BSplineR1toR3Interface
    abstract setTargetSpline(spline: BSplineR1toR3Interface): void
    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1Interface
    abstract compute_curvatureExtremaConstraints_gradient( s: Derivatives,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    abstract compute_zeroTorsionConstraints_gradient( s: Derivatives,
        constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix
    abstract computeInactiveConstraints(controlPoints: number[]): number[]

    abstract computeBasisFunctionsDerivatives(): void

    protected _spline: BSplineR1toR3Interface
    protected _target: BSplineR1toR3Interface

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

    protected torsionConstraintsSign: number[] = []
    protected _torsionZerosInactiveConstraints: number[] = []
    protected curvatureExtremaConstraintsSign: number[] = []
    protected _curvatureExtremaInactiveConstraints: number[] = []

    
    constructor(target: BSplineR1toR3Interface, initial: BSplineR1toR3Interface, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        this._spline = initial.clone()
        this._target = target.clone()
        this.computeBasisFunctionsDerivatives()
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 3
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables)
        const derivatives = this.computeDerivatives(this._spline)
        const torsionNumerator = this.torsionNumerator(derivatives)
        const g = this.curvatureSquaredDerivativeNumerator(derivatives)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        this.torsionConstraintsSign = this.computeConstraintsSign(torsionNumerator)
        this._torsionZerosInactiveConstraints = this.computeInactiveConstraints(torsionNumerator)
        this._f = this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(derivatives, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        if (this._f.length !== this._gradient_f.shape[0]) {
            throw new Error("Problem about f length and gradient_f shape in the optimization problem construtor")
        }
    }

    get torsionZerosInactiveConstraints() {
        return this._torsionZerosInactiveConstraints
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
                return this.torsionConstraintsSign.length - this._torsionZerosInactiveConstraints.length + this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length
            }
            case ActiveControl.curvatureExtrema: {
                return this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length
            }
            case ActiveControl.torsionZeros: {
                return this.torsionConstraintsSign.length - this._torsionZerosInactiveConstraints.length
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
        const derivatives = this.computeDerivatives(this._spline) 
        
        const g = this.curvatureSquaredDerivativeNumerator(derivatives)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        const torsionNumerator = this.torsionNumerator(derivatives)
        this.torsionConstraintsSign = this.computeConstraintsSign(torsionNumerator)
        this._torsionZerosInactiveConstraints = this.computeInactiveConstraints(torsionNumerator)
        this._f = this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(derivatives, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints) 
    }

     fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        const s = this.computeDerivatives(splineTemp)
        const g = this.curvatureSquaredDerivativeNumerator(s)
        const torsionNumerator = this.torsionNumerator(s)
        return this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
    }

    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        return this.compute_f0(this.compute_gradient_f0(splineTemp))
    }

    computeDerivatives(spline: BSplineR1toR3Interface): Derivatives {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots)
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots)
        const sz = this.bSplineR1toR1Factory(spline.getControlPointsZ(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const szu = sz.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const szuu = szu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const szuuu = szuu.derivative()

        return {
            x: sx.bernsteinDecomposition(),
            y: sy.bernsteinDecomposition(),
            z: sz.bernsteinDecomposition(),
            xu: sxu.bernsteinDecomposition(),
            yu: syu.bernsteinDecomposition(),
            zu: szu.bernsteinDecomposition(),
            xuu: sxuu.bernsteinDecomposition(),
            yuu: syuu.bernsteinDecomposition(),
            zuu: szuu.bernsteinDecomposition(),
            xuuu: sxuuu.bernsteinDecomposition(),
            yuuu: syuuu.bernsteinDecomposition(),
            zuuu: szuuu.bernsteinDecomposition()
        }
    }

    compute_gradient_f0(spline: BSplineR1toR3Interface) {
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

    compute_curvatureExtremaConstraints(curvatureSquaredDerivativeNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]) {
        let result: number[] = []
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1
            } else {
                result.push(curvatureSquaredDerivativeNumerator[i] * constraintsSign[i])
            }
        }
        return result
    }

    compute_torsionConstraints(torsionNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]) {
        let result: number[] = []
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1
            } else {
                result.push(torsionNumerator[i] * constraintsSign[i])
            }
        }
        return result
    }

    /*
    curvatureSquaredNumerator(s: Derivatives) {
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu))
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu))
        const result = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3)))
        return result.flattenControlPointsArray()
    }
    */

    curvatureSquaredDerivativeNumerator(s: Derivatives) {
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu))
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu))
        const t4 = s.zuuu.multiply(s.yu).subtract(s.yuuu.multiply(s.zu))
        const t5 = s.xuuu.multiply(s.zu).subtract(s.zuuu.multiply(s.xu))
        const t6 = s.yuuu.multiply(s.xu).subtract(s.xuuu.multiply(s.yu))
        const t7 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu))
        const t8 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu))
        const t9 = ((t1.multiply(t4)).add(t2.multiply(t5)).add(t3.multiply(t6))).multiply(t7)
        const t10 = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3))).multiply(t8)
        const result = t9.subtract(t10.multiplyByScalar(3))
        return result.flattenControlPointsArray()
    }

    torsionNumerator(s: Derivatives) {
        const t1 = s.yu.multiply(s.zuu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.xu.multiply(s.zuu))
        const t3 = s.xu.multiply(s.yuu).subtract(s.xuu.multiply(s.yu))
        const result = s.xuuu.multiply(t1).add(s.yuuu.multiply(t2).add(s.zuuu.multiply(t3)))
        //console.log(result.flattenControlPointsArray())
        //console.log(t1)
        return result.flattenControlPointsArray()
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
            const r2 = this.compute_torsionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            return r1.concat(r2)
        }

        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
        }
        else {
            return this.compute_torsionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
        }
        
    }
    
    compute_gradient_f( s: Derivatives,
        inflectionConstraintsSign: number[],
        inflectionInactiveConstraints: number[],
        curvatureExtremaConstraintsSign: number[], 
        curvatureExtremaInactiveConstraints: number[]) {
            if (this.activeControl === ActiveControl.both) {
                const m1 = this.compute_curvatureExtremaConstraints_gradient(s, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
                const m2 = this.compute_zeroTorsionConstraints_gradient(s, inflectionConstraintsSign, inflectionInactiveConstraints)
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
                return this.compute_curvatureExtremaConstraints_gradient(s, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            }
            else {
                return this.compute_zeroTorsionConstraints_gradient(s, inflectionConstraintsSign, inflectionInactiveConstraints)
            }
    }


    

}



