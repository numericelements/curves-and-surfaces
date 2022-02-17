import { CurveCategory, OpenPlanarCurve } from "../curveModeler/CurveCategory";
import { CurveModels2D } from "../models/CurveModels2D";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

enum CurveType { PLANAR_OPEN, PLANAR_CLOSED }

export class CurveModeler{
    public curveType: CurveType;
    private _curveCategory: CurveCategory;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor() {
        this._curveCategory = new OpenPlanarCurve(this);
        this.curveType = CurveType.PLANAR_OPEN;
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

    inputSelectCurveCategoryProcess(crvCategoryID: number) {
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
