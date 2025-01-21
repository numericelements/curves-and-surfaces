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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleConstraintAtPoint1Point2ConstraintState = exports.HandleConstraintAtPoint1NoConstraintPoint2ConstraintState = exports.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState = exports.HandleConstraintAtPoint1Point2NoConstraintState = exports.CurveConstraintSelectionState = void 0;
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var CurveConstraintSelectionState = /** @class */ (function () {
    function CurveConstraintSelectionState(context) {
        this.curveSceneController = context;
        this.shapeNavigableCurve = this.curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        this.curveConstraints = this.shapeNavigableCurve.curveConstraints;
    }
    CurveConstraintSelectionState.prototype.setContext = function (context) {
        this.curveSceneController = context;
    };
    return CurveConstraintSelectionState;
}());
exports.CurveConstraintSelectionState = CurveConstraintSelectionState;
var HandleConstraintAtPoint1Point2NoConstraintState = /** @class */ (function (_super) {
    __extends(HandleConstraintAtPoint1Point2NoConstraintState, _super);
    function HandleConstraintAtPoint1Point2NoConstraintState(context) {
        var _this = _super.call(this, context) || this;
        var crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintNoConstraint(_this.shapeNavigableCurve.curveConstraints);
        _this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        _this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
        return _this;
    }
    HandleConstraintAtPoint1Point2NoConstraintState.prototype.handleCurveConstraintAtPoint1 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_1 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning_1.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController));
    };
    HandleConstraintAtPoint1Point2NoConstraintState.prototype.handleCurveConstraintAtPoint2 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_2 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning_2.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController));
    };
    return HandleConstraintAtPoint1Point2NoConstraintState;
}(CurveConstraintSelectionState));
exports.HandleConstraintAtPoint1Point2NoConstraintState = HandleConstraintAtPoint1Point2NoConstraintState;
var HandleConstraintAtPoint1ConstraintPoint2NoConstraintState = /** @class */ (function (_super) {
    __extends(HandleConstraintAtPoint1ConstraintPoint2NoConstraintState, _super);
    function HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(context) {
        var _this = _super.call(this, context) || this;
        var crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(_this.shapeNavigableCurve.curveConstraints);
        _this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        _this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
        return _this;
    }
    HandleConstraintAtPoint1ConstraintPoint2NoConstraintState.prototype.handleCurveConstraintAtPoint1 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessage();
        var indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(function (element) { return element == selectedPoint; });
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_3 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning_3.logMessage();
        }
        else if (indexClampedPoint === -1) {
            var warning_4 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning_4.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController));
    };
    HandleConstraintAtPoint1ConstraintPoint2NoConstraintState.prototype.handleCurveConstraintAtPoint2 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_5 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning_5.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController));
    };
    return HandleConstraintAtPoint1ConstraintPoint2NoConstraintState;
}(CurveConstraintSelectionState));
exports.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState = HandleConstraintAtPoint1ConstraintPoint2NoConstraintState;
var HandleConstraintAtPoint1NoConstraintPoint2ConstraintState = /** @class */ (function (_super) {
    __extends(HandleConstraintAtPoint1NoConstraintPoint2ConstraintState, _super);
    function HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(context) {
        var _this = _super.call(this, context) || this;
        var crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedLastControlPoint(_this.shapeNavigableCurve.curveConstraints);
        _this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        _this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
        return _this;
    }
    HandleConstraintAtPoint1NoConstraintPoint2ConstraintState.prototype.handleCurveConstraintAtPoint1 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessage();
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_6 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning_6.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController));
    };
    HandleConstraintAtPoint1NoConstraintPoint2ConstraintState.prototype.handleCurveConstraintAtPoint2 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessage();
        var indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(function (element) { return element == selectedPoint; });
        if (this.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_7 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning_7.logMessage();
        }
        else if (indexClampedPoint === -1) {
            var warning_8 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning_8.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController));
    };
    return HandleConstraintAtPoint1NoConstraintPoint2ConstraintState;
}(CurveConstraintSelectionState));
exports.HandleConstraintAtPoint1NoConstraintPoint2ConstraintState = HandleConstraintAtPoint1NoConstraintPoint2ConstraintState;
var HandleConstraintAtPoint1Point2ConstraintState = /** @class */ (function (_super) {
    __extends(HandleConstraintAtPoint1Point2ConstraintState, _super);
    function HandleConstraintAtPoint1Point2ConstraintState(context) {
        var _this = _super.call(this, context) || this;
        var crvConstraintAtExtremitiesStgy = new CurveConstraintStrategy_1.CurveConstraintClampedFirstAndLastControlPoint(_this.shapeNavigableCurve.curveConstraints);
        _this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        _this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
        return _this;
    }
    HandleConstraintAtPoint1Point2ConstraintState.prototype.handleCurveConstraintAtPoint1 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessage();
        var indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(function (element) { return element == selectedPoint; });
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_9 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning_9.logMessage();
        }
        else if (indexClampedPoint === -1) {
            var warning_10 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning_10.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[0] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController));
    };
    HandleConstraintAtPoint1Point2ConstraintState.prototype.handleCurveConstraintAtPoint2 = function (selectedPoint) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessage();
        var indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(function (element) { return element == selectedPoint; });
        if (this.shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
            var warning_11 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning_11.logMessage();
        }
        else if (indexClampedPoint === -1) {
            var warning_12 = new ErrorLoging_1.WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning_12.logMessage();
        }
        else {
            this.shapeNavigableCurve.clampedPoints[1] = ShapeNavigableCurve_1.NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController));
    };
    return HandleConstraintAtPoint1Point2ConstraintState;
}(CurveConstraintSelectionState));
exports.HandleConstraintAtPoint1Point2ConstraintState = HandleConstraintAtPoint1Point2ConstraintState;
