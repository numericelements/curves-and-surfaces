import { BernsteinDecompositionR1toR1 } from "../newBsplines/BernsteinDecompositionR1toR1";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { identityMatrix } from "../linearAlgebra/DiagonalMatrix";
import { SymmetricMatrixInterface} from "../linearAlgebra/MatrixInterfaces";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { Vector2d } from "../mathVector/Vector2d";
import { OpBSplineR1toR2Interface } from "./IOpBSplineR1toR2";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";

export enum ConstraintType{none, inflection, curvatureExtrema}

export abstract class AbstractOptProblemBSplineR1toR2 implements OpBSplineR1toR2Interface {

    protected _spline: BSplineR1toR2Interface;
    protected _previousSpline: BSplineR1toR2Interface;
    protected _target: BSplineR1toR2Interface;
    protected _curvatureNumeratorCP: number[];
    protected _curvatureDerivativeNumeratorCP: number[];
    protected readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;

    protected _numberOfIndependentVariables: number;
    protected _f0: number;
    protected _gradient_f0: number[];
    protected _hessian_f0: SymmetricMatrixInterface;
    protected _f: number[];
    protected _gradient_f: DenseMatrix;
    protected _hessian_f: SymmetricMatrix[] | undefined;
    protected _analyticHighOrderCurveDerivatives: ExpensiveComputationResults;
    protected _previousAnalyticHighOrderCurveDerivatives: ExpensiveComputationResults;
    protected constraintType: ConstraintType;

    protected dBasisFunctions_du: BernsteinDecompositionR1toR1[];
    protected d2BasisFunctions_du2: BernsteinDecompositionR1toR1[];
    protected d3BasisFunctions_du3: BernsteinDecompositionR1toR1[];

