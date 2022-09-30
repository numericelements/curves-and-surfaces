import { ICurve2dModel } from "../models/ICurve2dModel";


export class CurveScene2dController {

    constructor(private curveModel: ICurve2dModel) {

    }

    setControlPointPosition(selectedControlPoint: number, x: number, y: number){
        this.curveModel.setControlPointPosition(selectedControlPoint, x, y);
    }


}

