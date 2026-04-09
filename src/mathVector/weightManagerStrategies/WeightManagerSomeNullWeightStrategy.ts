import { EM_WEIGHT_SUBTRACTION_ERROR } from "../../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE } from "../../namedConstants/ProjectiveRealVectorSpace";
import { ComplexWeight } from "../ComplexWeight";
import type { Real } from "../utilityTypes/VectorDescriptorTypes";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";
import { Weight } from "../Weight";

/**
 * {@link WeightManagerStrategy} for the `SomeNullWeights` policy.
 *
 * Both strictly-positive and non-strictly-positive weights are accepted.
 * The `strictlyPositive` flag of each result is inferred from the operands
 * and the resulting value, allowing zero weights (points at infinity).
 */
export class WeightManagerSomeNullWeightStrategy {

    /** Preserves the `strictlyPositive` flag based on operand flags and resulting value. */
    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight();
        if(Math.abs(sumWeights) >= NULL_WEIGHT_TOLERANCE) {
            if(!weightV1.strictlyPositive && !weightV2.strictlyPositive) {
                newWeight = new Weight(sumWeights, false);
            } else {
                newWeight = new Weight(sumWeights);
            }
        } else {
            if(weightV1.strictlyPositive && weightV2.strictlyPositive) {
                newWeight = new Weight(sumWeights);
            } else {
                newWeight = new Weight(sumWeights, false);
            }
        }
        return newWeight;
    }

    /**
     * @throws {RangeError} if the result would be meaningfully negative.
     */
    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        const diffWeights = weightV1.value - weightV2.value;
        if(diffWeights < 0 && Math.abs(diffWeights) > NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if(diffWeights < 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(0, false);
        } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(diffWeights, false);
        } else {
            newWeight = new Weight(diffWeights);
        }
        return newWeight;
    }

    /** Preserves `strictlyPositive = true` only if the original weight is strictly positive and `scalar > 0`. */
    scaleWeight(weight: Weight, scalar: Real): Weight {
        let newWeight = new Weight();
        if(weight.strictlyPositive && scalar > 0) {
            newWeight = new Weight(weight.value * scalar);
        } else {
            newWeight = new Weight(weight.value * scalar, false);
        }
        return newWeight;
    }

    /** Infers `strictlyPositive` flag from value: `false` for 0 or negative; `true` for positive values. */
    createWeightFromValueOnly(value: number): Weight {
        if (value < 0) {
            return new Weight(value, false);
        } else if (value === 0) {
            return new Weight(0, false);
        } else {
            return new Weight(value);
        }
    }

    /** Forces `weight` to 0 (non-strictly-positive) if its value is below `NULL_WEIGHT_TOLERANCE`. */
    forcesNullWeight(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(weight.value < NULL_WEIGHT_TOLERANCE) newWeight = new Weight(0, false);
        return newWeight;
    }

    /** Transitions a strictly-positive near-zero weight to `strictlyPositive = false`. */
    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(weight.value < NULL_WEIGHT_TOLERANCE && weight.strictlyPositive)
            newWeight = new Weight(weight.value, false);
        return newWeight;
    }

    /** Propagates `strictlyPositive` flags from operands to the resulting complex weight. */
    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        let newWeightR = this.addWeights(weightV1.real, weightV2.real);
        let newWeightI = this.addWeights(weightV1.imaginary, weightV2.imaginary);
        if(!newWeightR.strictlyPositive || !newWeightI.strictlyPositive) {
            newWeightR = new Weight(newWeightR.value, false);
            newWeightI = new Weight(newWeightI.value, false);
        }
        let newWeight = new ComplexWeight(newWeightR, newWeightI);
        if(!weightV1.real.strictlyPositive && !weightV2.real.strictlyPositive) {
            newWeight = new ComplexWeight(new Weight(this.addWeights(weightV1.real, weightV2.real).value, false), new Weight(this.addWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        }
        return newWeight;
    }

    /** Propagates `strictlyPositive` flags from operands to the resulting complex weight. */
    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        let newWeightR = this.subtractWeights(weightV1.real, weightV2.real);
        let newWeightI = this.subtractWeights(weightV1.imaginary, weightV2.imaginary);
        if(!newWeightR.strictlyPositive || !newWeightI.strictlyPositive) {
            newWeightR = new Weight(newWeightR.value, false);
            newWeightI = new Weight(newWeightI.value, false);
        }
        let newWeight = new ComplexWeight(newWeightR, newWeightI);
        if(!weightV1.real.strictlyPositive && !weightV2.real.strictlyPositive) {
            newWeight = new ComplexWeight(new Weight(this.subtractWeights(weightV1.real, weightV2.real).value, false), new Weight(this.subtractWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        }
        return newWeight;
    }
}