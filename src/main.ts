import {WebGLUtils} from "./webgl/webgl-utils"
import { CurveSceneView } from "./views/CurveSceneView"
import { CurveModel} from "./models/CurveModel"
import { ClosedCurveModel} from "./models/ClosedCurveModel"
import { wireEventListner as wireEventListener } from "./views/WireEventListner"
import { SimpleCurveModel } from "./models/SimpleCurveModel"
import { CurveModelAlternative01 } from "./models/CurveModelAlternative01"
import { ClosedCurveModelAlternative01 } from "./models/ClosedCurveModelAlternative01"

export function main() {
    let canvas = <HTMLCanvasElement> document.getElementById("webgl")
    let gl = WebGLUtils().setupWebGL(canvas)
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }
    //let curveModel = new SimpleCurveModel()
    let curveModel = new CurveModel()
    //let curveModel = new ClosedCurveModel()
    //let curveModel = new CurveModelAlternative01()
    //let curveModel = new ClosedCurveModelAlternative01()
    let curveSceneView = new CurveSceneView(canvas, gl, curveModel)
    wireEventListener(canvas, curveSceneView)
}

main()