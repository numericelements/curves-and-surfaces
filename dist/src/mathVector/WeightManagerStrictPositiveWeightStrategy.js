"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightManagerStrictPositiveWeightStrategy = void 0;
const WeightManager_1 = require("../ErrorMessages/WeightManager");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const WeightManager_2 = require("../WarningMessages/WeightManager");
const ComplexWeight_1 = require("./ComplexWeight");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
class WeightManagerStrictPositiveWeightStrategy {
    addWeights(weightV1, weightV2) {
        if (weightV1.strictlyPositive === false || weightV2.strictlyPositive === false) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'addWeights', WeightManager_1.EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const sumWeights = weightV1.value + weightV2.value;
        let newWeight = new Weight_1.Weight();
        if (Math.abs(sumWeights) >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            newWeight = new Weight_1.Weight(sumWeights);
        }
        else {
            (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'addWeights', WeightManager_2.WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
            newWeight = new Weight_1.Weight(sumWeights);
        }
        return newWeight;
    }
    subtractWeights(weightV1, weightV2) {
        if (weightV1.strictlyPositive === false || weightV2.strictlyPositive === false) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractWeights', WeightManager_1.EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        const diffWeights = weightV1.value - weightV2.value;
        if (diffWeights < 0 && Math.abs(diffWeights) > ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractWeights', WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new Weight_1.Weight();
        if (diffWeights <= 0 && Math.abs(diffWeights) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractWeights', WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
            throw new RangeError(error.generateMessageString());
        }
        else if (Math.abs(diffWeights) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractWeights', WeightManager_2.WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE);
            newWeight = new Weight_1.Weight(diffWeights);
        }
        else {
            newWeight = new Weight_1.Weight(diffWeights);
        }
        return newWeight;
    }
    scaleWeight(weight, scalar) {
        if (scalar === 0) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scaleWeight', WeightManager_1.EM_SCALE_FACTOR_NULL);
            throw new RangeError(error.generateMessageString());
        }
        const newWeight = new Weight_1.Weight(weight.value * scalar);
        return newWeight;
    }
    createWeightFromValueOnly(value) {
        return new Weight_1.Weight(value);
    }
    forcesNullWeight(weight) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'forcesNullWeight', WeightManager_1.EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        throw new RangeError(error.generateMessageString());
    }
    setWeightStatusToNullWeightStatus(weight) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'toggleWeightStatus', WeightManager_1.EM_TOGGLE_STATUS_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
    addComplexWeights(weightV1, weightV2) {
        if (!weightV1.real.strictlyPositive || !weightV2.real.strictlyPositive) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'addComplexWeights', WeightManager_1.EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(this.addWeights(weightV1.real, weightV2.real).value), new Weight_1.Weight(this.addWeights(weightV1.imaginary, weightV2.imaginary).value));
        return newWeight;
    }
    subtractComplexWeights(weightV1, weightV2) {
        if (!weightV1.real.strictlyPositive || !weightV2.real.strictlyPositive) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtractComplexWeights', WeightManager_1.EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        let newWeight = new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(this.subtractWeights(weightV1.real, weightV2.real).value), new Weight_1.Weight(this.subtractWeights(weightV1.imaginary, weightV2.imaginary).value));
        return newWeight;
    }
}
exports.WeightManagerStrictPositiveWeightStrategy = WeightManagerStrictPositiveWeightStrategy;
