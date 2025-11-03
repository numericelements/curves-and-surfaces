import { EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT } from "../ErrorMessages/WeightManager";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { Real } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManagerPositiveWeightStrategy } from "./WeightManagerPositiveWeightStrategy";
import { WeightManagerSomeNullWeightStrategy } from "./WeightManagerSomeNullWeightStrategy";
import { WeightManagerStrictPositiveWeightStrategy } from "./WeightManagerStrictPositiveWeightStrategy";

export interface WeightManagerStrategy {
    addWeights(weightV1: Weight, weightV2: Weight): Weight;
    subtractWeights(weightV1: Weight, weightV2: Weight): Weight;
    scaleWeight(weight: Weight, scalar: Real): Weight;
    createWeightFromValueOnly(value: number): Weight;
    forcesNullWeight(weight: Weight): Weight;
    setWeightStatusToNullWeightStatus(weight: Weight): Weight
}

export class WeightManager {
    protected _weightManagement: WeightManagement;
    protected strategy: WeightManagerStrategy;

    constructor(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
        switch (this._weightManagement) {
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
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
                throw new RangeError(error.generateMessageString());
        }
    }
    
    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    clone(): WeightManager {
        return new WeightManager(this._weightManagement);
    }

    createWeightFromValueOnly(value: number): Weight {
        return this.strategy.createWeightFromValueOnly(value);
    }

    setWeightStatusToNullWeightStatus(weight: Weight): Weight {
        try {
            return this.strategy.setWeightStatusToNullWeightStatus(weight);
        } catch (error) {
            throw error;
        }
    }

    forcesNullWeight(weight: Weight): Weight {
        try {
            return this.strategy.forcesNullWeight(weight);
        } catch (error) {
            throw error;
        }
    }

    addWeights(weightV1: Weight, weightV2: Weight): Weight {
        try {
            return this.strategy.addWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    subtractWeights(weightV1: Weight, weightV2: Weight): Weight {
        try {
            return this.strategy.subtractWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

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