"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightManager = void 0;
const WeightManager_1 = require("../ErrorMessages/WeightManager");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const Complex_1 = require("./Complex");
const ComplexWeight_1 = require("./ComplexWeight");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
const WeightManagerPositiveWeightStrategy_1 = require("./WeightManagerPositiveWeightStrategy");
const WeightManagerSomeNullWeightStrategy_1 = require("./WeightManagerSomeNullWeightStrategy");
const WeightManagerStrictPositiveWeightStrategy_1 = require("./WeightManagerStrictPositiveWeightStrategy");
class WeightManager {
    constructor(weightManagement) {
        this._weightManagement = weightManagement;
        switch (weightManagement) {
            case ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights:
                this.strategy = new WeightManagerPositiveWeightStrategy_1.WeightManagerPositiveWeightStrategy();
                break;
            case ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights:
                this.strategy = new WeightManagerStrictPositiveWeightStrategy_1.WeightManagerStrictPositiveWeightStrategy();
                break;
            case ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights:
                this.strategy = new WeightManagerSomeNullWeightStrategy_1.WeightManagerSomeNullWeightStrategy();
                break;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', WeightManager_1.EM_WEIGHT_MANAGEMENT_UNKOWN);
                throw new RangeError(error.generateMessageString());
        }
    }
    get weightManagement() {
        return this._weightManagement;
    }
    clone() {
        return new WeightManager(this._weightManagement);
    }
    createWeightFromValueOnly(value) {
        return this.strategy.createWeightFromValueOnly(value);
    }
    setWeightStatusToNullWeightStatus(weight) {
        try {
            return this.strategy.setWeightStatusToNullWeightStatus(weight);
        }
        catch (error) {
            throw error;
        }
    }
    forcesNullWeight(weight) {
        try {
            return this.strategy.forcesNullWeight(weight);
        }
        catch (error) {
            throw error;
        }
    }
    addWeights(weightV1, weightV2) {
        try {
            return this.strategy.addWeights(weightV1, weightV2);
        }
        catch (error) {
            throw error;
        }
    }
    subtractWeights(weightV1, weightV2) {
        try {
            return this.strategy.subtractWeights(weightV1, weightV2);
        }
        catch (error) {
            throw error;
        }
    }
    scaleWeight(weight, scalar) {
        if (scalar < 0) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scaleWeight', WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
            throw new RangeError(error.generateMessageString());
        }
        try {
            return this.strategy.scaleWeight(weight, scalar);
        }
        catch (error) {
            throw error;
        }
    }
    addComplexWeights(weightV1, weightV2) {
        try {
            return this.strategy.addComplexWeights(weightV1, weightV2);
        }
        catch (error) {
            throw error;
        }
    }
    subtractComplexWeights(weightV1, weightV2) {
        try {
            return this.strategy.subtractComplexWeights(weightV1, weightV2);
        }
        catch (error) {
            throw error;
        }
    }
    scaleComplexWeight(weight, scalar) {
        if (scalar instanceof Complex_1.Complex) {
            const complexWeight = new Complex_1.Complex(weight.real.value, weight.imaginary.value);
            let scaled = complexWeight.multiply(scalar);
            if (scaled.real < 0 || scaled.imaginary < 0) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scaleComplexWeight', WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
                throw new RangeError(error.generateMessageString());
            }
            else if ((scaled.real === 0 || scaled.imaginary === 0) && this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scaleComplexWeight', WeightManager_1.EM_SCALE_FACTOR_NULL);
                throw new RangeError(error.generateMessageString());
            }
            if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights && (scaled.real < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE || scaled.imaginary < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE)) {
                if (scaled.real < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && scaled.imaginary >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
                    return new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(0, false), new Weight_1.Weight(scaled.imaginary, false));
                }
                else if (scaled.real >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && scaled.imaginary < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
                    return new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(scaled.real, false), new Weight_1.Weight(0, false));
                }
                return new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(0, false), new Weight_1.Weight(0, false));
            }
            return new ComplexWeight_1.ComplexWeight(new Weight_1.Weight(scaled.real, weight.real.strictlyPositive), new Weight_1.Weight(scaled.imaginary, weight.imaginary.strictlyPositive));
        }
        else
            return new ComplexWeight_1.ComplexWeight(this.scaleWeight(weight.real, scalar), this.scaleWeight(weight.imaginary, scalar));
    }
    haveSameWeightManagement(weightV1, weightV2) {
        if (this._weightManagement !== ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights) {
            if (weightV1.strictlyPositive === weightV2.strictlyPositive) {
                let haveSameWeightManagement = false;
                if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights && weightV1.strictlyPositive)
                    haveSameWeightManagement = true;
                if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights && !weightV1.strictlyPositive)
                    haveSameWeightManagement = true;
                return haveSameWeightManagement;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
}
exports.WeightManager = WeightManager;
