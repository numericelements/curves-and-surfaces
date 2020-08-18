import { OptimizationProblemInterface } from "./OptimizationProblemInterface"
import { BSpline_R1_to_R2 } from "./BSpline_R1_to_R2";
import { zeroVector, containsNaN, sign } from "./MathVectorBasicOperations";
import { BSpline_R1_to_R1 } from "./BSpline_R1_to_R1";
import { BernsteinDecomposition_R1_to_R1 } from "./BernsteinDecomposition_R1_to_R1";
import { SymmetricMatrixInterface } from "./MatrixInterfaces";
import { identityMatrix, DiagonalMatrix } from "./DiagonalMatrix";
import { DenseMatrix } from "./DenseMatrix";
import { SymmetricMatrix } from "./SymmetricMatrix";


class ExpensiveComputationResults {

    constructor(public bdsxu: BernsteinDecomposition_R1_to_R1,
        public bdsyu: BernsteinDecomposition_R1_to_R1,
        public bdsxuu: BernsteinDecomposition_R1_to_R1, 
        public bdsyuu: BernsteinDecomposition_R1_to_R1, 
        public bdsxuuu: BernsteinDecomposition_R1_to_R1, 
        public bdsyuuu: BernsteinDecomposition_R1_to_R1, 
        public h1: BernsteinDecomposition_R1_to_R1, 
        public h2: BernsteinDecomposition_R1_to_R1, 
        public h3: BernsteinDecomposition_R1_to_R1, 
        public h4: BernsteinDecomposition_R1_to_R1) {}

}

export enum ActiveControl {curvatureExtrema, inflections, both}



export class OptimizationProblem_BSpline_R1_to_R2 implements OptimizationProblemInterface {

    public spline: BSpline_R1_to_R2
    private _target: BSpline_R1_to_R2
    readonly Dsu: BernsteinDecomposition_R1_to_R1[]
    readonly Dsuu: BernsteinDecomposition_R1_to_R1[]
    readonly Dsuuu: BernsteinDecomposition_R1_to_R1[]


    private curvatureExtremaConstraintsSign: number[] = []
    private curvatureExtremaInactiveConstraints: number[] = []

    private inflectionConstraintsSign: number[] = []
    private inflectionInactiveConstraints: number[] = []

    private _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    protected _hessian_f0: SymmetricMatrixInterface

    private _curvatureExtremaNumberOfActiveConstraints: number
    private _inflectionNumberOfActiveConstraints: number
    private curvatureExtremaTotalNumberOfConstraints: number
    private inflectionTotalNumberOfConstraints: number

    private _f: number[]
    private _gradient_f: DenseMatrix
    //private _hessian_f: SymmetricMatrixInterface[] | undefined = undefined
    private _hessian_f: SymmetricMatrix[] | undefined = undefined
    readonly isComputingHessian: boolean = false
    private Dh5xx: BernsteinDecomposition_R1_to_R1[][] = []
    private Dh6_7xy: BernsteinDecomposition_R1_to_R1[][] = []
    private Dh8_9xx: BernsteinDecomposition_R1_to_R1[][] = []
    private Dh10_11xy: BernsteinDecomposition_R1_to_R1[][] = []

    //public activeControl: ActiveControl = ActiveControl.both



