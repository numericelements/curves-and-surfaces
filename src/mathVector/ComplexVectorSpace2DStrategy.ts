import { EM_DOT_PRODUCT_NOT_APPLICABLE_DIM2, EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D } from "../namedConstants/VectorTypeTags";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { addComplexUsingDescriptors, multiplyComplexUsingDescriptors, subtractComplexUsingDescriptors } from "./ComplexNumberFactory";
import { ComplexVectorSpaceStrategy } from "./ComplexVectorSpace";
import { IComplex, ComplexVector, ComplexVector2D, IComplexWeight } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ComplexVectorSpace2DStrategy implements ComplexVectorSpaceStrategy<2> {

    // Implementation for 2D vectors

    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ComplexVector): v is ComplexVector {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: number[][]): ComplexVector2D {
        const complex1: IComplex = {type: COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1]};
        const complex2: IComplex = {type: COMPLEX, real: coordinates[1][0], imaginary: coordinates[1][1]};
        return {type: COMPLEXVECTOR2D, coordinates: [complex1, complex2]};
    }

    defaultVect(): ComplexVector2D {
        const nullComplex: IComplex = {type: COMPLEX, real: 0, imaginary: 0};
        return {type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex]};
    }

    addRaw(a: ComplexVector, b: ComplexVector): ComplexVector2D {
        if (isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                addComplexUsingDescriptors(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            throw new RangeError();
        }
    }

    normRaw(vector: ComplexVector): number {
        if(isVector2D(vector)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
            throw new RangeError(error.generateMessageString());
        } else {
            throw new RangeError();
        }
    }

    dotRaw(a: ComplexVector, b: ComplexVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_DOT_PRODUCT_NOT_APPLICABLE_DIM2);
        throw new RangeError(error.generateMessageString());
    }

    scaleRaw(scaleFactor: IComplex, vector: ComplexVector): ComplexVector2D;
    scaleRaw(scaleFactor: number, vector: ComplexVector): ComplexVector2D;
    scaleRaw(scaleFactor: IComplex | number, vector: ComplexVector): ComplexVector2D {
        if (typeof scaleFactor === 'number') {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => ({type: COMPLEX, real: val.real * scaleFactor, imaginary: val.imaginary * scaleFactor}));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginary: result[0].imaginary},
                    {type: COMPLEX, real: result[1].real, imaginary: result[1].imaginary}
                ]};
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => multiplyComplexUsingDescriptors(scaleFactor, val));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginary: result[0].imaginary},
                    {type: COMPLEX, real: result[1].real, imaginary: result[1].imaginary}
                ]};
            } else {
                throw new RangeError();
            }
        }
    }

    subtractRaw(a: ComplexVector, b: ComplexVector): ComplexVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                subtractComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                subtractComplexUsingDescriptors(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            throw new RangeError();
        }
    }

    cloneRaw(vector: ComplexVector): ComplexVector2D {
        if(isVector2D(vector)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                {type: COMPLEX, real: vector.coordinates[0].real, imaginary: vector.coordinates[0].imaginary},
                {type: COMPLEX, real: vector.coordinates[1].real, imaginary: vector.coordinates[1].imaginary}
            ]};
        } else {
            throw new RangeError();
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

}

