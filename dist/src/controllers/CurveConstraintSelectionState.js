"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleConstraintAtPoint1Point2ConstraintState = exports.HandleConstraintAtPoint1NoConstraintPoint2ConstraintState = exports.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState = exports.HandleConstraintAtPoint1Point2NoConstraintState = exports.CurveConstraintSelectionState = void 0;
const ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
const CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
class CurveConstraintSelectionState {
    constructor(context) {
        this.curveSceneController = context;
        this.shapeNavigableCurve = this.curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        this.curveConstraints = this.shapeNavigableCurve.curveConstraints;
    }
    setContext(context) {
        this.curveSceneController = context;
    }
}
exports.CurveConstraintSelectionState = CurveConstraintSelectionState;
class HandleConstraintAtPoint1Point2NoConstraintState extends CurveConstraintSelectionState {
    constructor(context) {
        super(context);
        const crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }
    handleCurveConstraintAtPoint1(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController));
    }
    handleCurveConstraintAtPoint2(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController));
    }
}
exports.HandleConstraintAtPoint1Point2NoConstraintState = HandleConstraintAtPoint1Point2NoConstraintState;
class HandleConstraintAtPoint1ConstraintPoint2NoConstraintState extends CurveConstraintSelectionState {
    constructor(context) {
        super(context);
        const crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }
    handleCurveConstraintAtPoint1(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessage();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else if (indexClampedPoint === -1) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController));
    }
    handleCurveConstraintAtPoint2(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController));
    }
}
exports.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState = HandleConstraintAtPoint1ConstraintPoint2NoConstraintState;
class HandleConstraintAtPoint1NoConstraintPoint2ConstraintState extends CurveConstraintSelectionState {
    constructor(context) {
        super(context);
        const crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedLastControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }
    handleCurveConstraintAtPoint1(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController));
    }
    handleCurveConstraintAtPoint2(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessage();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else if (indexClampedPoint === -1) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController));
    }
}
exports.HandleConstraintAtPoint1NoConstraintPoint2ConstraintState = HandleConstraintAtPoint1NoConstraintPoint2ConstraintState;
class HandleConstraintAtPoint1Point2ConstraintState extends CurveConstraintSelectionState {
    constructor(context) {
        super(context);
        const crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedFirstAndLastControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }
    handleCurveConstraintAtPoint1(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessage();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else if (indexClampedPoint === -1) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController));
    }
    handleCurveConstraintAtPoint2(selectedPoint) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessage();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessage();
        }
        else if (indexClampedPoint === -1) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController));
    }
}
exports.HandleConstraintAtPoint1Point2ConstraintState = HandleConstraintAtPoint1Point2ConstraintState;
