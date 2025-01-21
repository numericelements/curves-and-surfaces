"use strict";
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
exports.ShapeNavigableCurve = exports.MAX_CLAMPED_POINTS = exports.NO_CONSTRAINT = void 0;
var CurveCategory_1 = require("./CurveCategory");
var CurveConstraints_1 = require("../curveShapeSpaceNavigation/CurveConstraints");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
exports.NO_CONSTRAINT = -1;
exports.MAX_CLAMPED_POINTS = 2;
var ShapeNavigableCurve = /** @class */ (function () {
    function ShapeNavigableCurve() {
        this._clampedPoints = [];
        this._clampedPointsPreviousState = [];
        this.observers = [];
        this._curveShapeSpaceNavigator = undefined;
        // Initializes controlOfCurveClamping in accordance with the navigation mode:
        //      mode 0: controlOfCurveClamping =  false,
        //      mode 1, mode 2: controlOfCurveClamping = true
        this._controlOfCurveClamping = false;
        this._curveCategory = new CurveCategory_1.OpenPlanarCurve(this);
        this._curveCategory.curveModelChange = false;
        this._curveConstraints = new CurveConstraints_1.CurveConstraints(this);
        this._crvConstraintAtExtremitiesStgy = this._curveConstraints.curveConstraintStrategy;
        // No clamped point set to be consistent with the navigation mode at initialization
        this._clampedPoints.push(exports.NO_CONSTRAINT);
        this._clampedPoints.push(exports.NO_CONSTRAINT);
        this._clampedPointsPreviousState = this._clampedPoints;
    }
    ShapeNavigableCurve.prototype.changeCurveCategory = function (category) {
        this._curveCategory = category;
    };
    ShapeNavigableCurve.prototype.changeCurveConstraintStrategy = function (state) {
        this._crvConstraintAtExtremitiesStgy = state;
    };
    Object.defineProperty(ShapeNavigableCurve.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "curveCategory", {
        get: function () {
            return this._curveCategory;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "crvConstraintAtExtremitiesStgy", {
        get: function () {
            return this._crvConstraintAtExtremitiesStgy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "controlOfCurveClamping", {
        get: function () {
            return this._controlOfCurveClamping;
        },
        set: function (controlOfCurveClamping) {
            this._controlOfCurveClamping = controlOfCurveClamping;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "clampedPoints", {
        get: function () {
            return this._clampedPoints;
        },
        set: function (clampedPoints) {
            this._clampedPoints = clampedPoints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "clampedPointsPreviousState", {
        get: function () {
            return this._clampedPointsPreviousState;
        },
        set: function (clampedPointsPreviousState) {
            this._clampedPointsPreviousState = clampedPointsPreviousState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeNavigableCurve.prototype, "curveConstraints", {
        get: function () {
            return this._curveConstraints;
        },
        enumerable: false,
        configurable: true
    });
    ShapeNavigableCurve.prototype.inputSelectCurveCategory = function (crvCategoryID) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectCurveCategoryProcess", crvCategoryID.toString());
        warning.logMessage();
        switch (crvCategoryID) {
            case 0: {
                this._curveCategory.setNavigableCurveWithOpenPlanarCurve();
                break;
            }
            case 1: {
                this._curveCategory.setNavigableCurveWithClosedPlanarCurve();
                break;
            }
            default: {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectCurveCategoryProcess", "no available curve category.");
                error.logMessage();
                break;
            }
        }
        this._curveCategory.curveModelChange = false;
    };
    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    ShapeNavigableCurve.prototype.toggleCurveClamping = function () {
        if (this._curveShapeSpaceNavigator == undefined
            || this._curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
            || this._curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toggleCurveClamping", "Cannot handle clamping because no curve shape space navigator is available or no shape constraint is active.");
            error.logMessage();
        }
        else {
            this._controlOfCurveClamping = !this._controlOfCurveClamping;
            console.log("control of curve clamping: " + this._controlOfCurveClamping);
            if (this._controlOfCurveClamping) {
                this._clampedPoints = this._clampedPointsPreviousState;
            }
            else {
                // Store the previous constraint state for restoration. Other actions take place when updating objects through observers
                this._clampedPointsPreviousState = this._clampedPoints;
            }
            this.notifyObservers();
        }
    };
    ShapeNavigableCurve.prototype.registerObserver = function (observer) {
        this.observers.push(observer);
        console.log("ShapeNavigableCurve: registerObs: " + observer.constructor.name);
    };
    ShapeNavigableCurve.prototype.removeObserver = function (observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    };
    ShapeNavigableCurve.prototype.notifyObservers = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.observers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var observer = _c.value;
                console.log("ShapeNavigableCurve: update: " + observer.constructor.name);
                observer.update(this._curveCategory.curveModel);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ShapeNavigableCurve.prototype.updateClampedPointsAfterKnotInsertion = function (knotParametricLocation) {
        var knots = this._curveCategory.curveModel.spline.getDistinctKnots();
        var i = 0;
        while (i < knots.length && knots[i] < knotParametricLocation) {
            i++;
        }
        var knotIndex = i;
        if (this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] === exports.NO_CONSTRAINT) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "updateClampedPointsAfterKnotInsertion", "No need to update clamped point indices.");
            warning.logMessage();
        }
        else if ((this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] !== exports.NO_CONSTRAINT)
            || (this._clampedPoints[0] !== exports.NO_CONSTRAINT && this._clampedPoints[1] === exports.NO_CONSTRAINT)) {
            if (this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] >= knotIndex)
                this._clampedPoints[1] += 1;
            if (this._clampedPoints[1] === exports.NO_CONSTRAINT && this._clampedPoints[0] >= knotIndex)
                this._clampedPoints[0] += 1;
        }
        else {
            if (this._clampedPoints[0] >= knotIndex)
                this._clampedPoints[0] += 1;
            if (this._clampedPoints[1] >= knotIndex)
                this._clampedPoints[1] += 1;
        }
    };
    return ShapeNavigableCurve;
}());
exports.ShapeNavigableCurve = ShapeNavigableCurve;
