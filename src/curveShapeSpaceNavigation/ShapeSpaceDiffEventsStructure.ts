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
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { NavigationCurveModelInterface } from "./NavigationCurveModelInterface";
import { ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding } from "./ShapeSpaceDiffEventsConfigurator";

export class ShapeSpaceDiffEventsStructure {

    private _activeControlInflections: boolean;
    private _activeControlCurvatureExtrema: boolean;
    private _activeNavigationWithOptimizer: boolean;
    private _slidingDifferentialEvents: boolean;
    private _shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration;
    private _curveCategory: CurveCategory;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;


    constructor(shapeNavigableCurve: ShapeNavigableCurve, curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        const warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curveCategory = shapeNavigableCurve.curveCategory;
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsConfigurator = new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding(this._curveShapeSpaceNavigator);
        this._activeNavigationWithOptimizer = false;
        this._activeControlInflections = false;
        this._activeControlCurvatureExtrema = false;
        this._slidingDifferentialEvents =  false;
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

    get shapeSpaceDiffEventsConfigurator(): ShapeSpaceConfiguration {
        return this._shapeSpaceDiffEventsConfigurator;
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

    changeShapeSpaceStructure(shapeSpaceDiffEventsConfigurator: ShapeSpaceConfiguration): void {
        this._shapeSpaceDiffEventsConfigurator = shapeSpaceDiffEventsConfigurator;
        // this.shapeSpaceConfigurator.setShapeSpaceDiffEventsStructure(this);
    }

    monitorCurveShape(): void {
        this.shapeSpaceDiffEventsConfigurator.monitorCurveUsingDifferentialEvents(this);
    }

    // addInflectionsToShapeSpaceStructure(): void {
    //     this.shapeSpaceConfigurator.setShapeSpaceMonitoringToInflections();
    // }  
    
}