    constructor(target: BSpline_R1_to_R2, initial: BSpline_R1_to_R2, public activeControl: ActiveControl = ActiveControl.both) {
        this.spline = initial.clone()
        this._target = target.clone()
        const n = this.spline.controlPoints.length
        this._numberOfIndependentVariables = n * 2
        let diracControlPoints = zeroVector(n)
        this.Dsu = []
        this.Dsuu = []
        this.Dsuuu = []
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1
            let s = new BSpline_R1_to_R1(diracControlPoints.slice(), this.spline.knots.slice())
            let su = s.derivative()
            let suu = su.derivative()
            let suuu = suu.derivative()
            this.Dsu.push(new BernsteinDecomposition_R1_to_R1(su.bernsteinDecomposition()))
            this.Dsuu.push(new BernsteinDecomposition_R1_to_R1(suu.bernsteinDecomposition()))
            this.Dsuuu.push(new BernsteinDecomposition_R1_to_R1(suuu.bernsteinDecomposition()))
            diracControlPoints[i] = 0
        }


        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        this._hessian_f0 = identityMatrix(this.numberOfIndependentVariables)
        const e = this.expensiveComputation(this.spline)


        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionTotalNumberOfConstraints = curvatureNumerator.length

        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaTotalNumberOfConstraints = g.length

        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length
        console.log("optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)


        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length


        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        
        if (this.isComputingHessian) {
            this.prepareForHessianComputation(this.Dsu, this.Dsuu, this.Dsuuu)
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }
    }



    set targetSpline(spline: BSpline_R1_to_R2) {
        this._target = spline
    }

    get curvatureExtremaConstraintsFreeIndices() {
        return this.curvatureExtremaInactiveConstraints
    }

