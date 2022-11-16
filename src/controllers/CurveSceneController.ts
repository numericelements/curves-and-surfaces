import { CurveModel } from "../newModels/CurveModel"
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveView } from "../views/CurveView";
import { SceneControllerInterface } from "./SceneControllerInterface";
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
import { ShapeNavigableCurve, ActiveLocationControl, NO_CONSTRAINT } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { ShapeSpaceConfiguratorWithInflectionsNoSliding, ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { CurveControlState, HandleInflectionsAndCurvatureExtremaNoSlidingState, HandleNoDiffEventNoSlidingState } from "./CurveControlState";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { NavigationState } from "../curveShapeSpaceNavigation/NavigationState";
import { ActiveExtremaLocationControl, ActiveInflectionLocationControl, CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { CurveConstraintSelectionState, HandleConstraintAtPoint1ConstraintPoint2NoConstraintState, HandleConstraintAtPoint1Point2NoConstraintState } from "./CurveConstraintSelectionState";
import { CurveModelDefinitionEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { convertToBsplR1_to_R2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { DummyStrategy } from "./DummyStrategy";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelObserverInCurveSceneController } from "../models/CurveModelObserver";
import { HighlightedControlPolygonView } from "../views/HighlightedControlPolygonView";
import { CurveDifferentialEventsLocationInterface } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocationsInterface";
import { SLCTN_ACCURACY_Squared } from "../views/AbstractMouseSelectableGraphicEntityView";
import { CurveDifferentialEventsLocations } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocations";
import { AbstractCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/AbstractCurveDifferentialEventsExtractor";
import { OpenPlanarCurve } from "../shapeNavigableCurve/CurveCategory";
import { SceneInteractionStrategy } from "../designPatterns/SceneInteractionStrategy";
import { CurveSceneControllerKnotInsertion, CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection, CurveSceneControllerNoShapeSpaceConstraintsCPSelection, CurveSceneControllerStrictlyInsideShapeSpaceCPSelection } from "./CurveSceneControllerInteractionStrategy";

// Margin expressed in pixel size
const MARGIN_WINDOW_CANVAS = 150;
// Window background color setting
const BACKGROUND_RED_COLOR = 0.3;
const BACKGROUND_GREEN_COLOR = 0.3;
const BACKGROUND_BLUE_COLOR = 0.3;
const BACKGROUND_ALPHA = 1.0;

export class CurveSceneController implements SceneControllerInterface {

    private _selectedControlPoint: number | null
    public selectedCurvatureExtrema: number[] | null = null
    public selectedInflection: number[] | null = null
    private _allowShapeSpaceChange: boolean = false
    private selectedDifferentialEventsView: SelectedDifferentialEventsView
    /* JCL 2020/10/18 Moved CurveModel to public */
    //public curveModel: CurveModel
    private _controlPointsView: ControlPointsView
    private controlPolygonView: ControlPolygonView
    private highlightedControlPolygonView: HighlightedControlPolygonView;
    private curveView: CurveView
    private _insertKnotButtonView: ClickButtonView;
    private _controlOfKnotInsertion: boolean;
    private _sceneInteractionStrategy: SceneInteractionStrategy;
    private dragging: boolean = false
    private curvatureExtremaView: CurvatureExtremaView
    private transitionCurvatureExtremaView: TransitionCurvatureExtremaView
    private inflectionsView: InflectionsView
    // private _curveControl: CurveControlStrategyInterface
    /* JCL 2020/10/18 Moved sliding, controlOfCurvatureExtrema, controlOfInflection, controlOfCurveClamping to public */
    public sliding: boolean
    public controlOfCurvatureExtrema: boolean
    public controlOfInflection: boolean
    public controlOfCurveClamping: boolean
    /* JCL 2020/09/24 Add visualization and selection of clamped control points */
    private _clampedControlPointView: ClampedControlPointView
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
    private curveModelDefinitionEventListener: CurveModelDefinitionEventListener;
    public readonly shapeNavigableCurve: ShapeNavigableCurve;
    private _navigationState: NavigationState;
    public readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private curveEventAtExtremityMayVanish: boolean;
    // private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private _curveConstraintSelectionState: CurveConstraintSelectionState;
    public curveModel: CurveModelInterface
    public curveModelDifferentialEventsExtractor: CurveDifferentialEventsLocationInterface;
    public curveDiffEventsLocations: CurveDifferentialEventsLocations;

    private curveObservers: Array<IRenderFrameObserver<BSplineR1toR2Interface>> = []
    
    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext,
        curveModelDefinitionEventListener: CurveModelDefinitionEventListener,
        shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener) {

        this._selectedControlPoint = null;
        this.curveModel = curveModelDefinitionEventListener.curveModel;
        this.shapeNavigableCurve = curveModelDefinitionEventListener.shapeNavigableCurve;
        this._controlOfKnotInsertion = false;
        this.curveModelDefinitionEventListener = curveModelDefinitionEventListener;
        this.curveShapeSpaceNavigator = shapeSpaceNavigationEventListener.curveShapeSpaceNavigator;
        this.curveModelDifferentialEventsExtractor = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this.curveDiffEventsLocations = this.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;
        this._controlPointsView = new ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
        this.curveView = new CurveView(this.gl, this.curveModel.spline);
        this._insertKnotButtonView = new ClickButtonView(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView(this.gl, this.curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.gl, this.curveDiffEventsLocations);
        this.inflectionsView = new InflectionsView(this.gl, this.curveDiffEventsLocations);
        this.curveKnotsView = new CurveKnotsView(this.gl, this.curveModel.spline);
        this._clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this.shapeNavigableCurve.clampedPoints);
        this._sceneInteractionStrategy = new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this);

        // JCL temporary modif
        this.curveShapeSpaceNavigator.curveSceneController = this;
        
        let selectedEvent: number[]= []
        this.selectedDifferentialEventsView = new SelectedDifferentialEventsView(this.curveModel.spline, selectedEvent, this.gl, 0, 0, 1, 1)

        this.highlightedControlPolygonView = new HighlightedControlPolygonView(this.curveModel.spline, this.gl);

        this.activeLocationControl = this.shapeNavigableCurve.activeLocationControl
        this.activeExtremaLocationControl = this.curveShapeSpaceNavigator.activeExtremaLocationControl
        this.activeInflectionLocationControl = this.curveShapeSpaceNavigator.activeInflectionLocationControl

        this._allowShapeSpaceChange = true

        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.controlOfInflection = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurveClamping = this.shapeNavigableCurve.controlOfCurveClamping

        this.registerCurveObservers();
        this.shapeNavigableCurve.registerObserver(new CurveModelObserverInCurveSceneController(this));

        /* JCL 2020/09/24 update the display of clamped control points (cannot be part of observers) */
        this._clampedControlPointView.update(this.curveModel.spline)
        this.selectedDifferentialEventsView.update(this.curveModel.spline, selectedEvent)

        // this._eventMgmtAtExtremities = this.shapeNavigableCurve.eventMgmtAtExtremities;
        this.curveEventAtExtremityMayVanish = false;
        // if(this.curveModel instanceof CurveModel) {                                                                                                                                                                                                   
        //     this._curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        // } else {
        //     const dummyCurveModel = new ClosedCurveModel();
        //     this._curveControl = new DummyStrategy(dummyCurveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl);
        // }

        this.sliding = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.slidingDifferentialEvents;

        /* JCL 2021/09/29 Add modeller for new code architecture */
        this._navigationState = this.curveShapeSpaceNavigator.navigationState;
        this._navigationState.setNavigationWithoutShapeSpaceMonitoring();

        this._curveConstraintSelectionState = new HandleConstraintAtPoint1Point2NoConstraintState(this);
        console.log("end constructor curveSceneController")
    }

    get clampedControlPointView(): ClampedControlPointView {
        return this._clampedControlPointView;
    }

    get insertKnotButtonView(): ClickButtonView {
        return this._insertKnotButtonView;
    }

    get controlPointsView(): ControlPointsView {
        return this._controlPointsView;
    }

    get curveConstraintSelectionState(): CurveConstraintSelectionState {
        return this._curveConstraintSelectionState;
    }

    get controlOfKnotInsertion(): boolean {
        return this._controlOfKnotInsertion;
    }

    get selectedControlPoint(): number | null {
        return this._selectedControlPoint;
    }

    get sceneInteraction(): SceneInteractionStrategy {
        return this._sceneInteractionStrategy;
    }

    // get eventMgmtAtExtremities(): EventMgmtAtCurveExtremities {
    //     return this._eventMgmtAtExtremities;
    // }

    // get curveControl(): CurveControlStrategyInterface {
    //     return this._curveControl;
    // }
    get allowShapeSpaceChange(): boolean {
        return this._allowShapeSpaceChange;
    }

    get navigationState(): NavigationState {
        return this._navigationState;
    }

    set selectedControlPoint(selectedCPIndex: number | null) {
        this._selectedControlPoint = selectedCPIndex;
    }

    set navigationState(navigationState: NavigationState) {
        this._navigationState = navigationState;
    }

    initCurveSceneView(): void {
        this._controlPointsView = new ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
        this._insertKnotButtonView = new ClickButtonView(this.gl);
        this.curveView = new CurveView(this.gl, this.curveModel.spline);
        this.curveKnotsView = new CurveKnotsView(this.gl, this.curveModel.spline);
        this.inflectionsView = new InflectionsView(this.gl, this.curveDiffEventsLocations);
        this.curvatureExtremaView = new CurvatureExtremaView(this.gl, this.curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.gl, this.curveDiffEventsLocations);
        this._clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this.shapeNavigableCurve.clampedPoints);
        
        this.registerCurveObservers();

        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.controlOfCurvatureExtrema;
        this.controlOfInflection = this.curveShapeSpaceNavigator.controlOfInflection;
        this.sliding = this.curveShapeSpaceNavigator.sliding;
        this.controlOfCurveClamping = this.shapeNavigableCurve.controlOfCurveClamping;

        this.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this.dragging = false;
        this._selectedControlPoint = null;
        // if(this.curveModel instanceof CurveModel) {
        //     this._curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this);
        // }
    }

    registerCurveObservers(): void {
        this.curveModel.registerObserver(this._controlPointsView, "control points");
        this.curveModel.registerObserver(this.controlPolygonView, "control points");
        this.curveModel.registerObserver(this.curveView, "curve");
        this.curveModel.registerObserver(this.curveKnotsView, "control points");
        this.curveModel.registerObserver(this._clampedControlPointView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.curvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.transitionCurvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.inflectionsView, "control points");

        this.curveModelDifferentialEventsExtractor.observersCP.forEach(element => {
            element.update(this.curveDiffEventsLocations)
        });

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

        this.curveModel.checkObservers();
    }

    removeCurveObservers(): void {
        this.curveModel.removeObserver(this._controlPointsView, "control points");
        this.curveModel.removeObserver(this.controlPolygonView, "control points");
        this.curveModel.removeObserver(this.curveView, "curve");
        this.curveModel.removeObserver(this.curveKnotsView, "control points");
        this.curveModel.removeObserver(this._clampedControlPointView, "control points");
        this.curveModelDifferentialEventsExtractor.removeObserver(this.curvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.removeObserver(this.transitionCurvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.removeObserver(this.inflectionsView, "control points");
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
            // if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
            //     this.highlightedControlPolygonView = new HighlightedControlPolygonView(this.curveModel.spline, this.gl, false);
            // } else {
            //     this.controlPolygonView = new ControlPolygonView(this.curveModel.spline, this.gl, false);
            // }
        }
        else throw new Error("Unable to render the current frame. Undefined curve model")

        this._controlPointsView.renderFrame()
        this._insertKnotButtonView.renderFrame()

        /* JCL 2020/09/24 Add the display of clamped control points */
        if(this.controlOfCurveClamping && this._clampedControlPointView !== null) {
            this._clampedControlPointView.renderFrame()
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
        this._curveConstraintSelectionState = curveConstraintSelectionState;
    }

    changeSceneInteraction(sceneInteraction: SceneInteractionStrategy): void {
        this._sceneInteractionStrategy = sceneInteraction;
    }

    leftMouseDown_event(ndcX: number, ndcY: number) {
        const previousSceneInteractionStrategy = this._sceneInteractionStrategy;
        this._sceneInteractionStrategy.processLeftMouseDownInteraction(ndcX, ndcY);
        // if(this._sceneInteractionStrategy instanceof CurveSceneControllerKnotInsertion) {
        //     if(previousSceneInteractionStrategy instanceof CurveSceneControllerNoShapeSpaceConstraintsCPSelection) {
        //         this.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this));
        //     } else if(previousSceneInteractionStrategy instanceof CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection) {
        //         this.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this));
        //     } else if(previousSceneInteractionStrategy instanceof CurveSceneControllerStrictlyInsideShapeSpaceCPSelection) {
        //         this.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this));
        //     }
        // }

        // if(this.curveModel !== undefined && this.curveModel instanceof CurveModel) {
        // if(this.curveModel !== undefined) {
        //     if(this._insertKnotButtonView.buttonSelection(ndcX, ndcY) && this._selectedControlPoint !== null) {
        //         let cp = this._selectedControlPoint
        //         if(cp === 0) { cp += 1}
        //         if(cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1} 
        //         const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae()
        //         if(cp != null) {
        //             const spline = this.curveModel.spline;
        //             spline.insertKnot(grevilleAbscissae[cp], 1)
        //             this.curveModel.setSpline(spline);
        //             // this.curveModel.spline.insertKnot(grevilleAbscissae[cp], 1)
        //             this.curveControl.resetCurve(this.curveModel)
        //             if(this.activeLocationControl === ActiveLocationControl.both) {
        //                 if(this.shapeNavigableCurve.clampedPoints[0] === 0) {
        //                     this.shapeNavigableCurve.clampedPoints[1] = this.curveModel.spline.controlPoints.length - 1
        //                 } else this.shapeNavigableCurve.clampedPoints[0] = this.curveModel.spline.controlPoints.length - 1
        //             }
        //             else if(this.activeLocationControl === ActiveLocationControl.lastControlPoint) {
        //                 this.shapeNavigableCurve.clampedPoints[0] = this.curveModel.spline.controlPoints.length - 1
        //             }

        //             // JCL after resetting the curve the activeControl parameter is reset to 2 independently of the control settings
        //             // JCL the curveControl must be set in accordance with the current status of controls
        //             if(this.curveModel instanceof CurveModel) {
        //                 if(this.sliding) {
        //                     this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        //                     this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        //                     this.selectedInflection = null
        //                     this.selectedCurvatureExtrema = null
        //                     this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this);
        //                 }
        //                 else {
        //                     this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl)
        //                 }
        //             }
        //             this.curveModel.notifyObservers()
        //         }
        //     }
            
        //     if(this.curveModel instanceof CurveModel) {
        //         if(this.activeLocationControl === ActiveLocationControl.both && this._selectedControlPoint === null) {
        //             /* JCL 2020/09/28 Reinitialize the curve optimization context after releasing the conotrol point dragging mode */
        //             if(this.sliding) {
        //                 this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        //                 this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        //                 this.selectedInflection = null
        //                 this.selectedCurvatureExtrema = null
        //                 this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
        //             }
        //             else {
        //                 this.curveControl = new NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this.activeLocationControl)
        //             }
        //             this.curveModel.notifyObservers()
        //         }
        //     }
        //     this._selectedControlPoint = this.controlPointsView.pointSelection(ndcX, ndcY);
        //     this.controlPointsView.setSelected(this._selectedControlPoint);
        //     if(this._selectedControlPoint !== null) {
        //         this.dragging = true;
        //     }
        // } else throw new Error("Unable to process the current selection. Undefined curve model")
    }


    leftMouseDragged_event(ndcX: number, ndcY: number) {
        this._sceneInteractionStrategy.processLeftMouseDragInteraction(ndcX, ndcY);
        // const x = ndcX,
        // y = ndcY,
        // selectedControlPoint = this._controlPointsView.getSelectedPoint();
        // if(this.curveModel !== undefined) {
        //     /* JCL 2020/09/27 Add clamping condition when dragging a control point */
        //     //if (selectedControlPoint != null && this.dragging === true && this.activeLocationControl !== ActiveLocationControl.stopDeforming 
        //     //    && (this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming || this.allowShapeSpaceChange === true)) {
        //     if (selectedControlPoint != null && this.dragging === true && this.activeLocationControl !== ActiveLocationControl.stopDeforming) {
        //         // JCL new code
        //         this.curveShapeSpaceNavigator.navigateSpace(selectedControlPoint, x, y);
        //         if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
        //             /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
        //             because it is part of the optimize method (whether sliding is active or not) */
        //             this.curveModel.setControlPointPosition(selectedControlPoint, x, y)
        //         } else if((this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming && this.activeInflectionLocationControl !== ActiveInflectionLocationControl.stopDeforming) 
        //                 || this.allowShapeSpaceChange === true) {
        //             /*if(this.curveControl instanceof SlidingStrategy && this.curveControl.lastDiffEvent !== NeighboringEventsType.none) {
        //                 if(this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumLeftBoundary || this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumRightBoundary) {

        //                 }
        //             }*/
        //             this._curveControl.optimize(selectedControlPoint, x, y)
        //         }

        //         this.curveModel.notifyObservers()
        //         // if(this.curveModeler.clampedControlPoints.length > 0) {
        //         //     let clampedControlPoint: Vector_2d[] = [];
        //         //     for(let controlP of this.curveModeler.clampedControlPoints) {
        //         //         clampedControlPoint.push(this.curveModel.spline.controlPoints[controlP])
        //         //     }
        //         //     if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        //         // }
        //         /*let curvatureEvents: number[] = []
        //         let differentialEvents: number[] = []
        //         if(this.selectedCurvatureExtrema !== null && this.allowShapeSpaceChange === false) curvatureEvents = this.selectedCurvatureExtrema.slice()
        //         if(this.selectedInflection !== null && this.allowShapeSpaceChange === false) differentialEvents = curvatureEvents.concat(this.selectedInflection)
        //         this.selectedDifferentialEventsView.update(this.curveModel.spline, differentialEvents)*/

        //     }
        // } else throw new Error("Unable to drag the selected control point. Undefined curve model")

    }

    leftMouseUp_event() {
        this._sceneInteractionStrategy.processLeftMouseUpInteraction();
        // this.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this));
        this.dragging = false;
        // if(this.activeLocationControl === ActiveLocationControl.stopDeforming) {
        //     this.activeLocationControl = ActiveLocationControl.both
        //     this._selectedControlPoint = null;
        // }
        // if(this.activeInflectionLocationControl === ActiveInflectionLocationControl.stopDeforming) {
        //     this.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        // }
        // if(this.activeExtremaLocationControl === ActiveExtremaLocationControl.stopDeforming) {
        //     this.activeExtremaLocationControl = ActiveExtremaLocationControl.none
        // }
    }

    shiftKeyDown() {
        this._allowShapeSpaceChange = true;
        this._sceneInteractionStrategy.processShiftKeyDownInteraction();
        // if(this.eventMgmtAtExtremities !== undefined) {
        //     this.curveEventAtExtremityMayVanish = true;
        //     this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        //     let message = new WarningLog(this.constructor.name, " shiftKeyDown ", this.eventMgmtAtExtremities.eventState.constructor.name);
        //     message.logMessageToConsole();
        // }
    }

    shiftKeyUp() {
        this._allowShapeSpaceChange = false;
        this._sceneInteractionStrategy.processShiftKeyUpInteraction();
        // if(this.eventMgmtAtExtremities !== undefined) {
        //     this.curveEventAtExtremityMayVanish = false;
        //     this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        //     let message = new WarningLog(this.constructor.name, " shiftKeyUp ", this.eventMgmtAtExtremities.eventState.constructor.name);
        //     message.logMessageToConsole();
        // }
    }

    /* JCL 2020/09/25 Management of the dble click on a clamped control point */
    dbleClick_event(ndcX: number, ndcY: number): boolean {
        if(this.curveModel !== undefined) {
                                
            if(this.controlOfCurveClamping) {
                if(this._clampedControlPointView !== null) {
                    // let selectedClampedControlPoint = this.clampedControlPointView.controlPointSelection(this.curveModel.spline.controlPoints, ndcX, ndcY, deltaSquared);
                    let selectedClampedControlPoint = this._clampedControlPointView.knotSelection(ndcX, ndcY);

                    console.log("dlble_click: id conrol pt = " + selectedClampedControlPoint);
                    if(selectedClampedControlPoint !== null) {
                        if((this.shapeNavigableCurve.clampedPoints[0] === selectedClampedControlPoint || this.shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT)
                            && this.shapeNavigableCurve.clampedPoints[1] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint1(selectedClampedControlPoint);
                        } else if((this.shapeNavigableCurve.clampedPoints[1] === selectedClampedControlPoint || this.shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
                            && this.shapeNavigableCurve.clampedPoints[0] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint2(selectedClampedControlPoint);
                        }
                        this.curveModel.notifyObservers();
                        
                        // if(this.shapeNavigableCurve.clampedControlPoints.length === 1 && this.shapeNavigableCurve.clampedControlPoints[0] === selectedClampedControlPoint) {
                        //     console.log("dlble_click: no cp left")
                        //     // this.clampedControlPointView = null
                        //     this.shapeNavigableCurve.clampedControlPoints.pop()
                        //     this.activeLocationControl = ActiveLocationControl.none
                        //     return false
                        // }
                        // else if(this.shapeNavigableCurve.clampedControlPoints.length === 1 && this.shapeNavigableCurve.clampedControlPoints[0] !== selectedClampedControlPoint 
                        //     && (selectedClampedControlPoint === 0 || selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1))) {
                        //     console.log("dlble_click: two cp clamped")
                        //     this.shapeNavigableCurve.clampedControlPoints.push(selectedClampedControlPoint)
                        //     let clampedControlPoint: Vector2d[] = []
                        //     clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                        //     clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                        //     this.clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints)
                        //     this.activeLocationControl = ActiveLocationControl.both
                        //     return true
                        // }
                        // else if(this.shapeNavigableCurve.clampedControlPoints.length === 2) {
                        //     if(selectedClampedControlPoint === 0) {
                        //         console.log("dlble_click: last cp left")
                        //         if(this.shapeNavigableCurve.clampedControlPoints[1] === selectedClampedControlPoint) {
                        //             this.shapeNavigableCurve.clampedControlPoints.pop()
                        //         } else this.shapeNavigableCurve.clampedControlPoints.splice(0, 1)
                        //         let clampedControlPoint: Vector2d[] = []
                        //         clampedControlPoint.push(this.curveModel.spline.controlPoints[this.curveModel.spline.controlPoints.length - 1])
                        //         this.clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints)
                        //         this.activeLocationControl = ActiveLocationControl.lastControlPoint
                        //         console.log("dble click: clampedControlPoints " + this.shapeNavigableCurve.clampedControlPoints)
                        //     } else if(selectedClampedControlPoint === (this.curveModel.spline.controlPoints.length - 1)) {
                        //         console.log("dlble_click: first cp left")
                        //         if(this.shapeNavigableCurve.clampedControlPoints[1] === selectedClampedControlPoint) {
                        //             this.shapeNavigableCurve.clampedControlPoints.pop()
                        //         } else this.shapeNavigableCurve.clampedControlPoints.splice(0, 1)
                        //         let clampedControlPoint: Vector2d[] = []
                        //         clampedControlPoint.push(this.curveModel.spline.controlPoints[0])
                        //         this.clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this.shapeNavigableCurve.clampedControlPoints)
                        //         this.activeLocationControl = ActiveLocationControl.firstControlPoint
                        //         console.log("dble click: clampedControlPoints " + this.shapeNavigableCurve.clampedControlPoints)
                        //     }
                            return true
                        // } else return true
                    } else return true;
                } else return true
            } else return true
        } else {
            throw new Error("Unable to process the selected point for clamping. Undefined curve model")
        }
    }

}
