import { ActiveLocationControl, ShapeNavigableCurve } from "./ShapeNavigableCurve";
import { ClosedCurveShapeSpaceNavigator, AbstractCurveShapeSpaceNavigator, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";

export abstract class CurveCategory {

    protected _shapeNavigableCurve: ShapeNavigableCurve;
    abstract curveModel: CurveModelInterface;
    abstract curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
    }

    setNavigableCurve(shapeNavigableCurve: ShapeNavigableCurve): void {
        this._shapeNavigableCurve = shapeNavigableCurve;
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }
    abstract setCurveCategory(): void;

    abstract setNavigableCurveWithOpenPlanarCurve(): void;

    abstract setNavigableCurveWithClosedPlanarCurve(): void;

    abstract toggleCurveClamping(): void;

    abstract inputSelectDegree(curveDegree: number):void;

}

export class OpenPlanarCurve extends CurveCategory {

    public curveModel: CurveModel;
    protected _curveShapeSpaceNavigator: OpenCurveShapeSpaceNavigator;
    public eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    public eventState: EventStateAtCurveExtremity;
    // public curveEventAtExtremityMayVanish: boolean;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this.curveModel = new CurveModel();
        this._curveShapeSpaceNavigator = new OpenCurveShapeSpaceNavigator(this.curveModel, this.shapeNavigableCurve);
        this.shapeNavigableCurve.changeCurveCategory(this);
        this.shapeNavigableCurve.notifyObservers();
        this.eventMgmtAtExtremities = new EventMgmtAtCurveExtremities();
        // this.curveEventAtExtremityMayVanish = this.curveModeler.curveSceneController.curveEventAtExtremityMayVanish;
        this.eventState = new EventSlideOutsideCurve(this.eventMgmtAtExtremities);
    }

    get curveShapeSpaceNavigator(): OpenCurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    setCurveCategory(): void {
        this.shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this.shapeNavigableCurve));
    }

    setNavigableCurveWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    setNavigableCurveWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessageToConsole();
        this.shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this.shapeNavigableCurve));
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
            }
            if(this.shapeNavigableCurve.activeLocationControl === ActiveLocationControl.both) {
                if(this.shapeNavigableCurve.clampedControlPoints[0] === 0){
                    this.shapeNavigableCurve.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                } else this.shapeNavigableCurve.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
            }
            else if(this.shapeNavigableCurve.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                this.shapeNavigableCurve.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
            }

            if (this._curveShapeSpaceNavigator.sliding) {
            //     this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
            // else {
            //     this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            // }
            this.curveModel.notifyObservers()
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        this.shapeNavigableCurve.controlOfCurveClamping = !this.shapeNavigableCurve.controlOfCurveClamping
        console.log("control of curve clamping: " + this.shapeNavigableCurve.controlOfCurveClamping)
        if(this.shapeNavigableCurve.controlOfCurveClamping) {
            /* JCL 2020/09/24 Update the location of the clamped control point */
            // let clampedControlPoint: Vector_2d[] = []
            // if(this.curveModel !== undefined) {
            //     clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
            // } else throw new Error("Unable to clamp a control point. Undefined curve model")
            // this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
            this.shapeNavigableCurve.clampedControlPoints = []
            this.shapeNavigableCurve.clampedControlPoints.push(0)
            this.shapeNavigableCurve.activeLocationControl = ActiveLocationControl.firstControlPoint
            // if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        } else {
            this.shapeNavigableCurve.activeLocationControl = ActiveLocationControl.none
            this.shapeNavigableCurve.clampedControlPoints = []
        }
        this.shapeNavigableCurve.notifyObservers();
    } 

}

export class ClosedPlanarCurve extends CurveCategory {

    public curveModel: ClosedCurveModel;
    protected _curveShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        super(shapeNavigableCurve);
        this.curveModel = new ClosedCurveModel();
        this._curveShapeSpaceNavigator = new ClosedCurveShapeSpaceNavigator(this.curveModel, this.shapeNavigableCurve);
        this.shapeNavigableCurve.changeCurveCategory(this);
        this.shapeNavigableCurve.notifyObservers();
    }

    get curveShapeSpaceNavigator(): ClosedCurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    setCurveCategory(): void {
        this.shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this.shapeNavigableCurve));
    }

    setNavigableCurveWithOpenPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessageToConsole();
        this.shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this.shapeNavigableCurve));
    }

    setNavigableCurveWithClosedPlanarCurve(): void {
        const warning = new WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessageToConsole();
    }

    toggleCurveClamping() {
        this.shapeNavigableCurve.controlOfCurveClamping = !this.shapeNavigableCurve.controlOfCurveClamping;
        console.log("control of curve clamping: " + this.shapeNavigableCurve.controlOfCurveClamping);
        this.shapeNavigableCurve.clampedControlPoints = [];
        this.shapeNavigableCurve.clampedControlPoints.push(0);
        this.shapeNavigableCurve.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this.shapeNavigableCurve.notifyObservers();
        const warning = new WarningLog(this.constructor.name, 'toggleCurveClamping', 'clamp first control point.');
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
            }
            this.curveModel.notifyObservers();
        } else {
            const error = new ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }
}