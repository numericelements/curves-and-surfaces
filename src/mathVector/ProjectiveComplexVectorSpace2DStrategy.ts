import { EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE } from "../ErrorMessages/ProjectiveComplexVectorSpace";
import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/ProjectiveVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { ComplexOperators } from "./ComplexOperators";
import { ProjectiveComplexVectorSpaceStrategy } from "./ProjectiveComplexVectorSpace";
import { Complex, COMPLEX, ComplexVector1D, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveComplexVector1D, Real, WEIGHT } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

export class ProjectiveComplexVectorSpace2DStrategy implements ProjectiveComplexVectorSpaceStrategy<1> {
    // Implementation for 2D vectors

    getWeight(v: ProjectiveComplexVector1D): Real {
        if(this.isInVectorSpace(v)) {
            return v.coordinates[1].real.weight;
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    shareSameWeightManagement(v1: ProjectiveComplexVector1D, v2: ProjectiveComplexVector1D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[1].real;
            const weight2 = v2.coordinates[1].real;
            return weightManager.isSameWeightManagement(weight1, weight2);
        } else {
            if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    areSameDimension(v1: ProjectiveComplexVector1D, v2: ProjectiveComplexVector1D): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveComplexVector1D): v is ProjectiveComplexVector {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveComplexVector1D {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: coordinates[0], imaginary: coordinates[1]}, {type: COMPLEXWEIGHT,
                real: weightManager.setWeightStatus(new Weight(coordinates[2], false)), imaginary: weightManager.setWeightStatus(new Weight(coordinates[3], false))}]};
            return vector;
        } else {
            let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: coordinates[0], imaginary: coordinates[1]}, {type: COMPLEXWEIGHT, 
                real: weightManager.setWeightStatus(new Weight(coordinates[2])), imaginary: weightManager.setWeightStatus(new Weight(coordinates[3]))}]};
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveComplexVector1D {
        let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 1}, {type: COMPLEXWEIGHT, 
            real: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE)), imaginary: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE))}]};
        return vector;
    }

    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector1D {
        if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive === true && b.coordinates[1].real.strictlyPositive === true) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1])]
            };
        } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            const complexWeight = ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1]);
            if(complexWeight.real.strictlyPositive === true && complexWeight.imaginary.strictlyPositive === false) {
                complexWeight.real = new Weight(complexWeight.real.weight, false);
            } else if(complexWeight.real.strictlyPositive === false && complexWeight.imaginary.strictlyPositive === true) {
                complexWeight.imaginary = new Weight(complexWeight.imaginary.weight, false);
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                complexWeight]
            };
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    norm(v: ProjectiveComplexVector): number {
        if(isVector1D(v)) {
            let result = 0;
            result = Math.sqrt(v.coordinates[0].real * v.coordinates[0].real + v.coordinates[0].imaginary * v.coordinates[0].imaginary);
            result+= v.coordinates[1].real.weight * v.coordinates[1].real.weight + v.coordinates[1].imaginary.weight * v.coordinates[1].imaginary.weight; 
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    scale(scaleFactor: Complex | number, vector: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if (typeof scaleFactor === 'number') {
            if(vector.coordinates[1].real.strictlyPositive === true) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.weight * scaleFactor), imaginary: new Weight(vector.coordinates[1].imaginary.weight * scaleFactor)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else if (weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.weight * scaleFactor, false), imaginary: new Weight(vector.coordinates[1].imaginary.weight * scaleFactor, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const scaledWeight = ComplexOperators.multiplyWeight(scaleFactor, vector.coordinates[1]);
            if(weightManager.weightManagement === WeightManagement.AllPositiveWeights && (scaledWeight.real.strictlyPositive === false && scaledWeight.imaginary.strictlyPositive === true)) {
                scaledWeight.imaginary = new Weight(scaledWeight.imaginary.weight, false);
            } else if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                if(scaledWeight.real.strictlyPositive === false || scaledWeight.imaginary.strictlyPositive === false) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                    throw new RangeError(error.generateMessageString());
                }
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).real, imaginary: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).imaginary},
            scaledWeight]};
        }
    }

    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive === true && b.coordinates[1].real.strictlyPositive === true) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1])]
            };
        } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            const complexWeight = ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1]);
            if(complexWeight.real.strictlyPositive === true && complexWeight.imaginary.strictlyPositive === false) {
                complexWeight.real = new Weight(complexWeight.real.weight, false);
            } else if(complexWeight.real.strictlyPositive === false && complexWeight.imaginary.strictlyPositive === true) {
                complexWeight.imaginary = new Weight(complexWeight.imaginary.weight, false);
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                complexWeight]
            };
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    clone(vector: ProjectiveComplexVector): ProjectiveComplexVector {
        return {type: vector.type, coordinates: [
            {type: vector.coordinates[0].type, real: vector.coordinates[0].real, imaginary: vector.coordinates[0].imaginary},
            {type: vector.coordinates[1].type, real: vector.coordinates[1].real, imaginary: vector.coordinates[1].imaginary}
        ]};
    }

    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector: ProjectiveComplexVector, weightManager: WeightManager): ComplexVector1D {
        let real = 0;
        let imaginary = 0;
        if(vector.coordinates[1].real.weight === 0 && weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            real = vector.coordinates[0].real;
        } else if (vector.coordinates[1].real.weight > 0 ) {
            real = vector.coordinates[0].real / vector.coordinates[1].real.weight;
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        if(vector.coordinates[1].imaginary.weight === 0 && weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            imaginary = vector.coordinates[0].imaginary;
        } else if (vector.coordinates[1].imaginary.weight > 0 ) {
            imaginary = vector.coordinates[0].imaginary / vector.coordinates[1].imaginary.weight;
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        return {type: COMPLEX, real: real, imaginary: imaginary};
    }
}