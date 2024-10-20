import { CurveModel } from "../newModels/CurveModel"
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveView } from "../views/CurveView";
import { SceneControllerInterface } from "./SceneControllerInterface";
import { ClickButtonView } from "../views/ClickButtonView";
import { CurvatureExtremaView } from "../views/CurvatureExtremaView";
import { InflectionsView } from "../views/InflectionsView";
import { TransitionCurvatureExtremaView } from "../views/TransitionCurvatureExtremaView";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IRenderFrameObserver } from "../newDesignPatterns/RenderFrameObserver";
import { CurveKnotsView } from "../views/CurveKnotsView"
import { ClampedControlPointView } from "../views/ClampedControlPointView"

//import * as fs from "fs";
import { saveAs } from "file-saver";
import { NONAME } from "dns";

import { ShapeNavigableCurve, NO_CONSTRAINT } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { NavigationState } from "../curveShapeSpaceNavigation/NavigationState";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { CurveConstraintSelectionState, HandleConstraintAtPoint1Point2NoConstraintState } from "./CurveConstraintSelectionState";
import { CurveModelDefinitionEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModelObserverInCurveSceneController } from "../models/CurveModelObserver";
import { HighlightedControlPolygonView } from "../views/HighlightedControlPolygonView";
import { CurveDifferentialEventsLocationInterface } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocationsInterface";
import { CurveDifferentialEventsLocations } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocations";
import { SceneInteractionStrategy } from "../designPatterns/SceneInteractionStrategy";
import { CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied, CurveSceneControllerNoShapeSpaceConstraintsCPSelection, CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve, CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary } from "./CurveSceneControllerInteractionStrategy";
import { PhantomCurveView } from "../views/PhantomCurveView";
import { SelectedSlipOutOfShapeSpaceCurvExtremaView } from "../views/SelectedSlipOutOfShapeSpaceCurvExtremView";
import { SelectedSlipOutOfShapeSpaceInflectionView } from "../views/SelectedSlipOutOfShapeSpaceInflectionView";
import { SelectedEnteringShapeSpaceCurvExtremaView } from "../views/SelectedEnteringShapeSpaceCurvExtremView";
import { SelectedEnteringShapeSpaceInflectionView } from "../views/SelectedEnteringShapeSpaceInflectionView";

// Margin expressed in pixel size
const MARGIN_WINDOW_CANVAS = 150;
// Window background color setting
const BACKGROUND_RED_COLOR = 0.3;
const BACKGROUND_GREEN_COLOR = 0.3;
const BACKGROUND_BLUE_COLOR = 0.3;
const BACKGROUND_ALPHA = 1.0;

