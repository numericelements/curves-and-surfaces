import { EM_DOT_PRODUCT_NOT_APPLICABLE_DIM2, EM_TRANSFORMATION_NOT_AVAILABLE } from "../../ErrorMessages/ComplexVectorSpace";
import { addComplexUsingDescriptors, multiplyComplexUsingDescriptors, subtractComplexUsingDescriptors } from "../ComplexNumberFactory";
import type { ComplexVectorSpaceStrategy } from "../interfaces/VectorSpaceStrategyInterfaces";
import { createComplexVector1DDescriptor, createComplexVector2DDescriptor } from "../VectorDescriptorFactory";
import type { ComplexDesc, ComplexVector2D, ComplexWeightDesc } from "../VectorDescriptorConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "../VectorSpaceUtilities";
import type { ComplexVectorDesc } from "../utilityTypes/VectorDescriptorTypes";


export class ComplexVectorSpace2DStrategy implements ComplexVectorSpaceStrategy<2, ComplexVector2D> {

    // Implementation for 2D vectors

    areSameDimension(v1: ComplexVectorDesc, v2: ComplexVectorDesc): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ComplexVectorDesc): v is ComplexVectorDesc {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: readonly (readonly number[])[]): ComplexVector2D {
        const complex1: ComplexDesc = createComplexVector1DDescriptor(coordinates[0][0], coordinates[0][1]);
        const complex2: ComplexDesc = createComplexVector1DDescriptor(coordinates[1][0], coordinates[1][1]);
        return createComplexVector2DDescriptor(complex1, complex2);
    }

    defaultVect(): ComplexVector2D {
        const nullComplex: ComplexDesc = createComplexVector1DDescriptor();
        return createComplexVector2DDescriptor(nullComplex, nullComplex);
    }

    addDescriptors(a: ComplexVectorDesc, b: ComplexVectorDesc): ComplexVector2D {
        if (isVector2D(a) && isVector2D(b)) {
            return createComplexVector2DDescriptor(
                addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                addComplexUsingDescriptors(a.coordinates[1], b.coordinates[1])
            );
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(vector: ComplexVectorDesc): number {
        if(isVector2D(vector)) {
            let result = 0;
            for(const component of vector.coordinates) {
                result += Math.pow(component.real, 2) + Math.pow(component.imaginary, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    dotDescriptors(a: ComplexVectorDesc, b: ComplexVectorDesc): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_DOT_PRODUCT_NOT_APPLICABLE_DIM2);
        throw new RangeError(error.generateMessageString());
    }

    scaleDescriptor(scaleFactor: ComplexDesc, vector: ComplexVectorDesc): ComplexVector2D;
    scaleDescriptor(scaleFactor: number, vector: ComplexVectorDesc): ComplexVector2D;
    scaleDescriptor(scaleFactor: ComplexDesc | number, vector: ComplexVectorDesc): ComplexVector2D {
        if (typeof scaleFactor === 'number') {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => (createComplexVector1DDescriptor(val.real * scaleFactor, val.imaginary * scaleFactor)));
                return createComplexVector2DDescriptor(
                    createComplexVector1DDescriptor(result[0].real, result[0].imaginary),
                    createComplexVector1DDescriptor(result[1].real, result[1].imaginary)
                );
            } else {
                throw new RangeError();
            }
        } else {
            if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => multiplyComplexUsingDescriptors(scaleFactor, val));
                return createComplexVector2DDescriptor(
                    createComplexVector1DDescriptor(result[0].real, result[0].imaginary),
                    createComplexVector1DDescriptor(result[1].real, result[1].imaginary)
                );
            } else {
                throw new RangeError();
            }
        }
    }

    subtractDescriptors(a: ComplexVectorDesc, b: ComplexVectorDesc): ComplexVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return createComplexVector2DDescriptor(
                subtractComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
                subtractComplexUsingDescriptors(a.coordinates[1], b.coordinates[1])
            );
        } else {
            throw new RangeError();
        }
    }

    cloneVector(vector: ComplexVectorDesc): ComplexVector2D {
        if(isVector2D(vector)) {
            return createComplexVector2DDescriptor(
                createComplexVector1DDescriptor(vector.coordinates[0].real, vector.coordinates[0].imaginary),
                createComplexVector1DDescriptor(vector.coordinates[1].real, vector.coordinates[1].imaginary)
            );
        } else {
            throw new RangeError();
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVectorDesc): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVectorDesc, weight: ComplexWeightDesc): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

}

