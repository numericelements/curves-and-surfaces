import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import type { WeightDesc } from "./VectorDescriptorConstructorInterface";

/**
 * Represents a scalar weight used in projective vector spaces.
 *
 * A weight is a real number subject to a positivity constraint that depends on
 * the weight management policy in use:
 * - **strictly positive** (`strictlyPositive = true`, default): the value must be > 0.
 *   This corresponds to standard homogeneous coordinates where w ≠ 0 and the
 *   projective point is well-defined.
 * - **non-negative** (`strictlyPositive = false`): the value must be ≥ 0.
 *   This relaxed constraint allows a null weight (w = 0), representing a point
 *   at infinity.
 *
 * The default weight value is 1, which is the identity element for homogeneous scaling.
 *
 * @example
 * ```typescript
 * const w    = new Weight(2);         // strictly positive weight, value = 2
 * const w0   = new Weight(0, false);  // non-negative weight, value = 0 (point at infinity)
 * const wDef = new Weight();          // default weight, value = 1
 * ```
 */
export class Weight {

    private readonly _type: typeof WEIGHT;
    private readonly _strictlyPositive: boolean;
    protected readonly _value: number;

    /**
     * Creates a Weight instance.
     *
     * @param weight - The numeric weight value. Defaults to {@link DEFAULT_WEIGHT_VALUE} (1)
     *   when omitted.
     * @param strictlyPositive - When `true` (default), the value must be strictly greater
     *   than 0. When `false`, the value must be non-negative (≥ 0).
     * @throws {RangeError} If `strictlyPositive` is `true` and `weight` is ≤ 0.
     * @throws {RangeError} If `strictlyPositive` is `false` and `weight` is < 0.
     */
    constructor(weight?: number, strictlyPositive: boolean = true) {
        this._type = WEIGHT;
        this._strictlyPositive = strictlyPositive;
        if(weight !== undefined && this._strictlyPositive) {
            this.assessmentInputWeightValueStrictlyPositive(weight);
            this._value = weight;
        } else if(weight !== undefined && !this._strictlyPositive) {
            this.assessmentInputWeightValue(weight);
            this._value = weight;
        } else {
            this._value = DEFAULT_WEIGHT_VALUE;
        }
    }

    /** Numeric value of this weight. */
    get value(): number {
        return this._value;
    }

    /**
     * Whether this weight is constrained to be strictly positive (> 0).
     * When `false`, the weight may be zero (non-negative constraint).
     */
    get strictlyPositive(): boolean {
        return this._strictlyPositive;
    }

    /**
     * Type tag identifying this object as a {@link Weight}. Used for
     * discriminated-union type narrowing in descriptor types.
     */
    get type(): typeof WEIGHT {
        return this._type;
    }

    /** Returns a deep copy of this weight with the same value and positivity constraint. */
    clone(): Weight {
        return new Weight(this._value, this._strictlyPositive);
    }

    toString(): string {
        return WEIGHT + `(value: ${this._value}, strictlyPositive: ${this._strictlyPositive})`;
    }

    /**
     * Returns a {@link WeightDesc} descriptor wrapping a clone of this weight.
     * Used to embed the weight into vector descriptors.
     */
    toDescriptor(): WeightDesc {
        return { type: WEIGHT, weight: this.clone() };
    }

    protected assessmentInputWeightValueStrictlyPositive(weight: number): void {
        if (weight <= 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    protected assessmentInputWeightValue(weight: number): void {
        if (weight < 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}