import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE } from "../ErrorMessages/RealVectorSpace";
import type { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import type { Real, RealVector, RealVector4D } from "./VectorSpaceConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { createRealVector4DDescriptor } from "./VectorDescriptorFactory";

export class RealVectorSpace4DStrategy implements IRealVectorSpaceStrategy<4, RealVector4D> {

    readonly dimension = 4 as const;

    // Implementation for 4D vectors

    areSameDimension(a: RealVector, b: RealVector): boolean {
        if(isVector4D(a) && isVector4D(b)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector4D(v)) return true;
        return false;
    }

    createVector(coordinates: [number, number, number, number]): RealVector4D {
        return createRealVector4DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
    }

    defaultVect(): RealVector4D {
        return createRealVector4DDescriptor(0, 0, 0, 0);
    }

    addDescriptors(a: RealVector4D, b: RealVector4D): RealVector4D {
        if(isVector4D(a) && isVector4D(b)) {
            return createRealVector4DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1],
                a.coordinates[2] + b.coordinates[2], a.coordinates[3] + b.coordinates[3]);
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector4D, b: RealVector4D): RealVector4D {
        if(isVector4D(a) && isVector4D(b)) {
            return createRealVector4DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1],
                a.coordinates[2] - b.coordinates[2], a.coordinates[3] - b.coordinates[3]);
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector4D): RealVector4D {
        if(isVector4D(v)) {
            return createRealVector4DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1],
                scalar * v.coordinates[2], scalar * v.coordinates[3]);
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector4D): RealVector4D {
        if(isVector4D(v)) {
            return createRealVector4DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2], v.coordinates[3]);
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: RealVector4D): number {
        if(isVector4D(v)) {
            let result = 0;
            for(const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    normalizeDescriptor(v: RealVector4D): RealVector4D {
        if(isVector4D(v)) {
            const norm = this.normDescriptor(v);
            return createRealVector4DDescriptor(v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm, v.coordinates[3] / norm);
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector4D, b: RealVector4D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
        throw new RangeError(error.generateMessageString());
    }

    dotDescriptors(a: RealVector4D, b: RealVector4D): number {
        if(isVector4D(a) && isVector4D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2] + a.coordinates[3] * b.coordinates[3];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector4D, weight: Weight): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector4D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
  
}