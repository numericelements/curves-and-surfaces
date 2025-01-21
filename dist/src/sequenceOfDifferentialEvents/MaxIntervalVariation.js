"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxIntervalVariation = void 0;
/* named constants */
var NeighboringEvents_1 = require("./NeighboringEvents");
var MaxIntervalVariation = /** @class */ (function () {
    function MaxIntervalVariation(intervalIndex, value) {
        if (intervalIndex !== undefined) {
            this._index = intervalIndex;
        }
        else {
            this._index = NeighboringEvents_1.INITIAL_INTERV_INDEX;
        }
        if (value !== undefined) {
            this._value = value;
        }
        else {
            this._value = 0.0;
        }
    }
    Object.defineProperty(MaxIntervalVariation.prototype, "index", {
        get: function () {
            return this._index;
        },
        set: function (intervalIndex) {
            this._index = intervalIndex;
            return;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaxIntervalVariation.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            return;
        },
        enumerable: false,
        configurable: true
    });
    return MaxIntervalVariation;
}());
exports.MaxIntervalVariation = MaxIntervalVariation;
