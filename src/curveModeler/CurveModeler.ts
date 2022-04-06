import { CurveCategory, OpenPlanarCurve } from "../curveModeler/CurveCategory";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

/* JCL 2020/09/23 Add controls to monitor the location of the curve with respect to its rigid body sliding behavior */
export enum ActiveLocationControl {firstControlPoint, lastControlPoint, both, none, stopDeforming}

export class CurveModeler{
    private _curveCategory: CurveCategory;
    private _controlOfCurveClamping: boolean;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _clampedControlPoints: number[] = []

    public activeLocationControl: ActiveLocationControl

    constructor() {
        this._curveCategory = new OpenPlanarCurve(this);
        this._controlOfCurveClamping = true;
        this.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this.clampedControlPoints.push(0);
        // JCL CurveShapeSpaceNavigator context uses parameters of CurveModeler context
        // JCL To ensure its correct initialization, it must be called last to ensure a consistent
        // JCL initialization of each context.
        this._curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this);
    }

    changeCurveCategory(category: CurveCategory): void {
        this._curveCategory = category;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get curveCategory(): CurveCategory {
        return this._curveCategory;
    }

    get controlOfCurveClamping(): boolean {
        return this._controlOfCurveClamping;
    }

    get clampedControlPoints(): number[] {
        return this._clampedControlPoints;
    }

    set clampedControlPoints(clampedControlPoints: number[]) {
        this._clampedControlPoints = clampedControlPoints;
    }

    set controlOfCurveClamping(controlOfCurveClamping: boolean) {
        this._controlOfCurveClamping = controlOfCurveClamping;
    }

    inputSelectCurveCategory(crvCategoryID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectCurveCategoryProcess", crvCategoryID.toString());
        warning.logMessageToConsole();

        switch(crvCategoryID) {
            case 0: {
                this.curveCategory.setModelerWithOpenPlanarCurve();
                break;
            }
            case 1: {
                this.curveCategory.setModelerWithClosedPlanarCurve();
                break;
            }
            default: {
                let error = new ErrorLog(this.constructor.name, "inputSelectCurveCategoryProcess", "no available curve category.");
                error.logMessageToConsole();
                break;
            }
        }
        // JCL for consistency with the curveModeler context
        // this._curveCategory = this.curveModeler.curveCategory;
        // JCL for consistency of the curveShapeSpaceNavigator context wrt curveModeler one
        this.curveShapeSpaceNavigator.curveCategory = this._curveCategory;
    }

}
