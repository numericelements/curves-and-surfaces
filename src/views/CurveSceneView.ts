import { CurveSceneController } from "../controllers/CurveSceneController"
import { CurveModelInterface } from "../models/CurveModelInterface"
import { ControlPointsShaders } from "../views/ControlPointsShaders"
import { ControlPointsView } from "../views/ControlPointsView"
import { ControlPolygonShaders } from "../views/ControlPolygonShaders"
import { ControlPolygonView } from "../views/ControlPolygonView"
import { CurveShaders } from "../views/CurveShaders"
import { CurveView } from "../views/CurveView"
import { CurvatureExtremaShaders } from "./CurvatureExtremaShaders"
import { CurvatureExtremaView } from "./CurvatureExtremaView"
import { InflectionsView } from "../views/InflectionsView"

export class CurveSceneView {

    private selectedControlPoint: number | null = null
    private dragging: boolean = false
    private curveShaders: CurveShaders
    private curveView: CurveView
    private controlPointsShaders: ControlPointsShaders
    private controlPointsView: ControlPointsView
    private controlPolygonShaders: ControlPolygonShaders
    private controlPolygonView: ControlPolygonView
    private curveSceneControler: CurveSceneController
    private curvatureExtremaShaders: CurvatureExtremaShaders
    private curvatureExtremaView: CurvatureExtremaView
    private inflectionsView: InflectionsView


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveModel: CurveModelInterface ) {
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, this.curveModel.isClosed, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
        this.curvatureExtremaShaders = new CurvatureExtremaShaders(this.gl)
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.inflectionsView = new InflectionsView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 120 / 255, 120 / 255, 1)

        
        this.curveModel.registerObserver(this.controlPointsView)
        this.curveModel.registerObserver(this.controlPolygonView)
        this.curveModel.registerObserver(this.curveView)
        this.curveModel.registerObserver(this.curvatureExtremaView)
        this.curveModel.registerObserver(this.inflectionsView)
        this.curveSceneControler = new CurveSceneController(curveModel)
        this.renderFrame()

    }

    renderFrame() {
        let px = 100
        let size = Math.min(window.innerWidth, window.innerHeight) - px
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.3, 0.3, 0.3, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        this.curveView.renderFrame()
        this.curvatureExtremaView.renderFrame()
        this.inflectionsView.renderFrame()
        this.controlPolygonView.renderFrame()
        this.controlPointsView.renderFrame()
    }

    leftMouseDown_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01) {
            this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
            this.controlPointsView.setSelected(this.selectedControlPoint)
            if (this.selectedControlPoint !== null) {
                this.dragging = true;
            }
    }

    leftMouseDragged_event(ndcX: number, ndcY: number) {
        let x = ndcX, y = ndcY, selectedControlPoint = this.controlPointsView.getSelectedControlPoint();
        if (selectedControlPoint != null && this.dragging === true) {
            this.curveSceneControler.setControlPointPosition(selectedControlPoint, x, y)
        }
    }


    leftMouseUp_event() {
        this.dragging = false;
    }

    addControlPoint() {
        const cp = this.selectedControlPoint
        this.selectedControlPoint = null
        this.controlPointsView.setSelected(this.selectedControlPoint)
        this.curveModel.addControlPoint(cp)
        this.renderFrame()
    }

    toggleControlOfCurvatureExtrema() {
        this.curveModel.toggleActiveControlOfCurvatureExtrema()
    }

    toggleControlOfInflections() {
        this.curveModel.toggleActiveControlOfInflections()
    }

}