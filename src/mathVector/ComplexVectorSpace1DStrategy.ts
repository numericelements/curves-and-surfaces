import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { PROJECTIVECOMPLEXVECTOR1D, REALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { addComplexUsingDescriptors, multiplyComplexUsingDescriptors, subtractComplexUsingDescriptors } from "./ComplexNumberFactory";
import type { IComplexVectorSpaceStrategy } from "./strategies/interfaces/IComplexVectorSpaceStrategy";
import type { IComplex, ComplexVector, ComplexVector1D, IComplexWeight, ProjectiveComplexVector, RealVector } from "./VectorSpaceConstructorInterface";
import { isVector1D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class ComplexVectorSpace1DStrategy implements IComplexVectorSpaceStrategy<1> {

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
        let vector: IComplex = {type: COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1]};
        return vector;
    }

    defaultVect(): ComplexVector1D {
        const nullComplex: IComplex = {type: COMPLEX, real: 0, imaginary: 0};
        return nullComplex;
    }

    addDescriptors(a: ComplexVector, b: ComplexVector): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return addComplexUsingDescriptors(a as IComplex, b as IComplex);
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(vector: ComplexVector): number {
        if(isVector1D(vector)) {
            return Math.sqrt(vector.real * vector.real + vector.imaginary * vector.imaginary);
        } else {
            throw new RangeError();
        }
    }

    dotDescriptors(a: ComplexVector, b: ComplexVector): number {
        if(isVector1D(a) && isVector1D(b)) {
            return a.real * b.real + a.imaginary * b.imaginary;
        } else {
            throw new RangeError();
        }
    }

    // Overloaded scale method
    scaleDescriptor(scaleFactor: IComplex, vector: ComplexVector): ComplexVector1D;
    scaleDescriptor(scaleFactor: number, vector: ComplexVector): ComplexVector1D;
    scaleDescriptor(scaleFactor: IComplex | number, vector: ComplexVector): ComplexVector1D {
        if (typeof scaleFactor === 'number') {
            if(isVector1D(vector)) {
                return {type: COMPLEX, real: scaleFactor * vector.real, imaginary: scaleFactor * vector.imaginary};
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector1D(vector)) {
                return {type: COMPLEX,
                    real: multiplyComplexUsingDescriptors(scaleFactor, vector).real,
                    imaginary: multiplyComplexUsingDescriptors(scaleFactor, vector).imaginary}
            } else {
                throw new RangeError();
            }
        }
    }

    subtractDescriptors(a: ComplexVector, b: ComplexVector): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return subtractComplexUsingDescriptors(a as IComplex, b as IComplex);
        } else {
            throw new RangeError();
        }
    }

    cloneVector(vector: ComplexVector): ComplexVector1D {
        if(isVector1D(vector)) {
            return {type: COMPLEX, real: vector.real, imaginary: vector.imaginary};
        } else {
            throw new RangeError();
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector): RealVector {
        if(isVector1D(vector)) {
            return {type: REALVECTOR2D, coordinates: [vector.real, vector.imaginary]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}): ProjectiveComplexVector {
        if(isVector1D(vector)) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [vector, weight]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

}