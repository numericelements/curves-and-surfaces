import { EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT } from "../ErrorMessages/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
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
    setWeightStatusToNullWeightStatus(weight: Weight): Weight;
    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight;
    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight;
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

    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        try {
            return this.strategy.addComplexWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight {
        try {
            return this.strategy.subtractComplexWeights(weightV1, weightV2);
        } catch (error) {
            throw error;
        }
    }

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
                return new ComplexWeight(new Weight(0, false), new Weight(0, false));
            }
            return new ComplexWeight(new Weight(scaled.real, weight.real.strictlyPositive), new Weight(scaled.imaginary, weight.imaginary.strictlyPositive));
        } else
            return new ComplexWeight(this.scaleWeight(weight.real, scalar), this.scaleWeight(weight.imaginary, scalar));
    }

    haveSameWeightManagement(weightV1: Weight, weightV2: Weight): boolean {
        if(this._weightManagement !== WeightManagement.SomeNullWeights) {
            if(weightV1.strictlyPositive === weightV2.strictlyPositive) {
                if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && weightV1.strictlyPositive) return true;
                if(this._weightManagement === WeightManagement.AllPositiveWeights && !weightV1.strictlyPositive) return true;
                return false;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    
}