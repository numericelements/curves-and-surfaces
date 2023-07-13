import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDescriptor";
import { EventMgmtState, ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { NavigationState } from "./NavigationState";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { CurveControlState, HandleCurvatureExtremaNoSlidingState, HandleCurvatureExtremaSlidingState, HandleInflectionsAndCurvatureExtremaNoSlidingState, HandleInflectionsAndCurvatureExtremaSlidingState, HandleInflectionsNoSlidingState, HandleInflectionsSlidingState, HandleNoDiffEventNoSlidingState } from "../controllers/CurveControlState";
import { NavigationCurveModelInterface } from "./NavigationCurveModelInterface";
import { NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "./NavigationCurveModel";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { EventStateAtCurveExtremity } from "../shapeNavigableCurve/EventStateAtCurveExtremity";
import { ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

/* JCL 2023/03/25 used only in curve control strategies SlidingStrategy, NoSlidingStrategy, ... */
export enum ActiveExtremaLocationControl {mergeExtrema, none, stopDeforming, extremumLeaving, extremumEntering}
export enum ActiveInflectionLocationControl {mergeExtremaAndInflection, none, stopDeforming}

export class CurveShapeSpaceNavigator {

    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    private _controlOfEventsAtExtremity: boolean;
    private _navigationCurveModel: NavigationCurveModel;
    private _navigationState: NavigationState;
    private readonly _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;
    private readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    private _curveControlState: CurveControlState;

    //JCL temporary addition for compatibility with prior version
    public curveSceneController?: CurveSceneController;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        // Initializes controlOfEventsAtExtremity in accordance with the navigation mode:
        //      mode 0, mode 1, mode 2: controlOfCurveClamping =  false,
        this._controlOfEventsAtExtremity = false;

        this._shapeNavigableCurve = shapeNavigableCurve;
        this._shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure(this._shapeNavigableCurve, this);
        this._navigationCurveModel = new OpenCurveShapeSpaceNavigator(this);
        this._navigationState = this._navigationCurveModel.navigationState;
        this._navigationState.navigationStateChange = false;
        this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities(this);
        this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventStateAtCrvExtremities;
        this._curveControlState = new HandleNoDiffEventNoSlidingState(this);
        this._navigationCurveModel.curveControlState = this._curveControlState;
        this._curveControlState.curveControlParamChange = false;

        this.curveSceneController = undefined;
    }

    get navigationCurveModel(): NavigationCurveModel {
        return this._navigationCurveModel;
    }

    get navigationState(): NavigationState {
        return this._navigationState;
    }

    get controlOfEventsAtExtremity(): boolean {
        return this._controlOfEventsAtExtremity;
    }

    get eventMgmtAtExtremities(): EventMgmtAtCurveExtremities {
        return this._eventMgmtAtExtremities;
    }

    get eventStateAtCrvExtremities(): EventStateAtCurveExtremity {
        return this._eventStateAtCrvExtremities;
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure {
        return this._shapeSpaceDiffEventsStructure;
    }

    get curveControlState(): CurveControlState {
        return this._curveControlState;
    }

    set controlOfEventsAtExtremity(controlOfEventsAtExtremity: boolean) {
        this._controlOfEventsAtExtremity = controlOfEventsAtExtremity;
    }

    set eventStateAtCrvExtremities(eventStateAtCrvExtremities: EventStateAtCurveExtremity) {
        this._eventStateAtCrvExtremities = eventStateAtCrvExtremities;
    }

    set navigationCurveModel(navigationCurveModel: NavigationCurveModel) {
        this._navigationCurveModel = navigationCurveModel;
    }

    set navigationState(navigationState: NavigationState)  {
        this._navigationState = navigationState;
    }

    set curveControlState(curveControlState: CurveControlState) {
        this._curveControlState = curveControlState;
    }

    getActiveControlInflections(): boolean {
        return this._shapeSpaceDiffEventsStructure.activeControlInflections;
    }

    getActiveControlCurvatureExtrema(): boolean {
        return this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
    }

    getSlidingDifferentialEvents(): boolean {
        return this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
    }

    getManagementDiffEventsAtExtremities(): EventMgmtState {
        return this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities;
    }

    setActiveControlInflections(activeControlInflections: boolean): void {
        this._shapeSpaceDiffEventsStructure.activeControlInflections = activeControlInflections;
    }

    setActiveControlCurvatureExtrema(activeControlCurvatureExtrema: boolean): void {
        this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = activeControlCurvatureExtrema;
    }

    setSlidingDifferentialEvents(slidingDifferentialEvents: boolean): void {
        this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents = slidingDifferentialEvents;
    }

    setManagementDiffEventsAtExtremities(eventManagementStateAtExtremity: EventMgmtState) {
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = eventManagementStateAtExtremity;
    }

    transitionTo(curveControlState: CurveControlState): void {
        this._curveControlState = curveControlState;
    }

    toggleSliding() {
        this._curveControlState.handleSliding();
    }

    toggleControlOfCurvatureExtrema() {
        this._curveControlState.handleCurvatureExtrema();
    }

    toggleControlOfInflections() {
        this._curveControlState.handleInflections();
    }

    toggleEventMgmtAtCurveExt() {
        // this._curveControl.toggleEventMgmtAtCurveExt();
        this._controlOfEventsAtExtremity = !this._controlOfEventsAtExtremity;
        console.log("control of event at extremity: " + this._controlOfEventsAtExtremity)
        this._eventMgmtAtExtremities.processEventAtCurveExtremity();
    }

    restoreCurveControlState(shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener) {
        if(shapeSpaceNavigationEventListener.previousControlOfCurvatureExtrema) {
            if(shapeSpaceNavigationEventListener.previousControlOfInflection) {
                if(shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new HandleInflectionsAndCurvatureExtremaSlidingState(this);
                } else {
                    this.curveControlState = new HandleInflectionsAndCurvatureExtremaNoSlidingState(this);
                }
            } else {
                if(shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new HandleCurvatureExtremaSlidingState(this);
                } else {
                    this.curveControlState =  new HandleCurvatureExtremaNoSlidingState(this);
                }
            }
        } else {
            if(shapeSpaceNavigationEventListener.previousControlOfInflection) {
                if(shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new HandleInflectionsSlidingState(this);
                } else {
                    this.curveControlState = new HandleInflectionsNoSlidingState(this);
                }
            } else {
                this.curveControlState = new HandleNoDiffEventNoSlidingState(this);
                shapeSpaceNavigationEventListener.disableControlOfSliding();
            }
        }
    }

    inputSelectNavigationProcess(navigationID: number) {
        const warning = new WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
        warning.logMessageToConsole();

        switch(navigationID) {
            case 0: {
                this._navigationState.setNavigationWithoutShapeSpaceMonitoring();
                break;
            }
            case 1: {
                this._navigationState.setNavigationThroughSimplerShapeSpaces();
                break;
            }
            case 2: {
                this._navigationState.setNavigationStrictlyInsideShapeSpace();
                break;
            }
            default: {
                const error = new ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessageToConsole();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        // this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    }

}