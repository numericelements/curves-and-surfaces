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
import { NeighboringEventsType, NeighboringEvents, SlidingStrategy } from "./SlidingStrategy";
import { NoSlidingStrategy } from "./NoSlidingStrategy";
import { TransitionCurvatureExtremaView } from "../views/TransitionCurvatureExtremaView";
import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";

/* JCL 2020/09/24 Add the visualization of clamped control points */
import { ClampedControlPointView } from "../views/ClampedControlPointView"
import { Vector_2d } from "../mathematics/Vector_2d";
/* JCL 2020/10/02 Add the visualization of knots */
import { CurveKnotsView } from "../views/CurveKnotsView"
import { CurveKnotsShaders } from "../views/CurveKnotsShaders";
import { BSpline_R1_to_R2_degree_Raising } from "../bsplines/BSpline_R1_to_R2_degree_Raising";

//import * as fs from "fs";
import { saveAs } from "file-saver";
import { NONAME } from "dns";

import { SelectedDifferentialEventsView } from "../views/SelectedDifferentialEventsView"

import { CurveModeler } from "../curveModeler/CurveModeler";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { ShapeSpaceConfiguratorWithInflectionsNoSliding, ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { CurveControlState, HandleInflectionsAndCurvatureExtremaNoSlidingState, HandleNoDiffEventNoSlidingState } from "./CurveControlState";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { NavigationState, NavigationStrictlyInsideShapeSpace, NavigationThroughSimplerShapeSpaces, NavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { EventMgmtAtCurveExtremities } from "../curveModeler/EventMgmtAtCurveExtremities";
import { CurveConstraintSelectionState, HandleConstraintAtPoint1ConstraintPoint2NoConstraintState } from "./CurveConstraintSelectionState";



/* JCL 2020/09/23 Add controls to monitor the location of the curve with respect to its rigid body sliding behavior */
export enum ActiveLocationControl {firstControlPoint, lastControlPoint, both, none, stopDeforming}
/* JCL 2020/11/06 Add controls to monitor the location of the curvature extrema and inflection points */
export enum ActiveExtremaLocationControl {mergeExtrema, none, stopDeforming, extremumLeaving, extremumEntering}
export enum ActiveInflectionLocationControl {mergeExtremaAndInflection, none, stopDeforming}

export class CurveSceneController implements SceneControllerInterface {

    private selectedControlPoint: number | null = null
    public selectedCurvatureExtrema: number[] | null = null
    public selectedInflection: number[] | null = null
    public allowShapeSpaceChange: boolean = false
    private selectedDifferentialEventsView: SelectedDifferentialEventsView
    /* JCL 2020/10/18 Moved CurveModel to public */
    //public curveModel: CurveModel
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
    /* JCL 2020/10/18 Moved sliding, controlOfCurvatureExtrema, controlOfInflection, controlOfCurveClamping to public */
    public sliding: boolean
    public controlOfCurvatureExtrema: boolean
    public controlOfInflection: boolean
    public controlOfCurveClamping: boolean
    /* JCL 2020/09/24 Add visualization and selection of clamped control points */
    private clampedControlPointView: ClampedControlPointView | null = null
    private clampedControlPoints: number[] = []
    /* JCL 2020/09/23 Add management of the curve location */
    public activeLocationControl: ActiveLocationControl = ActiveLocationControl.none

    /* JCL 2020/10/02 Add the visualization of knots */
    private curveKnotsView: CurveKnotsView
    private curveKnotsShaders: CurveKnotsShaders
    /* JCL 2020/11/06 Add management of the curvature extrema and inflections */
    public activeExtremaLocationControl: ActiveExtremaLocationControl = ActiveExtremaLocationControl.none
    public activeInflectionLocationControl: ActiveInflectionLocationControl = ActiveInflectionLocationControl.none
    public stackControlPolygons: Array<Array<Vector_2d>> = []
    public sizeStackControlPolygons: number = this.stackControlPolygons.length
    public readonly MAX_NB_CONFIGS_CP = 5
    public counterLostEvent: number = 0
    public lastLostEvent: NeighboringEvents = {event: NeighboringEventsType.none, index: 0}

    /* JCL 2021/09/29 Add modeller for new code architecture */
    public curveModeler: CurveModeler;
    public shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    public shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    private curveControlState: CurveControlState;
    private navigationState: NavigationState;
    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    public curveEventAtExtremityMayVanish: boolean;
    public eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private constraintAtPoint1: boolean;
    private constraintAtPoint2: boolean;
    private curveConstraintSelectionState: CurveConstraintSelectionState;

    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext, private curveObservers: Array<IRenderFrameObserver<BSpline_R1_to_R2_interface>> = [],
        public curveModel?: CurveModel) {
        if(!curveModel) {
            this.curveModel = new CurveModel()
        } else {
            this.curveModel = curveModel
        }

        this.controlPointsShaders = new ControlPointsShaders(this.gl);
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
        
        let selectedEvent: number[]= []
        this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, selectedEvent, this.differentialEventShaders, 0, 0, 1, 1)

        /* JCL 2020/09/24 Add default clamped control point */
        let clampedControlPoint: Vector_2d[] = []
        clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
        this.clampedControlPoints.push(0)
        this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
        this.activeLocationControl = ActiveLocationControl.firstControlPoint

        this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        this.allowShapeSpaceChange = false

        this.controlOfCurvatureExtrema = true
        this.controlOfInflection = true
        this.controlOfCurveClamping = true
        
        this.registerCurveObservers();

        /* JCL 2020/09/24 update the display of clamped control points (cannot be part of observers) */
        this.clampedControlPointView.update(clampedControlPoint)
        this.selectedDifferentialEventsView.update(this.curveModel.spline, selectedEvent)

        this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        this.sliding = true


        /* JCL 2021/09/29 Add modeller for new code architecture */
        this.curveEventAtExtremityMayVanish = true;
        this.constraintAtPoint1 = true;
        this.constraintAtPoint2 = false;
        this.curveModeler = new CurveModeler();
        this.curveShapeSpaceNavigator = this.curveModeler.curveShapeSpaceNavigator;
        this.navigationState = this.curveShapeSpaceNavigator.navigationState;
        this.navigationState.setNavigationWithoutShapeSpaceMonitoring();
        this.shapeSpaceDiffEventsConfigurator = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator;
        this.shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this.curveControlState = new HandleNoDiffEventNoSlidingState(this);

        this.eventMgmtAtCurveExtremities = this.curveShapeSpaceNavigator.eventMgmtAtCurveExtremities;
        this.curveConstraintSelectionState = new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this);
        console.log("end constructor curveSceneController")
    }


    initCurveSceneView(): void {
        this.controlPointsShaders = new ControlPointsShaders(this.gl);
        this.controlPointsView = new ControlPointsView(this.curveModel!.spline, this.controlPointsShaders, 1, 1, 1);
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl);
        this.controlPolygonView = new ControlPolygonView(this.curveModel!.spline, this.controlPolygonShaders, false, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05);
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl);
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders);
        this.curveShaders = new CurveShaders(this.gl);
        this.curveView = new CurveView(this.curveModel!.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.differentialEventShaders = new DifferentialEventShaders(this.gl);
        this.transitionDifferentialEventShaders = new TransitionDifferentialEventShaders(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel!.spline, this.differentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.curveModel!.spline, this.transitionDifferentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.inflectionsView = new InflectionsView(this.curveModel!.spline, this.differentialEventShaders, 216 / 255, 120 / 255, 120 / 255, 1);
        this.curveKnotsShaders = new CurveKnotsShaders(this.gl);
        this.curveKnotsView = new CurveKnotsView(this.curveModel!.spline, this.curveKnotsShaders, 1, 0, 0, 1);

        this.registerCurveObservers();

        this.controlOfCurvatureExtrema = true;
        this.controlOfInflection = true;
        this.controlOfCurveClamping = true;

        let clampedControlPoint: Vector_2d[] = [];
        clampedControlPoint.push(this.curveModel!.spline.controlPoints[0]);
        if(this.clampedControlPoints.length !== 0) {
            while(this.clampedControlPoints.length > 0) {
                this.clampedControlPoints.pop();
            }
        }
        this.clampedControlPoints.push(0);
        this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0);
        this.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this.clampedControlPointView.update(clampedControlPoint);
        this.dragging = false;
        this.selectedControlPoint = null;
        this.curveControl = new SlidingStrategy(this.curveModel!, this.controlOfInflection, this.controlOfCurvatureExtrema, this);
        this.sliding = true;
    }

    registerCurveObservers(): void {
        this.curveModel!.registerObserver(this.controlPointsView);
        this.curveModel!.registerObserver(this.controlPolygonView);
        this.curveModel!.registerObserver(this.curveView);
        this.curveModel!.registerObserver(this.curvatureExtremaView);
        this.curveModel!.registerObserver(this.transitionCurvatureExtremaView);
        this.curveModel!.registerObserver(this.inflectionsView);
        this.curveModel!.registerObserver(this.curveKnotsView);

        this.curveObservers.forEach(element => {
            if(this.curveModel !== undefined) {
                element.update(this.curveModel.spline)
                this.curveModel.registerObserver(element)
            } else {
                const error = new ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                error.logMessageToConsole();
            }
        });
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
        if(this.curveModel !== undefined) {
            if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
                this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 0, 0, 0.9, 1)
            } else {
                this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false, 216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05)
            }
        }
        else throw new Error("Unable to render the current frame. Undefined curve model")

        this.controlPointsView.renderFrame()
        this.insertKnotButtonView.renderFrame()

        this.curveObservers.forEach(element => {
            element.renderFrame()
        });
        /* JCL 2020/09/24 Add the display of clamped control points */
        if(this.controlOfCurveClamping && this.clampedControlPointView !== null) {
            this.clampedControlPointView.renderFrame()
        }

        if(this.curveModel !== undefined) {
            let curvatureEvents: number[] = []
            let differentialEvents: number[] = []
            if((this.activeExtremaLocationControl === ActiveExtremaLocationControl.stopDeforming || this.activeExtremaLocationControl === ActiveExtremaLocationControl.extremumLeaving ||
                this.activeExtremaLocationControl === ActiveExtremaLocationControl.extremumEntering) && this.selectedCurvatureExtrema !== null) {
                curvatureEvents = this.selectedCurvatureExtrema.slice()
            }
            if(this.activeInflectionLocationControl === ActiveInflectionLocationControl.stopDeforming && this.selectedInflection !== null) {
                differentialEvents = curvatureEvents.concat(this.selectedInflection)
            } else differentialEvents = curvatureEvents

            if(this.activeExtremaLocationControl === ActiveExtremaLocationControl.stopDeforming || this.activeExtremaLocationControl === ActiveExtremaLocationControl.extremumLeaving) {
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.differentialEventShaders, 0, 0, 1.0, 1)
            } else if(this.activeExtremaLocationControl === ActiveExtremaLocationControl.extremumEntering) {
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.differentialEventShaders, 0, 1.0, 0, 1)
            } else if(differentialEvents.length === 0) {
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.differentialEventShaders, 0, 1.0, 0, 1)
            }
        }
        else throw new Error("Unable to render the current frame. Undefined curve model")
        if(this.selectedDifferentialEventsView !== null && this.allowShapeSpaceChange === false) this.selectedDifferentialEventsView.renderFrame()

    }

    addCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        if(this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.registerObserver(curveObserver);
        } else throw new Error("Unable to attach a curve observer to the current curve. Undefined curve model")
    }

    removeCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        if(this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.removeObserver(curveObserver);
        } else throw new Error("Unable to detach a curve observer to the current curve. Undefined curve model")
    }

    resetCurveObserver(curveObserver: IRenderFrameObserver<BSpline_R1_to_R2_interface>) {
        if(this.curveModel !== undefined) {
            curveObserver.reset(this.curveModel.spline);
            /*this.curveModel.registerObserver(curveObserver);*/
        }
        else throw new Error("Unable to reset a curve observer to the current curve. Undefined curve model")
    }

    /* JCL 20202/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        this.controlOfCurveClamping = !this.controlOfCurveClamping
        console.log("control of curve clamping: " + this.controlOfCurveClamping)
        if(this.controlOfCurveClamping) {
            /* JCL 2020/09/24 Update the location of the clamped control point */
            let clampedControlPoint: Vector_2d[] = []
            if(this.curveModel !== undefined) {
                clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
            } else throw new Error("Unable to clamp a control point. Undefined curve model")
            this.clampedControlPointView = new ClampedControlPointView(clampedControlPoint, this.controlPointsShaders, 0, 1, 0)
            this.clampedControlPoints = []
            this.clampedControlPoints.push(0)
            this.activeLocationControl = ActiveLocationControl.firstControlPoint
            if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        } else this.activeLocationControl = ActiveLocationControl.none
    } 

    toggleControlOfCurvatureExtrema() {
        this.curveControl.toggleControlOfCurvatureExtrema()
        this.controlOfCurvatureExtrema = !this.controlOfCurvatureExtrema
        //console.log("control of curvature extrema: " + this.controlOfCurvatureExtrema)

        /* JCL 2021/12/02 Add control state for new code architecture */
        /* JCL 2021/12/02 controlOfCurvatureExtrema can be used to characterize the control state and set it appropriately when changing the navigation mode */
        this.curveControlState.handleCurvatureExtrema();
    }

    toggleControlOfInflections() {
        this.curveControl.toggleControlOfInflections()
        this.controlOfInflection = ! this.controlOfInflection
        //console.log("control of inflections: " + this.controlOfInflection)

        /* JCL 2021/12/02 Add control state for new code architecture */
        /* JCL 2021/12/02 controlOfInflection can be used to characterize the control state and set it appropriately when changing the navigation mode */
        this.curveControlState.handleInflections();
    }

    /* JCL test code debut */
    transitionTo(curveControlState: CurveControlState): void {
        this.curveControlState = curveControlState;
        this.curveControlState.setContext(this);
    }

    curveConstraintTransitionTo(curveConstraintSelectionState: CurveConstraintSelectionState): void {
        this.curveConstraintSelectionState = curveConstraintSelectionState;
        this.curveConstraintSelectionState.setContext(this);
    }

    inputSelectNavigationProcess(navigationID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
        warning.logMessageToConsole();

        switch(navigationID) {
            case 0: {
                this.navigationState.setNavigationWithoutShapeSpaceMonitoring();
                break;
            }
            case 1: {
                this.navigationState.setNavigationThroughSimplerShapeSpaces();
                break;
            }
            case 2: {
                this.navigationState.setNavigationStrictlyInsideShapeSpace();
                break;
            }
            default: {
                let error = new ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessageToConsole();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    }

    toggleControlCurveEventsAtExtremities() {
        this.curveEventAtExtremityMayVanish = ! this.curveEventAtExtremityMayVanish;
        this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
    }

    /* JCL fin test code */

    toggleSliding() {
        if(this.curveModel !== undefined) {
            if(this.sliding) {
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
        } else throw new Error("Unable to slide curvature extrema and/or inflexion points. Undefined curve model")
    
        /* JCL 2021/10/12 Add curveControlState for new code architecture */
        this.curveControlState.handleSliding();
    }

    leftMouseDown_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01) {
        if(this.curveModel !== undefined) {
            if(this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== null) {
                let cp = this.selectedControlPoint
                if(cp === 0) { cp += 1}
                if(cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1} 
                const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae()
                if(cp != null) {
                    this.curveModel.spline.insertKnot(grevilleAbscissae[cp])
                    this.curveControl.resetCurve(this.curveModel)
                    if(this.activeLocationControl === ActiveLocationControl.both) {
                        if(this.clampedControlPoints[0] === 0) {
                            this.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                        } else this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                    }
                    else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                        this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                    }

                    // JCL after resetting the curve the activeControl parameter is reset to 2 independently of the control settings
                    // JCL the curveControl must be set in accordance with the current status of controls
                    if(this.sliding) {
                        this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
                        this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
                        this.selectedInflection = null
                        this.selectedCurvatureExtrema = null
                        this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                    }
                    else {
                        this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                    }
                    this.curveModel.notifyObservers()
                }
            }
            
            if(this.activeLocationControl === ActiveLocationControl.both && this.selectedControlPoint === null) {
                /* JCL 2020/09/28 Reinitialize the curve optimization context after releasing the conotrol point dragging mode */
                if(this.sliding) {
                    this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
                    this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
                    this.selectedInflection = null
                    this.selectedCurvatureExtrema = null
                    this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                else {
                    this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                this.curveModel.notifyObservers()
            }
            this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
            this.controlPointsView.setSelected(this.selectedControlPoint);
            if(this.selectedControlPoint !== null) {
                this.dragging = true;
            }
        } else throw new Error("Unable to process the current selection. Undefined curve model")
    }


    leftMouseDragged_event(ndcX: number, ndcY: number) {
        const x = ndcX,
        y = ndcY,
        selectedControlPoint = this.controlPointsView.getSelectedControlPoint()
        if(this.curveModel !== undefined) {
            /* JCL 2020/09/27 Add clamping condition when dragging a control point */
            //if (selectedControlPoint != null && this.dragging === true && this.activeLocationControl !== ActiveLocationControl.stopDeforming 
            //    && (this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming || this.allowShapeSpaceChange === true)) {
            if (selectedControlPoint != null && this.dragging === true && this.activeLocationControl !== ActiveLocationControl.stopDeforming) {
                // JCL new code
                this.curveShapeSpaceNavigator.navigateSpace(selectedControlPoint, x, y);
                if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                    /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                    because it is part of the optimize method (whether sliding is active or not) */
                    this.curveModel.setControlPoint(selectedControlPoint, x, y)
                } else if((this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming && this.activeInflectionLocationControl !== ActiveInflectionLocationControl.stopDeforming) 
                        || this.allowShapeSpaceChange === true) {
                    /*if(this.curveControl instanceof SlidingStrategy && this.curveControl.lastDiffEvent !== NeighboringEventsType.none) {
                        if(this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumLeftBoundary || this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumRightBoundary) {

                        }
                    }*/
                    this.curveControl.optimize(selectedControlPoint, x, y)
                }

                this.curveModel.notifyObservers()
                if(this.clampedControlPoints.length > 0) {
                    let clampedControlPoint: Vector_2d[] = [];
                    for(let controlP of this.clampedControlPoints) {
                        clampedControlPoint.push(this.curveModel.spline.controlPoints[controlP])
                    }
                    if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
                }
                /*let curvatureEvents: number[] = []
                let differentialEvents: number[] = []
                if(this.selectedCurvatureExtrema !== null && this.allowShapeSpaceChange === false) curvatureEvents = this.selectedCurvatureExtrema.slice()
                if(this.selectedInflection !== null && this.allowShapeSpaceChange === false) differentialEvents = curvatureEvents.concat(this.selectedInflection)
                this.selectedDifferentialEventsView.update(this.curveModel.spline, differentialEvents)*/

            }
        } else throw new Error("Unable to drag the selected control point. Undefined curve model")

    }

    leftMouseUp_event() {
        this.dragging = false;
        if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
            this.activeLocationControl = ActiveLocationControl.both
            this.selectedControlPoint = null
        }
        if(this.activeInflectionLocationControl === ActiveInflectionLocationControl.stopDeforming) {
            this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        }
        if(this.activeExtremaLocationControl === ActiveExtremaLocationControl.stopDeforming) {
            this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        }
    }

    shiftKeyDown() {
        this.allowShapeSpaceChange = true;
        // JCL 2021/12/03 code added for new architecture
        this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
        let message = new WarningLog(this.constructor.name, " shiftKeyDown ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    shiftKeyUp() {
        this.allowShapeSpaceChange = false
        // JCL 2021/12/03 code added for new architecture
        this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
        let message = new WarningLog(this.constructor.name, " shiftKeyUp ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree: number) {
        if(this.curveModel !== undefined) {
            if(curveDegree > this.curveModel.spline.degree) {
                let controlPoints = this.curveModel.spline.controlPoints
                let knots = this.curveModel.spline.knots
                for(let i = 0; i < (curveDegree - this.curveModel.spline.degree); i += 1) {
                    let aSpline = new BSpline_R1_to_R2_degree_Raising(controlPoints, knots)
                    let newSpline = aSpline.degreeIncrease()
                    controlPoints = newSpline.controlPoints
                    knots = newSpline.knots
                }
                this.curveModel.spline.renewCurve(controlPoints, knots)
                this.curveControl.resetCurve(this.curveModel)

                if(this.activeLocationControl === ActiveLocationControl.both) {
                    if(this.clampedControlPoints[0] === 0){
                        this.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                    } else this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                }
                else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                    this.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                }

                if (this.sliding) {
                    this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                else {
                    this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
                }
                this.curveModel.notifyObservers()
            }
        } else throw new Error("Unable to assign a new degree to the curve. Undefined curve model")
    }

    /* JCL 2020/09/25 Management of the dble click on a clamped control point */
    dbleClick_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01): boolean {
        if(this.curveModel !== undefined) {
                                
            // JCL 2021/10/19 code pour nvelle architecture
            let selectedControlPoint = this.controlPointsView.getSelectedControlPoint();
            if(selectedControlPoint === 0 ) {
                this.constraintAtPoint1 = ! this.constraintAtPoint1;
                this.curveConstraintSelectionState.handleCurveConstraintAtPoint1();
            }
            if(selectedControlPoint === (this.curveModel.spline.controlPoints.length - 1)) {
                this.constraintAtPoint2 = ! this.constraintAtPoint2;
                this.curveConstraintSelectionState.handleCurveConstraintAtPoint2();
            }
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
                            return false
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
                            return true
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
                            return true
                        } else return true
                    } else return true;
                } else return true
            } else return true
        } else {
            throw new Error("Unable to process the selected point for clamping. Undefined curve model")
        }
    }

}
