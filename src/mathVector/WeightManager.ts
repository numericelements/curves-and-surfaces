import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT, EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE, WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE } from "../WarningMessages/WeightManager";
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

    clone(): WeightManager {
        return new WeightManager(this._weightManagement);
    }

    setWeight(weight: Weight): Weight {
        let newWeight = weight.clone();
        if (this._weightManagement === WeightManagement.AllPositiveWeights) {
            newWeight = new Weight(weight.value, false);
        } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            if(!weight.strictlyPositive) {
                const error = sendRangeErrorMessage(this.constructor.name, 'setWeightStatus', EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
                throw new RangeError(error.generateMessageString());
            }
        } else if(this._weightManagement === WeightManagement.SomeNullWeights) {
        // if(this._weightManagement === WeightManagement.SomeNullWeights) {
        //     if(weight.value < NULL_WEIGHT_TOLERANCE && weight.strictlyPositive) {
        //         newWeight = new Weight(weight.value, false);
        //     } else if(weight.value >= NULL_WEIGHT_TOLERANCE && !weight.strictlyPositive) {
        //         newWeight = new Weight(weight.value, true);
        //     }
        }
        return newWeight;
    }

    toggleWeightStatus(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(this._weightManagement === WeightManagement.SomeNullWeights) {
            if(weight.value < NULL_WEIGHT_TOLERANCE && weight.strictlyPositive) {
                newWeight = new Weight(weight.value, false);
            } else if(weight.value >= NULL_WEIGHT_TOLERANCE && !weight.strictlyPositive) {
                newWeight = new Weight(weight.value, true);
            }
        }
        return newWeight;
    }

    forcesNullWeight(weight: Weight): Weight {
        let newWeight = weight.clone();
        if(this._weightManagement === WeightManagement.AllPositiveWeights || this._weightManagement === WeightManagement.SomeNullWeights) {
            if(weight.value < NULL_WEIGHT_TOLERANCE) newWeight = new Weight(0, false);
        }
        return newWeight;
    }

    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(this._weightManagement === WeightManagement.AllPositiveWeights && (weightV1.strictlyPositive === true || weightV2.strictlyPositive === true)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'addWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && (weightV1.strictlyPositive === false || weightV2.strictlyPositive === false)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'addWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight();
        if(Math.abs(sumWeights) >= NULL_WEIGHT_TOLERANCE) {
            if(this._weightManagement === WeightManagement.AllPositiveWeights) {
                newWeight = new Weight(sumWeights, false);
            } else if(this._weightManagement === WeightManagement.SomeNullWeights) {
                if(!weightV1.strictlyPositive && !weightV2.strictlyPositive) {
                    newWeight = new Weight(sumWeights, false);
                } else {
                    newWeight = new Weight(sumWeights);
                }
            } else {
                newWeight = new Weight(sumWeights);
            }
        } else {
            if (this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
                newWeight = new Weight(sumWeights);
            } else if (this._weightManagement === WeightManagement.AllPositiveWeights) {
                sendRangeErrorMessage(this.constructor.name, 'addWeights', WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE);
                newWeight = new Weight(sumWeights, false);
            } else if (this._weightManagement === WeightManagement.SomeNullWeights) {
                if(weightV1.strictlyPositive && weightV2.strictlyPositive) {
                    newWeight = new Weight(sumWeights);
                } else {
                    newWeight = new Weight(sumWeights, false);
                }
            }
        }
        return newWeight;
    }

    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        if(this._weightManagement === WeightManagement.AllPositiveWeights && (weightV1.strictlyPositive === true || weightV2.strictlyPositive === true)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && (weightV1.strictlyPositive === false || weightV2.strictlyPositive === false)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const diffWeights = weightV1.value - weightV2.value;
        if(diffWeights < 0 && Math.abs(diffWeights) > NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if (this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            if(diffWeights <= 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                const error = sendRangeErrorMessage(this.constructor.name, 'subtractWeights', EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(error.generateMessageString());
            } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                sendRangeErrorMessage(this.constructor.name, 'subtractWeights', WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
                newWeight = new Weight(diffWeights);
            } else {
                newWeight = new Weight(diffWeights);
            }
        } else if (this._weightManagement === WeightManagement.AllPositiveWeights) {
            if(diffWeights < 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                newWeight = new Weight(0, false);
            } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                sendRangeErrorMessage(this.constructor.name, 'subtractWeights', WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE);
                newWeight = new Weight(diffWeights, false);
            } else {
                newWeight = new Weight(diffWeights, false);
            }
        } else if (this._weightManagement === WeightManagement.SomeNullWeights) {
            if(diffWeights < 0 && Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                newWeight = new Weight(0, false);
            } else if(Math.abs(diffWeights) < NULL_WEIGHT_TOLERANCE) {
                newWeight = new Weight(diffWeights, false);
            } else {
                newWeight = new Weight(diffWeights);
            }
        }
        return newWeight;
    }

    scaleWeight(weight: Weight, scalar: Real): Weight {
        if(scalar < 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
            throw new RangeError(error.generateMessageString());
        } else if(scalar === 0 && this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleWeight', EM_SCALE_FACTOR_NULL);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight();
        if(this._weightManagement === WeightManagement.AllPositiveWeights) {
            newWeight = new Weight(weight.value * scalar, false);
        } else if(this._weightManagement === WeightManagement.SomeNullWeights) {
            if(weight.strictlyPositive && scalar > 0) {
                newWeight = new Weight(weight.value * scalar);
            } else {
                newWeight = new Weight(weight.value * scalar, false);
            }
        } else {
            newWeight = new Weight(weight.value * scalar);
        }
        return newWeight;
    }

    cloneWeight(weight: Weight): Weight {
        return new Weight(weight.value, weight.strictlyPositive);
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