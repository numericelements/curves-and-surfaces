"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexR1 = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
class VertexR1 {
    constructor(index, value) {
        this._index = index;
        this._value = value;
    }
    get index() {
        return this._index;
    }
    get value() {
        return this._value;
    }
    set index(index) {
        this._index = index;
    }
    set value(value) {
        this._value = value;
    }
    checkIndex() {
        let code = 0;
        if (this._index < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "checkIndex", "Inconsistent vertex index");
            warning.logMessage();
            code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return code;
    }
}
exports.VertexR1 = VertexR1;
