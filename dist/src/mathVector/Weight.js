"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weight = void 0;
const Weight_1 = require("../ErrorMessages/Weight");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Weight_2 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
class Weight {
    constructor(weight, strictlyPositive = true) {
        this._type = WeightTypeTags_1.WEIGHT;
        this._strictlyPositive = strictlyPositive;
        if (weight !== undefined && this._strictlyPositive) {
            this.assessmentInputWeightValueStrictlyPositive(weight);
            this._value = weight;
        }
        else if (weight !== undefined && !this._strictlyPositive) {
            this.assessmentInputWeightValue(weight);
            this._value = weight;
        }
        else {
            this._value = Weight_2.DEFAULT_WEIGHT_VALUE;
        }
    }
    get value() {
        return this._value;
    }
    get strictlyPositive() {
        return this._strictlyPositive;
    }
    get type() {
        return this._type;
    }
    clone() {
        return new Weight(this._value, this._strictlyPositive);
    }
    toString() {
        return WeightTypeTags_1.WEIGHT + `(value: ${this._value}, strictlyPositive: ${this._strictlyPositive})`;
    }
    assessmentInputWeightValueStrictlyPositive(weight) {
        if (weight <= 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
            error.addMessage(Weight_1.EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    assessmentInputWeightValue(weight) {
        if (weight < 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
            error.addMessage(Weight_1.EM_WEIGHT_VALUE_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.Weight = Weight;
