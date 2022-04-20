import { IObserver } from "../newDesignPatterns/Observer";
import { ChartEventListener, CurveModelerEventListener, FileEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";

abstract class CurveModelObserver implements IObserver<CurveModel> {

    abstract update(message: CurveModelInterface): void;

    abstract reset(message: CurveModelInterface): void;

}
export class CurveModelObserverInChartEventListener extends CurveModelObserver {

    private listener: ChartEventListener;

    constructor(listener: ChartEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = message;
                this.listener.resetChartContext();
            }
        } else if(message instanceof ClosedCurveModel) {
            if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                console.log("something to do there with ClosedCurveModel");
                this.listener.curveModel = message;
                this.listener.resetChartContext();
            }
        }

    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = curveModel;
            }
        } else if(message instanceof ClosedCurveModel) {
            const curveModel = new ClosedCurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                console.log("something to do there with ClosedCurveModel in ChartEventListener")
                // this.listener.curveModel = curveModel;
            }
        }
    }
}

export class CurveModelObserverInCurveModelEventListener extends CurveModelObserver {

    private listener: CurveModelerEventListener;

    constructor(listener: CurveModelerEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = message;
                this.listener.curveModeler.curveShapeSpaceNavigator.curveModel = message;
                this.listener.curveModeler.curveShapeSpaceNavigator.currentCurve = message.spline;
                this.listener.curveModeler.clampedControlPoints[0] = 0;
                const degree = message.spline.degree;
                this.listener.updateCurveDegreeSelector(degree);
                this.listener.resetCurveConstraintControlButton();
            }
        } else if(message instanceof ClosedCurveModel) {
            this.listener.curveModel = message;
            this.listener.curveModeler.curveShapeSpaceNavigator.curveModel = message;
            this.listener.curveModeler.curveShapeSpaceNavigator.currentCurve = message.spline;
            this.listener.curveModeler.clampedControlPoints[0] = 0;
            const degree = message.spline.degree;
            this.listener.updateCurveDegreeSelector(degree);
            this.listener.resetCurveConstraintControlButton();
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener")
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = curveModel;
                this.listener.curveModeler.curveShapeSpaceNavigator.curveModel = curveModel;
            }
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener")
        }
    }

}

export class CurveModelObserverInShapeSpaceNavigationEventListener extends CurveModelObserver {

    private listener: ShapeSpaceNavigationEventListener;

    constructor(listener: ShapeSpaceNavigationEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if(curveShapeSpaceNavigator.hasOwnProperty('curveModel') || curveShapeSpaceNavigator.hasOwnProperty('_curveModel'))
            {
                this.listener.curveShapeSpaceNavigator.curveModel = message;
                this.listener.curveShapeSpaceNavigator.currentCurve = message.spline;
                this.listener.resetCurveShapeControlButtons();
            }
        } else if(message instanceof ClosedCurveModel) {
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if(curveShapeSpaceNavigator.hasOwnProperty('curveModel') || curveShapeSpaceNavigator.hasOwnProperty('_curveModel'))
            {
                this.listener.curveShapeSpaceNavigator.curveModel = message;
                this.listener.curveShapeSpaceNavigator.currentCurve = message.spline;
                this.listener.resetCurveShapeControlButtons();
            }
            console.log("something to do there with ClosedCurveModel in ShapeSpaceNavigationEventListener")
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveShapeSpaceNavigator.curveModel = curveModel;
            }
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in ShapeSpaceNavigationEventListener")
        }
    }
}

export class CurveModelObserverInFileEventListener extends CurveModelObserver {

    private listener: FileEventListener;

    constructor(listener: FileEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            this.listener.curveModel = this.listener.curveModeler.curveCategory.curveModel;
            console.log("something to do there with CurveModel in FileEventListener")
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in FileEventListener")
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            console.log("something to do there with CurveModel in FileEventListener")
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in FileEventListener")
        }
    }
}