// import { OptimizationProblemInterface } from "../optimizationProblemFacade/OptimizationProblemInterface"
// import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
// import { zeroVector, containsNaN, sign } from "../linearAlgebra/MathVectorBasicOperations";
// import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
// import { BernsteinDecompositionR1toR1 } from "../newBsplines/BernsteinDecompositionR1toR1";
// import { SymmetricMatrixInterface } from "../linearAlgebra/MatrixInterfaces";
// import { identityMatrix, DiagonalMatrix } from "../linearAlgebra/DiagonalMatrix";
// import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
// import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
// import { NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";
// import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
// import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
// import { BaseOpProblemBSplineR1toR2, ConstraintType, ExpensiveComputationResults, convertStepToVector2d } from "./BaseOpBSplineR1toR2";
// import { PolygonWithVerticesR1 } from "../containers/PolygonWithVerticesR1";
// import { extractAdjacentOscillatingPolygons } from "../containers/OscillatingPolygonWithVerticesR1";
// import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
// import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
// import { OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
// import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
// import { DiffrentialEventVariation } from "../sequenceOfDifferentialEvents/DifferentialEventVariation";
// import { OpenCurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
// import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";


// interface intermediateKnotWithNeighborhood {knot: number, left: number, right: number, index: number}
// interface extremaNearKnot {kIndex: number, extrema: Array<number>}
// export enum eventMove {still, moveToKnotLR, moveAwayFromKnotRL, moveToKnotRL, moveAwayFromKnotLR, atKnot}
// enum transitionCP {negativeToPositive, positiveToNegative, none}

// const DEVIATION_FROM_KNOT = 0.25
// export const CONSTRAINT_BOUND_THRESHOLD = 1.0e-7;
// export const DEFAULT_WEIGHT = 1;
// export const WEIGHT_AT_EXTREMITIES = 10;

// export class OptProblemBSplineR1toR2 extends BaseOpProblemBSplineR1toR2 {
// // export class OptimizationProblem_BSpline_R1_to_R2 implements OptimizationProblemInterface {

//     /* JCL for testing purposes */
//     // public curvatureExtremaConstraintsSign: number[] = []
//     // public inflectionConstraintsSign: number[] = []

//     // protected curvatureExtremaNumberOfActiveConstraints: number;
//     // protected inflectionNumberOfActiveConstraints: number;
//     // public curvatureExtremaTotalNumberOfConstraints: number
//     // public inflectionTotalNumberOfConstraints: number

//     readonly isComputingHessian: boolean = false;
//     private Dh5xx: BernsteinDecompositionR1toR1[][] = []
//     private Dh6_7xy: BernsteinDecompositionR1toR1[][] = []
//     private Dh8_9xx: BernsteinDecompositionR1toR1[][] = []
//     private Dh10_11xy: BernsteinDecompositionR1toR1[][] = []

//     // constructor(target: BSplineR1toR2, initial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);

//         // this._target = target.clone();
//         // this.computeBasisFunctionsDerivatives();
//         // this._numberOfIndependentVariables = this.spline.controlPoints.length * 2;
//         // this._gradient_f0 = this.compute_gradient_f0(this.spline)
//         // this._f0 = this.compute_f0(this._gradient_f0)
//         // this._hessian_f0 = identityMatrix(this.numberOfIndependentVariables)
//         // const e = this.expensiveComputation(this.spline)
//         // const curvatureNumerator = this.curvatureNumerator(e.h4)
        
//         //     // this.inflectionTotalNumberOfConstraints = curvatureNumerator.length

//         // const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//         //     // this.curvatureExtremaTotalNumberOfConstraints = g.length
//         // this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
//         // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
//         //     // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
//         // this.curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length
//         //     // console.log("optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)


//         // this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
//         // this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
//         //     // this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
//         // this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length

//         // this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//         // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        
//         if (this.isComputingHessian) {
//             const e = this.expensiveComputation(this.spline)
//             this.prepareForHessianComputation(this.dBasisFunctions_du, this.d2BasisFunctions_du2, this.d3BasisFunctions_du3)
//             this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//         }
//     }

//     // get numberOfConstraints() {
//     //     return this.curvatureExtremaNumberOfActiveConstraints + this.inflectionNumberOfActiveConstraints
//     // }

//     get f() {
//         if (containsNaN(this._f)) {
//             throw new Error("OptimizationProblem_BSpline_R1_to_R2 contains Nan in its f vector")
//         }
//         return this._f;
//     }

//     get spline(): BSplineR1toR2 {
//         return this._spline as BSplineR1toR2;
//     }

//     set spline(spline: BSplineR1toR2) {
//         this._spline = spline;
//     }

//     bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
//         return new BSplineR1toR1(controlPoints, knots);
//     }

