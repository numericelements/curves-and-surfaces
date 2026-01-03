"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartSceneController = exports.CHART_AXIS_SCALE = exports.DATASET_NAMES = exports.CHART_X_AXIS_NAME = exports.CHART_AXES_NAMES = exports.CHART_TITLES = exports.CHART_WIDTH = exports.CHART_HEIGHT = exports.NB_CURVE_POINTS = exports.MAX_NB_CHARTS = void 0;
const ChartDescriptorQueueItem_1 = require("../containers/ChartDescriptorQueueItem");
const Queue_1 = require("../containers/Queue");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ChartContentState_1 = require("./ChartContentState");
const ChartController_1 = require("./ChartController");
const NoFunctionSceneController_1 = require("./NoFunctionSceneController");
exports.MAX_NB_CHARTS = 3;
exports.NB_CURVE_POINTS = 100;
exports.CHART_HEIGHT = '600px';
exports.CHART_WIDTH = '700px';
exports.CHART_TITLES = ["Function A(u)",
    "Function B(u)",
    "Curvature of curve",
    "Absolute value of curvature of curve",
    "Function (+/-) sqrt[abs(B(u))]",
    "Graph tbd"];
exports.CHART_AXES_NAMES = ["Function A",
    "Function B",
    "Curvature",
    "Abs curvature",
    "(+/-) sqrt[abs(B(u))]",
    "tbd"];
