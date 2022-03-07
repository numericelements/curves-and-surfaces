import { IObserver } from "../designPatterns/Observer";
import { ChartEventListener, CurveModelerEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { CurveModel } from "./CurveModel";

abstract class CurveModelObserver implements IObserver<CurveModel> {

    abstract update(message: CurveModel): void;

    abstract reset(message: CurveModel): void;

}
export class CurveModelObserverInChartEventListener extends CurveModelObserver {

    private listener: ChartEventListener;

    constructor(listener: ChartEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModel): void {
        if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
        {
            this.listener.curveModel = message;
            this.listener.resetChartContext();
        }
    }

    reset(message: CurveModel): void {
        const curveModel = new CurveModel();
        if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
        {
            this.listener.curveModel = curveModel;
        }
    }
}

export class CurveModelObserverInCurveModelEventListener extends CurveModelObserver {

    private listener: CurveModelerEventListener;

    constructor(listener: CurveModelerEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModel): void {
        if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
        {
            this.listener.curveModel = message;
            this.listener.curveModeler.curveShapeSpaceNavigator.curveModel = message;
            this.listener.curveModeler.curveShapeSpaceNavigator.currentCurve = message.spline;
            const degree = message.spline.degree;
            this.listener.updateCurveDegreeSelector(degree);
        }
    }

    reset(message: CurveModel): void {
        const curveModel = new CurveModel();
        if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
        {
            this.listener.curveModel = curveModel;
            this.listener.curveModeler.curveShapeSpaceNavigator.curveModel = curveModel;
        }
    }

}

export class CurveModelObserverInShapeSpaceNavigationEventListener extends CurveModelObserver {

    private listener: ShapeSpaceNavigationEventListener;

    constructor(listener: ShapeSpaceNavigationEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModel): void {
        const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.hasOwnProperty('curveModel') || curveShapeSpaceNavigator.hasOwnProperty('_curveModel'))
        {
            this.listener.curveShapeSpaceNavigator.curveModel = message;
            this.listener.curveShapeSpaceNavigator.currentCurve = message.spline;
            this.listener.resetCurveShapeControlButtons();
        }
    }

    reset(message: CurveModel): void {
        const curveModel = new CurveModel();
        if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
        {
            this.listener.curveShapeSpaceNavigator.curveModel = curveModel;
        }
    }
}