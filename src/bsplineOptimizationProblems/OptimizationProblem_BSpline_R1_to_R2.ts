import { OptimizationProblemInterface } from "../optimizationProblemFacade/OptimizationProblemInterface"
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { zeroVector, containsNaN, sign } from "../linearAlgebra/MathVectorBasicOperations";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "../newBsplines/BernsteinDecompositionR1toR1";
import { SymmetricMatrixInterface } from "../linearAlgebra/MatrixInterfaces";
import { identityMatrix, DiagonalMatrix } from "../linearAlgebra/DiagonalMatrix";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { NeighboringEvents, NeighboringEventsType } from "../controllers/SlidingStrategy";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { ActiveControl, BaseOpProblemBSplineR1toR2 } from "./BaseOpBSplineR1toR2";


class ExpensiveComputationResults {

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

interface intermediateKnotWithNeighborhood {knot: number, left: number, right: number, index: number}
interface extremaNearKnot {kIndex: number, extrema: Array<number>}
export enum eventMove {still, moveToKnotLR, moveAwayFromKnotRL, moveToKnotRL, moveAwayFromKnotLR, atKnot}
enum transitionCP {negativeToPositive, positiveToNegative, none}

const DEVIATION_FROM_KNOT = 0.25

// export class OptimizationProblem_BSpline_R1_to_R2 extends BaseOpProblemBSplineR1toR2 {
export class OptimizationProblem_BSpline_R1_to_R2 implements OptimizationProblemInterface {

    public spline: BSplineR1toR2
    private _target: BSplineR1toR2
    readonly Dsu: BernsteinDecompositionR1toR1[]
    readonly Dsuu: BernsteinDecompositionR1toR1[]
    readonly Dsuuu: BernsteinDecompositionR1toR1[]


    //private curvatureExtremaConstraintsSign: number[] = []
    //private curvatureExtremaInactiveConstraints: number[] = []

    //private inflectionConstraintsSign: number[] = []
    //private inflectionInactiveConstraints: number[] = []
    /* JCL for testing purposes */
    public curvatureExtremaConstraintsSign: number[] = []
    public curvatureExtremaInactiveConstraints: number[] = []

    public inflectionConstraintsSign: number[] = []
    public inflectionInactiveConstraints: number[] = []

    //protected curvatureExtremaConstraintsSign: number[] = []
    //protected curvatureExtremaInactiveConstraints: number[] = []

    //protected inflectionConstraintsSign: number[] = []
    //protected inflectionInactiveConstraints: number[] = []

    private _numberOfIndependentVariables: number
    protected _f0: number
    protected _gradient_f0: number[]
    protected _hessian_f0: SymmetricMatrixInterface

    //private _curvatureExtremaNumberOfActiveConstraints: number
    //private _inflectionNumberOfActiveConstraints: number
    //private curvatureExtremaTotalNumberOfConstraints: number
    //private inflectionTotalNumberOfConstraints: number
    protected _curvatureExtremaNumberOfActiveConstraints: number
    protected _inflectionNumberOfActiveConstraints: number
    public curvatureExtremaTotalNumberOfConstraints: number
    public inflectionTotalNumberOfConstraints: number

