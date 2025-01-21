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
exports.deepCopyEventsEuclideanLocations = exports.deepCopyEventsParametricLocations = exports.CurveDifferentialEventsLocations = void 0;
var CurveDifferentialEventsLocations = /** @class */ (function () {
    function CurveDifferentialEventsLocations() {
        this._inflectionParametricLocations = [];
        this._curvatureNumeratorExtremaEstimators = [];
        this._curvatureExtremaParametricLocations = [];
        this._curvatureDerivativeNumeratorExtremaEstimators = [];
        this._inflectionLocationsEuclideanSpace = [];
        this._curvatureExtremaLocationsEuclideanSpace = [];
        this._transientCurvatureExtremaLocationsEuclideanSpace = [];
    }
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "inflectionParametricLocations", {
        get: function () {
            return this._inflectionParametricLocations;
        },
        set: function (parametricLocations) {
            this._inflectionParametricLocations = parametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "curvatureNumeratorExtremaEstimators", {
        get: function () {
            return this._curvatureNumeratorExtremaEstimators;
        },
        set: function (parametricLocations) {
            this._curvatureNumeratorExtremaEstimators = parametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "curvatureExtremaParametricLocations", {
        get: function () {
            return this._curvatureExtremaParametricLocations;
        },
        set: function (parametricLocations) {
            this._curvatureExtremaParametricLocations = parametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "curvatureDerivativeNumeratorExtremaEstimators", {
        get: function () {
            return this._curvatureDerivativeNumeratorExtremaEstimators;
        },
        set: function (parametricLocations) {
            this._curvatureDerivativeNumeratorExtremaEstimators = parametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "inflectionLocationsEuclideanSpace", {
        get: function () {
            return this._inflectionLocationsEuclideanSpace;
        },
        set: function (euclideanLocations) {
            this._inflectionLocationsEuclideanSpace = euclideanLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "curvatureExtremaLocationsEuclideanSpace", {
        get: function () {
            return this._curvatureExtremaLocationsEuclideanSpace;
        },
        set: function (euclideanLocations) {
            this._curvatureExtremaLocationsEuclideanSpace = euclideanLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDifferentialEventsLocations.prototype, "transientCurvatureExtremaLocationsEuclideanSpace", {
        get: function () {
            return this._transientCurvatureExtremaLocationsEuclideanSpace;
        },
        set: function (euclideanLocations) {
            this._transientCurvatureExtremaLocationsEuclideanSpace = euclideanLocations;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return a deep copy of this set of locations
     */
    CurveDifferentialEventsLocations.prototype.clone = function () {
        var crvDiffEventsLocations = new CurveDifferentialEventsLocations();
        crvDiffEventsLocations.inflectionParametricLocations = deepCopyEventsParametricLocations(this._inflectionParametricLocations);
        crvDiffEventsLocations.curvatureNumeratorExtremaEstimators = deepCopyEventsParametricLocations(this._curvatureNumeratorExtremaEstimators);
        crvDiffEventsLocations.curvatureExtremaParametricLocations = deepCopyEventsParametricLocations(this._curvatureExtremaParametricLocations);
        crvDiffEventsLocations.curvatureDerivativeNumeratorExtremaEstimators = deepCopyEventsParametricLocations(this._curvatureDerivativeNumeratorExtremaEstimators);
        crvDiffEventsLocations.inflectionLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._inflectionLocationsEuclideanSpace);
        crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._curvatureExtremaLocationsEuclideanSpace);
        crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._transientCurvatureExtremaLocationsEuclideanSpace);
        return crvDiffEventsLocations;
    };
    return CurveDifferentialEventsLocations;
}());
exports.CurveDifferentialEventsLocations = CurveDifferentialEventsLocations;
function deepCopyEventsParametricLocations(parametericLocations) {
    var e_1, _a;
    var result = [];
    try {
        for (var parametericLocations_1 = __values(parametericLocations), parametericLocations_1_1 = parametericLocations_1.next(); !parametericLocations_1_1.done; parametericLocations_1_1 = parametericLocations_1.next()) {
            var loc = parametericLocations_1_1.value;
            var newloc = loc;
            result.push(newloc);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (parametericLocations_1_1 && !parametericLocations_1_1.done && (_a = parametericLocations_1.return)) _a.call(parametericLocations_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.deepCopyEventsParametricLocations = deepCopyEventsParametricLocations;
function deepCopyEventsEuclideanLocations(euclideanLocations) {
    var e_2, _a;
    var result = [];
    try {
        for (var euclideanLocations_1 = __values(euclideanLocations), euclideanLocations_1_1 = euclideanLocations_1.next(); !euclideanLocations_1_1.done; euclideanLocations_1_1 = euclideanLocations_1.next()) {
            var loc = euclideanLocations_1_1.value;
            result.push(loc.clone());
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (euclideanLocations_1_1 && !euclideanLocations_1_1.done && (_a = euclideanLocations_1.return)) _a.call(euclideanLocations_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
exports.deepCopyEventsEuclideanLocations = deepCopyEventsEuclideanLocations;
