import { OptimizationProblemInterface } from "./OptimizationProblemInterface"
import { PeriodicBSplineR1toR2 } from "../bsplines/PeriodicBSplineR1toR2"
import { zeroVector, containsNaN } from "../linearAlgebra/MathVectorBasicOperations"
import { PeriodicBSplineR1toR1 } from "../bsplines/PeriodicBSplineR1toR1"
import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1"
import { SymmetricMatrixInterface } from "../linearAlgebra/MatrixInterfaces"
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface"
import { AbstractOptimizationProblemBSplineR1toR2, ActiveControl } from "./AbstractOptimizationProblemBSplineR1toR2"



class ExpensiveComputationResults {

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
    constructor(public bdsxu: BernsteinDecompositionR1toR1,
        public bdsyu: BernsteinDecompositionR1toR1,
        public bdsxuu: BernsteinDecompositionR1toR1, 
        public bdsyuu: BernsteinDecompositionR1toR1, 
        public bdsxuuu: BernsteinDecompositionR1toR1, 
        public bdsyuuu: BernsteinDecompositionR1toR1, 
        public h1: BernsteinDecompositionR1toR1, 
        public h2: BernsteinDecompositionR1toR1, 
        public h3: BernsteinDecompositionR1toR1, 
        public h4: BernsteinDecompositionR1toR1) {}

}




export class OptimizationProblemPeriodicBSplineR1toR2 extends AbstractOptimizationProblemBSplineR1toR2 {

    public spline: PeriodicBSplineR1toR2
    private _target: PeriodicBSplineR1toR2
    readonly Dsu: BernsteinDecompositionR1toR1[]
    readonly Dsuu: BernsteinDecompositionR1toR1[]
    readonly Dsuuu: BernsteinDecompositionR1toR1[]

    private curvatureExtremaConstraintsSign: number[] = []
    private curvatureExtremaInactiveConstraints: number[] = []
    private inflectionConstraintsSign: number[] = []
    private inflectionInactiveConstraints: number[] = []

    private _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    private _hessian_f0: SymmetricMatrixInterface

    private _curvatureExtremaNumberOfActiveConstraints: number
    private _inflectionNumberOfActiveConstraints: number
    private curvatureExtremaTotalNumberOfConstraints: number
    private inflectionTotalNumberOfConstraints: number

    //private totalNumberOfConstraints: number
    private _f: number[]
    private _gradient_f: DenseMatrix
    private _hessian_f: SymmetricMatrixInterface[] | undefined = undefined

