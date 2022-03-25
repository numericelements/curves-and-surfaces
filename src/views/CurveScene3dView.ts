import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { CurveModel3d } from "../models/CurveModel3d";
import { fromEuler, multiply_quats } from "../webgl/quat";
import { ControlPoints3dView } from "./ControlPoints3dView";
import { ControlPoints3dShadowView } from "./ControlPoints3dShadowView";
import { ControlPolygon3dView } from "./ControlPolygon3dView";
import { ControlPolygon3dShadowView } from "./ControlPolygon3dShadowView";
import { Object3dShaders } from "./Object3dShaders";
import { Curve3dView } from "./Curve3dView";
import { Curve3dShadowView } from "./Curve3dShadowView";
import { Object3dShadowShaders } from "./Object3dShadowShaders";
import { CurveScene3dController } from "../controllers/CurveScene3dController";
import { linePlaneIntersection } from "../mathVector/Vector3d";

enum STATE {NONE, ROTATE}

export class CurveScene3dView {

    private selectedControlPoint: number | null = null
    private dragging: boolean = false
    private curve3dModel: CurveModel3d
    public lightDirection = [0, 1, 1]
    private previousMousePosition = {x:0, y:0}
    private state: STATE = STATE.NONE

    private object3dShaders: Object3dShaders
    private object3dShadowShaders: Object3dShadowShaders
    private controlPoints3dView: ControlPoints3dView
    private controlPoints3dShadowView: ControlPoints3dShadowView
    private controlPolygon3dView: ControlPolygon3dView
    private controlPolygon3dShadowView: ControlPolygon3dShadowView

    private curve3dView: Curve3dView
    private curve3dShadowView: Curve3dShadowView

    private curveScene3dControler: CurveScene3dController


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, curve3dModel: CurveModel3d ) {
        this.curve3dModel = curve3dModel
        this.object3dShaders = new Object3dShaders(this.gl)
        this.object3dShadowShaders = new Object3dShadowShaders(this.gl)
        this.controlPoints3dView = new ControlPoints3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection)
        this.controlPoints3dShadowView = new ControlPoints3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection)
        this.controlPolygon3dView = new ControlPolygon3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection, false)
        this.controlPolygon3dShadowView = new ControlPolygon3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection, false)
        this.curve3dView = new Curve3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection, false)
        this.curve3dShadowView = new Curve3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection, false)

        this.curve3dModel.registerObserver(this.controlPoints3dView)
        this.curve3dModel.registerObserver(this.controlPolygon3dView)
        this.curve3dModel.registerObserver(this.curve3dView)

        this.curveScene3dControler = new CurveScene3dController(curve3dModel)
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
        this.curve3dView.renderFrame()
        this.curve3dShadowView.renderFrame()
    }

    mousedown(event: MouseEvent, deltaSquared: number = 0.01) {

        const ndc = this.mouse_get_NormalizedDeviceCoordinates(event)
        this.selectedControlPoint = this.controlPoints3dView.controlPointSelection(ndc.x, ndc.y, deltaSquared);
        this.controlPoints3dView.setSelected(this.selectedControlPoint)
        this.previousMousePosition = ndc
        if (event.button === 0 && this.selectedControlPoint === null) {
            this.state = STATE.ROTATE
        }
        if (this.selectedControlPoint !== null) {
            this.dragging = true
        }
        this.controlPoints3dView.updateVerticesIndicesAndBuffers()
    }

    mousemove(event: MouseEvent) {
        if (this.state === STATE.ROTATE || this.dragging === true) {
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
                this.curve3dView.orientation = multiply_quats(deltaRotationQuaternion, this.curve3dView.orientation)
                this.curve3dShadowView.orientation = multiply_quats(deltaRotationQuaternion, this.curve3dShadowView.orientation)
            }
            if (this.dragging === true) {
                const selectedControlPoint = this.controlPoints3dView.getSelectedControlPoint()
                if (selectedControlPoint != null && this.dragging === true) {
                    const p = this.controlPoints3dView.computeNewPosition(currentMousePosition.x, currentMousePosition.y)
                    if (p !== null && this.selectedControlPoint !== null) {
                        this.curveScene3dControler.setControlPointPosition(this.selectedControlPoint, p.x, p.y, p.z)
                    }
                }
            }
        }
    }

    mouseup(event: MouseEvent) {
        this.state = STATE.NONE
        this.dragging = false
    }

    mouse_get_NormalizedDeviceCoordinates(event: MouseEvent) {
        const rect  = this.canvas.getBoundingClientRect()
        const w = parseInt(this.canvas.style.width, 10)
        const h = parseInt(this.canvas.style.height, 10)
        const x = ((event.clientX - rect.left) - w / 2) / (w / 2) 
        const y = (h / 2 - (event.clientY - rect.top)) / (h / 2)
        return {x: x, y: y}
    }


}