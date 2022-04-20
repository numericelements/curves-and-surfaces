import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ChartDescriptorQueueItem } from "../containers/ChartDescriptorQueueItem";
import { QueueChartDescriptor, QueueChartController } from "../containers/Queue";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { ChartContentState, ChartWithNoFunction } from "./ChartContentState";
import { ChartController } from "./ChartController";
import { NoFunctionSceneController } from "./NoFunctionSceneController";
import { IObserver } from "../newDesignPatterns/Observer";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveModeler } from "../curveModeler/CurveModeler";

export const MAX_NB_CHARTS = 3;
export const NB_CURVE_POINTS = 100;
export const CHART_HEIGHT = '600px';
export const CHART_WIDTH = '700px';
export const CHART_TITLES = ["Function A(u)",
                    "Function B(u)",
                    "Curvature of curve",
                    "Absolute value of curvature of curve",
                    "Function (+/-) sqrt[abs(B(u))]",
                    "Graph tbd"];
export const CHART_AXES_NAMES = ["Function A",
                    "Function B",
                    "Curvature",
                    "Abs curvature",
                    "(+/-) sqrt[abs(B(u))]",
                    "tbd"];
export const CHART_X_AXIS_NAME = "u parameter";
export const DATASET_NAMES = ["Control Polygon", "tbd"];
export const CHART_AXIS_SCALE = ["linear", "logarithmic"]


export class ChartSceneController implements IObserver<CurveModelInterface> {

    private chartRenderingContext: Array<CanvasRenderingContext2D>;
    private freeChartsQueue: QueueChartController;
    private chartsDescriptorsQueue: QueueChartDescriptor;
    private defaultChartTitles: Array<string>;
    private chartContent: Array<ChartContentState>;
    private _chartControllers: Array<ChartController>;
    private _curveObservers: Array<IObserver<BSplineR1toR2Interface>>;
    private _uncheckedChart: string;
    private _curveModel: CurveModelInterface;
    private curveModeler: CurveModeler;

