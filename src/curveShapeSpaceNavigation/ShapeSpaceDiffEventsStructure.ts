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

import { CurveSceneController } from "../controllers/CurveSceneController";
import { ShapeSpaceDiffEventsConfigurator,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator";

export class ShapeSpaceDiffEventsStructure {

    private _activeControlInflections: boolean;
    private _activeControlCurvatureExtrema: boolean;
    private _activeNavigationWithOptimizer: boolean;
    private _slidingDifferentialEvents: boolean;
    public shapeSpaceConfigurator: ShapeSpaceDiffEventsConfigurator;

    constructor(sceneController: CurveSceneController) {
        this._activeControlInflections = sceneController.controlOfInflection;
        this._activeControlCurvatureExtrema = sceneController.controlOfCurvatureExtrema;
        this._slidingDifferentialEvents = sceneController.sliding;
        this.shapeSpaceConfigurator = new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema(this);
        this._activeNavigationWithOptimizer = false;
        // if(controlOfInflections !== undefined) {
        //     this._activeControlInflections = controlOfInflections;
        //     this._activeNavigationWithOptimizer = true;
        // }
        // if(controlOfCurvatureExtrema !== undefined) {
        //     this._activeControlCurvatureExtrema = controlOfCurvatureExtrema;
        //     this._activeNavigationWithOptimizer = true;
        // }
        // if(slidingDiffEvents !== undefined) {
        //     if(this._activeControlInflections !== false || this._activeControlCurvatureExtrema !== false) {
        //         this._slidingDifferentialEvents = slidingDiffEvents;
        //     }

        //}
    }

    // set inflectionControl(controlOfInflections: boolean) {
    //     this._activeControlInflections = controlOfInflections;
    //     if(this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) this._activeNavigationWithOptimizer = false;
    // }

    // set curvatureExtremaControl(controlOfCurvatureExtrema: boolean) {
    //     this._activeControlCurvatureExtrema = controlOfCurvatureExtrema;
    //     if(this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) this._activeNavigationWithOptimizer = false;
    // }

    set differentialEventSliding(slidingDiffEvents: boolean) {
        this._slidingDifferentialEvents = slidingDiffEvents;
    }

    set navigation(activeNavigation: boolean) {
        this._activeNavigationWithOptimizer = activeNavigation;
    }

    get inflectionControl(): boolean {
        return this._activeControlInflections;
    }

    get curvatureExtremaControl(): boolean {
        return this._activeControlCurvatureExtrema;
    }

    get slidingStatus(): boolean {
        return this._slidingDifferentialEvents;
    }

    get navigationStatus(): boolean {
        return this._activeNavigationWithOptimizer;
    }

    reset(): void {
        this._activeNavigationWithOptimizer = false;
        this._activeControlInflections = false;
        this._activeControlCurvatureExtrema = false;
        this._slidingDifferentialEvents = false;
    }

    stop(): void {
        this._activeNavigationWithOptimizer = false;
    }

    restart(): void {
        this._activeNavigationWithOptimizer = true;
    }

    changeShapSpaceStructure(shapeSpaceDiffEventsConfigurator: ShapeSpaceDiffEventsConfigurator): void {
        this.shapeSpaceConfigurator = shapeSpaceDiffEventsConfigurator;
        this.shapeSpaceConfigurator.setShapeSpaceDiffEventsStructure(this);
    }

    addInflectionsToShapeSpaceStructure(): void {
        this.shapeSpaceConfigurator.setShapeSpaceMonitoringToInflections();
    }  
    
    addCurvatureExtremaToShapeSpaceStructure(): void {
        this.shapeSpaceConfigurator.setShapeSpaceMonitoringToCurvatureExtrema();
    }
}