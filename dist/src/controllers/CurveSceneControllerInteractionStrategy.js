"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPSelection = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection = exports.CurveSceneControllerNoShapeSpaceConstraintsCPDragging = exports.CurveSceneControllerNoShapeSpaceConstraintsCPSelection = exports.CurveSceneControllerKnotInsertion = exports.CurveSceneControllerInteractionStrategy = void 0;
var OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
var CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
var ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var CurveModel_1 = require("../newModels/CurveModel");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var CurveCategory_1 = require("../shapeNavigableCurve/CurveCategory");
var EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var CurveSceneControllerInteractionStrategy = /** @class */ (function () {
    function CurveSceneControllerInteractionStrategy(curveSceneController) {
        this._curveSceneController = curveSceneController;
        this.shapeNavigableCurve = this._curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this._curveSceneController.curveShapeSpaceNavigator;
        this.selectedControlPoint = null;
    }
    Object.defineProperty(CurveSceneControllerInteractionStrategy.prototype, "curveSceneController", {
        get: function () {
            return this.curveSceneController;
        },
        enumerable: false,
        configurable: true
    });
    return CurveSceneControllerInteractionStrategy;
}());
exports.CurveSceneControllerInteractionStrategy = CurveSceneControllerInteractionStrategy;
// Remark: the interaction states hereunder are independent of the clamping process that can be applied
// to all configurations underneath
var CurveSceneControllerKnotInsertion = /** @class */ (function (_super) {
    __extends(CurveSceneControllerKnotInsertion, _super);
    function CurveSceneControllerKnotInsertion(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        return _this;
    }
    CurveSceneControllerKnotInsertion.prototype.insertKnotIntoCurve = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (this.curveModel instanceof CurveModel_1.CurveModel) {
            if (cp === 0) {
                cp += 1;
            }
            ;
            if (cp === this.curveModel.spline.controlPoints.length - 1) {
                cp -= 1;
            }
            ;
        }
        else if (this.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
        }
        var grevilleAbscissae = this.curveModel.spline.grevilleAbscissae();
        if (cp != null) {
            var spline = this.curveModel.spline;
            spline.insertKnot(grevilleAbscissae[cp], 1);
            this.curveModel.setSpline(spline);
            this.updateClampedPoints(grevilleAbscissae[cp]);
            this.curveModel.notifyObservers();
            // JCL this could be better handled with an update process of shapenavigableCurve observers ?
            this.curveShapeSpaceNavigator.navigationState.setCurrentCurve(this.curveModel.spline);
            this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline.clone();
            if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintStrategy_1.CurveConstraintClampedFirstAndLastControlPoint) {
                this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.setCurrentCurve(this.curveModel.spline);
            }
            this.curveShapeSpaceNavigator.navigationCurveModel.resetCurveToOptimize();
        }
    };
    CurveSceneControllerKnotInsertion.prototype.updateClampedPoints = function (knotParametricLocation) {
        // update the clamped points indices of the shape navigable curve
        this.shapeNavigableCurve.updateClampedPointsAfterKnotInsertion(knotParametricLocation);
        // update the indices of reference points used for curve geometric constraints
        if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint) {
            this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        }
        else if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintStrategy_1.CurveConstraintClampedLastControlPoint) {
            this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.referencePtIndex = this.shapeNavigableCurve.clampedPoints[1];
        }
        // update the graphic location of clamped points
        this._curveSceneController.clampedControlPointView.clearSelectedPoints();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT)
            this._curveSceneController.clampedControlPointView.setSelectedKnot(this.shapeNavigableCurve.clampedPoints[0]);
        if (this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT)
            this._curveSceneController.clampedControlPointView.setSelectedKnot(this.shapeNavigableCurve.clampedPoints[1]);
    };
    CurveSceneControllerKnotInsertion.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "insert knot");
        warning.logMessage();
        this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
        this.insertKnotIntoCurve(this.selectedControlPoint);
        this._curveSceneController.selectedControlPoint = null;
        this.selectedControlPoint = null;
        this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
        this._curveSceneController.renderFrame();
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this._curveSceneController));
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationThroughSimplerShapeSpaces) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationStrictlyInsideShapeSpace) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
        }
    };
    CurveSceneControllerKnotInsertion.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerKnotInsertion.prototype.processLeftMouseUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerKnotInsertion.prototype.processShiftKeyDownInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerKnotInsertion.prototype.processShiftKeyUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerKnotInsertion;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerKnotInsertion = CurveSceneControllerKnotInsertion;
