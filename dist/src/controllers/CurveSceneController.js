"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneController = void 0;
var CurveModel_1 = require("../newModels/CurveModel");
var ControlPointsView_1 = require("../views/ControlPointsView");
var ControlPolygonView_1 = require("../views/ControlPolygonView");
var CurveView_1 = require("../views/CurveView");
var ClickButtonView_1 = require("../views/ClickButtonView");
var CurvatureExtremaView_1 = require("../views/CurvatureExtremaView");
var InflectionsView_1 = require("../views/InflectionsView");
var TransitionCurvatureExtremaView_1 = require("../views/TransitionCurvatureExtremaView");
var CurveKnotsView_1 = require("../views/CurveKnotsView");
var ClampedControlPointView_1 = require("../views/ClampedControlPointView");
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var CurveConstraintSelectionState_1 = require("./CurveConstraintSelectionState");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var CurveModelObserver_1 = require("../models/CurveModelObserver");
var HighlightedControlPolygonView_1 = require("../views/HighlightedControlPolygonView");
var CurveSceneControllerInteractionStrategy_1 = require("./CurveSceneControllerInteractionStrategy");
var PhantomCurveView_1 = require("../views/PhantomCurveView");
var SelectedSlipOutOfShapeSpaceCurvExtremView_1 = require("../views/SelectedSlipOutOfShapeSpaceCurvExtremView");
var SelectedSlipOutOfShapeSpaceInflectionView_1 = require("../views/SelectedSlipOutOfShapeSpaceInflectionView");
var SelectedEnteringShapeSpaceCurvExtremView_1 = require("../views/SelectedEnteringShapeSpaceCurvExtremView");
var SelectedEnteringShapeSpaceInflectionView_1 = require("../views/SelectedEnteringShapeSpaceInflectionView");
// Margin expressed in pixel size
var MARGIN_WINDOW_CANVAS = 150;
// Window background color setting
var BACKGROUND_RED_COLOR = 0.3;
var BACKGROUND_GREEN_COLOR = 0.3;
var BACKGROUND_BLUE_COLOR = 0.3;
var BACKGROUND_ALPHA = 1.0;
var CurveSceneController = /** @class */ (function () {
    function CurveSceneController(canvas, gl, curveModelDefinitionEventListener, shapeSpaceNavigationEventListener) {
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
        var selectedEvent = [];
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
    Object.defineProperty(CurveSceneController.prototype, "clampedControlPointView", {
        get: function () {
            return this._clampedControlPointView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "insertKnotButtonView", {
        get: function () {
            return this._insertKnotButtonView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "controlPointsView", {
        get: function () {
            return this._controlPointsView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "highlightedControlPolygonView", {
        get: function () {
            return this._highlightedControlPolygonView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "phantomCurveView", {
        get: function () {
            return this._phantomCurveView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "curveConstraintSelectionState", {
        get: function () {
            return this._curveConstraintSelectionState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "controlOfKnotInsertion", {
        get: function () {
            return this._controlOfKnotInsertion;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "selectedControlPoint", {
        get: function () {
            return this._selectedControlPoint;
        },
        set: function (selectedCPIndex) {
            this._selectedControlPoint = selectedCPIndex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "sceneInteraction", {
        get: function () {
            return this._sceneInteractionStrategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "selectedSlipOutInflectionsView", {
        get: function () {
            return this._selectedSlipOutInflectionsView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "selectedEnteringInflectionsView", {
        get: function () {
            return this._selectedEnteringInflectionsView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "selectedSlipOutCurvatureExtremaView", {
        get: function () {
            return this._selectedSlipOutCurvatureExtremaView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "selectedEnteringCurvatureExtremaView", {
        get: function () {
            return this._selectedEnteringCurvatureExtremaView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "navigationState", {
        get: function () {
            return this._navigationState;
        },
        set: function (navigationState) {
            this._navigationState = navigationState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveSceneController.prototype, "curveDiffEventsLocations", {
        set: function (curveDiffEventsLocations) {
            this._curveDiffEventsLocations = curveDiffEventsLocations;
        },
        enumerable: false,
        configurable: true
    });
    CurveSceneController.prototype.initCurveSceneView = function () {
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
    };
    CurveSceneController.prototype.registerCurveObservers = function () {
        var _this = this;
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
        this.curveModelDifferentialEventsExtractor.observersCP.forEach(function (element) {
            element.update(_this._curveDiffEventsLocations);
        });
        if (this.curveModel instanceof CurveModel_1.CurveModel) {
            this.curveModel.observers.forEach(function (element) {
                if (_this.curveModel !== undefined) {
                    element.update(_this.curveModel.spline);
                }
                else {
                    var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
                }
            });
        }
        else if (this.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.curveModel.observers.forEach(function (element) {
                if (_this.curveModel !== undefined) {
                    element.update(_this.curveModel.spline);
                }
                else {
                    var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "registerCurveObservers", "Unable to initialize a CurveSceneController");
                    error.logMessage();
                }
            });
        }
        this.curveModel.checkObservers();
    };
    CurveSceneController.prototype.removeCurveObservers = function () {
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
    };
    CurveSceneController.prototype.setupWindowBackground = function () {
        var size = Math.min(window.innerWidth, window.innerHeight) - MARGIN_WINDOW_CANVAS;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(BACKGROUND_RED_COLOR, BACKGROUND_GREEN_COLOR, BACKGROUND_BLUE_COLOR, BACKGROUND_ALPHA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    };
    CurveSceneController.prototype.renderFrame = function () {
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
    };
    CurveSceneController.prototype.addCurveObserver = function (curveObserver) {
        if (this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.registerObserver(curveObserver, "curve");
        }
        else
            throw new Error("Unable to attach a curve observer to the current curve. Undefined curve model");
    };
    CurveSceneController.prototype.removeCurveObserver = function (curveObserver) {
        if (this.curveModel !== undefined) {
            curveObserver.update(this.curveModel.spline);
            this.curveModel.removeObserver(curveObserver, "curve");
        }
        else
            throw new Error("Unable to detach a curve observer to the current curve. Undefined curve model");
    };
    CurveSceneController.prototype.curveConstraintTransitionTo = function (curveConstraintSelectionState) {
        this._curveConstraintSelectionState = curveConstraintSelectionState;
    };
    CurveSceneController.prototype.changeSceneInteraction = function (sceneInteraction) {
        this._sceneInteractionStrategy = sceneInteraction;
    };
    CurveSceneController.prototype.leftMouseDown_event = function (ndcX, ndcY) {
        this._sceneInteractionStrategy.processLeftMouseDownInteraction(ndcX, ndcY);
    };
    CurveSceneController.prototype.leftMouseDragged_event = function (ndcX, ndcY) {
        this._sceneInteractionStrategy.processLeftMouseDragInteraction(ndcX, ndcY);
    };
    CurveSceneController.prototype.leftMouseUp_event = function () {
        this._sceneInteractionStrategy.processLeftMouseUpInteraction();
    };
    CurveSceneController.prototype.shiftKeyDown = function () {
        this._sceneInteractionStrategy.processShiftKeyDownInteraction();
    };
    CurveSceneController.prototype.shiftKeyUp = function () {
        this._sceneInteractionStrategy.processShiftKeyUpInteraction();
    };
    CurveSceneController.prototype.dbleClick_event = function (ndcX, ndcY) {
        if (this.curveModel !== undefined) {
            if (this._shapeNavigableCurve.controlOfCurveClamping) {
                if (this._clampedControlPointView !== null) {
                    var selectedClampedControlPoint = this._clampedControlPointView.knotSelection(ndcX, ndcY);
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
    };
    return CurveSceneController;
}());
exports.CurveSceneController = CurveSceneController;
