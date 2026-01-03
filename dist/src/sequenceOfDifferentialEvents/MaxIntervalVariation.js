"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxIntervalVariation = void 0;
/* named constants */
const NeighboringEvents_1 = require("./NeighboringEvents");
class MaxIntervalVariation {
    constructor(intervalIndex, value) {
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
    get index() {
        return this._index;
    }
    get value() {
        return this._value;
    }
    set index(intervalIndex) {
        this._index = intervalIndex;
        return;
    }
    set value(value) {
        this._value = value;
        return;
    }
}
exports.MaxIntervalVariation = MaxIntervalVariation;
