import { SequenceOfDifferentialEvents } from "../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents"
import { CurveDifferentialEventsExtractor } from "../../src/curveShapeSpaceAnalysis/curveDifferentialEventsExtractor"
import { BSpline_R1_to_R2 } from "../../src/bsplines/BSpline_R1_to_R2"
import { CurveShapeSpaceDescriptor } from "../../src/curveShapeSpaceNavigation/CurveShapeSpaceDesccriptor";
import { ExtremumLocationClassifier,
    ExtremumLocation,
    INITIAL_INDEX } from "./ExtremumLocationClassifiier";
import { NavigationState, 
        NavigationThroughSimplerShapeSpaces,
        NavigationStrictlyInsideShapeSpace } from "../curveShapeSpaceNavigation/NavigationState";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { RETURN_ERROR_CODE } from "../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { ShapeSpaceDiffEvventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";

export class CurveAnalyzer {

    private curve: BSpline_R1_to_R2;
    private _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    private curveCurvatureCntrlPolygon: number[];
    private curvatureSignChanges: number[];
    private globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    private curvatureCrtlPtsClosestToZero: number[];
    private curveCurvatureDerivativeCntrlPolygon: number[];
    private curvatureDerivativeSignChanges:  number[];
    private globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    private curvatureDerivCrtlPtsClosestToZero: number[];
    private shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private navigationState: NavigationState;
    private curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEvventsConfigurator;

    constructor(curveToAnalyze: BSpline_R1_to_R2, curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this.curve = curveToAnalyze;
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.navigationState = curveShapeSpaceNavigator.navigationState;
        this.shapeSpaceDescriptor = curveShapeSpaceNavigator.shapeSpaceDescriptor;
        this.shapeSpaceDiffEventsConfigurator = curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator;
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.curvatureCrtlPtsClosestToZero = [];
        this.curveCurvatureCntrlPolygon = [];
        this.curvatureSignChanges = [];
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        if(this.shapeSpaceDiffEventsConfigurator) {
            this.curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
            this.curvatureSignChanges = this.getSignChangesControlPolygon(this.curveCurvatureCntrlPolygon);
            this.getCurvatureCrtlPtsClosestToZero();
        }
        this.curvatureDerivCrtlPtsClosestToZero = [];
        this.curveCurvatureDerivativeCntrlPolygon = [];
        this.curvatureDerivativeSignChanges = [];
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
        if(this.shapeSpaceDiffEventsConfigurator) {
            this.curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
            this.curvatureDerivativeSignChanges = this.getSignChangesControlPolygon(this.curveCurvatureDerivativeCntrlPolygon);
            this.getCurvatureDerivCrtlPtsClosestToZero();
        }
    }

    get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents {
        return this._sequenceOfDifferentialEvents;
    }

    update(): void {
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        if(this.shapeSpaceDiffEventsConfigurator) {
            this.curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        } else {
            this.curveCurvatureCntrlPolygon = [];
            this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        }
        if(this.shapeSpaceDiffEventsConfigurator) {
            this.curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        }
        else {
            this.curveCurvatureDerivativeCntrlPolygon = [];
            this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
        }
    }

    getGlobalExtremmumOffAxis(controlPoints: number[]): ExtremumLocation {
        const localMinima = new ExtremumLocationClassifier(controlPoints);
        const validGlobalMinimum = localMinima.getGlobalMinimum();
        const localMaxima = new ExtremumLocationClassifier(controlPoints);
        const validGlobalMaximum = localMaxima.getGlobalMaximum();
        if(validGlobalMinimum && validGlobalMaximum && Math.abs(localMinima.globalExtremum.value) > Math.abs(localMaxima.globalExtremum.value)) {
            return localMaxima.globalExtremum;
        } else if(validGlobalMinimum && validGlobalMaximum) {
            return localMinima.globalExtremum;
        } else if(validGlobalMinimum) {
            return localMinima.globalExtremum;
        } else if(validGlobalMaximum) {
            return localMaxima.globalExtremum;
        } else return {index: INITIAL_INDEX, value: 0.0};
    }

