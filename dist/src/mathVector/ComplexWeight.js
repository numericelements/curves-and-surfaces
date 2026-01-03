"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexWeight = void 0;
const ComplexWeight_1 = require("../ErrorMessages/ComplexWeight");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Weight_1 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const Weight_2 = require("./Weight");
class ComplexWeight {
    constructor(real, imaginary) {
        this._type = WeightTypeTags_1.COMPLEXWEIGHT;
        if (real === undefined) {
            this._real = new Weight_2.Weight();
        }
        else {
            this._real = real;
        }
        if (imaginary === undefined) {
            if (this._real.strictlyPositive) {
                this._imaginary = new Weight_2.Weight();
            }
            else
                this._imaginary = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
        }
        else {
            this.assessmentInputWeightStrictlyPositiveStatus(this._real, imaginary);
            this._imaginary = imaginary;
        }
    }
    get real() {
        return this._real;
    }
    get imaginary() {
        return this._imaginary;
    }
    get type() {
        return this._type;
    }
    toString() {
        return WeightTypeTags_1.COMPLEXWEIGHT + `(real: ${this._real.toString()}, imaginary: ${this._imaginary.toString()})`;
    }
    clone() {
        return new ComplexWeight(this._real.clone(), this._imaginary.clone());
    }
    assessmentInputWeightStrictlyPositiveStatus(real, imaginary) {
        if (real.strictlyPositive !== imaginary.strictlyPositive) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
            error.addMessage(ComplexWeight_1.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.ComplexWeight = ComplexWeight;