    protected inflectionConstraintsSign: number[] = []
    protected _inflectionInactiveConstraints: number[] = []
    protected _inflectionTotalNumberOfConstraints: number;
    protected inflectionNumberOfActiveConstraints: number;
    protected _curvatureExtremaConstraintsSign: number[] = []
    protected _curvatureExtremaInactiveConstraints: number[] = []
    protected _curvatureExtremaTotalNumberOfConstraints: number;
    protected curvatureExtremaNumberOfActiveConstraints: number;

    
    constructor(splineInitial: BSplineR1toR2Interface, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {

        this._curvatureNumeratorCP = [];
        this._curvatureDerivativeNumeratorCP = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];

        this.constraintType = ConstraintType.none;
        this._inflectionTotalNumberOfConstraints = 0;
        this.inflectionNumberOfActiveConstraints = 0;
        this._curvatureExtremaTotalNumberOfConstraints = 0;
        this.curvatureExtremaNumberOfActiveConstraints = 0;
        this._spline = splineInitial.clone();
        this._previousSpline = splineInitial.clone();
        this._target = splineInitial.clone();
        this._shapeSpaceDiffEventsStructure = shapeSpaceDiffEventsStructure;
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
        this._f = [];
        this._gradient_f = new DenseMatrix(1, 1);
        this._hessian_f = undefined;
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure {
        return this._shapeSpaceDiffEventsStructure;
    }

    get inflectionInactiveConstraints(): number[] {
        return this._inflectionInactiveConstraints.slice();
    }

    get curvatureExtremaInactiveConstraints(): number[] {
        return this._curvatureExtremaInactiveConstraints.slice();
    }

    get numberOfIndependentVariables(): number {
        return this._numberOfIndependentVariables;
    }

    get inflectionTotalNumberOfConstraints(): number {
        return this._inflectionTotalNumberOfConstraints;
    }

    get curvatureExtremaTotalNumberOfConstraints(): number {
        return this._curvatureExtremaTotalNumberOfConstraints;
    }

    get curvatureExtremaConstraintsSign(): number[] {
        return this._curvatureExtremaConstraintsSign.slice();
    }

    get curvatureNumeratorCP(): number[] {
        return this._curvatureNumeratorCP.slice();
    }

    get curvatureDerivativeNumeratorCP(): number[] {
        return this._curvatureDerivativeNumeratorCP.slice();
    }

    get f0(): number {
        return this._f0;
    }

    get gradient_f0(): number[] {
        return this._gradient_f0.slice();
    }

    get hessian_f0(): SymmetricMatrixInterface {
        return this._hessian_f0;
    }
    
    get numberOfConstraints(): number {
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length + this._curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
        } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            return this._curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
        } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length;
        } else {
            // JCL 27/02/2023 modification to integrate the status none: must be double checked
            return 0;
        }
    }

    get f(): number[] {
        return this._f.slice();
    }

    get gradient_f(): DenseMatrix {
        return this._gradient_f;
    }

    get hessian_f(): SymmetricMatrix[] | undefined {
        return this._hessian_f;
    }

    get analyticHighOrderCurveDerivatives(): ExpensiveComputationResults {
        return this._analyticHighOrderCurveDerivatives;
    }

    get previousAnalyticHighOrderCurveDerivatives(): ExpensiveComputationResults {
        return this._previousAnalyticHighOrderCurveDerivatives;
    }

    set curvatureDerivativeNumeratorCP(curvatureDerivativeNumeratorCP: number[]) {
        this._curvatureDerivativeNumeratorCP = curvatureDerivativeNumeratorCP.slice();
    }

    abstract spline: BSplineR1toR2Interface;

    abstract previousSpline: BSplineR1toR2Interface;

    abstract setTargetSpline(spline: BSplineR1toR2Interface): void;

    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1Interface;

    // abstract compute_curvatureExtremaConstraints_gradient(  e: ExpensiveComputationResults,
    //                                                         constraintsSign: number[], 
    //                                                         inactiveConstraints: number[]): DenseMatrix;
    abstract compute_curvatureExtremaConstraints_gradient(  constraintsSign: number[], 
                                                            inactiveConstraints: number[]): DenseMatrix;

    abstract compute_curvatureExtremaConstraints_gradientPreviousIteration(  constraintsSign: number[], 
                                                            inactiveConstraints: number[]): DenseMatrix;

    abstract compute_inflectionConstraints_gradientPreviousIteration( constraintsSign: number[], 
                                                                    inactiveConstraints: number[]): DenseMatrix;

    // abstract compute_inflectionConstraints_gradient(e: ExpensiveComputationResults,
    //                                                 constraintsSign: number[], 
    //                                                 inactiveConstraints: number[]): DenseMatrix;
    abstract compute_inflectionConstraints_gradient(constraintsSign: number[], 
                                                    inactiveConstraints: number[]): DenseMatrix;

    abstract computeInactiveConstraints(controlPoints: number[]): number[];

    abstract computeBasisFunctionsDerivatives(): void;

    step(deltaX: number[]): boolean {
        this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        let curvatureNumerator: number[] = [];
        let curvatureDerivativeNumerator: number[] = [];
        this._previousSpline = this._spline.clone();
        this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
            this.constraintType = ConstraintType.inflection;
            //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator);
            this.constraintType = ConstraintType.curvatureExtrema;
            //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, curvatureDerivativeNumerator, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)  
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        // JCL temporary add
        return true
    }

    fStep(step: number[]): number[] {
        if(this._previousAnalyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
            if(this._analyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
                this._previousAnalyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            } else {
                this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
            }
            this._previousSpline = this._spline.clone();
        }
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        let curvatureNumerator: number[] = [];
        let curvatureDerivativeNumerator: number[] = [];
        let splineTemp = this.spline.clone();
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(splineTemp);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(splineTemp);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
        }
        if( this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        return this.compute_f(curvatureNumerator,
                            this.inflectionConstraintsSign,
                            this._inflectionInactiveConstraints,
                            curvatureDerivativeNumerator,
                            this._curvatureExtremaConstraintsSign,
                            this._curvatureExtremaInactiveConstraints);
    }

    f0Step(step: number[]): number {
        let splineTemp = this.spline.clone();
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    }


    expensiveComputation(spline: BSplineR1toR2Interface): ExpensiveComputationResults {
        let sxuuu: BSplineR1toR1Interface;
        let syuuu: BSplineR1toR1Interface;
        const controlPointArray: number[][] = [];
        let bdsxuuu = new BernsteinDecompositionR1toR1(controlPointArray);
        let bdsyuuu = new BernsteinDecompositionR1toR1(controlPointArray);
        let h1 = new BernsteinDecompositionR1toR1(controlPointArray);
        let h2 = new BernsteinDecompositionR1toR1(controlPointArray);
        let h3 = new BernsteinDecompositionR1toR1(controlPointArray);
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const bdsxu = sxu.bernsteinDecomposition();
        const bdsyu = syu.bernsteinDecomposition();
        const bdsxuu = sxuu.bernsteinDecomposition();
        const bdsyuu = syuu.bernsteinDecomposition();
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            sxuuu = sxuu.derivative();
            syuuu = syuu.derivative();
            bdsxuuu = sxuuu.bernsteinDecomposition();
            bdsyuuu = syuuu.bernsteinDecomposition();
            h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu));
            h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu));
            h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu));
        }
        const h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));

        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        }
    }

    initExpansiveComputations(): ExpensiveComputationResults {
        const controlPointArray: number[][] = [];
        const bdsxu = new BernsteinDecompositionR1toR1(controlPointArray);
        const bdsyu = new BernsteinDecompositionR1toR1(controlPointArray);
        const bdsxuu = new BernsteinDecompositionR1toR1(controlPointArray);
        const bdsyuu = new BernsteinDecompositionR1toR1(controlPointArray);
        const bdsxuuu = new BernsteinDecompositionR1toR1(controlPointArray);
        const bdsyuuu = new BernsteinDecompositionR1toR1(controlPointArray);
        const h1 = new BernsteinDecompositionR1toR1(controlPointArray);
        const h2 = new BernsteinDecompositionR1toR1(controlPointArray);
        const h3 = new BernsteinDecompositionR1toR1(controlPointArray);
        const h4 = new BernsteinDecompositionR1toR1(controlPointArray);

        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        }
    }

    compute_gradient_f0(spline: BSplineR1toR2Interface): number[] {
        let result: number[] = [];
        const n =  spline.freeControlPoints.length;
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x)
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y)
        }
        return result;
    }

    compute_f0(gradient_f0: number[]): number {
        let result = 0;
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    }

    compute_curvatureExtremaConstraints(curvatureDerivativeNumerator: number[], constraintsSign: number[],
                                        inactiveConstraints: number[]): number[] {
        let result: number[] = [];
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            } else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }

    compute_inflectionConstraints(curvatureNumerator: number[], constraintsSign: number[],
                                inactiveConstraints: number[]): number[] {
        let result: number[] = [];
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            } else {
                result.push(curvatureNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }

    // curvatureNumerator(h4: BernsteinDecompositionR1toR1): number[] {
    //     return h4.flattenControlPointsArray();
    curvatureNumerator(): number[] {
        return this._analyticHighOrderCurveDerivatives.h4.flattenControlPointsArray();
    }

    // curvatureDerivativeNumerator(   h1: BernsteinDecompositionR1toR1, 
    //                                 h2: BernsteinDecompositionR1toR1, 
    //                                 h3: BernsteinDecompositionR1toR1, 
    //                                 h4: BernsteinDecompositionR1toR1): number[] {
    //     const g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3));
    curvatureDerivativeNumerator(): number[] {
        const g = (this._analyticHighOrderCurveDerivatives.h1.multiply(this._analyticHighOrderCurveDerivatives.h2)).subtract(this._analyticHighOrderCurveDerivatives.h3.multiply(this._analyticHighOrderCurveDerivatives.h4).multiplyByScalar(3));
        return g.flattenControlPointsArray();
    }

    curvatureDerivativeNumeratorPreviousIteration(): number[] {
        const g = (this._previousAnalyticHighOrderCurveDerivatives.h1.multiply(this._previousAnalyticHighOrderCurveDerivatives.h2)).subtract(this._previousAnalyticHighOrderCurveDerivatives.h3.multiply(this._previousAnalyticHighOrderCurveDerivatives.h4).multiplyByScalar(3));
        return g.flattenControlPointsArray();
    }


    computeConstraintsSign(controlPoints: number[]): number[] {
        let result: number[] = []
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            } else {
                result.push(1);
            }
        }
        return result;
    }

    compute_f(  curvatureNumerator: number[],
                inflectionConstraintsSign: number[],
                inflectionInactiveConstraints: number[],
                curvatureDerivativeNumerator: number[],
                curvatureExtremaConstraintsSign: number[],
                curvatureExtremaInactiveConstraints: number[]): number[] {
        let f: number[] = [];
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            f = r1.concat(r2);
        } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        } else {
            const warning = new WarningLog(this.constructor.name, "compute_f", "active control set to none: unable to compute f.");
            warning.logMessage();
            f[0] = 0;
        }
        return f;
    }
    
    // compute_gradient_f( e: ExpensiveComputationResults,
    //                     inflectionConstraintsSign: number[],
    compute_gradient_f( inflectionConstraintsSign: number[],
                        inflectionInactiveConstraints: number[],
                        curvatureExtremaConstraintsSign: number[], 
                        curvatureExtremaInactiveConstraints: number[]): DenseMatrix {

        if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            // const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            const m1 = this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const m2 = this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints);
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
        } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            return this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        // JCL modif temporaire pour debuter integration OptProblemBSplineR1toR2
        } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            // return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            return this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints);
        } else {
            const warning = new WarningLog(this.constructor.name, "compute_gradient_f", "active control set to none: unable to compute gradients of f.");
            warning.logMessage();
            let result = new DenseMatrix(1, 1);
            return result;
        }
    }

    update(spline: BSplineR1toR2Interface): void {
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            this._curvatureNumeratorCP = this.curvatureNumerator();
            this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
            this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
            this.constraintType = ConstraintType.inflection;
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator();
            this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
            this.constraintType = ConstraintType.curvatureExtrema;
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
        }

        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }

    init(spline: BSplineR1toR2Interface): void {
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // this._previousAnalyticHighOrderCurveDerivatives = this.expensiveComputation(spline);
    }
}

