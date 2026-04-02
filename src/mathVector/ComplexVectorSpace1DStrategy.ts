import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { PROJECTIVECOMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { addComplexUsingDescriptors, multiplyComplexUsingDescriptors, subtractComplexUsingDescriptors } from "./ComplexNumberFactory";
import type { IComplexVectorSpaceStrategy } from "./strategies/interfaces/IComplexVectorSpaceStrategy";
import { createComplexVector1DDescriptor, createComplexWeightDescriptor, createProjectiveComplexVector1DDescriptor, createRealVector2DDescriptor } from "./VectorDescriptorFactory";
import type { IComplex, ComplexVector, ComplexVector1D, IComplexWeight, RealVector2D, ProjectiveComplexVector1D } from "./VectorSpaceConstructorInterface";
import { isVector1D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class ComplexVectorSpace1DStrategy implements IComplexVectorSpaceStrategy<1, ComplexVector1D> {

    // Implementation for 1D vectors

    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean {
        if(isVector1D(v1) && isVector1D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ComplexVector): v is IComplex {
        if(isVector1D(v)) return true;
        return false;
    }

    createVector(coordinates: number[][]): ComplexVector1D {
        let vector: IComplex = createComplexVector1DDescriptor(coordinates[0][0], coordinates[0][1]);
        return vector;
    }

    defaultVect(): ComplexVector1D {
        const nullComplex: IComplex = createComplexVector1DDescriptor();
        return nullComplex;
    }

    addDescriptors(a: ComplexVector1D, b: ComplexVector1D): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return addComplexUsingDescriptors(a, b);
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(vector: ComplexVector1D): number {
        if(isVector1D(vector)) {
            return Math.sqrt(vector.real * vector.real + vector.imaginary * vector.imaginary);
        } else {
            throw new RangeError();
        }
    }

    dotDescriptors(a: ComplexVector1D, b: ComplexVector1D): number {
        if(isVector1D(a) && isVector1D(b)) {
            return a.real * b.real + a.imaginary * b.imaginary;
        } else {
            throw new RangeError();
        }
    }

    // Overloaded scale method
    scaleDescriptor(scaleFactor: IComplex, vector: ComplexVector1D): ComplexVector1D;
    scaleDescriptor(scaleFactor: number, vector: ComplexVector1D): ComplexVector1D;
    scaleDescriptor(scaleFactor: IComplex | number, vector: ComplexVector1D): ComplexVector1D {
        if (typeof scaleFactor === 'number') {
            if(isVector1D(vector)) {
                return createComplexVector1DDescriptor(scaleFactor * vector.real, scaleFactor * vector.imaginary);
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector1D(vector)) {
                const result = multiplyComplexUsingDescriptors(scaleFactor, vector);
                return createComplexVector1DDescriptor(result.real, result.imaginary);
            } else {
                throw new RangeError();
            }
        }
    }

    subtractDescriptors(a: ComplexVector1D, b: ComplexVector1D): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return subtractComplexUsingDescriptors(a, b);
        } else {
            throw new RangeError();
        }
    }

    cloneVector(vector: ComplexVector1D): ComplexVector1D {
        if(isVector1D(vector)) {
            return createComplexVector1DDescriptor(vector.real, vector.imaginary);
        } else {
            throw new RangeError();
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector1D): RealVector2D {
        if(isVector1D(vector)) {
            return createRealVector2DDescriptor(vector.real, vector.imaginary);
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector1D,
        weight: IComplexWeight = createComplexWeightDescriptor(new Weight(DEFAULT_WEIGHT_VALUE), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false))): ProjectiveComplexVector1D {
        
            if(isVector1D(vector)) {
            return createProjectiveComplexVector1DDescriptor(vector, weight);
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

}