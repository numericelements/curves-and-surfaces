"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartDescriptorQueueItem = void 0;
class ChartDescriptorQueueItem {
    constructor(chartController, chartName, curveObserver) {
        this._chartController = chartController;
        this._charTitle = chartName;
        if (curveObserver !== undefined)
            this._curveObserver = curveObserver;
        else
            this._curveObserver = undefined;
    }
    get chartController() {
        return this._chartController;
    }
    get chartTitle() {
        return this._charTitle;
    }
    get curveObserver() {
        return this._curveObserver;
    }
    set chartController(chartController) {
        this._chartController = chartController;
    }
    set chartTitle(chartTitle) {
        this._charTitle = chartTitle;
    }
    set curveObserver(curveObserver) {
        this._curveObserver = curveObserver;
    }
}
exports.ChartDescriptorQueueItem = ChartDescriptorQueueItem;