export interface ExpensiveComputationResults {
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
    bdsxu: BernsteinDecompositionR1toR1
    bdsyu: BernsteinDecompositionR1toR1
    bdsxuu: BernsteinDecompositionR1toR1
    bdsyuu: BernsteinDecompositionR1toR1
    bdsxuuu: BernsteinDecompositionR1toR1 
    bdsyuuu: BernsteinDecompositionR1toR1 
    h1: BernsteinDecompositionR1toR1
    h2: BernsteinDecompositionR1toR1
    h3: BernsteinDecompositionR1toR1 
    h4: BernsteinDecompositionR1toR1 
}

export function convertStepToVector2d(step: number[]): Vector2d[] {
    let n = step.length / 2;
    let result: Vector2d[] = [];
    for (let i = 0; i < n; i += 1) {
        result.push(new Vector2d(step[i], step[n + i]));
    }
    return result;
}

export function deepCopyAnalyticHighOrderCurveDerivatives(analyticHighOrderCurveDerivatives: ExpensiveComputationResults): ExpensiveComputationResults {
    const bdsxu = analyticHighOrderCurveDerivatives.bdsxu.clone();
    const bdsyu = analyticHighOrderCurveDerivatives.bdsyu.clone();
    const bdsxuu = analyticHighOrderCurveDerivatives.bdsxuu.clone();
    const bdsyuu = analyticHighOrderCurveDerivatives.bdsyuu.clone();
    const bdsxuuu = analyticHighOrderCurveDerivatives.bdsxuuu.clone();
    const bdsyuuu = analyticHighOrderCurveDerivatives.bdsyuuu.clone();
    const h1 = analyticHighOrderCurveDerivatives.h1.clone();
    const h2 = analyticHighOrderCurveDerivatives.h2.clone();
    const h3 = analyticHighOrderCurveDerivatives.h3.clone();
    const h4 = analyticHighOrderCurveDerivatives.h4.clone();
    return {
        bdsxu: bdsxu,
        bdsyu: bdsyu,
        bdsxuu: bdsxuu,
        bdsyuu: bdsyuu,
        bdsxuuu: bdsxuuu,
        bdsyuuu: bdsyuuu,
        h1: h1,
        h2: h2,
        h3: h3,
        h4: h4
    }
}