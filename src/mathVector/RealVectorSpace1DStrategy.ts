import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE } from "../ErrorMessages/RealVectorSpace";
import { RealVectorSpaceStrategy } from "./RealVectorSpace";
import { Real, RealVector, RealVector1D } from "./VectorSpaceConstructorInterface";
import { isVector1D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class RealVectorSpace1DStrategy implements RealVectorSpaceStrategy<1> {
    
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

    addRaw(a: RealVector, b: RealVector): RealVector1D {
        if(isVector1D(a) && isVector1D(b)) {
            return a + b;
        } else {
            throw new RangeError();
        }
    }

    scaleRaw(scalar: Real, v: RealVector): RealVector1D {
        if(isVector1D(v)) {
            return scalar * v;
        } else {
            throw new RangeError();
        }
    }

    subtractRaw(a: RealVector, b: RealVector): RealVector1D {
        if(isVector1D(a) && isVector1D(b)) {
            return a - b;
        } else {
            throw new RangeError();
        }
    }

    cloneRaw(v: RealVector): RealVector1D {
        if(isVector1D(v)) {
            return v;
        } else {
            throw new RangeError();
        }
    }

    normRaw(v: RealVector): number {
        if(isVector1D(v)) {
            return Math.abs(v);
        } else {
            throw new RangeError();
        }
    }

    normalizeRaw(v: RealVector): RealVector1D {
        if(isVector1D(v)) {
            return v / this.normRaw(v);
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector, b: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        throw new RangeError(error.generateMessageString());
    }

    dotRaw(a: RealVector, b: RealVector): number {
        if(isVector1D(a) && isVector1D(b)) {
            return a * b;
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

}