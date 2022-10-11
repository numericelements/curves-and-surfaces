import { ActiveLocationControl, ShapeNavigableCurve } from "./ShapeNavigableCurve";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity, EventStayInsideCurve, NoEventToManageForClosedCurve } from "./EventStateAtCurveExtremity";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveDifferentialEventsLocationInterface } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocationsInterface";
import { ClosedCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor";
import { OpenCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence";
import { CurveDifferentialEventsLocations } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocations";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { CurveConstraintClampedFirstControlPoint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { ClosedCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence";

export abstract class CurveCategory {

    protected _shapeNavigableCurve: ShapeNavigableCurve;
    protected _degreeChange: boolean;
    protected abstract _curveModelChange: boolean;
    protected abstract _curveModel: CurveModelInterface;
    protected abstract _curveModelDifferentialEvents: CurveDifferentialEventsLocationInterface;
    protected abstract _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // abstract curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._degreeChange =  false;
    }

    setNavigableCurve(shapeNavigableCurve: ShapeNavigableCurve): void {
        this._shapeNavigableCurve = shapeNavigableCurve;
    }

    abstract get curveModelDifferentialEvents(): CurveDifferentialEventsLocationInterface;

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

    abstract setCurveCategory(): void;

    abstract setNavigableCurveWithOpenPlanarCurve(): void;

    abstract setNavigableCurveWithClosedPlanarCurve(): void;

    abstract inputSelectDegree(curveDegree: number):void;

}

export class OpenPlanarCurve extends CurveCategory {

    protected _curveModel: CurveModel;
    protected _curveModelDifferentialEvents: OpenCurveDifferentialEventsExtractorWithoutSequence;
    protected _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // protected _curveShapeSpaceNavigator: OpenCurveShapeSpaceNavigator;
    protected _curveModelChange: boolean;
    // private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    // private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new CurveModel();
        this._curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        // this._curveShapeSpaceNavigator = new OpenCurveShapeSpaceNavigator(this._curveModel, this.shapeNavigableCurve);
        this._curveModelChange = true;
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.notifyObservers();
        // this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        // this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventState;
    }

    get curveModelDifferentialEvents(): OpenCurveDifferentialEventsExtractorWithoutSequence {
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

    // set eventStateAtCrvExtremities(state: EventStateAtCurveExtremity) {
    //     this._eventStateAtCrvExtremities = state;
    // }

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
        this._curveModelChange = false;
    }

    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let spline = this.curveModel.spline;
                spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
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
    protected _curveModelDifferentialEvents: ClosedCurveDifferentialEventsExtractorWithoutSequence;
    protected _curveModelDifferentialEventsLocations: CurveDifferentialEventsLocations;
    // protected _curveShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator;
    protected _curveModelChange: boolean;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new ClosedCurveModel();
        this._curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        // this._curveShapeSpaceNavigator = new ClosedCurveShapeSpaceNavigator(this._curveModel, this._shapeNavigableCurve);
        this._curveModelChange = true;
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.changeMngmtOfEventAtExtremity(new NoEventToManageForClosedCurve(this._shapeNavigableCurve.eventMgmtAtExtremities));
        this._shapeNavigableCurve.notifyObservers();
    }

    get curveModelDifferentialEvents(): ClosedCurveDifferentialEventsExtractorWithoutSequence {
        return this._curveModelDifferentialEvents;
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
        this._curveModelChange = false;
    }

    setNavigableCurveWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let controlPoints = this.curveModel.spline.controlPoints;
                let knots = this.curveModel.spline.knots;
                this.curveModel.spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
            }
            this.curveModel.notifyObservers();
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }
}