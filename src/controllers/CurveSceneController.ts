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
import { DifferentialEventShaders } from "../views/DifferentialEventShaders";
import { TransitionDifferentialEventShaders } from "../views/TransitionDifferentialEventShaders";
import { CurvatureExtremaView } from "../views/CurvatureExtremaView";
import { InflectionsView } from "../views/InflectionsView";
import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { SlidingStrategy } from "./SlidingStrategy";
import { NoSlidingStrategy } from "./NoSlidingStrategy";
import { TransitionCurvatureExtremaView } from "../views/TransitionCurvatureExtremaView";
import { IObserver } from "../designPatterns/Observer";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";



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
    private differentialEventShaders: DifferentialEventShaders
    private transitionDifferentialEventShaders: TransitionDifferentialEventShaders
    private curvatureExtremaView: CurvatureExtremaView
    private transitionCurvatureExtremaView: TransitionCurvatureExtremaView
    private inflectionsView: InflectionsView
    private curveControl: CurveControlStrategyInterface
    private sliding: boolean
    private controlOfCurvatureExtrema: boolean
    private controlOfInflection: boolean


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveObservers: Array<IRenderFrameObserver<BSpline_R1_to_R2_interface>> = []) {
        this.curveModel = new CurveModel()
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false)
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl)
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders)
        this.differentialEventShaders = new DifferentialEventShaders(this.gl)
        this.transitionDifferentialEventShaders = new TransitionDifferentialEventShaders(this.gl)
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.curveModel.spline, this.transitionDifferentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1)

        this.inflectionsView = new InflectionsView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 120 / 255, 120 / 255, 1)


        this.controlOfCurvatureExtrema = true
        this.controlOfInflection = true
        
        
        this.curveModel.registerObserver(this.controlPointsView)
        this.curveModel.registerObserver(this.controlPolygonView)
        this.curveModel.registerObserver(this.curveView);
        this.curveModel.registerObserver(this.curvatureExtremaView)
        this.curveModel.registerObserver(this.transitionCurvatureExtremaView)
        this.curveModel.registerObserver(this.inflectionsView)


        this.curveObservers.forEach(element => {
            element.update(this.curveModel.spline)
            this.curveModel.registerObserver(element)
        });

        this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema)
        this.sliding = true
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
        this.curvatureExtremaView.renderFrame()
        this.transitionCurvatureExtremaView.renderFrame()
        this.inflectionsView.renderFrame()
        this.controlPolygonView.renderFrame()
        this.controlPointsView.renderFrame()
        this.insertKnotButtonView.renderFrame()

        this.curveObservers.forEach(element => {
            element.renderFrame()
        });

    }



    toggleControlOfCurvatureExtrema() {
        this.curveControl.toggleControlOfCurvatureExtrema()
        this.controlOfCurvatureExtrema = !this.controlOfCurvatureExtrema
        //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
    }

    toggleControlOfInflections() {
        this.curveControl.toggleControlOfInflections()
        this.controlOfInflection = ! this.controlOfInflection
        //console.log("constrol of inflections: " + this.controlOfInflection)
    }


    toggleSliding() {
        if (this.sliding === true) {
            this.sliding = false
            //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
            //console.log("constrol of inflections: " + this.controlOfInflection)
            this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema)
        }
        else {
            this.sliding = true
            //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
            //console.log("constrol of inflections: " + this.controlOfInflection)
            this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema)
        }
    }

    leftMouseDown_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01) {
        if (this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== null) {
            
            let cp = this.selectedControlPoint
            if (cp === 0) { cp += 1}
            if (cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae()
            if (cp != null) {
                this.curveModel.spline.insertKnot(grevilleAbscissae[cp])
                this.curveControl.resetCurve(this.curveModel)
                this.curveModel.notifyObservers()
            }
        }
        
        this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
        this.controlPointsView.setSelected(this.selectedControlPoint);
        if (this.selectedControlPoint !== null) {
            this.dragging = true;
        }
    }


    leftMouseDragged_event(ndcX: number, ndcY: number) {
        const x = ndcX,
        y = ndcY,
        selectedControlPoint = this.controlPointsView.getSelectedControlPoint()
        if (selectedControlPoint != null && this.dragging === true) {
            this.curveModel.setControlPoint(selectedControlPoint, x, y)
            this.curveControl.optimize(selectedControlPoint, x, y)
            this.curveModel.notifyObservers()
        }

    }

    leftMouseUp_event() {
        this.dragging = false;
    }



}