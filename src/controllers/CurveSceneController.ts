import { CurveModel } from "../newModels/CurveModel"
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveView } from "../views/CurveView";
import { SceneControllerInterface } from "./SceneControllerInterface";
import { InsertKnotButtonShaders } from "../views/InsertKnotButtonShaders";
import { ClickButtonView } from "../views/ClickButtonView";
import { CurvatureExtremaView } from "../views/CurvatureExtremaView";
import { InflectionsView } from "../views/InflectionsView";
import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { NeighboringEventsType, NeighboringEvents, SlidingStrategy } from "./SlidingStrategy";
import { NoSlidingStrategy } from "./NoSlidingStrategy";
import { TransitionCurvatureExtremaView } from "../views/TransitionCurvatureExtremaView";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IRenderFrameObserver } from "../newDesignPatterns/RenderFrameObserver";

/* JCL 2020/09/24 Add the visualization of clamped control points */
import { ClampedControlPointView } from "../views/ClampedControlPointView"
import { Vector2d } from "../mathVector/Vector2d";
/* JCL 2020/10/02 Add the visualization of knots */
import { CurveKnotsView } from "../views/CurveKnotsView"

//import * as fs from "fs";
import { saveAs } from "file-saver";
import { NONAME } from "dns";

import { SelectedDifferentialEventsView } from "../views/SelectedDifferentialEventsView"
import { ShapeNavigableCurve, ActiveLocationControl } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { ShapeSpaceConfiguratorWithInflectionsNoSliding, ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { CurveControlState, HandleInflectionsAndCurvatureExtremaNoSlidingState, HandleNoDiffEventNoSlidingState } from "./CurveControlState";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { NavigationState } from "../curveShapeSpaceNavigation/NavigationState";
import { ActiveExtremaLocationControl, ActiveInflectionLocationControl, AbstractCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { CurveConstraintSelectionState, HandleConstraintAtPoint1ConstraintPoint2NoConstraintState } from "./CurveConstraintSelectionState";
import { CurveModelDefinitionEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { convertToBsplR1_to_R2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { DummyStrategy } from "./DummyStrategy";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelObserverInCurveSceneController } from "../models/CurveModelObserver";
import { HighlightedControlPolygonView } from "../views/HighlightedControlPolygonView";

// Margin expressed in pixel size
const MARGIN_WINDOW_CANVAS = 150;
// Window background color setting
const BACKGROUND_RED_COLOR = 0.3;
const BACKGROUND_GREEN_COLOR = 0.3;
const BACKGROUND_BLUE_COLOR = 0.3;
const BACKGROUND_ALPHA = 1.0;

export class CurveSceneController implements SceneControllerInterface {

    private selectedControlPoint: number | null = null
    public selectedCurvatureExtrema: number[] | null = null
    public selectedInflection: number[] | null = null
    public allowShapeSpaceChange: boolean = false
    private selectedDifferentialEventsView: SelectedDifferentialEventsView
    /* JCL 2020/10/18 Moved CurveModel to public */
    //public curveModel: CurveModel
    private controlPointsView: ControlPointsView
    private controlPolygonView: ControlPolygonView
    private highlightedControlPolygonView: HighlightedControlPolygonView;
    private curveView: CurveView
    private insertKnotButtonShaders: InsertKnotButtonShaders
    private insertKnotButtonView: ClickButtonView
    private dragging: boolean = false
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
    private clampedControlPointView: ClampedControlPointView
    /* JCL 2020/09/23 Add management of the curve location */
    public activeLocationControl: ActiveLocationControl = ActiveLocationControl.none

    /* JCL 2020/10/02 Add the visualization of knots */
    private curveKnotsView: CurveKnotsView
    /* JCL 2020/11/06 Add management of the curvature extrema and inflections */
    public activeExtremaLocationControl: ActiveExtremaLocationControl = ActiveExtremaLocationControl.none
    public activeInflectionLocationControl: ActiveInflectionLocationControl = ActiveInflectionLocationControl.none
    public stackControlPolygons: Array<Array<Vector2d>> = []
    public sizeStackControlPolygons: number = this.stackControlPolygons.length
    public readonly MAX_NB_CONFIGS_CP = 5
    public counterLostEvent: number = 0
    public lastLostEvent: NeighboringEvents = {event: NeighboringEventsType.none, index: 0}

    /* JCL 2021/09/29 Add modeller for new code architecture */
    private curveModelerEventListener: CurveModelDefinitionEventListener;
    public shapeNavigableCurve: ShapeNavigableCurve;
    public shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    public shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    // private curveControlState: CurveControlState;
    private navigationState: NavigationState;
    public curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    public curveEventAtExtremityMayVanish: boolean;
    // public eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    private constraintAtPoint1: boolean;
    private constraintAtPoint2: boolean;
    private curveConstraintSelectionState: CurveConstraintSelectionState;
    public curveModel: CurveModelInterface

    private curveObservers: Array<IRenderFrameObserver<BSplineR1toR2Interface>> = []
    
    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext,
        curveModelDefinitionEventListener: CurveModelDefinitionEventListener) {

        this.curveModelerEventListener = curveModelDefinitionEventListener
        this.shapeNavigableCurve = curveModelDefinitionEventListener.shapeNavigableCurve
        this.curveModel = curveModelDefinitionEventListener.curveModel
        this.curveShapeSpaceNavigator = this.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator;

        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.gl);
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
        this.curveView = new CurveView(this.curveModel.spline, this.gl);
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl)
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders)
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.spline, this.gl);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.curveModel.spline, this.gl);
        this.inflectionsView = new InflectionsView(this.curveModel.spline, this.gl);
        this.curveKnotsView = new CurveKnotsView(this.curveModel.spline, this.gl);
        
        let selectedEvent: number[]= []
        this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, selectedEvent, this.gl, 0, 0, 1, 1)

        /* JCL 2020/09/24 Add default clamped control point */
        this.clampedControlPointView = new ClampedControlPointView(this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints, this.gl)
        // temporaire
        this.highlightedControlPolygonView = new HighlightedControlPolygonView(this.curveModel.spline, this.gl);

        this.activeLocationControl = this.shapeNavigableCurve.activeLocationControl
        this.activeExtremaLocationControl = this.curveShapeSpaceNavigator.activeExtremaLocationControl
        this.activeInflectionLocationControl = this.curveShapeSpaceNavigator.activeInflectionLocationControl

        this.allowShapeSpaceChange = false

        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.controlOfCurvatureExtrema
        this.controlOfInflection = this.curveShapeSpaceNavigator.controlOfInflection
        this.controlOfCurveClamping = this.shapeNavigableCurve.controlOfCurveClamping

        this.registerCurveObservers();
        this.shapeNavigableCurve.registerObserver(new CurveModelObserverInCurveSceneController(this));

        /* JCL 2020/09/24 update the display of clamped control points (cannot be part of observers) */
        this.clampedControlPointView.update(this.curveModel.spline)
        this.selectedDifferentialEventsView.update(this.curveModel.spline, selectedEvent)

        if(this.curveModel instanceof CurveModel) {
            this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        } else {
            const dummyCurveModel = new ClosedCurveModel()
            this.curveControl = new DummyStrategy(dummyCurveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl);
        }

        this.sliding = this.curveShapeSpaceNavigator.sliding

        /* JCL 2021/09/29 Add modeller for new code architecture */
        this.curveEventAtExtremityMayVanish = true;
        this.constraintAtPoint1 = true;
        this.constraintAtPoint2 = false;
        // this.curveModeler = new CurveModeler();
        this.navigationState = this.curveShapeSpaceNavigator.navigationState;
        this.navigationState.setNavigationWithoutShapeSpaceMonitoring();
        this.shapeSpaceDiffEventsConfigurator = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator;
        this.shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        // this.curveControlState = new HandleNoDiffEventNoSlidingState(this);

        // this.eventMgmtAtCurveExtremities = this.curveShapeSpaceNavigator.eventMgmtAtCurveExtremities;
        this.curveConstraintSelectionState = new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this);
        console.log("end constructor curveSceneController")
    }


    initCurveSceneView(): void {
        this.controlPointsView = new ControlPointsView(this.curveModel.spline, this.gl);
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
        this.insertKnotButtonShaders = new InsertKnotButtonShaders(this.gl);
        this.insertKnotButtonView = new ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders);
        this.curveView = new CurveView(this.curveModel.spline, this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView(this.curveModel.spline, this.gl);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.curveModel.spline, this.gl);
        this.inflectionsView = new InflectionsView(this.curveModel.spline, this.gl);
        this.curveKnotsView = new CurveKnotsView(this.curveModel.spline, this.gl);
        this.shapeNavigableCurve.clampedControlPoints.push(0);
        this.clampedControlPointView = new ClampedControlPointView(this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints, this.gl);
        
        this.registerCurveObservers();

        this.controlOfCurvatureExtrema = true;
        this.controlOfInflection = true;
        this.controlOfCurveClamping = true;

        if(this.shapeNavigableCurve.clampedControlPoints.length !== 0) {
            this.shapeNavigableCurve.clampedControlPoints = [];
            this.shapeNavigableCurve.clampedControlPoints[0] = 0;
        }

        this.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this.dragging = false;
        this.selectedControlPoint = null;
        if(this.curveModel instanceof CurveModel) {
            this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this);
        }

        this.sliding = true;
    }

    registerCurveObservers(): void {
        this.curveModel.registerObserver(this.controlPointsView, "control points");
        this.curveModel.registerObserver(this.controlPolygonView, "control points");
        this.curveModel.registerObserver(this.curveView, "curve");
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve");
        this.curveModel.registerObserver(this.transitionCurvatureExtremaView, "curve");
        this.curveModel.registerObserver(this.inflectionsView, "curve");
        this.curveModel.registerObserver(this.curveKnotsView, "control points");
        this.curveModel.registerObserver(this.clampedControlPointView, "control points");

        if(this.curveModel instanceof CurveModel) {
            this.curveModel.observers.forEach(element => {
                if(this.curveModel !== undefined) {
                    element.update(this.curveModel.spline)
                } else {
                    const error = new ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessageToConsole();
                }
            });
        } else if(this.curveModel instanceof ClosedCurveModel) {
            this.curveModel.observers.forEach(element => {
                if(this.curveModel !== undefined) {
                    element.update(this.curveModel.spline)
                } else {
                    const error = new ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessageToConsole();
                }
            });
        }

    }

    setupWindowBackground(): void {
        const size = Math.min(window.innerWidth, window.innerHeight) - MARGIN_WINDOW_CANVAS;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height); 
        this.gl.clearColor(BACKGROUND_RED_COLOR, BACKGROUND_GREEN_COLOR, BACKGROUND_BLUE_COLOR, BACKGROUND_ALPHA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    renderFrame(): void {
        this.setupWindowBackground();
        this.curveView.renderFrame()
        this.curvatureExtremaView.renderFrame()
        this.transitionCurvatureExtremaView.renderFrame()
        this.inflectionsView.renderFrame()
        this.controlPolygonView.renderFrame()

        this.curveKnotsView.renderFrame()
        if(this.curveModel !== undefined) {
            if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
                this.highlightedControlPolygonView = new HighlightedControlPolygonView(this.curveModel.spline, this.gl, false);
            } else {
                this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
            }
        }
        else throw new Error("Unable to render the current frame. Undefined curve model")

        this.controlPointsView.renderFrame()
        this.insertKnotButtonView.renderFrame()

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
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.gl, 0, 0, 1.0, 1)
            } else if(this.activeExtremaLocationControl === ActiveExtremaLocationControl.extremumEntering) {
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.gl, 0, 1.0, 0, 1)
            } else if(differentialEvents.length === 0) {
                this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, differentialEvents, this.gl, 0, 1.0, 0, 1)
            }
        }
        else throw new Error("Unable to render the current frame. Undefined curve model")
        if(this.selectedDifferentialEventsView !== null && this.allowShapeSpaceChange === false) this.selectedDifferentialEventsView.renderFrame()

    }

    addCurveObserver(curveObserver: IRenderFrameObserver<BSplineR1toR2Interface>) {
        if(this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.registerObserver(curveObserver, "curve");
            
        } else throw new Error("Unable to attach a curve observer to the current curve. Undefined curve model")
    }

    removeCurveObserver(curveObserver: IRenderFrameObserver<BSplineR1toR2Interface>) {
        if(this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.removeObserver(curveObserver, "curve");
        } else throw new Error("Unable to detach a curve observer to the current curve. Undefined curve model")
    }

    curveConstraintTransitionTo(curveConstraintSelectionState: CurveConstraintSelectionState): void {
        this.curveConstraintSelectionState = curveConstraintSelectionState;
        this.curveConstraintSelectionState.setContext(this);
    }

    toggleControlCurveEventsAtExtremities() {
        this.curveEventAtExtremityMayVanish = ! this.curveEventAtExtremityMayVanish;
        // this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
    }


    leftMouseDown_event(ndcX: number, ndcY: number, deltaSquared: number = 0.01) {
        // if(this.curveModel !== undefined && this.curveModel instanceof CurveModel) {
        if(this.curveModel !== undefined) {
            if(this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== null) {
                let cp = this.selectedControlPoint
                if(cp === 0) { cp += 1}
                if(cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1} 
                const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae()
                if(cp != null) {
                    const spline = this.curveModel.spline;
                    spline.insertKnot(grevilleAbscissae[cp], 1)
                    this.curveModel.setSpline(spline);
                    // this.curveModel.spline.insertKnot(grevilleAbscissae[cp], 1)
                    this.curveControl.resetCurve(this.curveModel)
                    if(this.activeLocationControl === ActiveLocationControl.both) {
                        if(this.shapeNavigableCurve.clampedControlPoints[0] === 0) {
                            this.shapeNavigableCurve.clampedControlPoints[1] = this.curveModel.spline.controlPoints.length - 1
                        } else this.shapeNavigableCurve.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                    }
                    else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                        this.shapeNavigableCurve.clampedControlPoints[0] = this.curveModel.spline.controlPoints.length - 1
                    }

                    // JCL after resetting the curve the activeControl parameter is reset to 2 independently of the control settings
                    // JCL the curveControl must be set in accordance with the current status of controls
                    if(this.curveModel instanceof CurveModel) {
                        if(this.sliding) {
                            this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
                            this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
                            this.selectedInflection = null
                            this.selectedCurvatureExtrema = null
                            this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this);
                        }
                        else {
                            this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl)
                        }
                    }
                    this.curveModel.notifyObservers()
                }
            }
            
            if(this.curveModel instanceof CurveModel) {
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
                        this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl)
                    }
                    this.curveModel.notifyObservers()
                }
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
                    this.curveModel.setControlPointPosition(selectedControlPoint, x, y)
                } else if((this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming && this.activeInflectionLocationControl !== ActiveInflectionLocationControl.stopDeforming) 
                        || this.allowShapeSpaceChange === true) {
                    /*if(this.curveControl instanceof SlidingStrategy && this.curveControl.lastDiffEvent !== NeighboringEventsType.none) {
                        if(this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumLeftBoundary || this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumRightBoundary) {

                        }
                    }*/
                    this.curveControl.optimize(selectedControlPoint, x, y)
                }

                this.curveModel.notifyObservers()
                // if(this.curveModeler.clampedControlPoints.length > 0) {
                //     let clampedControlPoint: Vector_2d[] = [];
                //     for(let controlP of this.curveModeler.clampedControlPoints) {
                //         clampedControlPoint.push(this.curveModel.spline.controlPoints[controlP])
                //     }
                //     if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
                // }
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
        // this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
        // let message = new WarningLog(this.constructor.name, " shiftKeyDown ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        // message.logMessageToConsole();
    }

    shiftKeyUp() {
        this.allowShapeSpaceChange = false
        // JCL 2021/12/03 code added for new architecture
        // this.eventMgmtAtCurveExtremities.processEventAtCurveExtremity();
        // let message = new WarningLog(this.constructor.name, " shiftKeyUp ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        // message.logMessageToConsole();
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
                        if(this.shapeNavigableCurve.clampedControlPoints.length === 1 && this.shapeNavigableCurve.clampedControlPoints[0] === selectedClampedControlPoint) {
                            console.log("dlble_click: no cp left")
                            // this.clampedControlPointView = null
                            this.shapeNavigableCurve.clampedControlPoints.pop()
                            this.activeLocationControl = ActiveLocationControl.none
                            return false
                        }
                        else if(this.shapeNavigableCurve.clampedControlPoints.length === 1 && this.shapeNavigableCurve.clampedControlPoints[0] !== selectedClampedControlPoint 
                            && (selectedClampedControlPoint === 0 || selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1))) {
                            console.log("dlble_click: two cp clamped")
                            this.shapeNavigableCurve.clampedControlPoints.push(selectedClampedControlPoint)
                            let clampedControlPoint: Vector2d[] = []
                            clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                            clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                            this.clampedControlPointView = new ClampedControlPointView(this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints, this.gl)
                            this.activeLocationControl = ActiveLocationControl.both
                            return true
                        }
                        else if(this.shapeNavigableCurve.clampedControlPoints.length === 2) {
                            if(selectedClampedControlPoint === 0) {
                                console.log("dlble_click: last cp left")
                                if(this.shapeNavigableCurve.clampedControlPoints[1] === selectedClampedControlPoint) {
                                    this.shapeNavigableCurve.clampedControlPoints.pop()
                                } else this.shapeNavigableCurve.clampedControlPoints.splice(0, 1)
                                let clampedControlPoint: Vector2d[] = []
                                clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                                this.clampedControlPointView = new ClampedControlPointView(this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints, this.gl)
                                this.activeLocationControl = ActiveLocationControl.lastControlPoint
                                console.log("dble click: clampedControlPoints " + this.shapeNavigableCurve.clampedControlPoints)
                            } else if(selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1)) {
                                console.log("dlble_click: first cp left")
                                if(this.shapeNavigableCurve.clampedControlPoints[1] === selectedClampedControlPoint) {
                                    this.shapeNavigableCurve.clampedControlPoints.pop()
                                } else this.shapeNavigableCurve.clampedControlPoints.splice(0, 1)
                                let clampedControlPoint: Vector2d[] = []
                                clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                                this.clampedControlPointView = new ClampedControlPointView(this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints, this.gl)
                                this.activeLocationControl = ActiveLocationControl.firstControlPoint
                                console.log("dble click: clampedControlPoints " + this.shapeNavigableCurve.clampedControlPoints)
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
