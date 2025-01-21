"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCurveShapeMonitoringStrategyWithNoDiffEventSliding = exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = exports.CCurveShapeMonitoringStrategyWithInflexionsSliding = exports.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = exports.CCurveShapeMonitoringStrategyWithInflexionsNoSliding = exports.CCurveShapeMonitoringStrategy = exports.OCurveShapeMonitoringStrategyWithNoDiffEventSliding = exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = exports.OCurveShapeMonitoringStrategyWithInflexionsSliding = exports.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = exports.OCurveShapeMonitoringStrategyWithInflexionsNoSliding = exports.OCurveShapeMonitoringStrategy = exports.CurveShapeMonitoringStrategy = void 0;
var Optimizer_1 = require("../mathematics/Optimizer");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var OptProblemPeriodicBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemPeriodicBSplineR1toR2");
var EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
var OptProblemOpenBSplineR1toR2_1 = require("../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
var CurveShapeMonitoringStrategy = /** @class */ (function () {
    function CurveShapeMonitoringStrategy(navigationCurveModel) {
        this.navigationCurveModel = navigationCurveModel;
        this.shapeSpaceDiffEventsStructure = navigationCurveModel.shapeSpaceDiffEventsStructure;
        this.currentCurve = navigationCurveModel.currentCurve;
    }
    return CurveShapeMonitoringStrategy;
}());
exports.CurveShapeMonitoringStrategy = CurveShapeMonitoringStrategy;
var OCurveShapeMonitoringStrategy = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategy, _super);
    function OCurveShapeMonitoringStrategy(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.openCShapeSpaceNavigator = oCShapeSpaceNavigator;
        _this.curveShapeSpaceNavigator = oCShapeSpaceNavigator.curveShapeSpaceNavigator;
        _this.currentCurve = oCShapeSpaceNavigator.currentCurve;
        return _this;
    }
    Object.defineProperty(OCurveShapeMonitoringStrategy.prototype, "optimizationProblem", {
        get: function () {
            return this._optimizationProblem;
        },
        set: function (optimizationProblem) {
            this._optimizationProblem = optimizationProblem;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OCurveShapeMonitoringStrategy.prototype, "optimizer", {
        get: function () {
            return this._optimizer;
        },
        set: function (optimizer) {
            this._optimizer = optimizer;
        },
        enumerable: false,
        configurable: true
    });
    OCurveShapeMonitoringStrategy.prototype.resetAfterCurveChange = function () {
        this.resetCurve(this.openCShapeSpaceNavigator.curveModel.spline);
    };
    OCurveShapeMonitoringStrategy.prototype.setEventManagementAtCurveExtremityState = function () {
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
    };
    return OCurveShapeMonitoringStrategy;
}(CurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategy = OCurveShapeMonitoringStrategy;
var OCurveShapeMonitoringStrategyWithInflexionsNoSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithInflexionsNoSliding, _super);
    function OCurveShapeMonitoringStrategyWithInflexionsNoSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithInflexionsNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithInflexionsNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    return OCurveShapeMonitoringStrategyWithInflexionsNoSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithInflexionsNoSliding = OCurveShapeMonitoringStrategyWithInflexionsNoSliding;
var OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding, _super);
    function OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    return OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
var OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding, _super);
    function OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    return OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
var OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding, _super);
    function OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    return OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
var OCurveShapeMonitoringStrategyWithInflexionsSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithInflexionsSliding, _super);
    function OCurveShapeMonitoringStrategyWithInflexionsSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (_this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
            else {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure, _this.openCShapeSpaceNavigator);
        }
        else {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        }
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithInflexionsSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithInflexionsSliding.prototype.resetCurve = function (curve) {
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
    };
    return OCurveShapeMonitoringStrategyWithInflexionsSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithInflexionsSliding = OCurveShapeMonitoringStrategyWithInflexionsSliding;
var OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding, _super);
    function OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (_this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
            else {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure, _this.openCShapeSpaceNavigator);
        }
        else {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        }
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding.prototype.resetCurve = function (curve) {
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
    };
    return OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
var OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding, _super);
    function OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            if (_this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
            else {
                _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
            }
        }
        else if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure, _this.openCShapeSpaceNavigator);
        }
        else {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        }
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding.prototype.resetCurve = function (curve) {
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
    };
    return OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
