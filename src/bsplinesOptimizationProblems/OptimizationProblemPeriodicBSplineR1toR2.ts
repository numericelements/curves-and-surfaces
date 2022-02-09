import { PeriodicBSplineR1toR2 } from "../bsplines/PeriodicBSplineR1toR2"
import { zeroVector} from "../linearAlgebra/MathVectorBasicOperations"
import { PeriodicBSplineR1toR1 } from "../bsplines/PeriodicBSplineR1toR1"
import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { AbstractOptimizationProblemBSplineR1toR2, ActiveControl, ExpensiveComputationResults } from "./AbstractOptimizationProblemBSplineR1toR2"



export class OptimizationProblemPeriodicBSplineR1toR2 extends AbstractOptimizationProblemBSplineR1toR2 {

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
     * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.  
     * A curvature extremum is located between two coefficient of different signs. 
     * For the general case, the smallest coefficient in absolute value is chosen to be free.
     * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
     * 
     * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
     * @param curvatureDerivativeNumerator The vector of value of the function: f_i
     */
    computeInactiveConstraints(constraintsSign: number[], controlPoints: number[]) {
        let result: number[] = []
        const n = constraintsSign.length
        let previousSign = constraintsSign[n - 1]
        if (previousSign !== constraintsSign[0]) {
            if (Math.pow(controlPoints[n - 1], 2) >= Math.pow(controlPoints[0], 2) ) {
                result.push(0)
            }
        }
        previousSign = constraintsSign[0]
        for (let i = 1, n = constraintsSign.length; i < n; i += 1) {
            if (previousSign !== constraintsSign[i]) {
                if (i + 1 < n - 1 && constraintsSign[i+1] !== constraintsSign[i]) {
                    result.push(i)
                    i += 1
                } else if (result[0] === 0 && i - 1 === 0) {
                   // do nothing 
                } else if (Math.pow(controlPoints[i - 1], 2) < Math.pow(controlPoints[i], 2)) {
                    result.push(i - 1)
                } else {
                    result.push(i)
                }
            }
            previousSign = constraintsSign[i]
        }

        if (previousSign !== constraintsSign[0]) {
            if (Math.pow(controlPoints[n - 1], 2) < Math.pow(controlPoints[0], 2) ) {
                if (result[result.length - 1] !== n-1) {
                    result.push(n-1)
                }
            }
        }

        let result1: number [] = []
        for (let i = 0, n = result.length; i < n; i += 1) {
            if (result[i] !== 0 && controlPoints[result[i] - 1] === controlPoints[result[i]] ) {
                if (i == 0) {
                    result1.push(result[i] - 1)
                }
                if (i !== 0 && result[i-1] !== result[i] - 1) {
                    result1.push(result[i] - 1)
                }
            }
            result1.push(result[i])

            if (result[i] !== controlPoints.length - 2 && controlPoints[result[i]] === controlPoints[result[i] + 1] ) {
                if (i == result.length - 1) {
                    result1.push(result[i] + 1)
                }
                if (i !== result.length - 1 && result[i + 1] !== result[i] + 1) {
                    result1.push(result[i] + 1)
                }
            }

        }

        return result1


    }

    /*
    gradient_g() {
        const e = this.expensiveComputation(this.spline)
        return this.compute_curvatureExtremaConstraints_gradient(e, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
    }
    */
    
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


        let dgx = []
        let dgy = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints
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
            let h5 = this.Dsu[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.Dsu[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.Dsuuu[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.Dsu[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.Dsuu[i], start, lessThan)
            let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.Dsu[i].multiplyRange(syu, start, lessThan)
            let h6 = this.Dsu[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.Dsuuu[i], start, lessThan)
            let h8 = this.Dsu[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.Dsuu[i], start, lessThan)
            let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan)
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
            let h5 = this.Dsu[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.Dsu[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.Dsuuu[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.Dsu[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.Dsuu[i], start, lessThan)
            let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength
            let lessThan = periodicControlPointsLength
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.Dsu[i].multiplyRange(syu, start, lessThan)
            let h6 = this.Dsu[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.Dsuuu[i], start, lessThan)
            let h8 = this.Dsu[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.Dsuu[i], start, lessThan)
            let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan)
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


        let dgx = []
        let dgy = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const degree = this.spline.degree    

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
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

            let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h10.add(h11)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength
            
            let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan)
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

    computeDs() {
        const n = this.spline.controlPoints.length
        const m = this.spline.freeControlPoints.length
        this._numberOfIndependentVariables = m * 2
        let diracControlPoints = zeroVector(n)
        this.Dsu = []
        this.Dsuu = []
        this.Dsuuu = []
        for (let i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 1
            }
            let s = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice())
            let su = s.derivative()
            let suu = su.derivative()
            let suuu = suu.derivative()
            this.Dsu.push(su.bernsteinDecomposition())
            this.Dsuu.push(suu.bernsteinDecomposition())
            this.Dsuuu.push(suuu.bernsteinDecomposition())
            diracControlPoints[i] = 0
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0
            }
        }

    }


}