import { CurveModelInterface } from "../models/CurveModelINterface";


export class CurveSceneController {

    constructor(private curveModel: CurveModelInterface) {

    }

    setControlPointPosition(selectedControlPoint: number, x: number, y: number){
        this.curveModel.setControlPointPosition(selectedControlPoint, x, y);
    }


}

