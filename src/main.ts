import { WebGLUtils } from "./webgl/webgl-utils"
import { CurveScene2dView } from "./views/CurveScene2dView"
import { Curve2dModel } from "./models/Curve2dModel"
import { wire2dEventListener as wire2dEventListener } from "./views/Wire2dEventListener"
import { AppCurvesAndSurfaces } from "./webComponents/AppCurvesAndSurfaces"
import { CurveScene3dView } from "./views/CurveScene3dView"
import { wire3dEventListener } from "./views/Wire3dEventListener"
import { CopyrightYears } from "./webComponents/CopyrightYears"
import { CurveModel3d } from "./models/CurveModel3d"
import { RationalCurveModel2d } from "./models/RationalCurveModel2d"
import { RationalCurveScene2dView } from "./views/RationalCurveScene2dView"
import { Wire2dEventListenerRationalCurve } from "./views/Wire2dEventListenerRationalCurve"
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
    
    let curveModel = new Curve2dModel()
    let nurbsModel2d = new RationalCurveModel2d
    //let curveSceneView = new CurveSceneView(canvas2d, gl, curveModel)
    let curveSceneView = new RationalCurveScene2dView(canvas2d, gl, nurbsModel2d)
    let curveModel3d = new CurveModel3d()
    let curve3dSceneView = new CurveScene3dView(canvas3d, gl2, curveModel3d)
    curve3dSceneView.renderFrame()
    window.customElements.define('app-curves-and-surfaces', AppCurvesAndSurfaces)
    window.customElements.define('app-curve-3d', AppCurves3d)
    window.customElements.define('copy-right-years', CopyrightYears)
    //wireEventListener(canvas2d, curveSceneView)
    Wire2dEventListenerRationalCurve(canvas2d, curveSceneView)
    wire3dEventListener(canvas3d, curve3dSceneView)
}

main()