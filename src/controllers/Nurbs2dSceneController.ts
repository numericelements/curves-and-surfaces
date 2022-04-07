import { NurbsModel2d } from "../models/NurbsModel2d";


export class Nurbs2dSceneController {

    constructor(private curveModel: NurbsModel2d) {

    }

    setControlPointPosition(selectedControlPoint: number, x: number, y: number){
        this.curveModel.setControlPointPositionXY(selectedControlPoint, x, y);
    }


}

