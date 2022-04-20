import { ActiveLocationControl, CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";

export abstract class CurveCategory {

    protected curveModeler: CurveModeler;
    abstract curveModel: CurveModelInterface;

    constructor(curveModeler: CurveModeler) {
        this.curveModeler = curveModeler;
    }

    setCurveModeler(curveModeler: CurveModeler): void {
        this.curveModeler = curveModeler;
    }

    abstract setCurveCategory(): void;

    abstract setModelerWithOpenPlanarCurve(): void;

    abstract setModelerWithClosedPlanarCurve(): void;

    abstract toggleCurveClamping(): void;

    abstract inputSelectDegree(curveDegree: number):void;

}

export class OpenPlanarCurve extends CurveCategory {

    public curveModel: CurveModel;
    public eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    public eventState: EventStateAtCurveExtremity;
    // public curveEventAtExtremityMayVanish: boolean;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        this.curveModel = new CurveModel();
        this.curveModeler.changeCurveCategory(this);
        this.curveModeler.notifyObservers();
        this.eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        // this.curveEventAtExtremityMayVanish = this.curveModeler.curveSceneController.curveEventAtExtremityMayVanish;
        this.eventState = new EventSlideOutsideCurve(this.eventMgmtAtExtremities);
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

    setModelerWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    setModelerWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessageToConsole();
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                // let controlPoints = this.curveModel.spline.controlPoints;
                // let knots = this.curveModel.spline.knots;
                // for(let i = 0; i < (curveDegree - this.curveModel.spline.degree); i += 1) {
                //     const aSpline = new BSpline_R1_to_R2_degree_Raising(controlPoints, knots);
                //     const newSpline = aSpline.degreeIncrease();
                //     controlPoints = newSpline.controlPoints;
                //     knots = newSpline.knots;
                // }
                // this.curveModel.spline.renewCurve(controlPoints, knots);
                // this.curveModeler.curveShapeSpaceNavigator.curveControl.resetCurve(this.curveModel)
                let spline = this.curveModel.spline;
                spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
                this.curveModel.setSpline(spline);
                if(this.curveModeler.activeLocationControl === ActiveLocationControl.both) {
                    if(this.curveModeler.clampedControlPoints[0] === 0){
                        this.curveModeler.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                    } else this.curveModeler.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                }
                else if(this.curveModeler.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                    this.curveModeler.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                }

                if (this.curveModeler.curveShapeSpaceNavigator.sliding) {
                //     this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
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

    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        this.curveModeler.controlOfCurveClamping = !this.curveModeler.controlOfCurveClamping
        console.log("control of curve clamping: " + this.curveModeler.controlOfCurveClamping)
        if(this.curveModeler.controlOfCurveClamping) {
            /* JCL 2020/09/24 Update the location of the clamped control point */
            // let clampedControlPoint: Vector_2d[] = []
            // if(this.curveModel !== undefined) {
            //     clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
            // } else throw new Error("Unable to clamp a control point. Undefined curve model")
            // this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
            this.curveModeler.clampedControlPoints = []
            this.curveModeler.clampedControlPoints.push(0)
            this.curveModeler.activeLocationControl = ActiveLocationControl.firstControlPoint
            // if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        } else {
            this.curveModeler.activeLocationControl = ActiveLocationControl.none
            this.curveModeler.clampedControlPoints = []
        }
        this.curveModeler.notifyObservers();
    } 

}

export class ClosedPlanarCurve extends CurveCategory {

    public curveModel: ClosedCurveModel;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        this.curveModel = new ClosedCurveModel();
        this.curveModeler.changeCurveCategory(this);
        this.curveModeler.notifyObservers();
    }

    setCurveCategory(): void {
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setModelerWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessageToConsole();
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setModelerWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    toggleCurveClamping() {
        const warning = new WarningLog(this.constructor.name, 'toggleCurveClamping', 'nothing to do there yet.');
        warning.logMessageToConsole();
    }

    inputSelectDegree(curveDegree: number): void {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                let controlPoints = this.curveModel.spline.controlPoints;
                let knots = this.curveModel.spline.knots;
                this.curveModel.spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
                // for(let i = 0; i < (curveDegree - this.curveModel.spline.degree); i += 1) {
                //     const aSpline = new BSpline_R1_to_R2_degree_Raising(controlPoints, knots);
                //     const newSpline = aSpline.degreeIncrease();
                //     controlPoints = newSpline.controlPoints;
                //     knots = newSpline.knots;
                // }
                // this.curveModel.spline.renewCurve(controlPoints, knots);
                // this.curveControl.resetCurve(this.curveModel)

                this.curveModel.notifyObservers()
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }
}