//     computeBasisFunctionsDerivatives(): void {
//         const n = this.spline.controlPoints.length;
//         this._numberOfIndependentVariables = n * 2;
//         let diracControlPoints = zeroVector(n);
//         let secondOrderSplineDerivatives: BSplineR1toR1[] = [];
//         this.dBasisFunctions_du = [];
//         this.d2BasisFunctions_du2 = [];
//         this.d3BasisFunctions_du3 = [];
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             for (let i = 0; i < n; i += 1) {
//                 diracControlPoints[i] = 1;
//                 let s = new BSplineR1toR1(diracControlPoints.slice(), this.spline.knots.slice());
//                 let su = s.derivative();
//                 let suu = su.derivative();
//                 secondOrderSplineDerivatives.push(suu);
//                 // let suuu = suu.derivative();
//                 const suBDecomp = su.bernsteinDecomposition();
//                 const suuBDecomp = suu.bernsteinDecomposition();
//                 // const suuuBDecomp = suuu.bernsteinDecomposition();
//                 this.dBasisFunctions_du.push(suBDecomp);
//                 this.d2BasisFunctions_du2.push(suuBDecomp);
//                 // this.d3BasisFunctions_du3.push(suuuBDecomp);
//                 diracControlPoints[i] = 0;
//             }
//         }
//         if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             let diracControlPoints = zeroVector(n);
//             for (let i = 0; i < n; i += 1) {
//                 diracControlPoints[i] = 1;
//                 let suuu = secondOrderSplineDerivatives[i].derivative();
//                 const suuuBDecomp = suuu.bernsteinDecomposition();
//                 this.d3BasisFunctions_du3.push(suuuBDecomp);
//                 diracControlPoints[i] = 0;
//             }
//         }
//     }

//     // step(deltaX: number[]): boolean {
//     //     // JCL 05/03/2021 add the checked status to enable stopping the iteration process if the curve is analyzed
//     //     let checked: boolean = true

//     //     this.spline.optimizerStep(deltaX)
//     //     this._gradient_f0 = this.compute_gradient_f0(this.spline)
//     //     this._f0 = this.compute_f0(this._gradient_f0)
//     //     const e = this.expensiveComputation(this.spline)  
//     //     const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//     //     this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
//     //     this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
//     //     // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
//     //     this.curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length
//     //     //console.log("step : optim inactive constraints: " + this.curvatureExtremaInactiveConstraints)

//     //     const curvatureNumerator = this.curvatureNumerator(e.h4)
//     //     this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
//     //     this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
//     //     // this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
//     //     this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length


//     //     this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//     //     this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)

//     //     if (this.isComputingHessian) {
//     //         this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//     //     }

//     //     return checked
//     // }

//     // computeConstraintsSign(controlPoints: number[]): number[] {
//     //     let result: number[] = []
//     //     for (let i = 0, n = controlPoints.length; i < n; i += 1) {
//     //         if (controlPoints[i] > 0) {
//     //             result.push(-1);
//     //         } else {
//     //             result.push(1);
//     //         }
//     //     }
//     //     //console.log(result.length)
//     //     return result
//     // }

//     computeSignChangeIntervals(constraintsSign: number[]): number[] {
//         let signChangesIntervals: number[] = []
//         let previousSign = constraintsSign[0]
//         for (let i = 1, n = constraintsSign.length; i < n; i += 1) {
//             if (previousSign !== constraintsSign[i]) {
//                 signChangesIntervals.push(i - 1)
//             }
//             previousSign = constraintsSign[i]
//         }
//         return signChangesIntervals
//     }


//     computeControlPointsClosestToZero(signChangesIntervals: number[], controlPoints: number[]): number[] {
//         let result: number[] = []
//         for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
//             if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
//                 result.push(signChangesIntervals[i] + 1)
//                 i += 1
//             }
//             else {
//                 if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
//                     result.push(signChangesIntervals[i]);
//                 } else {
//                     result.push(signChangesIntervals[i] + 1);
//                 }
//             }
//         }
//         //console.log("degree: " + this.spline.degree + " nbKnot: " + this.spline.distinctKnots().length)
//         /* JCL 2020/10/02 modification as alternative to sliding mechanism */
//         /*if(this.spline.degree === 3 && controlPoints.length === (this.spline.distinctKnots().length - 1)*7){
//             let n = Math.trunc(controlPoints.length/7);
//             console.log("degree: " + this.spline.degree + " nbCP: " + controlPoints.length)
//             for(let j = 1; j < n ; j += 1) {
//                 if(controlPoints[6*j]*controlPoints[6*j + 1] < 0) {
//                     //console.log("CP: " + controlPoints)
//                     if(result.indexOf(6*j) > 0 && result.indexOf(6*j + 1) < 0) {
//                         result.push(6*j + 1);
//                     } else if(result.indexOf(6*j) < 0 && result.indexOf(6*j + 1) > 0) {
//                         result.push(6*j);
//                     }
//                 }
//             }
//             result.sort(function(a, b) { return (a - b) });
//         }*/
        
//         return result
//     }

//     addInactiveConstraintsForInflections(list: number[], controlPoints: number[]): number[] {
//         let result: number[] = []
//         for (let i = 0, n = list.length; i < n; i += 1) {
//             if (list[i] !== 0 && controlPoints[list[i] - 1] === controlPoints[list[i]] ) {
//                 if (i == 0) {
//                     result.push(list[i] - 1)
//                 }
//                 if (i !== 0 && list[i-1] !== list[i] - 1) {
//                     result.push(list[i] - 1)
//                 }
//             }
//             result.push(list[i])

//             if (list[i] !== controlPoints.length - 2 && controlPoints[list[i]] === controlPoints[list[i] + 1] ) {
//                 if (i == list.length - 1) {
//                     result.push(list[i] + 1)
//                 }
//                 if (i !== list.length - 1 && list[i + 1] !== list[i] + 1) {
//                     result.push(list[i] + 1)
//                 }
//             }
//         }
//         return result
//     }

//     /**
//      * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.  
//      * A curvature extremum or an inflection is located between two coefficient of different signs. 
//      * For the general case, the smallest coefficient in absolute value is chosen to be free.
//      * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
//      * 
//      * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
//      * @param controlPoints The vector of value of the function: f_i
//      */
//     // computeInactiveConstraints(constraintsSign: number[], controlPoints: number[]) {
//     //     let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
//     //     let controlPointsClosestToZero = this.computeControlPointsClosestToZero(signChangesIntervals, controlPoints)
//     //     let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
//     //     return result
//     // }

//     computeInactiveConstraints(controlPoints: number[]): number[] {
//         // let constraintsSign = this.computeConstraintsSign(controlPoints);
//         // let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign);
//         // let controlPointsClosestToZero = this.computeControlPointsClosestToZero(signChangesIntervals, controlPoints);
//         // let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints);
//         // test new method
//         this.checkConstraintTypeConsistency(controlPoints);
//         let result = this.extractVerticesLocallyClosestToZero(controlPoints);
//         return result;
//     }

//     extractVerticesLocallyClosestToZero(controlPoints: number[]): number[] {
//         let indicesConstraints: number[] = [];
//         const polygon = new PolygonWithVerticesR1(controlPoints);
//         const oscillatingPolygons = polygon.extractOscillatingPolygons();
//         if(oscillatingPolygons.length !== 0) {
//             const oscillatingPolygonsWithAdjacency = extractAdjacentOscillatingPolygons(oscillatingPolygons);
//             for(let oscillatingPolyWithAdj of oscillatingPolygonsWithAdjacency) {
//                 if(oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index !== RETURN_ERROR_CODE) {
//                     indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index);
//                 }
//                 if(oscillatingPolyWithAdj.oscillatingPolygons.length !== 1) {
//                     for(let connectionIndex = 0; connectionIndex < (oscillatingPolyWithAdj.oscillatingPolygons.length - 1); connectionIndex++) {
//                         const compatibleConstraint = oscillatingPolyWithAdj.getClosestVertexToZeroAtConnection(connectionIndex);
//                         if(compatibleConstraint.index !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== compatibleConstraint.index) {
//                             indicesConstraints.push(compatibleConstraint.index);
//                         } else {
//                             const indexEnd = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index;
//                             if(indexEnd !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexEnd) {
//                                 indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index);
//                             }
//                             const indexBgng = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex + 1].closestVertexAtBeginning.index;
//                             if(indexBgng !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexBgng) {
//                                 indicesConstraints.push(indexBgng);
//                             }
//                         }
//                     }
//                 }
//                 const nbOscillatingPolygons = oscillatingPolyWithAdj.oscillatingPolygons.length;
//                 const index = oscillatingPolyWithAdj.oscillatingPolygons[nbOscillatingPolygons - 1].closestVertexAtEnd.index;
//                 if(index !== RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== index) {
//                     indicesConstraints.push(index);
//                 }
//             }
//         }
//         return indicesConstraints;
//     }

//     checkConstraintTypeConsistency(controlPoints: number[]): void {
//         let valid = false;
//         if(controlPoints.length === this._inflectionTotalNumberOfConstraints && this.constraintType === ConstraintType.inflection) {
//             valid = true;
//         } else if(controlPoints.length === this._curvatureExtremaTotalNumberOfConstraints && this.constraintType === ConstraintType.curvatureExtrema) {
//             valid = true;
//         }
//         if(!valid) {
//             const error = new ErrorLog(this.constructor.name, "checkConstraintTypeConsistency", "The number of constraints to analyse is not consistent with the type of constraint prescribed: please check.");
//             error.logMessageToConsole();
//         }
//     }

//     g(): number[] {
//         const e = this.expensiveComputation(this.spline);
//         return this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
//     }

//     gradient_g(): DenseMatrix {
//         const e = this.expensiveComputation(this.spline);
//         return this.gradient_curvatureDerivativeNumerator(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4);

//     }

//     // compute_f(  curvatureNumerator: number[],
//     //             inflectionConstraintsSign: number[],
//     //             inflectionInactiveConstraints: number[],
//     //             curvatureDerivativeNumerator: number[],
//     //             curvatureExtremaConstraintsSign: number[],
//     //             curvatureExtremaInactiveConstraints: number[]): number[] {
//     //     let f: number[] = [];
//     //     if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//     //         const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
//     //         const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
//     //         f = r1.concat(r2);
//     //     } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//     //         f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
//     //     } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
//     //         f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
//     //     } else {
//     //         const warning = new WarningLog(this.constructor.name, "compute_f", " active control set to none: cannot proceed with constraints computation");
//     //         warning.logMessageToConsole();
//     //     }
//     //     return f;
//     // }

//     gradient_curvatureDerivativeNumerator( sxu: BernsteinDecompositionR1toR1, 
//                 syu: BernsteinDecompositionR1toR1, 
//                 sxuu: BernsteinDecompositionR1toR1, 
//                 syuu: BernsteinDecompositionR1toR1, 
//                 sxuuu: BernsteinDecompositionR1toR1, 
//                 syuuu: BernsteinDecompositionR1toR1, 
//                 h1: BernsteinDecompositionR1toR1, 
//                 h2: BernsteinDecompositionR1toR1, 
//                 h3: BernsteinDecompositionR1toR1, 
//                 h4: BernsteinDecompositionR1toR1): DenseMatrix {

//         let dgx = []
//         let dgy = []
//         const m = this.spline.controlPoints.length
//         const n = this.curvatureExtremaTotalNumberOfConstraints

//         let result = new DenseMatrix(n, 2 * m);

//         for (let i = 0; i < m; i += 1) {
//             const h5 = this.dBasisFunctions_du[i].multiply(sxu);
//             let h6 = this.dBasisFunctions_du[i].multiply(syuuu);
//             let h7 = syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1);
//             let h8 = this.dBasisFunctions_du[i].multiply(sxuu);
//             let h9 = sxu.multiply(this.d2BasisFunctions_du2[i]);
//             let h10 = this.dBasisFunctions_du[i].multiply(syuu);
//             let h11 = syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1);
//             dgx.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
//         }

//         for (let i = 0; i < m; i += 1) {
//             let h5 = this.dBasisFunctions_du[i].multiply(syu);
//             let h6 = this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1);
//             let h7 = sxu.multiply(this.d3BasisFunctions_du3[i]);
//             let h8 = this.dBasisFunctions_du[i].multiply(syuu);
//             let h9 = syu.multiply(this.d2BasisFunctions_du2[i]);
//             let h10 = this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1);
//             let h11 = sxu.multiply(this.d2BasisFunctions_du2[i]);
//             dgy.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
//         }

//         for (let i = 0; i < m; i += 1) {
//             let cpx = dgx[i].flattenControlPointsArray();
//             let cpy = dgy[i].flattenControlPointsArray();
//             for (let j = 0; j < n; j += 1) {
//                 result.set(j, i, cpx[j]);
//                 result.set(j, m + i, cpy[j]);
//             }
//         }

//         return result;
//     }

//     compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
//                                                     constraintsSign: number[], 
//                                                     inactiveConstraints: number[]): DenseMatrix {

//         const sxu = e.bdsxu
//         const sxuu = e.bdsxuu
//         const sxuuu = e.bdsxuuu
//         const syu = e.bdsyu
//         const syuu = e.bdsyuu
//         const syuuu = e.bdsyuuu
//         const h1 = e.h1
//         const h2 = e.h2
//         const h3 = e.h3
//         const h4 = e.h4

//         let dgx = [];
//         let dgy = [];
//         const controlPointsLength = this.spline.controlPoints.length;
//         const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
//         const degree = this.spline.degree;

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h1_subset = h1.subset(start, lessThan);
//             let h2_subset = h2.subset(start, lessThan);
//             let h3_subset = h3.subset(start, lessThan);
//             let h4_subset = h4.subset(start, lessThan);
//             let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
//             let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
//             let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
//             let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
//             let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
//             dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
//         }

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h1_subset = h1.subset(start, lessThan);
//             let h2_subset = h2.subset(start, lessThan);
//             let h3_subset = h3.subset(start, lessThan);
//             let h4_subset = h4.subset(start, lessThan);
//             let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
//             let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
//             let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
//             let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
//             let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
//         }

//         let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let cpx = dgx[i].flattenControlPointsArray();
//             let cpy = dgy[i].flattenControlPointsArray();

//             let start = Math.max(0, i - degree) * (4 * degree - 5)
//             let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5)

//             let deltaj = 0
//             for (let i = 0; i < inactiveConstraints.length; i += 1) {
//                 if (inactiveConstraints[i] >= start) {
//                     break
//                 }
//                 deltaj += 1
//             }

//             for (let j = start; j < lessThan; j += 1) {
//                 if (j === inactiveConstraints[deltaj]) {
//                     deltaj += 1
//                 } else {
//                     result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j])
//                     result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
//                 }
//             }
//         }

//         return result;
//     }

//     compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
//                                             constraintsSign: number[], 
//                                             inactiveConstraints: number[]): DenseMatrix {

//         const sxu = e.bdsxu
//         const sxuu = e.bdsxuu
//         const syu = e.bdsyu
//         const syuu = e.bdsyuu

//         let dgx = [];
//         let dgy = [];
//         const controlPointsLength = this.spline.controlPoints.length;
//         const degree = this.spline.degree;

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
//             dgx.push((h10.add(h11)));
//         }

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
//             let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             dgy.push(h10.add(h11));
//         }

//        const totalNumberOfConstraints = this.inflectionConstraintsSign.length

//        let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)

//        for (let i = 0; i < controlPointsLength; i += 1) {
//            let cpx = dgx[i].flattenControlPointsArray();
//            let cpy = dgy[i].flattenControlPointsArray();

//            let start = Math.max(0, i - degree) * (2 * degree - 2)
//            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2)

//            let deltaj = 0
//            for (let i = 0; i < inactiveConstraints.length; i += 1) {
//                if (inactiveConstraints[i] >= start) {
//                    break
//                }
//                deltaj += 1
//            }

//            for (let j = start; j < lessThan; j += 1) {
//                if (j === inactiveConstraints[deltaj]) {
//                    deltaj += 1
//                } else {
//                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j])
//                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j])
//                }
//            }
//        }

//        return result;
//     }

//     compute_hessian_f( sxu: BernsteinDecompositionR1toR1, 
//                         syu: BernsteinDecompositionR1toR1, 
//                         sxuu: BernsteinDecompositionR1toR1, 
//                         syuu: BernsteinDecompositionR1toR1, 
//                         sxuuu: BernsteinDecompositionR1toR1, 
//                         syuuu: BernsteinDecompositionR1toR1, 
//                         h1: BernsteinDecompositionR1toR1, 
//                         h2: BernsteinDecompositionR1toR1, 
//                         h3: BernsteinDecompositionR1toR1, 
//                         h4: BernsteinDecompositionR1toR1,
//                         constraintsSign: number[], 
//                         inactiveConstraints: number[]): SymmetricMatrix[] {


//         const n = this.spline.controlPoints.length
//         let result: SymmetricMatrix[] = []
        
//         let h5x: BernsteinDecompositionR1toR1[] = []
//         let h5y: BernsteinDecompositionR1toR1[] = []         
//         let h6x: BernsteinDecompositionR1toR1[] = []
//         let h6y: BernsteinDecompositionR1toR1[] = []
//         let h7x: BernsteinDecompositionR1toR1[] = []
//         let h7y: BernsteinDecompositionR1toR1[] = []        
//         let h8x: BernsteinDecompositionR1toR1[] = []
//         let h8y: BernsteinDecompositionR1toR1[] = []
//         let h9x: BernsteinDecompositionR1toR1[] = []
//         let h9y: BernsteinDecompositionR1toR1[] = []
//         let h10x: BernsteinDecompositionR1toR1[] = []
//         let h10y: BernsteinDecompositionR1toR1[] = []        
//         let h11x: BernsteinDecompositionR1toR1[] = []
//         let h11y: BernsteinDecompositionR1toR1[] = []

//         let hessian_gxx: number[][][] = []
//         let hessian_gyy: number[][][] = []
//         let hessian_gxy: number[][][] = []

//         for (let i = 0; i < n; i += 1) {
//             hessian_gxx.push([]);
//             hessian_gyy.push([]);
//             hessian_gxy.push([]);
//         }

//         for (let i = 0; i < n; i += 1) {
//             h5x.push(this.dBasisFunctions_du[i].multiply(sxu));
//             h6x.push(this.dBasisFunctions_du[i].multiply(syuuu));
//             h7x.push(syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1));
//             h8x.push(this.dBasisFunctions_du[i].multiply(sxuu));
//             h9x.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
//             h10x.push(this.dBasisFunctions_du[i].multiply(syuu));
//             h11x.push(syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1));
//         }
//         for (let i = 0; i < n; i += 1) {
//             h5y.push(this.dBasisFunctions_du[i].multiply(syu));
//             h6y.push(this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1));
//             h7y.push(sxu.multiply(this.d3BasisFunctions_du3[i]));
//             h8y.push(this.dBasisFunctions_du[i].multiply(syuu));
//             h9y.push(syu.multiply(this.d2BasisFunctions_du2[i]));
//             h10y.push(this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1));
//             h11y.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
//         }
        
//         for (let i = 0; i < n; i += 1){
//             for (let j = 0; j <= i; j += 1){
//                 const term1 = this.Dh5xx[i][j].multiply(h2).multiplyByScalar(2)
//                 const term2xx = ((h5x[j].multiply(h6x[i].add(h7x[i]))).add(h5x[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
//                 const term2yy = ((h5y[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6y[j].add(h7y[j]))))).multiplyByScalar(2)
//                 // term3 = 0
//                 const term4 = this.Dh8_9xx[i][j].multiply(h4).multiplyByScalar(-3)
//                 const term5xx = (((h8x[j].add(h9x[j])).multiply(h10x[i].add(h11x[i]))).add((h8x[i].add(h9x[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
//                 const term5yy = (((h8y[j].add(h9y[j])).multiply(h10y[i].add(h11y[i]))).add((h8y[i].add(h9y[i])).multiply((h10y[j].add(h11y[j]))))).multiplyByScalar(-3)
//                 // term 6 = 0
//                 hessian_gxx[i][j] = (term1.add(term2xx).add(term4).add(term5xx)).flattenControlPointsArray()
//                 hessian_gyy[i][j] = (term1.add(term2yy).add(term4).add(term5yy)).flattenControlPointsArray()
//             }
//         }
        
//         for (let i = 1; i < n; i += 1){
//             for (let j = 0; j < i; j += 1){
//                 // term1 = 0
//                 const term2xy = ((h5x[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
//                 const term3 = this.Dh6_7xy[j][i].multiply(h1).multiplyByScalar(-1) //Dh_6_7xy is antisymmetric
//                 // term4 = 0
//                 const term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
//                 const term6 = this.Dh10_11xy[j][i].multiply(h3).multiplyByScalar(3); //Dh_10_11xy is antisymmetric

//                 hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
//             }
//         }
//         for (let i = 0; i < n; i += 1){
//             for (let j = i + 1; j < n; j += 1){
//                 // term1 = 0
//                 const term2xy = ((h5x[j].multiply((h6y[i].add(h7y[i])))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2)
//                 const term3 = this.Dh6_7xy[i][j].multiply(h1) //Dh_6_7xy is antisymmetric
//                 // term4 = 0
//                 const term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3)
//                 const term6 = this.Dh10_11xy[i][j].multiply(h3).multiplyByScalar(-3); //Dh_10_11xy is antisymmetric
//                 hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
                
//             }
//         }
//         for (let i = 0; i < n; i += 1){
//             // term1 = 0
//             const term2xy = ((h5x[i].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[i].add(h7x[i]))))).multiplyByScalar(2)
//             //const term3 = this.Dh6_7xy[i][i].multiply(h1)
//             // term3 = 0
//             // term4 = 0
//             const term5xy = (((h8y[i].add(h9y[i])).multiply((h10x[i].add(h11x[i])))).add((h8x[i].add(h9x[i])).multiply(h10y[i].add(h11y[i])))).multiplyByScalar(-3)
//             // term6 = 0
//             hessian_gxy[i][i] = (term2xy.add(term5xy)).flattenControlPointsArray();
//         }
        
//         let deltak = 0
//         for (let k = 0; k < constraintsSign.length; k += 1){
//             if (k === inactiveConstraints[deltak]) {
//                 deltak += 1
//             }
//             else {
//                 let m = new SymmetricMatrix(2*n)
//                 for (let i = 0; i < n; i += 1){
//                     for (let j = 0; j <= i; j += 1){
//                         m.set(i, j, hessian_gxx[i][j][k] * constraintsSign[k])
//                         m.set(n + i, n + j, hessian_gyy[i][j][k] * constraintsSign[k])
//                     }
//                 }
//                 for (let i = 0; i < n; i += 1){
//                     for (let j = 0; j < n; j += 1){
//                         m.set(n + i, j, hessian_gxy[i][j][k] * constraintsSign[k])
//                     }
//                 }
//                 result.push(m);
//             }
//         }
//         return result;
//     }
    
//     prepareForHessianComputation(Dsu: BernsteinDecompositionR1toR1[],
//                                 Dsuu: BernsteinDecompositionR1toR1[],
//                                 Dsuuu: BernsteinDecompositionR1toR1[]): void {
//         const n = this.spline.controlPoints.length

//         for (let i = 0; i < n; i += 1){
//             this.Dh5xx.push([])
//             this.Dh6_7xy.push([])
//             this.Dh8_9xx.push([])
//             this.Dh10_11xy.push([])
//         }

//         for (let i = 0; i < n; i += 1){
//             for (let j = 0; j <= i; j += 1){
//                 this.Dh5xx[i][j] = Dsu[i].multiply(Dsu[j]);
//             }
//         }
        
//         for (let i = 0; i < n; i += 1){
//             for (let j = 0; j < n; j += 1){
//                 this.Dh6_7xy[i][j] = (Dsu[i].multiply(Dsuuu[j])).subtract(Dsu[j].multiply(Dsuuu[i]))
//             }
//         }
        
//         for (let i = 0; i < n; i += 1){
//             for (let j = 0; j <= i; j += 1){
//                 this.Dh8_9xx[i][j] = (Dsu[i].multiply(Dsuu[j])).add(Dsu[j].multiply(Dsuu[i]))
//             }
//         }
        
//         for (let i = 0; i < n; i += 1){
//             for (let j = 0; j < n; j += 1){
//                 this.Dh10_11xy[i][j] = (Dsu[i].multiply(Dsuu[j])).subtract(Dsu[j].multiply(Dsuu[i]))
//             }
//         }
//     }


//     /**
//      * The vector of constraint functions values: f(x + step)
//      */
//     // fStep(step: number[]): number[] {
//     //     let splineTemp = this.spline.clone()
//     //     splineTemp.optimizerStep(step)
//     //     let e = this.expensiveComputation(splineTemp)
//     //     const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//     //     const curvatureNumerator = this.curvatureNumerator(e.h4)
//     //     return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//     // }

//     /**
//      * The objective function value: f0(x + step)
//      */
//     // f0Step(step: number[]): number {
//     //     let splineTemp = this.spline.clone()
//     //     splineTemp.optimizerStep(step)
//     //     return this.compute_f0(this.compute_gradient_f0(splineTemp))
//     // }

//     setTargetSpline(spline: BSplineR1toR2): void {
//         this._target = spline.clone();
//         this._gradient_f0 = this.compute_gradient_f0(this.spline);
//         this._f0 = this.compute_f0(this.gradient_f0);
//     }

// }


// export class OptProblemBSplineR1toR2WithWeigthingFactors extends OptProblemBSplineR1toR2 {

//     public weigthingFactors: number[] = []

//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//     // constructor(target: BSplineR1toR2, splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);
//         for (let i = 0; i < this.spline.controlPoints.length * 2; i += 1) {
//             this.weigthingFactors.push(DEFAULT_WEIGHT);
//         }
//     }

//     get f0() {
//         let result = 0
//         const n = this._gradient_f0.length;
//         for (let i = 0; i < n; i += 1) {
//             result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i]
//         }
//         return 0.5 * result;
//     }

//     get gradient_f0() {
//         let result: number[] = []
//         const n = this._gradient_f0.length;
//         for (let i = 0; i < n; i += 1) {
//             result.push(this._gradient_f0[i] * this.weigthingFactors[i])
//         }
//         return result
//     }

//     get hessian_f0() {
//         const n = this._gradient_f0.length;
//         let result = new DiagonalMatrix(n)
//         for (let i = 0; i < n; i += 1) {
//             result.set(i, i, this.weigthingFactors[i])
//         }
//         return result
//     }


//     /**
//      * The objective function value: f0(x + step)
//      */
//     f0Step(step: number[]): number {
//         let splineTemp = this._spline.clone();
//         splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
//         const gradient = this.compute_gradient_f0(splineTemp);
//         const n = gradient.length;
//         let result = 0;
//         for (let i = 0; i < n; i += 1) {
//             result += Math.pow(gradient[i], 2) * this.weigthingFactors[i];
//         }
//         return 0.5 * result;
//     }

//     setWeightingFactor(): void {
//         this.weigthingFactors[0] = WEIGHT_AT_EXTREMITIES;
//         this.weigthingFactors[this._spline.controlPoints.length] = WEIGHT_AT_EXTREMITIES;
//         this.weigthingFactors[this._spline.controlPoints.length - 1] = WEIGHT_AT_EXTREMITIES;
//         this.weigthingFactors[this._spline.controlPoints.length * 2 - 1] = WEIGHT_AT_EXTREMITIES;
//     }

// }



// export class OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints extends OptProblemBSplineR1toR2WithWeigthingFactors {

//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//     // constructor(target: BSplineR1toR2, initial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);
//     }
    
//     // computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
//     //     return []
//     // }

//     computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
//         return []
//     }

// }

// export class OptProblemBSplineR1toR2NoInactiveConstraints extends OptProblemBSplineR1toR2 {

//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//     // constructor(target: BSplineR1toR2, initial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);
//     }

//     // computeInactiveConstraints(constraintsSign: number[], curvatureDerivativeNumerator: number[]) {
//     //     return []
//     // }

//     computeInactiveConstraints(curvatureDerivativeNumerator: number[]) {
//         return []
//     }
// }

// /* JCL 2020/10/06 derive a class to process cubics with specific desactivation constraint process at discontinuities of B(u) */
// export class OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics extends OptProblemBSplineR1toR2WithWeigthingFactors {

//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//     // constructor(target: BSplineR1toR2, initial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);
//     }

//     computeControlPointsClosestToZeroForCubics(signChangesIntervals: number[], controlPoints: number[]) {
//         let result: number[] = []
//         for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
//             if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
//                 result.push(signChangesIntervals[i] + 1)
//                 i += 1
//             }
//             else {
//                 if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
//                     result.push(signChangesIntervals[i]);
//                 } else {
//                     result.push(signChangesIntervals[i] + 1);
//                 }
//             }
//         }
//         //console.log("degree: " + this.spline.degree + " nbKnot: " + this.spline.distinctKnots().length)
//         /* JCL 2020/10/02 modification as alternative to sliding mechanism */
//         if(this.spline.degree === 3 && controlPoints.length === (this.spline.getDistinctKnots().length - 1)*7){
//             let n = Math.trunc(controlPoints.length/7);
//             console.log("degree: " + this.spline.degree + " nbCP: " + controlPoints.length)
//             for(let j = 1; j < n ; j += 1) {
//                 if(controlPoints[6*j]*controlPoints[6*j + 1] < 0) {
//                     //console.log("CP: " + controlPoints)
//                     if(result.indexOf(6*j) > 0 && result.indexOf(6*j + 1) < 0) {
//                         result.push(6*j + 1);
//                     } else if(result.indexOf(6*j) < 0 && result.indexOf(6*j + 1) > 0) {
//                         result.push(6*j);
//                     }
//                 }
//             }
//             result.sort(function(a, b) { return (a - b) });
//         }
        
//         return result
//     }

//     // computeInactiveConstraints(constraintsSign: number[], controlPoints: number[]) {
//     //     let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
//     //     let controlPointsClosestToZero = this.computeControlPointsClosestToZeroForCubics(signChangesIntervals, controlPoints)
//     //     let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
//     //     return result
//     // }

//     computeInactiveConstraints(controlPoints: number[]) {
//         let constraintsSign = this.computeConstraintsSign(controlPoints);
//         let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
//         let controlPointsClosestToZero = this.computeControlPointsClosestToZeroForCubics(signChangesIntervals, controlPoints)
//         let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
//         return result
//     }
// }

// /* JCL 2020/11/27 derive a class to extend the shape navigation process in accordance with the feedback of the analyzer */
// interface ExtremumLocation {index: number, value: number}

// export class OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation extends OptProblemBSplineR1toR2WithWeigthingFactors {

//     // public shapeSpaceBoundaryConstraintsCurvExtrema: number[]
//     // public shapeSpaceBoundaryConstraintsInflections: number[]
//     // public neighboringEvent: NeighboringEvents = {event: NeighboringEventsType.none, index: -1}
//     // public neighboringEvent: NeighboringEvents
//     private revertCurvatureExtremaConstraints: number[]
//     private curvatureExtremaConstraintBounds: number[]
//     private revertInflectionsConstraints: number[]
//     private inflectionsConstraintsBounds: number[]
//     private controlPointsFunctionBInit: number[]
//     public updateConstraintBound: boolean
//     private curveAnalyzerCurrentCurve: CurveAnalyzerInterface;
//     private curveAnalyzerOptimizedCurve: CurveAnalyzerInterface;
//     protected _diffEventsVariation: DiffrentialEventVariation;
//     private _iteratedCurves: Array<BSplineR1toR2>;
//     // private boundaryEnforcer: AbstractBoundaryEnforcer;

//     public previousSequenceCurvatureExtrema: number[]
//     // public currentSequenceCurvatureExtrema: number[]

//     // public curvatureNumeratorCP: number[]
//     public previousCurvatureExtremaControlPoints: number[]
//     private eventMoveAtIterationStart: eventMove[]
//     private eventEnterKnotNeighborhood: boolean[]
//     private eventInsideKnotNeighborhood: boolean[]

//     // constructor(target: BSplineR1toR2, initial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure,
//         // neighboringEvent?: NeighboringEvents, shapeSpaceBoundaryConstraintsCurvExtrema?: number[]) {
//     constructor(splineInitial: BSplineR1toR2, shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure,
//         navigationCurveModel: OpenCurveShapeSpaceNavigator, shapeSpaceBoundaryConstraintsCurvExtrema?: number[]) {
//         super(splineInitial, shapeSpaceDiffEventsStructure);

//         this.curveAnalyzerCurrentCurve = navigationCurveModel.curveAnalyserCurrentCurve;
//         this.curveAnalyzerOptimizedCurve = navigationCurveModel.curveAnalyserOptimizedCurve;
//         this._diffEventsVariation = new DiffrentialEventVariation(this.curveAnalyzerCurrentCurve, this.curveAnalyzerOptimizedCurve);
//         // this.boundaryEnforcer = navigationCurveModel.navigationState.boundaryEnforcer;
//         // JCL 15/07/2023 pour cimpatibilite avec nouvelles classe ShapeSpaceBoundaryEnforcer
//         // this.boundaryEnforcer = new BoundaryEnforcerStrictShapeSpacesOpenCurve()
//         this._iteratedCurves = [];

//         // if(shapeSpaceBoundaryConstraintsCurvExtrema !== undefined) {
//         //     this.shapeSpaceBoundaryConstraintsCurvExtrema = shapeSpaceBoundaryConstraintsCurvExtrema
//         // } else this.shapeSpaceBoundaryConstraintsCurvExtrema = [];
//         // this.shapeSpaceBoundaryConstraintsInflections = [];
//         this.previousSequenceCurvatureExtrema = [];
//         // this.currentSequenceCurvatureExtrema = [];
//         this.previousCurvatureExtremaControlPoints = [];
//         this.updateConstraintBound = true;
//         this.revertCurvatureExtremaConstraints = [];
//         this.revertInflectionsConstraints = [];

//         this.eventEnterKnotNeighborhood = [];
//         this.eventMoveAtIterationStart = [];
//         this.eventInsideKnotNeighborhood = [];

//         // if(neighboringEvent !== undefined) {
//         //     this.neighboringEvent = neighboringEvent
//         // } else {
//         //     this.neighboringEvent.event = NeighboringEventsType.none;
//         //     this.neighboringEvent.index = -1
//         //     this.neighboringEvent.value = 0.0
//         //     this.neighboringEvent.valueOptim = 0.0
//         //     this.neighboringEvent.locExt = 0.0
//         //     this.neighboringEvent.locExtOptim = 0.0
//         //     this.neighboringEvent.variation = []
//         //     this.neighboringEvent.span = -1
//         //     this.neighboringEvent.range = 0
//         //     this.neighboringEvent.knotIndex = 0
//         // }
        
//         if(this._spline.degree === 3) {
//             this.processCubics();
//         }
//         let e: ExpensiveComputationResults = this.initExpansiveComputations();
//         this._curvatureNumeratorCP = [];
//         this._curvatureDerivativeNumeratorCP = [];
//         this.constraintType = ConstraintType.none;
//         this._inflectionTotalNumberOfConstraints = 0;
//         this.inflectionNumberOfActiveConstraints = 0;
//         this._curvatureExtremaTotalNumberOfConstraints = 0;
//         this.curvatureExtremaNumberOfActiveConstraints = 0;
//         this._spline = splineInitial.clone();
//         this._target = splineInitial.clone();
//         this.computeBasisFunctionsDerivatives();
//         this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
//         this._gradient_f0 = this.compute_gradient_f0(this._spline);
//         this._f0 = this.compute_f0(this._gradient_f0);
//         this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             e = this.expensiveComputation(this.spline)  
//             this._curvatureNumeratorCP = this.curvatureNumerator(e.h4)
//             this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
//             this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP)
//             // this._inflectionInactiveConstraints = this.computeInactiveConstraintsGN(curvatureNumerator);
//             this.constraintType = ConstraintType.inflection;
//             this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
//             this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length
//         }
//         for(let i = 0; i < this._curvatureNumeratorCP.length; i += 1) {
//             this.revertInflectionsConstraints.push(1);
//         }
//         this.inflectionsConstraintsBounds = zeroVector(this._curvatureNumeratorCP.length);

//         if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//             this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
//             this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP)
//             // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(g);
//             this.constraintType = ConstraintType.curvatureExtrema;
//             this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
//             this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length
//         }

//         this.controlPointsFunctionBInit =  this._curvatureDerivativeNumeratorCP
//         // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("B(u) control points at init:" + this.currentCurvatureExtremaControPoints)
//         this.curvatureExtremaConstraintBounds = zeroVector(this._curvatureDerivativeNumeratorCP.length);
//         for(let i = 0; i < this._curvatureDerivativeNumeratorCP.length; i += 1) {
//             this.revertCurvatureExtremaConstraints.push(1);
//         }

//         this.clearInequalityChanges();
//         this.clearConstraintBoundsUpdate();
//         this.revertInequalitiesWithinRangeOfLocalExtremum();
//         this.updateConstraintBoundsWithinRangeOfLocalExtremum();
//         console.log("optim inactive curv ext constraints: " + this.curvatureExtremaInactiveConstraints);
//         console.log("optim inactive inflection constraints: " + this.inflectionInactiveConstraints);

//         this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
//         this.checkConstraintConsistency();
//         // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("constraints at init:" + this._f)
//         // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("curvature constraints at init:" + this.curvatureExtremaInactiveConstraints)
//         // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("inflexion constraints at init:" + this.inflectionInactiveConstraints)

//         this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        
//         // if (this.isComputingHessian) {
//         //     this.prepareForHessianComputation(this.dBasisFunctions_du, this.d2BasisFunctions_du2, this.d3BasisFunctions_du3)
//         //     this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//         // }
//     }

//     get diffEventsVariation(): DiffrentialEventVariation {
//         return this._diffEventsVariation;
//     }

//     get iteratedCurves(): Array<BSplineR1toR2> {
//         return this._iteratedCurves;
//     }

//     set diffEventsVariation(diffEventsVariation: DiffrentialEventVariation) {
//         this._diffEventsVariation = diffEventsVariation;
//     }

//     clearIteratedCurves(): void {
//         this._iteratedCurves = [];
//     }

//     processCubics(): void {
//         /* JCL Specific treatment for event sliding with cubics */
//         let intermediateKnots: Array<intermediateKnotWithNeighborhood> = []
//         if(this.spline.degree === 3 && this.spline.knots.length > 8) {
//             /* JCL 04/01/2021 Look for the location of intermediate knots of multiplicity one wrt curvature extrema */
//             /*let knots = this.spline.knots
//             this.updateConstraintBound = true
//             for(let i = 4; i < (knots.length - 4); i += 1) {
//                 if(this.spline.knotMultiplicity(knots[i]) === 1) {
//                     intermediateKnots.push({knot: knots[i], left: knots[i - 1], right: knots[i + 1], index: i})
//                     this.eventInsideKnotNeighborhood.push(false)
//                     this.eventMoveAtIterationStart.push(eventMove.still)
//                     this.eventEnterKnotNeighborhood.push(false)
//                 }
//             }
//             const splineDPoptim = new BSpline_R1_to_R2_DifferentialProperties(this.spline)
//             const functionBOptim = splineDPoptim.curvatureDerivativeNumerator()
//             const curvatureExtremaLocationsOptim = functionBOptim.zeros()
//             for(let i = 0; i < intermediateKnots.length; i += 1) {
//                 for(let j = 0; j < curvatureExtremaLocationsOptim.length; j += 1) {
//                     if(curvatureExtremaLocationsOptim[j] > (intermediateKnots[i].knot - DEVIATION_FROM_KNOT*(intermediateKnots[i].knot - intermediateKnots[i].left)) &&
//                     curvatureExtremaLocationsOptim[j] < (intermediateKnots[i].knot + DEVIATION_FROM_KNOT*(intermediateKnots[i].right - intermediateKnots[i].knot))) {
//                         if(!this.eventInsideKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = true
//                     }
//                 }
//             }*/
//         }
//     }

//     checkConstraintConsistency(): void {
//         /* JCL 08/03/2021 Add test to check the consistency of the constraints values.
//             As the reference optimization problem is set up, each active constraint is an inequality strictly negative.
//             Consequently, each active constraint value must be negative. */
//         enum constraintType {curvatureExtremum, inflexion, none};
//         let invalidConstraints: {value: number, type: constraintType, index: number}[] = [];
//         for(let i = 0; i < this._f.length; i += 1) {
//             if(this._f[i] > 0.0) {
//                 let typeC: constraintType;
//                 let indexC: number;
//                 if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//                     typeC = constraintType.curvatureExtremum;
//                     indexC = i;
//                     if(i < this.curvatureExtremaNumberOfActiveConstraints) {
//                         for(let constraintIndex of this.curvatureExtremaInactiveConstraints) {
//                             if(i > constraintIndex) indexC = indexC + 1;
//                         }
//                     } else {
//                         indexC = i - this.curvatureExtremaNumberOfActiveConstraints;
//                         typeC = constraintType.inflexion;
//                         for(let constraintIndex of this.inflectionInactiveConstraints) {
//                             if(i > constraintIndex) indexC = indexC + 1;
//                         }
//                     }
//                 } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//                     typeC = constraintType.curvatureExtremum;
//                     indexC = i;
//                     for(let constraintIndex of this.curvatureExtremaInactiveConstraints) {
//                         if(i > constraintIndex) indexC = indexC + 1;
//                     }
//                 } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
//                     typeC = constraintType.inflexion;
//                     indexC = i;
//                     for(let constraintIndex of this.inflectionInactiveConstraints) {
//                         if(i > constraintIndex) indexC = indexC + 1;
//                     }
//                 } else {
//                     typeC = constraintType.none;
//                     indexC = RETURN_ERROR_CODE;
//                     const warning = new WarningLog(this.constructor.name, "checkConstraintConsistency", "No active control set. There should be no constraint.");
//                     warning.logMessageToConsole();
//                 }
//                 invalidConstraints.push({value: this._f[i], type: typeC, index: indexC});
//             }
//         }
//         if(invalidConstraints.length > 0) {
//             const message = "Inconsistent constraints. Constraints value must be negative. " + JSON.stringify(invalidConstraints);
//             const error = new ErrorLog(this.constructor.name, "checkConstraintConsistency", message);
//             error.logMessageToConsole();
//         }
//     }

//     // computeGlobalExtremmumOffAxis(controlPoints: number[]): number {
//     //     let localExtremum = -1
//     //     let localMinimum: Array<ExtremumLocation> = []
//     //     let localMaximum: Array<ExtremumLocation> = []
//     //     let globalMinimum:ExtremumLocation = {index: 0, value: 0.0}
//     //     let globalMaximum:ExtremumLocation = {index: 0, value: 0.0}
//     //     for(let i = 0; i < controlPoints.length - 2; i += 1) {
//     //         if(sign(controlPoints[i]) === 1 && sign(controlPoints[i + 1]) === 1 && sign(controlPoints[i + 2]) === 1) {
//     //             if(controlPoints[i] > controlPoints[i + 1] && controlPoints[i + 1] < controlPoints[i + 2]) {
//     //                 localMinimum.push({index: (i + 1), value: controlPoints[i + 1]})
//     //             }
//     //         } else if(sign(controlPoints[i]) === -1 && sign(controlPoints[i + 1]) === -1 && sign(controlPoints[i + 2]) === -1) {
//     //             if(controlPoints[i] < controlPoints[i + 1] && controlPoints[i + 1] > controlPoints[i + 2]) {
//     //                 localMaximum.push({index: (i + 1), value: controlPoints[i + 1]})
//     //             }
//     //         }
//     //     }
//     //     if(localMinimum.length > 0) {
//     //         localMinimum.sort(function(a, b) {
//     //             if (a.value > b.value) {
//     //               return 1;
//     //             }
//     //             if (a.value < b.value) {
//     //               return -1;
//     //             }
//     //             return 0;
//     //         })
//     //         globalMinimum = {index: localMinimum[0].index, value: localMinimum[0].value}
//     //     }
//     //     if(localMaximum.length > 0) {
//     //         localMaximum.sort(function(a, b) {
//     //             if (a.value > b.value) {
//     //               return 1;
//     //             }
//     //             if (a.value < b.value) {
//     //               return -1;
//     //             }
//     //             return 0;
//     //         })
//     //         globalMaximum = {index: localMaximum[localMaximum.length - 1].index, value: localMaximum[localMaximum.length - 1].value}
//     //     }
//     //     if(localMinimum.length > 0 && localMaximum.length > 0 && Math.abs(globalMinimum.value) > Math.abs(globalMaximum.value)) {
//     //         return localExtremum = globalMaximum.index
//     //     } else if(localMinimum.length > 0 && localMaximum.length > 0) {
//     //         return localExtremum = globalMinimum.index
//     //     } else if(localMinimum.length > 0) {
//     //         return localExtremum = globalMinimum.index
//     //     } else if(localMaximum.length > 0) {
//     //         return localExtremum = globalMaximum.index
//     //     } else return localExtremum
//     // }

//     // computeControlPointsClosestToZero(): number[] {
//     //     let result: number[] = []
//     //     return result;
//     // }

//     computeControlPointsClosestToZeroGeneralNavigation(signChangesIntervals: number[], controlPoints: number[]) {
//         let result: number[] = []
//         /*let extremaAroundAxis: number[] = []
//         for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
//             if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
//                 extremaAroundAxis.push(signChangesIntervals[i] + 1)
//                 i += 1
//             }
//         }*/
//         // for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
//         //     if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
//         //         if(controlPoints.length === this.curvatureExtremaTotalNumberOfConstraints) {
//         //             if(this.shapeSpaceBoundaryConstraintsCurvExtrema !== undefined){
//         //                 /* JCL Conditions to prevent events to slip out of the curve through its left extremity */
//         //                 if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
//         //                     if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
//         //                         result.push(signChangesIntervals[i]);
//         //                     } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
//         //                         result.push(signChangesIntervals[i]);
//         //                         this.shapeSpaceBoundaryConstraintsCurvExtrema.splice(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1), 1);
//         //                     } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
//         //                 } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
    
//         //             } else {
//         //                 /* JCL general setting where events can slip out of the curve */
//         //                 if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
//         //             }
//         //         } else if(controlPoints.length === this.inflectionTotalNumberOfConstraints) {
//         //             if(this.shapeSpaceBoundaryConstraintsInflections !== undefined){
//         //                 if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
//         //                     if(this.shapeSpaceBoundaryConstraintsInflections.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
//         //                         result.push(signChangesIntervals[i])
//         //                     } else if(this.shapeSpaceBoundaryConstraintsInflections.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
//         //                         result.push(signChangesIntervals[i]);
//         //                         this.shapeSpaceBoundaryConstraintsInflections.splice(this.shapeSpaceBoundaryConstraintsInflections.indexOf(controlPoints.length - 1), 1);
//         //                     } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
//         //                 } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);

//         //             } else {
//         //                 if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
//         //             }
//         //         }
//         //     } else {
//         //         if(controlPoints.length === this.curvatureExtremaTotalNumberOfConstraints) {
//         //             if(this.shapeSpaceBoundaryConstraintsCurvExtrema !== undefined) {
//         //                 /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
//         //                 if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
//         //                     if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
//         //                         result.push(signChangesIntervals[i] + 1);
//         //                     } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
//         //                         result.push(signChangesIntervals[i] + 1);
//         //                         this.shapeSpaceBoundaryConstraintsCurvExtrema.splice(this.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(0), 1)
//         //                     } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
//         //                 } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);

//         //             } else {
//         //                 /* JCL general setting where events can slip out of the curve */
//         //                 if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
//         //             }
//         //         } else if(controlPoints.length === this.inflectionTotalNumberOfConstraints) {
//         //             if(this.shapeSpaceBoundaryConstraintsInflections !== undefined) {
//         //                 /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
//         //                 if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
//         //                     if(this.shapeSpaceBoundaryConstraintsInflections.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
//         //                         result.push(signChangesIntervals[i] + 1);
//         //                     } else if(this.shapeSpaceBoundaryConstraintsInflections.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
//         //                         result.push(signChangesIntervals[i] + 1);
//         //                         this.shapeSpaceBoundaryConstraintsInflections.splice(this.shapeSpaceBoundaryConstraintsInflections.indexOf(0), 1)
//         //                     } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
//         //                 } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);

//         //             } else {
//         //                 /* JCL general setting where events can slip out of the curve */
//         //                 if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
//         //             }
//         //         }
//         //     }
//         // }
//         return result
//     }

//     computeControlPointsClosestToZeroForCubics(signChangesIntervals: number[], controlPoints: number[]) {
//         let result: number[] = []
//         for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
//             if (i < n - 1  && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
//                 result.push(signChangesIntervals[i] + 1)
//                 i += 1
//             }
//             else {
//                 if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
//                     result.push(signChangesIntervals[i]);
//                 } else {
//                     result.push(signChangesIntervals[i] + 1);
//                 }
//             }
//         }
//         //console.log("degree: " + this.spline.degree + " nbKnot: " + this.spline.distinctKnots().length)
//         /* JCL 2020/10/02 modification as alternative to sliding mechanism */
//         if(this.spline.degree === 3 && controlPoints.length === (this.spline.getDistinctKnots().length - 1)*7){
//             let n = Math.trunc(controlPoints.length/7);
//             console.log("degree: " + this.spline.degree + " nbCP: " + controlPoints.length)
//             for(let j = 1; j < n ; j += 1) {
//                 if(controlPoints[6*j]*controlPoints[6*j + 1] < 0) {
//                     //console.log("CP: " + controlPoints)
//                     if(result.indexOf(6*j) > 0 && result.indexOf(6*j + 1) < 0) {
//                         result.push(6*j + 1);
//                     } else if(result.indexOf(6*j) < 0 && result.indexOf(6*j + 1) > 0) {
//                         result.push(6*j);
//                     }
//                 }
//             }
//             result.sort(function(a, b) { return (a - b) });
//         }
        
//         return result
//     }

//     inactivateConstraintClosestToZero(controlPoints: number[], inactiveConstraints: number[]): void {
//         const polygonOfCtrlPts = new PolygonWithVerticesR1(controlPoints);
//         const globalExtremumOffAxis = polygonOfCtrlPts.extractClosestLocalExtremmumToAxis().index;
//         if(globalExtremumOffAxis !== RETURN_ERROR_CODE) {
//             inactiveConstraints.push(globalExtremumOffAxis);
//             inactiveConstraints.sort(function(a, b) { return (a - b) });
//         }
//     }

//     inactivateConstraintsAtCurveEXtremities(controlPoints: number[], inactiveConstraints: number[]): void {
//         // if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) === -1)
//         if(inactiveConstraints.indexOf(0) === -1)
//             inactiveConstraints.splice(0, 0, 0);
//         // if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(controlPoints.length - 1) === -1)
//         if(inactiveConstraints.indexOf(controlPoints.length - 1) === -1)
//             inactiveConstraints.push(controlPoints.length - 1);
//     }

//     inactivateConstraintsWithinRangeOfLocalExtremum(inactiveConstraints: number[]): void {
//         if(this._diffEventsVariation === undefined || this._diffEventsVariation.neighboringEvents.length === 0) {
//             return;
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//             // && this.constraintType === ConstraintType.curvatureExtrema && this.updateConstraintBound) {
//             && this.constraintType === ConstraintType.curvatureExtrema) {

//             const upperBound = this._diffEventsVariation.span;
//             const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
//             for(let j = lowerBound; j < upperBound + 1; j += 1) {
//                 if(inactiveConstraints.indexOf(j) !== -1) inactiveConstraints.splice(inactiveConstraints.indexOf(j), 1)
//             }
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
//             && this.constraintType === ConstraintType.curvatureExtrema) {

//             // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start || this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start) {
//                 //     if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
//                 //         inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
//                 // } else if(this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 //     if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1) !== -1)
//                 //         inactiveConstraints.splice(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1), 1);
//                 // }
//                 /* JCL 08/03/2021 Add constraint modifications to curvature extrema appearing based on a non null optimum value of B(u) */
//                 if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
//                     /* to be added: the interval span to be processed */
//                     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
//                         if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(i) !== -1)
//                             inactiveConstraints.splice(inactiveConstraints.indexOf(i), 1);
//                     }
//                 }
//             // } else console.log("Null content of shapeSpaceBoundaryConstraintsCurvExtrema.")
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
//             && this.constraintType === ConstraintType.inflection) {
            
//             // if(this.boundaryEnforcer.inflectionEventAtExtremity.start || this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//             //    if(this.boundaryEnforcer.inflectionEventAtExtremity.start) {
//             //         if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
//             //             inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
//             //     } else if(this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//             //         if(inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1) !== -1)
//             //             inactiveConstraints.splice(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1), 1);
//             //     }
//             //     /* JCL something to do with this._diffEventsVariation for A(u) extrema ? */
//             // }
//         }
//     }

//     clearInequalityChanges(): void {
//         if(this.constraintType === ConstraintType.curvatureExtrema) {
//             for(let controlPoint of this._curvatureDerivativeNumeratorCP) {
//                 this.revertCurvatureExtremaConstraints[controlPoint] = 1;
//             }
//         } else if(this.constraintType === ConstraintType.inflection) {
//             for(let controlPoint of this._curvatureNumeratorCP) {
//                 this.revertCurvatureExtremaConstraints[controlPoint] = 1;
//             }
//         } else {
//             const error = new ErrorLog(this.constructor.name, "clearInequalityChanges", "Current constraint type is not compatible with the inequalities changes.");
//             error.logMessageToConsole();
//         }
//     }

//     clearConstraintBoundsUpdate(): void {
//         if(this.constraintType === ConstraintType.curvatureExtrema) {
//             for(let controlPoint of this._curvatureDerivativeNumeratorCP) {
//                 this.curvatureExtremaConstraintBounds[controlPoint] = 0;
//             }
//         } else if(this.constraintType === ConstraintType.inflection) {
//             for(let controlPoint of this._curvatureNumeratorCP) {
//                 this.curvatureExtremaConstraintBounds[controlPoint] = 0;
//             }
//         } else {
//             const error = new ErrorLog(this.constructor.name, "clearConstraintBoundsUpdate", "Current constraint type is not compatible with the constraint bounds update.");
//             error.logMessageToConsole();
//         }
//     }

//     revertInequalitiesWithinRangeOfLocalExtremum(): void {
//         if(this._diffEventsVariation.neighboringEvents.length === 0) {
//             return;
//         // } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
//         //     || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//         //     && this.constraintType === ConstraintType.curvatureExtrema && (this.updateConstraintBound || this.boundaryEnforcer.hasNewEvent())) {
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//             && this.constraintType === ConstraintType.curvatureExtrema && (this.updateConstraintBound)) {

//             const upperBound = this._diffEventsVariation.span;
//             const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
//             for(let i = lowerBound + 1; i < upperBound; i+= 1) {
//                 if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
//                     if(this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
//                         && this._diffEventsVariation.extremumValueOpt < 0)
//                         this.revertCurvatureExtremaConstraints[i] = -1;
//                     if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
//                         && this._diffEventsVariation.extremumValueOpt > 0)
//                         this.revertCurvatureExtremaConstraints[i] = -1;
//                 } else if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//                     if(this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
//                         && this._diffEventsVariation.extremumValueOpt < 0)
//                         this.revertCurvatureExtremaConstraints[i] = -1;
//                     if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
//                         && this._diffEventsVariation.extremumValueOpt > 0) {
//                         if(this._diffEventsVariation.CPvariations[i] > 0) {
//                             this.revertCurvatureExtremaConstraints[i] = 1;
//                         } else {
//                             this.revertCurvatureExtremaConstraints[i] = -1;
//                         }
//                     }
//                 }
//             }
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
//             && this.constraintType === ConstraintType.curvatureExtrema) {

//             // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start || this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start) {
//                 //     this.revertCurvatureExtremaConstraints[0] = 1;
//                 // }
//                 // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 //     this.revertCurvatureExtremaConstraints[this._curvatureExtremaTotalNumberOfConstraints - 1] = 1;
//                 // }
//                 if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
//                     /* to be added: the interval span to be processed */
//                     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
//                         this.revertCurvatureExtremaConstraints[i] = 1;
//                         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
//                             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
//                                 this.revertCurvatureExtremaConstraints[i] = -1;
//                             } else {
//                                 this.revertCurvatureExtremaConstraints[i] = -1;
//                             }
//                         }
//                     }
//                 }
//             // } 
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
//             && this.constraintType === ConstraintType.inflection) {

//             // if(this.boundaryEnforcer.inflectionEventAtExtremity.start || this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//             //    if(this.boundaryEnforcer.inflectionEventAtExtremity.start) {
//             //         this.revertInflectionsConstraints[0] = 1;
//             //     }
//             //     if(this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//             //         this.revertInflectionsConstraints[this._inflectionTotalNumberOfConstraints - 1] = 1;
//             //     }
//                 // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
//                 //     /* to be added: the interval span to be processed */
//                 //     for(let i = 1; i < this._inflectionTotalNumberOfConstraints - 1; i+= 1){
//                 //         this.revertInflectionsConstraints[i] = 1;
//                 //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
//                 //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
//                 //                 this.revertInflectionsConstraints[i] = -1;
//                 //             } else {
//                 //                 this.revertInflectionsConstraints[i] = -1;
//                 //             }
//                 //         }
//                 //     }
//                 // }
//             // }
//         }
//     }

//     updateConstraintBoundsWithinRangeOfLocalExtremum(): void {
//         if(this._diffEventsVariation.neighboringEvents.length === 0) {
//             return;
//         // } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
//         //     || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//         //     && this.constraintType === ConstraintType.curvatureExtrema && (this.updateConstraintBound || this.boundaryEnforcer.hasNewEvent())) {
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear 
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//             && this.constraintType === ConstraintType.curvatureExtrema && this.updateConstraintBound) {

//             const upperBound = this._diffEventsVariation.span;
//             const lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
//             for(let i = lowerBound + 1; i < upperBound; i+= 1) {
//                 if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//                     if(this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
//                         && this._diffEventsVariation.extremumValueOpt > 0) {
//                         if(this._diffEventsVariation.CPvariations[i] > 0) {
//                             this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + (this._diffEventsVariation.CPvariations[i] * this._diffEventsVariation.extremumValue) / (this._diffEventsVariation.extremumValueOpt - this._diffEventsVariation.extremumValue);
//                         } else {
//                             this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
//                         }
//                     }
//                 }
//             }
//             // if(this.boundaryEnforcer.hasNewEvent()) {
//                 this.curvatureExtremaConstraintBounds[0] = 0
//                 for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints; i+= 1) {
//                     if(this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] > 0) {
//                         this.curvatureExtremaConstraintBounds[i] = this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] - CONSTRAINT_BOUND_THRESHOLD;
//                     } else {
//                         this.curvatureExtremaConstraintBounds[i] = 0
//                     }
//                 }
//             // }
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
//             && this.constraintType === ConstraintType.curvatureExtrema) {

//             // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start || this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.start) {
//                 //     // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
//                 //     this.curvatureExtremaConstraintBounds[0] = 0;
//                 // }
//                 // if(this.boundaryEnforcer.curvExtremumEventAtExtremity.end) {
//                 //     this.curvatureExtremaConstraintBounds[this._curvatureExtremaTotalNumberOfConstraints - 1] = 0;
//                 // }
//                 if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
//                     /* to be added: the interval span to be processed */
//                     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
//                         this.curvatureExtremaConstraintBounds[i] = 0;
//                         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
//                             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
//                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
//                             } else {
//                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
//                             }
//                         } else if(this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
//                             if(this._diffEventsVariation.CPvariations[i] < 0.0) {
//                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
//                             } else {
//                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
//                             }
//                         }
//                     }
//                 }
//             // }
//         } else if((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
//             || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
//             && this.constraintType === ConstraintType.inflection) {

//             // if(this.boundaryEnforcer.inflectionEventAtExtremity.start || this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//                 // if(this.boundaryEnforcer.inflectionEventAtExtremity.start) {
//                 //     // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
//                 //     this.inflectionsConstraintsBounds[0] = 0;
//                 // }
//                 // if(this.boundaryEnforcer.inflectionEventAtExtremity.end) {
//                 //     this.inflectionsConstraintsBounds[this._inflectionTotalNumberOfConstraints - 1] = 0;
//                 // }
//                 // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
//                 //     /* to be added: the interval span to be processed */
//                 //     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
//                 //         this.curvatureExtremaConstraintBounds[i] = 0;
//                 //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
//                 //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
//                 //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
//                 //             } else {
//                 //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
//                 //             }
//                 //         } else if(this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
//                 //             if(this._diffEventsVariation.CPvariations[i] < 0.0) {
//                 //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
//                 //             } else {
//                 //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
//                 //             }
//                 //         }
//                 //     }
//                 // }
//             // }
//         }
//     }

//     computeInactiveConstraints(controlPoints: number[]): number[] {
//         this.checkConstraintTypeConsistency(controlPoints);
//         let inactiveConstraints = this.extractVerticesLocallyClosestToZero(controlPoints);
//         this.inactivateConstraintClosestToZero(controlPoints, inactiveConstraints);
//         this.inactivateConstraintsAtCurveEXtremities(controlPoints, inactiveConstraints);
//         this.inactivateConstraintsWithinRangeOfLocalExtremum(inactiveConstraints);

//         // this.clearInequalityChanges();
//         // this.clearConstraintBoundsUpdate();
//         // this.revertInequalitiesWithinRangeOfLocalExtremum();
//         // this.updateConstraintBoundsWithinRangeOfLocalExtremum();
//         return inactiveConstraints;
//     }

//     // computeInactiveConstraintsGN(controlPoints: number[]) {
//     //     let constraintsSign = this.computeConstraintsSign(controlPoints);
//     //     let signChangesIntervals = this.computeSignChangeIntervals(constraintsSign)
//     //     let controlPointsClosestToZero = this.computeControlPointsClosestToZeroGeneralNavigation(signChangesIntervals, controlPoints)
//     //     let polygonOfCtrlPts = new PolygonWithVerticesR1(controlPoints);
//     //     let globalExtremumOffAxis = polygonOfCtrlPts.extractClosestLocalExtremmumToAxis().index;
//     //     // let globalExtremumOffAxis = this.computeGlobalExtremmumOffAxis(controlPoints)
//     //     if(globalExtremumOffAxis !== -1) {
//     //         controlPointsClosestToZero.push(globalExtremumOffAxis)
//     //         controlPointsClosestToZero.sort(function(a, b) { return (a - b) })
//     //     }
//     //     //console.log("inactiveConstraints before inflection: " + controlPointsClosestToZero + " globalExt " + globalExtremumOffAxis)
//     //     let result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints)
//     //     if(controlPointsClosestToZero.length !== result.length) console.log("computeInactiveConstraints: probable inconsistency in the matrix setting due to the order of inactive constraints")
//     //     /* JCL Probably no change takes place though addInactiveConstraintsForInflections because new indices would be appended to controlPointsClosestToZero in result
//     //         result would not be ordered, which would cause problem when loading the matrix of the inequalities */
        
//     //     /* JCL Inactivate the extremum curvature constraints at the curve extremity to let the analyzer detect the entry or exit of 
//     //         an extremum and the navigator take the decision to let it in or out */
//     //     if( this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
//     //         if(result.length > 0 && result.indexOf(0) === -1) result.splice(0, 0, 0)
//     //         if(result.length > 0 && result.indexOf(controlPoints.length - 1) === -1) result.push(controlPoints.length - 1)
//     //     }

//     //     if(this.spline.degree === 3) {
//     //         /* JCL Specific treatment for event sliding with cubics */
//     //         let intermediateKnots: Array<intermediateKnotWithNeighborhood> = []
//     //         let extremaNearKnot: Array<extremaNearKnot> = []
//     //         let eventMoveNearKnot: eventMove = eventMove.still
//     //         if(this.spline.degree === 3 && this.spline.knots.length > 8 && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
//     //             /* JCL 04/01/2021 Look for the location of intermediate knots of multiplicity one wrt curvature extrema */
//     //             let knots = this.spline.knots
//     //             for(let i = 4; i < (knots.length - 4); i += 1) {
//     //                 if(this.spline.knotMultiplicity(knots[i]) === 1) intermediateKnots.push({knot: knots[i], left: knots[i - 1], right: knots[i + 1], index: i})
//     //                 else console.log("Knot multiplicity greater than one at intermediate knots is not processed yet.")
//     //             }
//     //             /* JCL Initialization of variables monitoring constraint analysis at each intermediate knot */
//     //             if(this.eventInsideKnotNeighborhood.length <  intermediateKnots.length) {
//     //                 this.updateConstraintBound = true
//     //                 for(let i = 0; i < intermediateKnots.length; i += 1) {
//     //                     this.eventInsideKnotNeighborhood.push(false)
//     //                     this.eventMoveAtIterationStart.push(eventMove.still)
//     //                     this.eventEnterKnotNeighborhood.push(false)
//     //                 }
//     //                 for(let i = 0; i < controlPoints.length; i+= 1){
//     //                     this.revertCurvatureExtremaConstraints[i] = 1
//     //                     this.curvatureExtremaConstraintBounds[i] = 0
//     //                 }
//     //             }

//     //             const splineDPoptim = new BSplineR1toR2DifferentialProperties(this.spline)
//     //             const functionBOptim = splineDPoptim.curvatureDerivativeNumerator()
//     //             const curvatureExtremaLocationsOptim = functionBOptim.zeros()
//     //             for(let i = 0; i < intermediateKnots.length; i += 1) {
//     //                 let eventCounter = 0
//     //                 for(let j = 0; j < curvatureExtremaLocationsOptim.length; j += 1) {
//     //                     if(curvatureExtremaLocationsOptim[j] > (intermediateKnots[i].knot - DEVIATION_FROM_KNOT*(intermediateKnots[i].knot - intermediateKnots[i].left)) &&
//     //                     curvatureExtremaLocationsOptim[j] < (intermediateKnots[i].knot + DEVIATION_FROM_KNOT*(intermediateKnots[i].right - intermediateKnots[i].knot))) {
//     //                         if(extremaNearKnot.length > 0 && extremaNearKnot[extremaNearKnot.length - 1].kIndex === i) extremaNearKnot[extremaNearKnot.length - 1].extrema.push(j)
//     //                             //else extremaNearKnot.push({kIndex: intermediateKnots[i].index, extrema: [j]})
//     //                             else extremaNearKnot.push({kIndex: i, extrema: [j]})
//     //                         eventCounter +=1
//     //                         let move = 0.0
//     //                         eventMoveNearKnot = eventMove.still
//     //                         if(this.previousSequenceCurvatureExtrema.length > 0) move = curvatureExtremaLocationsOptim[j] - this.previousSequenceCurvatureExtrema[j]
//     //                         if(curvatureExtremaLocationsOptim[j] < intermediateKnots[i].knot && move > 0) eventMoveNearKnot = eventMove.moveToKnotLR
//     //                         if(curvatureExtremaLocationsOptim[j] < intermediateKnots[i].knot && move < 0) eventMoveNearKnot = eventMove.moveAwayFromKnotRL
//     //                         if(curvatureExtremaLocationsOptim[j] > intermediateKnots[i].knot && move > 0) eventMoveNearKnot = eventMove.moveAwayFromKnotLR
//     //                         if(curvatureExtremaLocationsOptim[j] > intermediateKnots[i].knot && move < 0) eventMoveNearKnot = eventMove.moveToKnotRL
//     //                         if(curvatureExtremaLocationsOptim[j] === intermediateKnots[i].knot) eventMoveNearKnot = eventMove.atKnot
//     //                         if(this.updateConstraintBound) {
//     //                             if(!this.eventInsideKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = true
//     //                             this.eventInsideKnotNeighborhood[i] = true
//     //                             this.eventMoveAtIterationStart[i] = eventMoveNearKnot
//     //                         }
//     //                         //console.log("add an event near an intermediate knot")
//     //                     }
//     //                 }
//     //                 if(eventCounter === 0) this.eventInsideKnotNeighborhood[i] = false
//     //                 console.log("i: " + i + " updateConstraintBound " + this.updateConstraintBound + " eventMoveAtIterationStart " + this.eventMoveAtIterationStart[i] + 
//     //                 " eventEnterKnotNeighborhood " + this.eventEnterKnotNeighborhood[i] + " eventInsideKnotNeighborhood " + this.eventInsideKnotNeighborhood[i])
//     //             }

//     //             for(let i = 0; i < intermediateKnots.length; i += 1) {
//     //                 //if((this.updateConstraintBound && (this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotRL || this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotLR)) ||
//     //                 //this.eventEnterKnotNeighborhood[i]) {
//     //                 if(this.updateConstraintBound && (this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotRL || this.eventMoveAtIterationStart[i] === eventMove.moveAwayFromKnotLR ||
//     //                 this.eventInsideKnotNeighborhood[i])) {
//     //                     let controlPointIndex = ((intermediateKnots[i].index - 4) + 1) * 7 - 1
//     //                     this.revertCurvatureExtremaConstraints[controlPointIndex] = 1
//     //                     this.curvatureExtremaConstraintBounds[controlPointIndex] = 0
//     //                     this.revertCurvatureExtremaConstraints[controlPointIndex + 1] = 1
//     //                     this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = 0
//     //                 }
//     //             }

//     //             if(extremaNearKnot.length > 0) {
//     //                 /* JCL Removes the inactive constraints at intermediate knots that contain events in their neighborhood */
//     //                 for(let i = 0; i < extremaNearKnot.length; i += 1) {
//     //                     let controlPointIndex = (extremaNearKnot[i].kIndex + 1) * 7 - 1
//     //                     /*let variationEvent = 0.0
//     //                     if(this.previousSequenceCurvatureExtrema.length > 0) {
//     //                         variationEvent = curvatureExtremaLocationsOptim[extremaNearKnot[i].extrema[0]] - this.previousSequenceCurvatureExtrema[extremaNearKnot[i].extrema[0]]
//     //                     }
//     //                     let distKnot = curvatureExtremaLocationsOptim[extremaNearKnot[i].extrema[0]] - intermediateKnots[extremaNearKnot[i].kIndex].knot
//     //                     //let deltaCP1 = this.currentCurvatureExtremaControPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                     let deltaCP1 = functionBOptim.controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                     let stepCP1 = Math.abs(controlPoints[controlPointIndex]/deltaCP1)
//     //                     //let deltaCP2 = this.currentCurvatureExtremaControPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                     let deltaCP2 = functionBOptim.controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                     let stepCP2 = Math.abs(controlPoints[controlPointIndex + 1]/deltaCP2)
//     //                     let stepEvent = Math.abs(distKnot/variationEvent)*/

//     //                     /* JCL The event tracked has not crossed the knot */
//     //                     console.log("CPi " + controlPoints[controlPointIndex] + " CPi+1 " + controlPoints[controlPointIndex + 1] + " CPpi " + this.previousCurvatureExtremaControlPoints[controlPointIndex] + " CPpi+1 " + this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
//     //                     if(controlPoints[controlPointIndex] > 0 && controlPoints[controlPointIndex + 1] > 0) {
//     //                         if(this.eventMoveAtIterationStart[i] === eventMove.moveToKnotLR || this.eventMoveAtIterationStart[i] === eventMove.moveToKnotRL) {
//     //                             //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
//     //                             if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
//     //                             if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)
//     //                             if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
//     //                                 this.revertCurvatureExtremaConstraints[controlPointIndex] = -1
//     //                             } else {
//     //                                 this.revertCurvatureExtremaConstraints[controlPointIndex + 1] = -1
//     //                             }
//     //                             if(this.updateConstraintBound) {
//     //                                 if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
//     //                                     if(this.curvatureExtremaConstraintBounds[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
//     //                                         if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                         else {
//     //                                             this.curvatureExtremaConstraintBounds[controlPointIndex] = controlPoints[controlPointIndex] + (controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex])
//     //                                         }
//     //                                     } else if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
//     //                                         this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                     }
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = 0.0
//     //                                 } else {
//     //                                     if(this.curvatureExtremaConstraintBounds[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
//     //                                         if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                         else this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] + (controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
//     //                                     } else if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
//     //                                         this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                     }
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex] = 0.0
//     //                                 }
//     //                                 if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
//     //                             }
//     //                         }
//     //                     } else if(controlPoints[controlPointIndex] < 0 && controlPoints[controlPointIndex + 1] < 0) {
//     //                         if(this.eventMoveAtIterationStart[i] === eventMove.moveToKnotLR || this.eventMoveAtIterationStart[i] === eventMove.moveToKnotRL) {
//     //                             //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
//     //                             if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)
//     //                             if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
//     //                             if(controlPoints[controlPointIndex] > controlPoints[controlPointIndex + 1]) {
//     //                                 this.revertCurvatureExtremaConstraints[controlPointIndex + 1] = -1
//     //                             } else {
//     //                                 this.revertCurvatureExtremaConstraints[controlPointIndex] = -1
//     //                             }
//     //                             if(this.updateConstraintBound) {
//     //                                 if(controlPoints[controlPointIndex] < controlPoints[controlPointIndex + 1]) {
//     //                                     if(this.curvatureExtremaConstraintBounds[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
//     //                                         if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                         else {
//     //                                             this.curvatureExtremaConstraintBounds[controlPointIndex] = controlPoints[controlPointIndex] - (this.previousCurvatureExtremaControlPoints[controlPointIndex] - controlPoints[controlPointIndex])
//     //                                         }
//     //                                     } else if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
//     //                                         this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                     }
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = 0.0
//     //                                 } else {
//     //                                     if(this.curvatureExtremaConstraintBounds[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
//     //                                         if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                         else {
//     //                                             this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] - (this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] - controlPoints[controlPointIndex + 1])
//     //                                         }
//     //                                     } else if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
//     //                                         this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                     }
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex] = 0.0
//     //                                 }

