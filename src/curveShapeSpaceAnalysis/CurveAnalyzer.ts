import { SequenceOfDifferentialEvents } from "../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents"
import { CurveDifferentialEventsExtractor } from "../../src/curveShapeSpaceAnalysis/curveDifferentialEventsExtractor"
import { BSpline_R1_to_R2 } from "../../src/bsplines/BSpline_R1_to_R2"
import { CurveShapeSpaceDescriptor } from "../../src/curveShapeSpaceNavigation/CurveShapeSpaceDesccriptor";
import { ExtremumLocationClassifier,
    INITIAL_INDEX } from "./ExtremumLocationClassifiier";
import { RETURN_ERROR_CODE } from "../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents"

export class CurveAnalyzer {

    private curve: BSpline_R1_to_R2;
    private _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    private curveCurvatureCntrlPolygon: number[];
    private curveCurvatureDerivativeCntrlPolygon: number[];
    private shapeSpaceDescriptor: CurveShapeSpaceDescriptor;

    constructor(curveToAnalyze: BSpline_R1_to_R2, shapeSpaceDescriptor: CurveShapeSpaceDescriptor) {
        this.curve = curveToAnalyze;
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.generateSeqOfDiffEvents();
        this.curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.shapeSpaceDescriptor = shapeSpaceDescriptor;
    }

    get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents {
        return this._sequenceOfDifferentialEvents;
    }

    update(): void {
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.generateSeqOfDiffEvents();
        this.curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
    }

    getGlobalExtremmumOffAxis(controlPoints: number[]): number {
        const localMinima = new ExtremumLocationClassifier(controlPoints);
        const validGlobalMinimum = localMinima.getGlobalMinimum();
        const localMaxima = new ExtremumLocationClassifier(controlPoints);
        const validGlobalMaximum = localMaxima.getGlobalMaximum();
        if(validGlobalMinimum && validGlobalMaximum && Math.abs(localMinima.globalExtremum.value) > Math.abs(localMaxima.globalExtremum.value)) {
            return localMaxima.globalExtremum.index;
        } else if(validGlobalMinimum && validGlobalMaximum) {
            return localMinima.globalExtremum.index;
        } else if(validGlobalMinimum) {
            return localMinima.globalExtremum.index;
        } else if(validGlobalMaximum) {
            return localMaxima.globalExtremum.index;
        } else return INITIAL_INDEX;
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