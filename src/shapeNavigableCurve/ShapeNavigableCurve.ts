import { CurveCategory, OpenPlanarCurve } from "./CurveCategory";
import { CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { IObservable, IObserver } from "../newDesignPatterns/Observer";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStateAtCurveExtremity, EventStayInsideCurve } from "./EventStateAtCurveExtremity";
import { NavigationCurveModelInterface } from "../curveShapeSpaceNavigation/NavigationCurveModelInterface";
import { CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { CurveModel } from "../newModels/CurveModel";

/* JCL 2020/09/23 Add controls to monitor the location of the curve with respect to its rigid body sliding behavior */
export enum ActiveLocationControl {firstControlPoint, lastControlPoint, both, none, stopDeforming};

export const NO_CONSTRAINT = -1;
export const MAX_CLAMPED_POINTS = 2;

export class ShapeNavigableCurve implements IObservable<CurveModelInterface> {
    private _curveCategory: CurveCategory;
    private _controlOfCurveClamping: boolean;
    private _curveConstraints : CurveConstraints;
    private _crvConstraintAtExtremitiesStgy: CurveConstraintInterface;
    private _curveShapeSpaceNavigator?: CurveShapeSpaceNavigator;
    private _clampedPoints: number[] = [];
    private _clampedPointsPreviousState: number[] = [];
    private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;
    private observers: IObserver<CurveModelInterface>[] = [];

    public activeLocationControl: ActiveLocationControl

    constructor() {
        this._curveShapeSpaceNavigator = undefined;
        // Initializes controlOfCurveClamping in accordance with the navigation mode:
        //      mode 0: controlOfCurveClamping =  false,
        //      mode 1, mode 2: controlOfCurveClamping = true
        this._controlOfCurveClamping = false;
        this._curveCategory = new OpenPlanarCurve(this);
        this._curveCategory.curveModelChange = false;
        this._curveConstraints = new CurveConstraints(this);
        this._crvConstraintAtExtremitiesStgy = this._curveConstraints.curveConstraintStrategy;
        this.activeLocationControl = ActiveLocationControl.none;
        // No clamped point set to be consistent with the navigation mode at initialization
        this._clampedPoints.push(NO_CONSTRAINT);
        this._clampedPoints.push(NO_CONSTRAINT);
        this._clampedPointsPreviousState = this._clampedPoints;
        this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities(this);
        this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventState;
        // JCL CurveShapeSpaceNavigator context uses parameters of CurveModeler context
        // JCL To ensure its correct initialization, it must be called last to ensure a consistent
        // JCL initialization of each context.

    }

    changeCurveCategory(category: CurveCategory): void {
        this._curveCategory = category;
    }

    changeCurveConstraintStrategy(state: CurveConstraintInterface): void {
        this._crvConstraintAtExtremitiesStgy = state;
    }

    changeMngmtOfEventAtExtremity(eventState: EventStateAtCurveExtremity): void {
        this._eventStateAtCrvExtremities = eventState;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    get curveCategory(): CurveCategory {
        return this._curveCategory;
    }

    get crvConstraintAtExtremitiesStgy(): CurveConstraintInterface {
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

    get eventMgmtAtExtremities(): EventMgmtAtCurveExtremities {
        return this._eventMgmtAtExtremities;
    }

    get eventStateAtCrvExtremities(): EventStateAtCurveExtremity {
        return this._eventStateAtCrvExtremities;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
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

    set eventMgmtAtExtremities(eventMgmtAtExtremities: EventMgmtAtCurveExtremities) {
        this._eventMgmtAtExtremities = eventMgmtAtExtremities;
    }

    set eventStateAtCrvExtremities(eventStateAtCrvExtremities: EventStateAtCurveExtremity) {
        this._eventStateAtCrvExtremities = eventStateAtCrvExtremities;
    }

    inputSelectCurveCategory(crvCategoryID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectCurveCategoryProcess", crvCategoryID.toString());
        warning.logMessageToConsole();

        switch(crvCategoryID) {
            case 0: {
                this._curveCategory.setNavigableCurveWithOpenPlanarCurve();
                break;
            }
            case 1: {
                this._curveCategory.setNavigableCurveWithClosedPlanarCurve();
                break;
            }
            default: {
                let error = new ErrorLog(this.constructor.name, "inputSelectCurveCategoryProcess", "no available curve category.");
                error.logMessageToConsole();
                break;
            }
        }
        this._curveCategory.curveModelChange = false;
    }

    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        if( this._curveShapeSpaceNavigator == undefined
            || this._curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this._curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            const error = new ErrorLog(this.constructor.name, "toggleCurveClamping", "Cannot handle clamping because no curve shape space navigator is available.");
            error.logMessageToConsole();
        } else {
            this._controlOfCurveClamping = !this._controlOfCurveClamping
            console.log("control of curve clamping: " + this._controlOfCurveClamping)
            if(this._controlOfCurveClamping) {
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
    }

    registerObserver(observer: IObserver<CurveModelInterface>): void {
        this.observers.push(observer);
        console.log("ShapeNavigableCurve: registerObs: " + observer.constructor.name);
    }

    removeObserver(observer: IObserver<CurveModelInterface>): void {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    notifyObservers() {
        for (let observer of this.observers) {
            console.log("ShapeNavigableCurve: update: " + observer.constructor.name);
            observer.update(this._curveCategory.curveModel);
        }
    }

    updateClampedPointsAfterKnotInsertion(knotParametricLocation: number): void {
        const knots = this._curveCategory.curveModel.spline.getDistinctKnots();
        let i = 0;
        while(i < knots.length && knots[i] < knotParametricLocation) {
            i++;
        }
        const knotIndex = i;
        if(this._clampedPoints[0] === NO_CONSTRAINT && this._clampedPoints[1] === NO_CONSTRAINT) {
            const warning = new WarningLog(this.constructor.name, "updateClampedPointsAfterKnotInsertion", "No need to update clamped point indices.");
            warning.logMessageToConsole();
        } else if((this._clampedPoints[0] === NO_CONSTRAINT && this._clampedPoints[1] !== NO_CONSTRAINT)
                || (this._clampedPoints[0] !== NO_CONSTRAINT && this._clampedPoints[1] === NO_CONSTRAINT)) {
            if(this._clampedPoints[0] === NO_CONSTRAINT && this._clampedPoints[1] >= knotIndex) this._clampedPoints[1] += 1;
            if(this._clampedPoints[1] === NO_CONSTRAINT && this._clampedPoints[0] >= knotIndex) this._clampedPoints[0] += 1;
        } else {
            if(this._clampedPoints[0] >= knotIndex) this._clampedPoints[0] += 1;
            if(this._clampedPoints[1] >= knotIndex) this._clampedPoints[1] += 1;
        }
    }
}
