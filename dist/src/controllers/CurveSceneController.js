"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneController = void 0;
const CurveModel_1 = require("../newModels/CurveModel");
const ControlPointsView_1 = require("../views/ControlPointsView");
const ControlPolygonView_1 = require("../views/ControlPolygonView");
const CurveView_1 = require("../views/CurveView");
const ClickButtonView_1 = require("../views/ClickButtonView");
const CurvatureExtremaView_1 = require("../views/CurvatureExtremaView");
const InflectionsView_1 = require("../views/InflectionsView");
const TransitionCurvatureExtremaView_1 = require("../views/TransitionCurvatureExtremaView");
const CurveKnotsView_1 = require("../views/CurveKnotsView");
const ClampedControlPointView_1 = require("../views/ClampedControlPointView");
const ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const CurveConstraintSelectionState_1 = require("./CurveConstraintSelectionState");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const CurveModelObserver_1 = require("../models/CurveModelObserver");
const HighlightedControlPolygonView_1 = require("../views/HighlightedControlPolygonView");
const CurveSceneControllerInteractionStrategy_1 = require("./CurveSceneControllerInteractionStrategy");
const PhantomCurveView_1 = require("../views/PhantomCurveView");
const SelectedSlipOutOfShapeSpaceCurvExtremView_1 = require("../views/SelectedSlipOutOfShapeSpaceCurvExtremView");
const SelectedSlipOutOfShapeSpaceInflectionView_1 = require("../views/SelectedSlipOutOfShapeSpaceInflectionView");
const SelectedEnteringShapeSpaceCurvExtremView_1 = require("../views/SelectedEnteringShapeSpaceCurvExtremView");
const SelectedEnteringShapeSpaceInflectionView_1 = require("../views/SelectedEnteringShapeSpaceInflectionView");
// Margin expressed in pixel size
const MARGIN_WINDOW_CANVAS = 150;
// Window background color setting
const BACKGROUND_RED_COLOR = 0.3;
const BACKGROUND_GREEN_COLOR = 0.3;
const BACKGROUND_BLUE_COLOR = 0.3;
const BACKGROUND_ALPHA = 1.0;
class CurveSceneController {
    constructor(canvas, gl, curveModelDefinitionEventListener, shapeSpaceNavigationEventListener) {
        this.canvas = canvas;
        this.gl = gl;
        this._selectedControlPoint = null;
        this._shapeNavigableCurve = curveModelDefinitionEventListener.shapeNavigableCurve;
        this.curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        this._controlOfKnotInsertion = false;
        this._curveShapeSpaceNavigator = shapeSpaceNavigationEventListener.curveShapeSpaceNavigator;
        this.curveModelDifferentialEventsExtractor = this._shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this._curveDiffEventsLocations = this.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;
        this._controlPointsView = new ControlPointsView_1.ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView_1.ControlPolygonView(this.gl, this.curveModel.spline);
        this.curveView = new CurveView_1.CurveView(this.gl, this.curveModel.spline);
        this._insertKnotButtonView = new ClickButtonView_1.ClickButtonView(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView_1.CurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView_1.TransitionCurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.inflectionsView = new InflectionsView_1.InflectionsView(this.gl, this._curveDiffEventsLocations);
        this.curveKnotsView = new CurveKnotsView_1.CurveKnotsView(this.gl, this.curveModel.spline);
        this._clampedControlPointView = new ClampedControlPointView_1.ClampedControlPointView(this.gl, this.curveModel.spline, this._shapeNavigableCurve.clampedPoints);
        const selectedEvent = [];
        this._selectedSlipOutCurvatureExtremaView = new SelectedSlipOutOfShapeSpaceCurvExtremView_1.SelectedSlipOutOfShapeSpaceCurvExtremaView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedEnteringCurvatureExtremaView = new SelectedEnteringShapeSpaceCurvExtremView_1.SelectedEnteringShapeSpaceCurvExtremaView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedSlipOutInflectionsView = new SelectedSlipOutOfShapeSpaceInflectionView_1.SelectedSlipOutOfShapeSpaceInflectionView(this.gl, this.curveModel.spline, selectedEvent);
        this._selectedEnteringInflectionsView = new SelectedEnteringShapeSpaceInflectionView_1.SelectedEnteringShapeSpaceInflectionView(this.gl, this.curveModel.spline, selectedEvent);
        this._highlightedControlPolygonView = new HighlightedControlPolygonView_1.HighlightedControlPolygonView(this.curveModel.spline, this.gl);
        this._phantomCurveView = new PhantomCurveView_1.PhantomCurveView(this.gl, this.curveModel.spline);
        this._sceneInteractionStrategy = new CurveSceneControllerInteractionStrategy_1.CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this);
        // JCL temporary modif
        this._curveShapeSpaceNavigator.curveSceneController = this;
        this.registerCurveObservers();
        this._shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInCurveSceneController(this));
        this._selectedSlipOutCurvatureExtremaView.update(this.curveModel.spline);
        this._selectedEnteringCurvatureExtremaView.update(this.curveModel.spline);
        this._selectedSlipOutInflectionsView.update(this.curveModel.spline);
        this._selectedEnteringInflectionsView.update(this.curveModel.spline);
        this._navigationState = this._curveShapeSpaceNavigator.navigationState;
        this._navigationState.setNavigationWithoutShapeSpaceMonitoring();
        this._curveConstraintSelectionState = new CurveConstraintSelectionState_1.HandleConstraintAtPoint1Point2NoConstraintState(this);
        console.log("end constructor curveSceneController");
    }
    get clampedControlPointView() {
        return this._clampedControlPointView;
    }
    get insertKnotButtonView() {
        return this._insertKnotButtonView;
    }
    get controlPointsView() {
        return this._controlPointsView;
    }
    get highlightedControlPolygonView() {
        return this._highlightedControlPolygonView;
    }
    get phantomCurveView() {
        return this._phantomCurveView;
    }
    get curveConstraintSelectionState() {
        return this._curveConstraintSelectionState;
    }
    get controlOfKnotInsertion() {
        return this._controlOfKnotInsertion;
    }
    get selectedControlPoint() {
        return this._selectedControlPoint;
    }
    get sceneInteraction() {
        return this._sceneInteractionStrategy;
    }
    get selectedSlipOutInflectionsView() {
        return this._selectedSlipOutInflectionsView;
    }
    get selectedEnteringInflectionsView() {
        return this._selectedEnteringInflectionsView;
    }
    get selectedSlipOutCurvatureExtremaView() {
        return this._selectedSlipOutCurvatureExtremaView;
    }
    get selectedEnteringCurvatureExtremaView() {
        return this._selectedEnteringCurvatureExtremaView;
    }
    get navigationState() {
        return this._navigationState;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    set selectedControlPoint(selectedCPIndex) {
        this._selectedControlPoint = selectedCPIndex;
    }
    set navigationState(navigationState) {
        this._navigationState = navigationState;
    }
    set curveDiffEventsLocations(curveDiffEventsLocations) {
        this._curveDiffEventsLocations = curveDiffEventsLocations;
    }
    initCurveSceneView() {
        this._controlPointsView = new ControlPointsView_1.ControlPointsView(this.gl, this.curveModel.spline);
        this.controlPolygonView = new ControlPolygonView_1.ControlPolygonView(this.gl, this.curveModel.spline);
        this._insertKnotButtonView = new ClickButtonView_1.ClickButtonView(this.gl);
        this.curveView = new CurveView_1.CurveView(this.gl, this.curveModel.spline);
        this.curveKnotsView = new CurveKnotsView_1.CurveKnotsView(this.gl, this.curveModel.spline);
        this.inflectionsView = new InflectionsView_1.InflectionsView(this.gl, this._curveDiffEventsLocations);
        this.curvatureExtremaView = new CurvatureExtremaView_1.CurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView_1.TransitionCurvatureExtremaView(this.gl, this._curveDiffEventsLocations);
        this._clampedControlPointView = new ClampedControlPointView_1.ClampedControlPointView(this.gl, this.curveModel.spline, this._shapeNavigableCurve.clampedPoints);
        this.registerCurveObservers();
        this._selectedControlPoint = null;
    }
    registerCurveObservers() {
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
            element.update(this._curveDiffEventsLocations);
        });
        if (this.curveModel instanceof CurveModel_1.CurveModel) {
            this.curveModel.observers.forEach(element => {
                if (this.curveModel !== undefined) {
                    element.update(this.curveModel.spline);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
                }
            });
        }
        else if (this.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.curveModel.observers.forEach(element => {
                if (this.curveModel !== undefined) {
                    element.update(this.curveModel.spline);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
                }
            });
        }
        this.curveModel.checkObservers();
    }
    removeCurveObservers() {
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
    setupWindowBackground() {
        const size = Math.min(window.innerWidth, window.innerHeight) - MARGIN_WINDOW_CANVAS;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(BACKGROUND_RED_COLOR, BACKGROUND_GREEN_COLOR, BACKGROUND_BLUE_COLOR, BACKGROUND_ALPHA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    renderFrame() {
        this.setupWindowBackground();
        this.curveView.renderFrame();
        this.curvatureExtremaView.renderFrame();
        this.transitionCurvatureExtremaView.renderFrame();
        this.inflectionsView.renderFrame();
        this.controlPolygonView.renderFrame();
        this.curveKnotsView.renderFrame();
        if (this._sceneInteractionStrategy instanceof CurveSceneControllerInteractionStrategy_1.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied) {
            this._highlightedControlPolygonView.renderFrame();
            this._phantomCurveView.renderFrame();
        }
        else if (this._sceneInteractionStrategy instanceof CurveSceneControllerInteractionStrategy_1.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary
            && this._sceneInteractionStrategy.displayPhantomEntities) {
            this._highlightedControlPolygonView.renderFrame();
            this._phantomCurveView.renderFrame();
        }
        this._controlPointsView.renderFrame();
        this._insertKnotButtonView.renderFrame();
        this._selectedSlipOutCurvatureExtremaView.renderFrame();
        this._selectedSlipOutInflectionsView.renderFrame();
        this._selectedEnteringCurvatureExtremaView.renderFrame();
        this._selectedEnteringInflectionsView.renderFrame();
        if (this._shapeNavigableCurve.controlOfCurveClamping && this._clampedControlPointView !== null) {
            this._clampedControlPointView.renderFrame();
        }
    }
    addCurveObserver(curveObserver) {
        if (this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.registerObserver(curveObserver, "curve");
        }
        else
            throw new Error("Unable to attach a curve observer to the current curve. Undefined curve model");
    }
    removeCurveObserver(curveObserver) {
        if (this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.removeObserver(curveObserver, "curve");
        }
        else
            throw new Error("Unable to detach a curve observer to the current curve. Undefined curve model");
    }
    curveConstraintTransitionTo(curveConstraintSelectionState) {
        this._curveConstraintSelectionState = curveConstraintSelectionState;
    }
    changeSceneInteraction(sceneInteraction) {
        this._sceneInteractionStrategy = sceneInteraction;
    }
    leftMouseDown_event(ndcX, ndcY) {
        this._sceneInteractionStrategy.processLeftMouseDownInteraction(ndcX, ndcY);
    }
    leftMouseDragged_event(ndcX, ndcY) {
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
    dbleClick_event(ndcX, ndcY) {
        if (this.curveModel !== undefined) {
            if (this._shapeNavigableCurve.controlOfCurveClamping) {
                if (this._clampedControlPointView !== null) {
                    let selectedClampedControlPoint = this._clampedControlPointView.knotSelection(ndcX, ndcY);
                    console.log("dlble_click: id conrol pt = " + selectedClampedControlPoint);
                    if (selectedClampedControlPoint !== null) {
                        if ((this._shapeNavigableCurve.clampedPoints[0] === selectedClampedControlPoint || this._shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT)
                            && this._shapeNavigableCurve.clampedPoints[1] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint1(selectedClampedControlPoint);
                        }
                        else if ((this._shapeNavigableCurve.clampedPoints[1] === selectedClampedControlPoint || this._shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT)
                            && this._shapeNavigableCurve.clampedPoints[0] !== selectedClampedControlPoint) {
                            this._curveConstraintSelectionState.handleCurveConstraintAtPoint2(selectedClampedControlPoint);
                        }
                        this.curveModel.notifyObservers();
                        return true;
                    }
                    else
                        return true;
                }
                else
                    return true;
            }
            else
                return true;
        }
        else {
            throw new Error("Unable to process the selected point for clamping. Undefined curve model");
        }
    }
}
exports.CurveSceneController = CurveSceneController;
