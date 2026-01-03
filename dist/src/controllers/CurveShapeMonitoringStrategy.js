"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCurveShapeMonitoringStrategyWithNoDiffEventSliding = exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = exports.CCurveShapeMonitoringStrategyWithInflexionsSliding = exports.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = exports.CCurveShapeMonitoringStrategyWithInflexionsNoSliding = exports.CCurveShapeMonitoringStrategy = exports.OCurveShapeMonitoringStrategyWithNoDiffEventSliding = exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = exports.OCurveShapeMonitoringStrategyWithInflexionsSliding = exports.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = exports.OCurveShapeMonitoringStrategyWithInflexionsNoSliding = exports.OCurveShapeMonitoringStrategy = exports.CurveShapeMonitoringStrategy = void 0;
const Optimizer_1 = require("../mathematics/Optimizer");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
const OptProblemPeriodicBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemPeriodicBSplineR1toR2");
const EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
const OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
class CurveShapeMonitoringStrategy {
    constructor(navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
        this.shapeSpaceDiffEventsStructure = navigationCurveModel.shapeSpaceDiffEventsStructure;
        this.currentCurve = navigationCurveModel.currentCurve;
    }
}
exports.CurveShapeMonitoringStrategy = CurveShapeMonitoringStrategy;
class OCurveShapeMonitoringStrategy extends CurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.openCShapeSpaceNavigator = oCShapeSpaceNavigator;
        this.curveShapeSpaceNavigator = oCShapeSpaceNavigator.curveShapeSpaceNavigator;
        this.currentCurve = oCShapeSpaceNavigator.currentCurve;
    }
    get optimizationProblem() {
        return this._optimizationProblem;
    }
    get optimizer() {
        return this._optimizer;
    }
    set optimizationProblem(optimizationProblem) {
        this._optimizationProblem = optimizationProblem;
    }
    set optimizer(optimizer) {
        this._optimizer = optimizer;
    }
    resetAfterCurveChange() {
        this.resetCurve(this.openCShapeSpaceNavigator.curveModel.spline);
    }
    setEventManagementAtCurveExtremityState() {
        if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents && this.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable) {
            switch (this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities) {
                case ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventStayInsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    break;
                }
                case ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    break;
                }
                case ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable: {
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive;
                    break;
                }
            }
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            if (this.curveShapeSpaceNavigator.eventMgmtAtExtremities !== undefined) {
                switch (this.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities) {
                    case ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active: {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active;
                        break;
                    }
                    case ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive: {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.previousManagementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive;
                        break;
                    }
                }
                this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
            }
        }
    }
}
exports.OCurveShapeMonitoringStrategy = OCurveShapeMonitoringStrategy;
class OCurveShapeMonitoringStrategyWithInflexionsNoSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithInflexionsNoSliding = OCurveShapeMonitoringStrategyWithInflexionsNoSliding;
class OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
class OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
class OCurveShapeMonitoringStrategyWithInflexionsSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithInflexionsSliding = OCurveShapeMonitoringStrategyWithInflexionsSliding;
class OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
class OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
            else {
                this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
class OCurveShapeMonitoringStrategyWithNoDiffEventSliding extends OCurveShapeMonitoringStrategy {
    constructor(oCShapeSpaceNavigator) {
        super(oCShapeSpaceNavigator);
        this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.setEventManagementAtCurveExtremityState();
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        else if (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure, this.openCShapeSpaceNavigator);
        }
        else {
            this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        }
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
}
exports.OCurveShapeMonitoringStrategyWithNoDiffEventSliding = OCurveShapeMonitoringStrategyWithNoDiffEventSliding;
class CCurveShapeMonitoringStrategy extends CurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.closedCShapeSpaceNavigator = cCShapeSpaceNavigator;
        this.currentCurve = cCShapeSpaceNavigator.currentCurve;
    }
    get optimizationProblem() {
        return this._optimizationProblem;
    }
    get optimizer() {
        return this._optimizer;
    }
    set optimizationProblem(optimizationProblem) {
        this._optimizationProblem = optimizationProblem;
    }
    set optimizer(optimizer) {
        this._optimizer = optimizer;
    }
    // setWeightingFactor(optimizationProblem: OpPeriodicBSplineR1toR2): void {
    //     optimizationProblem.weigthingFactors[0] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length-1] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length*2-1] = 10;
    // }
    resetAfterCurveChange() {
        // this.currentCurve = this.closedCShapeSpaceNavigator.curveModel.spline;
        this.resetCurve(this.closedCShapeSpaceNavigator.curveModel.spline);
    }
}
exports.CCurveShapeMonitoringStrategy = CCurveShapeMonitoringStrategy;
class CCurveShapeMonitoringStrategyWithInflexionsNoSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithInflexionsNoSliding = CCurveShapeMonitoringStrategyWithInflexionsNoSliding;
class CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
class CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
class CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
class CCurveShapeMonitoringStrategyWithInflexionsSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithInflexionsSliding = CCurveShapeMonitoringStrategyWithInflexionsSliding;
class CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
class CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
class CCurveShapeMonitoringStrategyWithNoDiffEventSliding extends CCurveShapeMonitoringStrategy {
    constructor(cCShapeSpaceNavigator) {
        super(cCShapeSpaceNavigator);
        this.activeOptimizer = this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (this.activeOptimizer) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
        this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
    }
    newOptimizer(optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    }
    resetCurve(curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    }
}
exports.CCurveShapeMonitoringStrategyWithNoDiffEventSliding = CCurveShapeMonitoringStrategyWithNoDiffEventSliding;