//     //                                 if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
//     //                             }
//     //                         }
//     //                     } else if(this.eventMoveAtIterationStart[i] === eventMove.atKnot) { 
//     //                     //} else if(this.eventMoveAtIterationStart === eventMove.moveToKnotLR || this.eventMoveAtIterationStart === eventMove.moveToKnotRL) {
//     //                         //|| ((eventMoveNearKnot === eventMove.moveAwayFromKnotRL || eventMoveNearKnot === eventMove.moveAwayFromKnotLR) && !this.updateConstraintBound)) {
//     //                         if(result.indexOf(controlPointIndex) !== -1) result.splice(result.indexOf(controlPointIndex), 1)
//     //                         if(result.indexOf(controlPointIndex + 1) !== -1) result.splice(result.indexOf(controlPointIndex + 1), 1)

//     //                         /* JCL Whatever the configuration: 
//     //                             - this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0 && controlPoints[controlPointIndex] > 0: the control point is changing of half space
//     //                             but the constraint must be kept reversed to avoid adverse effects with the convergence of the trust region optimizer
//     //                             - this.previousCurvatureExtremaControlPoints[controlPointIndex] > 0 && controlPoints[controlPointIndex] > 0: the control point was already in the positive
//     //                             half space et must be kept as close to zero  as possible to contribute to event sliding
//     //                             - this.eventMoveAtIterationStart !== eventMoveNearKnot: the constraint settings must be constant during an optimizer iteration
//     //                             */
//     //                         this.revertCurvatureExtremaConstraints[controlPointIndex] = -1
//     //                         this.revertCurvatureExtremaConstraints[controlPointIndex + 1] = -1

