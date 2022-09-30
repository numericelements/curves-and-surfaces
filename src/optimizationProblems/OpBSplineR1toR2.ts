import { BSplineR1toR2 } from "../bsplines/R1toR2/BSplineR1toR2"
import { BSplineR1toR1 } from "../bsplines/R1toR1/BSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { BaseOpProblemBSplineR1toR2, ActiveControl, ExpensiveComputationResults } from "./BaseOpBSplineR1toR2"
import { zeroVector } from "../linearAlgebra/MathVectorBasicOperations"
import { ScaledBernsteinDecompositionR1toR1 } from "../bsplines/R1toR1/ScaledBernsteinDecompositionR1toR1"



export class OpBSplineR1toR2 extends BaseOpProblemBSplineR1toR2 {
    
    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl)  
    }

    get spline(): BSplineR1toR2 {
        return this._spline as BSplineR1toR2
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots)
    }

    setTargetSpline(spline: BSplineR1toR2) {
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

    compute_curvatureDerivativeNumerator_gradient2( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const sxuuu = e.bdsxuuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu
        const syuuu = e.bdsyuuu
        const cuDOTcu = e.cuDOTcu
        const cuXcuuu = e.cuXcuuu
        const cuDOTcuu = e.cuDOTcuu
        const cuXcuu = e.cuXcuu

        let dgx: ScaledBernsteinDecompositionR1toR1[] = []
        let dgy: ScaledBernsteinDecompositionR1toR1[] = []
        const controlPointsLength = this.spline.controlPoints.length
        const totalNumberOfConstraints = constraintsSign.length
        const degree = this.spline.degree


        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let cuDOTcu_subset = cuDOTcu.subset(start, lessThan)
            let cuXcuuu_subset = cuXcuuu.subset(start, lessThan)
            let cuDOTcuu_subset = cuDOTcuu.subset(start, lessThan)
            let cuXcuu_subset = cuXcuu.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(cuXcuuu_subset).multiplyByScalar(2)).add(cuDOTcu_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(cuXcuu_subset)).add((h10.add(h11)).multiply(cuDOTcuu_subset))).multiplyByScalar(-3)))
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let h1_subset = cuDOTcu.subset(start, lessThan)
            let h2_subset = cuXcuuu.subset(start, lessThan)
            let h3_subset = cuDOTcuu.subset(start, lessThan)
            let h4_subset = cuXcuu.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5)

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
                }
            }
        }
        return result
    }

    compute_curvatureDerivativeNumerator_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const sxuuu = e.bdsxuuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu
        const syuuu = e.bdsyuuu
        const cuDOTcu = e.cuDOTcu
        const cuXcuuu = e.cuXcuuu
        const cuDOTcuu = e.cuDOTcuu
        const cuXcuu = e.cuXcuu

        let dgx: ScaledBernsteinDecompositionR1toR1[] = []
        let dgy: ScaledBernsteinDecompositionR1toR1[] = []
        const controlPointsLength = this.spline.controlPoints.length
        const totalNumberOfConstraints = constraintsSign.length
        const degree = this.spline.degree

        const sxuTcuXcuuu = sxu.multiply(cuXcuuu)
        const cuDOTcuTsyuuu = cuDOTcu.multiply(syuuu)
        const sxuuTcuXcuu = sxuu.multiply(cuXcuu)
        const cuDOTcuuTsyuu = cuDOTcuu.multiply(syuu)
        const sxuTcuXcuu = sxu.multiply(cuXcuu)
        const cuDOTcuuTsyu = cuDOTcuu.multiply(syu)
        const cuDOTcuTsyu = cuDOTcu.multiply(syu)
        const t1x = sxuTcuXcuuu.multiplyByScalar(2).add(cuDOTcuTsyuuu).add((sxuuTcuXcuu.add(cuDOTcuuTsyuu)).multiplyByScalar(-3))
        const t2x = sxuTcuXcuu.multiplyByScalar(-3).add((cuDOTcuuTsyu.multiplyByScalar(3)))
        const t3x = cuDOTcuTsyu.multiplyByScalar(-1)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let term1 = this.dBasisFunctions_du[i].multiplyRange(t1x, start, lessThan)
            let term2 = this.d2BasisFunctions_du2[i].multiplyRange(t2x, start, lessThan)
            let term3 = this.d3BasisFunctions_du3[i].multiplyRange(t3x, start, lessThan)
            dgx.push(term1.add(term2.add(term3)))
        }

        const syuTcuXcuuu = syu.multiply(cuXcuuu)
        const cuDOTcuTsxuuu = cuDOTcu.multiply(sxuuu)
        const syuuTcuXcuu = syuu.multiply(cuXcuu)
        const cuDOTcuuTsxuu = cuDOTcuu.multiply(sxuu)
        const syuTcuXcuu = syu.multiply(cuXcuu)
        const cuDOTcuuTsxu = cuDOTcuu.multiply(sxu)
        const cuDOTcuTsxu = cuDOTcu.multiply(sxu)
        const t1y = syuTcuXcuuu.multiplyByScalar(2).subtract(cuDOTcuTsxuuu).add(((syuuTcuXcuu.multiplyByScalar(-3)).add(cuDOTcuuTsxuu.multiplyByScalar(3))))
        const t2y = syuTcuXcuu.multiplyByScalar(-3).add((cuDOTcuuTsxu.multiplyByScalar(-3)))
        const t3y = cuDOTcuTsxu

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let term1 = this.dBasisFunctions_du[i].multiplyRange(t1y, start, lessThan)
            let term2 = this.d2BasisFunctions_du2[i].multiplyRange(t2y, start, lessThan)
            let term3 = this.d3BasisFunctions_du3[i].multiplyRange(t3y, start, lessThan)
            dgy.push(term1.add(term2.add(term3)))
        }


        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5)

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
                }
            }
        }
        return result
    }

    compute_curvatureNumerator_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu

        let dgx: ScaledBernsteinDecompositionR1toR1[] = []
        let dgy: ScaledBernsteinDecompositionR1toR1[] = []
        const controlPointsLength = this.spline.controlPoints.length
        const degree = this.spline.degree

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let term1 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let term2 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            let dcuXcuu = term1.add(term2)
            dgx.push(dcuXcuu)
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let term1 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let term2 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let dcuXcuu = term1.add(term2)
            dgy.push(dcuXcuu)
        }

        const totalNumberOfConstraints = this.inflectionConstraintsSign.length

        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (2 * degree - 2)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2)

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
                }
            }
        }

        return result;


    }

    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length
        //??????????
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
            this.dBasisFunctions_du.push(dBasisFunction_du.scaledBernsteinDecomposition())
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.scaledBernsteinDecomposition())
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.scaledBernsteinDecomposition())
            diracControlPoints[i] = 0
        }
    } 

}