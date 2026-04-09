import { EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_MANAGEMENT_UNKOWN, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE } from "../namedConstants/Weight";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { WeightManagerStrategy } from "./interfaces/WeightManagerInterfaces";
import type { Real } from "./utilityTypes/VectorDescriptorTypes";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManagerPositiveWeightStrategy } from "./weightManagerStrategies/WeightManagerPositiveWeightStrategy";
import { WeightManagerSomeNullWeightStrategy } from "./weightManagerStrategies/WeightManagerSomeNullWeightStrategy";
import { WeightManagerStrictPositiveWeightStrategy } from "./weightManagerStrategies/WeightManagerStrictPositiveWeightStrategy";

/**
 * Manages weight arithmetic for projective vector spaces according to a {@link WeightManagement} policy.
 *
 * The policy governs which weight values are legal and how arithmetic operations
 * (add, subtract, scale) handle edge cases such as zero or negative weights.
 * The actual logic is delegated to an internal {@link WeightManagerStrategy}.
 *
 * Three policies are supported:
 * - `AllStrictlyPositiveWeights` — all weights must be > 0.
 * - `AllPositiveWeights`         — weights must be ≥ 0.
 * - `SomeNullWeights`            — weights may be zero (points at infinity allowed).
 *
 * @example
 * const wm = new WeightManager(WeightManagement.AllStrictlyPositiveWeights);
 * const w  = wm.createWeightFromValueOnly(2);   // Weight(2, true)
 * const w2 = wm.addWeights(w, w);               // Weight(4, true)
 */
export class WeightManager {
    protected readonly _weightManagement: WeightManagement;
    protected readonly strategy: WeightManagerStrategy;

    /**
     * @param weightManagement - the policy controlling weight validity and arithmetic.
     * @throws {RangeError} if `weightManagement` is not a recognised {@link WeightManagement} value.
     */
    constructor(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
        switch (weightManagement) {
            case WeightManagement.AllPositiveWeights:
                this.strategy = new WeightManagerPositiveWeightStrategy();
                break;
            case WeightManagement.AllStrictlyPositiveWeights:
                this.strategy = new WeightManagerStrictPositiveWeightStrategy();
                break;
            case WeightManagement.SomeNullWeights:
                this.strategy = new WeightManagerSomeNullWeightStrategy();
                break;
            default:
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_WEIGHT_MANAGEMENT_UNKOWN);
                throw new RangeError(error.generateMessageString());
        }
    }
    
    /** The active weight-management policy. */
    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    /** Returns a deep copy of this manager (same policy). */
    clone(): WeightManager {
        return new WeightManager(this._weightManagement);
    }

    /**
     * Creates a {@link Weight} from a bare numeric value.
     * The `strictlyPositive` flag is set according to the active policy.
     */
    createWeightFromValueOnly(value: number): Weight {
        return this.strategy.createWeightFromValueOnly(value);
    }

    /**
     * Returns a copy of `weight` with its status set to the null-weight status
     * appropriate for the active policy.
     * @throws {RangeError} if the operation is incompatible with the current policy.
     */
    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        try {
            return this.strategy.setWeightStatusToNullWeightStatus(weight);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Forces `weight` to the null-weight value (0) for the active policy.
     * @throws {RangeError} if the operation is incompatible with the current policy.
     */
    forcesNullWeight(weight: Weight): Weight {
        try {
            return this.strategy.forcesNullWeight(weight);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the component-wise sum of two real weights.
     * @throws {RangeError} if the result violates the active policy.
     */
    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        try {
            return this.strategy.addWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the component-wise difference of two real weights.
     * @throws {RangeError} if the result violates the active policy.
     */
    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        try {
            return this.strategy.subtractWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Scales a real weight by `scalar`.
     * @param scalar - must be ≥ 0.
     * @throws {RangeError} if `scalar` is negative or if the result violates the active policy.
     */
    scaleWeight(weight: Weight, scalar: Real): Weight {
        if(scalar < 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
            throw new RangeError(error.generateMessageString());
        }
        try {
            return this.strategy.scaleWeight(weight, scalar);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the component-wise sum of two complex weights.
     * @throws {RangeError} if the result violates the active policy.
     */
    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        try {
            return this.strategy.addComplexWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the component-wise difference of two complex weights.
     * @throws {RangeError} if the result violates the active policy.
     */
    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        try {
            return this.strategy.subtractComplexWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Scales a complex weight by a real scalar or by a {@link Complex} number.
     * @throws {RangeError} if any resulting component is negative,
     *   or if scaling to zero is forbidden by the active policy.
     */
    scaleComplexWeight(weight: ComplexWeight, scalar: Real): ComplexWeight;
    scaleComplexWeight(weight: ComplexWeight, scalar: Complex): ComplexWeight;
    scaleComplexWeight(weight: ComplexWeight, scalar: Real | Complex): ComplexWeight {
        if(scalar instanceof Complex) {
            const complexWeight = new Complex(weight.real.value, weight.imaginary.value);
            let scaled = complexWeight.multiply(scalar);
            if(scaled.real < 0 || scaled.imaginary < 0) {
                const error = sendRangeErrorMessage(this.constructor.name, 'scaleComplexWeight', EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
                throw new RangeError(error.generateMessageString());
            } else if((scaled.real === 0 || scaled.imaginary === 0) && this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                const error = sendRangeErrorMessage(this.constructor.name, 'scaleComplexWeight', EM_SCALE_FACTOR_NULL);
                throw new RangeError(error.generateMessageString());
            }
            if(this._weightManagement === WeightManagement.SomeNullWeights && (scaled.real < NULL_WEIGHT_TOLERANCE || scaled.imaginary < NULL_WEIGHT_TOLERANCE)) {
                if(scaled.real < NULL_WEIGHT_TOLERANCE && scaled.imaginary >= NULL_WEIGHT_TOLERANCE) {
                    return new ComplexWeight(new Weight(0, false), new Weight(scaled.imaginary, false));
                } else if(scaled.real >= NULL_WEIGHT_TOLERANCE && scaled.imaginary < NULL_WEIGHT_TOLERANCE) {
                    return new ComplexWeight(new Weight(scaled.real, false), new Weight(0, false));
                }
                return new ComplexWeight(new Weight(0, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
            }
            return new ComplexWeight(new Weight(scaled.real, weight.real.strictlyPositive), new Weight(scaled.imaginary, weight.imaginary.strictlyPositive));
        } else
            return new ComplexWeight(this.scaleWeight(weight.real, scalar), this.scaleWeight(weight.imaginary, scalar));
    }

    /**
     * Returns `true` if both weights are consistent with each other under the active policy.
     * For `SomeNullWeights` this is always `true`; otherwise both weights must share
     * the same `strictlyPositive` flag and it must match the policy.
     */
    haveSameWeightManagement(weightV1: Weight, weightV2: Weight): boolean {
        if(this._weightManagement !== WeightManagement.SomeNullWeights) {
            if(weightV1.strictlyPositive === weightV2.strictlyPositive) {
                let haveSameWeightManagement = false
                if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && weightV1.strictlyPositive) haveSameWeightManagement = true;
                if(this._weightManagement === WeightManagement.AllPositiveWeights && !weightV1.strictlyPositive) haveSameWeightManagement = true;
                return haveSameWeightManagement;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    
}