import { WebGLUtils } from "./webgl/webgl-utils"
import { CurveSceneView } from "./views/CurveSceneView"
import { CurveModel } from "./models/CurveModel"
import { wireEventListener as wireEventListener } from "./views/WireEventListener"
import { AppCurvesAndSurfaces } from "./webComponents/AppCurvesAndSurfaces"
import { CurveScene3dView } from "./views/CurveScene3dView"
import { wire3dEventListener } from "./views/Wire3dEventListener"
import { CopyrightYears } from "./webComponents/CopyrightYears"
import { CurveModel3d } from "./models/CurveModel3d"
import { NurbsModel2d } from "./models/NurbsModel2d"
import { NurbsSceneView } from "./views/NurbsSceneView"
import { nurbsWireEventListener } from "./views/NurbsWireEventListener"
import { AppCurves3d } from "./webComponents/AppCurve3d"



export function main() {
    let canvas2d = <HTMLCanvasElement> document.getElementById("webgl")
    let canvas3d = <HTMLCanvasElement> document.getElementById("webgl2")
    let gl = WebGLUtils().setupWebGL(canvas2d)
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }

    let gl2 = WebGLUtils().setupWebGL(canvas3d)
    if (!gl2) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }

    gl2.enable(gl.DEPTH_TEST)
    
    let curveModel = new CurveModel()
    let nurbsModel2d = new NurbsModel2d
    let curveSceneView = new CurveSceneView(canvas2d, gl, curveModel)
    //let curveSceneView = new NurbsSceneView(canvas2d, gl, nurbsModel2d)
    let curveModel3d = new CurveModel3d()
    let curve3dSceneView = new CurveScene3dView(canvas3d, gl2, curveModel3d)
    curve3dSceneView.renderFrame()
    window.customElements.define('app-curves-and-surfaces', AppCurvesAndSurfaces)
    window.customElements.define('app-curve-3d', AppCurves3d)
    window.customElements.define('copy-right-years', CopyrightYears)
    wireEventListener(canvas2d, curveSceneView)
    //nurbsWireEventListener(canvas2d, curveSceneView)
    wire3dEventListener(canvas3d, curve3dSceneView)
}

main()