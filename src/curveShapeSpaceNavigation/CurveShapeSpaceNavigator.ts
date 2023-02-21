import { OptimizationProblemCtrlParameters } from "../bsplineOptimizationProblems/OptimizationProblemCtrlParameters";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ClosedCurveAnalyzer, OpenCurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Optimizer } from "../mathematics/Optimizer";
import { Vector2d } from "../mathVector/Vector2d";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEvents } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveConstraints } from "./CurveConstraints";
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDescriptor";
import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { NavigationState, OCurveNavigationWithoutShapeSpaceMonitoring, CCurveNavigationWithoutShapeSpaceMonitoring } from "./NavigationState";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint} from "./CurveConstraintStrategy";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding, ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, ShapeSpaceConfiguration } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { CurveControlStrategyInterface } from "../controllers/CurveControlStrategyInterface";
import { CurveControlState, HandleNoDiffEventNoSlidingState } from "../controllers/CurveControlState";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { NavigationCurveModelInterface } from "./NavigationCurveModelInterface";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "./NavigationCurveModel";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { EventStateAtCurveExtremity } from "../shapeNavigableCurve/EventStateAtCurveExtremity";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

/* JCL 2020/11/06 Add controls to monitor the location of the curvature extrema and inflection points */
export enum ActiveExtremaLocationControl {mergeExtrema, none, stopDeforming, extremumLeaving, extremumEntering}
export enum ActiveInflectionLocationControl {mergeExtremaAndInflection, none, stopDeforming}

export class CurveShapeSpaceNavigator {

    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    private _curveModel: CurveModelInterface;
    private _sliding: boolean;
    private _controlOfCurvatureExtrema: boolean;
    private _controlOfInflection: boolean;
    private _controlOfEventsAtExtremity: boolean;
    private _navigationCurveModel: NavigationCurveModel;
    private _navigationState: NavigationState;
    private _curveControl: CurveControlStrategyInterface;
    private _eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;
    private _activeExtremaLocationControl: ActiveExtremaLocationControl;
    // private _activeInflectionLocationControl: ActiveInflectionLocationControl;
    private readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    private _shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration;

    //JCL temporary addition for compatibility with prior version
    public curveSceneController?: CurveSceneController;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        // Initializes sliding in accordance with the navigation mode:
        //      mode 0: sliding = false
        //      mode 1, mode 2: sliding =  true
        this._sliding = false;
        // Initializes controlOfCurvatureExtrema, controlOfInflection in accordance with the navigation mode:
        //      mode 0: controlOfCurvatureExtrema = false, controlOfInflection = false,
        //      mode 1, mode 2: controlOfCurvatureExtrema = true, controlOfInflection = true
        this._controlOfCurvatureExtrema = false;
        this._controlOfInflection = false;
        // Initializes controlOfEventsAtExtremity in accordance with the navigation mode:
        //      mode 0, mode 1, mode 2: controlOfCurveClamping =  false,
        this._controlOfEventsAtExtremity = false;

        this._shapeNavigableCurve = shapeNavigableCurve;
        this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        this._shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure(this._shapeNavigableCurve, this);
        this._shapeSpaceDiffEventsConfigurator = this._shapeSpaceDiffEventsStructure.shapeSpaceDiffEventsConfigurator;
        this._navigationCurveModel = new OpenCurveShapeSpaceNavigator(this);
        this._navigationState = this._navigationCurveModel.navigationState;
        this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities(this);
        this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventState;
        this._navigationState.navigationStateChange = false;
        this._shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        this._curveControl = this._navigationCurveModel.curveControl;
        this._activeExtremaLocationControl = this._navigationCurveModel.activeExtremaLocationControl;
        // this._activeInflectionLocationControl = this._navigationCurveModel.activeInflectionLocationControl;

