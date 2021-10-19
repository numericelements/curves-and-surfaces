import { CurveCategory, OpenPlanarCurve } from "../curveModeler/CurveCategory";
import { CurveModels2D } from "../models/CurveModels2D";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

enum CurveType { PLANAR_OPEN, PLANAR_CLOSED }

export class CurveModeler{
    public curveType: CurveType;
    public curveCategory: CurveCategory;
    public curveSceneController: CurveSceneController;
    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveSceneController: CurveSceneController) {
        this.curveSceneController = curveSceneController;
        this.curveCategory = new OpenPlanarCurve(this);
        this.curveType = CurveType.PLANAR_OPEN;
        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this);

    }

    changeCurveCategory(category: CurveCategory): void {
        this.curveCategory = category;
        this.curveCategory.setCurveModeler(this);
    }



}