    //private _f: number[]
    protected _f: number[]
    //private _gradient_f: DenseMatrix
    protected _gradient_f: DenseMatrix
    //private _hessian_f: SymmetricMatrixInterface[] | undefined = undefined
    //private _hessian_f: SymmetricMatrix[] | undefined = undefined
    protected _hessian_f: SymmetricMatrix[] | undefined = undefined
    readonly isComputingHessian: boolean = false
    private Dh5xx: BernsteinDecompositionR1toR1[][] = []
    private Dh6_7xy: BernsteinDecompositionR1toR1[][] = []
    private Dh8_9xx: BernsteinDecompositionR1toR1[][] = []
    private Dh10_11xy: BernsteinDecompositionR1toR1[][] = []



    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.both) {
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
            let s = new BSplineR1toR1(diracControlPoints.slice(), this.spline.knots.slice())
            let su = s.derivative()
            let suu = su.derivative()
            let suuu = suu.derivative()
            const suBDecomp = su.bernsteinDecomposition()
            const suuBDecomp = suu.bernsteinDecomposition()
            const suuuBDecomp = suuu.bernsteinDecomposition()
            // this.Dsu.push(new BernsteinDecompositionR1toR1(su.bernsteinDecomposition()))
            // this.Dsuu.push(new BernsteinDecompositionR1toR1(suu.bernsteinDecomposition()))
            // this.Dsuuu.push(new BernsteinDecompositionR1toR1(suuu.bernsteinDecomposition()))
            this.Dsu.push(suBDecomp)
            this.Dsuu.push(suuBDecomp)
            this.Dsuuu.push(suuuBDecomp)
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
        //console.log("optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)


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



    set targetSpline(spline: BSplineR1toR2) {
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
        // JCL 05/03/2021 add the checked status to enable stopping the iteration process if the curve is analyzed
        let checked: boolean = true

        this.spline.optimizerStep(deltaX)
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this.spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length
        //console.log("step : optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)

        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length


        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)

        if (this.isComputingHessian) {
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }

        return checked
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
        /* JCL 2020/10/02 modification as alternative to sliding mechanism */
        /*if(this.spline.degree === 3 && controlPoints.length === (this.spline.distinctKnots().length - 1)*7){
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
            result.sort(function(a, b) { return (a - b) });
        }*/
        
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

    compute_gradient_f0(spline: BSplineR1toR2) {
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

    curvatureNumerator(h4: BernsteinDecompositionR1toR1) {
        return h4.flattenControlPointsArray()
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
        let result: number[] = [];

        if (this.activeControl === ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            return r1.concat(r2)
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
        }
        else if (this.activeControl === ActiveControl.inflections) {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
        }
        else {
            const warning = new WarningLog(this.constructor.name, "compute_f", " active control set to none: cannot proceed with constraints computation");
            warning.logMessageToConsole();
            return result;
        }
       
    }

    expensiveComputation(spline: BSplineR1toR2) {
        const sx = new BSplineR1toR1(spline.getControlPointsX(), spline.knots),
        sy = new BSplineR1toR1(spline.getControlPointsY(), spline.knots),
        sxu = sx.derivative(),
        syu = sy.derivative(),
        sxuu = sxu.derivative(),
        syuu = syu.derivative(),
        sxuuu = sxuu.derivative(),
        syuuu = syuu.derivative(),
        bdsxu = sxu.bernsteinDecomposition(),
        bdsyu = syu.bernsteinDecomposition(),
        bdsxuu = sxuu.bernsteinDecomposition(),
        bdsyuu = syuu.bernsteinDecomposition(),
        bdsxuuu = sxuuu.bernsteinDecomposition(),
        bdsyuuu = syuuu.bernsteinDecomposition(),
        // bdsxu = new BernsteinDecompositionR1toR1(sxu.bernsteinDecomposition()),
        // bdsyu = new BernsteinDecompositionR1toR1(syu.bernsteinDecomposition()),
        // bdsxuu = new BernsteinDecompositionR1toR1(sxuu.bernsteinDecomposition()),
        // bdsyuu = new BernsteinDecompositionR1toR1(syuu.bernsteinDecomposition()),
        // bdsxuuu = new BernsteinDecompositionR1toR1(sxuuu.bernsteinDecomposition()),
        // bdsyuuu = new BernsteinDecompositionR1toR1(syuuu.bernsteinDecomposition()),
        h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu)),
        h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu)),
        h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu)),
        h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));

       return new ExpensiveComputationResults(bdsxu, bdsyu, bdsxuu, bdsyuu, bdsxuuu, bdsyuuu, h1, h2, h3, h4)
    }

    gradient_curvatureDerivativeNumerator( sxu: BernsteinDecompositionR1toR1, 
                syu: BernsteinDecompositionR1toR1, 
                sxuu: BernsteinDecompositionR1toR1, 
                syuu: BernsteinDecompositionR1toR1, 
                sxuuu: BernsteinDecompositionR1toR1, 
                syuuu: BernsteinDecompositionR1toR1, 
                h1: BernsteinDecompositionR1toR1, 
                h2: BernsteinDecompositionR1toR1, 
                h3: BernsteinDecompositionR1toR1, 
                h4: BernsteinDecompositionR1toR1) {

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
        else  if (this.activeControl === ActiveControl.inflections) {
            return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
        } else {
            const warning = new WarningLog(this.constructor.name, "compute_gradient_f", "active control set to none: unable to compute gradients of f.");
            warning.logMessageToConsole();
            let result = new DenseMatrix(1, 1);
            return result;
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

    compute_hessian_f( sxu: BernsteinDecompositionR1toR1, 
        syu: BernsteinDecompositionR1toR1, 
        sxuu: BernsteinDecompositionR1toR1, 
        syuu: BernsteinDecompositionR1toR1, 
        sxuuu: BernsteinDecompositionR1toR1, 
        syuuu: BernsteinDecompositionR1toR1, 
        h1: BernsteinDecompositionR1toR1, 
        h2: BernsteinDecompositionR1toR1, 
        h3: BernsteinDecompositionR1toR1, 
        h4: BernsteinDecompositionR1toR1,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {


        const n = this.spline.controlPoints.length
        let result: SymmetricMatrix[] = []
        
        let h5x: BernsteinDecompositionR1toR1[] = []
        let h5y: BernsteinDecompositionR1toR1[] = []         
        let h6x: BernsteinDecompositionR1toR1[] = []
        let h6y: BernsteinDecompositionR1toR1[] = []
        let h7x: BernsteinDecompositionR1toR1[] = []
        let h7y: BernsteinDecompositionR1toR1[] = []        
        let h8x: BernsteinDecompositionR1toR1[] = []
        let h8y: BernsteinDecompositionR1toR1[] = []
        let h9x: BernsteinDecompositionR1toR1[] = []
        let h9y: BernsteinDecompositionR1toR1[] = []
        let h10x: BernsteinDecompositionR1toR1[] = []
        let h10y: BernsteinDecompositionR1toR1[] = []        
        let h11x: BernsteinDecompositionR1toR1[] = []
        let h11y: BernsteinDecompositionR1toR1[] = []

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
    
    prepareForHessianComputation(Dsu: BernsteinDecompositionR1toR1[], Dsuu: BernsteinDecompositionR1toR1[], Dsuuu: BernsteinDecompositionR1toR1[]) {
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

    setTargetSpline(spline: BSplineR1toR2) {
        this._target = spline.clone()
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this.gradient_f0)
        
    }

}


export class OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors extends OptimizationProblem_BSpline_R1_to_R2 {

    public weigthingFactors: number[] = []

    constructor(target: BSplineR1toR2, initial: BSplineR1toR2,  public activeControl: ActiveControl = ActiveControl.both) {
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


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.both) {
        super(target, initial, activeControl)
    }
    
    computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
        return []
    }

}

export class OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints extends OptimizationProblem_BSpline_R1_to_R2 {


    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, activeControl: ActiveControl) {
        super(target, initial, activeControl)
    }

    computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
        return []
    }
}

/* JCL 2020/10/06 derive a class to process cubics with specific desactivation constraint process at discontinuities of B(u) */
export class OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics extends OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors {

    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.both) {
        super(target, initial, activeControl)
    }

    computeControlPointsClosestToZeroForCubics(signChangesIntervals: number[], controlPoints: number[]) {
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
        /* JCL 2020/10/02 modification as alternative to sliding mechanism */
        if(this.spline.degree === 3 && controlPoints.length === (this.spline.getDistinctKnots().length - 1)*7){
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
            result.sort(function(a, b) { return (a - b) });
        }
        
        return result
    }

    computeInactiveConstraints(constraintsSign: number[], controlPoints: number[]) {
        let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
        let controlPointsClosestToZero = this.computeControlPointsClosestToZeroForCubics(signChangesIntervals, controlPoints)
        let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
        return result
    }
}

/* JCL 2020/11/27 derive a class to extend the shape navigation process in accordance with the feedback of the analyzer */
interface ExtremumLocation {index: number, value: number}

export class OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation extends OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors {

    public shapeSpaceBoundaryConstraintsCurvExtrema: number[]
    public shapeSpaceBoundaryConstraintsInflection: number[]
    public neighboringEvent: NeighboringEvents = {event: NeighboringEventsType.none, index: -1}
    public revertConstraints: number[]
    private constraintBound: number[]
    private controlPointsFunctionBInit: number[]
    private eventMoveAtIterationStart: eventMove[]
    private eventEnterKnotNeighborhood: boolean[]
    private eventInsideKnotNeighborhood: boolean[]
    public previousSequenceCurvatureExtrema: number[]
    public currentSequenceCurvatureExtrema: number[]
    public previousCurvatureExtremaControlPoints: number[]
    public currentCurvatureExtremaControPoints: number[]
    public updateConstraintBound: boolean

