import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/RealVectorSpace";
import { PROJECTIVEVECTOR3D, REALVECTOR3D } from "../namedConstants/VectorTypeTags";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import { ProjectiveVector3D, Real, RealVector, RealVector3D } from "./VectorSpaceConstructorInterface";
import { isVector3D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

  
export class RealVectorSpace3DStrategy implements IRealVectorSpaceStrategy<3> {
    // Implementation for 3D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector3D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[]): RealVector3D {
        let vector: RealVector3D = {type: REALVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2]]};
        return vector;
    }

    defaultVect(): RealVector3D {
        return {type: REALVECTOR3D, coordinates: [0, 0, 0]};
    }

    addDescriptors(a: RealVector, b: RealVector): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector, b: RealVector): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector): RealVector3D {
        if(isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector): RealVector3D {
        if(isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: RealVector): number {
        if(isVector3D(v)) {
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

    normalizeRaw(v: RealVector): RealVector3D {
        if(isVector3D(v)) {
            const norm = this.normDescriptor(v);
            return {type: REALVECTOR3D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector, b: RealVector): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[1] * b.coordinates[2] - a.coordinates[2] * b.coordinates[1], a.coordinates[2] * b.coordinates[0] - a.coordinates[0] * b.coordinates[2], a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]]};
        } else {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    dotDescriptors(a: RealVector, b: RealVector): number {
        if(isVector3D(a) && isVector3D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector3D {
        if(isVector3D(v)) {
            if(weight.value === 0) {
                return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], {type: WEIGHT, weight: weight}]};
            }
            return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0] * weight.value, v.coordinates[1] * weight.value, v.coordinates[2] * weight.value, {type: WEIGHT, weight: weight}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
