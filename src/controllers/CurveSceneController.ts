import { CurveModel } from "../models/CurveModel"
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPointsShaders}  from "../views/ControlPointsShaders"
import { ControlPolygonShaders } from "../views/ControlPolygonShaders";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveShaders } from "../views/CurveShaders";
import { CurveView } from "../views/CurveView";
import { SceneControllerInterface } from "./SceneControllerInterface";
import { InsertKnotButtonShaders } from "../views/InsertKnotButtonShaders";
import { ClickButtonView } from "../views/ClickButtonView";



export class CurveSceneController implements SceneControllerInterface {

    private selectedControlPoint: number | null = null
    private curveModel: CurveModel
    private controlPointsShaders: ControlPointsShaders
    private controlPointsView: ControlPointsView
    private controlPolygonShaders: ControlPolygonShaders
    private controlPolygonView: ControlPolygonView
    private curveShaders: CurveShaders
    private curveView: CurveView
    private insertKnotButtonShaders: InsertKnotButtonShaders
    private insertKnotButtonView: ClickButtonView
    private dragging: boolean = false


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext) {
        this.curveModel = new CurveModel()
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false)
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl)
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders)
        this.curveModel.registerObserver(this.controlPointsView)
        this.curveModel.registerObserver(this.controlPolygonView)
        this.curveModel.registerObserver(this.curveView);
    }

    renderFrame() {
        let px = 100,
        size = Math.min(window.innerWidth, window.innerHeight) - px;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.3, 0.3, 0.3, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.curveView.renderFrame()
        this.controlPolygonView.renderFrame()
        this.controlPointsView.renderFrame()
        this.insertKnotButtonView.renderFrame()

    }


    toggleOptimizer() {
    }

    toggleControlOfCurvatureExtrema() {
    }

    toggleControlOfInflections() {
    }


    toggleSliding() {
    }

    leftMouseDown_event(ndcX: number, ndcY: number, deltaSquared:number = 0.01) {
        if (this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== -1) {
            
            let cp = this.selectedControlPoint
            if (cp === 0) { cp += 1}
            if (cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae()
            if (cp != null) {
                this.curveModel.spline.insertKnot(grevilleAbscissae[cp])
                this.curveModel.notifyObservers()
            }
        }
        
        this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
        this.controlPointsView.setSelected(this.selectedControlPoint);
        if (this.selectedControlPoint !== -1) {
            this.dragging = true;
        }
    }


    leftMouseDragged_event(ndcX: number, ndcY: number) {
        const x = ndcX,
        y = ndcY,
        selectedControlPoint = this.controlPointsView.getSelectedControlPoint()
        if (selectedControlPoint !== -1 && selectedControlPoint != null && this.dragging === true) {

            this.curveModel.setControlPoint(selectedControlPoint, x, y)
            this.curveModel.notifyObservers()
        }

    }

    leftMouseUp_event() {
        this.dragging = false;
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
    }

}