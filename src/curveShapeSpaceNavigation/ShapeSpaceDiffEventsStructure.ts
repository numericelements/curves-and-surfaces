/**
 * Set of parameters monitoring the state of the navigation process
 * @_activeControlInflections : if true activates the optimizer to navigate a shape space with a constant set of inflections
 * @_activeControlCurvatureExtrema : if true activates the optimizer to navigate a shape space with a constant set of curvature extrema
 * @_activeNavigationWithOptimizer : if true activates the optimizer to navigate a shape space in accordance with
 * _activeControlInflections and _activeControlCurvatureExtrema settings
 * if _activeControlInflections and _activeControlCurvatureExtrema are set to false both, _activeNavigationWithOptimizer must be set to false too
 * (there is no need for an optimization process)
 * when the _activeNavigationWithOptimizer is set to false, the shape space navigation process halts but the _activeControlInflections
 * and _activeControlCurvatureExtrema are not reset
 * @_slidingDifferentialEvents : if true the differential events are allowed to slide along the curve. A complementary feature
 * to be taken into account by the optimizer
 */

import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ShapeSpaceConfiguration } from "./ShapeSpaceDiffEventsConfigurator";
import { CurveCategory, OpenPlanarCurve } from "../shapeNavigableCurve/CurveCategory";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { NavigationCurveModelInterface } from "./NavigationCurveModelInterface";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "./ShapeSpaceDiffEventsConfigurator";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";

export enum EventMgmtState {Active, Inactive, NotApplicable}

export class ShapeSpaceDiffEventsStructure {

    private _activeControlInflections: boolean;
    private _activeControlCurvatureExtrema: boolean;
    private _activeNavigationWithOptimizer: boolean;
    private _slidingDifferentialEvents: boolean;
    private _managementOfEventsAtExtremities: EventMgmtState;
    // private _shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration;
    private readonly _curveCategory: CurveCategory;
    private readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;


    constructor(shapeNavigableCurve: ShapeNavigableCurve, curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        const warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curveCategory = shapeNavigableCurve.curveCategory;
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        // this._shapeSpaceDiffEventsConfigurator = new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding(this._curveShapeSpaceNavigator);
        this._activeNavigationWithOptimizer = false;
        this._activeControlInflections = false;
        // Initializes activeControlCurvatureExtrema, controlOfInflection in accordance with the navigation mode:
        //      mode 0: activeControlCurvatureExtrema = false, controlOfInflection = false,
        //      mode 1, mode 2: activeControlCurvatureExtrema = true, controlOfInflection = true
        this._activeControlCurvatureExtrema = false;
            // Initializes slidingDifferentialEvents in accordance with the navigation mode:
        //      mode 0: slidingDifferentialEvents = false
        //      mode 1, mode 2: slidingDifferentialEvents =  true
        this._slidingDifferentialEvents =  false;
        if(this._curveCategory instanceof OpenPlanarCurve) {
            this._managementOfEventsAtExtremities = EventMgmtState.Inactive;
        } else if(this._curveCategory instanceof ClosedCurveModel) {
            this._managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
        } else{
            this._managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
            const error = new ErrorLog(this.constructor.name, "constructor", "Curve category type unknown.");
            error.logMessageToConsole();
        }
    }

    set activeControlInflections(controlOfInflections: boolean) {
        this._activeControlInflections = controlOfInflections;
        if(this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) {
            this._activeNavigationWithOptimizer = false;
        } else {
            this._activeNavigationWithOptimizer = true;
        }
    }

    set activeControlCurvatureExtrema(controlOfCurvatureExtrema: boolean) {
        this._activeControlCurvatureExtrema = controlOfCurvatureExtrema;
        if(this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) {
            this._activeNavigationWithOptimizer = false;
        } else {
            this._activeNavigationWithOptimizer = true;
        }
    }

    set slidingDifferentialEvents(slidingDiffEvents: boolean) {
        this._slidingDifferentialEvents = slidingDiffEvents;
    }

    set activeNavigationWithOptimizer(activeNavigation: boolean) {
        this._activeNavigationWithOptimizer = activeNavigation;
    }

    set managementOfEventsAtExtremities(managementOfEventsAtExtremities: EventMgmtState) {
        if(this._curveCategory instanceof OpenPlanarCurve) {
            if(managementOfEventsAtExtremities === EventMgmtState.NotApplicable) {
                const error = new ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the open curve category");
                error.logMessageToConsole();
            } else {
                this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
            }
        } else if(this._curveCategory instanceof ClosedCurveModel) {
            if(managementOfEventsAtExtremities !== EventMgmtState.NotApplicable) {
                const error = new ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the closed curve category");
                error.logMessageToConsole();
            } else {
                this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
            }
        }
    }

    get activeControlInflections(): boolean {
        return this._activeControlInflections;
    }

    get activeControlCurvatureExtrema(): boolean {
        return this._activeControlCurvatureExtrema;
    }

    get slidingDifferentialEvents(): boolean {
        return this._slidingDifferentialEvents;
    }

    get activeNavigationWithOptimizer(): boolean {
        return this._activeNavigationWithOptimizer;
    }

    get curveCategory(): CurveCategory {
        return this._curveCategory;
    }

    // get shapeSpaceDiffEventsConfigurator(): ShapeSpaceConfiguration {
    //     return this._shapeSpaceDiffEventsConfigurator;
    // }

    get managementOfEventsAtExtremities():EventMgmtState {
        return this._managementOfEventsAtExtremities;
    }

    reset(): void {
        this._activeNavigationWithOptimizer = false;
        // this._activeControlInflections = false;
        // this._activeControlCurvatureExtrema = false;
        // this._slidingDifferentialEvents = false;
    }

    stop(): void {
        this._activeNavigationWithOptimizer = false;
    }

    restart(): void {
        this._activeNavigationWithOptimizer = true;
    }

    // changeShapeSpaceStructure(shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration): void {
    //     this._shapeSpaceDiffEventsConfigurator = shapeSpaceDiffEventsConfigurator;
    //     // this.shapeSpaceConfigurator.setShapeSpaceDiffEventsStructure(this);
    // }

    // addInflectionsToShapeSpaceStructure(): void {
    //     this.shapeSpaceConfigurator.setShapeSpaceMonitoringToInflections();
    // }  
    
}