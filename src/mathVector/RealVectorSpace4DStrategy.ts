import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE } from "../ErrorMessages/RealVectorSpace";
import { RealVectorSpaceStrategy } from "./RealVectorSpace";
import { Real, RealVector, RealVector4D, REALVECTOR4D } from "./VectorSpaceConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export class RealVectorSpace4DStrategy implements RealVectorSpaceStrategy<4> {
    // Implementation for 4D vectors

    areSameDimension(a: RealVector, b: RealVector): boolean {
        if(isVector4D(a) && isVector4D(b)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector4D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[]): RealVector4D {
        let vector: RealVector4D = {type: REALVECTOR4D, coordinates: [coordinates[0], coordinates[1], coordinates[2], coordinates[3]]};
        return vector;
    }

    defaultVect(): RealVector4D {
        return {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
    }

    add(a: RealVector, b: RealVector): RealVector4D {
        if(isVector4D(a) && isVector4D(b)) {
            return {type: REALVECTOR4D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], a.coordinates[3] + b.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector4D {
        if(isVector4D(a) && isVector4D(b)) {
            return {type: REALVECTOR4D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], a.coordinates[3] - b.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: RealVector): RealVector4D {
        if(isVector4D(v)) {
            return {type: REALVECTOR4D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scalar * v.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: RealVector): RealVector4D {
        if(isVector4D(v)) {
            return {type: REALVECTOR4D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], v.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    norm(v: RealVector): number {
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

    normalize(v: RealVector): RealVector4D {
        if(isVector4D(v)) {
            const norm = this.norm(v);
            return {type: REALVECTOR4D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm, v.coordinates[3] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProduct(a: RealVector, b: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
        throw new RangeError(error.generateMessageString());
    }

    dot(a: RealVector, b: RealVector): number {
        if(isVector4D(a) && isVector4D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2] + a.coordinates[3] * b.coordinates[3];
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