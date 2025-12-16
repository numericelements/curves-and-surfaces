import { EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { Real } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class WeightManagerSomeNullWeightStrategy {

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

    scaleWeight(weight: Weight, scalar: Real): Weight {
        let newWeight = new Weight();
        if(weight.strictlyPositive && scalar > 0) {
            newWeight = new Weight(weight.value * scalar);
        } else {
            newWeight = new Weight(weight.value * scalar, false);
        }
        return newWeight;
    }

    createWeightFromValueOnly(value: number): Weight {
        if (value < 0) {
            return new Weight(value, false);
        } else if (value === 0) {
            return new Weight(0, false);
        } else {
            return new Weight(value);
        }
    }

    forcesNullWeight(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(weight.value < NULL_WEIGHT_TOLERANCE) newWeight = new Weight(0, false);
        return newWeight;
    }

    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(weight.value < NULL_WEIGHT_TOLERANCE && weight.strictlyPositive)
            newWeight = new Weight(weight.value, false);
        return newWeight;
    }

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