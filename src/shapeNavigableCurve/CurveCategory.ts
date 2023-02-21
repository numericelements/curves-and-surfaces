import { ShapeNavigableCurve } from "./ShapeNavigableCurve";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveDifferentialEventsLocationInterface } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocationsInterface";
import { ClosedCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor";
import { OpenCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence";
import { CurveDifferentialEventsLocations } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocations";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { ClosedCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence";
import { AbstractCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/AbstractCurveDifferentialEventsExtractor";

export abstract class CurveCategory {

    protected _shapeNavigableCurve: ShapeNavigableCurve;
    protected _degreeChange: boolean;
    protected _curveModelChange: boolean;
    protected abstract _curveModel: CurveModelInterface;
    protected abstract _curveModelDifferentialEvents: CurveDifferentialEventsLocationInterface;
    protected abstract _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // abstract curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._degreeChange =  false;
        this._curveModelChange = true;
    }

    setNavigableCurve(shapeNavigableCurve: ShapeNavigableCurve): void {
        this._shapeNavigableCurve = shapeNavigableCurve;
    }

    abstract get curveModelDifferentialEvents(): AbstractCurveDifferentialEventsExtractor;

    abstract set curveModelDifferentialEvents(curveModelDifferentialEvents: AbstractCurveDifferentialEventsExtractor);

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get curveModel(): CurveModelInterface {
        return this._curveModel;
    }

    get degreeChange(): boolean {
        return this._degreeChange;
    }

    get curveModelChange(): boolean {
        return this._curveModelChange;
    }

    get curveModelDifferentialEventsLocations(): CurveDifferentialEventsLocations {
        return this._curveModelDifferentialEventsLocations;
    }

    set curveModelChange(curveModelChange: boolean) {
        this._curveModelChange = curveModelChange;
    }

    set curveModel(curveModel: CurveModelInterface)  {
        this._curveModel = curveModel;
    }

    set curveModelDifferentialEventsLocations(curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations) {
        this._curveModelDifferentialEventsLocations =  curveModelDifferentialEventsLocations;
    }

    set degreeChange(degreeChange: boolean)  {
        this._degreeChange = degreeChange;
    }

    abstract setCurveCategory(): void;

    abstract setNavigableCurveWithOpenPlanarCurve(): void;

    abstract setNavigableCurveWithClosedPlanarCurve(): void;

    abstract inputSelectDegree(curveDegree: number):void;

}

export class OpenPlanarCurve extends CurveCategory {

    protected _curveModel: CurveModel;
    protected _curveModelDifferentialEvents: AbstractCurveDifferentialEventsExtractor;
    protected _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // protected _curveShapeSpaceNavigator: OpenCurveShapeSpaceNavigator;
    // private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    // private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new CurveModel();
        this._curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        // this._curveShapeSpaceNavigator = new OpenCurveShapeSpaceNavigator(this._curveModel, this.shapeNavigableCurve);
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.notifyObservers();
        // this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        // this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventState;
    }

    get curveModelDifferentialEvents(): AbstractCurveDifferentialEventsExtractor {
        return this._curveModelDifferentialEvents;
    }

    // get curveShapeSpaceNavigator(): OpenCurveShapeSpaceNavigator {
    //     return this._curveShapeSpaceNavigator;
    // }

    // get eventMgmtAtExtremities(): EventMgmtAtCurveExtremities {
    //     return this._eventMgmtAtExtremities;
    // }

    // get eventStateAtCrvExtremities(): EventStateAtCurveExtremity {
    //     return this._eventStateAtCrvExtremities;
    // }

    set curveModelDifferentialEvents(curveModelDifferentialEvents: AbstractCurveDifferentialEventsExtractor) {
        this._curveModelDifferentialEvents = curveModelDifferentialEvents;
    }

    setCurveCategory(): void {
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    }

    setNavigableCurveWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    setNavigableCurveWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessageToConsole();
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    }

    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let spline = this.curveModel.spline;
                while(spline.degree !== curveDegree) {
                    let tempSpline = spline.degreeIncrement();
                    spline = tempSpline.clone();
                }
                this.curveModel.setSpline(spline);
            }
            this.curveModel.notifyObservers();
            this._shapeNavigableCurve.notifyObservers();
            this._degreeChange = false;
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

}

export class ClosedPlanarCurve extends CurveCategory {

    protected _curveModel: ClosedCurveModel;
    protected _curveModelDifferentialEvents: AbstractCurveDifferentialEventsExtractor;
    protected _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // protected _curveShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new ClosedCurveModel();
        this._curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        // this._curveShapeSpaceNavigator = new ClosedCurveShapeSpaceNavigator(this._curveModel, this._shapeNavigableCurve);
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.notifyObservers();
    }

    get curveModelDifferentialEvents(): AbstractCurveDifferentialEventsExtractor {
        return this._curveModelDifferentialEvents;
    }

    set curveModelDifferentialEvents(curveModelDifferentialEvents: AbstractCurveDifferentialEventsExtractor) {
        this._curveModelDifferentialEvents = curveModelDifferentialEvents;
    }

    // get curveShapeSpaceNavigator(): ClosedCurveShapeSpaceNavigator {
    //     return this._curveShapeSpaceNavigator;
    // }

    setCurveCategory(): void {
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    }

    setNavigableCurveWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessageToConsole();
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    }

    setNavigableCurveWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let spline = this.curveModel.spline;
                // this.curveModel.spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
                while(spline.degree !== curveDegree) {
                    let tempSpline = spline.degreeIncrement();
                    spline = tempSpline.clone();
                }
            }
            this.curveModel.notifyObservers();
            this._shapeNavigableCurve.notifyObservers();
            this._degreeChange = false;
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }
}