import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { Complex } from "./Complex";
import { createComplexWeightDescriptor } from "./VectorDescriptorFactory";
import type { ComplexWeightDesc } from "./VectorDescriptorConstructorInterface";
import { Weight } from "./Weight";

/**
 * Represents a complex-valued weight used in projective complex vector spaces.
 *
 * A complex weight is composed of two {@link Weight} components — a real part and
 * an imaginary part — forming the homogeneous scalar w = real + i·imaginary.
 *
 * By convention:
 * - The **real part** defaults to `new Weight()` (value = 1, strictly positive).
 * - The **imaginary part** defaults to `new Weight(0, false)` (value = 0, non-negative),
 *   since a purely real default weight is the most common case and a zero imaginary
 *   component must be allowed.
 *
 * @example
 * ```typescript
 * const w1 = new ComplexWeight();                                     // w = 1 + 0i
 * const w2 = new ComplexWeight(new Weight(2));                        // w = 2 + 0i
 * const w3 = new ComplexWeight(new Weight(3), new Weight(4, false));  // w = 3 + 4i
 * ```
 */
export class ComplexWeight {

    private readonly _type: typeof COMPLEXWEIGHT;
    private readonly _real: Weight;
    private readonly _imaginary: Weight;

    /**
     * Creates a ComplexWeight instance.
     *
     * @param real - The real {@link Weight} component. Defaults to `new Weight()` (value = 1).
     * @param imaginary - The imaginary {@link Weight} component. Defaults to
     *   `new Weight(0, false)` (value = 0, non-negative constraint).
     */
    constructor();
    constructor(real: Weight);
    constructor(real: Weight, imaginary: Weight);
    constructor(real?: Weight, imaginary?: Weight) {
        this._type = COMPLEXWEIGHT;
        if(real === undefined) {
            this._real = new Weight();
        } else {
            this._real = real;
        }
        if(imaginary === undefined) {
            this._imaginary = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
        } else {
            // Deactivated method to set the imaginary weight free of strict positivity constraint
            // because the default imaginary weight value is 0
            // this.assessmentInputWeightStrictlyPositiveStatus(this._real, imaginary);
            this._imaginary = imaginary;
        }
    }

    /** The real component of this complex weight. */
    get real(): Weight {
        return this._real;
    }

    /** The imaginary component of this complex weight. */
    get imaginary(): Weight {
        return this._imaginary;
    }

    /**
     * Type tag identifying this object as a {@link ComplexWeight}. Used for
     * discriminated-union type narrowing in descriptor types.
     */
    get type(): typeof COMPLEXWEIGHT {
        return this._type;
    }

    toString(): string {
        return COMPLEXWEIGHT + `(real: ${this._real.toString()}, imaginary: ${this._imaginary.toString()})`;
    }

    /**
     * Returns a {@link ComplexWeightDesc} descriptor wrapping clones of both
     * the real and imaginary components.
     */
    toDescriptor(): ComplexWeightDesc {
        return createComplexWeightDescriptor(this._real.clone(), this._imaginary.clone());
    }

    /**
     * Converts this complex weight to a {@link Complex} number with
     * `real = this.real.value` and `imaginary = this.imaginary.value`.
     */
    toComplex(): Complex {
        return new Complex(this._real.value, this._imaginary.value);
    }

    /** Returns a deep copy of this complex weight (both components cloned). */
    clone(): ComplexWeight {
        return new ComplexWeight(this._real.clone(), this._imaginary.clone());
    }

    // This method is deactivated to be able to create imaginary weights that are not strictly positive for all categories of weight management
    // private assessmentInputWeightStrictlyPositiveStatus(real: Weight, imaginary: Weight): void {
    //     if (real.strictlyPositive !== imaginary.strictlyPositive) {
    //         const error = new ErrorLog(this.constructor.name, "constructor");
    //         error.addMessage(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
    //         console.log(error.generateMessageString());
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }
}