exports.CHART_X_AXIS_NAME = "u parameter";
exports.DATASET_NAMES = ["Control Polygon", "tbd"];
exports.CHART_AXIS_SCALE = ["linear", "logarithmic"];
class ChartSceneController {
    constructor(chartRenderingContext, shapeNavigableCurve) {
        this.chartRenderingContext = chartRenderingContext;
        this.shapeNavigableCurve = shapeNavigableCurve;
        this._curveModel = shapeNavigableCurve.curveCategory.curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this.checkRenderingContext();
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new Queue_1.QueueChartController(exports.MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new Queue_1.QueueChartDescriptor(exports.MAX_NB_CHARTS);
        this.defaultChartTitles = [];
        this.generateDefaultChartNames();
        this.init();
    }
    get curveObservers() {
        return this._curveObservers;
    }
    get chartControllers() {
        return this._chartControllers;
    }
    get uncheckedChart() {
        return this._uncheckedChart;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    set curveObserver(curveObservers) {
        this._curveObservers = curveObservers;
    }
    set uncheckedChart(chartTitle) {
        this._uncheckedChart = chartTitle;
    }
    resetUncheckedChart() {
        this._uncheckedChart = "";
    }
    generateDefaultChartNames() {
        for (let i = 0; i < exports.MAX_NB_CHARTS; i++) {
            this.defaultChartTitles.push('Graph' + (i + 1) + ' tbd');
        }
    }
    changeChartContentState(chartController, chartContent) {
        for (let i = 0; i < exports.MAX_NB_CHARTS; i++) {
            if (this.chartControllers[i] === chartController)
                this.chartContent[i] = chartContent;
        }
    }
    init() {
        for (let i = 0; i < exports.MAX_NB_CHARTS; i++) {
            if (this.chartControllers.length === exports.MAX_NB_CHARTS) {
                this.chartControllers[i].destroy();
            }
            this.chartControllers.push(new ChartController_1.ChartController(this.defaultChartTitles[i], this.chartRenderingContext[i], exports.CHART_HEIGHT, exports.CHART_WIDTH));
            this._curveObservers.push(new NoFunctionSceneController_1.NoFunctionSceneController(this.chartControllers[this.chartControllers.length - 1]));
            this.chartContent.push(new ChartContentState_1.ChartWithNoFunction(this, this.chartControllers[i]));
            const queueItem = new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(this.chartControllers[this.chartControllers.length - 1], this.defaultChartTitles[i], this._curveObservers[this._curveObservers.length - 1]);
            this.freeChartsQueue.enqueue(queueItem.chartController);
            this.chartsDescriptorsQueue.enqueue(queueItem);
        }
    }
    restart(curveModel) {
        this._curveModel = curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this.checkRenderingContext();
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new Queue_1.QueueChartController(exports.MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new Queue_1.QueueChartDescriptor(exports.MAX_NB_CHARTS);
        this.defaultChartTitles = [];
        this.generateDefaultChartNames();
        this.init();
        this._curveObservers.forEach(element => {
            element.update(this._curveModel.spline);
        });
    }
    switchChartState(chartTitle, indexCtrlr) {
        const chartIndex = exports.CHART_TITLES.indexOf(chartTitle);
        if (chartIndex !== -1) {
            switch (chartIndex) {
                case 0: {
                    this.chartContent[indexCtrlr].setChartWithFunctionA();
                    break;
                }
                case 1: {
                    this.chartContent[indexCtrlr].setChartWithFunctionB();
                    break;
                }
                case 2: {
                    this.chartContent[indexCtrlr].setChartWithCurvatureCrv();
                    break;
                }
                case 3: {
                    this.chartContent[indexCtrlr].setChartWithAbsCurvature();
                    break;
                }
                case 4: {
                    this.chartContent[indexCtrlr].setChartWithFunctionBsqrtScaled();
                    break;
                }
            }
        }
        else {
            this.chartContent[indexCtrlr].setChartWithNoFunction();
        }
        const queueItem = new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(this.chartControllers[indexCtrlr], chartTitle, this._curveObservers[indexCtrlr]);
        if (exports.CHART_TITLES.indexOf(chartTitle) === -1) {
            this.chartsDescriptorsQueue.enqueue(queueItem);
        }
        else {
            this.chartsDescriptorsQueue.insertAtController(this.chartControllers[indexCtrlr], queueItem);
        }
    }
    resetChartToDefaultChart(chartTitle, currentQueueItem) {
        const index = this.chartsDescriptorsQueue.indexOfFromTitle(chartTitle);
        this.chartsDescriptorsQueue.extractAt(index);
        this.enqueueAndReorderFreeCharts(currentQueueItem.chartController);
        const chartOberserver = currentQueueItem.curveObserver;
        if (chartOberserver !== undefined) {
            this.removeCurveObserver(chartOberserver);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "resetChartToDefaultChart", "Undefined chartObserver. Impossible to process graphs correctly.");
            error.logMessage();
        }
        const indexCtrlr = this.chartControllers.indexOf(currentQueueItem.chartController);
        chartTitle = this.defaultChartTitles[indexCtrlr];
        this._uncheckedChart = chartTitle;
        this.switchChartState(chartTitle, indexCtrlr);
    }
    addChartAtADefaultChartPlace(chartTitle) {
        const chartController = this.freeChartsQueue.dequeue();
        if (chartController !== undefined) {
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const currentQueueItem = this.chartsDescriptorsQueue.findItemFromChartController(chartController);
            if (currentQueueItem !== undefined) {
                const chartOberserver = currentQueueItem.curveObserver;
                this._uncheckedChart = currentQueueItem.chartTitle;
                if (chartOberserver !== undefined) {
                    this.removeCurveObserver(chartOberserver);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined chartObserver. Impossible to process graphs correctly.");
                    error.logMessage();
                }
            }
            this.switchChartState(chartTitle, indexCtrlr);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined ChartController. Impossible to process graphs correctly.");
            error.logMessage();
        }
    }
    addChartInPlaceOfTheOldestOne(chartTitle) {
        const item = this.chartsDescriptorsQueue.get(0);
        if (item !== undefined) {
            this._uncheckedChart = item.chartTitle;
            const chartController = item.chartController;
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const chartOberserver = item.curveObserver;
            if (chartOberserver !== undefined) {
                this.removeCurveObserver(chartOberserver);
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined chartObserver. Impossible to process graphs correctly.");
                error.logMessage();
            }
            this.switchChartState(chartTitle, indexCtrlr);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined ChartController. Queue content is inconsistent.");
            error.logMessage();
        }
    }
    addChart(chartTitle) {
        const currentQueueItem = this.chartsDescriptorsQueue.findItemFromTitle(chartTitle);
        if (currentQueueItem !== undefined) {
            this.resetChartToDefaultChart(chartTitle, currentQueueItem);
        }
        else {
            if (this.freeChartsQueue.length() > 0) {
                this.addChartAtADefaultChartPlace(chartTitle);
            }
            else {
                this.addChartInPlaceOfTheOldestOne(chartTitle);
            }
        }
    }
    reorderFreeCharts(chartController, indexCtrlr) {
        let i = this.freeChartsQueue.length() - 2;
        let insert = false;
        while (i >= 0) {
            const chartCtrlr = this.freeChartsQueue.at(i);
            const index = this.chartControllers.indexOf(chartCtrlr);
            if (index < indexCtrlr) {
                this.freeChartsQueue.insertAt(i, chartController);
                insert = true;
            }
            i--;
        }
        if (!insert)
            this.freeChartsQueue.insertAt(0, chartController);
    }
    enqueueAndReorderFreeCharts(chartController) {
        const lastChartCtrlr = this.freeChartsQueue.getLast();
        if (lastChartCtrlr !== undefined) {
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const indexLast = this.chartControllers.indexOf(lastChartCtrlr);
            if (indexCtrlr > indexLast) {
                this.freeChartsQueue.enqueue(chartController);
            }
            else {
                if (this.freeChartsQueue.length() === 1) {
                    this.freeChartsQueue.insertAt(0, chartController);
                }
                else {
                    this.reorderFreeCharts(chartController, indexCtrlr);
                }
            }
        }
        else {
            this.freeChartsQueue.enqueue(chartController);
        }
    }
    checkRenderingContext() {
        if (this.chartRenderingContext.length !== exports.MAX_NB_CHARTS) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkRenderingContext", "Inconsistent number of rendering contexts. Must be equal to MAX_NB_GRAPHS.");
            error.logMessage();
        }
        else {
            for (let i = 0; i < exports.MAX_NB_CHARTS; i++) {
                if (this.chartRenderingContext[i] === null) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkRenderingContext", "Rendering context of graph" + (i + 1) + " is null. Impossible to process graphs correctly.");
                    error.logMessage();
                }
            }
        }
    }
    addCurveObserver(curveObserver) {
        if (this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.registerObserver(curveObserver, "curve");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addCurveObserver", "Unable to attach a curve observer to the current curve. Undefined curve model.");
            error.logMessage();
        }
    }
    removeCurveObserver(curveObserver) {
        if (this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.removeObserver(curveObserver, "curve");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeCurveObserver", "Unable to detach a curve observer to the current curve. Undefined curve model.");
            error.logMessage();
        }
    }
    update() {
        this._curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new Queue_1.QueueChartController(exports.MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new Queue_1.QueueChartDescriptor(exports.MAX_NB_CHARTS);
        this.defaultChartTitles = [];
        this.generateDefaultChartNames();
        this.init();
        console.log("need to update chartSceneController");
    }
}
exports.ChartSceneController = ChartSceneController;
