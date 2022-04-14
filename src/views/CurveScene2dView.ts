import { CurveScene2dController } from "../controllers/CurveScene2dController"
import { ICurve2dModel } from "../models/ICurve2dModel"
import { ControlPointsShaders } from "./ControlPointsShaders"
import { ControlPoints2dView } from "./ControlPoints2dView"
import { ControlPolygon2dShaders } from "./ControlPolygon2dShaders"
import { ControlPolygon2dView } from "./ControlPolygon2dView"
import { Curve2dShaders } from "./Curve2dShaders"
import { Curve2dView } from "./Curve2dView"
import { CurvatureExtremaShaders } from "./CurvatureExtremaShaders"
import { CurvatureExtrema2dView } from "./CurvatureExtrema2dView"
import { Inflections2dView } from "./Inflections2dView"
import { Curve2dModel } from "../models/Curve2dModel"
import { CurveModelHessian } from "../models/alternatives/CurveModelHessian"
import { ClosedCurve2dModel } from "../models/ClosedCurve2dModel"
import { CurveModelAlternative01 } from "../models/alternatives/CurveModelAlternative01"
import { ClosedCurveModelAlternative01 } from "../models/alternatives/ClosedCurveModelAlternative01"
import { ClosedCurveModelHessian } from "../models/alternatives/ClosedCurveModelHessian"
import { ClosedCurveModelQuasiNewton } from "../models/alternatives/ClosedCurveModelQuasiNewton"
import { CurveModelQuasiNewton } from "../models/alternatives/CurveModelQuasiNewton"

export class CurveScene2dView {

    private selectedControlPoint: number | null = null
    private dragging: boolean = false
    private curveShaders: Curve2dShaders
    private curveView: Curve2dView
    private controlPointsShaders: ControlPointsShaders
    private controlPointsView: ControlPoints2dView
    private controlPolygonShaders: ControlPolygon2dShaders
    private controlPolygonView: ControlPolygon2dView
    private curveSceneControler: CurveScene2dController
    private curvatureExtremaShaders: CurvatureExtremaShaders
    private curvatureExtremaView: CurvatureExtrema2dView
    private inflectionsView: Inflections2dView


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveModel: ICurve2dModel ) {
        this.curveShaders = new Curve2dShaders(this.gl)
        this.curveView = new Curve2dView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPoints2dView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygon2dShaders(this.gl)
        this.controlPolygonView = new ControlPolygon2dView(this.curveModel.spline, this.controlPolygonShaders, this.curveModel.isClosed, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
        this.curvatureExtremaShaders = new CurvatureExtremaShaders(this.gl)
        this.curvatureExtremaView = new CurvatureExtrema2dView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.inflectionsView = new Inflections2dView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 120 / 255, 120 / 255, 1)

        this.curveModel.registerObserver(this.controlPointsView)
        this.curveModel.registerObserver(this.controlPolygonView)
        this.curveModel.registerObserver(this.curveView)
        this.curveModel.registerObserver(this.curvatureExtremaView)
        this.curveModel.registerObserver(this.inflectionsView)
        this.curveSceneControler = new CurveScene2dController(curveModel)
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
                this.updateCurveModel(new Curve2dModel())
                //this.updateCurveModel(new CurveModelQuasiNewton())
                break
            case "1":
                //this.updateCurveModel(new ClosedCurveModelQuasiNewton())
                this.updateCurveModel(new ClosedCurve2dModel())
                break
            case "2":
                this.updateCurveModel(new CurveModelAlternative01())
                break
            case "3":
                this.updateCurveModel(new ClosedCurveModelAlternative01())
                break
        }
        //let toggleButtonCurvatureExtrema = <HTMLInputElement> document.getElementById("toggleButtonCurvatureExtrema")
        //let toggleButtonInflection = <HTMLInputElement> document.getElementById("toggleButtonInflections")
        //toggleButtonCurvatureExtrema.checked = true
        //toggleButtonInflection.checked = true
    }

    updateCurveModel(curveModel: ICurve2dModel) {
        this.curveModel = curveModel
        /*
        this.curveModel.registerObserver(this.controlPointsView, "control points")
        this.curveModel.registerObserver(this.controlPolygonView, "control points")
        this.curveModel.registerObserver(this.curveView, "curve")
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve")
        this.curveModel.registerObserver(this.inflectionsView, "curve")
        */
        this.curveModel.registerObserver(this.controlPointsView)
        this.curveModel.registerObserver(this.controlPolygonView)
        this.curveModel.registerObserver(this.curveView)
        this.curveModel.registerObserver(this.curvatureExtremaView)
        this.curveModel.registerObserver(this.inflectionsView)

        this.curveSceneControler = new CurveScene2dController(curveModel)
        this.controlPolygonView.isClosed = this.curveModel.isClosed
        this.curveModel.notifyObservers()
        this.renderFrame()
    }

}