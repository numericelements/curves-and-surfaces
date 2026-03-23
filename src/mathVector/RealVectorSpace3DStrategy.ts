import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/RealVectorSpace";
import type { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import type { ProjectiveVector3D, Real, RealVector, RealVector3D } from "./VectorSpaceConstructorInterface";
import { isVector3D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { createProjectiveVector3DDescriptor, createRealVector3DDescriptor, createWeightDescriptor } from "./VectorDescriptorFactory";

  
export class RealVectorSpace3DStrategy implements IRealVectorSpaceStrategy<3> {

    readonly dimension = 3 as const;

    // Implementation for 3D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector3D(v)) return true;
        return false;
    }

    createVector(coordinates: [number, number, number]): RealVector3D {
        return createRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
    }

    defaultVect(): RealVector3D {
        return createRealVector3DDescriptor();
    }

    addDescriptors(a: RealVector3D, b: RealVector3D): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return createRealVector3DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1],
                a.coordinates[2] + b.coordinates[2]);
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector3D, b: RealVector3D): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return createRealVector3DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1],
                a.coordinates[2] - b.coordinates[2]);
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector3D): RealVector3D {
        if(isVector3D(v)) {
            return createRealVector3DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1],
                scalar * v.coordinates[2]);
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector3D): RealVector3D {
        if(isVector3D(v)) {
            return createRealVector3DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2]);
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: RealVector3D): number {
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

    normalizeDescriptor(v: RealVector3D): RealVector3D {
        if(isVector3D(v)) {
            const norm = this.normDescriptor(v);
            return createRealVector3DDescriptor(v.coordinates[0] / norm, v.coordinates[1] / norm,
                v.coordinates[2] / norm);
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector3D, b: RealVector3D): RealVector3D {
        if(isVector3D(a) && isVector3D(b)) {
            return createRealVector3DDescriptor(a.coordinates[1] * b.coordinates[2] - a.coordinates[2] * b.coordinates[1],
                a.coordinates[2] * b.coordinates[0] - a.coordinates[0] * b.coordinates[2], a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]);
        } else {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    dotDescriptors(a: RealVector3D, b: RealVector3D): number {
        if(isVector3D(a) && isVector3D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector3D, weight: Weight = new Weight()): ProjectiveVector3D {
        if(isVector3D(v)) {
            if(weight.value === 0) {
                const weightDescriptor = weight.toDescriptor();
                return createProjectiveVector3DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2], weightDescriptor);
            }
            return createProjectiveVector3DDescriptor(v.coordinates[0] * weight.value, v.coordinates[1] * weight.value, v.coordinates[2] * weight.value, weight.toDescriptor());
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector3D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
