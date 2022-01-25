import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbsCurvatureSceneController } from "./AbsCurvatureSceneController";
import { ChartController } from "./ChartController";
import { ChartSceneController } from "./ChartSceneController";
import { CurvatureSceneController } from "./CurvatureSceneController";
import { FunctionASceneController } from "./FunctionASceneController";
import { FunctionBSceneController } from "./FunctionBSceneController";
import { FunctionBSceneControllerSqrtScaled } from "./FunctionBSceneControllerSqrtScaled";
import { NoFunctionSceneController } from "./NoFunctionSceneController";

export abstract class ChartContentState {

    protected chartSceneController: ChartSceneController;
    protected chartController: ChartController;

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        this.chartSceneController = chartSceneController;
        this.chartController = chartController;
    }

    setChartSceneController(chartSceneController: ChartSceneController): void {
        this.chartSceneController = chartSceneController;
    }

    setChartWithNoFunction(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartWithNoFunction(this.chartSceneController, this.chartController));
    }

    setChartWithFunctionA(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionA(this.chartSceneController, this.chartController));
    }

    setChartWithFunctionB(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionB(this.chartSceneController, this.chartController));
    }

    setChartWithCurvatureCrv(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartCurvatureCrv(this.chartSceneController, this.chartController)); 
    }

    setChartWithAbsCurvature(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartAbsCurvatureCrv(this.chartSceneController, this.chartController)); 
    }

    setChartWithFunctionBsqrtScaled(): void {
        this.chartSceneController.changeChartContentState(this.chartController, new ChartFunctionBsqrtScaled(this.chartSceneController, this.chartController));
    }

}

export class ChartWithNoFunction extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new NoFunctionSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }
    
    setChartWithNoFunction(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithNoFunction", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}

export class ChartFunctionA extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionASceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }

    setChartWithFunctionA(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithFunctionA", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}

export class ChartFunctionB extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionBSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }

    setChartWithFunctionB(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithFunctionB", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}

export class ChartCurvatureCrv extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new CurvatureSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }

    setChartWithCurvatureCrv(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithCurvatureCrv", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}

export class ChartAbsCurvatureCrv extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new AbsCurvatureSceneController(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }

    setChartWithAbsCurvature(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithAbsCurvature", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}

export class ChartFunctionBsqrtScaled extends ChartContentState {

    constructor(chartSceneController: ChartSceneController, chartController: ChartController) {
        super(chartSceneController, chartController);
        const chartObservedBySceneController = new FunctionBSceneControllerSqrtScaled(this.chartController);
        const index = this.chartSceneController.chartControllers.indexOf(this.chartController);
        this.chartSceneController.curveObservers[index] = chartObservedBySceneController;
        this.chartSceneController.curveSceneController.addCurveObserver(chartObservedBySceneController);
    }

    setChartWithFunctionBsqrtScaled(): void {
        const warning = new WarningLog(this.constructor.name, "setChartWithFunctionBsqrtScaled", "no state change to perform there.");
        warning.logMessageToConsole();
    }
}