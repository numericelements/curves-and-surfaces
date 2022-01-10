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
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

export class CurveAnalyzer {

    private curve: BSpline_R1_to_R2;
    private _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    private _curveCurvatureCntrlPolygon: number[];
    private _curvatureSignChanges: number[];
    private globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    private _curvatureCrtlPtsClosestToZero: number[];
    private _curveCurvatureDerivativeCntrlPolygon: number[];
    private _curvatureDerivativeSignChanges:  number[];
    private globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    private _curvatureDerivCrtlPtsClosestToZero: number[];
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private navigationState: NavigationState;
    private curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    private _slidingEventsAtExtremities: SlidingEventsAtExtremities;

    constructor(curveToAnalyze: BSpline_R1_to_R2, curveShapeSpaceNavigator: CurveShapeSpaceNavigator, slidingEventsAtExtremities: SlidingEventsAtExtremities) {
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this.curve = curveToAnalyze;
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        this.navigationState = curveShapeSpaceNavigator.navigationState;
        this._shapeSpaceDescriptor = curveShapeSpaceNavigator.shapeSpaceDescriptor;
        this._shapeSpaceDiffEventsConfigurator = curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator;
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curvatureCrtlPtsClosestToZero = [];
        this._curveCurvatureCntrlPolygon = [];
        this._curvatureSignChanges = [];
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        if(this.shapeSpaceDiffEventsConfigurator) {
            this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureCntrlPolygon);
            this._curvatureSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureCntrlPolygon);
            this.computeCurvatureCPClosestToZero();
        } else {
            warning = new WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessageToConsole();
        }
        this._curvatureDerivCrtlPtsClosestToZero = [];
        this._curveCurvatureDerivativeCntrlPolygon = [];
        this._curvatureDerivativeSignChanges = [];
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
        if(this.shapeSpaceDiffEventsConfigurator) {
            this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureDerivativeCntrlPolygon);
            this._curvatureDerivativeSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureDerivativeCntrlPolygon);
            this.computeCurvatureDerivCPClosestToZero();
        } else {
            warning = new WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature deriv control polygon.');
            warning.logMessageToConsole();
        }
    }

    get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents {
        return this._sequenceOfDifferentialEvents;
    }

    get curvatureSignChanges(): number[] {
        return this._curvatureSignChanges;
    }

    get curveCurvatureCntrlPolygon(): number[] {
        return this._curveCurvatureCntrlPolygon;
    }

    get curvatureCrtlPtsClosestToZero(): number[] {
        return this._curvatureCrtlPtsClosestToZero;
    }

    get curvatureDerivativeSignChanges(): number[] {
        return this._curvatureDerivativeSignChanges;
    }

    get curveCurvatureDerivativeCntrlPolygon(): number[] {
        return this._curveCurvatureDerivativeCntrlPolygon;
    }

    get curvatureDerivCrtlPtsClosestToZero(): number[] {
        return this._curvatureDerivCrtlPtsClosestToZero;
    }

    get shapeSpaceDiffEventsConfigurator(): ShapeSpaceDiffEventsConfigurator {
        return this._shapeSpaceDiffEventsConfigurator;
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    get slidingEventsAtExtremities(): SlidingEventsAtExtremities {
        return this._slidingEventsAtExtremities;
    }

    set slidingEventsAtExtremities(slidingEventsAtExtremities: SlidingEventsAtExtremities) {
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    }

    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }

    setStrategyForSlidingEventsAtExtremitities(slidingEventsAtExtremities: SlidingEventsAtExtremities): void {
         this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    }

    computeCurvatureCPClosestToZero(): void {
        this._slidingEventsAtExtremities.getCurvatureCrtlPtsClosestToZero(this);
    }

    computeCurvatureDerivCPClosestToZero(): void {
        this._slidingEventsAtExtremities.getCurvatureDerivCrtlPtsClosestToZero(this);
    }

    update(): void {
        this.curve = this.curveShapeSpaceNavigator.currentCurve;
        const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
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

}