//     //                         /*if(controlPoints[controlPointIndex + 1] > 0 ) {
//     //                             if(this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) this.revertConstraints[controlPointIndex + 1] = -1
//     //                             else this.revertConstraints[controlPointIndex + 1] = 1
//     //                         }*/
//     //                         if(this.updateConstraintBound) {
//     //                             if(controlPoints[controlPointIndex] > 0 ) {
//     //                                 /* JCL the previous event move cannot be 'away from knot', it must be 'to knot', therefore this.constraintBound[controlPointIndex] !== 0 
//     //                                 but the initialization (when loading a curve) can start with this.constraintBound[controlPointIndex] === 0, so this condition is required also */
//     //                                 if(this.curvatureExtremaConstraintBounds[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
//     //                                     if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                     else {
//     //                                         this.curvatureExtremaConstraintBounds[controlPointIndex] = controlPoints[controlPointIndex] + (controlPoints[controlPointIndex] - this.previousCurvatureExtremaControlPoints[controlPointIndex])
//     //                                     }
//     //                                 } else if(controlPoints[controlPointIndex] < this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                 }
//     //                             } else {
//     //                                 if(this.curvatureExtremaConstraintBounds[controlPointIndex] === 0 || controlPoints[controlPointIndex] * this.previousCurvatureExtremaControlPoints[controlPointIndex] < 0) {
//     //                                     if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                     else this.curvatureExtremaConstraintBounds[controlPointIndex] = controlPoints[controlPointIndex] - (this.previousCurvatureExtremaControlPoints[controlPointIndex] - controlPoints[controlPointIndex])
//     //                                 } else if(controlPoints[controlPointIndex] > this.previousCurvatureExtremaControlPoints[controlPointIndex]) {
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex] = this.previousCurvatureExtremaControlPoints[controlPointIndex]
//     //                                 }
//     //                             }
//     //                             if(controlPoints[controlPointIndex + 1] > 0) {
//     //                                 if(this.curvatureExtremaConstraintBounds[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
//     //                                     if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                     else this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] + (controlPoints[controlPointIndex + 1] - this.previousCurvatureExtremaControlPoints[controlPointIndex + 1])
//     //                                 } else if(controlPoints[controlPointIndex + 1] < this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                 }
//     //                             } else {
//     //                                 if(this.curvatureExtremaConstraintBounds[controlPointIndex + 1] === 0 || controlPoints[controlPointIndex + 1] * this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] < 0) {
//     //                                     if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                     else this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = controlPoints[controlPointIndex + 1] - (this.previousCurvatureExtremaControlPoints[controlPointIndex + 1] - controlPoints[controlPointIndex + 1])
//     //                                 } else if(controlPoints[controlPointIndex + 1] > this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]) {
//     //                                     this.curvatureExtremaConstraintBounds[controlPointIndex + 1] = this.previousCurvatureExtremaControlPoints[controlPointIndex + 1]
//     //                                 }
//     //                             }

