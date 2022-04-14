import { BSplineR1toR1 } from "../bsplines/R1toR1/BSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { ActiveControl } from "./BaseOpBSplineR1toR2"
import { zeroVector } from "../linearAlgebra/MathVectorBasicOperations"
import { BernsteinDecompositionR1toR1, determinant2by2 } from "../bsplines/R1toR1/BernsteinDecompositionR1toR1"
import { BaseOpRationalBSplineR1toR2 } from "./BaseOpRationalBSplineR1toR2"
import { ChenTerms, Derivatives } from "../bsplines/R1toR2/RationalBSplineR1toR2DifferentialProperties"
import { RationalBSplineR1toR2 } from "../bsplines/R1toR2/RationalBSplineR1toR2"



export class OpRationalBSplineR1toR2 extends BaseOpRationalBSplineR1toR2 {
    

    constructor(target: RationalBSplineR1toR2, initial: RationalBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl)  
    }

    get spline(): RationalBSplineR1toR2 {
        return this._spline
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots)
    }

    setTargetSpline(spline: RationalBSplineR1toR2) {
        this._target = spline.clone()
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        //this._f0 = this.compute_f0(this._gradient_f0)
        this._f0 = this.compute_f0(this.spline)
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

    compute_curvatureExtremaConstraints_gradient( s: Derivatives, ct: ChenTerms,
            constraintsSign: number[], 
            inactiveConstraints: number[]) {    
    
            let dgx: BernsteinDecompositionR1toR1[] = []
            let dgy: BernsteinDecompositionR1toR1[] = []
            let dgw: BernsteinDecompositionR1toR1[] = []

            const controlPointsLength = this.spline.controlPoints.length
            const totalNumberOfConstraints = constraintsSign.length
            const degree = this.spline.degree

            const D1xD3 = determinant2by2(ct.D1x, ct.D1y, ct.D3x, ct.D3y)
            const D1xD21 = determinant2by2(ct.D1x, ct.D1y, ct.D21x, ct.D21y)
            const D1xD2 = determinant2by2(ct.D1x, ct.D1y, ct.D2x, ct.D2y)
            const D1dotD1 = ct.D1x.multiply(ct.D1x).add(ct.D1y.multiply(ct.D1y))
            const D1dotD2 = ct.D1x.multiply(ct.D2x).add(ct.D1y.multiply(ct.D2y))
    
    
            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                // Can be improved since the same 4 lines occur in the next for loop!
                let dD1 = this.dBasisFunctions_du[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wu, start, lessThan))
                let dD2 = this.d2BasisFunctions_du2[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuu, start, lessThan))
                let dD3 = this.d3BasisFunctions_du3[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuuu, start, lessThan))
                let dD21 = this.d2BasisFunctions_du2[i].multiplyRange(s.wu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.wuu, start, lessThan))

                let dD1xD3 = dD1.multiplyRange2(ct.D3y, start, lessThan).subtract(dD3.multiplyRange2(ct.D1y, start, lessThan))
                let dD1xD21 = dD1.multiplyRange2(ct.D21y, start, lessThan).subtract(dD21.multiplyRange2(ct.D1y, start, lessThan))
                let dD1xD2 = dD1.multiplyRange2(ct.D2y, start, lessThan).subtract(dD2.multiplyRange2(ct.D1y, start, lessThan))
                let dD1dotD1 = dD1.multiplyRange2(ct.D1x, start, lessThan).multiplyByScalar(2)
                let dD1dotD2 = dD1.multiplyRange2(ct.D2x, start, lessThan).add(dD2.multiplyRange2(ct.D1x, start, lessThan))

                let t1a = dD1xD3.multiplyRange2(D1dotD1, start, lessThan)
                let t1b = dD1dotD1.multiplyRange2(D1xD3, start, lessThan)
                let t1 = t1a.add(t1b).multiplyRange2(s.w, start, lessThan)
                let t2a = dD1xD21.multiplyRange2(D1dotD1, start, lessThan)
                let t2b = dD1dotD1.multiplyRange2(D1xD21, start, lessThan)
                let t2 = (t2a.add(t2b)).multiplyRange2(s.w, start, lessThan)
                let t3a = dD1xD2.multiplyRange2(D1dotD1, start, lessThan)
                let t3b = dD1dotD1.multiplyRange2(D1xD2, start, lessThan)
                let t3 = t3a.add(t3b).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2)
                let t4a = dD1xD2.multiplyRange2(D1dotD2, start, lessThan)
                let t4b = dD1dotD2.multiplyRange2(D1xD2, start, lessThan)
                let t4 = t4a.add(t4b).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3)
                dgx.push(t1.add(t2).add(t3).add(t4))
            }

            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let dD1 = this.dBasisFunctions_du[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wu, start, lessThan))
                let dD2 = this.d2BasisFunctions_du2[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuu, start, lessThan))
                let dD3 = this.d3BasisFunctions_du3[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuuu, start, lessThan))
                let dD21 = this.d2BasisFunctions_du2[i].multiplyRange(s.wu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.wuu, start, lessThan))
                let dD1xD3 = dD3.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D3x, start, lessThan))
                let dD1xD21 = dD21.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D21x, start, lessThan))
                let dD1xD2 = dD2.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D2x, start, lessThan))
                let dD1dotD1 = dD1.multiplyRange2(ct.D1y, start, lessThan).multiplyByScalar(2)
                let dD1dotD2 = dD1.multiplyRange2(ct.D2y, start, lessThan).add(dD2.multiplyRange2(ct.D1y, start, lessThan))
                
                let t1a = dD1xD3.multiplyRange2(D1dotD1, start, lessThan)
                let t1b = dD1dotD1.multiplyRange2(D1xD3, start, lessThan)
                let t1 = t1a.add(t1b).multiplyRange2(s.w, start, lessThan)
                let t2a = dD1xD21.multiplyRange2(D1dotD1, start, lessThan)
                let t2b = dD1dotD1.multiplyRange2(D1xD21, start, lessThan)
                let t2 = t2a.add(t2b).multiplyRange2(s.w, start, lessThan)
                let t3a = dD1xD2.multiplyRange2(D1dotD1, start, lessThan)
                let t3b = dD1dotD1.multiplyRange2(D1xD2, start, lessThan)
                let t3 = t3a.add(t3b).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2)
                let t4a = dD1xD2.multiplyRange2(D1dotD2, start, lessThan)
                let t4b = dD1dotD2.multiplyRange2(D1xD2, start, lessThan)
                let t4 = t4a.add(t4b).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3)
                dgy.push(t1.add(t2).add(t3).add(t4))
            }

            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)

                let dD1x = this.basisFunctions[i].multiplyRange(s.xu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.x, start, lessThan))
                let dD1y = this.basisFunctions[i].multiplyRange(s.yu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.y, start, lessThan))
                let dD2x = this.basisFunctions[i].multiplyRange(s.xuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.x, start, lessThan))
                let dD2y = this.basisFunctions[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.y, start, lessThan))
                let dD3x = this.basisFunctions[i].multiplyRange(s.xuuu, start, lessThan).subtract(this.d3BasisFunctions_du3[i].multiplyRange(s.x, start, lessThan))
                let dD3y = this.basisFunctions[i].multiplyRange(s.yuuu, start, lessThan).subtract(this.d3BasisFunctions_du3[i].multiplyRange(s.y, start, lessThan))
                let dD21x = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan))
                let dD21y = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan))

                let dD1xD3 = dD1x.multiplyRange2(ct.D3y, start, lessThan).subtract(dD1y.multiplyRange2(ct.D3x, start, lessThan)).add(dD3y.multiplyRange2(ct.D1x, start, lessThan).subtract(dD3x.multiplyRange2(ct.D1y, start, lessThan)))
                let dD1xD21 = dD1x.multiplyRange2(ct.D21y, start, lessThan).subtract(dD1y.multiplyRange2(ct.D21x, start, lessThan)).add(dD21y.multiplyRange2(ct.D1x, start, lessThan).subtract(dD21x.multiplyRange2(ct.D1y, start, lessThan)))
                let dD1xD2 = dD1x.multiplyRange2(ct.D2y, start, lessThan).subtract(dD1y.multiplyRange2(ct.D2x, start, lessThan)).add(dD2y.multiplyRange2(ct.D1x, start, lessThan).subtract(dD2x.multiplyRange2(ct.D1y, start, lessThan)))
                let dD1dotD1 = (dD1x.multiplyRange2(ct.D1x, start, lessThan).add(dD1y.multiplyRange2(ct.D1y, start, lessThan)).multiplyByScalar(2))
                let dD1dotD2 = dD1x.multiplyRange2(ct.D2x, start, lessThan).add(dD2x.multiplyRange2(ct.D1x, start, lessThan)).add(dD1y.multiplyRange2(ct.D2y, start, lessThan).add(dD2y.multiplyRange2(ct.D1y, start, lessThan)))

                let t1a = dD1xD3.multiplyRange2(D1dotD1, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t1b = dD1dotD1.multiplyRange2(D1xD3, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t1c = this.basisFunctions[i].multiplyRange(D1xD3, start, lessThan).multiplyRange2(D1dotD1, start, lessThan)
                let t1 = t1a.add(t1b).add(t1c)

                let t2a = dD1xD21.multiplyRange2(D1dotD1, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t2b = dD1dotD1.multiplyRange2(D1xD21, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t2c = this.basisFunctions[i].multiplyRange(D1xD21, start, lessThan).multiplyRange2(D1dotD1, start, lessThan)
                let t2 = t2a.add(t2b).add(t2c)

                let t3a = dD1xD2.multiplyRange2(D1dotD1, start, lessThan).multiplyRange2(s.wu, start, lessThan)
                let t3b = dD1dotD1.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.wu, start, lessThan)
                let t3c = this.dBasisFunctions_du[i].multiplyRange(D1xD2, start, lessThan).multiplyRange2(D1dotD1, start, lessThan)
                let t3 = (t3a.add(t3b).add(t3c)).multiplyByScalar(2)

                let t4a = dD1xD2.multiplyRange2(D1dotD2, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t4b = dD1dotD2.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.w, start, lessThan)
                let t4c = this.basisFunctions[i].multiplyRange(D1xD2, start, lessThan).multiplyRange2(D1dotD2, start, lessThan)
                let t4 = (t4a.add(t4b).add(t4c)).multiplyByScalar(-3)
                dgw.push(t1.add(t2).add(t3).add(t4))
            }
    
            let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength)
            
            for (let i = 0; i < controlPointsLength; i += 1) {
                let cpx = dgx[i].flattenControlPointsArray();
                let cpy = dgy[i].flattenControlPointsArray();
                let cpw = dgw[i].flattenControlPointsArray();
    
                let start = Math.max(0, i - degree) * (9 * degree - 5)
                let lessThan = Math.min(controlPointsLength - degree, i + 1) * (9 * degree - 5)
    
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
                        result.set(j - deltaj, 2 * controlPointsLength + i, cpw[j - start] * constraintsSign[j])
                    }
                }
                
            }
            return result
            
        }

    compute_inflectionConstraints_gradient( s: Derivatives, constraintsSign: number[], 
        inactiveConstraints: number[]) {

        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        let dgw: BernsteinDecompositionR1toR1[] = []

        const controlPointsLength = this.spline.controlPoints.length
        const degree = this.spline.degree

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = (this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan))).multiplyRange2(s.w, start, lessThan)
            let t2 = (this.basisFunctions[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.y, start, lessThan))).multiplyRange2(s.wu, start, lessThan)
            let t3 = (this.dBasisFunctions_du[i].multiplyRange(s.y, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.yu, start, lessThan))).multiplyRange2(s.wuu, start, lessThan)
            dgx.push(t1.subtract(t2).subtract(t3))
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = (this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan))).multiplyRange2(s.w, start, lessThan)
            let t2 = (this.d2BasisFunctions_du2[i].multiplyRange(s.x, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.xuu, start, lessThan))).multiplyRange2(s.wu, start, lessThan)
            let t3 = (this.basisFunctions[i].multiplyRange(s.xu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.x, start, lessThan))).multiplyRange2(s.wuu, start, lessThan)
            dgy.push(t1.subtract(t2).subtract(t3))
        }

        const h1 = determinant2by2(s.xu, s.yu, s.xuu, s.yuu)
        const h2 = determinant2by2(s.x, s.y, s.xuu, s.yuu)
        const h3 = determinant2by2(s.xu, s.yu, s.x, s.y)

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let t1 = this.basisFunctions[i].multiplyRange(h1, start, lessThan)
            let t2 = this.dBasisFunctions_du[i].multiplyRange(h2, start, lessThan)
            let t3 = this.d2BasisFunctions_du2[i].multiplyRange(h3, start, lessThan)
            dgw.push(t1.subtract(t2).subtract(t3))
        }

        const totalNumberOfConstraints = this.inflectionConstraintsSign.length

        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            const cpx = dgx[i].flattenControlPointsArray()
            const cpy = dgy[i].flattenControlPointsArray()
            const cpw = dgw[i].flattenControlPointsArray()

            let start = Math.max(0, i - degree) * (3 * degree - 2)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (3 * degree - 2)

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
                    result.set(j - deltaj, 2 * controlPointsLength + i, cpw[j - start] * constraintsSign[j])
                }
            }
        }

        return result


    }

    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length
        //???????
        //this._numberOfIndependentVariables = n * 2
        let diracControlPoints = zeroVector(n)
        this.basisFunctions = []
        this.dBasisFunctions_du = []
        this.d2BasisFunctions_du2 = []
        this.d3BasisFunctions_du3 = []
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice())
            let dBasisFunction_du = basisFunction.derivative()
            let d2BasisFunction_du2 = dBasisFunction_du.derivative()
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative()
            this.basisFunctions.push(basisFunction.bernsteinDecomposition())
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition())
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition())
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition())
            diracControlPoints[i] = 0
        }
    } 

}