    constructor(target: BSplineR1toR2, initial: BSplineR1toR2, public activeControl: ActiveControl = ActiveControl.both, neighboringEvent?: NeighboringEvents,
        shapeSpaceBoundaryConstraintsCurvExtrema?: number[]) {
        super(target, initial, activeControl)

        if(shapeSpaceBoundaryConstraintsCurvExtrema !== undefined) {
            this.shapeSpaceBoundaryConstraintsCurvExtrema = shapeSpaceBoundaryConstraintsCurvExtrema
        } else this.shapeSpaceBoundaryConstraintsCurvExtrema = [];
        this.shapeSpaceBoundaryConstraintsInflection = [];
        this.previousSequenceCurvatureExtrema = [];
        this.currentSequenceCurvatureExtrema = [];
        this.previousCurvatureExtremaControlPoints = [];
        this.updateConstraintBound = true;
        this.eventInsideKnotNeighborhood = [];
        this.eventMoveAtIterationStart = [];
        this.revertConstraints = [];
        this.eventEnterKnotNeighborhood = [];

        if(neighboringEvent !== undefined) {
            this.neighboringEvent = neighboringEvent
        } else {
            this.neighboringEvent.event = NeighboringEventsType.none;
            this.neighboringEvent.index = -1
            this.neighboringEvent.value = 0.0
            this.neighboringEvent.valueOptim = 0.0
            this.neighboringEvent.locExt = 0.0
            this.neighboringEvent.locExtOptim = 0.0
            this.neighboringEvent.variation = []
            this.neighboringEvent.span = -1
            this.neighboringEvent.range = 0
            this.neighboringEvent.knotIndex = 0
        }
        
        if(this.spline.degree === 3) {
            /* JCL Specific treatment for event sliding with cubics */
            let intermediateKnots: Array<intermediateKnotWithNeighborhood> = []
            if(this.spline.degree === 3 && this.spline.knots.length > 8) {
                /* JCL 04/01/2021 Look for the location of intermediate knots of multiplicity one wrt curvature extrema */
                /*let knots = this.spline.knots
                this.updateConstraintBound = true
                for(let i = 4; i < (knots.length - 4); i += 1) {
                    if(this.spline.knotMultiplicity(knots[i]) === 1) {
                        intermediateKnots.push({knot: knots[i], left: knots[i - 1], right: knots[i + 1], index: i})
                        this.eventInsideKnotNeighborhood.push(false)
                        this.eventMoveAtIterationStart.push(eventMove.still)
                        this.eventEnterKnotNeighborhood.push(false)
                    }
                }
                const splineDPoptim = new BSpline_R1_to_R2_DifferentialProperties(this.spline)
                const functionBOptim = splineDPoptim.curvatureDerivativeNumerator()
                const curvatureExtremaLocationsOptim = functionBOptim.zeros()
                for(let i = 0; i < intermediateKnots.length; i += 1) {
                    for(let j = 0; j < curvatureExtremaLocationsOptim.length; j += 1) {
                        if(curvatureExtremaLocationsOptim[j] > (intermediateKnots[i].knot - DEVIATION_FROM_KNOT*(intermediateKnots[i].knot - intermediateKnots[i].left)) &&
                        curvatureExtremaLocationsOptim[j] < (intermediateKnots[i].knot + DEVIATION_FROM_KNOT*(intermediateKnots[i].right - intermediateKnots[i].knot))) {
                            if(!this.eventInsideKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = true
                        }
                    }
                }*/
            }
        }

        const e = this.expensiveComputation(this.spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.currentCurvatureExtremaControPoints = g
        this.controlPointsFunctionBInit =  this.currentCurvatureExtremaControPoints
        if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("B(u) control points at init:" + this.currentCurvatureExtremaControPoints)
        this.constraintBound = zeroVector(g.length);
        for(let i = 0; i < g.length; i += 1) {
            this.revertConstraints.push(1);
        }
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length
        //console.log("step : optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)

        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this.inflectionInactiveConstraints = this.computeInactiveConstraintsGN(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length
        this._f = this.compute_fGN(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints,
            this.revertConstraints, this.constraintBound)
        this.checkConstraintConsistency()
        if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("constraints at init:" + this._f)
        if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("curvature constraints at init:" + this.curvatureExtremaInactiveConstraints)
        if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("inflexion constraints at init:" + this.inflectionInactiveConstraints)

        this._gradient_f = this.compute_gradient_fGN(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints, this.revertConstraints)
        
        if (this.isComputingHessian) {
            this.prepareForHessianComputation(this.Dsu, this.Dsuu, this.Dsuuu)
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }

    }

    checkConstraintConsistency() {
        /* JCL 08/03/2021 Add test to check the consistency of the constraints values.
            As the reference optimization problem is set up, each active constraint is an inequality strictly negative.
            Consequently, each active constraint value must be negative. */
        enum constraintType {curvatureExtremum, inflexion}
        let invalidConstraints: {value: number, type: constraintType, index: number}[] = []
        for(let i = 0; i < this._f.length; i += 1) {
            if(this._f[i] > 0.0) {
                let typeC: constraintType
                let indexC: number
                if (this.activeControl === ActiveControl.both) {
                    typeC = constraintType.curvatureExtremum
                    indexC = i
                    if(i < this._curvatureExtremaNumberOfActiveConstraints) {
                        for(let j = 0; j < this.curvatureExtremaInactiveConstraints.length; j +=1) {
                            if(i > this.curvatureExtremaInactiveConstraints[j]) indexC = indexC + 1
                        }
                    } else {
                        indexC = i - this._curvatureExtremaNumberOfActiveConstraints
                        typeC = constraintType.inflexion
                        for(let j = 0; j < this.inflectionInactiveConstraints.length; j +=1) {
                            if(i > this.inflectionInactiveConstraints[j]) indexC = indexC + 1
                        }
                    }
                } else if(this.activeControl === ActiveControl.curvatureExtrema) {
                    typeC = constraintType.curvatureExtremum
                    indexC = i
                    for(let j = 0; j < this.curvatureExtremaInactiveConstraints.length; j +=1) {
                        if(i > this.curvatureExtremaInactiveConstraints[j]) indexC = indexC + 1
                    }
                } else {
                    typeC = constraintType.inflexion
                    indexC = i
                    for(let j = 0; j < this.inflectionInactiveConstraints.length; j +=1) {
                        if(i > this.inflectionInactiveConstraints[j]) indexC = indexC + 1
                    }
                }
                invalidConstraints.push({value: this._f[i], type: typeC, index: indexC})
            }
        }
        if(invalidConstraints.length > 0) {
            throw new Error("Inconsistent constraints. Constraints value must be negative. " + JSON.stringify(invalidConstraints))
        }
    }

    computeGlobalExtremmumOffAxis(controlPoints: number[]): number {
        let localExtremum = -1
        let localMinimum: Array<ExtremumLocation> = []
        let localMaximum: Array<ExtremumLocation> = []
        let globalMinimum:ExtremumLocation = {index: 0, value: 0.0}
        let globalMaximum:ExtremumLocation = {index: 0, value: 0.0}
        for(let i = 0; i < controlPoints.length - 2; i += 1) {
            if(sign(controlPoints[i]) === 1 && sign(controlPoints[i + 1]) === 1 && sign(controlPoints[i + 2]) === 1) {
                if(controlPoints[i] > controlPoints[i + 1] && controlPoints[i + 1] < controlPoints[i + 2]) {
                    localMinimum.push({index: (i + 1), value: controlPoints[i + 1]})
                }
            } else if(sign(controlPoints[i]) === -1 && sign(controlPoints[i + 1]) === -1 && sign(controlPoints[i + 2]) === -1) {
                if(controlPoints[i] < controlPoints[i + 1] && controlPoints[i + 1] > controlPoints[i + 2]) {
                    localMaximum.push({index: (i + 1), value: controlPoints[i + 1]})
                }
            }
        }
        if(localMinimum.length > 0) {
            localMinimum.sort(function(a, b) {
                if (a.value > b.value) {
                  return 1;
                }
                if (a.value < b.value) {
                  return -1;
                }
                return 0;
            })
            globalMinimum = {index: localMinimum[0].index, value: localMinimum[0].value}
        }
        if(localMaximum.length > 0) {
            localMaximum.sort(function(a, b) {
                if (a.value > b.value) {
                  return 1;
                }
                if (a.value < b.value) {
                  return -1;
                }
                return 0;
            })
            globalMaximum = {index: localMaximum[localMaximum.length - 1].index, value: localMaximum[localMaximum.length - 1].value}
        }
        if(localMinimum.length > 0 && localMaximum.length > 0 && Math.abs(globalMinimum.value) > Math.abs(globalMaximum.value)) {
            return localExtremum = globalMaximum.index
        } else if(localMinimum.length > 0 && localMaximum.length > 0) {
            return localExtremum = globalMinimum.index
        } else if(localMinimum.length > 0) {
            return localExtremum = globalMinimum.index
        } else if(localMaximum.length > 0) {
            return localExtremum = globalMaximum.index
        } else return localExtremum
    }

    computeControlPointsClosestToZeroGeneralNavigation(signChangesIntervals: number[], controlPoints: number[]) {
        let result: number[] = []
        /*let extremaAroundAxis: number[] = []
        for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
                extremaAroundAxis.push(signChangesIntervals[i] + 1)
                i += 1
            }
        }*/
        for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
                if(controlPoints.length === this.curvatureExtremaTotalNumberOfConstraints) {
                    if(this.shapeSpaceBoundaryConstraintsCurvExtrema !== undefined){
                        /* JCL Conditions to prevent events to slip out of the curve through its left extremity */
                        if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                            if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i]);
                            } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i]);
                                this.shapeSpaceBoundaryConstraintsCurvExtrema.splice(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1), 1);
                            } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                        } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
    
                    } else {
                        /* JCL general setting where events can slip out of the curve */
                        if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                    }
                } else if(controlPoints.length === this.inflectionTotalNumberOfConstraints) {
                    if(this.shapeSpaceBoundaryConstraintsInflection !== undefined){
                        if(this.shapeSpaceBoundaryConstraintsInflection.length > 0) {
                            if(this.shapeSpaceBoundaryConstraintsInflection.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i])
                            } else if(this.shapeSpaceBoundaryConstraintsInflection.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i]);
                                this.shapeSpaceBoundaryConstraintsInflection.splice(this.shapeSpaceBoundaryConstraintsInflection.indexOf(controlPoints.length - 1), 1);
                            } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                        } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);

                    } else {
                        if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                    }
                }
            } else {
                if(controlPoints.length === this.curvatureExtremaTotalNumberOfConstraints) {
                    if(this.shapeSpaceBoundaryConstraintsCurvExtrema !== undefined) {
                        /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                        if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                            if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
                                result.push(signChangesIntervals[i] + 1);
                            } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
                                result.push(signChangesIntervals[i] + 1);
                                this.shapeSpaceBoundaryConstraintsCurvExtrema.splice(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0), 1)
                            } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                        } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);

                    } else {
                        /* JCL general setting where events can slip out of the curve */
                        if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                    }
                } else if(controlPoints.length === this.inflectionTotalNumberOfConstraints) {
                    if(this.shapeSpaceBoundaryConstraintsInflection !== undefined) {
                        /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                        if(this.shapeSpaceBoundaryConstraintsInflection.length > 0) {
                            if(this.shapeSpaceBoundaryConstraintsInflection.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
                                result.push(signChangesIntervals[i] + 1);
                            } else if(this.shapeSpaceBoundaryConstraintsInflection.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
                                result.push(signChangesIntervals[i] + 1);
                                this.shapeSpaceBoundaryConstraintsInflection.splice(this.shapeSpaceBoundaryConstraintsInflection.indexOf(0), 1)
                            } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                        } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);

                    } else {
                        /* JCL general setting where events can slip out of the curve */
                        if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                    }
                }
            }
        }
        return result
    }

    computeControlPointsClosestToZeroForCubics(signChangesIntervals: number[], controlPoints: number[]) {
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
        /* JCL 2020/10/02 modification as alternative to sliding mechanism */
        if(this.spline.degree === 3 && controlPoints.length === (this.spline.getDistinctKnots().length - 1)*7){
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
            result.sort(function(a, b) { return (a - b) });
        }
        
        return result
    }

    computeInactiveConstraintsGN(constraintsSign: number[], controlPoints: number[]) {
        let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
        let controlPointsClosestToZero = this.computeControlPointsClosestToZeroGeneralNavigation(signChangesIntervals, controlPoints)
        let globalExtremumOffAxis = this.computeGlobalExtremmumOffAxis(controlPoints)
        if(globalExtremumOffAxis !== -1) {
            controlPointsClosestToZero.push(globalExtremumOffAxis)
            controlPointsClosestToZero.sort(function(a, b) { return (a - b) })
        }
        //console.log("inactiveConstraints before inflection: " + controlPointsClosestToZero + " globalExt " + globalExtremumOffAxis)
        let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
        if(controlPointsClosestToZero.length !== result.length) console.log("computeInactiveConstraints: probable inconsistency in the matrix setting due to the order of inactive constraints")
        /* JCL Probably no change takes place though addInactiveConstraintsForInflections because new indices would be appended to controlPointsClosestToZero in result
            result would not be ordered, which would cause problem when loading the matrix of the inequalities */
        
        /* JCL Inactivate the extremum curvature constraints at the curve extremity to let the analyzer detect the entry or exit of 
            an extremum and the navigator take the decision to let it in or out */
        if( this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
            if(result.length > 0 && result.indexOf(0) === -1) result.splice(0, 0, 0)
            if(result.length > 0 && result.indexOf(controlPoints.length - 1) === -1) result.push(controlPoints.length - 1)
        }

        if(this.spline.degree === 3) {
            /* JCL Specific treatment for event sliding with cubics */
            let intermediateKnots: Array<intermediateKnotWithNeighborhood> = []
            let extremaNearKnot: Array<extremaNearKnot> = []
            let eventMoveNearKnot: eventMove = eventMove.still
            if(this.spline.degree === 3 && this.spline.knots.length > 8 && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
                /* JCL 04/01/2021 Look for the location of intermediate knots of multiplicity one wrt curvature extrema */
                let knots = this.spline.knots
                for(let i = 4; i < (knots.length - 4); i += 1) {
                    if(this.spline.knotMultiplicity(knots[i]) === 1) intermediateKnots.push({knot: knots[i], left: knots[i - 1], right: knots[i + 1], index: i})
                    else console.log("Knot multiplicity greater than one at intermediate knots is not processed yet.")
                }
                /* JCL Initialization of variables monitoring constraint analysis at each intermediate knot */
                if(this.eventInsideKnotNeighborhood.length <  intermediateKnots.length) {
                    this.updateConstraintBound = true
                    for(let i = 0; i < intermediateKnots.length; i += 1) {
                        this.eventInsideKnotNeighborhood.push(false)
                        this.eventMoveAtIterationStart.push(eventMove.still)
                        this.eventEnterKnotNeighborhood.push(false)
                    }
                    for(let i = 0; i < controlPoints.length; i+= 1){
                        this.revertConstraints[i] = 1
                        this.constraintBound[i] = 0
                    }
                }

                const splineDPoptim = new BSplineR1toR2DifferentialProperties(this.spline)
                const functionBOptim = splineDPoptim.curvatureDerivativeNumerator()
                const curvatureExtremaLocationsOptim = functionBOptim.zeros()
                for(let i = 0; i < intermediateKnots.length; i += 1) {
                    let eventCounter = 0
                    for(let j = 0; j < curvatureExtremaLocationsOptim.length; j += 1) {
                        if(curvatureExtremaLocationsOptim[j] > (intermediateKnots[i].knot - DEVIATION_FROM_KNOT*(intermediateKnots[i].knot - intermediateKnots[i].left)) &&
                        curvatureExtremaLocationsOptim[j] < (intermediateKnots[i].knot + DEVIATION_FROM_KNOT*(intermediateKnots[i].right - intermediateKnots[i].knot))) {
                            if(extremaNearKnot.length > 0 && extremaNearKnot[extremaNearKnot.length - 1].kIndex === i) extremaNearKnot[extremaNearKnot.length - 1].extrema.push(j)
                                //else extremaNearKnot.push({kIndex: intermediateKnots[i].index, extrema: [j]})
                                else extremaNearKnot.push({kIndex: i, extrema: [j]})
                            eventCounter +=1
                            let move = 0.0
                            eventMoveNearKnot = eventMove.still
                            if(this.previousSequenceCurvatureExtrema.length > 0) move = curvatureExtremaLocationsOptim[j] - this.previousSequenceCurvatureExtrema[j]
                            if(curvatureExtremaLocationsOptim[j] < intermediateKnots[i].knot && move > 0) eventMoveNearKnot = eventMove.moveToKnotLR
                            if(curvatureExtremaLocationsOptim[j] < intermediateKnots[i].knot && move < 0) eventMoveNearKnot = eventMove.moveAwayFromKnotRL
                            if(curvatureExtremaLocationsOptim[j] > intermediateKnots[i].knot && move > 0) eventMoveNearKnot = eventMove.moveAwayFromKnotLR
                            if(curvatureExtremaLocationsOptim[j] > intermediateKnots[i].knot && move < 0) eventMoveNearKnot = eventMove.moveToKnotRL
                            if(curvatureExtremaLocationsOptim[j] === intermediateKnots[i].knot) eventMoveNearKnot = eventMove.atKnot
                            if(this.updateConstraintBound) {
                                if(!this.eventInsideKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = true
                                this.eventInsideKnotNeighborhood[i] = true
                                this.eventMoveAtIterationStart[i] = eventMoveNearKnot
                            }
                            //console.log("add an event near an intermediate knot")
                        }
                    }
                    if(eventCounter === 0) this.eventInsideKnotNeighborhood[i] = false
                    console.log("i: " + i + " updateConstraintBound " + this.updateConstraintBound + " eventMoveAtIterationStart " + this.eventMoveAtIterationStart[i] + 
                    " eventEnterKnotNeighborhood " + this.eventEnterKnotNeighborhood[i] + " eventInsideKnotNeighborhood " + this.eventInsideKnotNeighborhood[i])
                }

                for(let i = 0; i < intermediateKnots.length; i += 1) {
                    //if((this.updateConstraintBound && (this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotRL || this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotLR)) ||
                    //this.eventEnterKnotNeighborhood[i]) {
                    if(this.updateConstraintBound && (this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotRL || this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotLR ||
                    this.eventInsideKnotNeighborhood[i])) {
                        let controlPointIndex = ((intermediateKnots[i].index - 4) + 1) * 7 - 1
                        this.revertConstraints[controlPointIndex] = 1
                        this.constraintBound[controlPointIndex] = 0
                        this.revertConstraints[controlPointIndex + 1] = 1
                        this.constraintBound[controlPointIndex + 1] = 0
                    }
                }

                if(extremaNearKnot.length > 0) {
                    /* JCL Removes the inactive constraints at intermediate knots that contain events in their neighborhood */
                    for(let i = 0; i < extremaNearKnot.length; i += 1) {
                        let controlPointIndex = (extremaNearKnot[i].kIndex + 1) * 7 - 1
                        /*let variationEvent = 0.0
                        if(this.previousSequenceCurvatureExtrema.length > 0) {
                            variationEvent = curvatureExtremaLocationsOptim[extremaNearKnot[i].extrema[0]] - this.previousSequenceCurvatureExtrema[extremaNearKnot[i].extrema[0]]
                        }
                        let distKnot = curvatureExtremaLocationsOptim[extremaNearKnot[i].extrema[0]] - intermediateKnots[extremaNearKnot[i].kIndex].knot
                        //let deltaCP1 = this.currentCurvatureExtremaControPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex]
                        let deltaCP1 = functionBOptim.controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex]
                        let stepCP1 = Math.abs(controlPoints[controlPointIndex]/deltaCP1)
                        //let deltaCP2 = this.currentCurvatureExtremaControPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                        let deltaCP2 = functionBOptim.controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                        let stepCP2 = Math.abs(controlPoints[controlPointIndex + 1]/deltaCP2)
                        let stepEvent = Math.abs(distKnot/variationEvent)*/

                        /* JCL The event tracked has not crossed the knot */
                        console.log("CPi " + controlPoints[controlPointIndex] + " CPi+1 " + controlPoints[controlPointIndex + 1] + " CPpi " + this.previousCurvatureExtremaControlPoints[controlPointIndex] + " CPpi+1 " + this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
                        if(controlPoints[controlPointIndex] > 0 && controlPoints[controlPointIndex + 1] > 0) {
                            if(this.eventMoveAtIterationStart[i] === eventMove.moveToKnotLR || this.eventMoveAtIterationStart[i] === eventMove.moveToKnotRL) {
                                //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
                                if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
                                if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)
                                if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
                                    this.revertConstraints[controlPointIndex] = -1
                                } else {
                                    this.revertConstraints[controlPointIndex + 1] = -1
                                }
                                if(this.updateConstraintBound) {
                                    if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
                                        if(this.constraintBound[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
                                            if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                            else {
                                                this.constraintBound[controlPointIndex] = controlPoints[controlPointIndex] + (controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex])
                                            }
                                        } else if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
                                            this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                        }
                                        this.constraintBound[controlPointIndex + 1] = 0.0
                                    } else {
                                        if(this.constraintBound[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
                                            if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                            else this.constraintBound[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] + (controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
                                        } else if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
                                            this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                        }
                                        this.constraintBound[controlPointIndex] = 0.0
                                    }
                                    if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
                                }
                            }
                        } else if(controlPoints[controlPointIndex] < 0 && controlPoints[controlPointIndex + 1] < 0) {
                            if(this.eventMoveAtIterationStart[i] === eventMove.moveToKnotLR || this.eventMoveAtIterationStart[i] === eventMove.moveToKnotRL) {
                                //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
                                if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)
                                if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
                                if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
                                    this.revertConstraints[controlPointIndex + 1] = -1
                                } else {
                                    this.revertConstraints[controlPointIndex] = -1
                                }
                                if(this.updateConstraintBound) {
                                    if(controlPoints[controlPointIndex] < controlPoints[controlPointIndex + 1]) {
                                        if(this.constraintBound[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
                                            if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                            else {
                                                this.constraintBound[controlPointIndex] = controlPoints[controlPointIndex] - (this.previousCurvatureExtremaControlPoints[controlPointIndex] - controlPoints[controlPointIndex])
                                            }
                                        } else if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
                                            this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                        }
                                        this.constraintBound[controlPointIndex + 1] = 0.0
                                    } else {
                                        if(this.constraintBound[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
                                            if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                            else {
                                                this.constraintBound[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] - (this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] - controlPoints[controlPointIndex + 1])
                                            }
                                        } else if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
                                            this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                        }
                                        this.constraintBound[controlPointIndex] = 0.0
                                    }

                                    if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
                                }
                            }
                        } else if(this.eventMoveAtIterationStart[i] === eventMove.atKnot) { 
                        //} else if(this.eventMoveAtIterationStart === eventMove.moveToKnotLR || this.eventMoveAtIterationStart === eventMove.moveToKnotRL) {
                            //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
                            if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
                            if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)

                            /* JCL Whatever the configuration: 
                                - this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0 && controlPoints[controlPointIndex] > 0: the control point is changing of half space
                                but the constraint must be kept reversed to avoid adverse effects with the convergence of the trust region optimizer
                                - this.previousCurvatureExtremaControlPoints[controlPointIndex] > 0 && controlPoints[controlPointIndex] > 0: the control point was already in the positive
                                half space et must be kept as close to zero  as possible to contribute to event sliding
                                - this.eventMoveAtIterationStart !== eventMoveNearKnot: the constraint settings must be constant during an optimizer iteration
                                */
                            this.revertConstraints[controlPointIndex] = -1
                            this.revertConstraints[controlPointIndex + 1] = -1

                            /*if(controlPoints[controlPointIndex + 1] > 0 ) {
                                if(this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) this.revertConstraints[controlPointIndex + 1] = -1
                                else this.revertConstraints[controlPointIndex + 1] = 1
                            }*/
                            if(this.updateConstraintBound) {
                                if(controlPoints[controlPointIndex] > 0 ) {
                                    /* JCL the previous event move cannot be 'away from knot', it must be 'to knot', therefore this.constraintBound[controlPointIndex] !== 0 
                                    but the initialization (when loading a curve) can start with this.constraintBound[controlPointIndex] === 0, so this condition is required also */
                                    if(this.constraintBound[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
                                        if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                        else {
                                            this.constraintBound[controlPointIndex] = controlPoints[controlPointIndex] + (controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex])
                                        }
                                    } else if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
                                        this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                    }
                                } else {
                                    if(this.constraintBound[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
                                        if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                        else this.constraintBound[controlPointIndex] = controlPoints[controlPointIndex] - (this.previousCurvatureExtremaControlPoints[controlPointIndex] - controlPoints[controlPointIndex])
                                    } else if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
                                        this.constraintBound[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
                                    }
                                }
                                if(controlPoints[controlPointIndex + 1] > 0) {
                                    if(this.constraintBound[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
                                        if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                        else this.constraintBound[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] + (controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
                                    } else if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
                                        this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                    }
                                } else {
                                    if(this.constraintBound[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
                                        if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                        else this.constraintBound[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] - (this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] - controlPoints[controlPointIndex + 1])
                                    } else if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
                                        this.constraintBound[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
                                    }
                                }

                                if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
                            }
                        }
                        console.log("process CP index " + controlPointIndex + " result " + result + " rvCst " + this.revertConstraints[controlPointIndex] + ", " + this.revertConstraints[controlPointIndex + 1]  + " bound " + this.constraintBound[controlPointIndex] + ", " 
                            + this.constraintBound[controlPointIndex + 1] + " CP " + controlPoints[controlPointIndex] + ", " + controlPoints[controlPointIndex+1] + " updateBound " + this.updateConstraintBound + 
                            " move " + this.eventMoveAtIterationStart[i] + " eventInsideKnotNeighborhood " + this.eventInsideKnotNeighborhood[i] + " enter " + this.eventEnterKnotNeighborhood[i])
                    }
                }
            }
        }

        /* JCL Test */
        /*if(this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
            let maxValue = 1
            for(let i = 1; i < controlPoints.length - 1; i+=1) {
                this.revertConstraints[i] = 1
                this.constraintBound[i] = 0
                if(controlPoints[i] > maxValue){
                    if(result.indexOf(i) !== -1) result.splice(result.indexOf(i), 1)
                    this.revertConstraints[i] = -1
                    this.constraintBound[i] = maxValue
                }
            }
        }*/

        if((this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear)
            && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length && this.updateConstraintBound) {
            if(this.neighboringEvent.value && this.neighboringEvent.valueOptim &&  this.neighboringEvent.locExt && this.neighboringEvent.locExtOptim && this.neighboringEvent.span &&
                this.neighboringEvent.range && this.neighboringEvent.variation && this.neighboringEvent.knotIndex !== undefined) {
                const upperBound = this.neighboringEvent.span
                const lowerBound = this.neighboringEvent.span - this.neighboringEvent.range

                //let revertConstraints: Array<number> =[]
                //let constraintBound: Array<number> =[]
                if(this.spline.degree === 3 && this.neighboringEvent.knotIndex !== 0) {
                    //if(((controlPoints[upperBound] === this.neighboringEvent.value || controlPoints[upperBound + 1] === this.neighboringEvent.value) && this.neighboringEvent.value > 0) ||
                    //((controlPoints[upperBound] === this.neighboringEvent.value || controlPoints[upperBound + 1] === this.neighboringEvent.value) && this.neighboringEvent.value < 0)) {
                        if(result.indexOf(upperBound) !== -1) result.splice(result.indexOf(upperBound), 1)
                        if(result.indexOf(upperBound + 1) !== -1) result.splice(result.indexOf(upperBound + 1), 1)
                        this.revertConstraints[upperBound] = 1
                        this.constraintBound[upperBound] = 0
                        this.revertConstraints[upperBound + 1] = 1
                        this.constraintBound[upperBound + 1] = 0
                        console.log("avoid generation of extrema. result " + result +  " rvCst " + this.revertConstraints[upperBound] + ", " + this.revertConstraints[upperBound + 1]  + " bound " + this.constraintBound[upperBound] + ", " 
                        + this.constraintBound[upperBound + 1])
                    //}
                } else {
                    /* JCL removes the inactive constraints that may exist in the current interval span */
                    for(let j = lowerBound; j < upperBound + 1; j += 1) {
                        if(result.indexOf(j) !== -1) result.splice(result.indexOf(j), 1)
                    }
                    let j = 0
                    for(let i = 0; i < controlPoints.length; i+= 1){
                        this.revertConstraints[i] = 1
                        this.constraintBound[i] = 0
                        //if(i >=  lowerBound && i <= upperBound) {
                        if(i >  lowerBound && i < upperBound) {
                            /* JCL a simplifier */
                            /*if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                                if(controlPoints[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
                                if(controlPoints[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) this.revertConstraints[i] = -1
                            } else if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                                if(controlPoints[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
                                if(controlPoints[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) {
                                    this.revertConstraints[i] = -1
                                    this.constraintBound[i] = controlPoints[i] - (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
                                }
                            }*/
                            if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                                if(this.controlPointsFunctionBInit[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
                                if(this.controlPointsFunctionBInit[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) this.revertConstraints[i] = -1
                            } else if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                                if(this.controlPointsFunctionBInit[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
                                if(this.controlPointsFunctionBInit[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) {
                                    this.revertConstraints[i] = 1
                                    if(this.neighboringEvent.variation[j] > 0) {
                                        //this.constraintBound[i] = -(this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
                                        this.constraintBound[i] = this.controlPointsFunctionBInit[i] + (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
                                    } else {
                                        this.constraintBound[i] = this.controlPointsFunctionBInit[i] - 1.0e-7
                                    }
                                
                                }
                            }
                                //this.constraintBound[i] = controlPoints[i] - (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
                            j += 1
                        }
                    }
                    console.log("control of B(u): result " + result +  " rvCst " + this.revertConstraints + ", "  + " bound " + this.constraintBound)
                }
                /*if(this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) {
                    let activeSignChanges: number[] = []
                    for(let i = 0; i < signChangesIntervals.length; i += 1) {
                        if(signChangesIntervals[i] >= lowerBound && signChangesIntervals[i] < upperBound) activeSignChanges.push(signChangesIntervals[i])
                    }
                    if(activeSignChanges.length < 2) {
                        console.log("Number of control polygon sign changes inconsistent.")
                    } else if(activeSignChanges.length === 2) {
                        let deltaLowerBound = controlPoints[activeSignChanges[0] + 1] - controlPoints[activeSignChanges[0]]
                        let deltaUpperBound = controlPoints[activeSignChanges[1] + 1] - controlPoints[activeSignChanges[1]]
                        if(!(deltaLowerBound > 0 && deltaUpperBound < 0)) console.log("Inconsistent sign changes")
                        if(controlPoints[lowerBound] < 0.0 && controlPoints[upperBound] < 0.0) console.log("Inconsistent location of the extreme control vertices.")
                        let zeroControlPolygonLowerBound = (Math.abs(controlPoints[activeSignChanges[0] + 1] / controlPoints[activeSignChanges[0]]) + 1.0) / (controlPoints.length - 1)
                        let zeroControlPolygonUpperBound = (Math.abs(controlPoints[activeSignChanges[1] + 1] / controlPoints[activeSignChanges[1]]) + 1.0) / (controlPoints.length - 1)
                        if(!((activeSignChanges[0]/(controlPoints.length - 1)) + zeroControlPolygonLowerBound < this.neighboringEvent.locExt && 
                            (activeSignChanges[1]/(controlPoints.length - 1)) + zeroControlPolygonUpperBound > this.neighboringEvent.locExt)) {
                            console.log("Inconsistent location of the curvature derivative extremum wrt its control polygon.")
                        }
                        console.log("Consistent number of zeros in the control polygon")
                        if(activeSignChanges[0] + 1 === activeSignChanges[1]) {
                            /* JCL The positive half plane caontains only one control point. Its constraint must not be deactivated */
                            /*let indexControlPoint = result.indexOf(activeSignChanges[1])
                            if(indexControlPoint !== -1) {
                                result.splice(indexControlPoint, 1)
                            }
                        } else if(activeSignChanges[1] - activeSignChanges[0] + 1 === 1) {*/
                            /* JCL The positive half plane contains only two control points. Their constraint must not be deactivated */
                            /*let indexControlPoint = result.indexOf(activeSignChanges[0] + 1)
                            if(indexControlPoint !== -1) {
                                result.splice(indexControlPoint, 1)
                            }
                            indexControlPoint = result.indexOf(activeSignChanges[1])
                            if(indexControlPoint !== -1) {
                                result.splice(indexControlPoint, 1)
                            }
                        }
                    } else if(activeSignChanges.length > 2) {
    
                    }
    
                }*/
            } else {
                console.log("Inconsistent content for processing neighboring events.")
            }
        } else if((this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear ||
        this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
        && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
            if(this.neighboringEvent.value !== undefined && this.neighboringEvent.valueOptim !== undefined && this.neighboringEvent.locExt !== undefined && this.neighboringEvent.locExtOptim !== undefined 
                && this.neighboringEvent.span !== undefined && this.neighboringEvent.range !== undefined) {
                if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                    if(this.shapeSpaceBoundaryConstraintsCurvExtrema[0] === 0 ) {
                        if(result.length > 0 && result.indexOf(0) !== -1) result.splice(result.indexOf(0), 1)
                        this.revertConstraints[0] = 1
                        this.constraintBound[0] = 0

                    } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema[this.shapeSpaceBoundaryConstraintsCurvExtrema.length - 1] === this.spline.controlPoints.length - 1) {
                        if(result.length > 0 && result.indexOf(controlPoints.length - 1) !== -1) result.splice(result.indexOf(controlPoints.length - 1), 1)
                        this.revertConstraints[controlPoints.length - 1] = 1
                        this.constraintBound[controlPoints.length - 1] = 0
                    }
                    /* JCL 08/03/2021 Add constraint modifications to curvature extrema appearing based on a non null optimum value of B(u) */
                    if(this.neighboringEvent.valueOptim !== 0.0 && this.neighboringEvent.variation !== undefined) {
                        /* to be added: the interval span to be processed */
                        for(let i = 1; i < controlPoints.length - 1; i+= 1){
                            if(result.length > 0 && result.indexOf(i) !== -1) result.splice(result.indexOf(i), 1)
                            this.revertConstraints[i] = 1
                            this.constraintBound[i] = 0
                            if(this.neighboringEvent.valueOptim > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                                if(this.neighboringEvent.variation[i] > 0.0) {
                                    this.revertConstraints[i] = -1
                                    this.constraintBound[i] = this.controlPointsFunctionBInit[i] + this.neighboringEvent.variation[i]
                                } else {
                                    this.revertConstraints[i] = -1
                                    this.constraintBound[i] = this.controlPointsFunctionBInit[i] + 1.0e-7
                                }
                            } else if(this.neighboringEvent.valueOptim < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
                                if(this.neighboringEvent.variation[i] < 0.0) {
                                    this.constraintBound[i] = this.controlPointsFunctionBInit[i] + this.neighboringEvent.variation[i]
                                } else {
                                    this.constraintBound[i] = this.controlPointsFunctionBInit[i] + 1.0e-7
                                }
                            }
                        }
                    }
                } else console.log("Null content of shapeSpaceBoundaryConstraintsCurvExtrema.")
            } else {
                console.log("Inconsistent content for processing neighboring events.")
            }
        }
        //if(this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) console.log("inactive curvat cnst " + result + " CP[0] = " + controlPoints[0])
        return result
    }

    compute_curvatureExtremaConstraintsGN(curvatureDerivativeNumerator: number[], constraintsSign: number[], inactiveConstraints: number[], 
        revertConstraints: number[], constraintBound: number []) {
        let result: number[] = []
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1
            } else {
                result.push((curvatureDerivativeNumerator[i] - constraintBound[i]) * constraintsSign[i] * revertConstraints[i])
            }
        }
        return result
    }

    compute_curvatureExtremaConstraints_gradientGN( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[],
        revertConstraints: number[]) {

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
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * revertConstraints[j])
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * revertConstraints[j])
                }
            }
        }

        return result;
    }

    compute_fGN(curvatureNumerator: number[], inflectionConstraintsSign: number[], inflectionInactiveConstraints: number[], curvatureDerivativeNumerator: number[], curvatureExtremaConstraintsSign: number[], curvatureExtremaInactiveConstraints: number[],
        revertConstraints: number[], constraintBound: number []) {
        //let result: number[] = []

        if (this.activeControl === ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraintsGN(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints, revertConstraints, constraintBound)
            //console.log(" compute_fGN: " + constraintBound + " modifSignConstraints: " + revertConstraints + " r1: " + r1)
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            return r1.concat(r2)
        }

        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraintsGN(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints, revertConstraints, constraintBound)
        }
        else {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
        }
       
    }

    compute_gradient_fGN( e: ExpensiveComputationResults,
        inflectionConstraintsSign: number[],
        inflectionInactiveConstraints: number[],
        curvatureExtremaConstraintsSign: number[], 
        curvatureExtremaInactiveConstraints: number[],
        revertConstraints: number[]) {
    
            if (this.activeControl === ActiveControl.both) {
                const m1 = this.compute_curvatureExtremaConstraints_gradientGN(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints, revertConstraints)
                //console.log(" grad_fGN: " + curvatureExtremaConstraintsSign + " modifSignConstraints: " + revertConstraints + " m1: " + m1)
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
                return this.compute_curvatureExtremaConstraints_gradientGN(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints, revertConstraints)
            }
            else {
                return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            }
        }

    step(deltaX: number[]) {
        let checked: boolean = true
        let inactiveCurvatureConstraintsAtStart = this.curvatureExtremaInactiveConstraints

        if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
            const splineDP = new BSplineR1toR2DifferentialProperties(this.spline)
            const functionB = splineDP.curvatureDerivativeNumerator()
            const curvatureExtremaLocations = functionB.zeros()
            const splineCurrent = this.spline.clone()

            this.spline.optimizerStep(deltaX)
            const splineDPupdated = new BSplineR1toR2DifferentialProperties(this.spline)
            const functionBupdated = splineDPupdated.curvatureDerivativeNumerator()
            const curvatureExtremaLocationsUpdated = functionBupdated.zeros()
            if(curvatureExtremaLocationsUpdated.length !== curvatureExtremaLocations.length) {
                checked = false
                this.spline = splineCurrent
                console.log("extrema current: " + curvatureExtremaLocations + " extrema updated: " + curvatureExtremaLocationsUpdated)
            }
        } else {
            this.spline.optimizerStep(deltaX)
        }

        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this.spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        if(this.updateConstraintBound) {
            this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
            this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(this.curvatureExtremaConstraintsSign, g)
        }
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length

        const curvatureNumerator = this.curvatureNumerator(e.h4)
        if(this.updateConstraintBound) {
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
            this.inflectionInactiveConstraints = this.computeInactiveConstraintsGN(this.inflectionConstraintsSign, curvatureNumerator)
        }
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length

        //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
        console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " revert " + this.revertConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign + " bound " + this.constraintBound)

        this.updateConstraintBound = false

        this._f = this.compute_fGN(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints,
            this.revertConstraints, this.constraintBound)
        this._gradient_f = this.compute_gradient_fGN(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints,
            this.revertConstraints)

        if (this.isComputingHessian) {
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }

        return checked
    }

    fStep(step: number[]) {
        let splineTemp = this.spline.clone()
        splineTemp.optimizerStep(step)
        let e = this.expensiveComputation(splineTemp)
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        return this.compute_fGN(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints,
            this.revertConstraints, this.constraintBound)
    }

    cancelEvent() {
        this.neighboringEvent.event = NeighboringEventsType.none;
        this.neighboringEvent.index = -1
        this.neighboringEvent.value = 0.0
        this.neighboringEvent.valueOptim = 0.0
        this.neighboringEvent.locExt = 0.0
        this.neighboringEvent.locExtOptim = 0.0
        this.neighboringEvent.variation = []
        this.neighboringEvent.span = -1
        this.neighboringEvent.range = 0

        //const e = this.expensiveComputation(this.spline)  
        //const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.constraintBound = zeroVector(this.constraintBound.length);
        for(let i = 0; i < this.revertConstraints.length; i += 1) {
            this.revertConstraints[i] = 1
        }
        let delta = zeroVector(this.spline.controlPoints.length * 2);
        this.updateConstraintBound = true;
        this.step(delta);
        this.checkConstraintConsistency();
    }

}