//     //                             if (this.eventEnterKnotNeighborhood[i]) this.eventEnterKnotNeighborhood[i] = false
//     //                         }
//     //                     }
//     //                     console.log("process CP index " + controlPointIndex + " result " + result + " rvCst " + this.revertCurvatureExtremaConstraints[controlPointIndex] + ", " + this.revertCurvatureExtremaConstraints[controlPointIndex + 1]  + " bound " + this.curvatureExtremaConstraintBounds[controlPointIndex] + ", " 
//     //                         + this.curvatureExtremaConstraintBounds[controlPointIndex + 1] + " CP " + controlPoints[controlPointIndex] + ", " + controlPoints[controlPointIndex+1] + " updateBound " + this.updateConstraintBound + 
//     //                         " move " + this.eventMoveAtIterationStart[i] + " eventInsideKnotNeighborhood " + this.eventInsideKnotNeighborhood[i] + " enter " + this.eventEnterKnotNeighborhood[i])
//     //                 }
//     //             }
//     //         }
//     //     }

//     //     /* JCL Test */
//     //     /*if(this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
//     //         let maxValue = 1
//     //         for(let i = 1; i < controlPoints.length - 1; i+=1) {
//     //             this.revertConstraints[i] = 1
//     //             this.constraintBound[i] = 0
//     //             if(controlPoints[i] > maxValue){
//     //                 if(result.indexOf(i) !== -1) result.splice(result.indexOf(i), 1)
//     //                 this.revertConstraints[i] = -1
//     //                 this.constraintBound[i] = maxValue
//     //             }
//     //         }
//     //     }*/

