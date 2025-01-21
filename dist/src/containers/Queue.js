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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueChartDescriptor = exports.QueueChartController = void 0;
var ChartSceneController_1 = require("../chartcontrollers/ChartSceneController");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ChartDescriptorQueueItem_1 = require("./ChartDescriptorQueueItem");
var Queue = /** @class */ (function () {
    function Queue(size) {
        this.size = size;
        this.items = [];
    }
    Queue.prototype.enqueue = function (newItem) {
        if (this.items.length < this.size) {
            this.items.push(newItem);
            return undefined;
        }
        else {
            var removedItem = this.items.shift();
            this.items.push(newItem);
            return removedItem;
        }
    };
    Queue.prototype.dequeue = function () {
        if (this.items.length === 0) {
            return undefined;
        }
        else {
            return this.items.shift();
        }
    };
    Queue.prototype.length = function () {
        return this.items.length;
    };
    Queue.prototype.getLast = function () {
        if (this.items.length === 0) {
            return undefined;
        }
        else {
            return this.items[this.items.length - 1];
        }
    };
    Queue.prototype.at = function (index) {
        return this.items[index];
    };
    Queue.prototype.insertAt = function (index, item) {
        this.items.splice(index, 0, item);
    };
    return Queue;
}());
var QueueChartController = /** @class */ (function (_super) {
    __extends(QueueChartController, _super);
    function QueueChartController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueChartController;
}(Queue));
exports.QueueChartController = QueueChartController;
var QueueChartDescriptor = /** @class */ (function (_super) {
    __extends(QueueChartDescriptor, _super);
    function QueueChartDescriptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QueueChartDescriptor.prototype.extract = function (item) {
        var index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, " extract ", "the item does not exists in the queue.");
            error.logMessage();
        }
    };
    QueueChartDescriptor.prototype.extractAt = function (index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, " extractAt ", "the index is out of range.");
            error.logMessage();
        }
    };
    QueueChartDescriptor.prototype.get = function (index) {
        if (index < 0 && index > this.size) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "get", " index out of range.");
            error.logMessage();
        }
        var title = this.items[index].chartTitle;
        var chartCtrl = this.items[index].chartController;
        var crvObsr = this.items[index].curveObserver;
        return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(chartCtrl, title, crvObsr);
    };
    QueueChartDescriptor.prototype.insertAtController = function (chartController, itemToInsert) {
        var e_1, _a;
        var location = -1;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].chartController === chartController) {
                location = i;
            }
        }
        if (location !== -1) {
            this.extractAt(location);
            var existChart = [];
            var noChart = [];
            try {
                for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (ChartSceneController_1.CHART_TITLES.indexOf(item.chartTitle) !== -1) {
                        existChart.push(item);
                    }
                    else {
                        noChart.push(item);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var newItems_1 = [];
            existChart.forEach(function (element) { newItems_1.push(element); });
            newItems_1.push(itemToInsert);
            noChart.forEach(function (element) { newItems_1.push(element); });
            this.items = newItems_1;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertAtController", " inconsistent location of the queue item to be removed.");
            error.logMessage();
        }
    };
    QueueChartDescriptor.prototype.findItemFromTitle = function (title) {
        var e_2, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.chartTitle === title) {
                    return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return undefined;
    };
    QueueChartDescriptor.prototype.findItemFromChartController = function (chartController) {
        var e_3, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.chartController === chartController) {
                    return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return undefined;
    };
    QueueChartDescriptor.prototype.indexOfFromTitle = function (title) {
        for (var item = 0; item < this.items.length; item++) {
            if (this.items[item].chartTitle === title) {
                return item;
            }
        }
        return -1;
    };
    return QueueChartDescriptor;
}(Queue));
exports.QueueChartDescriptor = QueueChartDescriptor;
