import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
import { ChartController } from "../chartcontrollers/ChartController";
import { IObserver } from "../designPatterns/Observer";

export class ChartDescriptorQueueItem {

    private _chartController: ChartController;
    private _charTitle: string;
    private _curveObserver: IObserver<BSpline_R1_to_R2_interface>|undefined;

    constructor(chartController: ChartController, chartName: string, curveObserver?: IObserver<BSpline_R1_to_R2_interface>) {
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

    get curveObserver():IObserver<BSpline_R1_to_R2_interface>|undefined {
        return this._curveObserver;
    }

    set chartController(chartController: ChartController) {
        this._chartController = chartController;
    }

    set chartTitle(chartTitle: string) {
        this._charTitle = chartTitle;
    }

    set curveObserver(curveObserver: IObserver<BSpline_R1_to_R2_interface>|undefined) {
        this._curveObserver = curveObserver;
    }
}