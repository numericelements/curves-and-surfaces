"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightManagerSomeNullWeightStrategy = void 0;
const WeightManager_1 = require("../ErrorMessages/WeightManager");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const ComplexWeight_1 = require("./ComplexWeight");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
class WeightManagerSomeNullWeightStrategy {
    addWeights(weightV1, weightV2) {
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight_1.Weight();
        if (Math.abs(sumWeights) >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            if (!weightV1.strictlyPositive && !weightV2.strictlyPositive) {
                newWeight = new Weight_1.Weight(sumWeights, false);
            }
            else {
                newWeight = new Weight_1.Weight(sumWeights);
            }
        }
        else {
            if (weightV1.strictlyPositive && weightV2.strictlyPositive) {
                newWeight = new Weight_1.Weight(sumWeights);
            }
            else {
                newWeight = new Weight_1.Weight(sumWeights, false);
            }
        }
        return newWeight;
    }
    subtractWeights(weightV1, weightV2) {
        const diffWeights = weightV1.value - weightV2.value;
        if (diffWeights < 0 && Math.abs(diffWeights) > ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractWeights', WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight_1.Weight();
        if (diffWeights < 0 && Math.abs(diffWeights) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight_1.Weight(0, false);
        }
        else if (Math.abs(diffWeights) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight_1.Weight(diffWeights, false);
        }
        else {
            newWeight = new Weight_1.Weight(diffWeights);
        }
        return newWeight;
    }
    scaleWeight(weight, scalar) {
        let newWeight = new Weight_1.Weight();
        if (weight.strictlyPositive && scalar > 0) {
            newWeight = new Weight_1.Weight(weight.value * scalar);
        }
        else {
            newWeight = new Weight_1.Weight(weight.value * scalar, false);
        }
        return newWeight;
    }
    createWeightFromValueOnly(value) {
        if (value < 0) {
            return new Weight_1.Weight(value, false);
        }
        else if (value === 0) {
            return new Weight_1.Weight(0, false);
        }
        else {
            return new Weight_1.Weight(value);
        }
    }
    forcesNullWeight(weight) {
        let newWeight = weight.clone();
        if (weight.value < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE)
            newWeight = new Weight_1.Weight(0, false);
        return newWeight;
    }
    setWeightStatusToNullWeightStatus(weight) {
        let newWeight = weight.clone();
        if (weight.value < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && weight.strictlyPositive)
            newWeight = new Weight_1.Weight(weight.value, false);
        return newWeight;
    }
    addComplexWeights(weightV1, weightV2) {
        let newWeightR = this.addWeights(weightV1.real, weightV2.real);
        let newWeightI = this.addWeights(weightV1.imaginary, weightV2.imaginary);
        if (!newWeightR.strictlyPositive || !newWeightI.strictlyPositive) {
            newWeightR = new Weight_1.Weight(newWeightR.value, false);
            newWeightI = new Weight_1.Weight(newWeightI.value, false);
        }
        let newWeight = new ComplexWeight_1.ComplexWeight(newWeightR, newWeightI);
        if (!weightV1.real.strictlyPositive && !weightV2.real.strictlyPositive) {
            newWeight = new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(this.addWeights(weightV1.real, weightV2.real).value, false), new Weight_1.Weight(this.addWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        }
        return newWeight;
    }
    subtractComplexWeights(weightV1, weightV2) {
        let newWeightR = this.subtractWeights(weightV1.real, weightV2.real);
        let newWeightI = this.subtractWeights(weightV1.imaginary, weightV2.imaginary);
        if (!newWeightR.strictlyPositive || !newWeightI.strictlyPositive) {
            newWeightR = new Weight_1.Weight(newWeightR.value, false);
            newWeightI = new Weight_1.Weight(newWeightI.value, false);
        }
        let newWeight = new ComplexWeight_1.ComplexWeight(newWeightR, newWeightI);
        if (!weightV1.real.strictlyPositive && !weightV2.real.strictlyPositive) {
            newWeight = new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(this.subtractWeights(weightV1.real, weightV2.real).value, false), new Weight_1.Weight(this.subtractWeights(weightV1.imaginary, weightV2.imaginary).value, false));
        }
        return newWeight;
    }
}
exports.WeightManagerSomeNullWeightStrategy = WeightManagerSomeNullWeightStrategy;
