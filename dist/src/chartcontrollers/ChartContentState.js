"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartFunctionBsqrtScaled = exports.ChartAbsCurvatureCrv = exports.ChartCurvatureCrv = exports.ChartFunctionB = exports.ChartFunctionA = exports.ChartWithNoFunction = exports.ChartContentState = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const AbsCurvatureSceneController_1 = require("./AbsCurvatureSceneController");
const CurvatureSceneController_1 = require("./CurvatureSceneController");
const FunctionASceneController_1 = require("./FunctionASceneController");
const FunctionBSceneController_1 = require("./FunctionBSceneController");
const FunctionBSceneControllerSqrtScaled_1 = require("./FunctionBSceneControllerSqrtScaled");
const NoFunctionSceneController_1 = require("./NoFunctionSceneController");
class ChartContentState {
    constructor(chartSceneController, chartController) {
        this.chartSceneController = chartSceneController;
        this.chartController = chartController;
    }
    setChartSceneController(chartSceneController) {
        this.chartSceneController = chartSceneController;
    }
    setChartWithNoFunction() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartWithNoFunction(this.chartSceneController, this.chartController));
    }
    setChartWithFunctionA() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionA(this.chartSceneController, this.chartController));
    }
    setChartWithFunctionB() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionB(this.chartSceneController, this.chartController));
    }
    setChartWithCurvatureCrv() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartCurvatureCrv(this.chartSceneController, this.chartController));
    }
    setChartWithAbsCurvature() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartAbsCurvatureCrv(this.chartSceneController, this.chartController));
    }
    setChartWithFunctionBsqrtScaled() {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionBsqrtScaled(this.chartSceneController, this.chartController));
    }
}
exports.ChartContentState = ChartContentState;
class ChartWithNoFunction extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new NoFunctionSceneController_1.NoFunctionSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithNoFunction() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithNoFunction", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartWithNoFunction = ChartWithNoFunction;
class ChartFunctionA extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionASceneController_1.FunctionASceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithFunctionA() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionA", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartFunctionA = ChartFunctionA;
class ChartFunctionB extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionBSceneController_1.FunctionBSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithFunctionB() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionB", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartFunctionB = ChartFunctionB;
class ChartCurvatureCrv extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new CurvatureSceneController_1.CurvatureSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithCurvatureCrv() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithCurvatureCrv", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartCurvatureCrv = ChartCurvatureCrv;
class ChartAbsCurvatureCrv extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new AbsCurvatureSceneController_1.AbsCurvatureSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithAbsCurvature() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithAbsCurvature", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartAbsCurvatureCrv = ChartAbsCurvatureCrv;
class ChartFunctionBsqrtScaled extends ChartContentState {
    constructor(chartSceneController, chartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionBSceneControllerSqrtScaled_1.FunctionBSceneControllerSqrtScaled(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.addCurveObserver(chartObservedBySceneController);
    }
    setChartWithFunctionBsqrtScaled() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "setChartWithFunctionBsqrtScaled", "no state change to perform there.");
        warning.logMessage();
    }
}
exports.ChartFunctionBsqrtScaled = ChartFunctionBsqrtScaled;
