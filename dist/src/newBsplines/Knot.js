"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knot = void 0;
const Knots_1 = require("../ErrorMessages/Knots");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Knots_2 = require("../namedConstants/Knots");
/**
 * Represents a knot in a B-spline knot sequence with its location (abscissa) along the axis of reals and its multiplicity.
 *
 * @description
 * The Knot class encapsulates the concept of a knot in a B-spline knot sequence.
 * The abscissa and/or multiplicity default to Infinity. This is a special value indicating that the abscissa and/or multiplicity
 * is not yet defined since an abscissa value of 0 or a multiplicity of 0 can be regarded as a valid.
 *
 *
 */
class Knot {
    /**
     * Creates a new knot.
     *
     * @param abscissa - Position value of the knot along the axis of reals (default: Infinity)
     * @param multiplicity - Number of times the knot is repeated (default: 1 when abscissa is not Infinity, otherwise Infinity)
     * @throws {RangeError} If multiplicity is less than 1
     * @throws {RangeError} If abscissa is less than 1
     *
     * @example
     * const knot = new Knot(1.5, 2); // Knot at u=1.5 with multiplicity 2
     * const knot = new Knot(1.5); // Knot at u=1.5 with multiplicity that defaults to 1
     * const knot = new Knot(); // Knot at default value (Infinity) with multiplicity that defaults to Infinity
     */
    constructor(abscissa, multiplicity) {
        if (abscissa !== undefined) {
            if (abscissa === Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE) {
                this.throwRangeErrorMessage("constructor", Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
            }
            this._abscissa = abscissa;
        }
        else {
            this._abscissa = Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE;
        }
        if (multiplicity !== undefined) {
            if (multiplicity < 1) {
                this.throwRangeErrorMessage("constructor", Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
            }
            this._multiplicity = multiplicity;
        }
        else if (this._abscissa !== Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE) {
            this._multiplicity = 1;
        }
        else {
            this._multiplicity = Knots_2.DEFAULT_MULTIPLICITY_VALUE;
        }
    }
    /**
     * Gets the abscissa (position) value of the knot
     * @returns The abscissa value along the axis of reals
     */
    get abscissa() {
        return this._abscissa;
    }
    /**
     * Gets the multiplicity (number of repetitions) of the knot
     * @returns The multiplicity value
     */
    get multiplicity() {
        return this._multiplicity;
    }
    /**
     * Sets the abscissa (position) value of the knot
     * @param abscissa - The new abscissa value to set
     * @throws {RangeError} If abscissa equals DEFAULT_KNOT_ABSCISSA_VALUE
     */
    set abscissa(abscissa) {
        if (abscissa === Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE) {
            this.throwRangeErrorMessage("abscissa_setter", Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        }
        else {
            this._abscissa = abscissa;
        }
    }
    /**
     * Sets the multiplicity (number of repetitions) of the knot
     * @param multiplicity - The new multiplicity value to set
     * @throws {RangeError} If multiplicity is less than 1
     */
    set multiplicity(multiplicity) {
        if (multiplicity < 1) {
            this.throwRangeErrorMessage("multiplicity_setter", Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        }
        else {
            this._multiplicity = multiplicity;
        }
    }
    /**
     * Increases the knot multiplicity by the specified increment
     * @param increment - The value to increase multiplicity by (default: 1)
     * @throws {RangeError} If increment is less than 1
     */
    incrementMultiplicity(increment = 1) {
        if (increment < 1)
            this.throwRangeErrorMessage("incrementMultiplicity", Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        this._multiplicity = this._multiplicity + increment;
        return;
    }
    /**
     * Decreases the knot multiplicity by the specified decrement
     * @param decrement - The value to decrease multiplicity by (default: 1)
     * @throws {RangeError} If decrement is less than 1 or if resulting multiplicity would be less than 1
     */
    decrementMultiplicity(decrement = 1) {
        if (decrement < 1)
            this.throwRangeErrorMessage("incrementMultiplicity", Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        if (this._multiplicity < (decrement + 1)) {
            this.throwRangeErrorMessage("decrementMultiplicity", Knots_1.EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        }
        else {
            this._multiplicity = this._multiplicity - decrement;
        }
        return;
    }
    /**
     * Throws a RangeError with formatted error message
     * @param functionName - Name of the function where error occurred
     * @param message - The error message to display
     * @throws {RangeError} With formatted error message
     */
    throwRangeErrorMessage(functionName, message) {
        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, functionName);
        error.addMessage(message);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
}
exports.Knot = Knot;
