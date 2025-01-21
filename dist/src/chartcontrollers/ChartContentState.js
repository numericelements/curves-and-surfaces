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
exports.ChartFunctionBsqrtScaled = exports.ChartAbsCurvatureCrv = exports.ChartCurvatureCrv = exports.ChartFunctionB = exports.ChartFunctionA = exports.ChartWithNoFunction = exports.ChartContentState = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbsCurvatureSceneController_1 = require("./AbsCurvatureSceneController");
var CurvatureSceneController_1 = require("./CurvatureSceneController");
var FunctionASceneController_1 = require("./FunctionASceneController");
var FunctionBSceneController_1 = require("./FunctionBSceneController");
var FunctionBSceneControllerSqrtScaled_1 = require("./FunctionBSceneControllerSqrtScaled");
var NoFunctionSceneController_1 = require("./NoFunctionSceneController");
var ChartContentState = /** @class */ (function () {
    function ChartContentState(chartSceneController, chartController) {
        this.chartSceneController = chartSceneController;
        this.chartController = chartController;
    }
    ChartContentState.prototype.setChartSceneController = function (chartSceneController) {
        this.chartSceneController = chartSceneController;
    };
    ChartContentState.prototype.setChartWithNoFunction = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartWithNoFunction(this.chartSceneController, this.chartController));
    };
    ChartContentState.prototype.setChartWithFunctionA = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionA(this.chartSceneController, this.chartController));
    };
    ChartContentState.prototype.setChartWithFunctionB = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionB(this.chartSceneController, this.chartController));
    };
    ChartContentState.prototype.setChartWithCurvatureCrv = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartCurvatureCrv(this.chartSceneController, this.chartController));
    };
    ChartContentState.prototype.setChartWithAbsCurvature = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartAbsCurvatureCrv(this.chartSceneController, this.chartController));
    };
    ChartContentState.prototype.setChartWithFunctionBsqrtScaled = function () {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionBsqrtScaled(this.chartSceneController, this.chartController));
    };
    return ChartContentState;
}());
exports.ChartContentState = ChartContentState;
var ChartWithNoFunction = /** @class */ (function (_super) {
    __extends(ChartWithNoFunction, _super);
    function ChartWithNoFunction(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new NoFunctionSceneController_1.NoFunctionSceneController(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartWithNoFunction.prototype.setChartWithNoFunction = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithNoFunction", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartWithNoFunction;
}(ChartContentState));
exports.ChartWithNoFunction = ChartWithNoFunction;
var ChartFunctionA = /** @class */ (function (_super) {
    __extends(ChartFunctionA, _super);
    function ChartFunctionA(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new FunctionASceneController_1.FunctionASceneController(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartFunctionA.prototype.setChartWithFunctionA = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionA", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartFunctionA;
}(ChartContentState));
exports.ChartFunctionA = ChartFunctionA;
var ChartFunctionB = /** @class */ (function (_super) {
    __extends(ChartFunctionB, _super);
    function ChartFunctionB(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new FunctionBSceneController_1.FunctionBSceneController(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartFunctionB.prototype.setChartWithFunctionB = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionB", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartFunctionB;
}(ChartContentState));
exports.ChartFunctionB = ChartFunctionB;
var ChartCurvatureCrv = /** @class */ (function (_super) {
    __extends(ChartCurvatureCrv, _super);
    function ChartCurvatureCrv(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new CurvatureSceneController_1.CurvatureSceneController(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartCurvatureCrv.prototype.setChartWithCurvatureCrv = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithCurvatureCrv", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartCurvatureCrv;
}(ChartContentState));
exports.ChartCurvatureCrv = ChartCurvatureCrv;
var ChartAbsCurvatureCrv = /** @class */ (function (_super) {
    __extends(ChartAbsCurvatureCrv, _super);
    function ChartAbsCurvatureCrv(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new AbsCurvatureSceneController_1.AbsCurvatureSceneController(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartAbsCurvatureCrv.prototype.setChartWithAbsCurvature = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithAbsCurvature", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartAbsCurvatureCrv;
}(ChartContentState));
exports.ChartAbsCurvatureCrv = ChartAbsCurvatureCrv;
var ChartFunctionBsqrtScaled = /** @class */ (function (_super) {
    __extends(ChartFunctionBsqrtScaled, _super);
    function ChartFunctionBsqrtScaled(chartSceneController, chartController) {
        var _this = _super.call(this, chartSceneController, chartController) || this;
        var chartObservedBySceneController = new FunctionBSceneControllerSqrtScaled_1.FunctionBSceneControllerSqrtScaled(_this.chartController);
        var index = _this.chartSceneController.chartControllers.indexOf(_this.chartController);
        _this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        _this.chartSceneController.addCurveObserver(chartObservedBySceneController);
        return _this;
    }
    ChartFunctionBsqrtScaled.prototype.setChartWithFunctionBsqrtScaled = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionBsqrtScaled", "no state change to perform there.");
        warning.logMessage();
    };
    return ChartFunctionBsqrtScaled;
}(ChartContentState));
exports.ChartFunctionBsqrtScaled = ChartFunctionBsqrtScaled;