//     //     if((this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear)
//     //         && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length && this.updateConstraintBound) {
//     //         if(this.neighboringEvent.value && this.neighboringEvent.valueOptim &&  this.neighboringEvent.locExt && this.neighboringEvent.locExtOptim && this.neighboringEvent.span &&
//     //             this.neighboringEvent.range && this.neighboringEvent.variation && this.neighboringEvent.knotIndex !== undefined) {
//     //             const upperBound = this.neighboringEvent.span
//     //             const lowerBound = this.neighboringEvent.span - this.neighboringEvent.range

//     //             //let revertConstraints: Array<number> =[]
//     //             //let constraintBound: Array<number> =[]
//     //             if(this.spline.degree === 3 && this.neighboringEvent.knotIndex !== 0) {
//     //                 //if(((controlPoints[upperBound] === this.neighboringEvent.value || controlPoints[upperBound + 1] === this.neighboringEvent.value) && this.neighboringEvent.value > 0) ||
//     //                 //((controlPoints[upperBound] === this.neighboringEvent.value || controlPoints[upperBound + 1] === this.neighboringEvent.value) && this.neighboringEvent.value < 0)) {
//     //                     if(result.indexOf(upperBound) !== -1) result.splice(result.indexOf(upperBound), 1)
//     //                     if(result.indexOf(upperBound + 1) !== -1) result.splice(result.indexOf(upperBound + 1), 1)
//     //                     this.revertCurvatureExtremaConstraints[upperBound] = 1
//     //                     this.curvatureExtremaConstraintBounds[upperBound] = 0
//     //                     this.revertCurvatureExtremaConstraints[upperBound + 1] = 1
//     //                     this.curvatureExtremaConstraintBounds[upperBound + 1] = 0
//     //                     console.log("avoid generation of extrema. result " + result +  " rvCst " + this.revertCurvatureExtremaConstraints[upperBound] + ", " + this.revertCurvatureExtremaConstraints[upperBound + 1]  + " bound " + this.curvatureExtremaConstraintBounds[upperBound] + ", " 
//     //                     + this.curvatureExtremaConstraintBounds[upperBound + 1])
//     //                 //}
//     //             } else {
//     //                 /* JCL removes the inactive constraints that may exist in the current interval span */
//     //                 for(let j = lowerBound; j < upperBound + 1; j += 1) {
//     //                     if(result.indexOf(j) !== -1) result.splice(result.indexOf(j), 1)
//     //                 }
//     //                 let j = 0
//     //                 for(let i = 0; i < controlPoints.length; i+= 1){
//     //                     this.revertCurvatureExtremaConstraints[i] = 1
//     //                     this.curvatureExtremaConstraintBounds[i] = 0
//     //                     //if(i >=  lowerBound && i <= upperBound) {
//     //                     if(i >  lowerBound && i < upperBound) {
//     //                         /* JCL a simplifier */
//     //                         /*if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
//     //                             if(controlPoints[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
//     //                             if(controlPoints[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) this.revertConstraints[i] = -1
//     //                         } else if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//     //                             if(controlPoints[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertConstraints[i] = -1
//     //                             if(controlPoints[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) {
//     //                                 this.revertConstraints[i] = -1
//     //                                 this.constraintBound[i] = controlPoints[i] - (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
//     //                             }
//     //                         }*/
//     //                         if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
//     //                             if(this.controlPointsFunctionBInit[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertCurvatureExtremaConstraints[i] = -1
//     //                             if(this.controlPointsFunctionBInit[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) this.revertCurvatureExtremaConstraints[i] = -1
//     //                         } else if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//     //                             if(this.controlPointsFunctionBInit[i] < 0 && this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) this.revertCurvatureExtremaConstraints[i] = -1
//     //                             if(this.controlPointsFunctionBInit[i] > 0 && this.neighboringEvent.value < 0 && this.neighboringEvent.valueOptim > 0) {
//     //                                 this.revertCurvatureExtremaConstraints[i] = 1
//     //                                 if(this.neighboringEvent.variation[j] > 0) {
//     //                                     //this.constraintBound[i] = -(this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
//     //                                     this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
//     //                                 } else {
//     //                                     this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] - 1.0e-7
//     //                                 }
                                
