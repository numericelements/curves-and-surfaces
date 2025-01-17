import { EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA, EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY, EM_KNOT_DECREMENT_KNOT_MULTIPLICITY, EM_KNOT_INCREMENT_DECREMENT } from "../ErrorMessages/Knots";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_KNOT_ABSCISSA_VALUE, DEFAULT_MULTIPLICITY_VALUE } from "../namedConstants/Knots";

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
export class Knot {

    protected _abscissa: number;
    protected _multiplicity: number;


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
    constructor(abscissa?: number, multiplicity?: number) {
        if(abscissa !== undefined) {
            if(abscissa === DEFAULT_KNOT_ABSCISSA_VALUE) {
                this.throwRangeErrorMessage("constructor", EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
            }
            this._abscissa = abscissa;
        } else {
            this._abscissa = DEFAULT_KNOT_ABSCISSA_VALUE;
        }
        if(multiplicity !== undefined) {
            if(multiplicity < 1) {
                this.throwRangeErrorMessage("constructor", EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
            }
            this._multiplicity = multiplicity;
        } else if(this._abscissa !== DEFAULT_KNOT_ABSCISSA_VALUE) {
            this._multiplicity = 1;
        } else {
            this._multiplicity = DEFAULT_MULTIPLICITY_VALUE;
        }
    }

    /**
     * Gets the abscissa (position) value of the knot
     * @returns The abscissa value along the axis of reals
     */
    get abscissa(): number {
        return this._abscissa;
    }

    /**
     * Gets the multiplicity (number of repetitions) of the knot
     * @returns The multiplicity value
     */
    get multiplicity(): number {
        return this._multiplicity;
    }

    /**
     * Sets the abscissa (position) value of the knot
     * @param abscissa - The new abscissa value to set
     * @throws {RangeError} If abscissa equals DEFAULT_KNOT_ABSCISSA_VALUE
     */
    set abscissa(abscissa: number) {
        if(abscissa === DEFAULT_KNOT_ABSCISSA_VALUE) {
            this.throwRangeErrorMessage("abscissa_setter", EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        } else {
            this._abscissa = abscissa;
        }
    }

    /**
     * Sets the multiplicity (number of repetitions) of the knot
     * @param multiplicity - The new multiplicity value to set
     * @throws {RangeError} If multiplicity is less than 1
     */
    set multiplicity(multiplicity: number) {
        if(multiplicity < 1) {
            this.throwRangeErrorMessage("multiplicity_setter", EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        } else {
            this._multiplicity = multiplicity;
        }
    }

    /**
     * Increases the knot multiplicity by the specified increment
     * @param increment - The value to increase multiplicity by (default: 1)
     * @throws {RangeError} If increment is less than 1
     */
    incrementMultiplicity(increment: number = 1): void {
        if(increment < 1) this.throwRangeErrorMessage("incrementMultiplicity", EM_KNOT_INCREMENT_DECREMENT);
        this._multiplicity = this._multiplicity + increment;
        return
    }

    /**
     * Decreases the knot multiplicity by the specified decrement
     * @param decrement - The value to decrease multiplicity by (default: 1)
     * @throws {RangeError} If decrement is less than 1 or if resulting multiplicity would be less than 1
     */
    decrementMultiplicity(decrement: number = 1): void {
        if(decrement < 1) this.throwRangeErrorMessage("incrementMultiplicity", EM_KNOT_INCREMENT_DECREMENT);
        if(this._multiplicity < (decrement + 1)) {
            this.throwRangeErrorMessage("decrementMultiplicity", EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        } else {
            this._multiplicity = this._multiplicity - decrement;
        }
        return
    }

    /**
     * Throws a RangeError with formatted error message
     * @param functionName - Name of the function where error occurred
     * @param message - The error message to display
     * @throws {RangeError} With formatted error message
     */
    protected throwRangeErrorMessage(functionName: string, message: string): void {
        const error = new ErrorLog(this.constructor.name, functionName);
        error.addMessage(message);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
}
