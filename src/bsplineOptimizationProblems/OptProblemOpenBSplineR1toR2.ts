import { OptimizationProblemInterface } from "../optimizationProblemFacade/OptimizationProblemInterface"
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { zeroVector, containsNaN, sign } from "../linearAlgebra/MathVectorBasicOperations";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "../newBsplines/BernsteinDecompositionR1toR1";
import { SymmetricMatrixInterface } from "../linearAlgebra/MatrixInterfaces";
import { identityMatrix, DiagonalMatrix } from "../linearAlgebra/DiagonalMatrix";
import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { PolygonWithVerticesR1 } from "../containers/PolygonWithVerticesR1";
import { extractAdjacentOscillatingPolygons } from "../containers/OscillatingPolygonWithVerticesR1";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { DiffrentialEventVariation } from "../sequenceOfDifferentialEvents/DifferentialEventVariation";
import { OpenCurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { AbstractOptProblemBSplineR1toR2, ConstraintType, ExpensiveComputationResults, convertStepToVector2d, deepCopyAnalyticHighOrderCurveDerivatives } from "./AbstractOptProblemBSplineR1toR2";
import { NestedShapeSpacesBoundaryEnforcerOpenCurve, StrictShapeSpacesBoundaryEnforcerOpenCurve } from "../curveShapeSpaceNavigation/ShapeSpaceBoundaryEnforcer";


interface intermediateKnotWithNeighborhood {knot: number, left: number, right: number, index: number}
interface extremaNearKnot {kIndex: number, extrema: Array<number>}
export enum eventMove {still, moveToKnotLR, moveAwayFromKnotRL, moveToKnotRL, moveAwayFromKnotLR, atKnot}
enum transitionCP {negativeToPositive, positiveToNegative, none}

const DEVIATION_FROM_KNOT = 0.25
export const CONSTRAINT_BOUND_THRESHOLD = 1.0e-7;
export const DEFAULT_WEIGHT = 1;
export const WEIGHT_AT_EXTREMITIES = 10;

export class OptProblemOpenBSplineR1toR2 extends AbstractOptProblemBSplineR1toR2 {

    readonly isComputingHessian: boolean = false;
    protected Dh5xx: BernsteinDecompositionR1toR1[][];
    protected Dh6_7xy: BernsteinDecompositionR1toR1[][];
    protected Dh8_9xx: BernsteinDecompositionR1toR1[][];
    protected Dh10_11xy: BernsteinDecompositionR1toR1[][];
    protected nbZeros: number[];
    protected curvatureDerivativeBuffer: BSplineR1toR1[];

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);

        this.Dh5xx = [];
        this.Dh6_7xy = [];
        this.Dh8_9xx = [];
        this.Dh10_11xy = [];
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // e = this.expensiveComputation(this._spline);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
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
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this._inflectionInactiveConstraints,
            this._curvatureDerivativeNumeratorCP, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints,
        //     this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints,
            this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        if (this.isComputingHessian) {
            const e = this.expensiveComputation(this.spline)
            this.prepareForHessianComputation(this.dBasisFunctions_du, this.d2BasisFunctions_du2, this.d3BasisFunctions_du3)
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        }
        this.nbZeros = [];
        this.curvatureDerivativeBuffer = [];
    }

    get f() {
        if (containsNaN(this._f)) {
            throw new Error("OptimizationProblem_BSpline_R1_to_R2 contains Nan in its f vector");
        }
        return this._f;
    }

    get spline(): BSplineR1toR2 {
        return this._spline as BSplineR1toR2;
    }
    
    get previousSpline(): BSplineR1toR2 {
        return this._previousSpline as BSplineR1toR2;
    }

    set spline(spline: BSplineR1toR2) {
        this._spline = spline;
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots);
    }

    computeBasisFunctionsDerivatives(): void {
        const n = this.spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        let diracControlPoints = zeroVector(n);
        let secondOrderSplineDerivatives: BSplineR1toR1[] = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            for (let i = 0; i < n; i += 1) {
                diracControlPoints[i] = 1;
                let s = new BSplineR1toR1(diracControlPoints.slice(), this.spline.knots.slice());
                let su = s.derivative();
                let suu = su.derivative();
                secondOrderSplineDerivatives.push(suu);
                const suBDecomp = su.bernsteinDecomposition();
                const suuBDecomp = suu.bernsteinDecomposition();
                this.dBasisFunctions_du.push(suBDecomp);
                this.d2BasisFunctions_du2.push(suuBDecomp);
                diracControlPoints[i] = 0;
            }
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            let diracControlPoints = zeroVector(n);
            for (let i = 0; i < n; i += 1) {
                diracControlPoints[i] = 1;
                let suuu = secondOrderSplineDerivatives[i].derivative();
                const suuuBDecomp = suuu.bernsteinDecomposition();
                this.d3BasisFunctions_du3.push(suuuBDecomp);
                diracControlPoints[i] = 0;
            }
        }
    }

    computeSignChangeIntervals(constraintsSign: number[]): number[] {
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

    inactivateConstraintsAtCurveEXtremities(controlPoints: number[], inactiveConstraints: number[]): void {
        if(inactiveConstraints.indexOf(0) === -1) inactiveConstraints.splice(0, 0, 0);
        if(inactiveConstraints.indexOf(controlPoints.length - 1) === -1) inactiveConstraints.push(controlPoints.length - 1);
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

    computeInactiveConstraints(controlPoints: number[]): number[] {
        this.checkConstraintTypeConsistency(controlPoints);
        let result = this.extractVerticesLocallyClosestToZero(controlPoints);
        return result;
    }

    extractVerticesLocallyClosestToZero(controlPoints: number[]): number[] {
        let indicesConstraints: number[] = [];
        const polygon = new PolygonWithVerticesR1(controlPoints);
        const oscillatingPolygons = polygon.extractOscillatingPolygons();
        if(oscillatingPolygons.length !== 0) {
            const oscillatingPolygonsWithAdjacency = extractAdjacentOscillatingPolygons(oscillatingPolygons);
            for(let oscillatingPolyWithAdj of oscillatingPolygonsWithAdjacency) {
                if(oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index !== RETURN_ERROR_CODE) {
                    indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index);
                }
                if(oscillatingPolyWithAdj.oscillatingPolygons.length !== 1) {
                    for(let connectionIndex = 0; connectionIndex < (oscillatingPolyWithAdj.oscillatingPolygons.length - 1); connectionIndex++) {
                        const compatibleConstraint = oscillatingPolyWithAdj.getClosestVertexToZeroAtConnection(connectionIndex);
                        if(compatibleConstraint.index !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== compatibleConstraint.index) {
                            indicesConstraints.push(compatibleConstraint.index);
                        } else {
                            const indexEnd = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index;
                            if(indexEnd !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexEnd) {
                                indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index);
                            }
                            const indexBgng = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex + 1].closestVertexAtBeginning.index;
                            if(indexBgng !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexBgng) {
                                indicesConstraints.push(indexBgng);
                            }
                        }
                    }
                }
                const nbOscillatingPolygons = oscillatingPolyWithAdj.oscillatingPolygons.length;
                const index = oscillatingPolyWithAdj.oscillatingPolygons[nbOscillatingPolygons - 1].closestVertexAtEnd.index;
                if(index !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== index) {
                    indicesConstraints.push(index);
                }
            }
        }
        return indicesConstraints;
    }

    checkConstraintTypeConsistency(controlPoints: number[]): void {
        let valid = false;
        if(controlPoints.length === this._inflectionTotalNumberOfConstraints && this.constraintType === ConstraintType.inflection) {
            valid = true;
        } else if(controlPoints.length === this._curvatureExtremaTotalNumberOfConstraints && this.constraintType === ConstraintType.curvatureExtrema) {
            valid = true;
        }
        if(!valid) {
            const error = new ErrorLog(this.constructor.name, "checkConstraintTypeConsistency", "The number of constraints to analyse is not consistent with the type of constraint prescribed: please check.");
            error.logMessageToConsole();
        }
    }

    g(): number[] {
        // const e = this.expensiveComputation(this.spline);
        // return this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this.spline);
        return this.curvatureDerivativeNumerator();
    }

    gradient_g(): DenseMatrix {
        const e = this.expensiveComputation(this.spline);
        return this.gradient_curvatureDerivativeNumerator(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4);

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
                h4: BernsteinDecompositionR1toR1): DenseMatrix {

        let dgx = []
        let dgy = []
        const m = this.spline.controlPoints.length
        const n = this.curvatureExtremaTotalNumberOfConstraints

        let result = new DenseMatrix(n, 2 * m);

        for (let i = 0; i < m; i += 1) {
            const h5 = this.dBasisFunctions_du[i].multiply(sxu);
            let h6 = this.dBasisFunctions_du[i].multiply(syuuu);
            let h7 = syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiply(sxuu);
            let h9 = sxu.multiply(this.d2BasisFunctions_du2[i]);
            let h10 = this.dBasisFunctions_du[i].multiply(syuu);
            let h11 = syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < m; i += 1) {
            let h5 = this.dBasisFunctions_du[i].multiply(syu);
            let h6 = this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1);
            let h7 = sxu.multiply(this.d3BasisFunctions_du3[i]);
            let h8 = this.dBasisFunctions_du[i].multiply(syuu);
            let h9 = syu.multiply(this.d2BasisFunctions_du2[i]);
            let h10 = this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1);
            let h11 = sxu.multiply(this.d2BasisFunctions_du2[i]);
            dgy.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < m; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            for (let j = 0; j < n; j += 1) {
                result.set(j, i, cpx[j]);
                result.set(j, m + i, cpy[j]);
            }
        }

        return result;
    }

    // compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
    //                                                 constraintsSign: number[], 
    //                                                 inactiveConstraints: number[]): DenseMatrix {
    compute_curvatureExtremaConstraints_gradient(constraintsSign: number[], 
                                                inactiveConstraints: number[]): DenseMatrix {

        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const sxuuu = e.bdsxuuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        // const syuuu = e.bdsyuuu
        // const h1 = e.h1
        // const h2 = e.h2
        // const h3 = e.h3
        // const h4 = e.h4
        const sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        const sxuuu = this._analyticHighOrderCurveDerivatives.bdsxuuu;
        const syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        const syuu =this._analyticHighOrderCurveDerivatives.bdsyuu;
        const syuuu = this._analyticHighOrderCurveDerivatives.bdsyuuu;
        const h1 = this._analyticHighOrderCurveDerivatives.h1;
        const h2 = this._analyticHighOrderCurveDerivatives.h2;
        const h3 = this._analyticHighOrderCurveDerivatives.h3;
        const h4 = this._analyticHighOrderCurveDerivatives.h4;

        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        const degree = this.spline.degree;

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
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

    compute_curvatureExtremaConstraints_gradientPreviousIteration(constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix {

        const sxu = this._previousAnalyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuu;
        const sxuuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuuu;
        const syu = this._previousAnalyticHighOrderCurveDerivatives.bdsyu;
        const syuu =this._previousAnalyticHighOrderCurveDerivatives.bdsyuu;
        const syuuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuuu;
        const h1 = this._previousAnalyticHighOrderCurveDerivatives.h1;
        const h2 = this._previousAnalyticHighOrderCurveDerivatives.h2;
        const h3 = this._previousAnalyticHighOrderCurveDerivatives.h3;
        const h4 = this._previousAnalyticHighOrderCurveDerivatives.h4;

        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        const degree = this.spline.degree;

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
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

    traceCurvatureExtrema(): void {
        let curvatureExtrema_gradientsPrevious: number[][] = [];
        let curvatureDerivative_gradientUPrevious = [];
        const knotsCurvatureDerivNumerator = this._shapeSpaceDiffEventsStructure.curveShapeSpaceNavigator.navigationState.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots;
        const gradient_curvatureExtremaPrevious = this.compute_curvatureExtremaConstraints_gradientPreviousIteration(this.curvatureExtremaConstraintsSign, []);
        let curvatureDerivativePrevious = this.bSplineR1toR1Factory(this.curvatureDerivativeNumeratorPreviousIteration(), knotsCurvatureDerivNumerator);
        // let curvatureDerivativePrevious = new BSplineR1toR1(this.curvatureDerivativeNumeratorPreviousIteration(), knotsCurvatureDerivNumerator);
        const zerosCuratureDerivPrevious = curvatureDerivativePrevious.zeros();
        let curvatureDerivative = this.bSplineR1toR1Factory(this.curvatureDerivativeNumerator(), knotsCurvatureDerivNumerator);
        const zerosCuratureDeriv = curvatureDerivative.zeros();
        const curveDP = new BSplineR1toR2DifferentialProperties(this.previousSpline)
        const curvatureDeriv = curveDP.curvatureDerivativeNumerator();
        const zerosCDeriv = curvatureDeriv.zeros();
        console.log("zeros from BSplineDifProp = "+zerosCDeriv);
        const curveDPcurrent = new BSplineR1toR2DifferentialProperties(this.spline)
        const curvatureDerivCurrent = curveDPcurrent.curvatureDerivativeNumerator();
        const zerosCDerivCurrent = curvatureDerivCurrent.zeros();
        console.log("zeros current from BSplineDifProp = "+zerosCDerivCurrent);
        if(this.nbZeros.length < 2 ) {
            this.nbZeros.push(zerosCuratureDerivPrevious.length);
            this.curvatureDerivativeBuffer.push(curvatureDerivativePrevious);
        } else if(this.nbZeros.length === 2) {
            this.nbZeros.splice(0,1);
            this.curvatureDerivativeBuffer.splice(0,1);
            this.nbZeros.push(zerosCuratureDerivPrevious.length);
            this.curvatureDerivativeBuffer.push(curvatureDerivativePrevious);
        }
        console.log("estimate variations of zeros during optim iteration. nb zeros = "+zerosCuratureDerivPrevious.length);
        console.log("spline previous = "+JSON.stringify(this.previousSpline.controlPoints))
        console.log("spline current = "+JSON.stringify(this.spline.controlPoints))
        if(zerosCuratureDerivPrevious.length === 2 && zerosCuratureDeriv.length === 0) {
            // console.log("nbZ[0] = "+this.nbZeros[0]+" Bvert = "+this.curvatureDerivativeBuffer[0].controlPoints+" nbZ[1] = "+this.nbZeros[1]+" Bvert = "+this.curvatureDerivativeBuffer[1].controlPoints);
            console.log("B[0] = "+curvatureDerivative.evaluate(zerosCuratureDerivPrevious[0])+" B[1] = "+curvatureDerivative.evaluate(zerosCuratureDerivPrevious[1]));
            if(curvatureDerivative.evaluate(zerosCuratureDerivPrevious[0]) < 0.0 && curvatureDerivative.evaluate(zerosCuratureDerivPrevious[1]) < 0.0) {
                console.log("Two curvature extrema have merged")
            }
        }
        let curvatureSecondDerivativePrevious = curvatureDerivativePrevious.derivative();
        for(let i = 0; i < zerosCuratureDerivPrevious.length; i++) {
            console.log("zero location[ "+i+" ] = "+zerosCuratureDerivPrevious[i]);
            curvatureDerivative_gradientUPrevious.push(curvatureSecondDerivativePrevious.evaluate(zerosCuratureDerivPrevious[i]));
            if(gradient_curvatureExtremaPrevious.shape[0] !== this._shapeSpaceDiffEventsStructure.curveShapeSpaceNavigator.navigationState.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                console.log('inconsistent sizes of control polygons !!')
            }
            const curvatureExtrema_gradientperCPComponent = [];
            for(let k = 0; k < gradient_curvatureExtremaPrevious.shape[1]; k++) {
                let gradient = [];
                for(let j = 0; j < gradient_curvatureExtremaPrevious.shape[0]; j++) {
                    gradient.push(gradient_curvatureExtremaPrevious.get(j ,k));
                }
                const spline = new BSplineR1toR1(gradient, knotsCurvatureDerivNumerator);
                curvatureExtrema_gradientperCPComponent.push(spline.evaluate(zerosCuratureDerivPrevious[i]));
            }
            curvatureExtrema_gradientsPrevious.push(curvatureExtrema_gradientperCPComponent);
        }

        const flattenedCPsplinePrevious = this.previousSpline.flattenControlPointsArray();
        const flattenedCPsplineUpdated = this.spline.flattenControlPointsArray();
        const curvatureDerivativeVariationWrtCP = [];
        let variationCP = [];
        for(let i = 0; i < flattenedCPsplinePrevious.length; i ++) {
            variationCP.push(flattenedCPsplineUpdated[i] - flattenedCPsplinePrevious[i]);
        }
        for(let i = 0; i < curvatureExtrema_gradientsPrevious.length; i++) {
            let gradient = 0.0;
            for(let j = 0; j < curvatureExtrema_gradientsPrevious[i].length; j ++) {
                gradient = gradient + curvatureExtrema_gradientsPrevious[i][j] * variationCP[j];
            }
            curvatureDerivativeVariationWrtCP.push(gradient);
        }
        const zerosVariations = [];
        for(let i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
            console.log("sum variation B(u) wrt CP at ["+i+"]= "+curvatureDerivativeVariationWrtCP[i]+" gradientUprevious = "+curvatureDerivative_gradientUPrevious[i]);
            zerosVariations.push(- (curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientUPrevious[i]);
        }
        const zerosPreviousCurve = [0.0];
        const zerosEstimated = [0.0];
        for(let i = 0; i < zerosCuratureDerivPrevious.length; i++) {
            const zeroLoc = zerosCuratureDerivPrevious[i];
            zerosPreviousCurve.push(zeroLoc);
            console.log("estimated zero from previous iter location[ "+i+" ] = "+(zeroLoc + zerosVariations[i])+" variation = "+zerosVariations[i]);
            zerosEstimated.push(zeroLoc + zerosVariations[i]);
        }
        zerosPreviousCurve.push(1.0);
        zerosEstimated.push(1.0);
        for(let i = 1; i < zerosPreviousCurve.length; i++) {
            const interval = (zerosPreviousCurve[i] - zerosPreviousCurve[i - 1]);
            const intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
            const intervalVariation = intervalEstimated - interval;
            if(intervalEstimated < 0.0) console.log("estimated interval[ "+i+" ] with zeros crossing");
            if(intervalEstimated < interval) console.log("interval[ "+i+" ]"+" shrinks: "+intervalVariation);
            if(intervalEstimated > interval) console.log("interval[ "+i+" ]"+" expands: "+intervalVariation);
        }
    }

    // compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
    //                                         constraintsSign: number[], 
    //                                         inactiveConstraints: number[]): DenseMatrix {
    compute_inflectionConstraints_gradient(constraintsSign: number[], 
                                            inactiveConstraints: number[]): DenseMatrix {

        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        const sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        const syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        const syuu = this._analyticHighOrderCurveDerivatives.bdsyuu;

        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
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

    compute_inflectionConstraints_gradientPreviousIteration(constraintsSign: number[], 
        inactiveConstraints: number[]): DenseMatrix {

        const sxu = this._previousAnalyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuu;
        const syu = this._previousAnalyticHighOrderCurveDerivatives.bdsyu;
        const syuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuu;

        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
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
                        inactiveConstraints: number[]): SymmetricMatrix[] {


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

        for (let i = 0; i < n; i += 1) {
            hessian_gxx.push([]);
            hessian_gyy.push([]);
            hessian_gxy.push([]);
        }

        for (let i = 0; i < n; i += 1) {
            h5x.push(this.dBasisFunctions_du[i].multiply(sxu));
            h6x.push(this.dBasisFunctions_du[i].multiply(syuuu));
            h7x.push(syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1));
            h8x.push(this.dBasisFunctions_du[i].multiply(sxuu));
            h9x.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
            h10x.push(this.dBasisFunctions_du[i].multiply(syuu));
            h11x.push(syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1));
        }
        for (let i = 0; i < n; i += 1) {
            h5y.push(this.dBasisFunctions_du[i].multiply(syu));
            h6y.push(this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1));
            h7y.push(sxu.multiply(this.d3BasisFunctions_du3[i]));
            h8y.push(this.dBasisFunctions_du[i].multiply(syuu));
            h9y.push(syu.multiply(this.d2BasisFunctions_du2[i]));
            h10y.push(this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1));
            h11y.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
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
    
    prepareForHessianComputation(Dsu: BernsteinDecompositionR1toR1[],
                                Dsuu: BernsteinDecompositionR1toR1[],
                                Dsuuu: BernsteinDecompositionR1toR1[]): void {
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

    setTargetSpline(spline: BSplineR1toR2): void {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this.gradient_f0);
    }

}


export class OptProblemOPenBSplineR1toR2WithWeigthingFactors extends OptProblemOpenBSplineR1toR2 {

    public weigthingFactors: number[];

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);
        this.weigthingFactors = [];
        for (let i = 0; i < this.spline.controlPoints.length * 2; i += 1) {
            this.weigthingFactors.push(DEFAULT_WEIGHT);
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
    f0Step(step: number[]): number {
        let splineTemp = this._spline.clone();
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
        const gradient = this.compute_gradient_f0(splineTemp);
        const n = gradient.length;
        let result = 0;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i];
        }
        return 0.5 * result;
    }

    setWeightingFactor(): void {
        this.weigthingFactors[0] = WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length] = WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length - 1] = WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length * 2 - 1] = WEIGHT_AT_EXTREMITIES;
    }

}