    constructor(chartRenderingContext: Array<CanvasRenderingContext2D>, curveModeler: CurveModeler) {
        this.chartRenderingContext = chartRenderingContext;
        this.curveModeler = curveModeler;
        this._curveModel = curveModeler.curveCategory.curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this.checkRenderingContext();
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new QueueChartController(MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new QueueChartDescriptor(MAX_NB_CHARTS);
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

    set curveModel(curveModel: CurveModelInterface) {
        this._curveModel = curveModel;
    }

    set curveObserver(curveObservers: Array<IObserver<BSplineR1toR2Interface>>) {
        this._curveObservers = curveObservers;
    }

    set uncheckedChart(chartTitle: string) {
        this._uncheckedChart = chartTitle;
    }

    resetUncheckedChart(): void {
        this._uncheckedChart = "";
    }

    generateDefaultChartNames(): void {
        for(let i = 0; i < MAX_NB_CHARTS; i++) {
            this.defaultChartTitles.push('Graph' + (i + 1) + ' tbd');
        }
    }

    changeChartContentState(chartController: ChartController, chartContent: ChartContentState): void {
        for(let i = 0; i < MAX_NB_CHARTS; i++) {
            if(this.chartControllers[i] === chartController) this.chartContent[i] = chartContent;
        }
    }

    init(): void {
        for(let i = 0; i < MAX_NB_CHARTS; i++) {
            if(this.chartControllers.length === MAX_NB_CHARTS) {
                this.chartControllers[i].destroy();
            }
            this.chartControllers.push(new ChartController(this.defaultChartTitles[i], this.chartRenderingContext[i], CHART_HEIGHT, CHART_WIDTH));
            this._curveObservers.push(new NoFunctionSceneController(this.chartControllers[this.chartControllers.length - 1]));
            this.chartContent.push(new ChartWithNoFunction(this, this.chartControllers[i]));
            const queueItem = new ChartDescriptorQueueItem(this.chartControllers[this.chartControllers.length - 1], this.defaultChartTitles[i], this._curveObservers[this._curveObservers.length - 1]);
            this.freeChartsQueue.enqueue(queueItem.chartController);
            this.chartsDescriptorsQueue.enqueue(queueItem);
        }
    }

    restart(curveModel: CurveModelInterface): void {
        this._curveModel = curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this.checkRenderingContext();
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new QueueChartController(MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new QueueChartDescriptor(MAX_NB_CHARTS);
        this.defaultChartTitles = [];
        this.generateDefaultChartNames();
        this.init();
        this._curveObservers.forEach(element => {
            element.update(this._curveModel.spline);
            this._curveModel.registerObserver(element, "curve");
        });
    }

    switchChartState(chartTitle: string, indexCtrlr: number): void {
        const chartIndex = CHART_TITLES.indexOf(chartTitle);
        if(chartIndex !== -1) {
            switch(chartIndex) {
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
        } else {
            this.chartContent[indexCtrlr].setChartWithNoFunction();
        }
        const queueItem = new ChartDescriptorQueueItem(this.chartControllers[indexCtrlr], chartTitle, this._curveObservers[indexCtrlr]);
        if(CHART_TITLES.indexOf(chartTitle) === -1) {
            this.chartsDescriptorsQueue.enqueue(queueItem);
        } else {
            this.chartsDescriptorsQueue.insertAtController(this.chartControllers[indexCtrlr], queueItem);
        }
        
    }

    resetChartToDefaultChart(chartTitle: string, currentQueueItem: ChartDescriptorQueueItem): void {
        const index = this.chartsDescriptorsQueue.indexOfFromTitle(chartTitle);
        this.chartsDescriptorsQueue.extractAt(index);
        this.enqueueAndReorderFreeCharts(currentQueueItem.chartController);
        const chartOberserver = currentQueueItem.curveObserver;
        if(chartOberserver !== undefined) {
            this.removeCurveObserver(chartOberserver);
        } else {
            const error = new ErrorLog(this.constructor.name, "resetChartToDefaultChart", "Undefined chartObserver. Impossible to process graphs correctly.");
            error.logMessageToConsole();
        }
        const indexCtrlr = this.chartControllers.indexOf(currentQueueItem.chartController);
        chartTitle = this.defaultChartTitles[indexCtrlr];
        this._uncheckedChart = chartTitle;
        this.switchChartState(chartTitle, indexCtrlr);

    }

    addChartAtADefaultChartPlace(chartTitle: string): void {
        const chartController = this.freeChartsQueue.dequeue();
        if(chartController !== undefined) {
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const currentQueueItem  = this.chartsDescriptorsQueue.findItemFromChartController(chartController);
            if(currentQueueItem !== undefined) {
                const chartOberserver = currentQueueItem.curveObserver;
                this._uncheckedChart = currentQueueItem.chartTitle;
                if(chartOberserver !== undefined) {
                    this.removeCurveObserver(chartOberserver);
                } else {
                    const error = new ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined chartObserver. Impossible to process graphs correctly.");
                    error.logMessageToConsole();
                }
            }
            this.switchChartState(chartTitle, indexCtrlr);
        } else {
            const error = new ErrorLog(this.constructor.name, "addChartAtADefaultChartPlace", "Undefined ChartController. Impossible to process graphs correctly.");
            error.logMessageToConsole();
        }
    }

    addChartInPlaceOfTheOldestOne(chartTitle: string): void {
        const item = this.chartsDescriptorsQueue.get(0);
        if(item !== undefined) {
            this._uncheckedChart = item.chartTitle;
            const chartController = item.chartController;
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const chartOberserver = item.curveObserver;
            if(chartOberserver !== undefined) {
                this.removeCurveObserver(chartOberserver);
            } else {
                const error = new ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined chartObserver. Impossible to process graphs correctly.");
            error.logMessageToConsole();
            }
            this.switchChartState(chartTitle, indexCtrlr);
        } else {
            const error = new ErrorLog(this.constructor.name, "addChartInPlaceOfTheOldestOne", "Undefined ChartController. Queue content is inconsistent.");
            error.logMessageToConsole();
        }
    }

    addChart(chartTitle: string): void {
        const currentQueueItem = this.chartsDescriptorsQueue.findItemFromTitle(chartTitle);
        if(currentQueueItem !== undefined) {
            this.resetChartToDefaultChart(chartTitle, currentQueueItem);
        } else {
            if(this.freeChartsQueue.length() > 0) {
                this.addChartAtADefaultChartPlace(chartTitle);
            } else {
                this.addChartInPlaceOfTheOldestOne(chartTitle);
            }
        }
    }

    reorderFreeCharts(chartController: ChartController, indexCtrlr: number): void {
        let i = this.freeChartsQueue.length() - 2;
        let insert = false;
        while(i >= 0) {
            const chartCtrlr = this.freeChartsQueue.at(i);
            const index = this.chartControllers.indexOf(chartCtrlr);
            if(index < indexCtrlr) {
                this.freeChartsQueue.insertAt(i, chartController);
                insert = true;
            }
            i--;
        }
        if(!insert) this.freeChartsQueue.insertAt(0, chartController);
    }

    enqueueAndReorderFreeCharts(chartController: ChartController): void {
        const lastChartCtrlr = this.freeChartsQueue.getLast();
        if(lastChartCtrlr !== undefined) {
            const indexCtrlr = this.chartControllers.indexOf(chartController);
            const indexLast = this.chartControllers.indexOf(lastChartCtrlr);
            if(indexCtrlr > indexLast) {
                this.freeChartsQueue.enqueue(chartController);
            } else {
                if(this.freeChartsQueue.length() === 1) {
                    this.freeChartsQueue.insertAt(0, chartController);
                } else {
                    this.reorderFreeCharts(chartController, indexCtrlr);
                }
            }
        } else {
            this.freeChartsQueue.enqueue(chartController);
        }
    }

    checkRenderingContext(): void {
        if(this.chartRenderingContext.length !== MAX_NB_CHARTS) {
            const error = new ErrorLog(this.constructor.name, "checkRenderingContext", "Inconsistent number of rendering contexts. Must be equal to MAX_NB_GRAPHS.");
            error.logMessageToConsole();
        } else {
            for(let i = 0; i < MAX_NB_CHARTS; i++) {
                if(this.chartRenderingContext[i] === null) {
                    const error = new ErrorLog(this.constructor.name, "checkRenderingContext", "Rendering context of graph" + (i + 1) + " is null. Impossible to process graphs correctly.");
                    error.logMessageToConsole();
                }
            }
        }
    }

    addCurveObserver(curveObserver: IObserver<BSplineR1toR2Interface>) {
        if(this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.registerObserver(curveObserver, "curve");
        } else {
            const error = new ErrorLog(this.constructor.name, "addCurveObserver", "Unable to attach a curve observer to the current curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

    removeCurveObserver(curveObserver: IObserver<BSplineR1toR2Interface>) {
        if(this._curveModel !== undefined) {
            curveObserver.update(this._curveModel.spline);
            this._curveModel.removeObserver(curveObserver, "curve");
        } else {
            const error = new ErrorLog(this.constructor.name, "removeCurveObserver", "Unable to detach a curve observer to the current curve. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

    update(): void {
        this._curveModel = this.curveModeler.curveCategory.curveModel;
        this._uncheckedChart = "";
        this._curveObservers = [];
        this._chartControllers = [];
        this.chartContent = [];
        this.freeChartsQueue = new QueueChartController(MAX_NB_CHARTS);
        this.chartsDescriptorsQueue = new QueueChartDescriptor(MAX_NB_CHARTS);
        this.defaultChartTitles = [];
        this.generateDefaultChartNames();
        this.init();
        console.log("need to update chartSceneController")
    }

}