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
exports.extractAdjacentOscillatingPolygons = exports.OscillatingPolygonWithVerticesR1 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var AbstractPolygonWithVerticesR1_1 = require("./AbstractPolygonWithVerticesR1");
var AdjacentOscillatingPolygons_1 = require("./AdjacentOscillatingPolygons");
var VertexR1_1 = require("./VertexR1");
var OscillatingPolygonWithVerticesR1 = /** @class */ (function (_super) {
    __extends(OscillatingPolygonWithVerticesR1, _super);
    function OscillatingPolygonWithVerticesR1(polygon) {
        var _this = _super.call(this) || this;
        _this._vertices = [];
        var firstIndex = polygon.getFirstIndex();
        var upperBound = polygon.getFirstIndex() + polygon.length();
        for (var vertex = firstIndex; vertex < upperBound; vertex++) {
            _this._vertices.push(new VertexR1_1.VertexR1(polygon.getVertexAt(vertex).index, polygon.getVertexAt(vertex).value));
        }
        _this._closestVertexAtBeginning = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        _this._closestVertexAtEnd = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        _this.checkConsistency();
        _this.extractControlPtsClosestToZeroAtExtremities();
        return _this;
    }
    Object.defineProperty(OscillatingPolygonWithVerticesR1.prototype, "closestVertexAtBeginning", {
        get: function () {
            return this._closestVertexAtBeginning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OscillatingPolygonWithVerticesR1.prototype, "closestVertexAtEnd", {
        get: function () {
            return this._closestVertexAtEnd;
        },
        enumerable: false,
        configurable: true
    });
    OscillatingPolygonWithVerticesR1.prototype.checkConsistency = function () {
        var e_1, _a;
        var code = 0;
        if (this._vertices.length > 1) {
            var previousIndex = this._vertices[0].index;
            var previousValue = this._vertices[0].value;
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
                    else if (vertex.value * previousValue > 0) {
                        var error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Vertices values are not oscillating.");
                        error.logMessage();
                        code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                    }
                    previousIndex = vertex.index;
                    previousValue = vertex.value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (vertices_1_1 && !vertices_1_1.done && (_a = vertices_1.return)) _a.call(vertices_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            var error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Cannot process an oscillating polygon with less than two vertices.");
            error.logMessage();
            code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return code;
    };
    OscillatingPolygonWithVerticesR1.prototype.extractControlPtClosestToZeroAtExtremityEvenNbEdges = function (index) {
        if (index !== this.getFirstIndex() && index !== this.getVertexAt(this.getFirstIndex() + this.length() - 1).index) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extractControlPtClosestToZeroAtExtremityEvenNbEdges", "Current vertex index is not at an extremity of the polygon.");
            error.logMessage();
            return new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        }
        var vertex1 = this.getVertexAt(index);
        var vertex2;
        if (index === this.getFirstIndex()) {
            vertex2 = this.getVertexAt(index + 1);
        }
        else {
            vertex2 = this.getVertexAt(index - 1);
        }
        if (Math.pow(vertex1.value, 2) > Math.pow(vertex2.value, 2)) {
            return vertex2;
        }
        else {
            return vertex1;
        }
    };
    OscillatingPolygonWithVerticesR1.prototype.extractControlPtClosestToZeroAtExtremityOddNbEdges = function () {
        var firstIndex = this.getFirstIndex();
        var vertex1 = this.getVertexAt(firstIndex);
        var lastIndex = firstIndex + this.length() - 1;
        var vertex2 = this.getVertexAt(lastIndex);
        if (Math.pow(vertex1.value, 2) > Math.pow(vertex2.value, 2)) {
            this._closestVertexAtEnd = vertex2;
        }
        else {
            this._closestVertexAtBeginning = vertex1;
        }
    };
    OscillatingPolygonWithVerticesR1.prototype.extractControlPtsClosestToZeroAtExtremities = function () {
        var firstIndex = this.getFirstIndex();
        var lastIndex = firstIndex + this.length() - 1;
        if ((this.length() - 1) % 2 === 0) {
            this._closestVertexAtBeginning = this.extractControlPtClosestToZeroAtExtremityEvenNbEdges(firstIndex);
            this._closestVertexAtEnd = this.extractControlPtClosestToZeroAtExtremityEvenNbEdges(lastIndex);
        }
        else {
            this.extractControlPtClosestToZeroAtExtremityOddNbEdges();
        }
    };
    return OscillatingPolygonWithVerticesR1;
}(AbstractPolygonWithVerticesR1_1.AbstractPolygonWithVerticesR1));
exports.OscillatingPolygonWithVerticesR1 = OscillatingPolygonWithVerticesR1;
function extractAdjacentOscillatingPolygons(oscillatingPolygons) {
    var adjacentPolygons = [];
    for (var i = 0; i < oscillatingPolygons.length; i++) {
        var polygons = [];
        if ((i + 1) < oscillatingPolygons.length) {
            if (oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index) {
                polygons.push(oscillatingPolygons[i]);
                polygons.push(oscillatingPolygons[i + 1]);
                i += 1;
                if ((i + 1) < oscillatingPolygons.length) {
                    while (oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index) {
                        polygons.push(oscillatingPolygons[i + 1]);
                        i += 1;
                        if ((i + 1) === oscillatingPolygons.length) {
                            i += 1;
                            break;
                        }
                    }
                }
            }
            else {
                polygons.push(oscillatingPolygons[i]);
            }
        }
        else {
            polygons.push(oscillatingPolygons[i]);
        }
        adjacentPolygons.push(new AdjacentOscillatingPolygons_1.AdjacentOscillatingPolygons(polygons));
    }
    return adjacentPolygons;
}
exports.extractAdjacentOscillatingPolygons = extractAdjacentOscillatingPolygons;
