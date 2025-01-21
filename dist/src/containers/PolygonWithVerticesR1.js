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
exports.extractOscillatingPolygons = exports.PolygonWithVerticesR1 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var VertexR1_1 = require("./VertexR1");
var OscillatingPolygonWithVerticesR1_1 = require("./OscillatingPolygonWithVerticesR1");
var AbstractPolygonWithVerticesR1_1 = require("./AbstractPolygonWithVerticesR1");
var PolygonWithVerticesR1 = /** @class */ (function (_super) {
    __extends(PolygonWithVerticesR1, _super);
    function PolygonWithVerticesR1(points, startIndex) {
        var e_1, _a;
        var _this = _super.call(this) || this;
        _this._vertices = [];
        _this._localPositiveMinima = [];
        _this._localNegativeMaxima = [];
        var index;
        if (startIndex !== undefined) {
            index = startIndex;
            if (startIndex < 0) {
                var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Cannot create a polygon with vertices with a start index negative");
                error.logMessage();
            }
        }
        else {
            index = 0;
        }
        try {
            for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var point = points_1_1.value;
                _this._vertices.push(new VertexR1_1.VertexR1(index, point));
                index++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
    }
    Object.defineProperty(PolygonWithVerticesR1.prototype, "localPositiveMinima", {
        get: function () {
            return this._localPositiveMinima.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonWithVerticesR1.prototype, "localNegativeMaxima", {
        get: function () {
            return this._localNegativeMaxima.slice();
        },
        enumerable: false,
        configurable: true
    });
    PolygonWithVerticesR1.prototype.checkConsistency = function () {
        var e_2, _a;
        var code = 0;
        if (this._vertices.length > 1) {
            var previousIndex = this._vertices[0].index;
            var vertices = this._vertices.slice(1);
            try {
                for (var vertices_1 = __values(vertices), vertices_1_1 = vertices_1.next(); !vertices_1_1.done; vertices_1_1 = vertices_1.next()) {
                    var vertex = vertices_1_1.value;
                    if ((vertex.index - previousIndex) !== 1) {
                        var error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Inconsistent sequence of indices values.");
                        error.logMessage();
                        code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                        return code;
                    }
                    previousIndex = vertex.index;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (vertices_1_1 && !vertices_1_1.done && (_a = vertices_1.return)) _a.call(vertices_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return code;
    };
    PolygonWithVerticesR1.prototype.clear = function () {
        this._vertices = [];
        this._localPositiveMinima = [];
        this._localNegativeMaxima = [];
    };
    PolygonWithVerticesR1.prototype.deepCopy = function () {
        var firstIndex = this.getFirstIndex();
        var polygon;
        if (firstIndex !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            polygon = new PolygonWithVerticesR1(this.getValues(), this.getFirstIndex());
            polygon._localNegativeMaxima = this._localNegativeMaxima.slice();
            polygon._localPositiveMinima = this._localPositiveMinima.slice();
            this.checkConsistency();
        }
        else {
            polygon = new PolygonWithVerticesR1([]);
            polygon._vertices.push(new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0));
        }
        return polygon;
    };
    PolygonWithVerticesR1.prototype.sortLocalExtrema = function (localExtrema) {
        localExtrema.sort(function (a, b) {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
        });
        var sortedExtrema = localExtrema.slice();
        return sortedExtrema;
    };
    PolygonWithVerticesR1.prototype.extractLocalPositiveMinima = function () {
        this._localPositiveMinima = [];
        for (var i = 0; i < this._vertices.length - 2; i += 1) {
            if (MathVectorBasicOperations_1.sign(this._vertices[i].value) === 1 && MathVectorBasicOperations_1.sign(this._vertices[i + 1].value) === 1 && MathVectorBasicOperations_1.sign(this._vertices[i + 2].value) === 1) {
                if (this._vertices[i].value > this._vertices[i + 1].value && this._vertices[i + 1].value < this._vertices[i + 2].value) {
                    this._localPositiveMinima.push(new VertexR1_1.VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    };
    PolygonWithVerticesR1.prototype.extractLocalNegativeMaxima = function () {
        this._localNegativeMaxima = [];
        for (var i = 0; i < this._vertices.length - 2; i += 1) {
            if (MathVectorBasicOperations_1.sign(this._vertices[i].value) === -1 && MathVectorBasicOperations_1.sign(this._vertices[i + 1].value) === -1 && MathVectorBasicOperations_1.sign(this._vertices[i + 2].value) === -1) {
                if (this._vertices[i].value < this._vertices[i + 1].value && this._vertices[i + 1].value > this._vertices[i + 2].value) {
                    this._localNegativeMaxima.push(new VertexR1_1.VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    };
    PolygonWithVerticesR1.prototype.extractClosestLocalExtremmumToAxis = function () {
        var localExtremum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        var smallestPositiveMinimum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        var largestNegativeMaximum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        this.extractLocalPositiveMinima();
        if (this._localPositiveMinima.length > 0) {
            smallestPositiveMinimum = this.sortLocalExtrema(this._localPositiveMinima)[0];
        }
        this.extractLocalNegativeMaxima();
        if (this._localNegativeMaxima.length > 0) {
            largestNegativeMaximum = this.sortLocalExtrema(this._localNegativeMaxima)[this._localNegativeMaxima.length - 1];
        }
        if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && Math.abs(smallestPositiveMinimum.value) > Math.abs(largestNegativeMaximum.value)) {
            return largestNegativeMaximum;
        }
        else if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        }
        else if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        }
        else if (largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return largestNegativeMaximum;
        }
        else
            return localExtremum;
    };
    PolygonWithVerticesR1.prototype.extractOscillatingPolygons = function () {
        var result = [];
        if (this._vertices.length > 1) {
            var i = 1;
            while (i < this._vertices.length) {
                if (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                    var firstEdge = [this._vertices[i - 1].value, this._vertices[i].value];
                    var oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                    i += 1;
                    if (i < (this._vertices.length - 1)) {
                        while (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                            oscillatingPolygon.extend(this._vertices[i]);
                            i += 1;
                            if (i === this._vertices.length)
                                break;
                        }
                    }
                    result.push(new OscillatingPolygonWithVerticesR1_1.OscillatingPolygonWithVerticesR1(oscillatingPolygon));
                }
                i += 1;
            }
        }
        return result;
    };
    return PolygonWithVerticesR1;
}(AbstractPolygonWithVerticesR1_1.AbstractPolygonWithVerticesR1));
exports.PolygonWithVerticesR1 = PolygonWithVerticesR1;
function extractOscillatingPolygons(controlPoints) {
    var result = [];
    if (controlPoints.length > 1) {
        var i = 1;
        while (i < controlPoints.length) {
            if (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                var firstEdge = [controlPoints[i - 1], controlPoints[i]];
                var oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                i += 1;
                if (i < (controlPoints.length - 1)) {
                    while (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                        oscillatingPolygon.extendWithNewValue(controlPoints[i]);
                        i += 1;
                        if (i === controlPoints.length)
                            break;
                    }
                }
                result.push(new OscillatingPolygonWithVerticesR1_1.OscillatingPolygonWithVerticesR1(oscillatingPolygon));
            }
            i += 1;
        }
    }
    return result;
}
exports.extractOscillatingPolygons = extractOscillatingPolygons;
