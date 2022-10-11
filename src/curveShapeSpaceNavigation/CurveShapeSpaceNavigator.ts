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
import { CurveShapeSpaceDescriptor } from "./CurveShapeSpaceDesccriptor";
import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { NavigationState, OCurveNavigationWithoutShapeSpaceMonitoring, CCurveNavigationWithoutShapeSpaceMonitoring } from "./NavigationState";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint} from "./CurveConstraintStrategy";
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding, ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzerEventsSlidingOutOfInterval } from "../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { CurveControlStrategyInterface } from "../controllers/CurveControlStrategyInterface";
import { CurveControlState, HandleNoDiffEventNoSlidingState } from "../controllers/CurveControlState";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { DummyStrategy } from "../controllers/DummyStrategy";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { NavigationCurveModelInterface } from "./NavigationCurveModelInterface";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "./NavigationCurveModel";

export const MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
export const MAX_TRUST_REGION_RADIUS = 100;
export const CONVERGENCE_THRESHOLD = 10e-8;

/* JCL 2020/11/06 Add controls to monitor the location of the curvature extrema and inflection points */
export enum ActiveExtremaLocationControl {mergeExtrema, none, stopDeforming, extremumLeaving, extremumEntering}
export enum ActiveInflectionLocationControl {mergeExtremaAndInflection, none, stopDeforming}

export class CurveShapeSpaceNavigator {

    private _shapeNavigableCurve: ShapeNavigableCurve;
    private _curveModel: CurveModelInterface;
    private _sliding: boolean;
    private _controlOfCurvatureExtrema: boolean;
    private _controlOfInflection: boolean;
    private _navigationCurveModel: NavigationCurveModel;
    private _navigationState: NavigationState;
    private _curveControl: CurveControlStrategyInterface;
    private _curveControlState: CurveControlState;
    private _activeExtremaLocationControl: ActiveExtremaLocationControl;
    private _activeInflectionLocationControl: ActiveInflectionLocationControl;
    private _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    private _shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator;
    // abstract selectedControlPoint?: number;

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
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        this._navigationCurveModel = new OpenCurveShapeSpaceNavigator(this);
        this._navigationState = this._navigationCurveModel.navigationState;
        this._curveControl = this._navigationCurveModel.curveControl;
        this._curveControlState = this._navigationCurveModel.curveControlState;
        this._activeExtremaLocationControl = this._navigationCurveModel.activeExtremaLocationControl;
        this._activeInflectionLocationControl = this._navigationCurveModel.activeInflectionLocationControl;
        this._shapeSpaceDiffEventsStructure = this._navigationCurveModel.shapeSpaceDiffEventsStructure;
        this._shapeSpaceDiffEventsConfigurator = this._navigationCurveModel.shapeSpaceDiffEventsConfigurator;

    }

    changeNavigationCurveModelState(state: NavigationCurveModel): void {
        this._navigationCurveModel = state;
        // this._navigationCurveModel.setNavigationCurveModel(this);
    }

    toggleSliding() {
        if(this._curveModel !== undefined) {
            if(this._sliding) {
                this._sliding = false;
                //  this._curveControl = new NoSlidingStrategy(this._curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this._shapeNavigableCurve.activeLocationControl);
            }
            else {
                this._sliding = true;
                // this.curveControl = new SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema, this)
            }
        } else throw new Error("Unable to slide curvature extrema and/or inflexion points. Undefined curve model");
        this._curveControlState.handleSliding();
    }

    toggleControlOfCurvatureExtrema() {
        this._curveControl.toggleControlOfCurvatureExtrema();
        this._controlOfCurvatureExtrema = !this._controlOfCurvatureExtrema

        this._curveControlState.handleCurvatureExtrema();
    }

    toggleControlOfInflections() {
        this._curveControl.toggleControlOfInflections()
        this.controlOfInflection = ! this.controlOfInflection

        this._curveControlState.handleInflections();
    }

    inputSelectNavigationProcess(navigationID: number) {
        let warning = new WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
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
                let error = new ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessageToConsole();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        // this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    }

    // abstract navigateSpace(selectedControlPoint: number, x: number, y: number): void;

    // abstract transitionTo(curveControlState: CurveControlState): void;

    // abstract curveDisplacement(): void;

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

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get activeExtremaLocationControl(): ActiveExtremaLocationControl {
        return this._activeExtremaLocationControl;
    }

    get activeInflectionLocationControl(): ActiveInflectionLocationControl {
        return this._activeInflectionLocationControl;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure {
        return this._shapeSpaceDiffEventsStructure;
    }

    get shapeSpaceDiffEventsConfigurator(): ShapeSpaceDiffEventsConfigurator {
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

    set curveModel(curveModel: CurveModelInterface) {
        this._curveModel = curveModel;
    }

    set navigationCurveModel(navigationCurveModel: NavigationCurveModel) {
        this._navigationCurveModel = navigationCurveModel;
    }

    set navigationState(navigationState: NavigationState)  {
        this._navigationState = navigationState;
    }
}