import { ErrorLog } from "../errorProcessing/ErrorLoging";

export const DEFAULT_KNOT_INDEX = Infinity;
export const DEFAULT_KNOT_ABSCISSA_VALUE = Infinity;
export const DEFAULT_MULTIPLICITY_VALUE = Infinity;
export const EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA = "Knot abscissa value out of range. Cannot proceed.";
export const EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY = "Knot multiplicity value out of range. Cannot proceed.";
export const EM_KNOT_DECREMENT_KNOT_MULTIPLICITY = "Encountered a knot multiplicity smaller than one when decrementing. Cannot proceed.";
export const EM_KNOT_INDEX_VALUE = "Knot index is negative. Must be positive or null. Cannot proceed.";
export const EM_KNOT_INCREMENT_DECREMENT = "Knot multiplicity cannot be incremented/decremented by an increment/decrement value smaller than one."

export const KNOT_INDEX_INCREASING_SEQUENCE = "KnotIndexIncreasingSequence";
export const KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE = "KnotIndexStrictlyIncreasingSequence";

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

/**
 * Represents a knot index in an increasing sequence
 * @interface
 * @property {string} type - Identifier for increasing sequence type
 * @property {number} index - The index value in the sequence
 */
export interface IncreasingSequence {
    type: typeof KNOT_INDEX_INCREASING_SEQUENCE;
    index : number;
}

/**
 * Represents a knot index in a strictly increasing sequence
 * @interface
 * @property {string} type - Identifier for strictly increasing sequence type
 * @property {number} index - The index value in the sequence
 */
export interface StrictlyIncreasingSequence {
    type: typeof KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE;
    index : number;
}

/**
 * Union type representing either an increasing or strictly increasing knot index of a knot into a knot sequence
 * @typedef {IncreasingSequence | StrictlyIncreasingSequence} AbstractKnotIndex_type
 */
export type AbstractKnotIndex_type = IncreasingSequence | StrictlyIncreasingSequence;

/**
 * Interface defining the knot index property
 * @interface
 * @property {number} knotIndex - The index value of the knot
 */
export interface KnotIndexInterface {
    knotIndex: number;
}

/**
 * Abstract base class for knot index implementations
 * 
 * @description
 * Provides a foundation for managing knot indices in B-spline knot sequences.
 * This class enforces non-negative index values and maintains type safety through
 * its abstract _knotIndex property. It serves as the base for both increasing and
 * strictly increasing sequence implementations, providing common validation and
 * access patterns.
 * 
 * @abstract
 * The class supports two types of sequences:
 * - Increasing sequences (where consecutive values can be equal)
 * - Strictly increasing sequences (where each value must be greater than the previous)
 */
export abstract class AbstractKnotIndex {

    protected abstract _knotIndex: AbstractKnotIndex_type;

    /**
     * Creates a new knot index instance
     * @param value - The index value
     * @throws {RangeError} If value is negative
     */
    constructor(value: number) {
        this.assessmentInputIndexValue(value);
    }

    /**
     * Gets the current knot index value
     * @returns The index value from the knot sequence
     */
    get knotIndex() {
        return this._knotIndex.index;
    }

    /**
     * Sets the knot index value
     * @param value - The new index value to set
     * @throws {RangeError} If value is negative
     */
    set knotIndex(value: number) {
        this.assessmentInputIndexValue(value);
        this._knotIndex.index = value;
        return;
    }

    /**
     * Validates that the input index value is non-negative
     * @param value - The index value to validate
     * @throws {RangeError} If value is negative
     */
    protected assessmentInputIndexValue(value: number): void {
        if(value < 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_KNOT_INDEX_VALUE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }

}

/**
 * Represents a knot index in a strictly increasing sequence
 * 
 * @description
 * Implements a knot index where each value must be strictly greater than the previous one
 * in the sequence. This is used in B-spline knot sequences where no repeated knot values
 * are allowed, ensuring strict monotonicity.
 * 
 * @extends AbstractKnotIndex
 */
export class KnotIndexStrictlyIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: StrictlyIncreasingSequence;

    /**
     * Creates a new strictly increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value: number) {
        super(value);
        this._knotIndex = {type: KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE, index: value};
    }
}


/**
 * Represents a knot index in an increasing sequence
 * 
 * @description
 * Implements a knot index where each value must be greater than or equal to the previous one
 * in the sequence. This allows for repeated knot values, which is useful for representing
 * B-spline knot sequences with multiple knots at the same position.
 * 
 * @extends AbstractKnotIndex
 */
export class KnotIndexIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: IncreasingSequence;

    /**
     * Creates a new increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value: number) {
        super(value);
        this._knotIndex = {type: KNOT_INDEX_INCREASING_SEQUENCE, index: value};
    }
}