export class OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities extends OptProblemOPenBSplineR1toR2WithWeigthingFactors {

    protected readonly _shapeSpaceBoundaryEnforcer: NestedShapeSpacesBoundaryEnforcerOpenCurve;

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);

        this._shapeSpaceBoundaryEnforcer = new NestedShapeSpacesBoundaryEnforcerOpenCurve();
        let e: ExpensiveComputationResults = this.initExpansiveComputations();
        e = this.expensiveComputation(this._spline);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            this.constraintType = ConstraintType.inflection;
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            this.constraintType = ConstraintType.curvatureExtrema;
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length
        }
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
            this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
        //     this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
            this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
    }

    get shapeSpaceBoundaryEnforcer(): NestedShapeSpacesBoundaryEnforcerOpenCurve {
        return this._shapeSpaceBoundaryEnforcer;
    }

    computeInactiveConstraints(controlPoints: number[]): number[] {
        this.checkConstraintTypeConsistency(controlPoints);
        let inactiveConstraints = this.extractVerticesLocallyClosestToZero(controlPoints);
        if(!this._shapeSpaceBoundaryEnforcer?.isActive()) {
            this.inactivateConstraintsAtCurveEXtremities(controlPoints, inactiveConstraints);
        } else if(this._shapeSpaceBoundaryEnforcer.isCurvatureExtTransitionAtExtremity() && this.constraintType === ConstraintType.curvatureExtrema
            && inactiveConstraints.length > 0) {
            if(inactiveConstraints.indexOf(0) !== -1) inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
            if(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1), 1);
        } else if(this._shapeSpaceBoundaryEnforcer.isInflectionTransitionAtExtremity() && this.constraintType === ConstraintType.inflection
            && inactiveConstraints.length > 0) {
            if(inactiveConstraints.indexOf(0) !== -1) inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
            if(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1), 1);
        }
        console.log("Optim EventMonitoringAtExtremities. inactive constraints"+ inactiveConstraints)
        return inactiveConstraints;
    }

    step(deltaX: number[]) {
        let checked: boolean = true;
        // if(this._previousAnalyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
        //     this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        // }
        // this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        let curvatureNumerator: number[] = [];
        let curvatureDerivativeNumerator: number[] = [];
        // this._previousSpline = this._spline.clone();
        if(this._shapeSpaceBoundaryEnforcer.isActive()) {
            this._inflectionInactiveConstraints = [];
            this._curvatureExtremaInactiveConstraints = [];
        }
        this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));

        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        // e = this.expensiveComputation(this._spline);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        this.traceCurvatureExtrema();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
            this.constraintType = ConstraintType.inflection;
            if(!this._shapeSpaceBoundaryEnforcer.isActive()) 
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator)
            this.constraintType = ConstraintType.curvatureExtrema;
            if(!this._shapeSpaceBoundaryEnforcer.isActive())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this._curvatureNumeratorCP = curvatureNumerator;
        this._curvatureDerivativeNumeratorCP = curvatureDerivativeNumerator;

        //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
        console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)

        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);

        if(this.isComputingHessian) {
            // this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
            this._hessian_f = this.compute_hessian_f(this._analyticHighOrderCurveDerivatives.bdsxu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyu,
                                                    this._analyticHighOrderCurveDerivatives.bdsxuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsxuuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyuuu,
                                                    this._analyticHighOrderCurveDerivatives.h1,
                                                    this._analyticHighOrderCurveDerivatives.h2,
                                                    this._analyticHighOrderCurveDerivatives.h3,
                                                    this._analyticHighOrderCurveDerivatives.h4,
                                                    this.curvatureExtremaConstraintsSign,
                                                    this.curvatureExtremaInactiveConstraints);
        }
        return checked;
    }

    update(spline: BSplineR1toR2): void {
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
        this._inflectionInactiveConstraints = [];
        this._curvatureExtremaInactiveConstraints = [];
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // e = this.expensiveComputation(this._spline);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
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

        console.log("optim curv ext inactive constraints: " + this.curvatureExtremaInactiveConstraints)
        console.log("optim inflection inactive constraints: " + this.inflectionInactiveConstraints)

        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }

}


