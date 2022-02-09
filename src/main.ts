import { WebGLUtils } from "./webgl/webgl-utils"
import { CurveSceneView } from "./views/CurveSceneView"
import { CurveModel } from "./models/CurveModel"
import { wireEventListner as wireEventListener } from "./views/WireEventListner"
import { AppCurvesAndSurfaces } from "./webComponents/AppCurvesAndSurfaces"


export function main() {
    let canvas = <HTMLCanvasElement> document.getElementById("webgl")
    let gl = WebGLUtils().setupWebGL(canvas)
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }
    let curveModel = new CurveModel()
    let curveSceneView = new CurveSceneView(canvas, gl, curveModel)
    window.customElements.define('app-curves-and-surfaces', AppCurvesAndSurfaces)
    wireEventListener(canvas, curveSceneView)

}

main()