var OCurveShapeMonitoringStrategyWithNoDiffEventSliding = /** @class */ (function (_super) {
    __extends(OCurveShapeMonitoringStrategyWithNoDiffEventSliding, _super);
    function OCurveShapeMonitoringStrategyWithNoDiffEventSliding(oCShapeSpaceNavigator) {
        var _this = _super.call(this, oCShapeSpaceNavigator) || this;
        _this.activeOptimizer = oCShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces) {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        }
        else if (_this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace) {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure, _this.openCShapeSpaceNavigator);
        }
        else {
            _this._optimizationProblem = new OptProblemOpenBSplineR1toR2_1.OptProblemOPenBSplineR1toR2WithWeigthingFactors(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        }
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.setEventManagementAtCurveExtremityState();
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    OCurveShapeMonitoringStrategyWithNoDiffEventSliding.prototype.newOptimizer = function (optimizationProblem) {
        optimizationProblem.setWeightingFactor();
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    OCurveShapeMonitoringStrategyWithNoDiffEventSliding.prototype.resetCurve = function (curve) {
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
    };
    return OCurveShapeMonitoringStrategyWithNoDiffEventSliding;
}(OCurveShapeMonitoringStrategy));
exports.OCurveShapeMonitoringStrategyWithNoDiffEventSliding = OCurveShapeMonitoringStrategyWithNoDiffEventSliding;
var CCurveShapeMonitoringStrategy = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategy, _super);
    function CCurveShapeMonitoringStrategy(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.closedCShapeSpaceNavigator = cCShapeSpaceNavigator;
        _this.currentCurve = cCShapeSpaceNavigator.currentCurve;
        return _this;
    }
    Object.defineProperty(CCurveShapeMonitoringStrategy.prototype, "optimizationProblem", {
        get: function () {
            return this._optimizationProblem;
        },
        set: function (optimizationProblem) {
            this._optimizationProblem = optimizationProblem;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CCurveShapeMonitoringStrategy.prototype, "optimizer", {
        get: function () {
            return this._optimizer;
        },
        set: function (optimizer) {
            this._optimizer = optimizer;
        },
        enumerable: false,
        configurable: true
    });
    // setWeightingFactor(optimizationProblem: OpPeriodicBSplineR1toR2): void {
    //     optimizationProblem.weigthingFactors[0] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length-1] = 10;
    //     optimizationProblem.weigthingFactors[this.currentCurve.controlPoints.length*2-1] = 10;
    // }
    CCurveShapeMonitoringStrategy.prototype.resetAfterCurveChange = function () {
        // this.currentCurve = this.closedCShapeSpaceNavigator.curveModel.spline;
        this.resetCurve(this.closedCShapeSpaceNavigator.curveModel.spline);
    };
    return CCurveShapeMonitoringStrategy;
}(CurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategy = CCurveShapeMonitoringStrategy;
var CCurveShapeMonitoringStrategyWithInflexionsNoSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithInflexionsNoSliding, _super);
    function CCurveShapeMonitoringStrategyWithInflexionsNoSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithInflexionsNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflexionsNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflexionsNoSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithInflexionsNoSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithInflexionsNoSliding = CCurveShapeMonitoringStrategyWithInflexionsNoSliding;
var CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding, _super);
    function CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding = CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding;
var CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding, _super);
    function CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding = CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding;
var CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding, _super);
    function CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this._optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding = CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding;
var CCurveShapeMonitoringStrategyWithInflexionsSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithInflexionsSliding, _super);
    function CCurveShapeMonitoringStrategyWithInflexionsSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithInflexionsSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflexionsSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflexionsSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithInflexionsSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithInflexionsSliding = CCurveShapeMonitoringStrategyWithInflexionsSliding;
var CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding, _super);
    function CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding = CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding;
var CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding, _super);
    function CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (!_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (!_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be active.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding = CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding;
var CCurveShapeMonitoringStrategyWithNoDiffEventSliding = /** @class */ (function (_super) {
    __extends(CCurveShapeMonitoringStrategyWithNoDiffEventSliding, _super);
    function CCurveShapeMonitoringStrategyWithNoDiffEventSliding(cCShapeSpaceNavigator) {
        var _this = _super.call(this, cCShapeSpaceNavigator) || this;
        _this.activeOptimizer = _this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer;
        if (_this.activeOptimizer) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of activeNavigationWithOptimizer parameter.");
            error.logMessage();
        }
        else if (_this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent status of slidingDifferentialEvents parameter: sliding should be inactive.");
            error.logMessage();
        }
        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        _this._optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(_this.currentCurve.clone(), _this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        _this._optimizer = _this.newOptimizer(_this._optimizationProblem);
        _this.lastDiffEvent = NeighboringEvents_1.NeighboringEventsType.none;
        return _this;
    }
    CCurveShapeMonitoringStrategyWithNoDiffEventSliding.prototype.newOptimizer = function (optimizationProblem) {
        // this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithNoDiffEventSliding.prototype.resetCurve = function (curve) {
        this.currentCurve = curve;
        this.optimizationProblem = new OptProblemPeriodicBSplineR1toR2_1.OptProblemPeriodicBSplineR1toR2(this.currentCurve.clone(), this.shapeSpaceDiffEventsStructure);
        /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this._optimizer = this.newOptimizer(this.optimizationProblem);
    };
    CCurveShapeMonitoringStrategyWithNoDiffEventSliding.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        // Do nothing -> for temporary compatibility
    };
    return CCurveShapeMonitoringStrategyWithNoDiffEventSliding;
}(CCurveShapeMonitoringStrategy));
exports.CCurveShapeMonitoringStrategyWithNoDiffEventSliding = CCurveShapeMonitoringStrategyWithNoDiffEventSliding;
