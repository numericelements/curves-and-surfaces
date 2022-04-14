import { PeriodicBSplineR1toR2 } from "../bsplines/R1toR2/PeriodicBSplineR1toR2"
import { zeroVector} from "../linearAlgebra/MathVectorBasicOperations"
import { PeriodicBSplineR1toR1 } from "../bsplines/R1toR1/PeriodicBSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { BaseOpProblemBSplineR1toR2, ActiveControl, ExpensiveComputationResults } from "./BaseOpBSplineR1toR2"
import { BernsteinDecompositionR1toR1 } from "../bsplines/R1toR1/BernsteinDecompositionR1toR1"



export class OpPeriodicBSplineR1toR2 extends BaseOpProblemBSplineR1toR2 {

    constructor(target: PeriodicBSplineR1toR2, initial: PeriodicBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl) 
    }

    get spline(): PeriodicBSplineR1toR2 {
        return this._spline as PeriodicBSplineR1toR2
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): PeriodicBSplineR1toR1 {
        return new PeriodicBSplineR1toR1(controlPoints, knots)
    }

    setTargetSpline(spline: PeriodicBSplineR1toR2) {
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
        let result = this.extractControlPointsClosestToZero(controlPointsSequences)
        const firstCP = controlPoints[0]
        const lastCP = controlPoints[controlPoints.length -1]
        if (firstCP * lastCP <= 0) {
            if (Math.pow(firstCP,2) <= Math.pow(lastCP,2)) {
                if (result[0] != 0) {
                    result = [0].concat(result)
                }
            }
            else {
                if (result[result.length -1] != controlPoints.length -1) {
                    result.push(controlPoints.length -1)
                }
            }
        }
        return result
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


    
    compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const sxuuu = e.bdsxuuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu
        const syuuu = e.bdsyuuu
        const h1 = e.h1
        const h2 = e.h2
        const h3 = e.h3
        const h4 = e.h4


        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const totalNumberOfConstraints = constraintsSign.length
        const degree = this.spline.degree


        for (let i = 0; i < periodicControlPointsLength; i += 1) {

            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]

            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength)


        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5)

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
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j])
                }
            }
        }

        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {

            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]

            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength
            let lessThan = periodicControlPointsLength
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()

            let start = (i - degree) * (4 * degree - 5)
            let lessThan = (periodicControlPointsLength) * (4 * degree - 5)

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
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j])
                    result.set(j - deltaj,  i, cpy[j - start] * constraintsSign[j])
                }
            }
        }
        return result       
    }
    
    compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu


        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const degree = this.spline.degree    

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }

       const totalNumberOfConstraints = this.inflectionConstraintsSign.length

       let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength)


       for (let i = 0; i < periodicControlPointsLength; i += 1) {
           let cpx = dgx[i].flattenControlPointsArray();
           let cpy = dgy[i].flattenControlPointsArray();

           let start = Math.max(0, i - degree) * (2 * degree - 2)
           let lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2)

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
                   result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j])
               }
           }
       }

       
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {

            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]


            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength

            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h10.add(h11)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength
            
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push(h10.add(h11))
        }


        
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()

            let start = Math.max(0, i - degree) * (2 * degree - 2)
            let lessThan = (periodicControlPointsLength) * (2 * degree - 2)

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
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j])
                    result.set(j - deltaj,  i, cpy[j - start] * constraintsSign[j])
                }
            }
        }


       return result


    }

    computeBasisFunctionsDerivatives() {
        const n = this.spline.controlPoints.length
        const m = this.spline.freeControlPoints.length
        this._numberOfIndependentVariables = m * 2
        let diracControlPoints = zeroVector(n)
        this.dBasisFunctions_du = []
        this.d2BasisFunctions_du2 = []
        this.d3BasisFunctions_du3 = []
        for (let i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 1
            }
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice())
            let dBasisFunction_du = basisFunction.derivative()
            let d2BasisFunction_du2 = dBasisFunction_du.derivative()
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative()
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition())
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition())
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition())
            diracControlPoints[i] = 0
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0
            }
        }

    }


}