export class CurveSceneController implements SceneControllerInterface {

    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private _selectedControlPoint: number | null;
    private _selectedSlipOutCurvatureExtremaView: SelectedSlipOutOfShapeSpaceCurvExtremaView;
    private _selectedEnteringCurvatureExtremaView: SelectedEnteringShapeSpaceCurvExtremaView;
    private _selectedSlipOutInflectionsView: SelectedSlipOutOfShapeSpaceInflectionView;
    private _selectedEnteringInflectionsView: SelectedEnteringShapeSpaceInflectionView;
    private _controlPointsView: ControlPointsView;
    private controlPolygonView: ControlPolygonView;
    private _highlightedControlPolygonView: HighlightedControlPolygonView;
    private _phantomCurveView: PhantomCurveView;
    private curveView: CurveView;
    private curveKnotsView: CurveKnotsView;
    private _insertKnotButtonView: ClickButtonView;
    private _controlOfKnotInsertion: boolean;
    private _sceneInteractionStrategy: SceneInteractionStrategy;
    private curvatureExtremaView: CurvatureExtremaView;
    private transitionCurvatureExtremaView: TransitionCurvatureExtremaView;
    private inflectionsView: InflectionsView;
    private _clampedControlPointView: ClampedControlPointView;

    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    private readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _navigationState: NavigationState;
    // private curveEventAtExtremityMayVanish: boolean;
    // private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private _curveConstraintSelectionState: CurveConstraintSelectionState;
    public curveModel: CurveModelInterface
    public curveModelDifferentialEventsExtractor: CurveDifferentialEventsLocationInterface;
    private _curveDiffEventsLocations: CurveDifferentialEventsLocations;
    
    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext,
        curveModelDefinitionEventListener: CurveModelDefinitionEventListener,
        shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener) {

        this.canvas = canvas;
        this.gl = gl;
        this._selectedControlPoint = null;
        this._shapeNavigableCurve = curveModelDefinitionEventListener.shapeNavigableCurve;
        this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        this._controlOfKnotInsertion = false;
        this._curveShapeSpaceNavigator = shapeSpaceNavigationEventListener.curveShapeSpaceNavigator;
        this.curveModelDifferentialEventsExtractor = this._shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this._curveDiffEventsLocations = this.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;

        this._controlPointsView = new ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView(this.gl, this.curveModel.spline);
        this.curveView = new CurveView(this.gl, this.curveModel.spline);
        this._insertKnotButtonView = new ClickButtonView(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.inflectionsView = new InflectionsView(this.gl, this._curveDiffEventsLocations);
        this.curveKnotsView = new CurveKnotsView(this.gl, this.curveModel.spline);
        this._clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this._shapeNavigableCurve.clampedPoints);
        const selectedEvent: number[]= [];
        this._selectedSlipOutCurvatureExtremaView = new SelectedSlipOutOfShapeSpaceCurvExtremaView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedEnteringCurvatureExtremaView = new SelectedEnteringShapeSpaceCurvExtremaView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedSlipOutInflectionsView = new SelectedSlipOutOfShapeSpaceInflectionView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedEnteringInflectionsView = new SelectedEnteringShapeSpaceInflectionView(this.gl, this.curveModel.spline, selectedEvent);
        this._highlightedControlPolygonView = new HighlightedControlPolygonView(this.curveModel.spline, this.gl);
        this._phantomCurveView = new PhantomCurveView(this.gl, this.curveModel.spline);

        this._sceneInteractionStrategy = new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this);

        // JCL temporary modif
        this._curveShapeSpaceNavigator.curveSceneController = this;

        this.registerCurveObservers();
        this._shapeNavigableCurve.registerObserver(new CurveModelObserverInCurveSceneController(this));

        this._selectedSlipOutCurvatureExtremaView.update(this.curveModel.spline);
        this._selectedEnteringCurvatureExtremaView.update(this.curveModel.spline);
        this._selectedSlipOutInflectionsView.update(this.curveModel.spline);
        this._selectedEnteringInflectionsView.update(this.curveModel.spline);

        this._navigationState = this._curveShapeSpaceNavigator.navigationState;
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

    get highlightedControlPolygonView(): HighlightedControlPolygonView {
        return this._highlightedControlPolygonView;
    }

    get phantomCurveView(): PhantomCurveView {
        return this._phantomCurveView;
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

    get selectedSlipOutInflectionsView(): SelectedSlipOutOfShapeSpaceInflectionView {
        return this._selectedSlipOutInflectionsView;
    }

    get selectedEnteringInflectionsView(): SelectedEnteringShapeSpaceInflectionView {
        return this._selectedEnteringInflectionsView;
    }

    get selectedSlipOutCurvatureExtremaView(): SelectedSlipOutOfShapeSpaceCurvExtremaView {
        return this._selectedSlipOutCurvatureExtremaView;
    }

    get selectedEnteringCurvatureExtremaView(): SelectedEnteringShapeSpaceCurvExtremaView {
        return this._selectedEnteringCurvatureExtremaView;
    }

    get navigationState(): NavigationState {
        return this._navigationState;
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    set selectedControlPoint(selectedCPIndex: number | null) {
        this._selectedControlPoint = selectedCPIndex;
    }

    set navigationState(navigationState: NavigationState) {
        this._navigationState = navigationState;
    }

    set curveDiffEventsLocations(curveDiffEventsLocations: CurveDifferentialEventsLocations) {
        this._curveDiffEventsLocations = curveDiffEventsLocations;
    }

    initCurveSceneView(): void {
        this._controlPointsView = new ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView(this.gl, this.curveModel.spline);
        this._insertKnotButtonView = new ClickButtonView(this.gl);
        this.curveView = new CurveView(this.gl, this.curveModel.spline);
        this.curveKnotsView = new CurveKnotsView(this.gl, this.curveModel.spline);
        this.inflectionsView = new InflectionsView(this.gl, this._curveDiffEventsLocations);
        this.curvatureExtremaView = new CurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this._clampedControlPointView = new ClampedControlPointView(this.gl, this.curveModel.spline, this._shapeNavigableCurve.clampedPoints);
        
        this.registerCurveObservers();
        this._selectedControlPoint = null;
    }

    registerCurveObservers(): void {
        this.curveModel.registerObserver(this._controlPointsView, "control points");
        this.curveModel.registerObserver(this.controlPolygonView, "control points");
        this.curveModel.registerObserver(this.curveView, "curve");
        this.curveModel.registerObserver(this.curveKnotsView, "control points");
        this.curveModel.registerObserver(this._clampedControlPointView, "control points");
        this.curveModel.registerObserver(this._selectedSlipOutCurvatureExtremaView, "control points");
        this.curveModel.registerObserver(this._selectedSlipOutInflectionsView, "control points");
        this.curveModel.registerObserver(this._selectedEnteringCurvatureExtremaView, "control points");
        this.curveModel.registerObserver(this._selectedEnteringInflectionsView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.curvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.transitionCurvatureExtremaView, "control points");
        this.curveModelDifferentialEventsExtractor.registerObserver(this.inflectionsView, "control points");

        this.curveModelDifferentialEventsExtractor.observersCP.forEach(element => {
            element.update(this._curveDiffEventsLocations)
        });

        if(this.curveModel instanceof CurveModel) {
            this.curveModel.observers.forEach(element => {
                if(this.curveModel !== undefined) {
                    element.update(this.curveModel.spline)
                } else {
                    const error = new ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
                }
            });
        } else if(this.curveModel instanceof ClosedCurveModel) {
            this.curveModel.observers.forEach(element => {
                if(this.curveModel !== undefined) {
                    element.update(this.curveModel.spline)
                } else {
                    const error = new ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
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
        this.curveModel.removeObserver(this._selectedSlipOutCurvatureExtremaView, "control points");
        this.curveModel.removeObserver(this._selectedSlipOutInflectionsView, "control points");
        this.curveModel.registerObserver(this._selectedEnteringCurvatureExtremaView, "control points");
        this.curveModel.registerObserver(this._selectedEnteringInflectionsView, "control points");
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
        if(this._sceneInteractionStrategy instanceof CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied) {
            this._highlightedControlPolygonView.renderFrame();
            this._phantomCurveView.renderFrame();
        } else if(this._sceneInteractionStrategy instanceof CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary
            && this._sceneInteractionStrategy.displayPhantomEntities) {
            this._highlightedControlPolygonView.renderFrame();
            this._phantomCurveView.renderFrame();
        }

        this._controlPointsView.renderFrame()
        this._insertKnotButtonView.renderFrame()
        this._selectedSlipOutCurvatureExtremaView.renderFrame();
        this._selectedSlipOutInflectionsView.renderFrame();
        this._selectedEnteringCurvatureExtremaView.renderFrame();
        this._selectedEnteringInflectionsView.renderFrame();
        if(this._shapeNavigableCurve.controlOfCurveClamping && this._clampedControlPointView !== null) {
            this._clampedControlPointView.renderFrame()
        }
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
        this._sceneInteractionStrategy.processLeftMouseDownInteraction(ndcX, ndcY);
    }

    leftMouseDragged_event(ndcX: number, ndcY: number) {
        this._sceneInteractionStrategy.processLeftMouseDragInteraction(ndcX, ndcY);
    }

    leftMouseUp_event() {
        this._sceneInteractionStrategy.processLeftMouseUpInteraction();
    }

    shiftKeyDown() {
        this._sceneInteractionStrategy.processShiftKeyDownInteraction();
    }

    shiftKeyUp() {
        this._sceneInteractionStrategy.processShiftKeyUpInteraction();
    }

    dbleClick_event(ndcX: number, ndcY: number): boolean {
        if(this.curveModel !== undefined) {
            if(this._shapeNavigableCurve.controlOfCurveClamping) {
                if(this._clampedControlPointView !== null) {
                    let selectedClampedControlPoint = this._clampedControlPointView.knotSelection(ndcX, ndcY);
                    console.log("dlble_click: id conrol pt = " + selectedClampedControlPoint);
                    if(selectedClampedControlPoint !== null) {
                        if((this._shapeNavigableCurve.clampedPoints[0] === selectedClampedControlPoint || this._shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT)
                            && this._shapeNavigableCurve.clampedPoints[1] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint1(selectedClampedControlPoint);
                        } else if((this._shapeNavigableCurve.clampedPoints[1] === selectedClampedControlPoint || this._shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
                            && this._shapeNavigableCurve.clampedPoints[0] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint2(selectedClampedControlPoint);
                        }
                        this.curveModel.notifyObservers();
                        return true;
                    } else return true;
                } else return true
            } else return true
        } else {
            throw new Error("Unable to process the selected point for clamping. Undefined curve model")
        }
    }

}
