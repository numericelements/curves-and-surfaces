"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartSceneController = exports.CHART_AXIS_SCALE = exports.DATASET_NAMES = exports.CHART_X_AXIS_NAME = exports.CHART_AXES_NAMES = exports.CHART_TITLES = exports.CHART_WIDTH = exports.CHART_HEIGHT = exports.NB_CURVE_POINTS = exports.MAX_NB_CHARTS = void 0;
var ChartDescriptorQueueItem_1 = require("../containers/ChartDescriptorQueueItem");
var Queue_1 = require("../containers/Queue");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ChartContentState_1 = require("./ChartContentState");
var ChartController_1 = require("./ChartController");
var NoFunctionSceneController_1 = require("./NoFunctionSceneController");
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
var ChartSceneController = /** @class */ (function () {
    function ChartSceneController(chartRenderingContext, shapeNavigableCurve) {
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
    Object.defineProperty(ChartSceneController.prototype, "curveObservers", {
        get: function () {
            return this._curveObservers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartSceneController.prototype, "chartControllers", {
        get: function () {
            return this._chartControllers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartSceneController.prototype, "uncheckedChart", {
        get: function () {
            return this._uncheckedChart;
        },
        set: function (chartTitle) {
            this._uncheckedChart = chartTitle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartSceneController.prototype, "curveModel", {
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartSceneController.prototype, "curveObserver", {
        set: function (curveObservers) {
            this._curveObservers = curveObservers;
        },
        enumerable: false,
        configurable: true
    });
    ChartSceneController.prototype.resetUncheckedChart = function () {
        this._uncheckedChart = "";
    };
    ChartSceneController.prototype.generateDefaultChartNames = function () {
        for (var i = 0; i < exports.MAX_NB_CHARTS; i++) {
            this.defaultChartTitles.push('Graph' + (i + 1) + ' tbd');
        }
    };
    ChartSceneController.prototype.changeChartContentState = function (chartController, chartContent) {
        for (var i = 0; i < exports.MAX_NB_CHARTS; i++) {
            if (this.chartControllers[i] === chartController)
                this.chartContent[i] = chartContent;
        }
    };
    ChartSceneController.prototype.init = function () {
        for (var i = 0; i < exports.MAX_NB_CHARTS; i++) {
            if (this.chartControllers.length === exports.MAX_NB_CHARTS) {
                this.chartControllers[i].destroy();
            }
            this.chartControllers.push(new ChartController_1.ChartController(this.defaultChartTitles[i], this.chartRenderingContext[i], exports.CHART_HEIGHT, exports.CHART_WIDTH));
            this._curveObservers.push(new NoFunctionSceneController_1.NoFunctionSceneController(this.chartControllers[this.chartControllers.length - 1]));
            this.chartContent.push(new ChartContentState_1.ChartWithNoFunction(this, this.chartControllers[i]));
            var queueItem = new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(this.chartControllers[this.chartControllers.length - 1], this.defaultChartTitles[i], this._curveObservers[this._curveObservers.length - 1]);
            this.freeChartsQueue.enqueue(queueItem.chartController);
            this.chartsDescriptorsQueue.enqueue(queueItem);
        }
    };
    ChartSceneController.prototype.restart = function (curveModel) {
        var _this = this;
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
        this._curveObservers.forEach(function (element) {
            element.update(_this._curveModel.spline);
        });
    };
    ChartSceneController.prototype.switchChartState = function (chartTitle, indexCtrlr) {
        var chartIndex = exports.CHART_TITLES.indexOf(chartTitle);
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
        var queueItem = new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(this.chartControllers[indexCtrlr], chartTitle, this._curveObservers[indexCtrlr]);
        if (exports.CHART_TITLES.indexOf(chartTitle) === -1) {
            this.chartsDescriptorsQueue.enqueue(queueItem);
        }
        else {
            this.chartsDescriptorsQueue.insertAtController(this.chartControllers[indexCtrlr], queueItem);
        }
    };
    ChartSceneController.prototype.resetChartToDefaultChart = function (chartTitle, currentQueueItem) {
        var index = this.chartsDescriptorsQueue.indexOfFromTitle(chartTitle);
        this.chartsDescriptorsQueue.extractAt(index);
        this.enqueueAndReorderFreeCharts(currentQueueItem.chartController);
        var chartOberserver = currentQueueItem.curveObserver;
        if (chartOberserver !== undefined) {
            this.removeCurveObserver(chartOberserver);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "resetChartToDefaultChart", "Undefined chartObserver. Impossible to process graphs correctly.");
            error.logMessage();
        }
        var indexCtrlr = this.chartControllers.indexOf(currentQueueItem.chartController);
        chartTitle = this.defaultChartTitles[indexCtrlr];
        this._uncheckedChart = chartTitle;
        this.switchChartState(chartTitle, indexCtrlr);
    };
    ChartSceneController.prototype.addChartAtADefaultChartPlace = function (chartTitle) {
        var chartController = this.freeChartsQueue.dequeue();
        if (chartController !== undefined) {
            var indexCtrlr = this.chartControllers.indexOf(chartController);
            var currentQueueItem = this.chartsDescriptorsQueue.findItemFromChartController(chartController);
            if (currentQueueItem !== undefined) {
                var chartOberserver = currentQueueItem.curveObserver;
                this._uncheckedChart = currentQueueItem.chartTitle;
                if (chartOberserver !== undefined) {
                    this.removeCurveObserver(chartOberserver);
                }
                else {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined chartObserver. Impossible to process graphs correctly.");
                    error.logMessage();
                }
            }
            this.switchChartState(chartTitle, indexCtrlr);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined ChartController. Impossible to process graphs correctly.");
            error.logMessage();
        }
    };
    ChartSceneController.prototype.addChartInPlaceOfTheOldestOne = function (chartTitle) {
        var item = this.chartsDescriptorsQueue.get(0);
        if (item !== undefined) {
            this._uncheckedChart = item.chartTitle;
            var chartController = item.chartController;
            var indexCtrlr = this.chartControllers.indexOf(chartController);
            var chartOberserver = item.curveObserver;
            if (chartOberserver !== undefined) {
                this.removeCurveObserver(chartOberserver);
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined chartObserver. Impossible to process graphs correctly.");
                error.logMessage();
            }
            this.switchChartState(chartTitle, indexCtrlr);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined ChartController. Queue content is inconsistent.");
            error.logMessage();
        }
    };
    ChartSceneController.prototype.addChart = function (chartTitle) {
        var currentQueueItem = this.chartsDescriptorsQueue.findItemFromTitle(chartTitle);
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
    };
    ChartSceneController.prototype.reorderFreeCharts = function (chartController, indexCtrlr) {
        var i = this.freeChartsQueue.length() - 2;
        var insert = false;
        while (i >= 0) {
            var chartCtrlr = this.freeChartsQueue.at(i);
            var index = this.chartControllers.indexOf(chartCtrlr);
            if (index < indexCtrlr) {
                this.freeChartsQueue.insertAt(i, chartController);
                insert = true;
            }
            i--;
        }
        if (!insert)
            this.freeChartsQueue.insertAt(0, chartController);
    };
    ChartSceneController.prototype.enqueueAndReorderFreeCharts = function (chartController) {
        var lastChartCtrlr = this.freeChartsQueue.getLast();
        if (lastChartCtrlr !== undefined) {
            var indexCtrlr = this.chartControllers.indexOf(chartController);
            var indexLast = this.chartControllers.indexOf(lastChartCtrlr);
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
    };
    ChartSceneController.prototype.checkRenderingContext = function () {
        if (this.chartRenderingContext.length !== exports.MAX_NB_CHARTS) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkRenderingContext", "Inconsistent number of rendering contexts. Must be equal to MAX_NB_GRAPHS.");
            error.logMessage();
        }
        else {
            for (var i = 0; i < exports.MAX_NB_CHARTS; i++) {
                if (this.chartRenderingContext[i] === null) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkRenderingContext", "Rendering context of graph" + (i + 1) + " is null. Impossible to process graphs correctly.");
                    error.logMessage();
                }
            }
        }
    };
    ChartSceneController.prototype.addCurveObserver = function (curveObserver) {
        if (this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.registerObserver(curveObserver, "curve");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "addCurveObserver", "Unable to attach a curve observer to the current curve. Undefined curve model.");
            error.logMessage();
        }
    };
    ChartSceneController.prototype.removeCurveObserver = function (curveObserver) {
        if (this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.removeObserver(curveObserver, "curve");
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeCurveObserver", "Unable to detach a curve observer to the current curve. Undefined curve model.");
            error.logMessage();
        }
    };
    ChartSceneController.prototype.update = function () {
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
    };
    return ChartSceneController;
}());
exports.ChartSceneController = ChartSceneController;
