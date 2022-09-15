import { CurveCategory, OpenPlanarCurve } from "./CurveCategory";
import { CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { AbstractCurveShapeSpaceNavigator, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { IObservable, IObserver } from "../newDesignPatterns/Observer";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";

/* JCL 2020/09/23 Add controls to monitor the location of the curve with respect to its rigid body sliding behavior */
export enum ActiveLocationControl {firstControlPoint, lastControlPoint, both, none, stopDeforming};

export const NO_CONSTRAINT = -1;

export class ShapeNavigableCurve implements IObservable<CurveModelInterface> {
    private _curveCategory: CurveCategory;
    private _controlOfCurveClamping: boolean;
    private _curveConstraints : CurveConstraints;
    private _crvConstraintAtExtremitiesStgy: CurveConstraintProcessor;
    // private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _clampedPoints: number[] = [];
    private _clampedPointsPreviousState: number[] = [];
    private observers: IObserver<CurveModelInterface>[] = [];

    public activeLocationControl: ActiveLocationControl

    constructor() {
        this._controlOfCurveClamping = true;
        this._curveCategory = new OpenPlanarCurve(this);
        this._curveConstraints = new CurveConstraints(this);
        this._crvConstraintAtExtremitiesStgy = new CurveConstraintClampedFirstControlPoint(this._curveConstraints);
        this.activeLocationControl = ActiveLocationControl.firstControlPoint;
        this._clampedPoints.push(0);
        this._clampedPoints.push(NO_CONSTRAINT);
        this._clampedPointsPreviousState = this._clampedPoints;
        // JCL CurveShapeSpaceNavigator context uses parameters of CurveModeler context
        // JCL To ensure its correct initialization, it must be called last to ensure a consistent
        // JCL initialization of each context.
        // this._curveShapeSpaceNavigator = this._curveCategory.curveShapeSpaceNavigator;

    }

    changeCurveCategory(category: CurveCategory): void {
        this._curveCategory = category;
    }

    changeCurveConstraintStrategy(state: CurveConstraintProcessor): void {
        this._crvConstraintAtExtremitiesStgy = state;
    }

    // get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
    //     return this._curveShapeSpaceNavigator;
    // }

    get curveCategory(): CurveCategory {
        return this._curveCategory;
    }

    get crvConstraintAtExtremitiesStgy(): CurveConstraintProcessor {
        return this._crvConstraintAtExtremitiesStgy;
    }

    get controlOfCurveClamping(): boolean {
        return this._controlOfCurveClamping;
    }

    get clampedPoints(): number[] {
        return this._clampedPoints;
    }

    get clampedPointsPreviousState(): number[] {
        return this._clampedPointsPreviousState;
    }

    get curveConstraints(): CurveConstraints {
        return this._curveConstraints;
    }

    set clampedPoints(clampedPoints: number[]) {
        this._clampedPoints = clampedPoints;
    }

    set clampedPointsPreviousState(clampedPointsPreviousState: number[]) {
        this._clampedPointsPreviousState = clampedPointsPreviousState;
    }

    set controlOfCurveClamping(controlOfCurveClamping: boolean) {
        this._controlOfCurveClamping = controlOfCurveClamping;
    }

    inputSelectCurveCategory(crvCategoryID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectCurveCategoryProcess", crvCategoryID.toString());
        warning.logMessageToConsole();

        switch(crvCategoryID) {
            case 0: {
                this.curveCategory.setNavigableCurveWithOpenPlanarCurve();
                break;
            }
            case 1: {
                this.curveCategory.setNavigableCurveWithClosedPlanarCurve();
                break;
            }
            default: {
                let error = new ErrorLog(this.constructor.name, "inputSelectCurveCategoryProcess", "no available curve category.");
                error.logMessageToConsole();
                break;
            }
        }
    }

    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        this._controlOfCurveClamping = !this._controlOfCurveClamping
        console.log("control of curve clamping: " + this._controlOfCurveClamping)
        if(this._controlOfCurveClamping) {
            // this.clampedPoints = []
            // this.clampedPoints.push(0)
            this._clampedPoints = this._clampedPointsPreviousState;
            // this._crvConstraintAtExtremitiesStgy = new CurveConstraintClampedFirstControlPoint(this._curveConstraints);
            this.activeLocationControl = ActiveLocationControl.firstControlPoint
            // if(this.clampedControlPointView !== null) this.clampedControlPointView.update(clampedControlPoint)
        } else {
            this.activeLocationControl = ActiveLocationControl.none;
            // Store the previous constraint state for restoration. Other actions take place when updating objects through observers
            this._clampedPointsPreviousState = this._clampedPoints;
            // this._crvConstraintAtExtremitiesStgy = new CurveConstraintNoConstraint(this._curveConstraints);
        }
        this.notifyObservers();
    }

    registerObserver(observer: IObserver<CurveModelInterface>): void {
        this.observers.push(observer)
        console.log("ShapeNavigableCurve: registerObs: " + observer.constructor.name)
    }

    removeObserver(observer: IObserver<CurveModelInterface>): void {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    notifyObservers() {
        for (let observer of this.observers) {
            console.log("ShapeNavigableCurve: update: " + observer.constructor.name)
            observer.update(this._curveCategory.curveModel);
        }
    }
}
