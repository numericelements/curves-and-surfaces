"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueChartDescriptor = exports.QueueChartController = void 0;
const ChartSceneController_1 = require("../chartcontrollers/ChartSceneController");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ChartDescriptorQueueItem_1 = require("./ChartDescriptorQueueItem");
class Queue {
    constructor(size) {
        this.size = size;
        this.items = [];
    }
    enqueue(newItem) {
        if (this.items.length < this.size) {
            this.items.push(newItem);
            return undefined;
        }
        else {
            const removedItem = this.items.shift();
            this.items.push(newItem);
            return removedItem;
        }
    }
    dequeue() {
        if (this.items.length === 0) {
            return undefined;
        }
        else {
            return this.items.shift();
        }
    }
    length() {
        return this.items.length;
    }
    getLast() {
        if (this.items.length === 0) {
            return undefined;
        }
        else {
            return this.items[this.items.length - 1];
        }
    }
    at(index) {
        return this.items[index];
    }
    insertAt(index, item) {
        this.items.splice(index, 0, item);
    }
}
class QueueChartController extends Queue {
}
exports.QueueChartController = QueueChartController;
class QueueChartDescriptor extends Queue {
    extract(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, " extract ", "the item does not exists in the queue.");
            error.logMessage();
        }
    }
    extractAt(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, " extractAt ", "the index is out of range.");
            error.logMessage();
        }
    }
    get(index) {
        if (index < 0 && index > this.size) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "get", " index out of range.");
            error.logMessage();
        }
        const title = this.items[index].chartTitle;
        const chartCtrl = this.items[index].chartController;
        const crvObsr = this.items[index].curveObserver;
        return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(chartCtrl, title, crvObsr);
    }
    insertAtController(chartController, itemToInsert) {
        let location = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].chartController === chartController) {
                location = i;
            }
        }
        if (location !== -1) {
            this.extractAt(location);
            let existChart = [];
            let noChart = [];
            for (let item of this.items) {
                if (ChartSceneController_1.CHART_TITLES.indexOf(item.chartTitle) !== -1) {
                    existChart.push(item);
                }
                else {
                    noChart.push(item);
                }
            }
            let newItems = [];
            existChart.forEach(element => { newItems.push(element); });
            newItems.push(itemToInsert);
            noChart.forEach(element => { newItems.push(element); });
            this.items = newItems;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertAtController", " inconsistent location of the queue item to be removed.");
            error.logMessage();
        }
    }
    findItemFromTitle(title) {
        for (let item of this.items) {
            if (item.chartTitle === title) {
                return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
            }
        }
        return undefined;
    }
    findItemFromChartController(chartController) {
        for (let item of this.items) {
            if (item.chartController === chartController) {
                return new ChartDescriptorQueueItem_1.ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
            }
        }
        return undefined;
    }
    indexOfFromTitle(title) {
        for (let item = 0; item < this.items.length; item++) {
            if (this.items[item].chartTitle === title) {
                return item;
            }
        }
        return -1;
    }
}
exports.QueueChartDescriptor = QueueChartDescriptor;