export class OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints extends OptProblemOPenBSplineR1toR2WithWeigthingFactors {

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);
    }
    
    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }

}

export class OptProblemOpenBSplineR1toR2NoInactiveConstraints extends OptProblemOpenBSplineR1toR2 {

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);
    }

    computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
        return []
    }
}

/* JCL 2020/10/06 derive a class to process cubics with specific desactivation constraint process at discontinuities of B(u) */
export class OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics extends OptProblemOPenBSplineR1toR2WithWeigthingFactors {

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(splineInitial, shapeSpaceDiffEventsStructure);
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

    addInactiveConstraintsForInflections(list: number[], controlPoints: number[]): number[] {
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

    computeInactiveConstraints(controlPoints: number[]) {
        let constraintsSign = this.computeConstraintsSign(controlPoints);
        let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
        let controlPointsClosestToZero = this.computeControlPointsClosestToZeroForCubics(signChangesIntervals, controlPoints)
        let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
        return result
    }
}

export class OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace extends OptProblemOPenBSplineR1toR2WithWeigthingFactors {

    private revertCurvatureExtremaConstraints: number[]
    private curvatureExtremaConstraintBounds: number[]
    private revertInflectionsConstraints: number[]
    private inflectionsConstraintsBounds: number[]
    private controlPointsFunctionBInit: number[]
    public updateConstraintBound: boolean
    private curveAnalyzerCurrentCurve: CurveAnalyzerInterface;
    private curveAnalyzerOptimizedCurve: CurveAnalyzerInterface;
    protected _diffEventsVariation: DiffrentialEventVariation;
    private _iteratedCurves: Array<BSplineR1toR2>;
    protected readonly _shapeSpaceBoundaryEnforcer: StrictShapeSpacesBoundaryEnforcerOpenCurve;

    constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure,
        navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(splineInitial, shapeSpaceDiffEventsStructure);

        this.curveAnalyzerCurrentCurve = navigationCurveModel.curveAnalyserCurrentCurve;
        this.curveAnalyzerOptimizedCurve = navigationCurveModel.curveAnalyserOptimizedCurve;
        this._diffEventsVariation = new DiffrentialEventVariation(this.curveAnalyzerCurrentCurve, this.curveAnalyzerOptimizedCurve);
        this._shapeSpaceBoundaryEnforcer = new StrictShapeSpacesBoundaryEnforcerOpenCurve();
        this._iteratedCurves = [];

        this.updateConstraintBound = true;
        this.revertCurvatureExtremaConstraints = [];
        this.revertInflectionsConstraints = [];
        
        let e: ExpensiveComputationResults = this.initExpansiveComputations();
        e = this.expensiveComputation(this._spline);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            this.constraintType = ConstraintType.inflection;
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length
        }
        for(let i = 0; i < this._curvatureNumeratorCP.length; i += 1) {
            this.revertInflectionsConstraints.push(1);
        }
        this.inflectionsConstraintsBounds = zeroVector(this._curvatureNumeratorCP.length);

        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            this.constraintType = ConstraintType.curvatureExtrema;
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length
        }

        this.controlPointsFunctionBInit =  this._curvatureDerivativeNumeratorCP
        this.curvatureExtremaConstraintBounds = zeroVector(this._curvatureDerivativeNumeratorCP.length);
        for(let i = 0; i < this._curvatureDerivativeNumeratorCP.length; i += 1) {
            this.revertCurvatureExtremaConstraints.push(1);
        }

        this.clearInequalityChanges();
        this.clearConstraintBoundsUpdate();
        this.revertInequalitiesWithinRangeOfLocalExtremum();
        this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        console.log("optim inactive curv ext constraints: " + this.curvatureExtremaInactiveConstraints);
        console.log("optim inactive inflection constraints: " + this.inflectionInactiveConstraints);

        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
            this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
        //     this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
            this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        
        // if (this.isComputingHessian) {
        //     this.prepareForHessianComputation(this.dBasisFunctions_du, this.d2BasisFunctions_du2, this.d3BasisFunctions_du3)
        //     this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        // }
    }

    get diffEventsVariation(): DiffrentialEventVariation {
        return this._diffEventsVariation;
    }

    get iteratedCurves(): Array<BSplineR1toR2> {
        return this._iteratedCurves;
    }

    get shapeSpaceBoundaryEnforcer(): StrictShapeSpacesBoundaryEnforcerOpenCurve {
        return this._shapeSpaceBoundaryEnforcer;
    }

    set diffEventsVariation(diffEventsVariation: DiffrentialEventVariation) {
        this._diffEventsVariation = diffEventsVariation;
    }

    clearIteratedCurves(): void {
        this._iteratedCurves = [];
    }

    checkConstraintConsistency(): void {
        /* JCL 08/03/2021 Add test to check the consistency of the constraints values.
            As the reference optimization problem is set up, each active constraint is an inequality strictly negative.
            Consequently, each active constraint value must be negative. */
        enum constraintType {curvatureExtremum, inflexion, none};
        let invalidConstraints: {value: number, type: constraintType, index: number}[] = [];
        for(let i = 0; i < this._f.length; i += 1) {
            if(this._f[i] > 0.0) {
                let typeC: constraintType;
                let indexC: number;
                if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    typeC = constraintType.curvatureExtremum;
                    indexC = i;
                    if(i < this.curvatureExtremaNumberOfActiveConstraints) {
                        for(let constraintIndex of this.curvatureExtremaInactiveConstraints) {
                            if(i > constraintIndex) indexC = indexC + 1;
                        }
                    } else {
                        indexC = i - this.curvatureExtremaNumberOfActiveConstraints;
                        typeC = constraintType.inflexion;
                        for(let constraintIndex of this.inflectionInactiveConstraints) {
                            if(i > constraintIndex) indexC = indexC + 1;
                        }
                    }
                } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    typeC = constraintType.curvatureExtremum;
                    indexC = i;
                    for(let constraintIndex of this.curvatureExtremaInactiveConstraints) {
                        if(i > constraintIndex) indexC = indexC + 1;
                    }
                } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
                    typeC = constraintType.inflexion;
                    indexC = i;
                    for(let constraintIndex of this.inflectionInactiveConstraints) {
                        if(i > constraintIndex) indexC = indexC + 1;
                    }
                } else {
                    typeC = constraintType.none;
                    indexC = RETURN_ERROR_CODE;
                    const warning = new WarningLog(this.constructor.name, "checkConstraintConsistency", "No active control set. There should be no constraint.");
                    warning.logMessageToConsole();
                }
                invalidConstraints.push({value: this._f[i], type: typeC, index: indexC});
            }
        }
        if(invalidConstraints.length > 0) {
            const message = "Inconsistent constraints. Constraints value must be negative. " + JSON.stringify(invalidConstraints);
            const error = new ErrorLog(this.constructor.name, "checkConstraintConsistency", message);
            error.logMessageToConsole();
        }
    }

    inactivateConstraintClosestToZero(controlPoints: number[], inactiveConstraints: number[]): void {
        const polygonOfCtrlPts = new PolygonWithVerticesR1(controlPoints);
        const globalExtremumOffAxis = polygonOfCtrlPts.extractClosestLocalExtremmumToAxis().index;
        if(globalExtremumOffAxis !== RETURN_ERROR_CODE) {
            inactiveConstraints.push(globalExtremumOffAxis);
            inactiveConstraints.sort(function(a, b) { return (a - b) });
        }
    }

    // inactivateConstraintsAtCurveEXtremities(controlPoints: number[], inactiveConstraints: number[]): void {
    //     if(inactiveConstraints.indexOf(0) === -1) inactiveConstraints.splice(0, 0, 0);
    //     if(inactiveConstraints.indexOf(controlPoints.length - 1) === -1) inactiveConstraints.push(controlPoints.length - 1);
    // }

    inactivateConstraintsWithinRangeOfLocalExtremum(inactiveConstraints: number[]): void {
        if(this._diffEventsVariation === undefined || this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
            // && this.constraintType === ConstraintType.curvatureExtrema && this.updateConstraintBound) {
            && this.constraintType === ConstraintType.curvatureExtrema) {

            const upperBound = this._diffEventsVariation.span;
            const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for(let j = lowerBound; j < upperBound + 1; j += 1) {
                if(inactiveConstraints.indexOf(j) !== -1) inactiveConstraints.splice(inactiveConstraints.indexOf(j), 1)
            }
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
            && this.constraintType === ConstraintType.curvatureExtrema) {

            if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
                } else if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1), 1);
                }
                /* JCL 08/03/2021 Add constraint modifications to curvature extrema appearing based on a non null optimum value of B(u) */
                if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
                        if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(i) !== -1)
                            inactiveConstraints.splice(inactiveConstraints.indexOf(i), 1);
                    }
                }
            } else console.log("Null content of shapeSpaceBoundaryConstraintsCurvExtrema.")
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === ConstraintType.inflection) {
            
            if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
                } else if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1), 1);
                }
                /* JCL something to do with this._diffEventsVariation for A(u) extrema ? */
            }
        }
    }

    clearInequalityChanges(): void {
        if(this.constraintType === ConstraintType.curvatureExtrema) {
            for(let controlPoint of this._curvatureDerivativeNumeratorCP) {
                this.revertCurvatureExtremaConstraints[controlPoint] = 1;
            }
        } else if(this.constraintType === ConstraintType.inflection) {
            for(let controlPoint of this._curvatureNumeratorCP) {
                this.revertCurvatureExtremaConstraints[controlPoint] = 1;
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "clearInequalityChanges", "Current constraint type is not compatible with the inequalities changes.");
            error.logMessageToConsole();
        }
    }

    clearConstraintBoundsUpdate(): void {
        if(this.constraintType === ConstraintType.curvatureExtrema) {
            for(let controlPoint of this._curvatureDerivativeNumeratorCP) {
                this.curvatureExtremaConstraintBounds[controlPoint] = 0;
            }
        } else if(this.constraintType === ConstraintType.inflection) {
            for(let controlPoint of this._curvatureNumeratorCP) {
                this.curvatureExtremaConstraintBounds[controlPoint] = 0;
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "clearConstraintBoundsUpdate", "Current constraint type is not compatible with the constraint bounds update.");
            error.logMessageToConsole();
        }
    }

    revertInequalitiesWithinRangeOfLocalExtremum(): void {
        if(this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
            && this.constraintType === ConstraintType.curvatureExtrema && (this.updateConstraintBound || this._shapeSpaceBoundaryEnforcer.hasNewEvent())) {

            const upperBound = this._diffEventsVariation.span;
            const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for(let i = lowerBound + 1; i < upperBound; i+= 1) {
                if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                    if(this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
                        && this._diffEventsVariation.extremumValueOpt < 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                    if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                } else if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                    if(this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
                        && this._diffEventsVariation.extremumValueOpt < 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                    if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0) {
                        if(this._diffEventsVariation.CPvariations[i] > 0) {
                            this.revertCurvatureExtremaConstraints[i] = 1;
                        } else {
                            this.revertCurvatureExtremaConstraints[i] = -1;
                        }
                    }
                }
            }
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
            && this.constraintType === ConstraintType.curvatureExtrema) {

            if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    this.revertCurvatureExtremaConstraints[0] = 1;
                }
                if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    this.revertCurvatureExtremaConstraints[this._curvatureExtremaTotalNumberOfConstraints - 1] = 1;
                }
                if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
                        this.revertCurvatureExtremaConstraints[i] = 1;
                        if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                            if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                                this.revertCurvatureExtremaConstraints[i] = -1;
                            } else {
                                this.revertCurvatureExtremaConstraints[i] = -1;
                            }
                        }
                    }
                }
            } 
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === ConstraintType.inflection) {

            if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    this.revertInflectionsConstraints[0] = 1;
                }
                if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    this.revertInflectionsConstraints[this._inflectionTotalNumberOfConstraints - 1] = 1;
                }
                // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                //     /* to be added: the interval span to be processed */
                //     for(let i = 1; i < this._inflectionTotalNumberOfConstraints - 1; i+= 1){
                //         this.revertInflectionsConstraints[i] = 1;
                //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                //                 this.revertInflectionsConstraints[i] = -1;
                //             } else {
                //                 this.revertInflectionsConstraints[i] = -1;
                //             }
                //         }
                //     }
                // }
            }
        }
    }

    updateConstraintBoundsWithinRangeOfLocalExtremum(): void {
        if(this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
            && this.constraintType === ConstraintType.curvatureExtrema && (this.updateConstraintBound || this._shapeSpaceBoundaryEnforcer.hasNewEvent())) {

            const upperBound = this._diffEventsVariation.span;
            const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for(let i = lowerBound + 1; i < upperBound; i+= 1) {
                if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                    if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0) {
                        if(this._diffEventsVariation.CPvariations[i] > 0) {
                            this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + (this._diffEventsVariation.CPvariations[i] * this._diffEventsVariation.extremumValue) / (this._diffEventsVariation.extremumValueOpt - this._diffEventsVariation.extremumValue);
                        } else {
                            this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                        }
                    }
                }
            }
            if(this._shapeSpaceBoundaryEnforcer.hasNewEvent()) {
                this.curvatureExtremaConstraintBounds[0] = 0
                for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints; i+= 1) {
                    if(this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] > 0) {
                        this.curvatureExtremaConstraintBounds[i] = this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] - CONSTRAINT_BOUND_THRESHOLD;
                    } else {
                        this.curvatureExtremaConstraintBounds[i] = 0
                    }
                }
            }
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
            && this.constraintType === ConstraintType.curvatureExtrema) {

            if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
                    this.curvatureExtremaConstraintBounds[0] = 0;
                }
                if(this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    this.curvatureExtremaConstraintBounds[this._curvatureExtremaTotalNumberOfConstraints - 1] = 0;
                }
                if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
                        this.curvatureExtremaConstraintBounds[i] = 0;
                        if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                            if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                            } else {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                            }
                        } else if(this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
                            if(this._diffEventsVariation.CPvariations[i] < 0.0) {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                            } else {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                            }
                        }
                    }
                }
            }
        } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === ConstraintType.inflection) {

            if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
            // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
                    this.inflectionsConstraintsBounds[0] = 0;
                }
                if(this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    this.inflectionsConstraintsBounds[this._inflectionTotalNumberOfConstraints - 1] = 0;
                }
                // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                //     /* to be added: the interval span to be processed */
                //     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
                //         this.curvatureExtremaConstraintBounds[i] = 0;
                //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                //             } else {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                //             }
                //         } else if(this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] < 0.0) {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                //             } else {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                //             }
                //         }
                //     }
                // }
            }
        }
    }

    computeInactiveConstraints(controlPoints: number[]): number[] {
        this.checkConstraintTypeConsistency(controlPoints);
        let inactiveConstraints = this.extractVerticesLocallyClosestToZero(controlPoints);
        this.inactivateConstraintClosestToZero(controlPoints, inactiveConstraints);
        this.inactivateConstraintsAtCurveEXtremities(controlPoints, inactiveConstraints);
        this.inactivateConstraintsWithinRangeOfLocalExtremum(inactiveConstraints);
        return inactiveConstraints;
    }

    compute_curvatureExtremaConstraints(curvatureDerivativeNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]): number[] {
        let result: number[] = [];
        if(this._diffEventsVariation === undefined) return result;
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            } else {
                result.push((curvatureDerivativeNumerator[i] - this.curvatureExtremaConstraintBounds[i]) * constraintsSign[i] * this.revertCurvatureExtremaConstraints[i])
            }
        }
        return result
    }

    compute_inflectionConstraints(curvatureNumerator: number[], constraintsSign: number[],
        inactiveConstraints: number[]): number[] {

        let result: number[] = [];
        if(this._diffEventsVariation === undefined) return result;
        for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            } else {
                result.push((curvatureNumerator[i] - this.inflectionsConstraintsBounds[i]) * constraintsSign[i] * this.revertInflectionsConstraints[i]);
            }
        }
        return result;
    }

    // compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
    //                                             constraintsSign: number[], 
    //                                             inactiveConstraints: number[]): DenseMatrix {
    compute_curvatureExtremaConstraints_gradient(constraintsSign: number[], 
                                                inactiveConstraints: number[]): DenseMatrix {

        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const sxuuu = e.bdsxuuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        // const syuuu = e.bdsyuuu
        // const h1 = e.h1
        // const h2 = e.h2
        // const h3 = e.h3
        // const h4 = e.h4
        const sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        const sxuuu = this._analyticHighOrderCurveDerivatives.bdsxuuu;
        const syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        const syuu = this._analyticHighOrderCurveDerivatives.bdsyuu;
        const syuuu = this._analyticHighOrderCurveDerivatives.bdsyuuu;
        const h1 = this._analyticHighOrderCurveDerivatives.h1;
        const h2 = this._analyticHighOrderCurveDerivatives.h2;
        const h3 = this._analyticHighOrderCurveDerivatives.h3;
        const h4 = this._analyticHighOrderCurveDerivatives.h4;

        let dgx = []
        let dgy = []
        const controlPointsLength = this.spline.controlPoints.length
        const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints
        const degree = this.spline.degree

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }

        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)
        if(this._diffEventsVariation === undefined) return result;

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
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
                }
            }
        }

        return result;
    }

    // compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
    //     constraintsSign: number[], 
    //     inactiveConstraints: number[]): DenseMatrix {
    compute_inflectionConstraints_gradient( constraintsSign: number[], 
                                            inactiveConstraints: number[]): DenseMatrix {

        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        const sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        const sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        const syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        const syuu = this._analyticHighOrderCurveDerivatives.bdsyuu;

        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }

        const totalNumberOfConstraints = this.inflectionConstraintsSign.length

        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)
        if(this._diffEventsVariation === undefined) return result;

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
                result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j])
                result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j])
                }
            }
        }

        return result;
    }


    compute_f(  curvatureNumerator: number[],
                inflectionConstraintsSign: number[],
                inflectionInactiveConstraints: number[],
                curvatureDerivativeNumerator: number[],
                curvatureExtremaConstraintsSign: number[],
                curvatureExtremaInactiveConstraints: number[]) {
        let f: number[] = [];
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " r1: " + r1)
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
            f = r1.concat(r2);
        } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " f: " + f)
        } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
        }
       return f;
    }

    // compute_gradient_f( e: ExpensiveComputationResults,
    //                     inflectionConstraintsSign: number[],
    //                     inflectionInactiveConstraints: number[],
    //                     curvatureExtremaConstraintsSign: number[], 
    //                     curvatureExtremaInactiveConstraints: number[]): DenseMatrix {
    compute_gradient_f( inflectionConstraintsSign: number[],
                        inflectionInactiveConstraints: number[],
                        curvatureExtremaConstraintsSign: number[], 
                        curvatureExtremaInactiveConstraints: number[]): DenseMatrix {
    
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const m1 = this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" grad_fGN: " + curvatureExtremaConstraintsSign + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " m1: " + m1)
            // const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            const m2 = this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints)
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
            // return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            return this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            // return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            return this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints);
        } else {
            const warning = new WarningLog(this.constructor.name, "compute_gradient_f", "active control set to none: unable to compute gradients of f.");
            warning.logMessageToConsole();
            let result = new DenseMatrix(1, 1);
            return result;
        }
    }

    step(deltaX: number[]) {
        let checked: boolean = true;
        let inactiveCurvatureConstraintsAtStart = this.curvatureExtremaInactiveConstraints;
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        let curvatureNumerator: number[] = [];
        let curvatureDerivativeNumerator: number[] = [];
        let curvatureDerivativeEXtrema: number[] = [];
        let curvatureDerivativeEXtremaUpdated: number[] = [];
        if(this._shapeSpaceBoundaryEnforcer.isActive()) {
            this._inflectionInactiveConstraints = [];
            this._curvatureExtremaInactiveConstraints = [];
        }
        // if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
        if(this.diffEventsVariation.neighboringEvents.length > 0) {
            if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                const splineDP = new BSplineR1toR2DifferentialProperties(this.spline)
                const functionB = splineDP.curvatureDerivativeNumerator()
                const curvatureExtremaLocations = functionB.zeros()
                const functionBderivativeExtrema = functionB.derivative().zeros();
                for(const extLoc of functionBderivativeExtrema) {
                    curvatureDerivativeEXtrema.push(functionB.evaluate(extLoc));
                }
                const splineCurrent = this.spline.clone()
    
                this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
                const splineDPupdated = new BSplineR1toR2DifferentialProperties(this.spline)
                const functionBupdated = splineDPupdated.curvatureDerivativeNumerator()
                const curvatureExtremaLocationsUpdated = functionBupdated.zeros()
                const functionBderivativeExtremaUpdated = functionBupdated.derivative().zeros();
                for(const extLoc of functionBderivativeExtremaUpdated) {
                    curvatureDerivativeEXtremaUpdated.push(functionBupdated.evaluate(extLoc));
                }
                if(curvatureExtremaLocationsUpdated.length !== curvatureExtremaLocations.length) {
                    checked = false
                    // this.spline = splineCurrent
                    console.log("extrema current: " + curvatureExtremaLocations + " extrema updated: " + curvatureExtremaLocationsUpdated)
                    this._iteratedCurves.pop();
                    return checked;
                } else {
                    this._iteratedCurves.push(this.spline);
                }
            } else {
                this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
            }
        } else {
            this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
            this._iteratedCurves.push(this.spline);
        }

        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
            this.constraintType = ConstraintType.inflection;
            // this._inflectionInactiveConstraints = this.computeInactiveConstraintsGN(curvatureNumerator)
            if(!this._shapeSpaceBoundaryEnforcer.isActive()) 
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
            // if(this.updateConstraintBound) {
            //     this.clearInequalityChanges();
            //     this.clearConstraintBoundsUpdate();
            //     this.revertInequalitiesWithinRangeOfLocalExtremum();
            //     this.updateConstraintBoundsWithinRangeOfLocalExtremum();
            // }
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator)
            this.constraintType = ConstraintType.curvatureExtrema;
            // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(g)
            if(!this._shapeSpaceBoundaryEnforcer.isActive())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }

        if(this.updateConstraintBound) {
            this.clearInequalityChanges();
            this.clearConstraintBoundsUpdate();
            this.revertInequalitiesWithinRangeOfLocalExtremum();
            this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        }

        //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
        console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " revert " + this.revertCurvatureExtremaConstraints
             + " cst sgn " + this.curvatureExtremaConstraintsSign + " bound " + this.curvatureExtremaConstraintBounds
             + " update status "+ this.updateConstraintBound + " extB " + curvatureDerivativeEXtrema + " extBUpdt " + curvatureDerivativeEXtremaUpdated)

        this.updateConstraintBound = false;

        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, curvatureDerivativeNumerator, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);

        if(this.isComputingHessian) {
            // this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
            this._hessian_f = this.compute_hessian_f(this._analyticHighOrderCurveDerivatives.bdsxu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyu,
                                                    this._analyticHighOrderCurveDerivatives.bdsxuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsxuuu,
                                                    this._analyticHighOrderCurveDerivatives.bdsyuuu,
                                                    this._analyticHighOrderCurveDerivatives.h1,
                                                    this._analyticHighOrderCurveDerivatives.h2,
                                                    this._analyticHighOrderCurveDerivatives.h3,
                                                    this._analyticHighOrderCurveDerivatives.h4,
                                                    this.curvatureExtremaConstraintsSign,
                                                    this.curvatureExtremaInactiveConstraints);
        }

        return checked
    }

    update(spline: BSplineR1toR2): void {
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
        this._inflectionInactiveConstraints = [];
        this._curvatureExtremaInactiveConstraints = [];
        this.curveAnalyzerCurrentCurve = this._diffEventsVariation.curveAnalyser1;
        this.curveAnalyzerOptimizedCurve = this._diffEventsVariation.curveAnalyser2;
        if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            this._curvatureNumeratorCP = this.curvatureNumerator();
            this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
            this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
            this.constraintType = ConstraintType.inflection;
            if(!this._shapeSpaceBoundaryEnforcer.hasNewEvent())
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
        }
        if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator();
            this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
            this.constraintType = ConstraintType.curvatureExtrema;
            if(!this._shapeSpaceBoundaryEnforcer.hasNewEvent())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
        }

        this.controlPointsFunctionBInit =  this._curvatureDerivativeNumeratorCP
        // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("B(u) control points at init:" + this.currentCurvatureExtremaControPoints)
        this.curvatureExtremaConstraintBounds = zeroVector(this._curvatureDerivativeNumeratorCP.length);
        for(let i = 0; i < this._curvatureDerivativeNumeratorCP.length; i += 1) {
            this.revertCurvatureExtremaConstraints[i] = 1;
        }

        this.clearInequalityChanges();
        this.clearConstraintBoundsUpdate();
        this.revertInequalitiesWithinRangeOfLocalExtremum();
        this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        console.log("optim curv ext inactive constraints: " + this.curvatureExtremaInactiveConstraints)
        console.log("optim inflection inactive constraints: " + this.inflectionInactiveConstraints)

        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }

    cancelEvent() {
        /* JCL attention clearVariation n'est pas strictement equivalent aux operations ci-dessus*/
        this._diffEventsVariation.clearVariation();
        // this._diffEventsVariation.neighboringEvents = [];

        //const e = this.expensiveComputation(this.spline)  
        //const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintBounds = zeroVector(this.curvatureExtremaConstraintBounds.length);
        for(let i = 0; i < this.revertCurvatureExtremaConstraints.length; i += 1) {
            this.revertCurvatureExtremaConstraints[i] = 1
        }
        let delta = zeroVector(this.spline.controlPoints.length * 2);
        this.step(delta);
        this.checkConstraintConsistency();
    }

}