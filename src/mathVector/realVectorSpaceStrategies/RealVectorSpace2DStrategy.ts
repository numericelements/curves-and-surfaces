import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../../ErrorMessages/RealVectorSpace";
import type { RealVectorSpaceStrategy } from "../interfaces/VectorSpaceStrategyInterfaces";
import { createComplexVector1DDescriptor, createProjectiveRealVector2DDescriptor, createRealVector2DDescriptor } from "../VectorDescriptorFactory";
import type { ProjectiveRealVector2D, RealVector2D } from "../VectorDescriptorConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "../VectorSpaceUtilities";
import { Weight } from "../Weight";
import type { ComplexVector1D, Real, RealVectorDesc } from "../utilityTypes/VectorDescriptorTypes";


export class RealVectorSpace2DStrategy implements RealVectorSpaceStrategy<2, RealVector2D> {
    readonly dimension = 2 as const;

    // Implementation for 2D vectors

    areSameDimension(v1: RealVectorDesc, v2: RealVectorDesc): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVectorDesc): v is RealVectorDesc {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: [number, number]): RealVector2D {
        return createRealVector2DDescriptor(coordinates[0], coordinates[1]);
    }

    defaultVect(): RealVector2D {
        return createRealVector2DDescriptor();
    }

    addDescriptors(a: RealVector2D, b: RealVector2D): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return createRealVector2DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1]);
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector2D, b: RealVector2D): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return createRealVector2DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1]);
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            return createRealVector2DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1]);
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            return createRealVector2DDescriptor(v.coordinates[0], v.coordinates[1]);
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: RealVector2D): number {
        if(isVector2D(v)) {
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

    normalizeDescriptor(v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            const norm = this.normDescriptor(v);
            return createRealVector2DDescriptor(v.coordinates[0] / norm, v.coordinates[1] / norm);
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector2D, b: RealVector2D): number {
        if(isVector2D(a) && isVector2D(b)) {
            return (a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]);
        } else {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    dotDescriptors(a: RealVector2D, b: RealVector2D): number {
        if(isVector2D(a) && isVector2D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveRealVectorSpace(v: RealVector2D, weight: Weight = new Weight()): ProjectiveRealVector2D {
        if(isVector2D(v)) {
            if(weight.value === 0) {
                return createProjectiveRealVector2DDescriptor(v.coordinates[0], v.coordinates[1], weight);
            }
            return createProjectiveRealVector2DDescriptor(v.coordinates[0] * weight.value, v.coordinates[1] * weight.value, weight);
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveRealVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector2D): ComplexVector1D {
        if(isVector2D(v)) {
            return createComplexVector1DDescriptor(v.coordinates[0], v.coordinates[1]);
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}