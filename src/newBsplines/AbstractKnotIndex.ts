import { EM_KNOT_INDEX_VALUE } from "../ErrorMessages/Knots";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { AbstractKnotIndex_type } from "./KnotIndexConstructorInterface";

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
