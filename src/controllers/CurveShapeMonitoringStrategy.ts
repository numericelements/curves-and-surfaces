import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints, } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { NeighboringEventsType } from "./SlidingStrategy";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { OpPeriodicBSplineR1toR2, OpPeriodicBSplineR1toR2NoInactiveConstraints } from "../bsplineOptimizationProblems/OpPeriodicBSplineR1toR2";
import { ActiveControl, BaseOpProblemBSplineR1toR2 } from "../bsplineOptimizationProblems/BaseOpBSplineR1toR2";

export abstract class CurveShapeMonitoringStrategy {

    protected readonly shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure; 
    protected readonly navigationCurveModel: NavigationCurveModel;
    protected currentCurve: BSplineR1toR2Interface;

    constructor(navigationCurveModel: NavigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
        this.shapeSpaceDiffEventsStructure = navigationCurveModel.shapeSpaceDiffEventsStructure;
        this.currentCurve = navigationCurveModel.currentCurve;
    }

    // abstract get optimizationProblem(): BaseOpProblemBSplineR1toR2;
}

export abstract class OCurveShapeMonitoringStrategy extends CurveShapeMonitoringStrategy {

    protected currentCurve: BSplineR1toR2;
    protected readonly openCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator;
    protected abstract _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors
    protected abstract _optimizer: Optimizer;

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.openCShapeSpaceNavigator = oCShapeSpaceNavigator;
        this.currentCurve = oCShapeSpaceNavigator.currentCurve;
    }

    get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors {
        return this._optimizationProblem;
    }

    get optimizer(): Optimizer {
        return this._optimizer;
    }

    set optimizationProblem(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        this._optimizationProblem = optimizationProblem;
    }

    set optimizer(optimizer: Optimizer) {
        this._optimizer = optimizer;
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors): void {
        optimizationProblem.weigthingFactors[0] = 10;
        optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length] = 10;
        optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length-1] = 10;
        optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length*2-1] = 10;
    }

    resetAfterCurveChange(): void {
        this.currentCurve = this.openCShapeSpaceNavigator.curveModel.spline;
    }
}

export class OCurveShapeMonitoringStrategyWithInflexionsNoSliding extends OCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.inflections;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints): Optimizer {
        this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.curvatureExtrema;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.both;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.none;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithInflexionsSliding extends OCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        const activeControl: ActiveControl = ActiveControl.inflections;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors): Optimizer {
        this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.curvatureExtrema;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }
}

export class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.both;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }
}

export class OCurveShapeMonitoringStrategyWithNoDiffEventSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        let activeControl : ActiveControl = ActiveControl.none;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors): Optimizer {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}


export abstract class CCurveShapeMonitoringStrategy extends CurveShapeMonitoringStrategy {

    protected currentCurve: PeriodicBSplineR1toR2;
    protected readonly closedCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator;
    protected abstract _optimizationProblem: OpPeriodicBSplineR1toR2
    protected abstract _optimizer: Optimizer;

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.closedCShapeSpaceNavigator = cCShapeSpaceNavigator;
        this.currentCurve = cCShapeSpaceNavigator.currentCurve;
    }

    get optimizationProblem(): OpPeriodicBSplineR1toR2 {
        return this._optimizationProblem;
    }

    get optimizer(): Optimizer {
        return this._optimizer;
    }

    set optimizationProblem(optimizationProblem: OpPeriodicBSplineR1toR2) {
        this._optimizationProblem = optimizationProblem;
    }

    set optimizer(optimizer: Optimizer) {
        this._optimizer = optimizer;
    }

    // setWeightingFactor(optimizationProblem: OpPeriodicBSplineR1toR2): void {
    //     optimizationProblem.weigthingFactors[0] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length-1] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length*2-1] = 10;
    // }

    resetAfterCurveChange(): void {
        this.currentCurve = this.closedCShapeSpaceNavigator.curveModel.spline;
    }
}

export class CCurveShapeMonitoringStrategyWithInflexionsNoSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.inflections;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.curvatureExtrema;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.both;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.none;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithInflexionsSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.inflections;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.curvatureExtrema;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(!this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.both;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class CCurveShapeMonitoringStrategyWithNoDiffEventSliding extends CCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OpPeriodicBSplineR1toR2;
    protected _optimizer: Optimizer;
    private activeOptimizer: boolean;
    public lastDiffEvent: NeighboringEventsType

    constructor(cCShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if(this.activeOptimizer) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessageToConsole();
        } else if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
                        // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessageToConsole();
        }
        const activeControl : ActiveControl = ActiveControl.none;
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new  OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.currentCurve.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}