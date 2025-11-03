import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { ComplexOperators } from "./ComplexOperators";
import { ProjectiveComplexVectorSpaceStrategy } from "./ProjectiveComplexVectorSpace";
import { Complex, COMPLEX, ComplexVector1D, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveComplexVector1D, Real, } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

export class ProjectiveComplexVectorSpace2DStrategy implements ProjectiveComplexVectorSpaceStrategy<1> {
    // Implementation for 2D vectors

    getWeight(v: ProjectiveComplexVector1D): ComplexWeight {
        return v.coordinates[1];
    }

    shareSameWeightManagement(v1: ProjectiveComplexVector1D, v2: ProjectiveComplexVector1D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[1].real;
            const weight2 = v2.coordinates[1].real;
            return weightManager.isSameWeightManagement(weight1, weight2);
        } else {
            throw new RangeError();
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
                real: weightManager.createWeightFromValueOnly(coordinates[2]), imaginary: weightManager.createWeightFromValueOnly(coordinates[3])}]};
            return vector;
        } else {
            let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: coordinates[0], imaginary: coordinates[1]}, {type: COMPLEXWEIGHT, 
                real: weightManager.createWeightFromValueOnly(coordinates[2]), imaginary: weightManager.createWeightFromValueOnly(coordinates[3])}]};
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveComplexVector1D {
        let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 1}, {type: COMPLEXWEIGHT, 
            real: weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE), imaginary: weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE)}]};
        return vector;
    }

    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector1D {
        if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1])]
            };
        } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            const complexWeight = ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1]);
            if(complexWeight.real.strictlyPositive && !complexWeight.imaginary.strictlyPositive) {
                complexWeight.real = new Weight(complexWeight.real.value, false);
            } else if(!complexWeight.real.strictlyPositive && complexWeight.imaginary.strictlyPositive) {
                complexWeight.imaginary = new Weight(complexWeight.imaginary.value, false);
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                complexWeight]
            };
        } else {
            throw new RangeError();
        }
    }

    norm(v: ProjectiveComplexVector): number {
        if(isVector1D(v)) {
            let result = 0;
            result = Math.sqrt(v.coordinates[0].real * v.coordinates[0].real + v.coordinates[0].imaginary * v.coordinates[0].imaginary);
            result+= v.coordinates[1].real.value * v.coordinates[1].real.value + v.coordinates[1].imaginary.value * v.coordinates[1].imaginary.value; 
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    scale(scaleFactor: Complex | number, vector: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if (typeof scaleFactor === 'number') {
            if(vector.coordinates[1].real.strictlyPositive) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.value * scaleFactor), imaginary: new Weight(vector.coordinates[1].imaginary.value * scaleFactor)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else if (weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.value * scaleFactor, false), imaginary: new Weight(vector.coordinates[1].imaginary.value * scaleFactor, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else {
                throw new RangeError();
            }
        } else {
            const scaledWeight = ComplexOperators.multiplyWeight(scaleFactor, vector.coordinates[1]);
            if(weightManager.weightManagement === WeightManagement.AllPositiveWeights && (!scaledWeight.real.strictlyPositive && scaledWeight.imaginary.strictlyPositive)) {
                scaledWeight.imaginary = new Weight(scaledWeight.imaginary.value, false);
            } else if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                if(!scaledWeight.real.strictlyPositive || !scaledWeight.imaginary.strictlyPositive) {
                    throw new RangeError();
                }
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).real, imaginary: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).imaginary},
            scaledWeight]};
        }
    }

    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1])]
            };
        } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            const complexWeight = ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1]);
            if(complexWeight.real.strictlyPositive && !complexWeight.imaginary.strictlyPositive) {
                complexWeight.real = new Weight(complexWeight.real.value, false);
            } else if(!complexWeight.real.strictlyPositive && complexWeight.imaginary.strictlyPositive) {
                complexWeight.imaginary = new Weight(complexWeight.imaginary.value, false);
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                complexWeight]
            };
        } else {
            throw new RangeError();
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
        if(vector.coordinates[1].real.value === 0 && weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            real = vector.coordinates[0].real;
        } else if (vector.coordinates[1].real.value > 0 ) {
            real = vector.coordinates[0].real / vector.coordinates[1].real.value;
        } else {
            throw new RangeError();
        }
        if(vector.coordinates[1].imaginary.value === 0 && weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            imaginary = vector.coordinates[0].imaginary;
        } else if (vector.coordinates[1].imaginary.value > 0 ) {
            imaginary = vector.coordinates[0].imaginary / vector.coordinates[1].imaginary.value;
        } else {
            throw new RangeError();
        }
        return {type: COMPLEX, real: real, imaginary: imaginary};
    }
}