"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve = exports.CurveSceneControllerStrictlyInsideShapeSpaceCPSelection = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve = exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection = exports.CurveSceneControllerNoShapeSpaceConstraintsCPDragging = exports.CurveSceneControllerNoShapeSpaceConstraintsCPSelection = exports.CurveSceneControllerKnotInsertion = exports.CurveSceneControllerInteractionStrategy = void 0;
const OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
const CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
const ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const CurveModel_1 = require("../newModels/CurveModel");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
const CurveCategory_1 = require("../shapeNavigableCurve/CurveCategory");
const EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
const ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
class CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        this._curveSceneController = curveSceneController;
        this.shapeNavigableCurve = this._curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this._curveSceneController.curveShapeSpaceNavigator;
        this.selectedControlPoint = null;
    }
    get curveSceneController() {
        return this.curveSceneController;
    }
}
exports.CurveSceneControllerInteractionStrategy = CurveSceneControllerInteractionStrategy;
// Remark: the interaction states hereunder are independent of the clamping process that can be applied
// to all configurations underneath
class CurveSceneControllerKnotInsertion extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
    }
    insertKnotIntoCurve(controlPointIndex) {
        let cp = controlPointIndex;
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
        const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae();
        if (cp != null) {
            const spline = this.curveModel.spline;
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
    }
    updateClampedPoints(knotParametricLocation) {
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
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "insert knot");
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
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyDownInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerKnotInsertion = CurveSceneControllerKnotInsertion;
class CurveSceneControllerNoShapeSpaceConstraintsCPSelection extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveModel.notifyObservers();
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
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
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyDownInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerNoShapeSpaceConstraintsCPSelection = CurveSceneControllerNoShapeSpaceConstraintsCPSelection;
class CurveSceneControllerNoShapeSpaceConstraintsCPDragging extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const x = ndcX;
        const y = ndcY;
        if (this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }
    processLeftMouseUpInteraction() {
        console.log(" processLeftMouseUpInteraction");
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerNoShapeSpaceConstraintsCPDragging = CurveSceneControllerNoShapeSpaceConstraintsCPDragging;
class CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        this.curveModel.notifyObservers();
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
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
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        // const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        // warning.logMessageToConsole();
    }
    processLeftMouseUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyDownInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection = CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection;
class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        // if(this.curveShapeSpaceNavigator.eventStateAtCrvExtremities instanceof EventStayInsideCurve) {
        //     this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(this._curveSceneController));
        // }
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.getActiveControlInflections();
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if (this.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            this.eventsStayInsideInterval = true;
        }
        else {
            this.eventsStayInsideInterval = false;
        }
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurve');
        const x = ndcX;
        const y = ndcY;
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
    }
    processLeftMouseUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "events can slip out");
        message.logMessage();
        if (this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            this.eventsStayInsideInterval = false;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    }
    processShiftKeyUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
        message.logMessage();
        if (this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive) {
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
            message.logMessage();
            this.eventsStayInsideInterval = true;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    }
}
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve;
class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.curvatureExtSplippingOut = [];
        this.inflectionsSplippingOut = [];
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this.convertNeighboringEventsIntoDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurveEventsInsideInterval');
        const x = ndcX;
        const y = ndcY;
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
    }
    processLeftMouseUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", " come back to point selection");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", " come back to drag point");
        message.logMessage();
        this.eventsStayInsideInterval = false;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    }
    processShiftKeyUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", " come back to drag point");
        message.logMessage();
        this.eventsStayInsideInterval = true;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    }
    clearListsOfDiffEvents() {
        this.curvatureExtSplippingOut = [];
        this.inflectionsSplippingOut = [];
    }
    updateDiffEventsToDisplay() {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
    }
    convertNeighboringEventsIntoDiffEventsToDisplay() {
        this.curvatureExtSplippingOut = this.eventMgmtAtExtremities.locationsCurvExtrema;
        this.inflectionsSplippingOut = this.eventMgmtAtExtremities.locationsInflections;
        this.updateDiffEventsToDisplay();
    }
}
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval;
class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.lastValidCurve = this.curveModel.spline.clone();
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this._curveSceneController.highlightedControlPolygonView.update(this.lastValidCurve);
        this._curveSceneController.phantomCurveView.update(this.lastValidCurve);
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const x = ndcX;
        const y = ndcY;
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
    }
    processLeftMouseUpInteraction() {
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        // this.curveEventAtExtremityMayVanish = true;
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
    processShiftKeyUpInteraction() {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
}
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied;
class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {
    constructor(curveSceneController) {
        super(curveSceneController);
    }
    processShiftKeyDownInteraction() {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
    processShiftKeyUpInteraction() {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
}
exports.CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve = CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve;
class CurveSceneControllerStrictlyInsideShapeSpaceCPSelection extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        this.curveModel.notifyObservers();
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
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
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyDownInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPSelection = CurveSceneControllerStrictlyInsideShapeSpaceCPSelection;
class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve extends CurveSceneControllerInteractionStrategy {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.getActiveControlInflections();
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if (this.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
            this.eventsStayInsideInterval = true;
        }
        else {
            this.eventsStayInsideInterval = false;
        }
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
    }
    processLeftMouseDownInteraction(ndcX, ndcY) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        console.log('drag CPDraggingOpenCurve Stricly Inside Shape Space');
        const x = ndcX;
        const y = ndcY;
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
    }
    processLeftMouseUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processShiftKeyDownInteraction", "nothing to do there");
        warning.logMessage();
    }
    processShiftKeyUpInteraction() {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "processShiftKeyUpInteraction", "nothing to do there");
        warning.logMessage();
    }
}
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve;
class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary extends CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve {
    constructor(curveSceneController) {
        super(curveSceneController);
        this.curvatureExtEntering = [];
        this.curvatureExtSplippingOut = [];
        this.inflectionsEntering = [];
        this.inflectionsSplippingOut = [];
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        // this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        if (this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve;
            this._curveSceneController.highlightedControlPolygonView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.phantomCurveView.update(this.adjacentShapeSpaceCurve);
        }
        else {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve;
        }
        if (this.isNeighboringEventAtExtremity()) {
            this._displayPhantomEntities = false;
        }
        else {
            this._displayPhantomEntities = true;
        }
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this.convertNeighboringEventsIntoDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
        if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
        }
    }
    get displayPhantomEntities() {
        return this._displayPhantomEntities;
    }
    processLeftMouseDragInteraction(ndcX, ndcY) {
        const x = ndcX;
        const y = ndcY;
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
    }
    processLeftMouseUpInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessage();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this.clearListsOfDiffEvents();
        this.updateDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    }
    processShiftKeyDownInteraction() {
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "free differential events");
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
    }
    clearListsOfDiffEvents() {
        this.curvatureExtEntering = [];
        this.curvatureExtSplippingOut = [];
        this.inflectionsEntering = [];
        this.inflectionsSplippingOut = [];
    }
    updateDiffEventsToDisplay() {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedEnteringCurvatureExtremaView.updatePoints(this.curvatureExtEntering);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
        this._curveSceneController.selectedEnteringInflectionsView.updatePoints(this.inflectionsEntering);
    }
    convertNeighboringEventsIntoDiffEventsToDisplay() {
        const sequenceOpt = this.curveShapeSpaceNavigator.navigationState.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        for (const neighboringEvents of this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents) {
            if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                this.curvatureExtEntering.push(0);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                this.curvatureExtEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.curvatureExtSplippingOut.push(eventLocation);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.curvatureExtSplippingOut.push(eventLocation);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                const eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                this.curvatureExtEntering.push(eventLocation1.location);
                const eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                this.curvatureExtEntering.push(eventLocation2.location);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                const eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                this.curvatureExtSplippingOut.push(eventLocation1.location);
                const eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                this.curvatureExtSplippingOut.push(eventLocation2.location);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.inflectionsSplippingOut.push(eventLocation);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                this.inflectionsEntering.push(0);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.inflectionsSplippingOut.push(eventLocation);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                this.inflectionsEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
            }
        }
        this.updateDiffEventsToDisplay();
    }
    updateCurveAdjacentToShapeSpace() {
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
    }
    updateDiffEventsEnteringOnCurveAdjacentToShapeSpace() {
        if (this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this._curveSceneController.selectedEnteringCurvatureExtremaView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.selectedEnteringInflectionsView.update(this.adjacentShapeSpaceCurve);
            this.updateDiffEventsToDisplay();
        }
    }
    isNeighboringEventAtExtremity() {
        let result = false;
        let anyOtherTypeOfEvent = false;
        for (const neighboringEvent of this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.currentNeighboringEvents) {
            switch (neighboringEvent.type) {
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
        const neighboringEvent = this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.currentNeighboringEvents[0];
        return result;
    }
}
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary;
class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve extends CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve {
    constructor(curveSceneController) {
        super(curveSceneController);
    }
    processShiftKeyDownInteraction() {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
    processShiftKeyUpInteraction() {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new ErrorLoging_1.WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessage();
    }
}
exports.CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve = CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve;
