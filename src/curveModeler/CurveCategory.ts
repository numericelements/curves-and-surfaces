import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ClosedCurveModel2D, OpenCurveModel2D } from "../models/CurveModels2D";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";

export abstract class CurveCategory {

    protected curveModeler: CurveModeler;

    constructor(curveModeler: CurveModeler) {
        this.curveModeler = curveModeler;
    }

    setCurveModeler(curveModeler: CurveModeler): void {
        this.curveModeler = curveModeler;
    }

    abstract setCurveCategory(): void;

    abstract setModelerWithOpenPlanarCurve(): void;

    abstract setModelerWithClosedPlanarCurve(): void;

}

export class OpenPlanarCurve extends CurveCategory {

    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: OpenCurveModel2D;
    public eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    public eventState: EventStateAtCurveExtremity;
    public curveEventAtExtremityMayVanish: boolean;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new OpenCurveModel2D();
        this.eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        this.curveEventAtExtremityMayVanish = this.curveModeler.curveSceneController.curveEventAtExtremityMayVanish;
        this.eventState = new EventSlideOutsideCurve(this.eventMgmtAtExtremities);
        this.curveShapeSpaceNavigator = this.curveModeler.curveShapeSpaceNavigator;
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

    setModelerWithOpenPlanarCurve(): void {
        let warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    setModelerWithClosedPlanarCurve(): void {
        let warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessageToConsole();
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

}

export class ClosedPlanarCurve extends CurveCategory {

    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: ClosedCurveModel2D;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new ClosedCurveModel2D();
        //this.curveModel = new ClosedPlanarCurve(this.curveModeler);

        this.curveShapeSpaceNavigator = this.curveModeler.curveShapeSpaceNavigator;
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setModelerWithOpenPlanarCurve(): void {
        let warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessageToConsole();
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setModelerWithClosedPlanarCurve(): void {
        let warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }
}