import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { OpenCurveModel2D } from "../models/CurveModels2D";
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

        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

}

export class ClosedPlanarCurve extends CurveCategory {

    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: ClosedPlanarCurve;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new ClosedPlanarCurve(this.curveModeler);

        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

}