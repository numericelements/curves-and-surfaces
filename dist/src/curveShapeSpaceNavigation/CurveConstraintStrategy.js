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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveConstraintClampedFirstAndLastControlPoint = exports.CurveConstraintClampedLastControlPoint = exports.CurveConstraintClampedFirstControlPoint = exports.CurveConstraintNoConstraint = exports.CurveConstraintStrategy = exports.TOL_LOCATION_CURVE_REFERENCE_POINTS = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var CurveConstraints_1 = require("./CurveConstraints");
var SquareMatrix_1 = require("../linearAlgebra/SquareMatrix");
var AbstractBSplineR1toR2_1 = require("../newBsplines/AbstractBSplineR1toR2");
exports.TOL_LOCATION_CURVE_REFERENCE_POINTS = 1.0E-6;
var CurveConstraintStrategy = /** @class */ (function () {
    function CurveConstraintStrategy(curveConstraints) {
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this._currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this._constraintsNotSatisfied = false;
    }
    Object.defineProperty(CurveConstraintStrategy.prototype, "constraintsNotSatisfied", {
        get: function () {
            return this._constraintsNotSatisfied;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintStrategy.prototype, "currentCurve", {
        get: function () {
            return this._currentCurve.clone();
        },
        set: function (currentCurve) {
            this._currentCurve = currentCurve.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintStrategy.prototype, "optimizedCurve", {
        get: function () {
            return this._optimizedCurve.clone();
        },
        set: function (optimizedCurve) {
            this._optimizedCurve = optimizedCurve.clone();
        },
        enumerable: false,
        configurable: true
    });
    return CurveConstraintStrategy;
}());
exports.CurveConstraintStrategy = CurveConstraintStrategy;
var CurveConstraintNoConstraint = /** @class */ (function (_super) {
    __extends(CurveConstraintNoConstraint, _super);
    function CurveConstraintNoConstraint(curveConstraints) {
        var _this = _super.call(this, curveConstraints) || this;
        if (_this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            _this._curveShapeSpaceNavigator = _this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            _this._curveShapeSpaceNavigator = undefined;
        }
        _this._firstControlPoint = CurveConstraints_1.ConstraintType.none;
        _this._lastControlPoint = CurveConstraints_1.ConstraintType.none;
        _this.curveConstraints.firstControlPoint = _this._firstControlPoint;
        _this.curveConstraints.lastControlPoint = _this._lastControlPoint;
        if (_this._curveShapeSpaceNavigator !== undefined) {
            _this._optimizedCurve = _this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            _this._optimizedCurve = _this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessage();
        return _this;
    }
    Object.defineProperty(CurveConstraintNoConstraint.prototype, "firstControlPoint", {
        get: function () {
            return this._firstControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintNoConstraint.prototype, "lastControlPoint", {
        get: function () {
            return this._lastControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintNoConstraint.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    CurveConstraintNoConstraint.prototype.updateCurve = function () {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    };
    CurveConstraintNoConstraint.prototype.locateCurveExtremityUnderConstraint = function (curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.none
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.none) {
            this.updateCurve();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    };
    return CurveConstraintNoConstraint;
}(CurveConstraintStrategy));
exports.CurveConstraintNoConstraint = CurveConstraintNoConstraint;
var CurveConstraintClampedFirstControlPoint = /** @class */ (function (_super) {
    __extends(CurveConstraintClampedFirstControlPoint, _super);
    function CurveConstraintClampedFirstControlPoint(curveConstraints) {
        var _a, _b;
        var _this = _super.call(this, curveConstraints) || this;
        if (_this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            _this._curveShapeSpaceNavigator = _this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            _this._curveShapeSpaceNavigator = undefined;
        }
        _this._firstControlPoint = CurveConstraints_1.ConstraintType.location;
        _this._lastControlPoint = CurveConstraints_1.ConstraintType.none;
        _this.curveConstraints.firstControlPoint = _this._firstControlPoint;
        _this.curveConstraints.lastControlPoint = _this._lastControlPoint;
        if (_this._curveShapeSpaceNavigator !== undefined) {
            _this._optimizedCurve = (_a = _this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            _this._optimizedCurve = _this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        _this._referencePtIndex = _this.shapeNavigableCurve.clampedPoints[0];
        _this.displacementCurrentCurveControlPolygon = (_b = _this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessage();
        return _this;
    }
    Object.defineProperty(CurveConstraintClampedFirstControlPoint.prototype, "firstControlPoint", {
        get: function () {
            return this._firstControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstControlPoint.prototype, "lastControlPoint", {
        get: function () {
            return this._lastControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstControlPoint.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstControlPoint.prototype, "referencePtIndex", {
        set: function (referencePtIndex) {
            this._referencePtIndex = referencePtIndex;
        },
        enumerable: false,
        configurable: true
    });
    CurveConstraintClampedFirstControlPoint.prototype.updateCurve = function () {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    };
    CurveConstraintClampedFirstControlPoint.prototype.relocateCurveAfterOptimization = function () {
        var e_1, _a;
        this.updateCurve();
        var controlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._optimizedCurve.controlPoints);
        if (this._curveShapeSpaceNavigator !== undefined
            && this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            try {
                for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
                    var controlP = controlPoints_1_1.value;
                    controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    };
    CurveConstraintClampedFirstControlPoint.prototype.relocateCurveAfterOptimizationUsingKnotPts = function () {
        var e_2, _a;
        this.updateCurve();
        var knots = this.optimizedCurve.getDistinctKnots();
        var refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        var controlPoints = this._optimizedCurve.controlPoints;
        if (this._curveShapeSpaceNavigator !== undefined) {
            var displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            try {
                for (var controlPoints_2 = __values(controlPoints), controlPoints_2_1 = controlPoints_2.next(); !controlPoints_2_1.done; controlPoints_2_1 = controlPoints_2.next()) {
                    var controlP = controlPoints_2_1.value;
                    controlP.x -= displacement.x;
                    controlP.y -= displacement.y;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (controlPoints_2_1 && !controlPoints_2_1.done && (_a = controlPoints_2.return)) _a.call(controlPoints_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    };
    CurveConstraintClampedFirstControlPoint.prototype.locateCurveExtremityUnderConstraint = function (curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.location
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.none) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    };
    return CurveConstraintClampedFirstControlPoint;
}(CurveConstraintStrategy));
exports.CurveConstraintClampedFirstControlPoint = CurveConstraintClampedFirstControlPoint;
var CurveConstraintClampedLastControlPoint = /** @class */ (function (_super) {
    __extends(CurveConstraintClampedLastControlPoint, _super);
    function CurveConstraintClampedLastControlPoint(curveConstraints) {
        var _a, _b;
        var _this = _super.call(this, curveConstraints) || this;
        if (_this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            _this._curveShapeSpaceNavigator = _this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            _this._curveShapeSpaceNavigator = undefined;
        }
        _this._firstControlPoint = CurveConstraints_1.ConstraintType.none;
        _this._lastControlPoint = CurveConstraints_1.ConstraintType.location;
        _this.curveConstraints.firstControlPoint = _this._firstControlPoint;
        _this.curveConstraints.lastControlPoint = _this._lastControlPoint;
        if (_this._curveShapeSpaceNavigator !== undefined) {
            _this._optimizedCurve = (_a = _this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            _this._optimizedCurve = _this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        _this._referencePtIndex = _this.shapeNavigableCurve.clampedPoints[1];
        _this.displacementCurrentCurveControlPolygon = (_b = _this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessage();
        return _this;
    }
    Object.defineProperty(CurveConstraintClampedLastControlPoint.prototype, "firstControlPoint", {
        get: function () {
            return this._firstControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedLastControlPoint.prototype, "lastControlPoint", {
        get: function () {
            return this._lastControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedLastControlPoint.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedLastControlPoint.prototype, "referencePtIndex", {
        set: function (referencePtIndex) {
            this._referencePtIndex = referencePtIndex;
        },
        enumerable: false,
        configurable: true
    });
    CurveConstraintClampedLastControlPoint.prototype.updateCurve = function () {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    };
    CurveConstraintClampedLastControlPoint.prototype.relocateCurveAfterOptimization = function () {
        var e_3, _a;
        this.updateCurve();
        var controlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._optimizedCurve.controlPoints);
        if (this._curveShapeSpaceNavigator !== undefined &&
            this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            try {
                for (var controlPoints_3 = __values(controlPoints), controlPoints_3_1 = controlPoints_3.next(); !controlPoints_3_1.done; controlPoints_3_1 = controlPoints_3.next()) {
                    var controlP = controlPoints_3_1.value;
                    controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (controlPoints_3_1 && !controlPoints_3_1.done && (_a = controlPoints_3.return)) _a.call(controlPoints_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    };
    CurveConstraintClampedLastControlPoint.prototype.relocateCurveAfterOptimizationUsingKnotPts = function () {
        var e_4, _a;
        this.updateCurve();
        var knots = this.optimizedCurve.getDistinctKnots();
        var refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        var controlPoints = this._optimizedCurve.controlPoints;
        if (this._curveShapeSpaceNavigator !== undefined) {
            var displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            try {
                for (var controlPoints_4 = __values(controlPoints), controlPoints_4_1 = controlPoints_4.next(); !controlPoints_4_1.done; controlPoints_4_1 = controlPoints_4.next()) {
                    var controlP = controlPoints_4_1.value;
                    controlP.x -= displacement.x;
                    controlP.y -= displacement.y;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (controlPoints_4_1 && !controlPoints_4_1.done && (_a = controlPoints_4.return)) _a.call(controlPoints_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    };
    CurveConstraintClampedLastControlPoint.prototype.locateCurveExtremityUnderConstraint = function (curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.none
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.location) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    };
    return CurveConstraintClampedLastControlPoint;
}(CurveConstraintStrategy));
exports.CurveConstraintClampedLastControlPoint = CurveConstraintClampedLastControlPoint;
var CurveConstraintClampedFirstAndLastControlPoint = /** @class */ (function (_super) {
    __extends(CurveConstraintClampedFirstAndLastControlPoint, _super);
    function CurveConstraintClampedFirstAndLastControlPoint(curveConstraints) {
        var _a, _b;
        var _this = _super.call(this, curveConstraints) || this;
        if (_this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            _this._curveShapeSpaceNavigator = _this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            _this._curveShapeSpaceNavigator = undefined;
        }
        _this._firstControlPoint = CurveConstraints_1.ConstraintType.location;
        _this._lastControlPoint = CurveConstraints_1.ConstraintType.location;
        _this.curveConstraints.firstControlPoint = _this._firstControlPoint;
        _this.curveConstraints.lastControlPoint = _this._lastControlPoint;
        if (_this._curveShapeSpaceNavigator !== undefined) {
            _this._optimizedCurve = (_a = _this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            _this._optimizedCurve = _this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        _this._referencePtIndex = _this.shapeNavigableCurve.clampedPoints[0];
        _this._currentCurve = _this.shapeNavigableCurve.curveCategory.curveModel.spline;
        _this.displacementCurrentCurveControlPolygon = (_b = _this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessage();
        return _this;
    }
    Object.defineProperty(CurveConstraintClampedFirstAndLastControlPoint.prototype, "firstControlPoint", {
        get: function () {
            return this._firstControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstAndLastControlPoint.prototype, "lastControlPoint", {
        get: function () {
            return this._lastControlPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstAndLastControlPoint.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveConstraintClampedFirstAndLastControlPoint.prototype, "referencePtIndex", {
        set: function (referencePtIndex) {
            this._referencePtIndex = referencePtIndex;
        },
        enumerable: false,
        configurable: true
    });
    CurveConstraintClampedFirstAndLastControlPoint.prototype.updateCurve = function () {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    };
    CurveConstraintClampedFirstAndLastControlPoint.prototype.setCurrentCurve = function (currentCurve) {
        this.currentCurve = currentCurve.clone();
    };
    CurveConstraintClampedFirstAndLastControlPoint.prototype.relocateCurveAfterOptimization = function () {
        var e_5, _a;
        if (this._curveShapeSpaceNavigator !== undefined && this.displacementCurrentCurveControlPolygon !== undefined) {
            var controlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this.optimizedCurve.controlPoints);
            var nbControlPts = this.displacementCurrentCurveControlPolygon.length;
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            if (Math.abs(this.displacementCurrentCurveControlPolygon[nbControlPts - 1].substract(this.displacementCurrentCurveControlPolygon[0]).norm()) < exports.TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.displacementCurrentCurveControlPolygon[controlPoints.length - 1] = this.displacementCurrentCurveControlPolygon[0];
                try {
                    for (var controlPoints_5 = __values(controlPoints), controlPoints_5_1 = controlPoints_5.next(); !controlPoints_5_1.done; controlPoints_5_1 = controlPoints_5.next()) {
                        var controlP = controlPoints_5_1.value;
                        controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                        controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (controlPoints_5_1 && !controlPoints_5_1.done && (_a = controlPoints_5.return)) _a.call(controlPoints_5);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                this._optimizedCurve.controlPoints = controlPoints;
            }
            else {
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                this.optimizedCurve = this.currentCurve.clone();
                this._constraintsNotSatisfied = true;
            }
        }
        return this.optimizedCurve;
    };
    CurveConstraintClampedFirstAndLastControlPoint.prototype.relocateCurveAfterOptimizationUsingKnotPts = function () {
        this.updateCurve();
        var knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        var refPoint1 = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        var refPoint2 = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        var knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        var refDistance = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]).distance(this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]));
        var distance = refPoint2.distance(refPoint1);
        if (this._curveShapeSpaceNavigator !== undefined) {
            // if(Math.abs(displacement1.substract(displacement2).norm()) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
            if (Math.abs(distance - refDistance) < exports.TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.applyRigidBodyDisplacement();
            }
            else {
                // Scale the optimized curve to meet the distance constraint
                // const scaleFactor = refDistance / distance;
                // const scaledCurve = this._optimizedCurve.scale(scaleFactor);
                // this._optimizedCurve = scaledCurve.clone();
                // this.applyRigidBodyDisplacement();
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                var valid = this.curveConstraints.slideConstraintAlongCurve();
                if (valid) {
                    this.applyRigidBodyDisplacement();
                }
                else {
                    this._constraintsNotSatisfied = true;
                    this._optimizedCurve = this._currentCurve.clone();
                }
            }
        }
        return this.optimizedCurve;
    };
    CurveConstraintClampedFirstAndLastControlPoint.prototype.applyRigidBodyDisplacement = function () {
        var e_6, _a;
        var knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        var refPt1currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]);
        var refPt2currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        var pt2Pt1currentCurve = refPt2currentCurve.substract(refPt1currentCurve);
        var knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        if (knotsOptCurve[this._referencePtIndex] > knotsOptCurve[knotsOptCurve.length - 1] || knotsOptCurve[this._referencePtIndex] < knotsOptCurve[0]) {
            console.log("Clamped points out of range");
        }
        var refPt1optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        var refPt2optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        var pt2Pt1optCurve = refPt2optCurve.substract(refPt1optCurve);
        var displacement = refPt1optCurve.substract(refPt1currentCurve);
        // use dot product to compute the angle because angle is very small and crossProduct can be less accurate
        var argument = pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm());
        var angle = Math.acos(pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if (isNaN(angle)) {
            // Redefine the angle when the argument of the acos is greater than one, due to roundoff errors in the evaluation
            // of the argument. The argument being close an angle of 0, using asin does not lead to roundoff errors near one.
            console.log('applyRigidBodyDisplacement. Angle computed through cosine is not applicable argument = ' + argument);
            angle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        }
        var signAngle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if (signAngle < 0.0)
            angle = -angle;
        var rotationMatrix = new SquareMatrix_1.SquareMatrix(2, [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle)]);
        var controlPointsOptCrv = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._optimizedCurve.controlPoints);
        var relocatedCtrlPts = [];
        try {
            for (var controlPointsOptCrv_1 = __values(controlPointsOptCrv), controlPointsOptCrv_1_1 = controlPointsOptCrv_1.next(); !controlPointsOptCrv_1_1.done; controlPointsOptCrv_1_1 = controlPointsOptCrv_1.next()) {
                var controlPt = controlPointsOptCrv_1_1.value;
                relocatedCtrlPts.push(controlPt.substract(displacement));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (controlPointsOptCrv_1_1 && !controlPointsOptCrv_1_1.done && (_a = controlPointsOptCrv_1.return)) _a.call(controlPointsOptCrv_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        for (var i = 0; i < controlPointsOptCrv.length; i++) {
            var vertexLoc = controlPointsOptCrv[i].substract(refPt1optCurve);
            var vertexRot = Vector2d_1.toVector2d(rotationMatrix.multiplyByVector(vertexLoc.toArray()));
            relocatedCtrlPts[i] = vertexRot.add(refPt1optCurve).substract(displacement);
        }
        this._optimizedCurve.controlPoints = relocatedCtrlPts;
    };
    CurveConstraintClampedFirstAndLastControlPoint.prototype.locateCurveExtremityUnderConstraint = function (curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.location
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.location) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    };
    return CurveConstraintClampedFirstAndLastControlPoint;
}(CurveConstraintStrategy));
exports.CurveConstraintClampedFirstAndLastControlPoint = CurveConstraintClampedFirstAndLastControlPoint;
