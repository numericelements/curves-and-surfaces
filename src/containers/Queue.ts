import { ChartController } from "../chartcontrollers/ChartController";
import { CHART_TITLES } from "../chartcontrollers/ChartSceneController";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { ChartDescriptorQueueItem } from "./ChartDescriptorQueueItem";

abstract class Queue<T> {
    protected items: T[];
    protected size: number;

    constructor(size: number) {
        this.size = size;
        this.items = [];
    }

    enqueue(newItem: T): T|undefined {
        if(this.items.length < this.size)
        {
            this.items.push(newItem);
            return undefined;
        }
        else {
            const removedItem = this.items.shift();
            this.items.push(newItem);
            return removedItem;
        }
    }

    dequeue(): T|undefined {
        if(this.items.length === 0) {
            return undefined;
        } else {
            return this.items.shift();
        }
    }

    length(): number {
        return this.items.length;
    }

    getLast(): T|undefined {
        if(this.items.length === 0) {
            return undefined;
        } else {
            return this.items[this.items.length - 1];
        }
    }

    at(index: number): T {
        return this.items[index];
    }

    insertAt(index: number, item: T): void {
        this.items.splice(index, 0, item);
    }

}

export class QueueChartController extends Queue<ChartController> {

}

export class QueueChartDescriptor extends Queue<ChartDescriptorQueueItem> {

    extract(item: ChartDescriptorQueueItem): void {
        const index = this.items.indexOf(item);
        if( index !== -1) {
            this.items.splice(index, 1);
        } else {
            const error = new ErrorLog(this.constructor.name, " extract ", "the item does not exists in the queue.")
            error.logMessageToConsole();
        }
    }

    extractAt(index: number): void {
        if( index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        } else {
            const error = new ErrorLog(this.constructor.name, " extractAt ", "the index is out of range.")
            error.logMessageToConsole();
        }
    }

    get(index: number): ChartDescriptorQueueItem {
        if(index < 0 && index > this.size) {
            const error = new ErrorLog(this.constructor.name, "get", " index out of range.");
            error.logMessageToConsole();
        }
        const title = this.items[index].chartTitle;
        const chartCtrl = this.items[index].chartController;
        const crvObsr = this.items[index].curveObserver;
        return new ChartDescriptorQueueItem(chartCtrl, title, crvObsr);
    }

    insertAtController(chartController: ChartController, itemToInsert: ChartDescriptorQueueItem): void {
        let location = -1
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].chartController === chartController) {
                location = i;
            }
        }
        if(location !== -1) {
            this.extractAt(location);
            let existChart: Array<ChartDescriptorQueueItem> = [];
            let noChart: Array<ChartDescriptorQueueItem> = [];
            for(let item of this.items) {
                if(CHART_TITLES.indexOf(item.chartTitle) !== -1) {
                    existChart.push(item)
                } else {
                    noChart.push(item)
                }
            }
            let newItems: Array<ChartDescriptorQueueItem> = [];
            existChart.forEach(element => {newItems.push(element)});
            newItems.push(itemToInsert);
            noChart.forEach(element => {newItems.push(element)});
            this.items = newItems;
        } else {
            const error = new ErrorLog(this.constructor.name, "insertAtController", " inconsistent location of the queue item to be removed.")
            error.logMessageToConsole();
        }
    }

    findItemFromTitle(title: string): ChartDescriptorQueueItem|undefined {
        for(let item of this.items) {
            if(item.chartTitle === title) {
                return new ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
            }
        }
        return undefined;
    }

    findItemFromChartController(chartController: ChartController): ChartDescriptorQueueItem|undefined {
        for(let item of this.items) {
            if(item.chartController === chartController) {
                return new ChartDescriptorQueueItem(item.chartController, item.chartTitle, item.curveObserver);
            }
        }
        return undefined;
    }

    indexOfFromTitle(title: string): number {
        for(let item = 0; item < this.items.length; item++) {
            if(this.items[item].chartTitle === title) {
                return item;
            }
        }
        return -1;
    }
}