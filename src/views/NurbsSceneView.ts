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
//import { CurveModel } from "../models/CurveModel"
import { ClosedCurveModel } from "../models/ClosedCurveModel"
import { CurveModelAlternative01 } from "../models/CurveModelAlternative01"
import { ClosedCurveModelAlternative01 } from "../models/ClosedCurveModelAlternative01"
import { NurbsModel2d } from "../models/NurbsModel2d"
import { Nurbs2dSceneController } from "../controllers/Nurbs2dSceneController"

export class NurbsSceneView {

    private selectedControlPoint: number | null = null
    private dragging: boolean = false
    private curveShaders: CurveShaders
    private curveView: CurveView
    private controlPointsShaders: ControlPointsShaders
    private controlPointsView: ControlPointsView
    private controlPolygonShaders: ControlPolygonShaders
    private controlPolygonView: ControlPolygonView
    private curveSceneControler: Nurbs2dSceneController
    private curvatureExtremaShaders: CurvatureExtremaShaders
    private curvatureExtremaView: CurvatureExtremaView
    private inflectionsView: InflectionsView


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveModel: NurbsModel2d ) {
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.curveModel.getSplineAdapter(), this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.curveModel.getSplineAdapter(), this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.curveModel.getSplineAdapter(), this.controlPolygonShaders, this.curveModel.isClosed, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
        this.curvatureExtremaShaders = new CurvatureExtremaShaders(this.gl)
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.getSplineAdapter(), this.curvatureExtremaShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.inflectionsView = new InflectionsView(this.curveModel.getSplineAdapter(), this.curvatureExtremaShaders, 216 / 255, 120 / 255, 120 / 255, 1)

        this.curveModel.registerObserver(this.controlPointsView, "control points")
        this.curveModel.registerObserver(this.controlPolygonView, "control points")
        this.curveModel.registerObserver(this.curveView, "curve")
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve")
        this.curveModel.registerObserver(this.inflectionsView, "curve")
        this.curveSceneControler = new Nurbs2dSceneController(curveModel)
        this.renderFrame()

    }

    renderFrame() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl.clearColor(0.27, 0.27, 0.27, 1)
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
        this.dragging = false
    }

    upArrow_event() {
        if (this.selectedControlPoint !== null) {
            this.curveModel.increaseControlPointWeight(this.selectedControlPoint)
        }

    }

    downArrow_event() {
        if (this.selectedControlPoint !== null) {
            this.curveModel.decreaseControlPointWeight(this.selectedControlPoint)
        }
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

    selectCurveCategory(s: string) {
       switch(s) {
            case "0":
                this.updateCurveModel(new NurbsModel2d())
                //this.updateCurveModel(new CurveModelQuasiNewton())
                break
                /*
            case "1":
                //this.updateCurveModel(new ClosedCurveModelQuasiNewton())
                this.updateCurveModel(new ClosedCurveModel())
                break
            case "2":
                this.updateCurveModel(new CurveModelAlternative01())
                break
            case "3":
                this.updateCurveModel(new ClosedCurveModelAlternative01())
                break
                */
        }
        //let toggleButtonCurvatureExtrema = <HTMLInputElement> document.getElementById("toggleButtonCurvatureExtrema")
        //let toggleButtonInflection = <HTMLInputElement> document.getElementById("toggleButtonInflections")
        //toggleButtonCurvatureExtrema.checked = true
        //toggleButtonInflection.checked = true
    }

    updateCurveModel(curveModel: NurbsModel2d) {
        this.curveModel = curveModel
        this.curveModel.registerObserver(this.controlPointsView, "control points")
        this.curveModel.registerObserver(this.controlPolygonView, "control points")
        this.curveModel.registerObserver(this.curveView, "curve")
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve")
        this.curveModel.registerObserver(this.inflectionsView, "curve")
        this.curveSceneControler = new Nurbs2dSceneController(curveModel)
        this.controlPolygonView.isClosed = this.curveModel.isClosed
        this.curveModel.notifyObservers()
        this.renderFrame()
    }

}