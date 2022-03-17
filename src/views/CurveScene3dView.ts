import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { CurveModel3d } from "../models/CurveModel3d";
import { fromEuler, multiply_quats } from "../webgl/quat";
import { ControlPoints3dShaders } from "./ControlPoints3dShaders";
import { ControlPoints3dShadowShaders } from "./ControlPoints3dShadowShaders";
import { ControlPoints3dView } from "./ControlPoints3dView";
import { ControlPoints3dShadowView } from "./ControlPoints3dShadowView";
import { ControlPolygon3dShaders } from "./ControlPolygon3dShaders";
import { ControlPolygon3dView } from "./ControlPolygon3dView";
import { ControlPolygon3dShadowShaders } from "./ControlPolygon3dShadowShaders";
import { ControlPolygon3dShadowView } from "./ControlPolygon3dShadowView";

enum STATE {NONE, ROTATE}

export class CurveScene3dView {

    private curveModel: CurveModel3d
    public lightDirection = [0, 1, 1]
    private previousMousePosition = {x:0, y:0}
    private state: STATE = STATE.NONE

    private controlPoints3dShaders: ControlPoints3dShaders
    private controlPoints3dView: ControlPoints3dView
    private controlPoints3dShadowShaders: ControlPoints3dShadowShaders
    private controlPoints3dShadowView: ControlPoints3dShadowView
    private controlPolygon3dShaders: ControlPolygon3dShaders
    private controlPolygon3dView: ControlPolygon3dView

    private controlPolygon3dShadowShaders: ControlPolygon3dShadowShaders
    private controlPolygon3dShadowView: ControlPolygon3dShadowView

    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, curveModel: CurveModel3d ) {
        this.curveModel = curveModel
        this.controlPoints3dShaders = new ControlPoints3dShaders(this.gl)
        this.controlPoints3dView = new ControlPoints3dView(curveModel.spline, this.controlPoints3dShaders, this.lightDirection)
        this.controlPoints3dShadowShaders = new ControlPoints3dShadowShaders(this.gl)
        this.controlPoints3dShadowView = new ControlPoints3dShadowView(curveModel.spline, this.controlPoints3dShadowShaders, this.lightDirection)
        this.controlPolygon3dShaders = new ControlPolygon3dShaders(this.gl)
        this.controlPolygon3dView = new ControlPolygon3dView(curveModel.spline, this.controlPolygon3dShaders, this.lightDirection, false)
        this.controlPolygon3dShadowShaders = new ControlPolygon3dShadowShaders(this.gl)
        this.controlPolygon3dShadowView = new ControlPolygon3dShadowView(curveModel.spline, this.controlPolygon3dShadowShaders, this.lightDirection, false)
    }

    renderFrame() {


        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        this.gl.clearColor(0.2, 0.2, 0.2, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        this.controlPoints3dView.renderFrame()
        this.controlPoints3dShadowView.renderFrame()
        this.controlPolygon3dView.renderFrame()
        this.controlPolygon3dShadowView.renderFrame()
    }

    mousedown(event: MouseEvent) {

        this.previousMousePosition = this.mouse_get_NormalizedDeviceCoordinates(event)

        if (event.button === 0) {
            this.state = STATE.ROTATE
        }

        //console.log(event.clientX)

        const ndc = this.mouse_get_NormalizedDeviceCoordinates(event)


    }

    mousemove(event: MouseEvent) {


        const currentMousePosition = this.mouse_get_NormalizedDeviceCoordinates(event)


        const deltaMove = {
            x: currentMousePosition.x - this.previousMousePosition.x,
            y: currentMousePosition.y - this.previousMousePosition.y
        }

        this.previousMousePosition = this.mouse_get_NormalizedDeviceCoordinates(event)


        if (this.state === STATE.ROTATE) {
            const deltaRotationQuaternion = fromEuler(-deltaMove.y*500, deltaMove.x*500, 0)
            this.controlPoints3dView.orientation = multiply_quats(deltaRotationQuaternion, this.controlPoints3dView.orientation)
            this.controlPoints3dShadowView.orientation = multiply_quats(deltaRotationQuaternion, this.controlPoints3dShadowView.orientation)
            this.controlPolygon3dView.orientation = multiply_quats(deltaRotationQuaternion, this.controlPolygon3dView.orientation)
            this.controlPolygon3dShadowView.orientation = multiply_quats(deltaRotationQuaternion, this.controlPolygon3dShadowView.orientation)
        }
    }

    mouseup(event: MouseEvent) {
        this.state = STATE.NONE
    }

    mouse_get_NormalizedDeviceCoordinates(event: MouseEvent) {
        /*
        const canvas = this.gl.canvas
        const rect  = canvas.getBoundingClientRect()
        const ev = event
        const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2)
        const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2)
        return {x: x, y: y}
        */

       const factor = Math.floor(window.devicePixelRatio)

        const canvas = this.gl.canvas as HTMLCanvasElement
        const rect  = canvas.getBoundingClientRect()
        const ev = event
        const x = ((ev.clientX - rect.left) - canvas.width/ 2 / factor) / (canvas.width / 2 / factor)
        const y = (canvas.height / 2 / factor - (ev.clientY - rect.top)) / (canvas.height / 2 / factor)
        return {x: x, y: y}
    }


}