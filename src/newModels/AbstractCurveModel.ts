import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface"
// import { OptimizationProblemBSplineR1toR2Interface } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2Interface"
import { IObserver } from "../newDesignPatterns/Observer"
import { Vector2d } from "../mathVector/Vector2d"
import { CurveModelInterface, KindOfObservers } from "./CurveModelInterface"
import { CurveAnalyzerEventsNotSlidingOnTheLeftOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"

export const DEFAULT_CURVE_DEGREE = 3;

export abstract class AbstractCurveModel implements CurveModelInterface {

    protected abstract _spline : BSplineR1toR2Interface;
    protected _observers: IObserver<BSplineR1toR2Interface>[] = [];
    protected observersCP: IObserver<BSplineR1toR2Interface>[] = [];
    // protected activeControl: ActiveControl = ActiveControl.both;
    protected activeOptimizer: boolean = true;
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2Interface | null = null;
    // protected optimizer: Optimizer | null = null;


    abstract spline : BSplineR1toR2Interface;
    abstract isClosed : boolean;

    abstract setSpline(spline: BSplineR1toR2Interface): void ;
    abstract addControlPoint(controlPointIndex: number | null): void;
    abstract setActiveControl(): void;

    get observers() {
        return this._observers;
    }    

    registerObserver(observer: IObserver<BSplineR1toR2Interface>, kind: KindOfObservers): void {
        switch(kind) {
            case 'curve':
                this.observers.push(observer);
                // console.log("CurveModel: registerObs as curve: " + observer.constructor.name)
                break;
            case 'control points':
                this.observersCP.push(observer);
                // console.log("CurveModel: registerObs as CP: " + observer.constructor.name)
                break;
            default:
                throw Error("unknown kind");
        }
        
    }

    checkObservers(): void {
        var i = 0;
        for (let observer of this.observers){
            const indexObs = this.observers.indexOf(observer);
            if(indexObs === -1) {
                const error = new ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observer in the list of observers.");
                error.logMessageToConsole();
            }
            i++;
        }
        i = 0;
        for (let observer of this.observersCP){
            const indexObsCP = this.observersCP.indexOf(observer);
            if(indexObsCP === -1) {
                const error = new ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observerCP in the list of observersCP.");
                error.logMessageToConsole();
            }
            i++;
        }
    }

    removeObserver(observer: IObserver<BSplineR1toR2Interface>, kind: KindOfObservers): void {
        switch(kind) {
            case 'curve':
                const indexObs = this.observers.indexOf(observer);
                if(indexObs === -1) {
                    const error = new ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer "+observer+" in the list of observers.");
                    error.logMessageToConsole();
                }
                this.observers.splice(this.observers.indexOf(observer), 1);
                break;
            case 'control points':
                const indexObsCP = this.observersCP.indexOf(observer);
                if(indexObsCP === -1) {
                    const error = new ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer "+observer+" in the list of observers.");
                    error.logMessageToConsole();
                }
                this.observersCP.splice(this.observersCP.indexOf(observer), 1);
                break;
        }
    }

    notifyObservers(): void {
        for (let observer of this.observers){
            // console.log("CurveModel: update as curve: " + observer.constructor.name)
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP){
            // console.log("CurveModel: update as CP: " + observer.constructor.name)
            observer.update(this._spline.clone());
        }

        this.checkObservers();
    }

    setControlPointPosition(controlPointIndex: number, x: number, y: number): void {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d(x, y));
        this.notifyObservers();
        // if (this.activeOptimizer) {
        //     this.optimize(controlPointIndex, x, y);
        // }
    }

    // optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void {
    //     if (this.optimizationProblem && this.optimizer) {
    //         //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
    //         const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
    //         const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2));
    //         //console.log(ndcX - p.x)
    //         const numberOfStep = 3 * Math.ceil(distance * 10);
    //         //const numberOfStep = 1
    //         for (let i = 1; i <= numberOfStep; i += 1) {
    //             let alpha = Math.pow(i / numberOfStep, 3);
    //             this._spline.setControlPointPosition(selectedControlPoint, new Vector2d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY));
    //             this.optimizationProblem.setTargetSpline(this._spline);
    //             try {
    //                 this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
    //                 if (this.optimizer.success === true) {
    //                     this.setSpline(this.optimizationProblem.spline.clone());
    //                 }
    //             }
    //             catch(e) {
    //                 this._spline.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y));
    //                 console.log(e);
    //             }
    //         }
    //     }
    // }
}