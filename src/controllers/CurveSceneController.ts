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

/* JCL 2020/09/24 Add the visualization of clamped control points */
import { ClampedControlPointView } from "../views/ClampedControlPointView"
import { Vector_2d } from "../mathematics/Vector_2d";
/*import { Tagged_Vector_2d } from "../mathematics/Tagged_Vector_2d";*/
/* JCL 2020/10/02 Add the visualization of knots */
import { CurveKnotsView } from "../views/CurveKnotsView"
import { CurveKnotsShaders } from "../views/CurveKnotsShaders";


/* JCL 2020/09/23 Add controls to monitor the location of the curve with respect to its rigid body sliding behavior */
export enum ActiveLocationControl {firstControlPoint, lastControlPoint, both, none, stopDeforming}

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
    /* JCL 2020/09/24 Add visualization and selection of clamped control points */
    private clampedControlPointView: ClampedControlPointView | null = null
    private clampedControlPoints: number[] = []
    /* JCL 2020/09/23 Add management of the curve location */
    public activeLocationControl: ActiveLocationControl = ActiveLocationControl.none

    /* JCL 2020/10/02 Add the visualization of knots */
    private curveKnotsView: CurveKnotsView
    private curveKnotsShaders: CurveKnotsShaders


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveObservers: Array<IRenderFrameObserver<BSpline_R1_to_R2_interface>> = []) {
        this.curveModel = new CurveModel()
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
        /*this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 0, 0, 1.0, 1) */
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl)
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders)
        this.differentialEventShaders = new DifferentialEventShaders(this.gl)
        this.transitionDifferentialEventShaders = new TransitionDifferentialEventShaders(this.gl)
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1)
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.curveModel.spline, this.transitionDifferentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1)

        this.inflectionsView = new InflectionsView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 120 / 255, 120 / 255, 1)

        this.curveKnotsShaders = new CurveKnotsShaders(this.gl)
        this.curveKnotsView = new CurveKnotsView(this.curveModel.spline, this.curveKnotsShaders, 1, 0, 0, 1)

        /* JCL 2020/09/24 Add default clamped control point */
        let clampedControlPoint: Vector_2d[] = []
        clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
        /*let taggedControlPoint = new Tagged_Vector_2d(this.curveModel.spline.controlPoints[0], 0)*/
        this.clampedControlPoints.push(0)
        this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
        this.activeLocationControl = ActiveLocationControl.firstControlPoint


        this.controlOfCurvatureExtrema = true
        this.controlOfInflection = true
        this.controlOfCurveClamping = true

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

        this.curveModel.registerObserver(this.curveKnotsView)


        this.curveObservers.forEach(element => {
            element.update(this.curveModel.spline)
            this.curveModel.registerObserver(element)
        });
        /* JCL 2020/09/24 update the display of clamped control points (cannot be part of observers) */
        this.clampedControlPointView.update(clampedControlPoint)

        this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
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

        this.curveKnotsView.renderFrame()
        if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
            this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 0, 0, 0.9, 1)
        } else {
            this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
        }
        this.controlPointsView.renderFrame()
        this.insertKnotButtonView.renderFrame()

        this.curveObservers.forEach(element => {
            element.renderFrame()
        });
        /* JCL 2020/09/24 Add the display of clamped control points */
        if(this.controlOfCurveClamping && this.clampedControlPointView !== null) {
            this.clampedControlPointView.renderFrame()
        }


    }

    addCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        curveObserver.update(this.curveModel.spline);
        this.curveModel.registerObserver(curveObserver);
    }

    removeCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        curveObserver.update(this.curveModel.spline);
        this.curveModel.removeObserver(curveObserver);
    }

    resetCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        curveObserver.reset(this.curveModel.spline);
        /*this.curveModel.registerObserver(curveObserver);*/
    }

    /* JCL 20202/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        this.controlOfCurveClamping = !this.controlOfCurveClamping
        console.log("control of curve clamping: " + this.controlOfCurveClamping)
        if(this.controlOfCurveClamping) {
            /* JCL 2020/09/24 Update the location of the clamped control point */
            let clampedControlPoint: Vector_2d[] = []
            clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
            this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
            this.clampedControlPoints = []
            this.clampedControlPoints.push(0)
            this.activeLocationControl = ActiveLocationControl.firstControlPoint
            if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        } else this.activeLocationControl = ActiveLocationControl.none
    } 

    /* 2020/09/07 Add management of function graphs display */
    chkboxFunctionA() {
        this.controlOfGraphFunctionA = !this.controlOfGraphFunctionA
        let result: Array<string> = []
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionA") === -1) {
            /* JCL 2020/09/09 There only one event because the stack is not full yet */
            this.stackOfSelectedGraphs.push("functionA")
            result.push("functionA")
            console.log("push A")
        } else if(!this.controlOfGraphFunctionA && this.stackOfSelectedGraphs.length > this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionA") === -1) {
            /* JCL 2020/09/09 There only one event because the stack is full and it is the event processing to remove effectively the controller */
            result.push("-functionA")
            this.stackOfSelectedGraphs.shift()
            console.log("push -A to remove")
        } else if(this.stackOfSelectedGraphs.indexOf("functionA") !== -1){
            /* JCL 2020/09/09 There only one event because whether the stack is full or not what matters is the removal of only one graph */
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("functionA"), 1)
            result.push("-functionA")
            console.log("remove A")
        } else {
            /* JCL 2020/09/09 There are two events because whether the stack is full and one graph is added that does not exists already
                Consequently, the first graph of the stack must be removed (second event) */
            let controlOfGraphToRemove = "-"
            result.push(controlOfGraphToRemove.concat(this.stackOfSelectedGraphs[0]))
            result.push("functionA")
            this.stackOfSelectedGraphs.push("functionA")
            console.log("send click " + result)
        }
        console.log("functionA graph display: " + this.controlOfGraphFunctionA + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxFunctionB() {
        this.controlOfGraphFunctionB = !this.controlOfGraphFunctionB
        let result: Array<string> = []
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionB") === -1) {
            this.stackOfSelectedGraphs.push("functionB")
            result.push("functionB")
            console.log("push B")
        } else if(!this.controlOfGraphFunctionB && this.stackOfSelectedGraphs.length > this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("functionB") === -1) {
            result.push("-functionB")
            this.stackOfSelectedGraphs.shift()
            console.log("push -B to remove")
        } else if(this.stackOfSelectedGraphs.indexOf("functionB") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("functionB"), 1)
            result.push("-functionB")
            console.log("remove B")
        } else {
            let controlOfGraphToRemove = "-"
            result.push(controlOfGraphToRemove.concat(this.stackOfSelectedGraphs[0]))
            result.push("functionB")
            this.stackOfSelectedGraphs.push("functionB")
            console.log("send click " + result)
        }
        console.log("functionB graph display: " + this.controlOfGraphFunctionB + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxFunctionBsqrtScaled() {
        this.controlOfGraphFunctionBsqrtScaled = !this.controlOfGraphFunctionBsqrtScaled
        let result: Array<string> = []
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("sqrtFunctionB") === -1) {
            this.stackOfSelectedGraphs.push("sqrtFunctionB")
            result.push("sqrtFunctionB")
            console.log("push sqrtB")
        } else if(!this.controlOfGraphFunctionBsqrtScaled && this.stackOfSelectedGraphs.length > this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("sqrtFunctionB") === -1) {
            result.push("-sqrtFunctionB")
            this.stackOfSelectedGraphs.shift()
            console.log("push -sqrtB to remove")
        } else if(this.stackOfSelectedGraphs.indexOf("sqrtFunctionB") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("sqrtFunctionB"), 1)
            result.push("-sqrtFunctionB")
            console.log("remove sqrtB")
        } else {
            let controlOfGraphToRemove = "-"
            result.push(controlOfGraphToRemove.concat(this.stackOfSelectedGraphs[0]))
            result.push("sqrtFunctionB")
            this.stackOfSelectedGraphs.push("sqrtFunctionB")
            console.log("send click" + result)
        }
        console.log("functionBsqrtScaled graph display: " + this.controlOfGraphFunctionBsqrtScaled + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxCurvature() {
        this.controlOfGraphCurvature = !this.controlOfGraphCurvature
        let result: Array<string> = []
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("curvature") === -1) {
            this.stackOfSelectedGraphs.push("curvature")
            result.push("curvature")
            console.log("push curvature")
        } else if(!this.controlOfGraphCurvature && this.stackOfSelectedGraphs.length > this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("curvature") === -1) {
            result.push("-curvature")
            this.stackOfSelectedGraphs.shift()
            console.log("push -curvature to remove")
        } else if(this.stackOfSelectedGraphs.indexOf("curvature") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("curvature"), 1)
            result.push("-curvature")
            console.log("remove curvature")
        } else {
            let controlOfGraphToRemove = "-"
            result.push(controlOfGraphToRemove.concat(this.stackOfSelectedGraphs[0]))
            result.push("curvature")
            this.stackOfSelectedGraphs.push("curvature")
            console.log("send click" + result)
        }
        console.log("curvature graph display: " + this.controlOfGraphCurvature + " result " + result + " stack " + this.stackOfSelectedGraphs)
        return result
    }

    chkboxAbsCurvature() {
        this.controlOfGraphAbsCurvature = !this.controlOfGraphAbsCurvature
        let result: Array<string> = []
        if(this.stackOfSelectedGraphs.length < this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("absCurvature") === -1) {
            this.stackOfSelectedGraphs.push("absCurvature")
            result.push("absCurvature")
            console.log("push absCurvature")
        } else if(!this.controlOfGraphAbsCurvature && this.stackOfSelectedGraphs.length > this.MAX_NB_GRAPHS && this.stackOfSelectedGraphs.indexOf("absCurvature") === -1) {
            result.push("-absCurvature")
            this.stackOfSelectedGraphs.shift()
            console.log("push -absCurvature to remove")
        } else if(this.stackOfSelectedGraphs.indexOf("absCurvature") !== -1){
            this.stackOfSelectedGraphs.splice(this.stackOfSelectedGraphs.indexOf("absCurvature"), 1)
            result.push("-absCurvature")
            console.log("remove absCurvature")
        } else {
            let controlOfGraphToRemove = "-"
            result.push(controlOfGraphToRemove.concat(this.stackOfSelectedGraphs[0]))
            result.push("absCurvature")
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
            this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        }
        else {
            this.sliding = true
            //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
            //console.log("constrol of inflections: " + this.controlOfInflection)
            this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
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
                    this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                else {
                    this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                this.curveModel.notifyObservers()
            }

        }
        
        if (this.activeLocationControl === ActiveLocationControl.both && this.selectedControlPoint === null) {
            /* JCL 2020/09/28 Reinitialize the curve optimization context after releasing the conotrol point dragging mode */
            if (this.sliding == true) {
                this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
            else {
                this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
            this.curveModel.notifyObservers()
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
        /* JCL 2020/09/27 Add clamping condition when dragging a control point */
        if (selectedControlPoint != null && this.dragging === true && this.activeLocationControl !== ActiveLocationControl.stopDeforming) {
            this.curveModel.setControlPoint(selectedControlPoint, x, y)
            this.curveControl.optimize(selectedControlPoint, x, y)
            this.curveModel.notifyObservers()
            if(this.clampedControlPoints.length > 0) {
                let clampedControlPoint: Vector_2d[] = []
                for(let i = 0; i < this.clampedControlPoints.length; i+= 1) {
                    clampedControlPoint.push(this.curveModel.spline.controlPoints[this.clampedControlPoints[i]])
                }
                if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
            }
        }

    }

    leftMouseUp_event() {
        this.dragging = false;
        if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
            this.activeLocationControl = ActiveLocationControl.both
            this.selectedControlPoint = null
        }
    }

    /* JCL 2020/09/25 Management of the dble click on a clamped control point */
    dbleClick_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01): boolean {
        let result: boolean
        if(this.controlOfCurveClamping) {
            if(this.clampedControlPointView !== null) {
                let selectedClampedControlPoint = this.clampedControlPointView.controlPointSelection(this.curveModel.spline.controlPoints, ndcX, ndcY, deltaSquared);
                console.log("dlble_click: id conrol pt = " + selectedClampedControlPoint)
                if(selectedClampedControlPoint !== null) {
                    if(this.clampedControlPoints.length === 1 && this.clampedControlPoints[0] === selectedClampedControlPoint) {
                        console.log("dlble_click: no cp left")
                        this.clampedControlPointView = null
                        this.clampedControlPoints.pop()
                        this.activeLocationControl = ActiveLocationControl.none
                        return result = false
                    }
                    else if(this.clampedControlPoints.length === 1 && this.clampedControlPoints[0] !== selectedClampedControlPoint 
                        && (selectedClampedControlPoint === 0 || selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1))) {
                        console.log("dlble_click: two cp clamped")
                        this.clampedControlPoints.push(selectedClampedControlPoint)
                        let clampedControlPoint: Vector_2d[] = []
                        clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                        clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                        this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
                        this.activeLocationControl = ActiveLocationControl.both
                        return result = true
                    }
                    else if(this.clampedControlPoints.length === 2) {
                        if(selectedClampedControlPoint === 0) {
                            console.log("dlble_click: last cp left")
                            if(this.clampedControlPoints[1] === selectedClampedControlPoint) {
                                this.clampedControlPoints.pop()
                            } else this.clampedControlPoints.splice(0, 1)
                            let clampedControlPoint: Vector_2d[] = []
                            clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                            this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
                            this.activeLocationControl = ActiveLocationControl.lastControlPoint
                            console.log("dble click: clampedControlPoints " + this.clampedControlPoints)
                        } else if(selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1)) {
                            console.log("dlble_click: first cp left")
                            if(this.clampedControlPoints[1] === selectedClampedControlPoint) {
                                this.clampedControlPoints.pop()
                            } else this.clampedControlPoints.splice(0, 1)
                            let clampedControlPoint: Vector_2d[] = []
                            clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                            this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
                            this.activeLocationControl = ActiveLocationControl.firstControlPoint
                            console.log("dble click: clampedControlPoints " + this.clampedControlPoints)
                        }
                        return result = true
                    } else return result = true
                } else return result = true
            } else return result = true
        } else return result = true
    }



}