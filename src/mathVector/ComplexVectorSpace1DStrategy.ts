import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { ComplexVectorSpaceStrategy } from "./ComplexVectorSpace";
import { COMPLEX, Complex, ComplexVector, ComplexVector1D, COMPLEXWEIGHT, ComplexWeight, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, RealVector, REALVECTOR2D } from "./VectorSpaceConstructorInterface";
import { isVector1D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class ComplexVectorSpace1DStrategy implements ComplexVectorSpaceStrategy<1> {

    // Implementation for 1D vectors

    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean {
        if(isVector1D(v1) && isVector1D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ComplexVector): v is Complex {
        if(isVector1D(v)) return true;
        return false;
    }

    createVector(coordinates: number[][]): ComplexVector1D {
        let vector: Complex = {type: COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1]};
        return vector;
    }

    defaultVect(): ComplexVector1D {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginary: 0};
        return nullComplex;
    }

    add(a: ComplexVector, b: ComplexVector): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return ComplexOperators.add(a as Complex, b as Complex);
        } else {
            throw new RangeError();
        }
    }

    norm(vector: ComplexVector): number {
        if(isVector1D(vector)) {
            return Math.sqrt(vector.real * vector.real + vector.imaginary * vector.imaginary);
        } else {
            throw new RangeError();
        }
    }

    // Overloaded scale method
    scale(scaleFactor: Complex, vector: ComplexVector): ComplexVector1D;
    scale(scaleFactor: number, vector: ComplexVector): ComplexVector1D;
    scale(scaleFactor: Complex | number, vector: ComplexVector): ComplexVector1D {
        if (typeof scaleFactor === 'number') {
            if(isVector1D(vector)) {
                return {type: COMPLEX, real: scaleFactor * vector.real, imaginary: scaleFactor * vector.imaginary};
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector1D(vector)) {
                return {type: COMPLEX,
                    real: ComplexOperators.multiply(scaleFactor, vector).real,
                    imaginary: ComplexOperators.multiply(scaleFactor, vector).imaginary}
            } else {
                throw new RangeError();
            }
        }
    }

    subtract(a: ComplexVector, b: ComplexVector): ComplexVector1D {
        if (isVector1D(a) && isVector1D(b)) {
            return ComplexOperators.subtract(a as Complex, b as Complex);
        } else {
            throw new RangeError();
        }
    }

    clone(vector: ComplexVector): ComplexVector1D {
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

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}): ProjectiveComplexVector {
        if(isVector1D(vector)) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [vector, weight]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

}