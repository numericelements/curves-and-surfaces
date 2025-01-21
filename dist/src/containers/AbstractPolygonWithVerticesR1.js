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
exports.AbstractPolygonWithVerticesR1 = void 0;
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var VertexR1_1 = require("./VertexR1");
var AbstractPolygonWithVerticesR1 = /** @class */ (function () {
    function AbstractPolygonWithVerticesR1() {
    }
    Object.defineProperty(AbstractPolygonWithVerticesR1.prototype, "vertices", {
        get: function () {
            return this._vertices.slice();
        },
        enumerable: false,
        configurable: true
    });
    AbstractPolygonWithVerticesR1.prototype.length = function () {
        return this._vertices.length;
    };
    AbstractPolygonWithVerticesR1.prototype.getFirstIndex = function () {
        if (this._vertices.length > 0) {
            return this._vertices[0].index;
        }
        else {
            return ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
    };
    AbstractPolygonWithVerticesR1.prototype.getVertexAt = function (index) {
        var e_1, _a;
        var result = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        try {
            for (var _b = __values(this._vertices), _c = _b.next(); !_c.done; _c = _b.next()) {
                var vertex = _c.value;
                if (vertex.index === index)
                    result = new VertexR1_1.VertexR1(vertex.index, vertex.value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    AbstractPolygonWithVerticesR1.prototype.getValues = function () {
        var e_2, _a;
        var result = [];
        try {
            for (var _b = __values(this._vertices), _c = _b.next(); !_c.done; _c = _b.next()) {
                var vertex = _c.value;
                result.push(vertex.value);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    };
    AbstractPolygonWithVerticesR1.prototype.extend = function (vertex) {
        this._vertices.push(vertex);
        this.checkConsistency();
    };
    AbstractPolygonWithVerticesR1.prototype.extendWithNewValue = function (value) {
        var newIndex = this.getFirstIndex() + this._vertices.length;
        var newVertex = new VertexR1_1.VertexR1(newIndex, value);
        this._vertices.push(newVertex);
        this.checkConsistency();
    };
    return AbstractPolygonWithVerticesR1;
}());
exports.AbstractPolygonWithVerticesR1 = AbstractPolygonWithVerticesR1;
