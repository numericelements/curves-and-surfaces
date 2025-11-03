import { EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_TOGGLE_STATUS_INCOMPATIBLE, EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE } from "../WarningMessages/WeightManager";
import { Real } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class WeightManagerStrictPositiveWeightStrategy {

    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(weightV1.strictlyPositive === false || weightV2.strictlyPositive === false) {
            const error = sendRangeErrorMessage(this.constructor.name, 'addWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight();
        if(Math.abs(sumWeights) >= NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(sumWeights);
        } else {
            sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
            newWeight = new Weight(sumWeights);
        }
        return newWeight;
    }

    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(weightV1.strictlyPositive === false || weightV2.strictlyPositive === false) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const diffWeights = weightV1.value - weightV2.value;
        if(diffWeights < 0 && Math.abs(diffWeights) > NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if(diffWeights <= 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
            throw new RangeError(error.generateMessageString());
        } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
            sendRangeErrorMessage(this.constructor.name, 'subtractWeights', WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
            newWeight = new Weight(diffWeights);
        } else {
            newWeight = new Weight(diffWeights);
        }
        return newWeight;
    }

    scaleWeight(weight: Weight, scalar: Real): Weight {
        if(scalar === 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_NULL);
            throw new RangeError(error.generateMessageString());
        }
        const newWeight = new Weight(weight.value * scalar);
        return newWeight;
    }

    createWeightFromValueOnly(value: number): Weight {
        return new Weight(value);
    }

    forcesNullWeight(weight: Weight): Weight {
        const error = sendRangeErrorMessage(this.constructor.name, 'forcesNullWeight', EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        throw new RangeError(error.generateMessageString());
    }

    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        const error = sendRangeErrorMessage(this.constructor.name, 'toggleWeightStatus', EM_TOGGLE_STATUS_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}