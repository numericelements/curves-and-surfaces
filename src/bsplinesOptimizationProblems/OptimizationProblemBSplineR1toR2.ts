import { BSplineR1toR2 } from "../bsplines/BSplineR1toR2"
import { BSplineR1toR1 } from "../bsplines/BSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { AbstractOptimizationProblemBSplineR1toR2, ActiveControl, ExpensiveComputationResults } from "./AbstractOptimizationProblemBSplineR1toR2"
import { zeroVector } from "../linearAlgebra/MathVectorBasicOperations"



export class OptimizationProblemBSplineR1toR2 extends AbstractOptimizationProblemBSplineR1toR2 {
    
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
     * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.  
     * A curvature extremum is located between two coefficient of different signs. 
     * For the general case, the smallest coefficient in absolute value is chosen to be free.
     * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
     * 
     * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
     * @param curvatureDerivativeNumerator The vector of value of the function: f_i
     */
    computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
        let result: number[] = []
        let previousSign = constraintsSign[0]
        for (let i = 1, n = constraintsSign.length; i < n; i += 1) {
            if (previousSign !== constraintsSign[i]) {
                if (i + 1 < n - 1 && constraintsSign[i+1] !== constraintsSign[i]){
                    result.push(i)
                    i += 1
                } else if (Math.pow(curvatureDerivativeNumerator[i - 1], 2) < Math.pow(curvatureDerivativeNumerator[i], 2)) {
                    result.push(i - 1);
                } else {
                    result.push(i);
                }
            }
            previousSign = constraintsSign[i];
        }
        return result
    }

    /*
    gradient_g() {
        const e = this.expensiveComputation(this.spline)
        return this.gradient_curvatureDerivativeNumerator(e)
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
            const controlPointsLength = this.spline.controlPoints.length
            const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints
            const degree = this.spline.degree
    
    
            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let h1_subset = h1.subset(start, lessThan)
                let h2_subset = h2.subset(start, lessThan)
                let h3_subset = h3.subset(start, lessThan)
                let h4_subset = h4.subset(start, lessThan)
                let h5 = this.Dsu[i].multiplyRange(sxu, start, lessThan);
                let h6 = this.Dsu[i].multiplyRange(syuuu, start, lessThan);
                let h7 = syu.multiplyRange(this.Dsuuu[i], start, lessThan).multiplyByScalar(-1);
                let h8 = this.Dsu[i].multiplyRange(sxuu, start, lessThan);
                let h9 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
                let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
                let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1);
                dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
            }
    
            for (let i = 0; i < controlPointsLength; i += 1) {
                let start = Math.max(0, i - degree)
                let lessThan = Math.min(controlPointsLength - degree, i + 1)
                let h1_subset = h1.subset(start, lessThan)
                let h2_subset = h2.subset(start, lessThan)
                let h3_subset = h3.subset(start, lessThan)
                let h4_subset = h4.subset(start, lessThan)
                let h5 = this.Dsu[i].multiplyRange(syu, start, lessThan);
                let h6 = this.Dsu[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
                let h7 = sxu.multiplyRange(this.Dsuuu[i], start, lessThan);
                let h8 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
                let h9 = syu.multiplyRange(this.Dsuu[i], start, lessThan);
                let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
                let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
                dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
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


    
    compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {

        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu


        let dgx = []
        let dgy = []
        const controlPointsLength = this.spline.controlPoints.length
        const degree = this.spline.degree

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(controlPointsLength - degree, i + 1)
            let h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
            dgy.push(h10.add(h11));
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

    computeDs() {
        const n = this._spline.controlPoints.length
        this._numberOfIndependentVariables = n * 2
        let diracControlPoints = zeroVector(n)
        this.Dsu = []
        this.Dsuu = []
        this.Dsuuu = []
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1
            let s = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice())
            let su = s.derivative()
            let suu = su.derivative()
            let suuu = suu.derivative()
            this.Dsu.push(su.bernsteinDecomposition())
            this.Dsuu.push(suu.bernsteinDecomposition())
            this.Dsuuu.push(suuu.bernsteinDecomposition())
            diracControlPoints[i] = 0
        }
    }





/*
    gradient_curvatureDerivativeNumerator( e: ExpensiveComputationResults) {

    let dgx = []
    let dgy = []
    const m = this.spline.controlPoints.length
    const n = this.curvatureExtremaTotalNumberOfConstraints

    let result = new DenseMatrix(n, 2 * m)

    for (let i = 0; i < m; i += 1) {
        let h5 = this.Dsu[i].multiply(e.bdsxu);
        let h6 = this.Dsu[i].multiply(e.bdsyuuu);
        let h7 = e.bdsyu.multiply(this.Dsuuu[i]).multiplyByScalar(-1);
        let h8 = this.Dsu[i].multiply(e.bdsxuu);
        let h9 = e.bdsxu.multiply(this.Dsuu[i]);
        let h10 = this.Dsu[i].multiply(e.bdsyuu);
        let h11 = e.bdsyu.multiply(this.Dsuu[i]).multiplyByScalar(-1);
        dgx.push((h5.multiply(e.h2).multiplyByScalar(2)).add(e.h1.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(e.h4)).add((h10.add(h11)).multiply(e.h3))).multiplyByScalar(-3)));
    }

    for (let i = 0; i < m; i += 1) {
        let h5 = this.Dsu[i].multiply(e.bdsyu);
        let h6 = this.Dsu[i].multiply(e.bdsxuuu).multiplyByScalar(-1);
        let h7 = e.bdsxu.multiply(this.Dsuuu[i]);
        let h8 = this.Dsu[i].multiply(e.bdsyuu);
        let h9 = e.bdsyu.multiply(this.Dsuu[i]);
        let h10 = this.Dsu[i].multiply(e.bdsxuu).multiplyByScalar(-1);
        let h11 = e.bdsxu.multiply(this.Dsuu[i]);
        dgy.push((h5.multiply(e.h2).multiplyByScalar(2)).add(e.h1.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(e.h4)).add((h10.add(h11)).multiply(e.h3))).multiplyByScalar(-3)));
    }

    for (let i = 0; i < m; i += 1) {
        let cpx = dgx[i].flattenControlPointsArray();
        let cpy = dgy[i].flattenControlPointsArray();
        for (let j = 0; j < n; j += 1) {
            result.set(j, i, cpx[j])
            result.set(j, m + i, cpy[j])
        }
    }

    return result
}
*/





        
    

}