    constructor(target: PeriodicBSplineR1toR2, initial: PeriodicBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super()
        this.spline = initial.clone()
        this._target = target.clone()
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
            let s = new PeriodicBSplineR1toR1(diracControlPoints.slice(), this.spline.knots.slice())
            let su = s.derivative()
            let suu = su.derivative()
            let suuu = suu.derivative()
            this.Dsu.push(new BernsteinDecompositionR1toR1(su.bernsteinDecomposition()))
            this.Dsuu.push(new BernsteinDecompositionR1toR1(suu.bernsteinDecomposition()))
            this.Dsuuu.push(new BernsteinDecompositionR1toR1(suuu.bernsteinDecomposition()))
            diracControlPoints[i] = 0
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0
            }
        }

        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this.gradient_f0)
        this._hessian_f0 = identityMatrix(this.numberOfIndependentVariables)
        const e = this.expensiveComputation(this.spline)


        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionTotalNumberOfConstraints = curvatureNumerator.length

        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaTotalNumberOfConstraints = g.length

        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length


        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length

        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        
        if (this._f.length !== this._gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the construtor")
        }
    
    }



    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables
    }



    get curvatureExtremaConstraintsFreeIndices() {
        return this.curvatureExtremaInactiveConstraints
    }

    get inflectionConstraintsFreeIndices() {
        return this.inflectionInactiveConstraints
    }

    get numberOfConstraints() {
        return this._curvatureExtremaNumberOfActiveConstraints + this._inflectionNumberOfActiveConstraints
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

    get f() {
        if (containsNaN(this._f)) {
            throw new Error("OptimizationProblem_PeriodicBSpline_R1_to_R2 contains Nan in its f vector")
        }

        if (this._f.length !== this._gradient_f.shape[0]) {
            console.log(this._f.length)
            console.log(this._gradient_f.shape)
            throw new Error("Problem f.length !== gradient_f shape[0]")
        }
        return this._f
    }

    get gradient_f() {
        if (this._f.length !== this._gradient_f.shape[0]) {
            console.log(this._f.length)
            console.log(this._gradient_f.shape)
            throw new Error("Problem f.length !== gradient_f shape[0]")
        }
        return this._gradient_f
    }

    get hessian_f() {
        return this._hessian_f
    }


    step(deltaX: number[]) {
        this.spline.optimizerStep(deltaX)
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this.spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length

        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length

        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        if (this._f.length !== this._gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the function step")
        }

    }

    curvatureNumerator(h4: BernsteinDecompositionR1toR1) {
        return h4.flattenControlPointsArray()
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

    compute_gradient_f0(spline: BSplineR1toR2Interface) {
        let result: number[] = []
        const n =  spline.freeControlPoints.length
        for (let i = 0; i < n; i += 1) {
            result.push(spline.controlPoints[i].x - this._target.controlPoints[i].x);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.controlPoints[i].y - this._target.controlPoints[i].y);
        }
        return result;
    }

    //f0: function to minimize
    compute_f0(gradient_f0: number[]) {
        let result = 0
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2)
        }
        return 0.5 * result;
    }



    curvatureDerivativeNumerator(h1: BernsteinDecompositionR1toR1, 
                h2: BernsteinDecompositionR1toR1, 
                h3: BernsteinDecompositionR1toR1, 
                h4: BernsteinDecompositionR1toR1) {
        const g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3))
        let result = g.flattenControlPointsArray()
        return result
    }

    g() {
        const e = this.expensiveComputation(this.spline)
        return this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
    }

    gradient_g() {
        const e = this.expensiveComputation(this.spline)
        return this.compute_curvatureExtremaConstraints_gradient(e, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
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

    compute_gradient_f(e: ExpensiveComputationResults,
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
        const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints
        const degree = this.spline.degree

        const periodicControlPointsLength = this.spline.freeControlPoints.length

        

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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength)


        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5)


            let deltaj = 0
            for (let j = 0; j < inactiveConstraints.length; j += 1) {
                if (inactiveConstraints[j] >= start) {
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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()

            let start = (i - degree) * (4 * degree - 5)
            let lessThan = (periodicControlPointsLength) * (4 * degree - 5)

            let deltaj = 0
            for (let k = 0; k < inactiveConstraints.length; k += 1) {
                if (inactiveConstraints[k] >= start) {
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

        const degree = this.spline.degree

        const periodicControlPointsLength = this.spline.freeControlPoints.length

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
           for (let i = 0; i < inactiveConstraints.length; i += 1) {
               if (inactiveConstraints[i] >= start) {
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
            for (let k = 0; k < inactiveConstraints.length; k += 1) {
                if (inactiveConstraints[k] >= start) {
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



    



    expensiveComputation(spline: BSplineR1toR2Interface) {
        const sx = new PeriodicBSplineR1toR1(spline.getControlPointsX(), spline.knots)
        const sy = new PeriodicBSplineR1toR1(spline.getControlPointsY(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const bdsxu = new BernsteinDecompositionR1toR1(sxu.bernsteinDecomposition())
        const bdsyu = new BernsteinDecompositionR1toR1(syu.bernsteinDecomposition())
        const bdsxuu = new BernsteinDecompositionR1toR1(sxuu.bernsteinDecomposition())
        const bdsyuu = new BernsteinDecompositionR1toR1(syuu.bernsteinDecomposition())
        const bdsxuuu = new BernsteinDecompositionR1toR1(sxuuu.bernsteinDecomposition())
        const bdsyuuu = new BernsteinDecompositionR1toR1(syuuu.bernsteinDecomposition())
        const h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu))
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu))
        const h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu))
        const h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu))


        return new ExpensiveComputationResults(bdsxu, bdsyu, bdsxuu, bdsyuu, bdsxuuu, bdsyuuu, h1, h2, h3, h4)
    }
    






    



    /**
     * The vector of constraint functions values: f(x + step)
     */
    fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        let e = this.expensiveComputation(splineTemp)
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
    }





    /**
     * The objective function value: f0(x + step)
     */
    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        return this.compute_f0(this.compute_gradient_f0(splineTemp))
    }

    setTargetSpline(spline: PeriodicBSplineR1toR2) {
        this._target = spline
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this.gradient_f0)
        
    }


}

