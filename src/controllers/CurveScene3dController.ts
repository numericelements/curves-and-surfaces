import { CurveModel3d } from "../models/CurveModel3d";


export class CurveScene3dController {

    constructor(private curveModel3d: CurveModel3d) {

    }

    setControlPointPosition(selectedControlPoint: number, x: number, y: number, z: number){
        this.curveModel3d.setControlPointPosition(selectedControlPoint, x, y, z);
    }


}

