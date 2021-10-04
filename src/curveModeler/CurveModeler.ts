import{ CurveModels2D, OpenPlanarCurve } from "../curveModeler/CurveModels2D";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

enum CurveType { PLANAR_OPEN, PLANAR_CLOSED }

export class CurveModeler{
    public curveType: CurveType;
    public curveCategory: CurveModels2D;
    public curveSceneController: CurveSceneController;
    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveSceneController: CurveSceneController) {
        this.curveSceneController = curveSceneController;
        this.curveCategory = new OpenPlanarCurve(this);
        this.curveType = CurveType.PLANAR_OPEN;
        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this);

    }

    changeCurveCategory(category: CurveModels2D): void {
        this.curveCategory = category;
        this.curveCategory.setCurveModeler(this);
    }



}
