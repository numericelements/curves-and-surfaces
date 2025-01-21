"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexR1 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var VertexR1 = /** @class */ (function () {
    function VertexR1(index, value) {
        this._index = index;
        this._value = value;
    }
    Object.defineProperty(VertexR1.prototype, "index", {
        get: function () {
            return this._index;
        },
        set: function (index) {
            this._index = index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VertexR1.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: false,
        configurable: true
    });
    VertexR1.prototype.checkIndex = function () {
        var code = 0;
        if (this._index < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "checkIndex", "Inconsistent vertex index");
            warning.logMessage();
            code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return code;
    };
    return VertexR1;
}());
exports.VertexR1 = VertexR1;
