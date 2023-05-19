import { OptProblemBSplineR1toR2WithWeigthingFactors, OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation, OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints, } from "../bsplineOptimizationProblems/OptProblemBSplineR1toR2";
import { Optimizer } from "../mathematics/Optimizer";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtState, ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { NeighboringEventsType } from "./SlidingStrategy";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { OpPeriodicBSplineR1toR2, OpPeriodicBSplineR1toR2NoInactiveConstraints } from "../bsplineOptimizationProblems/OpPeriodicBSplineR1toR2";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { EventSlideOutsideCurve, EventStayInsideCurve, NoEventToManageForCurve } from "../shapeNavigableCurve/EventStateAtCurveExtremity";
import { OptimizationProblemInterface } from "../optimizationProblemFacade/OptimizationProblemInterface";
import { OpBSplineR1toR2Interface } from "../bsplineOptimizationProblems/IOpBSplineR1toR2";
import { OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces } from "../curveShapeSpaceNavigation/NavigationState";

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
    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected abstract _optimizationProblem: OpBSplineR1toR2Interface;
    // protected abstract _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors
    protected abstract _optimizer: Optimizer;

    constructor(oCShapeSpaceNavigator: OpenCurveShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.openCShapeSpaceNavigator = oCShapeSpaceNavigator;
        this.curveShapeSpaceNavigator = oCShapeSpaceNavigator.curveShapeSpaceNavigator;
        this.currentCurve = oCShapeSpaceNavigator.currentCurve;
    }

    get optimizationProblem(): OpBSplineR1toR2Interface {
        return this._optimizationProblem;
    }

    get optimizer(): Optimizer {
        return this._optimizer;
    }

    set optimizationProblem(optimizationProblem: OpBSplineR1toR2Interface) {
        this._optimizationProblem = optimizationProblem;
    }

    set optimizer(optimizer: Optimizer) {
        this._optimizer = optimizer;
    }

    // setWeightingFactor(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors): void {
    //     optimizationProblem.weigthingFactors[0] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length-1] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length*2-1] = 10;
    // }

    resetAfterCurveChange(): void {
        this.resetCurve(this.openCShapeSpaceNavigator.curveModel.spline);
    }

    setEventManagementAtCurveExtremityState(): void {
        if(this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents && this.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === EventMgmtState.NotApplicable) {
            switch (this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities) {
                case EventMgmtState.Active: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    break;
                }
                case EventMgmtState.Inactive: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    break;
                }
                case EventMgmtState.NotApplicable: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = EventMgmtState.Inactive;
                    break;
                }
            }
        } else if(!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            if(this.curveShapeSpaceNavigator.eventMgmtAtExtremities !== undefined) {
                switch(this.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities) {
                    case EventMgmtState.Active: {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = EventMgmtState.Active;
                        break;
                    }
                    case EventMgmtState.Inactive: {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = EventMgmtState.Inactive;
                        break;
                    }
                }
                this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
            }
        }
    }

    abstract resetCurve(curve: BSplineR1toR2): void;
}

export class OCurveShapeMonitoringStrategyWithInflexionsNoSliding extends OCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints;
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints;
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithInflexionsSliding extends OCurveShapeMonitoringStrategy {
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors;
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
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }

        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}

export class OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors;
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
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }
}

export class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors;
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
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }
}

export class OCurveShapeMonitoringStrategyWithNoDiffEventSliding extends OCurveShapeMonitoringStrategy{
    
    protected _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors
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
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors): Optimizer {
        optimizationProblem.setWeightingFactor();
        // this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve;
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        } else if (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, 
                this.openCShapeSpaceNavigator);
        } else {
            this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
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
        // this.currentCurve = this.closedCShapeSpaceNavigator.curveModel.spline;
        this.resetCurve(this.closedCShapeSpaceNavigator.curveModel.spline);
    }

    abstract resetCurve(curve: PeriodicBSplineR1toR2): void;
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2NoInactiveConstraints): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this._optimizationProblem = new OpPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
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
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    newOptimizer(optimizationProblem: OpPeriodicBSplineR1toR2): Optimizer {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer(optimizationProblem);
    }

    resetCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve;
        this.optimizationProblem = new OpPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem)
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        // Do nothing -> for temporary compatibility
    }

}