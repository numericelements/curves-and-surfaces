import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE } from "../ErrorMessages/RealVectorSpace";
import type { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import type { Real, RealVector, RealVector1D } from "./VectorSpaceConstructorInterface";
import { isVector1D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class RealVectorSpace1DStrategy implements IRealVectorSpaceStrategy<1> {

    readonly dimension = 1 as const;
    
    // Implementation for 1D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector1D(v1) && isVector1D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector1D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[]): RealVector1D {
        return coordinates[0];
    }

    defaultVect(): RealVector1D {
        return 0;
    }

    addDescriptors(a: RealVector1D, b: RealVector1D): RealVector1D {
        if(isVector1D(a) && isVector1D(b)) {
            return a + b;
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector1D): RealVector1D {
        if(isVector1D(v)) {
            return scalar * v;
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector1D, b: RealVector1D): RealVector1D {
        if(isVector1D(a) && isVector1D(b)) {
            return a - b;
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector1D): RealVector1D {
        if(isVector1D(v)) {
            return v;
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: RealVector1D): number {
        if(isVector1D(v)) {
            return Math.abs(v);
        } else {
            throw new RangeError();
        }
    }

    normalizeDescriptor(v: RealVector1D): RealVector1D {
        if(isVector1D(v)) {
            return v / this.normDescriptor(v);
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector1D, b: RealVector1D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        throw new RangeError(error.generateMessageString());
    }

    dotDescriptors(a: RealVector1D, b: RealVector1D): number {
        if(isVector1D(a) && isVector1D(b)) {
            return a * b;
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector1D, weight: Weight): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector1D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

}