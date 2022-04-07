import { BSplineR1toR1 } from "../bsplines/BSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { zeroVector } from "../linearAlgebra/MathVectorBasicOperations"
import { BernsteinDecompositionR1toR1, determinant2by2 } from "../bsplines/BernsteinDecompositionR1toR1"
import { AbstractOptimizationProblemBSplineR1toR3} from "./AbstractOptimizationProblemBSplineR1toR3"
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3"
import { Derivatives } from "../bsplines/BSplineR1toR3DifferentialProperties"
import { ActiveControl } from "../models/CurveModel3d"



export class OptimizationProblemBSplineR1toR3 extends AbstractOptimizationProblemBSplineR1toR3 {
    
    constructor(target: BSplineR1toR3, initial: BSplineR1toR3, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl)  
    }

    get spline(): BSplineR1toR3 {
        return this._spline as BSplineR1toR3
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots)
    }

    setTargetSpline(spline: BSplineR1toR3) {
        this._target = spline.clone()
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0)
    }

    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema 
     * to slide along the curve. 
     **/ 
     computeInactiveConstraints(controlPoints: number[]) {  
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints)
        return this.extractControlPointsClosestToZero(controlPointsSequences)
    }

    extractChangingSignControlPointsSequences(controlPoints: number[]) {
        let result: {index: number, value: number}[][] = []
        let successiveControlPoints: {index: number, value: number}[] = []
        let i = 1
        while (i < controlPoints.length) {
            successiveControlPoints = []
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({index: i-1, value: controlPoints[i-1]})
                successiveControlPoints.push({index: i, value: controlPoints[i]})
                i += 1
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({index: i, value: controlPoints[i]})
                    i += 1
                }
                result.push(successiveControlPoints)
            }
            i += 1  
        }
        return result
    }

    extractControlPointsClosestToZero(polygonSegments: {index: number, value: number}[][]) {
        let result: number[] = []
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment)
            for (let iv of s) {
                result.push(iv.index)
            }
        }
        return result
    }

    removeBiggest(controlPointsSequence: {index: number, value: number}[]) {
        let result = controlPointsSequence.slice()
        let maxIndex = 0
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i
            }
        }
        result.splice(maxIndex, 1)
        return result
    }

    compute_curvatureExtremaConstraints_gradient( s: Derivatives,
            constraintsSign: number[], 
            inactiveConstraints: number[]) {
    
    
            let dgx: BernsteinDecompositionR1toR1[] = []
            let dgy: BernsteinDecompositionR1toR1[] = []
            let dgz: BernsteinDecompositionR1toR1[] = []
            const controlPointsLength = this.spline.controlPoints.length
            const totalNumberOfConstraints = constraintsSign.length
            const degree = this.spline.degree

            const d1 = determinant2by2(s.zuu, s.yuu, s.zu, s.yu)
            const dd1 = determinant2by2(s.zuuu, s.yuuu, s.zu, s.yu)
            const d2 = determinant2by2(s.xuu, s.zuu, s.xu, s.zu)
            const dd2 = determinant2by2(s.xuuu, s.zuuu, s.xu, s.zu)
            const d3 = determinant2by2(s.yuu, s.xuu, s.yu, s.xu)
            const dd3 = determinant2by2(s.yuuu, s.xuuu, s.yu, s.xu)
            const l2 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu))
            const ddd = d1.multiply(dd1).add(d2.multiply(dd2)).add(d3.multiply(dd3))
            const dl2 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu))
            const ddd2 = d1.multiply(d1).add(d2.multiply(d2)).add(d3.multiply(d3))
    
    
            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let t2a = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan)
                let t2b = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan)
                let t2c = this.d3BasisFunctions_du3[i].multiplyRange(s.zu, start, lessThan)
                let t2d = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan)
                let t2e = (t2a.subtract(t2b)).multiplyRange2(dd2, start, lessThan)
                let t2f = (t2c.subtract(t2d)).multiplyRange2(d2, start, lessThan)
                let t2 = t2e.add(t2f)
                let t3a = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan)
                let t3b = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan)
                let t3c = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan)
                let t3d = this.d3BasisFunctions_du3[i].multiplyRange(s.yu, start, lessThan)
                let t3e = (t3a.subtract(t3b)).multiplyRange2(dd3, start, lessThan)
                let t3f = (t3c.subtract(t3d)).multiplyRange2(d3, start, lessThan)
                let t3 = t3e.add(t3f)
                let z1 = (t2.add(t3)).multiplyRange2(l2, start, lessThan)
                let t4 = this.dBasisFunctions_du[i].multiplyRange(s.xu, start, lessThan).multiplyByScalar(2)
                let z2 = t4.multiplyRange2(ddd, start, lessThan)

                let z3a = (t2a.subtract(t2b)).multiplyRange2(d2, start, lessThan)
                let z3b = (t3a.subtract(t3b)).multiplyRange2(d3, start, lessThan)
                let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6)
                let z4a = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan)
                let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan)
                let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3)
                dgx.push(z1.add(z2).add(z3).add(z4))
            }

            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let t1a = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan)
                let t1b = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan)
                let t1c = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan)
                let t1d = this.d3BasisFunctions_du3[i].multiplyRange(s.zu, start, lessThan)
                let t1e = (t1a.subtract(t1b)).multiplyRange2(dd3, start, lessThan)
                let t1f = (t1c.subtract(t1d)).multiplyRange2(d3, start, lessThan)
                let t1 = t1e.add(t1f)
                let t3a = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan)
                let t3b = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan)
                let t3c = this.d3BasisFunctions_du3[i].multiplyRange(s.xu, start, lessThan)
                let t3d = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan)
                let t3e = (t3a.subtract(t3b)).multiplyRange2(dd2, start, lessThan)
                let t3f = (t3c.subtract(t3d)).multiplyRange2(d2, start, lessThan)
                let t3 = t3e.add(t3f)
                let z1 = (t1.add(t3)).multiplyRange2(l2, start, lessThan)
                let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yu, start, lessThan).multiplyByScalar(2)
                let z2 = t4.multiplyRange2(ddd, start, lessThan)

                let z3a = (t1a.subtract(t1b)).multiplyRange2(d1, start, lessThan)
                let z3b = (t3a.subtract(t3b)).multiplyRange2(d3, start, lessThan)
                let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6)
                let z4a = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan)
                let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan)
                let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3)
                dgy.push(z1.add(z2).add(z3).add(z4))
            }

            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let t1a = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan)
                let t1b = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan)
                let t1c = this.d3BasisFunctions_du3[i].multiplyRange(s.yu, start, lessThan)
                let t1d = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan)
                let t1e = (t1a.subtract(t1b)).multiplyRange2(dd2, start, lessThan)
                let t1f = (t1c.subtract(t1d)).multiplyRange2(d2, start, lessThan)
                let t1 = t1e.add(t1f)
                let t2a = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan)
                let t2b = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan)
                let t2c = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan)
                let t2d = this.d3BasisFunctions_du3[i].multiplyRange(s.xu, start, lessThan)
                let t2e = (t2a.subtract(t2b)).multiplyRange2(dd3, start, lessThan)
                let t2f = (t2c.subtract(t2d)).multiplyRange2(d3, start, lessThan)
                let t2 = t2e.add(t2f)
                let z1 = (t1.add(t2)).multiplyRange2(l2, start, lessThan)
                let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yu, start, lessThan).multiplyByScalar(2)
                let z2 = t4.multiplyRange2(ddd, start, lessThan)

                let z3a = (t1a.subtract(t1b)).multiplyRange2(d1, start, lessThan)
                let z3b = (t2a.subtract(t2b)).multiplyRange2(d2, start, lessThan)
                let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6)
                let z4a = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan)
                let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan)
                let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3)
                dgz.push(z1.add(z2).add(z3).add(z4))
            }
    
            let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength)
        
            for (let i = 0; i < controlPointsLength; i += 1) {
                let cpx = dgx[i].flattenControlPointsArray()
                let cpy = dgy[i].flattenControlPointsArray()
                let cpz = dgz[i].flattenControlPointsArray()
    
                let start = Math.max(0, i - degree) * (6 * degree - 8)
                let lessThan = Math.min(controlPointsLength - degree, i + 1) * (6 * degree - 8)
    
                let deltaj = 0
                for (let inactiveConstraint of inactiveConstraints) {
                    if (inactiveConstraint >= start) {
                        break
                    }
                    deltaj += 1
                }
                for (let j = start; j < lessThan; j += 1) {
                    if (j === inactiveConstraints[deltaj]) {
                        deltaj += 1
                    } else {
                        result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j])
                        result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
                        result.set(j - deltaj, 2 * controlPointsLength + i, cpz[j - start] * constraintsSign[j])
                    }
                }
            }
            return result
        }

    compute_zeroTorsionConstraints_gradient( s: Derivatives,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {


        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        let dgz: BernsteinDecompositionR1toR1[] = []
        const controlPointsLength = this.spline.controlPoints.length
        const degree = this.spline.degree

        const d1 = determinant2by2(s.zuu, s.yuu, s.zu, s.yu)
        const d2 = determinant2by2(s.xuu, s.zuu, s.xu, s.zu)
        const d3 = determinant2by2(s.yuu, s.xuu, s.yu, s.xu)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d1, start, lessThan)
            let t2 = this.d2BasisFunctions_du2[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.zu, start, lessThan)
            let t3 = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.zuu, start, lessThan)
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan).multiplyRange2(s.zuuu, start, lessThan)
            let t5 = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan).multiplyRange2(s.zuuu, start, lessThan)
            dgx.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d2, start, lessThan)
            let t2 = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.zuu, start, lessThan)
            let t3 = this.d2BasisFunctions_du2[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.zu, start, lessThan)
            let t4 = this.d2BasisFunctions_du2[i].multiplyRange(s.zuuu, start, lessThan).multiplyRange2(s.xu, start, lessThan)
            let t5 = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan).multiplyRange2(s.xuu, start, lessThan)
            dgy.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d3, start, lessThan)
            let t2 = this.d2BasisFunctions_du2[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.yu, start, lessThan)
            let t3 = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.yuu, start, lessThan)
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.xuu, start, lessThan)
            let t5 = this.d2BasisFunctions_du2[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.xu, start, lessThan)
            dgz.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }
        

        const totalNumberOfConstraints = this.torsionConstraintsSign.length

        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()
            let cpz = dgz[i].flattenControlPointsArray()

            let start = Math.max(0, i - degree) * (3 * degree - 5)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (3 * degree - 5)

            let deltaj = 0
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break
                }
                deltaj += 1
            }

            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1
                } else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j])
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
                    result.set(j - deltaj, 2* controlPointsLength + i, cpz[j - start] * constraintsSign[j])

                }
            }
        }

        return result;


    }

    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length
        this._numberOfIndependentVariables = n * 2
        let diracControlPoints = zeroVector(n)
        this.dBasisFunctions_du = []
        this.d2BasisFunctions_du2 = []
        this.d3BasisFunctions_du3 = []
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice())
            let dBasisFunction_du = basisFunction.derivative()
            let d2BasisFunction_du2 = dBasisFunction_du.derivative()
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative()
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition())
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition())
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition())
            diracControlPoints[i] = 0
        }
    } 

}