var CurveSceneControllerNoShapeSpaceConstraintsCPSelection = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNoShapeSpaceConstraintsCPSelection, _super);
    function CurveSceneControllerNoShapeSpaceConstraintsCPSelection(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.insertKnotButtonView = _this._curveSceneController.insertKnotButtonView;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveModel.notifyObservers();
        return _this;
    }
    CurveSceneControllerNoShapeSpaceConstraintsCPSelection.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        if (this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            console.log("insertButton");
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            console.log(" select CP id = ", this.selectedControlPoint);
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if (this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPDragging(this._curveSceneController));
            }
        }
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPSelection.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPSelection.prototype.processLeftMouseUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPSelection.prototype.processShiftKeyDownInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPSelection.prototype.processShiftKeyUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerNoShapeSpaceConstraintsCPSelection;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerNoShapeSpaceConstraintsCPSelection = CurveSceneControllerNoShapeSpaceConstraintsCPSelection;
var CurveSceneControllerNoShapeSpaceConstraintsCPDragging = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNoShapeSpaceConstraintsCPDragging, _super);
    function CurveSceneControllerNoShapeSpaceConstraintsCPDragging(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        return _this;
    }
    CurveSceneControllerNoShapeSpaceConstraintsCPDragging.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPDragging.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var x = ndcX;
        var y = ndcY;
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPDragging.prototype.processLeftMouseUpInteraction = function () {
        console.log(" processLeftMouseUpInteraction");
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this._curveSceneController));
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPDragging.prototype.processShiftKeyDownInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNoShapeSpaceConstraintsCPDragging.prototype.processShiftKeyUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerNoShapeSpaceConstraintsCPDragging;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerNoShapeSpaceConstraintsCPDragging = CurveSceneControllerNoShapeSpaceConstraintsCPDragging;
var CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection, _super);
    function CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.insertKnotButtonView = _this._curveSceneController.insertKnotButtonView;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = _this.curveModel.spline;
        _this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = _this.curveModel.spline;
        _this.curveModel.notifyObservers();
        return _this;
    }
    CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        if (this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
            console.log("Nested simplified spaces: insertButton");
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            console.log(" select CP id = ", this.selectedControlPoint);
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if (this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                if (this.shapeNavigableCurve.curveCategory instanceof CurveCategory_1.OpenPlanarCurve) {
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
                }
                else if (this.shapeNavigableCurve.curveCategory instanceof CurveCategory_1.ClosedPlanarCurve) {
                    // this.shapeNavigableCurve.changeMngmtOfEventAtExtremity(new NoEventToManageForClosedCurve(this.shapeNavigableCurve.eventMgmtAtExtremities));
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve(this._curveSceneController));
                }
            }
        }
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        // const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        // warning.logMessageToConsole();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection.prototype.processLeftMouseUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection.prototype.processShiftKeyDownInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection.prototype.processShiftKeyUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection = CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection;
var CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve, _super);
    function CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        // if(this.curveShapeSpaceNavigator.eventStateAtCrvExtremities instanceof EventStayInsideCurve) {
        //     this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(this._curveSceneController));
        // }
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.eventMgmtAtExtremities = _this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        _this.controlOfInflection = _this.curveShapeSpaceNavigator.getActiveControlInflections();
        _this.controlOfCurvatureExtrema = _this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        _this.managementOfEventsAtExtremities = _this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if (_this.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            _this.eventsStayInsideInterval = true;
        }
        else {
            _this.eventsStayInsideInterval = false;
        }
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = _this.curveModel.spline;
        _this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = _this.curveModel.spline;
        return _this;
    }
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurve');
        var x = ndcX;
        var y = ndcY;
        // console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            // console.log("x0= " + this.curveModel.spline.controlPoints[0].x + " y0= " + this.curveModel.spline.controlPoints[0].y +
            // " x1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].x + " y1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].y)
            if (!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            }
            else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.eventMgmtAtExtremities.clearEvents();
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied) {
                    console.log("Constraints not satisfied - must change interaction Strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(this._curveSceneController));
                }
                else if (this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval && this.eventsStayInsideInterval) {
                    console.log("An event went out of the interval. Display previous step");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(this._curveSceneController));
                }
                else {
                    if (this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval) {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval = false;
                    }
                    this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                    this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                }
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve.prototype.processLeftMouseUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve.prototype.processShiftKeyDownInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "events can slip out");
        message.logMessage();
        if (this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            this.eventsStayInsideInterval = false;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve.prototype.processShiftKeyUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
        message.logMessage();
        if (this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive) {
            var message_1 = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
            message_1.logMessage();
            this.eventsStayInsideInterval = true;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    };
    return CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve;
var CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval, _super);
    function CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.curvatureExtSplippingOut = [];
        _this.inflectionsSplippingOut = [];
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.eventMgmtAtExtremities = _this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveModel.setSpline(_this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        _this.convertNeighboringEventsIntoDiffEventsToDisplay();
        _this.curveModel.notifyObservers();
        _this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        return _this;
    }
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurveEventsInsideInterval');
        var x = ndcX;
        var y = ndcY;
        // console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            // console.log("x0= " + this.curveModel.spline.controlPoints[0].x + " y0= " + this.curveModel.spline.controlPoints[0].y +
            // " x1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].x + " y1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].y)
            if (!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                console.log("Inconsistent curve shape control settings");
            }
            else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.clearListsOfDiffEvents();
                this.updateDiffEventsToDisplay();
                this.eventMgmtAtExtremities.clearEvents();
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied) {
                    console.log("Constraints not satisfied - must change interaction Strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(this._curveSceneController));
                }
                else if (this.eventsStayInsideInterval) {
                    this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                    this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                    this.eventMgmtAtExtremities.eventOutOfInterval = false;
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
                }
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.processLeftMouseUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", " come back to point selection");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.processShiftKeyDownInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", " come back to drag point");
        message.logMessage();
        this.eventsStayInsideInterval = false;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.processShiftKeyUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", " come back to drag point");
        message.logMessage();
        this.eventsStayInsideInterval = true;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.clearListsOfDiffEvents = function () {
        this.curvatureExtSplippingOut = [];
        this.inflectionsSplippingOut = [];
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.updateDiffEventsToDisplay = function () {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval.prototype.convertNeighboringEventsIntoDiffEventsToDisplay = function () {
        this.curvatureExtSplippingOut = this.eventMgmtAtExtremities.locationsCurvExtrema;
        this.inflectionsSplippingOut = this.eventMgmtAtExtremities.locationsInflections;
        this.updateDiffEventsToDisplay();
    };
    return CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval;
}(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve));
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval;
var CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied, _super);
    function CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.eventMgmtAtExtremities = _this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        _this.lastValidCurve = _this.curveModel.spline.clone();
        _this.curveModel.setSpline(_this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        _this._curveSceneController.highlightedControlPolygonView.update(_this.lastValidCurve);
        _this._curveSceneController.phantomCurveView.update(_this.lastValidCurve);
        return _this;
    }
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var x = ndcX;
        var y = ndcY;
        console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if (!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            }
            else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied)
                    console.log("Constraints not satisfied - new interaction Strategy");
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied.prototype.processLeftMouseUpInteraction = function () {
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied.prototype.processShiftKeyDownInteraction = function () {
        // this.curveEventAtExtremityMayVanish = true;
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied.prototype.processShiftKeyUpInteraction = function () {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    return CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied;
}(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve));
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied;
var CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve = /** @class */ (function (_super) {
    __extends(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve, _super);
    function CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve(curveSceneController) {
        return _super.call(this, curveSceneController) || this;
    }
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve.prototype.processShiftKeyDownInteraction = function () {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve.prototype.processShiftKeyUpInteraction = function () {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    return CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve;
}(CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve));
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve;
var CurveSceneControllerStrictlyInsideShapeSpaceCPSelection = /** @class */ (function (_super) {
    __extends(CurveSceneControllerStrictlyInsideShapeSpaceCPSelection, _super);
    function CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.insertKnotButtonView = _this._curveSceneController.insertKnotButtonView;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = _this.curveModel.spline;
        _this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = _this.curveModel.spline;
        _this.curveModel.notifyObservers();
        return _this;
    }
    CurveSceneControllerStrictlyInsideShapeSpaceCPSelection.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        if (this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            console.log(" stricly inside shape space: select CP id = ", this.selectedControlPoint);
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if (this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                if (this.shapeNavigableCurve.curveCategory instanceof CurveCategory_1.OpenPlanarCurve) {
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
                }
                else if (this.shapeNavigableCurve.curveCategory instanceof ClosedCurveModel_1.ClosedCurveModel) {
                    // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve(this._curveSceneController));
                }
            }
        }
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPSelection.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPSelection.prototype.processLeftMouseUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPSelection.prototype.processShiftKeyDownInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPSelection.prototype.processShiftKeyUpInteraction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerStrictlyInsideShapeSpaceCPSelection;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPSelection = CurveSceneControllerStrictlyInsideShapeSpaceCPSelection;
var CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve = /** @class */ (function (_super) {
    __extends(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve, _super);
    function CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.eventMgmtAtExtremities = _this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        _this.controlOfInflection = _this.curveShapeSpaceNavigator.getActiveControlInflections();
        _this.controlOfCurvatureExtrema = _this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        _this.managementOfEventsAtExtremities = _this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if (_this.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            _this.eventsStayInsideInterval = true;
        }
        else {
            _this.eventsStayInsideInterval = false;
        }
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = _this.curveModel.spline;
        _this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = _this.curveModel.spline;
        return _this;
    }
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve.prototype.processLeftMouseDownInteraction = function (ndcX, ndcY) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurve Stricly Inside Shape Space');
        var x = ndcX;
        var y = ndcY;
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if (!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            }
            else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                console.log("navigate inside shape space");
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
            }
            // if(this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.isActive()) {
            if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                    console.log("need to change interaction strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary(this._curveSceneController));
                }
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve.prototype.processLeftMouseUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve.prototype.processShiftKeyDownInteraction = function () {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processShiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve.prototype.processShiftKeyUpInteraction = function () {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processShiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    };
    return CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve;
}(CurveSceneControllerInteractionStrategy));
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve;
var CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary = /** @class */ (function (_super) {
    __extends(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary, _super);
    function CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary(curveSceneController) {
        var _this = _super.call(this, curveSceneController) || this;
        _this.curvatureExtEntering = [];
        _this.curvatureExtSplippingOut = [];
        _this.inflectionsEntering = [];
        _this.inflectionsSplippingOut = [];
        _this.selectedControlPoint = _this._curveSceneController.selectedControlPoint;
        _this.curveModel = _this.shapeNavigableCurve.curveCategory.curveModel;
        _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = _this.curveModel.spline;
        // this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        if (_this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !_this.isNeighboringEventAtExtremity()) {
            _this.adjacentShapeSpaceCurve = _this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve;
            _this._curveSceneController.highlightedControlPolygonView.update(_this.adjacentShapeSpaceCurve);
            _this._curveSceneController.phantomCurveView.update(_this.adjacentShapeSpaceCurve);
        }
        else {
            _this.adjacentShapeSpaceCurve = _this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve;
        }
        if (_this.isNeighboringEventAtExtremity()) {
            _this._displayPhantomEntities = false;
        }
        else {
            _this._displayPhantomEntities = true;
        }
        _this.curveModel.setSpline(_this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        _this.convertNeighboringEventsIntoDiffEventsToDisplay();
        _this.curveModel.notifyObservers();
        _this.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace();
        _this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
        if (_this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            _this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
        }
        return _this;
    }
    Object.defineProperty(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype, "displayPhantomEntities", {
        get: function () {
            return this._displayPhantomEntities;
        },
        enumerable: false,
        configurable: true
    });
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.processLeftMouseDragInteraction = function (ndcX, ndcY) {
        var x = ndcX;
        var y = ndcY;
        console.log(" shape space boundary: selected point = ", this.selectedControlPoint);
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if (!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization
                because it is part of the optimize method (whether sliding is active or not) */
                console.log("Inconsistent curve shape control settings");
            }
            else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.clearListsOfDiffEvents();
                this.updateDiffEventsToDisplay();
                console.log("navigate at boundary");
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if (this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied)
                    console.log("Constraints not satisfied - new interaction Strategy");
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                    // if(this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.isActive()) {
                    if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                        this.updateCurveAdjacentToShapeSpace();
                        this.convertNeighboringEventsIntoDiffEventsToDisplay();
                        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
                        this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                    }
                    else {
                        console.log("change interaction strategy to drag inside shape space");
                        this.clearListsOfDiffEvents();
                        this.updateDiffEventsToDisplay();
                        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.reset();
                        this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                        this.curveModel.notifyObservers();
                        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
                        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
                    }
                }
            }
            this.curveModel.notifyObservers();
            this.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.processLeftMouseUpInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this.clearListsOfDiffEvents();
        this.updateDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.processShiftKeyDownInteraction = function () {
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "free differential events");
        message.logMessage();
        this.clearListsOfDiffEvents();
        this.updateDiffEventsToDisplay();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.addTransitionOfEvents(this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents);
        if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.deactivate();
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.addTransitionOfEvents(this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents);
        }
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.clearListsOfDiffEvents = function () {
        this.curvatureExtEntering = [];
        this.curvatureExtSplippingOut = [];
        this.inflectionsEntering = [];
        this.inflectionsSplippingOut = [];
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.updateDiffEventsToDisplay = function () {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedEnteringCurvatureExtremaView.updatePoints(this.curvatureExtEntering);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
        this._curveSceneController.selectedEnteringInflectionsView.updatePoints(this.inflectionsEntering);
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.convertNeighboringEventsIntoDiffEventsToDisplay = function () {
        var e_1, _a;
        var sequenceOpt = this.curveShapeSpaceNavigator.navigationState.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        try {
            for (var _b = __values(this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var neighboringEvents = _c.value;
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                    this.curvatureExtEntering.push(0);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                    this.curvatureExtEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                    var eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                    this.curvatureExtSplippingOut.push(eventLocation);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                    var eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                    this.curvatureExtSplippingOut.push(eventLocation);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                    var eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                    this.curvatureExtEntering.push(eventLocation1.location);
                    var eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                    this.curvatureExtEntering.push(eventLocation2.location);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                    var eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                    this.curvatureExtSplippingOut.push(eventLocation1.location);
                    var eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                    this.curvatureExtSplippingOut.push(eventLocation2.location);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                    var eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                    this.inflectionsSplippingOut.push(eventLocation);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                    this.inflectionsEntering.push(0);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                    var eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                    this.inflectionsSplippingOut.push(eventLocation);
                }
                else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                    this.inflectionsEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.updateDiffEventsToDisplay();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.updateCurveAdjacentToShapeSpace = function () {
        if (this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve;
            this._curveSceneController.highlightedControlPolygonView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.phantomCurveView.update(this.adjacentShapeSpaceCurve);
        }
        else if (!this.isNeighboringEventAtExtremity()) {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        if (this.isNeighboringEventAtExtremity()) {
            this._displayPhantomEntities = false;
        }
        else {
            this._displayPhantomEntities = true;
        }
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace = function () {
        if (this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this._curveSceneController.selectedEnteringCurvatureExtremaView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.selectedEnteringInflectionsView.update(this.adjacentShapeSpaceCurve);
            this.updateDiffEventsToDisplay();
        }
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary.prototype.isNeighboringEventAtExtremity = function () {
        var e_2, _a;
        var result = false;
        var anyOtherTypeOfEvent = false;
        try {
            for (var _b = __values(this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.currentNeighboringEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var neighboringEvent_1 = _c.value;
                switch (neighboringEvent_1.type) {
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear:
                        if (!anyOtherTypeOfEvent)
                            result = true;
                        break;
                    default:
                        anyOtherTypeOfEvent = true;
                        result = false;
                        break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var neighboringEvent = this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.currentNeighboringEvents[0];
        return result;
    };
    return CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary;
}(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve));
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary;
var CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve = /** @class */ (function (_super) {
    __extends(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve, _super);
    function CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve(curveSceneController) {
        return _super.call(this, curveSceneController) || this;
    }
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve.prototype.processShiftKeyDownInteraction = function () {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve.prototype.processShiftKeyUpInteraction = function () {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        var message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    };
    return CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve;
}(CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve));
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve;