//     //                             }
//     //                         }
//     //                             //this.constraintBound[i] = controlPoints[i] - (this.neighboringEvent.variation[j] * this.neighboringEvent.value) / (this.neighboringEvent.valueOptim - this.neighboringEvent.value)
//     //                         j += 1
//     //                     }
//     //                 }
//     //                 console.log("control of B(u): result " + result +  " rvCst " + this.revertCurvatureExtremaConstraints + ", "  + " bound " + this.curvatureExtremaConstraintBounds)
//     //             }
//     //             /*if(this.neighboringEvent.value > 0 && this.neighboringEvent.valueOptim < 0) {
//     //                 let activeSignChanges: number[] = []
//     //                 for(let i = 0; i < signChangesIntervals.length; i += 1) {
//     //                     if(signChangesIntervals[i] >= lowerBound && signChangesIntervals[i] < upperBound) activeSignChanges.push(signChangesIntervals[i])
//     //                 }
//     //                 if(activeSignChanges.length < 2) {
//     //                     console.log("Number of control polygon sign changes inconsistent.")
//     //                 } else if(activeSignChanges.length === 2) {
//     //                     let deltaLowerBound = controlPoints[activeSignChanges[0] + 1] - controlPoints[activeSignChanges[0]]
//     //                     let deltaUpperBound = controlPoints[activeSignChanges[1] + 1] - controlPoints[activeSignChanges[1]]
//     //                     if(!(deltaLowerBound > 0 && deltaUpperBound < 0)) console.log("Inconsistent sign changes")
//     //                     if(controlPoints[lowerBound] < 0.0 && controlPoints[upperBound] < 0.0) console.log("Inconsistent location of the extreme control vertices.")
//     //                     let zeroControlPolygonLowerBound = (Math.abs(controlPoints[activeSignChanges[0] + 1] / controlPoints[activeSignChanges[0]]) + 1.0) / (controlPoints.length - 1)
//     //                     let zeroControlPolygonUpperBound = (Math.abs(controlPoints[activeSignChanges[1] + 1] / controlPoints[activeSignChanges[1]]) + 1.0) / (controlPoints.length - 1)
//     //                     if(!((activeSignChanges[0]/(controlPoints.length - 1)) + zeroControlPolygonLowerBound < this.neighboringEvent.locExt && 
//     //                         (activeSignChanges[1]/(controlPoints.length - 1)) + zeroControlPolygonUpperBound > this.neighboringEvent.locExt)) {
//     //                         console.log("Inconsistent location of the curvature derivative extremum wrt its control polygon.")
//     //                     }
//     //                     console.log("Consistent number of zeros in the control polygon")
//     //                     if(activeSignChanges[0] + 1 === activeSignChanges[1]) {
//     //                         /* JCL The positive half plane caontains only one control point. Its constraint must not be deactivated */
//     //                         /*let indexControlPoint = result.indexOf(activeSignChanges[1])
//     //                         if(indexControlPoint !== -1) {
//     //                             result.splice(indexControlPoint, 1)
//     //                         }
//     //                     } else if(activeSignChanges[1] - activeSignChanges[0] + 1 === 1) {*/
//     //                         /* JCL The positive half plane contains only two control points. Their constraint must not be deactivated */
//     //                         /*let indexControlPoint = result.indexOf(activeSignChanges[0] + 1)
//     //                         if(indexControlPoint !== -1) {
//     //                             result.splice(indexControlPoint, 1)
//     //                         }
//     //                         indexControlPoint = result.indexOf(activeSignChanges[1])
//     //                         if(indexControlPoint !== -1) {
//     //                             result.splice(indexControlPoint, 1)
//     //                         }
//     //                     }
//     //                 } else if(activeSignChanges.length > 2) {
    
//     //                 }
    
//     //             }*/
//     //         } else {
//     //             console.log("Inconsistent content for processing neighboring events.")
//     //         }
//     //     } else if((this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear ||
//     //     this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) 
//     //     && this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) {
//     //         if(this.neighboringEvent.value !== undefined && this.neighboringEvent.valueOptim !== undefined && this.neighboringEvent.locExt !== undefined && this.neighboringEvent.locExtOptim !== undefined 
//     //             && this.neighboringEvent.span !== undefined && this.neighboringEvent.range !== undefined) {
//     //             if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
//     //                 if(this.shapeSpaceBoundaryConstraintsCurvExtrema[0] === 0 ) {
//     //                     if(result.length > 0 && result.indexOf(0) !== -1) result.splice(result.indexOf(0), 1)
//     //                     this.revertCurvatureExtremaConstraints[0] = 1
//     //                     this.curvatureExtremaConstraintBounds[0] = 0

//     //                 } else if(this.shapeSpaceBoundaryConstraintsCurvExtrema[this.shapeSpaceBoundaryConstraintsCurvExtrema.length - 1] === this.spline.controlPoints.length - 1) {
//     //                     if(result.length > 0 && result.indexOf(controlPoints.length - 1) !== -1) result.splice(result.indexOf(controlPoints.length - 1), 1)
//     //                     this.revertCurvatureExtremaConstraints[controlPoints.length - 1] = 1
//     //                     this.curvatureExtremaConstraintBounds[controlPoints.length - 1] = 0
//     //                 }
//     //                 /* JCL 08/03/2021 Add constraint modifications to curvature extrema appearing based on a non null optimum value of B(u) */
//     //                 if(this.neighboringEvent.valueOptim !== 0.0 && this.neighboringEvent.variation !== undefined) {
//     //                     /* to be added: the interval span to be processed */
//     //                     for(let i = 1; i < controlPoints.length - 1; i+= 1){
//     //                         if(result.length > 0 && result.indexOf(i) !== -1) result.splice(result.indexOf(i), 1)
//     //                         this.revertCurvatureExtremaConstraints[i] = 1
//     //                         this.curvatureExtremaConstraintBounds[i] = 0
//     //                         if(this.neighboringEvent.valueOptim > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
//     //                             if(this.neighboringEvent.variation[i] > 0.0) {
//     //                                 this.revertCurvatureExtremaConstraints[i] = -1
//     //                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this.neighboringEvent.variation[i]
//     //                             } else {
//     //                                 this.revertCurvatureExtremaConstraints[i] = -1
//     //                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + 1.0e-7
//     //                             }
//     //                         } else if(this.neighboringEvent.valueOptim < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
//     //                             if(this.neighboringEvent.variation[i] < 0.0) {
//     //                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this.neighboringEvent.variation[i]
//     //                             } else {
//     //                                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + 1.0e-7
//     //                             }
//     //                         }
//     //                     }
//     //                 }
//     //             } else console.log("Null content of shapeSpaceBoundaryConstraintsCurvExtrema.")
//     //         } else {
//     //             console.log("Inconsistent content for processing neighboring events.")
//     //         }
//     //     }
//     //     //if(this.curvatureExtremaTotalNumberOfConstraints === controlPoints.length) console.log("inactive curvat cnst " + result + " CP[0] = " + controlPoints[0])
//     //     return result
//     // }

//     compute_curvatureExtremaConstraints(curvatureDerivativeNumerator: number[], constraintsSign: number[], inactiveConstraints: number[]): number[] {
//         let result: number[] = [];
//         if(this._diffEventsVariation === undefined) return result;
//         for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
//             if (i === inactiveConstraints[j]) {
//                 j += 1;
//             } else {
//                 result.push((curvatureDerivativeNumerator[i] - this.curvatureExtremaConstraintBounds[i]) * constraintsSign[i] * this.revertCurvatureExtremaConstraints[i])
//             }
//         }
//         return result
//     }

//     compute_inflectionConstraints(curvatureNumerator: number[], constraintsSign: number[],
//         inactiveConstraints: number[]): number[] {

//         let result: number[] = [];
//         if(this._diffEventsVariation === undefined) return result;
//         for (let i = 0, j= 0, n = constraintsSign.length; i < n; i += 1) {
//             if (i === inactiveConstraints[j]) {
//                 j += 1;
//             } else {
//                 result.push((curvatureNumerator[i] - this.inflectionsConstraintsBounds[i]) * constraintsSign[i] * this.revertInflectionsConstraints[i]);
//             }
//         }
//         return result;
//     }

//     compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
//                                                 constraintsSign: number[], 
//                                                 inactiveConstraints: number[]): DenseMatrix {

