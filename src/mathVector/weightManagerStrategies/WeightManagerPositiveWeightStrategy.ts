import { EM_TOGGLE_STATUS_INCOMPATIBLE, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT, EM_WEIGHT_SUBTRACTION_ERROR } from "../../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE } from "../../namedConstants/ProjectiveRealVectorSpace";
import { WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE } from "../../WarningMessages/WeightManager";
import { ComplexWeight } from "../ComplexWeight";
import type { Real } from "../utilityTypes/VectorDescriptorTypes";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";
import { Weight } from "../Weight";

/**
 * {@link WeightManagerStrategy} for the `AllPositiveWeights` policy.
 *
 * All weights must have `strictlyPositive = false` and a value ≥ 0.
 * Zero weights are valid; toggling to null-weight status is not applicable.
 */
export class WeightManagerPositiveWeightStrategy {

    /**
     * @throws {RangeError} if either input weight has `strictlyPositive = true`.
     */
    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(weightV1.strictlyPositive === true || weightV2.strictlyPositive === true) {
            const error = sendRangeErrorMessage(this.constructor.name, 'addWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight();
        if(Math.abs(sumWeights) >= NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(sumWeights, false);
        } else {
            sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE);
            newWeight = new Weight(sumWeights, false);
        }
        return newWeight;
    }

    /**
     * @throws {RangeError} if either input weight has `strictlyPositive = true`,
     *   or if the result would be strictly negative.
     */
    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(weightV1.strictlyPositive === true || weightV2.strictlyPositive === true) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const diffWeights = weightV1.value - weightV2.value;
        if(diffWeights < 0 && Math.abs(diffWeights) > NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if(diffWeights < 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(0, false);
        } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            sendRangeErrorMessage(this.constructor.name, 'subtractWeights', WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE);
            newWeight = new Weight(diffWeights, false);
        } else {
            newWeight = new Weight(diffWeights, false);
        }
        return newWeight;
    }

    /** Returns a scaled non-strictly-positive weight. */
    scaleWeight(weight: Weight, scalar: Real): Weight {
        const newWeight = new Weight(weight.value * scalar, false);
        return newWeight;
    }

    /** Returns `new Weight(value, false)` — non-strictly-positive. */
    createWeightFromValueOnly(value: number): Weight {
        return new Weight(value, false);
    }

    /**
     * @throws {RangeError} if `weight.strictlyPositive` is `true` (incompatible status).
     */
    forcesNullWeight(weight: Weight): Weight {
        if(weight.strictlyPositive === true) {
            const error = sendRangeErrorMessage(this.constructor.name, 'forcesNullWeight', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = weight.clone();
        if(weight.value < NULL_WEIGHT_TOLERANCE) newWeight = new Weight(0, false);
        return newWeight;
    }

    /** Always throws — status toggling is not applicable to the `AllPositiveWeights` policy. */
    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        const error = sendRangeErrorMessage(this.constructor.name, 'toggleWeightStatus', EM_TOGGLE_STATUS_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    /**
     * @throws {RangeError} if any component of the inputs has `strictlyPositive = true`.
     */
    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        if(weightV1.real.strictlyPositive || weightV2.real.strictlyPositive) {
            const error = sendRangeErrorMessage(this.constructor.name, 'addComplexWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const newWeight = new ComplexWeight(new Weight(this.addWeights(weightV1.real, weightV2.real).value, false), new Weight(this.addWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        return newWeight;
    }

    /**
     * @throws {RangeError} if any component of the inputs has `strictlyPositive = true`.
     */
    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        if(weightV1.real.strictlyPositive || weightV2.real.strictlyPositive) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractComplexWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const newWeight = new ComplexWeight(new Weight(this.subtractWeights(weightV1.real, weightV2.real).value, false), new Weight(this.subtractWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        return newWeight;
    }
}