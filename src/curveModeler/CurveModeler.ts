import { CurveCategory, OpenPlanarCurve } from "../curveModeler/CurveCategory";
import { CurveModels2D } from "../models/CurveModels2D";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

enum CurveType { PLANAR_OPEN, PLANAR_CLOSED }

export class CurveModeler{
    public curveType: CurveType;
    private _curveCategory: CurveCategory;
    public curveSceneController: CurveSceneController;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveSceneController: CurveSceneController) {
        this.curveSceneController = curveSceneController;
        this._curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this);
        this._curveCategory = new OpenPlanarCurve(this);
        this._curveShapeSpaceNavigator.curveCategory = this._curveCategory;
        this.curveType = CurveType.PLANAR_OPEN;
    }

    changeCurveCategory(category: CurveCategory): void {
        this._curveCategory = category;
        //this._curveCategory.setCurveModeler(this);
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get curveCategory(): CurveCategory {
        return this._curveCategory;
    }

}
