import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ClosedCurveModel2D, OpenCurveModel2D } from "../models/CurveModels2D";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";
import { BSpline_R1_to_R2_degree_Raising } from "../bsplines/BSpline_R1_to_R2_degree_Raising";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";

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

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: OpenCurveModel2D;
    public eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    public eventState: EventStateAtCurveExtremity;
    // public curveEventAtExtremityMayVanish: boolean;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new OpenCurveModel2D();
        this.eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        // this.curveEventAtExtremityMayVanish = this.curveModeler.curveSceneController.curveEventAtExtremityMayVanish;
        this.eventState = new EventSlideOutsideCurve(this.eventMgmtAtExtremities);
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

    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree: number) {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                let controlPoints = this.curveModel.spline.controlPoints;
                let knots = this.curveModel.spline.knots;
                for(let i = 0; i < (curveDegree - this.curveModel.spline.degree); i += 1) {
                    const aSpline = new BSpline_R1_to_R2_degree_Raising(controlPoints, knots);
                    const newSpline = aSpline.degreeIncrease();
                    controlPoints = newSpline.controlPoints;
                    knots = newSpline.knots;
                }
                this.curveModel.spline.renewCurve(controlPoints, knots);
                // this.curveControl.resetCurve(this.curveModel)

                // if(this.activeLocationControl === ActiveLocationControl.both) {
                //     if(this.clampedControlPoints[0] === 0){
                //         this.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                //     } else this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                // }
                // else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                //     this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                // }

                // if (this.sliding) {
                //     this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                // }
                // else {
                //     this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                // }
                this.curveModel.notifyObservers()
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

}

export class ClosedPlanarCurve extends CurveCategory {

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: ClosedCurveModel2D;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new ClosedCurveModel2D();
        //this.curveModel = new ClosedPlanarCurve(this.curveModeler);
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