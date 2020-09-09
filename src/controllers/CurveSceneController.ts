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
    private controlOfCurveClamping: boolean
    /* JCL 2020/09/07 Add controls to monitor function graphs display */
    private controlOfGraphFunctionA: boolean
    private controlOfGraphFunctionB: boolean
    private controlOfGraphFunctionBsqrtScaled: boolean
    private controlOfGraphCurvature: boolean
    private controlOfGraphAbsCurvature: boolean
    private stackOfSelectedGraphs: Array<string> = []
    private readonly MAX_NB_GRAPHS = 3


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
        this.controlOfCurveClamping = false

        /* JCL 2020/09/07 Add monitoring of checkboxes to select the proper graphs to display */
        this.controlOfGraphFunctionA = false
        this.controlOfGraphFunctionB = false
        this.controlOfGraphFunctionBsqrtScaled = false
        this.controlOfGraphCurvature = false
        this.controlOfGraphAbsCurvature = false
        
        
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
        let px = 150
        let size = Math.min(window.innerWidth, window.innerHeight) - px;
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

    addCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        curveObserver.update(this.curveModel.spline);
        this.curveModel.registerObserver(curveObserver);
    }

    removeCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        curveObserver.update(this.curveModel.spline);
        this.curveModel.removeObserver(curveObserver);
    }

    toggleCurveClamping() {
        this.controlOfCurveClamping = !this.controlOfCurveClamping
        console.log("control of curve clamping: " + this.controlOfCurveClamping)
    } 

    /* 2020/09/07 Add management of function graphs display */
    chkboxFunctionA() {
        this.controlOfGraphFunctionA = !this.controlOfGraphFunctionA
        let result =  ""
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionA") === -1) {
            this.stackOfSelectedGraphs.push("functionA")
            result = "functionA"
            console.log("push A")
        } else if(this.stackOfSelectedGraphs.indexOf("functionA") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("functionA"), 1)
            result = "-functionA"
            console.log("remove A")
        } else {
            result =  this.stackOfSelectedGraphs[0]
            this.stackOfSelectedGraphs.push("functionA")
            console.log("send click" + result)
        }
        console.log("functionA graph display: " + this.controlOfGraphFunctionA + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxFunctionB() {
        this.controlOfGraphFunctionB = !this.controlOfGraphFunctionB
        let result =  ""
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionB") === -1) {
            this.stackOfSelectedGraphs.push("functionB")
            result = "functionB"
            console.log("push B")
        } else if(this.stackOfSelectedGraphs.indexOf("functionB") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("functionB"), 1)
            result = "-functionB"
            console.log("remove B")
        } else {
            result =  this.stackOfSelectedGraphs[0]
            this.stackOfSelectedGraphs.push("functionB")
            console.log("send click" + result)
        }
        console.log("functionB graph display: " + this.controlOfGraphFunctionB + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxFunctionBsqrtScaled() {
        this.controlOfGraphFunctionBsqrtScaled = !this.controlOfGraphFunctionBsqrtScaled
        let result =  ""
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("sqrtFunctionB") === -1) {
            this.stackOfSelectedGraphs.push("sqrtFunctionB")
            result = "sqrtFunctionB"
            console.log("push sqrtB")
        } else if(this.stackOfSelectedGraphs.indexOf("sqrtFunctionB") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("sqrtFunctionB"), 1)
            result = "-sqrtFunctionB"
            console.log("remove sqrtB")
        } else {
            result =  this.stackOfSelectedGraphs[0]
            this.stackOfSelectedGraphs.push("sqrtFunctionB")
            console.log("send click" + result)
        }
        console.log("functionBsqrtScaled graph display: " + this.controlOfGraphFunctionBsqrtScaled + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxCurvature() {
        this.controlOfGraphCurvature = !this.controlOfGraphCurvature
        let result =  ""
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("curvature") === -1) {
            this.stackOfSelectedGraphs.push("curvature")
            result = "curvature"
            console.log("push curvature")
        } else if(this.stackOfSelectedGraphs.indexOf("curvature") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("curvature"), 1)
            result = "-curvature"
            console.log("remove curvature")
        } else {
            result =  this.stackOfSelectedGraphs[0]
            this.stackOfSelectedGraphs.push("curvature")
            console.log("send click" + result)
        }
        console.log("curvature graph display: " + this.controlOfGraphCurvature + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxAbsCurvature() {
        this.controlOfGraphAbsCurvature = !this.controlOfGraphAbsCurvature
        let result =  ""
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("absCurvature") === -1) {
            this.stackOfSelectedGraphs.push("absCurvature")
            result = "absCurvature"
            console.log("push absCurvature")
        } else if(this.stackOfSelectedGraphs.indexOf("absCurvature") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("absCurvature"), 1)
            result = "-absCurvature"
            console.log("remove absCurvature")
        } else {
            result =  this.stackOfSelectedGraphs[0]
            this.stackOfSelectedGraphs.push("absCurvature")
            console.log("send click" + result)
        }
        console.log("curvature graph display: " + this.controlOfGraphAbsCurvature + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
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
                // JCL after resetting the curve the activeControl parameter is reset to 2 independently of the control settings
                // JCL the curveControl must be set in accordance with the current status of controls
                if (this.sliding == true) {
                    this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema)
                }
                else {
                    this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema)
                }
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