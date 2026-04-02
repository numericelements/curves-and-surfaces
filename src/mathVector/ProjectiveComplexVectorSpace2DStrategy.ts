import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { PROJECTIVECOMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { addComplexUsingDescriptors, multiplyComplexUsingDescriptors, multiplyComplexWeightsUsingDescriptors, subtractComplexUsingDescriptors } from "./ComplexNumberFactory";
import { ComplexWeight } from "./ComplexWeight";
import type { IProjectiveComplexVectorSpaceStrategy } from "./strategies/interfaces/IProjectiveComplexVectorSpaceStrategy";
import { createComplexVector1DDescriptor, createComplexWeightDescriptor, createProjectiveComplexVector1DDescriptor } from "./VectorDescriptorFactory";
import type { IComplex, ComplexVector1D, IComplexWeight, ProjectiveComplexVector, ProjectiveComplexVector1D, Real, } from "./VectorSpaceConstructorInterface";
import { isVector2D } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import type { WeightManager } from "./WeightManager";

export class ProjectiveComplexVectorSpace2DStrategy implements IProjectiveComplexVectorSpaceStrategy<1, ProjectiveComplexVector1D> {
    // Implementation for 2D vectors

    getWeight(v: ProjectiveComplexVector1D): IComplexWeight {
        return v.coordinates[1];
    }

    shareSameWeightManagement(v1: ProjectiveComplexVector1D, v2: ProjectiveComplexVector1D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[1].real;
            const weight2 = v2.coordinates[1].real;
            return weightManager.haveSameWeightManagement(weight1, weight2);
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
        const coordinatesDescriptor: IComplex = createComplexVector1DDescriptor(coordinates[0], coordinates[1]);
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            const complexWeightDescriptor: IComplexWeight = createComplexWeightDescriptor(weightManager.createWeightFromValueOnly(coordinates[2]), weightManager.createWeightFromValueOnly(coordinates[3]));
            const vector: ProjectiveComplexVector = createProjectiveComplexVector1DDescriptor(coordinatesDescriptor, complexWeightDescriptor);
            return vector;
        } else {
            const complexWeightDescriptor: IComplexWeight = createComplexWeightDescriptor(weightManager.createWeightFromValueOnly(coordinates[2]), weightManager.createWeightFromValueOnly(coordinates[3]));
            const vector: ProjectiveComplexVector = createProjectiveComplexVector1DDescriptor(coordinatesDescriptor, complexWeightDescriptor);
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveComplexVector1D {
        let vector: ProjectiveComplexVector = createProjectiveComplexVector1DDescriptor(
            createComplexVector1DDescriptor(),
            createComplexWeightDescriptor(
                weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE),
                weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE)
            )
        );
        return vector;
    }

    addDescriptors(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector1D {
        if(isVector2D(a) && isVector2D(b)) {
            const complexWa = new ComplexWeight(a.coordinates[1].real, a.coordinates[1].imaginary);
            const complexWb = new ComplexWeight(b.coordinates[1].real, b.coordinates[1].imaginary);
            const sumWeights = weightManager.addComplexWeights(complexWa, complexWb);
            return createProjectiveComplexVector1DDescriptor(
                addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                createComplexWeightDescriptor(sumWeights.real, sumWeights.imaginary)
            );
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: ProjectiveComplexVector): number {
        if(isVector2D(v)) {
            let result = 0;
            result = v.coordinates[0].real * v.coordinates[0].real + v.coordinates[0].imaginary * v.coordinates[0].imaginary;
            result+= v.coordinates[1].real.value * v.coordinates[1].real.value + v.coordinates[1].imaginary.value * v.coordinates[1].imaginary.value; 
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scaleFactor: IComplex | number, vector: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if (typeof scaleFactor === 'number') {
            if(vector.coordinates[1].real.strictlyPositive) {
                const scaledWeight: IComplexWeight = createComplexWeightDescriptor(new Weight(vector.coordinates[1].real.value * scaleFactor), new Weight(vector.coordinates[1].imaginary.value * scaleFactor));
                return createProjectiveComplexVector1DDescriptor(
                    createComplexVector1DDescriptor(vector.coordinates[0].real * scaleFactor, vector.coordinates[0].imaginary * scaleFactor),
                    scaledWeight
                );
            } else if (weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
                const scaledWeight: IComplexWeight = createComplexWeightDescriptor(new Weight(vector.coordinates[1].real.value * scaleFactor, false), new Weight(vector.coordinates[1].imaginary.value * scaleFactor, false));
                return createProjectiveComplexVector1DDescriptor(
                    createComplexVector1DDescriptor(vector.coordinates[0].real * scaleFactor, vector.coordinates[0].imaginary * scaleFactor),
                    scaledWeight
                );
            } else {
                throw new RangeError();
            }
        } else {
            let scaledWeight = multiplyComplexWeightsUsingDescriptors(scaleFactor, vector.coordinates[1]);
            if(weightManager.weightManagement === WeightManagement.AllPositiveWeights && (!scaledWeight.real.strictlyPositive && scaledWeight.imaginary.strictlyPositive)) {
                scaledWeight = createComplexWeightDescriptor(scaledWeight.real, new Weight(scaledWeight.imaginary.value, false));
            } else if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                if(!scaledWeight.real.strictlyPositive || !scaledWeight.imaginary.strictlyPositive) {
                    throw new RangeError();
                }
            }
            return createProjectiveComplexVector1DDescriptor(
                createComplexVector1DDescriptor(multiplyComplexUsingDescriptors(vector.coordinates[0], scaleFactor).real, multiplyComplexUsingDescriptors(vector.coordinates[0], scaleFactor).imaginary),
                scaledWeight
            );
        }
    }

    subtractDescriptors(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVector {
        if(isVector2D(a) && isVector2D(b)) {
            const complexWa = new ComplexWeight(a.coordinates[1].real, a.coordinates[1].imaginary);
            const complexWb = new ComplexWeight(b.coordinates[1].real, b.coordinates[1].imaginary);
            const sumWeights = weightManager.subtractComplexWeights(complexWa, complexWb);
            return createProjectiveComplexVector1DDescriptor(
                subtractComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                createComplexWeightDescriptor(sumWeights.real, sumWeights.imaginary)
            );
        } else {
            throw new RangeError();
        }
    }

    cloneVector(vector: ProjectiveComplexVector): ProjectiveComplexVector {
        return createProjectiveComplexVector1DDescriptor(
            createComplexVector1DDescriptor(vector.coordinates[0].real, vector.coordinates[0].imaginary),
            createComplexWeightDescriptor(vector.coordinates[1].real, vector.coordinates[1].imaginary)
        );
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
        return createComplexVector1DDescriptor(real, imaginary);
    }
}