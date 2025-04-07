import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { ComplexVectorSpaceStrategy } from "./ComplexVectorSpace";
import { COMPLEX, Complex, ComplexVector, ComplexVector2D, COMPLEXVECTOR2D, COMPLEXWEIGHT, ComplexWeight } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ComplexVectorSpace2DStrategy implements ComplexVectorSpaceStrategy {

    // Implementation for 1D vectors

    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ComplexVector): v is ComplexVector {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: number[][]): ComplexVector2D {
        const complex1: Complex = {type: COMPLEX, real: coordinates[0][0], imaginery: coordinates[0][1]};
        const complex2: Complex = {type: COMPLEX, real: coordinates[1][0], imaginery: coordinates[1][1]};
        return {type: COMPLEXVECTOR2D, coordinates: [complex1, complex2]};
    }

    defaultVect(): ComplexVector2D {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginery: 0};
        return {type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex]};
    }

    add(a: ComplexVector, b: ComplexVector): ComplexVector2D {
        if (isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.add(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Complex, vector: ComplexVector): ComplexVector2D;
    scale(scalar: number, vector: ComplexVector): ComplexVector2D;
    // Implementation of the scale method
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVector2D {
        if (typeof scalar === 'number') {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => ({type: COMPLEX, real: val.real * scalar, imaginery: val.imaginery * scalar}));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginery: result[0].imaginery},
                    {type: COMPLEX, real: result[1].real, imaginery: result[1].imaginery}
                ]};
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => ComplexOperators.multiply(scalar, val));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginery: result[0].imaginery},
                    {type: COMPLEX, real: result[1].real, imaginery: result[1].imaginery}
                ]};
            } else {
                throw new RangeError();
            }
        }
    }

    subtract(a: ComplexVector, b: ComplexVector): ComplexVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.subtract(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            throw new RangeError();
        }
    }

    clone(vector: ComplexVector): ComplexVector2D {
        if(isVector2D(vector)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                {type: COMPLEX, real: vector.coordinates[0].real, imaginery: vector.coordinates[0].imaginery},
                {type: COMPLEX, real: vector.coordinates[1].real, imaginery: vector.coordinates[1].imaginery}
            ]};
        } else {
            throw new RangeError();
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginery: new Weight()}): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

}

