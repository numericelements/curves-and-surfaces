import { SequenceOfDifferentialEvents } from "../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents"
import { OpenCurveDifferentialEventsExtractor } from "./OpenCurveDifferentialEventsExtractor"
import { BSplineR1toR2 } from "../../src/newBsplines/BSplineR1toR2"
import { CurveShapeSpaceDescriptor } from "../curveShapeSpaceNavigation/CurveShapeSpaceDescriptor";
import { ExtremumLocationClassifier,
    ExtremumLocation,
    INITIAL_INDEX } from "./ExtremumLocationClassifiier";
import { NavigationState } from "../curveShapeSpaceNavigation/NavigationState";
import { RETURN_ERROR_CODE } from "../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveDifferentialEventsSequenceExtractorInterface } from "./CurveDifferentialEventsSequenceExtractorInterface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { ClosedCurveDifferentialEventsExtractor } from "./ClosedCurveDifferentialEventsExtractor";
import { OpenCurveDifferentialEventsExtractorWithoutSequence } from "./OpenCurveDifferentialEventsExtractorWithoutSequence";
import { ClosedCurveDifferentialEventsExtractorWithoutSequence } from "./ClosedCurveDifferentialEventsExtractorWithoutSequence";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { NavigationCurveModelInterface } from "../curveShapeSpaceNavigation/NavigationCurveModelInterface";
import { CurveControlState } from "../controllers/CurveControlState";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";

export abstract class AbstractCurveAnalyzer {

    protected curve: BSplineR1toR2Interface;
    protected navigationCurveModel: NavigationCurveModel;
    protected _curvatureSignChanges: number[];
    protected _curveCurvatureCntrlPolygon: number[];
    protected _curveCurvatureDerivativeCntrlPolygon: number[];
    protected _curvatureCrtlPtsClosestToZero: number[];
    protected _curvatureDerivCrtlPtsClosestToZero: number[];
    protected _curvatureDerivativeSignChanges:  number[];
    protected abstract readonly _curvatureNumerator: BSplineR1toR1Interface;
    protected abstract readonly _curvatureDerivativeNumerator: BSplineR1toR1Interface;

    constructor(curveToAnalyze: BSplineR1toR2Interface, navigationCurveModel: NavigationCurveModel) {
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._curveCurvatureCntrlPolygon = [];
        this._curvatureCrtlPtsClosestToZero = [];
        this._curvatureSignChanges = [];
        this._curvatureDerivativeSignChanges = [];
        this._curveCurvatureDerivativeCntrlPolygon = [];
        this._curvatureDerivCrtlPtsClosestToZero = [];
    }

    abstract get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents;

    abstract get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor;

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

    get curvatureNumerator(): BSplineR1toR1Interface {
        return this._curvatureNumerator;
    }