//         const sxu = e.bdsxu
//         const sxuu = e.bdsxuu
//         const sxuuu = e.bdsxuuu
//         const syu = e.bdsyu
//         const syuu = e.bdsyuu
//         const syuuu = e.bdsyuuu
//         const h1 = e.h1
//         const h2 = e.h2
//         const h3 = e.h3
//         const h4 = e.h4

//         let dgx = []
//         let dgy = []
//         const controlPointsLength = this.spline.controlPoints.length
//         const totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints
//         const degree = this.spline.degree

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h1_subset = h1.subset(start, lessThan);
//             let h2_subset = h2.subset(start, lessThan);
//             let h3_subset = h3.subset(start, lessThan);
//             let h4_subset = h4.subset(start, lessThan);
//             let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
//             let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
//             let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
//             let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
//             let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
//             dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
//         }

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h1_subset = h1.subset(start, lessThan);
//             let h2_subset = h2.subset(start, lessThan);
//             let h3_subset = h3.subset(start, lessThan);
//             let h4_subset = h4.subset(start, lessThan);
//             let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
//             let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
//             let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
//             let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
//             let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
//         }

//         let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)
//         if(this._diffEventsVariation === undefined) return result;

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let cpx = dgx[i].flattenControlPointsArray();
//             let cpy = dgy[i].flattenControlPointsArray();

//             let start = Math.max(0, i - degree) * (4 * degree - 5)
//             let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5)

//             let deltaj = 0
//             for (let i = 0; i < inactiveConstraints.length; i += 1) {
//                 if (inactiveConstraints[i] >= start) {
//                     break
//                 }
//                 deltaj += 1
//             }

//             for (let j = start; j < lessThan; j += 1) {
//                 if (j === inactiveConstraints[deltaj]) {
//                     deltaj += 1
//                 } else {
//                     result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
//                     result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
//                 }
//             }
//         }

//         return result;
//     }

//     compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
//         constraintsSign: number[], 
//         inactiveConstraints: number[]): DenseMatrix {

//         const sxu = e.bdsxu
//         const sxuu = e.bdsxuu
//         const syu = e.bdsyu
//         const syuu = e.bdsyuu

//         let dgx = [];
//         let dgy = [];
//         const controlPointsLength = this.spline.controlPoints.length;
//         const degree = this.spline.degree;

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
//             let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
//             dgx.push((h10.add(h11)));
//         }

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let start = Math.max(0, i - degree);
//             let lessThan = Math.min(controlPointsLength - degree, i + 1);
//             let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
//             let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
//             dgy.push(h10.add(h11));
//         }

//         const totalNumberOfConstraints = this.inflectionConstraintsSign.length

//         let result = new DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength)
//         if(this._diffEventsVariation === undefined) return result;

//         for (let i = 0; i < controlPointsLength; i += 1) {
//             let cpx = dgx[i].flattenControlPointsArray();
//             let cpy = dgy[i].flattenControlPointsArray();

//             let start = Math.max(0, i - degree) * (2 * degree - 2)
//             let lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2)

//             let deltaj = 0
//             for (let i = 0; i < inactiveConstraints.length; i += 1) {
//                 if (inactiveConstraints[i] >= start) {
//                 break
//                 }
//                 deltaj += 1
//             }

//             for (let j = start; j < lessThan; j += 1) {
//                 if (j === inactiveConstraints[deltaj]) {
//                 deltaj += 1
//                 } else {
//                 result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j])
//                 result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j])
//                 }
//             }
//         }

//         return result;
//     }


//     compute_f(  curvatureNumerator: number[],
//                 inflectionConstraintsSign: number[],
//                 inflectionInactiveConstraints: number[],
//                 curvatureDerivativeNumerator: number[],
//                 curvatureExtremaConstraintsSign: number[],
//                 curvatureExtremaInactiveConstraints: number[]) {
//         let f: number[] = [];
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
//             // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " r1: " + r1)
//             const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
//             f = r1.concat(r2);
//         } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
//             // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " f: " + f)
//         } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
//             f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints)
//         }
//        return f;
//     }

//     compute_gradient_f( e: ExpensiveComputationResults,
//                         inflectionConstraintsSign: number[],
//                         inflectionInactiveConstraints: number[],
//                         curvatureExtremaConstraintsSign: number[], 
//                         curvatureExtremaInactiveConstraints: number[]): DenseMatrix {
    
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
//             // console.log(" grad_fGN: " + curvatureExtremaConstraintsSign + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " m1: " + m1)
//             const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
//             const [row_m1, n] = m1.shape
//             const [row_m2, ] = m2.shape

//             const m = row_m1 + row_m2

//             let result = new DenseMatrix(m, n)

//             for (let i = 0; i < row_m1; i += 1) {
//                 for (let j = 0; j < n; j += 1 ) {
//                     result.set(i, j, m1.get(i, j))
//                 }
//             }
//             for (let i = 0; i < row_m2; i += 1) {
//                 for (let j = 0; j < n; j += 1 ) {
//                     result.set(row_m1 + i, j, m2.get(i, j))
//                 }
//             }
//             return result
//         } else if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
//         } else if(this._shapeSpaceDiffEventsStructure.activeControlInflections) {
//             return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
//         } else {
//             const warning = new WarningLog(this.constructor.name, "compute_gradient_f", "active control set to none: unable to compute gradients of f.");
//             warning.logMessageToConsole();
//             let result = new DenseMatrix(1, 1);
//             return result;
//         }
//     }

//     step(deltaX: number[]) {
//         let checked: boolean = true
//         let inactiveCurvatureConstraintsAtStart = this.curvatureExtremaInactiveConstraints
//         let e: ExpensiveComputationResults = this.initExpansiveComputations();
//         let curvatureNumerator: number[] = [];
//         let curvatureDerivativeNumerator: number[] = [];
//         let curvatureDerivativeEXtrema: number[] = [];
//         let curvatureDerivativeEXtremaUpdated: number[] = [];
//         // if(this.boundaryEnforcer.isActive()) {
//             this._inflectionInactiveConstraints = [];
//             this._curvatureExtremaInactiveConstraints = [];
//         // }
//         // if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//         if(this.diffEventsVariation.neighboringEvents.length > 0) {
//             if(this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
//                 const splineDP = new BSplineR1toR2DifferentialProperties(this.spline)
//                 const functionB = splineDP.curvatureDerivativeNumerator()
//                 const curvatureExtremaLocations = functionB.zeros()
//                 const functionBderivativeExtrema = functionB.derivative().zeros();
//                 for(const extLoc of functionBderivativeExtrema) {
//                     curvatureDerivativeEXtrema.push(functionB.evaluate(extLoc));
//                 }
//                 const splineCurrent = this.spline.clone()
    
//                 this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
//                 const splineDPupdated = new BSplineR1toR2DifferentialProperties(this.spline)
//                 const functionBupdated = splineDPupdated.curvatureDerivativeNumerator()
//                 const curvatureExtremaLocationsUpdated = functionBupdated.zeros()
//                 const functionBderivativeExtremaUpdated = functionBupdated.derivative().zeros();
//                 for(const extLoc of functionBderivativeExtremaUpdated) {
//                     curvatureDerivativeEXtremaUpdated.push(functionBupdated.evaluate(extLoc));
//                 }
//                 if(curvatureExtremaLocationsUpdated.length !== curvatureExtremaLocations.length) {
//                     checked = false
//                     // this.spline = splineCurrent
//                     console.log("extrema current: " + curvatureExtremaLocations + " extrema updated: " + curvatureExtremaLocationsUpdated)
//                     this._iteratedCurves.pop();
//                     return checked;
//                 } else {
//                     this._iteratedCurves.push(this.spline);
//                 }
//             } else {
//                 this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
//             }
//         } else {
//             this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
//             this._iteratedCurves.push(this.spline);
//         }

//         this._gradient_f0 = this.compute_gradient_f0(this._spline);
//         this._f0 = this.compute_f0(this._gradient_f0);
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             e = this.expensiveComputation(this._spline);
//             curvatureNumerator = this.curvatureNumerator(e.h4);
//             this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
//             this.constraintType = ConstraintType.inflection;
//             // this._inflectionInactiveConstraints = this.computeInactiveConstraintsGN(curvatureNumerator)
//             // if(!this.boundaryEnforcer.isActive()) 
//             //     this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
//             this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
//             // if(this.updateConstraintBound) {
//             //     this.clearInequalityChanges();
//             //     this.clearConstraintBoundsUpdate();
//             //     this.revertInequalitiesWithinRangeOfLocalExtremum();
//             //     this.updateConstraintBoundsWithinRangeOfLocalExtremum();
//             // }
//         }
//         if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
//             this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator)
//             this.constraintType = ConstraintType.curvatureExtrema;
//             // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(g)
//             // if(!this.boundaryEnforcer.isActive())
//             //     this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
//             this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
//         }

//         if(this.updateConstraintBound) {
//             this.clearInequalityChanges();
//             this.clearConstraintBoundsUpdate();
//             this.revertInequalitiesWithinRangeOfLocalExtremum();
//             this.updateConstraintBoundsWithinRangeOfLocalExtremum();
//         }

//         //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
//         console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " revert " + this.revertCurvatureExtremaConstraints
//              + " cst sgn " + this.curvatureExtremaConstraintsSign + " bound " + this.curvatureExtremaConstraintBounds
//              + " update status "+ this.updateConstraintBound + " extB " + curvatureDerivativeEXtrema + " extBUpdt " + curvatureDerivativeEXtremaUpdated)

//         this.updateConstraintBound = false;

//         this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, curvatureDerivativeNumerator, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
//         this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);

//         if(this.isComputingHessian) {
//             this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
//         }

//         return checked
//     }

//     update(spline: BSplineR1toR2): void {
//         let e: ExpensiveComputationResults = this.initExpansiveComputations();
//         this._spline = spline.clone();
//         this.computeBasisFunctionsDerivatives();
//         this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
//         this._gradient_f0 = this.compute_gradient_f0(this._spline);
//         this._f0 = this.compute_f0(this._gradient_f0);
//         this._hessian_f0 = identityMatrix(this._numberOfIndependentVariables);
//         this._inflectionInactiveConstraints = [];
//         this._curvatureExtremaInactiveConstraints = [];
//         this.curveAnalyzerCurrentCurve = this._diffEventsVariation.curveAnalyser1;
//         this.curveAnalyzerOptimizedCurve = this._diffEventsVariation.curveAnalyser2;
//         if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             e = this.expensiveComputation(this._spline);
//             this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
//             this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
//             this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
//             this.constraintType = ConstraintType.inflection;
//             // if(!this.boundaryEnforcer.hasNewEvent())
//             //     this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
//             this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
//         }
//         if(this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//             this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
//             this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
//             this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
//             this.constraintType = ConstraintType.curvatureExtrema;
//             // if(!this.boundaryEnforcer.hasNewEvent())
//             //     this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
//             this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
//         }

//         this.controlPointsFunctionBInit =  this._curvatureDerivativeNumeratorCP
//         // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("B(u) control points at init:" + this.currentCurvatureExtremaControPoints)
//         this.curvatureExtremaConstraintBounds = zeroVector(this._curvatureDerivativeNumeratorCP.length);
//         for(let i = 0; i < this._curvatureDerivativeNumeratorCP.length; i += 1) {
//             this.revertCurvatureExtremaConstraints[i] = 1;
//         }

//         this.clearInequalityChanges();
//         this.clearConstraintBoundsUpdate();
//         this.revertInequalitiesWithinRangeOfLocalExtremum();
//         this.updateConstraintBoundsWithinRangeOfLocalExtremum();
//         console.log("optim curv ext inactive constraints: " + this.curvatureExtremaInactiveConstraints)
//         console.log("optim inflection inactive constraints: " + this.inflectionInactiveConstraints)

//         this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
//         this.checkConstraintConsistency();
//         this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
//     }

//     // fStep(step: number[]) {
//     //     let e: ExpensiveComputationResults = this.initExpansiveComputations();
//     //     let curvatureNumerator: number[] = [];
//     //     let curvatureDerivativeNumerator: number[] = [];
//     //     let splineTemp = this.spline.clone();
//     //     splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
//     //     // splineTemp.optimizerStep(step)
//     //     if(this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//     //         e = this.expensiveComputation(splineTemp)
//     //         curvatureNumerator = this.curvatureNumerator(e.h4)
//     //     }
//     //     if( this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//     //         curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//     //     }
//     //     return this.compute_f(curvatureNumerator,
//     //                         this.inflectionConstraintsSign,
//     //                         this.inflectionInactiveConstraints,
//     //                         curvatureDerivativeNumerator,
//     //                         this.curvatureExtremaConstraintsSign,
//     //                         this.curvatureExtremaInactiveConstraints);
//     // }

//     cancelEvent() {
//         // this.neighboringEvent.event = NeighboringEventsType.none;
//         // this.neighboringEvent.index = -1
//         // this.neighboringEvent.value = 0.0
//         // this.neighboringEvent.valueOptim = 0.0
//         // this.neighboringEvent.locExt = 0.0
//         // this.neighboringEvent.locExtOptim = 0.0
//         // this.neighboringEvent.variation = []
//         // this.neighboringEvent.span = -1
//         // this.neighboringEvent.range = 0
//         /* JCL attention clearVariation n'est pas strictement equivalent aux operations ci-dessus*/
//         this._diffEventsVariation.clearVariation();
//         // this._diffEventsVariation.neighboringEvents = [];

//         //const e = this.expensiveComputation(this.spline)  
//         //const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
//         this.curvatureExtremaConstraintBounds = zeroVector(this.curvatureExtremaConstraintBounds.length);
//         for(let i = 0; i < this.revertCurvatureExtremaConstraints.length; i += 1) {
//             this.revertCurvatureExtremaConstraints[i] = 1
//         }
//         let delta = zeroVector(this.spline.controlPoints.length * 2);
//         this.step(delta);
//         this.checkConstraintConsistency();
//     }

// }