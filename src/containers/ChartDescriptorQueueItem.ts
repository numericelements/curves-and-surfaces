import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ChartController } from "../chartcontrollers/ChartController";
import { IObserver } from "../newDesignPatterns/Observer";

export class ChartDescriptorQueueItem {

    private _chartController: ChartController;
    private _charTitle: string;
    private _curveObserver: IObserver<BSplineR1toR2Interface>|undefined;

    constructor(chartController: ChartController, chartName: string, curveObserver?: IObserver<BSplineR1toR2Interface>) {
        this._chartController = chartController;
        this._charTitle = chartName;
        if(curveObserver !== undefined) this._curveObserver = curveObserver
        else this._curveObserver = undefined;
    }

    get chartController() {
        return this._chartController;
    }

    get chartTitle() {
        return this._charTitle;
    }

    get curveObserver():IObserver<BSplineR1toR2Interface>|undefined {
        return this._curveObserver;
    }

    set chartController(chartController: ChartController) {
        this._chartController = chartController;
    }

    set chartTitle(chartTitle: string) {
        this._charTitle = chartTitle;
    }

    set curveObserver(curveObserver: IObserver<BSplineR1toR2Interface>|undefined) {
        this._curveObserver = curveObserver;
    }
}