import { RationalCurveModel2d } from "../models/RationalCurveModel2d";


export class RationalCurveScene2dController {

    constructor(private curveModel: RationalCurveModel2d) {

    }

    setControlPointPosition(selectedControlPoint: number, x: number, y: number){
        this.curveModel.setControlPointPositionXY(selectedControlPoint, x, y);
    }


}

