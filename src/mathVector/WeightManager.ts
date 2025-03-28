import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NEGATIVE, EM_SCALE_FACTOR_NEGATIVE_OR_NULL, EM_WEIGHT_MANAGER_WEIGHT_TYPE_ERROR, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { WM_WEIGHT_WITH_POSITIVE_VALUE_STATUS, WM_WEIGHT_WITH_STRICTLY_POSITIVE_VALUE_STATUS } from "../WarningMessages/WeightManager";
import { Real } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class WeightManager {
    protected _weightManagement: WeightManagement

    constructor(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
    }
    
    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    setWeightStatus(weight: Weight): Weight {
        let newWeight = weight;
        if (this._weightManagement === WeightManagement.AllPositiveWeights) {
            newWeight = new Weight(weight.weight, false);
        } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            if(weight.strictlyPositive === false) {
                const error = sendRangeErrorMessage(this.constructor.name, 'setWeightStatus', EM_WEIGHT_MANAGER_WEIGHT_TYPE_ERROR);
                throw new RangeError(error.generateMessageString());
            }
        } else if(this._weightManagement === WeightManagement.SomeNullWeights) {
            if(weight.weight === 0) {
                newWeight = new Weight(0, false);
            }
        }
        return newWeight;
    }

    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        const sumWeights = weightV1.weight + weightV2.weight;
        let newWeight = new Weight();
        if(Math.abs(sumWeights) >= NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight(sumWeights);
        } else {
            newWeight = new Weight(0, false);
        }
        if (this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            if(weightV1.strictlyPositive === false || weightV2.strictlyPositive === false) 
                sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_WITH_POSITIVE_VALUE_STATUS);
        } else if (this._weightManagement === WeightManagement.AllPositiveWeights) {
            if(weightV1.strictlyPositive === true || weightV2.strictlyPositive === true) 
                sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_WITH_STRICTLY_POSITIVE_VALUE_STATUS);
            newWeight = new Weight(sumWeights, false);
        } else if (this._weightManagement === WeightManagement.SomeNullWeights) {
            // nothing to do there
        }
        return newWeight;
    }

    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        const diffWeights = weightV1.weight - weightV2.weight;
        if(diffWeights < 0 && Math.abs(diffWeights) > NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if (this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(error.generateMessageString());
            } else {
                newWeight = new Weight(diffWeights);
            }
        } else if (this._weightManagement === WeightManagement.AllPositiveWeights) {
            if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                newWeight = new Weight(0, false);
            } else {
                newWeight = new Weight(diffWeights, false);
            }
        } else if (this._weightManagement === WeightManagement.SomeNullWeights) {
            if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                newWeight = new Weight(0, false);
            } else {
                newWeight = new Weight(diffWeights);
            }
        }
        return newWeight;
    }

    scaleWeight(weight: Weight, scalar: Real): Weight {
        if(scalar <= 0 && this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_NEGATIVE_OR_NULL);
            throw new RangeError(error.generateMessageString());
        } else if(Math.abs(weight.weight * scalar) < NULL_WEIGHT_TOLERANCE) {
            return new Weight(0, false);
        } else if(weight.weight * scalar < 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_NEGATIVE);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if(this._weightManagement === WeightManagement.AllPositiveWeights) {
            newWeight = new Weight(weight.weight * scalar, false);
        } else {
            newWeight = new Weight(weight.weight * scalar);
        }
        return newWeight;
    }

    cloneWeight(weight: Weight): Weight {
        return new Weight(weight.weight, weight.strictlyPositive);
    }

    isSameWeightManagement(weightV1: Weight, weightV2: Weight): boolean {
        if(this._weightManagement !== WeightManagement.SomeNullWeights) {
            if(weightV1.strictlyPositive === weightV2.strictlyPositive) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    
}