    get inflectionConstraintsFreeIndices() {
        return this.inflectionInactiveConstraints
    }

    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables
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
            throw new Error("OptimizationProblem_BSpline_R1_to_R2 contains Nan in its f vector")
        }
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

        if (this.isComputingHessian) {
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }
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
        //console.log(result.length)
        return result
    }

    computeSignChangeIntervals(constraintsSign: number[]) {
        let signChangesIntervals: number[] = []
        let previousSign = constraintsSign[0]
        for (let i = 1, n = constraintsSign.length; i < n; i += 1) {
            if (previousSign !== constraintsSign[i]) {
                signChangesIntervals.push(i - 1)
            }
            previousSign = constraintsSign[i]
        }
        return signChangesIntervals
    }

    computeControlPointsClosestToZero(signChangesIntervals: number[], controlPoints: number[]) {
        let result: number[] = []
        for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
                result.push(signChangesIntervals[i] + 1)
                i += 1
            }
            else {
                if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
                    result.push(signChangesIntervals[i]);
                } else {
                    result.push(signChangesIntervals[i] + 1);
                }
            }
        }
        //console.log("degree: " + this.spline.degree + " nbKnot: " + this.spline.distinctKnots().length)
        if(this.spline.degree === 3 && controlPoints.length === (this.spline.distinctKnots().length - 1)*7){
            let n = Math.trunc(controlPoints.length/7);
            console.log("degree: " + this.spline.degree + " nbCP: " + controlPoints.length)
            for(let j = 1; j < n ; j += 1) {
                if(controlPoints[6*j]*controlPoints[6*j + 1] < 0) {
                    //console.log("CP: " + controlPoints)
                    if(result.indexOf(6*j) > 0 && result.indexOf(6*j + 1) < 0) {
                        result.push(6*j + 1);
                    } else if(result.indexOf(6*j) < 0 && result.indexOf(6*j + 1) > 0) {
                        result.push(6*j);
                    }
                }
            }
            result.sort();
        }
        
        return result
    }

    addInactiveConstraintsForInflections(list: number[], controlPoints: number[]) {
        let result: number[] = []
        for (let i = 0, n = list.length; i < n; i += 1) {
            if (list[i] !== 0 && controlPoints[list[i] - 1] === controlPoints[list[i]] ) {
                if (i == 0) {
                    result.push(list[i] - 1)
                }
                if (i !== 0 && list[i-1] !== list[i] - 1) {
                    result.push(list[i] - 1)
                }
            }
            result.push(list[i])

            if (list[i] !== controlPoints.length - 2 && controlPoints[list[i]] === controlPoints[list[i] + 1] ) {
                if (i == list.length - 1) {
                    result.push(list[i] + 1)
                }
                if (i !== list.length - 1 && list[i + 1] !== list[i] + 1) {
                    result.push(list[i] + 1)
                }
            }
        }
        return result
    }

    /**
     * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.  
     * A curvature extremum or an inflection is located between two coefficient of different signs. 
     * For the general case, the smallest coefficient in absolute value is chosen to be free.
     * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
     * 
     * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
     * @param controlPoints The vector of value of the function: f_i
     */
    computeInactiveConstraints(constraintsSign: number[], controlPoints: number[]) {
        let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
        let controlPointsClosestToZero = this.computeControlPointsClosestToZero(signChangesIntervals, controlPoints)
        let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
        return result
    }

    compute_gradient_f0(spline: BSpline_R1_to_R2) {
        let result: number[] = []
        const n =  spline.controlPoints.length;
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
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    }

    curvatureNumerator(h4: BernsteinDecomposition_R1_to_R1) {
        return h4.flattenControlPointsArray()
    }

    curvatureDerivativeNumerator(h1: BernsteinDecomposition_R1_to_R1, 
                h2: BernsteinDecomposition_R1_to_R1, 
                h3: BernsteinDecomposition_R1_to_R1, 
                h4: BernsteinDecomposition_R1_to_R1) {
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
        return this.gradient_curvatureDerivativeNumerator(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4)

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



    compute_f(curvatureNumerator: number[], inflectionConstraintsSign: number[], inflectionInactiveConstraints: number[], curvatureDerivativeNumerator: number[], curvatureExtremaConstraintsSign: number[], curvatureExtremaInactiveConstraints: number[]) {
        //let result: number[] = []

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

    expensiveComputation(spline: BSpline_R1_to_R2) {
        const sx = new BSpline_R1_to_R1(spline.getControlPointsX(), spline.knots),
        sy = new BSpline_R1_to_R1(spline.getControlPointsY(), spline.knots),
        sxu = sx.derivative(),
        syu = sy.derivative(),
        sxuu = sxu.derivative(),
        syuu = syu.derivative(),
        sxuuu = sxuu.derivative(),
        syuuu = syuu.derivative(),
        bdsxu = new BernsteinDecomposition_R1_to_R1(sxu.bernsteinDecomposition()),
        bdsyu = new BernsteinDecomposition_R1_to_R1(syu.bernsteinDecomposition()),
        bdsxuu = new BernsteinDecomposition_R1_to_R1(sxuu.bernsteinDecomposition()),
        bdsyuu = new BernsteinDecomposition_R1_to_R1(syuu.bernsteinDecomposition()),
        bdsxuuu = new BernsteinDecomposition_R1_to_R1(sxuuu.bernsteinDecomposition()),
        bdsyuuu = new BernsteinDecomposition_R1_to_R1(syuuu.bernsteinDecomposition()),
        h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu)),
        h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu)),
        h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu)),
        h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));

       return new ExpensiveComputationResults(bdsxu, bdsyu, bdsxuu, bdsyuu, bdsxuuu, bdsyuuu, h1, h2, h3, h4)
    }

    gradient_curvatureDerivativeNumerator( sxu: BernsteinDecomposition_R1_to_R1, 
                syu: BernsteinDecomposition_R1_to_R1, 
                sxuu: BernsteinDecomposition_R1_to_R1, 
                syuu: BernsteinDecomposition_R1_to_R1, 
                sxuuu: BernsteinDecomposition_R1_to_R1, 
                syuuu: BernsteinDecomposition_R1_to_R1, 
                h1: BernsteinDecomposition_R1_to_R1, 
                h2: BernsteinDecomposition_R1_to_R1, 
                h3: BernsteinDecomposition_R1_to_R1, 
                h4: BernsteinDecomposition_R1_to_R1) {

        let dgx = []
        let dgy = []
        const m = this.spline.controlPoints.length
        const n = this.curvatureExtremaTotalNumberOfConstraints

        let result = new DenseMatrix(n, 2 * m)

        for (let i = 0; i < m; i += 1) {
            let h5 = this.Dsu[i].multiply(sxu);
            let h6 = this.Dsu[i].multiply(syuuu);
            let h7 = syu.multiply(this.Dsuuu[i]).multiplyByScalar(-1);
            let h8 = this.Dsu[i].multiply(sxuu);
            let h9 = sxu.multiply(this.Dsuu[i]);
            let h10 = this.Dsu[i].multiply(syuu);
            let h11 = syu.multiply(this.Dsuu[i]).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < m; i += 1) {
            let h5 = this.Dsu[i].multiply(syu);
            let h6 = this.Dsu[i].multiply(sxuuu).multiplyByScalar(-1);
            let h7 = sxu.multiply(this.Dsuuu[i]);
            let h8 = this.Dsu[i].multiply(syuu);
            let h9 = syu.multiply(this.Dsuu[i]);
            let h10 = this.Dsu[i].multiply(sxuu).multiplyByScalar(-1);
            let h11 = sxu.multiply(this.Dsuu[i]);
            dgy.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < m; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            for (let j = 0; j < n; j += 1) {
                result.set(j, i, cpx[j])
                result.set(j, m + i, cpy[j])
            }
        }

        return result;
    }


   compute_gradient_f( e: ExpensiveComputationResults,
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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }


        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)


        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5)

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
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
                }
            }
        }

        return result;


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
                   result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
               }
           }
       }

       return result;


    }

    compute_hessian_f( sxu: BernsteinDecomposition_R1_to_R1, 
        syu: BernsteinDecomposition_R1_to_R1, 
        sxuu: BernsteinDecomposition_R1_to_R1, 
        syuu: BernsteinDecomposition_R1_to_R1, 
        sxuuu: BernsteinDecomposition_R1_to_R1, 
        syuuu: BernsteinDecomposition_R1_to_R1, 
        h1: BernsteinDecomposition_R1_to_R1, 
        h2: BernsteinDecomposition_R1_to_R1, 
        h3: BernsteinDecomposition_R1_to_R1, 
        h4: BernsteinDecomposition_R1_to_R1,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {


        const n = this.spline.controlPoints.length
        let result: SymmetricMatrix[] = []
        
        let h5x: BernsteinDecomposition_R1_to_R1[] = []
        let h5y: BernsteinDecomposition_R1_to_R1[] = []         
        let h6x: BernsteinDecomposition_R1_to_R1[] = []
        let h6y: BernsteinDecomposition_R1_to_R1[] = []
        let h7x: BernsteinDecomposition_R1_to_R1[] = []
        let h7y: BernsteinDecomposition_R1_to_R1[] = []        
        let h8x: BernsteinDecomposition_R1_to_R1[] = []
        let h8y: BernsteinDecomposition_R1_to_R1[] = []
        let h9x: BernsteinDecomposition_R1_to_R1[] = []
        let h9y: BernsteinDecomposition_R1_to_R1[] = []
        let h10x: BernsteinDecomposition_R1_to_R1[] = []
        let h10y: BernsteinDecomposition_R1_to_R1[] = []        
        let h11x: BernsteinDecomposition_R1_to_R1[] = []
        let h11y: BernsteinDecomposition_R1_to_R1[] = []

        let hessian_gxx: number[][][] = []
        let hessian_gyy: number[][][] = []
        let hessian_gxy: number[][][] = []

        for (let i = 0; i < n; i += 1){
            hessian_gxx.push([])
            hessian_gyy.push([])
            hessian_gxy.push([])
        }

        for (let i = 0; i < n; i += 1){
            h5x.push(this.Dsu[i].multiply(sxu))
            h6x.push(this.Dsu[i].multiply(syuuu))
            h7x.push(syu.multiply(this.Dsuuu[i]).multiplyByScalar(-1))
            h8x.push(this.Dsu[i].multiply(sxuu))
            h9x.push(sxu.multiply(this.Dsuu[i]))
            h10x.push(this.Dsu[i].multiply(syuu))
            h11x.push(syu.multiply(this.Dsuu[i]).multiplyByScalar(-1))
        }
        for (let i = 0; i < n; i += 1){
            h5y.push(this.Dsu[i].multiply(syu))
            h6y.push(this.Dsu[i].multiply(sxuuu).multiplyByScalar(-1))
            h7y.push(sxu.multiply(this.Dsuuu[i]))
            h8y.push(this.Dsu[i].multiply(syuu))
            h9y.push(syu.multiply(this.Dsuu[i]))
            h10y.push(this.Dsu[i].multiply(sxuu).multiplyByScalar(-1));
            h11y.push(sxu.multiply(this.Dsuu[i]))
        }


        
        for (let i = 0; i < n; i += 1){
            for (let j = 0; j <= i; j += 1){
                const term1 = this.Dh5xx[i][j].multiply(h2).multiplyByScalar(2)
                const term2xx = ((h5x[j].multiply(h6x[i].add(h7x[i]))).add(h5x[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
                const term2yy = ((h5y[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6y[j].add(h7y[j]))))).multiplyByScalar(2)
                // term3 = 0
                const term4 = this.Dh8_9xx[i][j].multiply(h4).multiplyByScalar(-3)
                const term5xx = (((h8x[j].add(h9x[j])).multiply(h10x[i].add(h11x[i]))).add((h8x[i].add(h9x[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
                const term5yy = (((h8y[j].add(h9y[j])).multiply(h10y[i].add(h11y[i]))).add((h8y[i].add(h9y[i])).multiply((h10y[j].add(h11y[j]))))).multiplyByScalar(-3)
                // term 6 = 0
                hessian_gxx[i][j] = (term1.add(term2xx).add(term4).add(term5xx)).flattenControlPointsArray()
                hessian_gyy[i][j] = (term1.add(term2yy).add(term4).add(term5yy)).flattenControlPointsArray()
            }
        }
        
        
        for (let i = 1; i < n; i += 1){
            for (let j = 0; j < i; j += 1){
                // term1 = 0
                const term2xy = ((h5x[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
                const term3 = this.Dh6_7xy[j][i].multiply(h1).multiplyByScalar(-1) //Dh_6_7xy is antisymmetric
                // term4 = 0
                const term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
                const term6 = this.Dh10_11xy[j][i].multiply(h3).multiplyByScalar(3); //Dh_10_11xy is antisymmetric

                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
            }
        }
        for (let i = 0; i < n; i += 1){
            for (let j = i + 1; j < n; j += 1){
                // term1 = 0
                const term2xy = ((h5x[j].multiply((h6y[i].add(h7y[i])))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
                const term3 = this.Dh6_7xy[i][j].multiply(h1) //Dh_6_7xy is antisymmetric
                // term4 = 0
                const term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
                const term6 = this.Dh10_11xy[i][j].multiply(h3).multiplyByScalar(-3); //Dh_10_11xy is antisymmetric
                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
                
            }
        }
        for (let i = 0; i < n; i += 1){
            // term1 = 0
            const term2xy = ((h5x[i].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[i].add(h7x[i]))))).multiplyByScalar(2)
            //const term3 = this.Dh6_7xy[i][i].multiply(h1)
            // term3 = 0
            // term4 = 0
            const term5xy = (((h8y[i].add(h9y[i])).multiply((h10x[i].add(h11x[i])))).add((h8x[i].add(h9x[i])).multiply(h10y[i].add(h11y[i])))).multiplyByScalar(-3)
            // term6 = 0
            hessian_gxy[i][i] = (term2xy.add(term5xy)).flattenControlPointsArray();
        }

        
        let deltak = 0
        for (let k = 0; k < constraintsSign.length; k += 1){
            if (k === inactiveConstraints[deltak]) {
                deltak += 1
            }
            else {
                let m = new SymmetricMatrix(2*n)
                for (let i = 0; i < n; i += 1){
                    for (let j = 0; j <= i; j += 1){
                        m.set(i, j, hessian_gxx[i][j][k] * constraintsSign[k])
                        m.set(n + i, n + j, hessian_gyy[i][j][k] * constraintsSign[k])
                    }
                }
                for (let i = 0; i < n; i += 1){
                    for (let j = 0; j < n; j += 1){
                        m.set(n + i, j, hessian_gxy[i][j][k] * constraintsSign[k])
                    }
                }
                result.push(m);
            }
        }
        return result;
    }
    
    prepareForHessianComputation(Dsu: BernsteinDecomposition_R1_to_R1[], Dsuu: BernsteinDecomposition_R1_to_R1[], Dsuuu: BernsteinDecomposition_R1_to_R1[]) {
        const n = this.spline.controlPoints.length

        for (let i = 0; i < n; i += 1){
            this.Dh5xx.push([])
            this.Dh6_7xy.push([])
            this.Dh8_9xx.push([])
            this.Dh10_11xy.push([])
        }

        for (let i = 0; i < n; i += 1){
            for (let j = 0; j <= i; j += 1){
                this.Dh5xx[i][j] = Dsu[i].multiply(Dsu[j]);
            }
        }
        
        for (let i = 0; i < n; i += 1){
            for (let j = 0; j < n; j += 1){
                this.Dh6_7xy[i][j] = (Dsu[i].multiply(Dsuuu[j])).subtract(Dsu[j].multiply(Dsuuu[i]))
            }
        }
        
        
        for (let i = 0; i < n; i += 1){
            for (let j = 0; j <= i; j += 1){
                this.Dh8_9xx[i][j] = (Dsu[i].multiply(Dsuu[j])).add(Dsu[j].multiply(Dsuu[i]))
            }
        }
        
        for (let i = 0; i < n; i += 1){
            for (let j = 0; j < n; j += 1){
                this.Dh10_11xy[i][j] = (Dsu[i].multiply(Dsuu[j])).subtract(Dsu[j].multiply(Dsuu[i]))
            }
        }
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

    setTargetSpline(spline: BSpline_R1_to_R2) {
        this._target = spline.clone()
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this.gradient_f0)
        
    }

}


export class OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors extends OptimizationProblem_BSpline_R1_to_R2 {

    public weigthingFactors: number[] = []

    constructor(target: BSpline_R1_to_R2, initial: BSpline_R1_to_R2,  public activeControl: ActiveControl = ActiveControl.both) {
        super(target, initial, activeControl)
        for (let i = 0; i < this.spline.controlPoints.length * 2; i += 1) {
            this.weigthingFactors.push(1)
        }
    }

    get f0() {
        let result = 0
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i]
        }
        return 0.5 * result;
    }

    get gradient_f0() {
        let result: number[] = []
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result.push(this._gradient_f0[i] * this.weigthingFactors[i])
        }
        return result
    }

    get hessian_f0() {
        const n = this._gradient_f0.length;
        let result = new DiagonalMatrix(n)
        for (let i = 0; i < n; i += 1) {
            result.set(i, i, this.weigthingFactors[i])
        }
        return result
    }


    /**
     * The objective function value: f0(x + step)
     */
    f0Step(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        const gradient = this.compute_gradient_f0(splineTemp)
        const n = gradient.length
        let result = 0
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i]
        }
        return 0.5 * result;
    }



}



export class OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints extends OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors {


    constructor(target: BSpline_R1_to_R2, initial: BSpline_R1_to_R2, public activeControl: ActiveControl = ActiveControl.both) {
        super(target, initial, activeControl)
    }

    
    computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
        return []
    }
    




}

export class OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints extends OptimizationProblem_BSpline_R1_to_R2 {


    constructor(target: BSpline_R1_to_R2, initial: BSpline_R1_to_R2) {
        super(target, initial)
    }

    computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
        return []
    }




}