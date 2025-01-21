"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartDescriptorQueueItem = void 0;
var ChartDescriptorQueueItem = /** @class */ (function () {
    function ChartDescriptorQueueItem(chartController, chartName, curveObserver) {
        this._chartController = chartController;
        this._charTitle = chartName;
        if (curveObserver !== undefined)
            this._curveObserver = curveObserver;
        else
            this._curveObserver = undefined;
    }
    Object.defineProperty(ChartDescriptorQueueItem.prototype, "chartController", {
        get: function () {
            return this._chartController;
        },
        set: function (chartController) {
            this._chartController = chartController;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartDescriptorQueueItem.prototype, "chartTitle", {
        get: function () {
            return this._charTitle;
        },
        set: function (chartTitle) {
            this._charTitle = chartTitle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartDescriptorQueueItem.prototype, "curveObserver", {
        get: function () {
            return this._curveObserver;
        },
        set: function (curveObserver) {
            this._curveObserver = curveObserver;
        },
        enumerable: false,
        configurable: true
    });
    return ChartDescriptorQueueItem;
}());
exports.ChartDescriptorQueueItem = ChartDescriptorQueueItem;