    get curvatureDerivativeNumerator(): BSplineR1toR1Interface {
        return this._curvatureDerivativeNumerator;
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

    abstract update(): void;

    updateCurrent(): void {
        this.curve = this.navigationCurveModel.currentCurve;
        this.update();
    }

    updateOptimized(): void {
        this.curve = this.navigationCurveModel.optimizedCurve;
        this.update();
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

export class OpenCurveAnalyzer extends AbstractCurveAnalyzer {

    protected curve: BSplineR1toR2;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    protected globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private navigationState: NavigationState;
    protected navigationCurveModel: OpenCurveShapeSpaceNavigator;
    private _curveControlState: CurveControlState;
    protected _slidingEventsAtExtremities: SlidingEventsAtExtremities;
    protected readonly _curvatureNumerator: BSplineR1toR1Interface;
    protected readonly _curvatureDerivativeNumerator: BSplineR1toR1Interface;

    constructor(curveToAnalyze: BSplineR1toR2, navigationCurveModel: OpenCurveShapeSpaceNavigator, slidingEventsAtExtremities: SlidingEventsAtExtremities) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curvatureNumerator = new BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        if(this._curveControlState) {
            this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
            this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureCntrlPolygon);
            this._curvatureSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureCntrlPolygon);
            this.computeCurvatureCPClosestToZero();
        } else {
            warning = new WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessageToConsole();
        }
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
        if(this._curveControlState) {
            this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
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

    get curveControlState(): CurveControlState {
        return this._curveControlState;
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

    setStrategyForSlidingEventsAtExtremitities(slidingEventsAtExtremities: SlidingEventsAtExtremities): void {
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    }

    computeCurvatureCPClosestToZero(): void {
        this._slidingEventsAtExtremities.getCurvatureCrtlPtsClosestToZero(this);
    }

    computeCurvatureDerivCPClosestToZero(): void {
        this._slidingEventsAtExtremities.getCurvatureDerivCrtlPtsClosestToZero(this);
    }

    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }

    update(): void {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
    }

}

export class OPenCurveDummyAnalyzer extends AbstractCurveAnalyzer {

    protected curve: BSplineR1toR2;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected _slidingEventsAtExtremities: SlidingEventsAtExtremities;
    protected globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    protected globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    protected navigationCurveModel: OpenCurveShapeSpaceNavigator;
    private navigationState: NavigationState;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private _curveControlState: CurveControlState;
    protected readonly _curvatureNumerator: BSplineR1toR1Interface;
    protected readonly _curvatureDerivativeNumerator: BSplineR1toR1Interface;

    constructor(curveToAnalyze: BSplineR1toR2, navigationCurveModel: OpenCurveShapeSpaceNavigator, slidingEventsAtExtremities: SlidingEventsAtExtremities) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curvatureNumerator = new BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;

        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
    }

    get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents {
        return this._sequenceOfDifferentialEvents;
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    get curveControlState(): CurveControlState {
        return this._curveControlState;
    }

    computeCurvatureCPClosestToZero(): void {
    }

    computeCurvatureDerivCPClosestToZero(): void {
    }

    update(): void {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
    }
}

export class ClosedCurveAnalyzer extends AbstractCurveAnalyzer {

    protected curve: PeriodicBSplineR1toR2;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    protected globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private navigationState: NavigationState;
    protected navigationCurveModel: ClosedCurveShapeSpaceNavigator;
    private _curveControlState: CurveControlState;
    protected readonly _curvatureNumerator: BSplineR1toR1Interface;
    protected readonly _curvatureDerivativeNumerator: BSplineR1toR1Interface;

    constructor(curveToAnalyze: PeriodicBSplineR1toR2, navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curvatureNumerator = new BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};
        if(this._curveControlState) {
            this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureCntrlPolygon);
            this._curvatureSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureCntrlPolygon);
            this.computeCurvatureCPClosestToZero();
        } else {
            warning = new WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessageToConsole();
        }
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
        if(this._curveControlState) {
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

    get curveControlState(): CurveControlState {
        return this._curveControlState;
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }

    computeCurvatureCPClosestToZero(): void {
    }

    computeCurvatureDerivCPClosestToZero(): void {
    }

    update(): void {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
    }

}

export class ClosedCurveDummyAnalyzer extends AbstractCurveAnalyzer {

    protected curve: PeriodicBSplineR1toR2;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected navigationCurveModel: ClosedCurveShapeSpaceNavigator;
    protected globalExtremumOffAxisCurvaturePoly: ExtremumLocation;
    protected globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;
    private navigationState: NavigationState;
    private _shapeSpaceDescriptor: CurveShapeSpaceDescriptor;
    private _curveControlState: CurveControlState;
    protected readonly _curvatureNumerator: BSplineR1toR1Interface;
    protected readonly _curvatureDerivativeNumerator: BSplineR1toR1Interface;

    constructor(curveToAnalyze: PeriodicBSplineR1toR2, navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curvatureNumerator = new BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        this.globalExtremumOffAxisCurvaturePoly = {index: INITIAL_INDEX, value: 0.0};

        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvatureDerivPoly = {index: INITIAL_INDEX, value: 0.0};
    }

    get sequenceOfDifferentialEvents(): SequenceOfDifferentialEvents {
        return this._sequenceOfDifferentialEvents;
    }

    get curveControlState(): CurveControlState {
        return this._curveControlState;
    }

    get shapeSpaceDescriptor(): CurveShapeSpaceDescriptor {
        return this._shapeSpaceDescriptor;
    }

    computeCurvatureCPClosestToZero(): void {
    }

    computeCurvatureDerivCPClosestToZero(): void {
    }

    update(): void {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
    }
}