        this.curveSceneController = undefined;
    }

    get curveModel(): CurveModelInterface {
        return this._curveModel;
    }

    get navigationCurveModel(): NavigationCurveModel {
        return this._navigationCurveModel;
    }

    get navigationState(): NavigationState {
        return this._navigationState;
    }

    get sliding(): boolean {
        return this._sliding;
    }

    get controlOfCurvatureExtrema(): boolean {
        return this._controlOfCurvatureExtrema;
    }

    get controlOfInflection(): boolean {
        return this._controlOfInflection;
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

    get activeExtremaLocationControl(): ActiveExtremaLocationControl {
        return this._activeExtremaLocationControl;
    }

    // get activeInflectionLocationControl(): ActiveInflectionLocationControl {
    //     return this._activeInflectionLocationControl;
    // }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure {
        return this._shapeSpaceDiffEventsStructure;
    }

    get shapeSpaceDiffEventsConfigurator(): ShapeSpaceConfiguration {
        return this._shapeSpaceDiffEventsConfigurator;
    }

    set sliding(sliding: boolean) {
        this._sliding = sliding
    }

    set controlOfCurvatureExtrema(controlOfCurvatureExtrema: boolean) {
        this._controlOfCurvatureExtrema = controlOfCurvatureExtrema;
    }

    set controlOfInflection(controlOfInflection: boolean) {
        this._controlOfInflection = controlOfInflection;
    }
    set controlOfEventsAtExtremity(controlOfEventsAtExtremity: boolean) {
        this._controlOfEventsAtExtremity = controlOfEventsAtExtremity;
    }

    set eventMgmtAtExtremities(eventMgmtAtExtremities: EventMgmtAtCurveExtremities) {
        this._eventMgmtAtExtremities = eventMgmtAtExtremities;
    }

    set eventStateAtCrvExtremities(eventStateAtCrvExtremities: EventStateAtCurveExtremity) {
        this._eventStateAtCrvExtremities = eventStateAtCrvExtremities;
    }

    set curveModel(curveModel: CurveModelInterface) {
        this._curveModel = curveModel;
    }

    set navigationCurveModel(navigationCurveModel: NavigationCurveModel) {
        this._navigationCurveModel = navigationCurveModel;
    }

    set navigationState(navigationState: NavigationState)  {
        this._navigationState = navigationState;
    }

    set shapeSpaceDiffEventsConfigurator(shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration) {
        this._shapeSpaceDiffEventsConfigurator = shapeSpaceDiffEventsConfigurator;
    }

    // abstract navigateSpace(selectedControlPoint: number, x: number, y: number): void;

    // abstract transitionTo(curveControlState: CurveControlState): void;

    changeMngmtOfEventAtExtremity(eventState: EventStateAtCurveExtremity): void {
        this._eventStateAtCrvExtremities = eventState;
    }

    changeNavigationCurveModelState(state: NavigationCurveModel): void {
        this._navigationCurveModel = state;
        // this._navigationCurveModel.setNavigationCurveModel(this);
    }

    toggleSliding() {
        if(this._curveModel !== undefined) {
            if(this._sliding) {
                this._sliding = false;
                //  this._curveControl = new NoSlidingStrategy(this._curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema);
            }
            else {
                this._sliding = true;
                // this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "toggleSliding", "Unable to slide curvature extrema and/or inflexion points. Undefined curve model");
            error.logMessageToConsole();
        }
        this._shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(this._shapeSpaceDiffEventsConfigurator);
    }

    toggleControlOfCurvatureExtrema() {
        this._curveControl.toggleControlOfCurvatureExtrema();
        this._controlOfCurvatureExtrema = !this._controlOfCurvatureExtrema;

        this._shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(this._shapeSpaceDiffEventsConfigurator);
    }

    toggleControlOfInflections() {
        this._curveControl.toggleControlOfInflections()
        this.controlOfInflection = !this.controlOfInflection;

        this._shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(this._shapeSpaceDiffEventsConfigurator);
    }

    toggleEventMgmtAtCurveExt() {
        // this._curveControl.toggleEventMgmtAtCurveExt();
        this._controlOfEventsAtExtremity = !this._controlOfEventsAtExtremity
        console.log("control of event at extremity: " + this._controlOfEventsAtExtremity)

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