    getControlPointsSign(controlPoints: number[]) {
        let result: number[] = [];
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            } else {
                result.push(1);
            }
        }
        return result;
    }

    getSignChangesControlPolygon(controlPointsSigns: number[]) {
        let signChangesControlPolygon: number[] = [];
        let previousSign = controlPointsSigns[0];
        for (let i = 1, n = controlPointsSigns.length; i < n; i += 1) {
            if (previousSign !== controlPointsSigns[i]) {
                signChangesControlPolygon.push(i - 1);
            }
            previousSign = controlPointsSigns[i];
        }
        return signChangesControlPolygon;
    }

    // analyzeControlPointsUnderShapeSpaceConstraintsAtCurveExtremities(signChangesIntervals: number, controlPoints: number[], 
    //     nbCurveConstraints: number, constraintsAtCurveExtremties: number[]): number {
    //     let result = RETURN_ERROR_CODE;
    //     if(controlPoints.length === nbCurveConstraints) {
    //         result = signChangesIntervals;
    //         if(constraintsAtCurveExtremties !== undefined){
    //             /* JCL Conditions to prevent events to slip out of the curve through its left extremity */
    //             if(constraintsAtCurveExtremties.length > 0) {
    //                 if(constraintsAtCurveExtremties.indexOf(0) === RETURN_ERROR_CODE || signChangesIntervals === 0) {
    //                     result = RETURN_ERROR_CODE;
    //                 } else if(constraintsAtCurveExtremties.indexOf(controlPoints.length - 1) !== RETURN_ERROR_CODE && signChangesIntervals === (controlPoints.length - 2)) {
    //                     result = signChangesIntervals;
    //                     this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(constraintsAtCurveExtremties.indexOf(controlPoints.length - 1), 1);
    //                 } else {
    //                     result = signChangesIntervals;
    //                 }
    //             }
    //         }
    //     }
    //     return result;
    // }

    getCurvatureCrtlPtsClosestToZero(): void {
        for (let i = 0, n = this.curvatureSignChanges.length; i < n; i += 1) {
            if (Math.pow(this.curveCurvatureCntrlPolygon[this.curvatureSignChanges[i]], 2) < Math.pow(this.curveCurvatureCntrlPolygon[this.curvatureSignChanges[i] + 1], 2)) {
                if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities !== undefined){
                    if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.length > 0) {
                        if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0) !== -1 && this.curvatureSignChanges[i] > 0 && this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i]) === -1) {
                            this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i])
                        } else if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(this.curveCurvatureCntrlPolygon.length - 1) !== -1 && this.curvatureSignChanges[i] === (this.curveCurvatureCntrlPolygon.length - 2) && this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i]) === -1) {
                            this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i]);
                            this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(this.curveCurvatureCntrlPolygon.length - 1), 1);
                        } else if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i]) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i]);
                    } else if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i]) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i]);

                } else {
                    if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i]) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i]);
                }
            } else {
                if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities !== undefined) {
                    /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                    if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.length > 0) {
                        if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(this.curveCurvatureCntrlPolygon.length - 1) !== -1 && (this.curvatureSignChanges[i] + 1) < (this.curveCurvatureCntrlPolygon.length - 1) && this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i] + 1) === -1){
                            this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i] + 1);
                        } else if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0) !== -1 && this.curvatureSignChanges[i] === 0 && this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i] + 1) === -1) {
                            this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i] + 1);
                            this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0), 1)
                        } else if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i] + 1) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i] + 1);
                    } else if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i] + 1) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i] + 1);

                } else {
                    /* JCL general setting where events can slip out of the curve */
                    if(this.curvatureCrtlPtsClosestToZero.indexOf(this.curvatureSignChanges[i] + 1) === -1) this.curvatureCrtlPtsClosestToZero.push(this.curvatureSignChanges[i] + 1);
                }
            }
        }
    }


    getCurvatureDerivCrtlPtsClosestToZero(): void {
        for (let i = 0, n = this.curvatureDerivativeSignChanges.length; i < n; i += 1) {
            if (Math.pow(this.curveCurvatureDerivativeCntrlPolygon[this.curvatureDerivativeSignChanges[i]], 2) < Math.pow(this.curveCurvatureDerivativeCntrlPolygon[this.curvatureDerivativeSignChanges[i] + 1], 2)) {
                if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities !== undefined){
                    /* JCL Conditions to prevent events to slip out of the curve through its left extremity */
                    if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.length > 0) {
                        if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0) !== -1 && this.curvatureDerivativeSignChanges[i] > 0 && this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i]) === -1) {
                            this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i]);
                        } else if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(this.curveCurvatureDerivativeCntrlPolygon.length - 1) !== -1 && this.curvatureDerivativeSignChanges[i] === (this.curveCurvatureDerivativeCntrlPolygon.length - 2) && this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i]) === -1) {
                            // Verifier le fonctionnement de curvatureExtremumMonitoringAtCurveExtremities
                            this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i]);
                            this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(this.curveCurvatureDerivativeCntrlPolygon.length - 1), 1);
                        } else if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i]) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i]);
                    } else if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i]) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i]);

                } else {
                    /* JCL general setting where events can slip out of the curve */
                    if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i]) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i]);
                }
            } else {
                if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities !== undefined) {
                    /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                    if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.length > 0) {
                        if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(this.curveCurvatureDerivativeCntrlPolygon.length - 1) !== -1 && (this.curvatureDerivativeSignChanges[i] + 1) < (this.curveCurvatureDerivativeCntrlPolygon.length - 1) && this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i] + 1) === -1){
                            this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i] + 1);
                        } else if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0) !== -1 && this.curvatureDerivativeSignChanges[i] === 0 && this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i] + 1) === -1) {
                            this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i] + 1);
                            this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0), 1);
                        } else if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i] + 1) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i] + 1);
                    } else if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i] + 1) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i] + 1);

                } else {
                    /* JCL general setting where events can slip out of the curve */
                    if(this.curvatureDerivCrtlPtsClosestToZero.indexOf(this.curvatureDerivativeSignChanges[i] + 1) === -1) this.curvatureDerivCrtlPtsClosestToZero.push(this.curvatureDerivativeSignChanges[i] + 1);
                }
            }
        }
    }

    getControlPointsClosestToZero(signChangesIntervals: number[], controlPoints: number[]) {
        let result: number[] = [];

        for (let i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
                if(controlPoints.length === this.shapeSpaceDescriptor.curvatureExtremaTotalNumberOfConstraints) {
                    if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities !== undefined){
                        /* JCL Conditions to prevent events to slip out of the curve through its left extremity */
                        if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.length > 0) {
                            if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i]);
                            } else if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
                                // Verifier le fonctionnement de curvatureExtremumMonitoringAtCurveExtremities
                                result.push(signChangesIntervals[i]);
                                this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1), 1);
                            } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                        } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
    
                    } else {
                        /* JCL general setting where events can slip out of the curve */
                        if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                    }
                } else if(controlPoints.length === this.shapeSpaceDescriptor.inflectionsTotalNumberOfConstraints) {
                    if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities !== undefined){
                        if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.length > 0) {
                            if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0) !== -1 && signChangesIntervals[i] > 0 && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i])
                            } else if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1) !== -1 && signChangesIntervals[i] === (controlPoints.length - 2) && result.indexOf(signChangesIntervals[i]) === -1) {
                                result.push(signChangesIntervals[i]);
                                this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1), 1);
                            } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                        } else if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);

                    } else {
                        if(result.indexOf(signChangesIntervals[i]) === -1) result.push(signChangesIntervals[i]);
                    }
                }
            } else {
                if(controlPoints.length === this.shapeSpaceDescriptor.curvatureExtremaTotalNumberOfConstraints) {
                    if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities !== undefined) {
                        /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                        if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.length > 0) {
                            if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
                                result.push(signChangesIntervals[i] + 1);
                            } else if(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
                                result.push(signChangesIntervals[i] + 1);
                                this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0), 1);
                            } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                        } else if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);

                    } else {
                        /* JCL general setting where events can slip out of the curve */
                        if(result.indexOf(signChangesIntervals[i] + 1) === -1) result.push(signChangesIntervals[i] + 1);
                    }
                } else if(controlPoints.length === this.shapeSpaceDescriptor.inflectionsTotalNumberOfConstraints) {
                    if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities !== undefined) {
                        /* JCL Conditions to prevent events to slip out of the curve through its right extremity */
                        if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.length > 0) {
                            if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(controlPoints.length - 1) !== -1 && (signChangesIntervals[i] + 1) < (controlPoints.length - 1) && result.indexOf(signChangesIntervals[i] + 1) === -1){
                                result.push(signChangesIntervals[i] + 1);
                            } else if(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0) !== -1 && signChangesIntervals[i] === 0 && result.indexOf(signChangesIntervals[i] + 1) === -1) {
                                result.push(signChangesIntervals[i] + 1);
                                this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(this.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0), 1)
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
}