import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/RealVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { PROJECTIVEVECTOR2D, REALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import type { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import type { ComplexVector, ProjectiveVector2D, Real, RealVector, RealVector2D } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class RealVectorSpace2DStrategy implements IRealVectorSpaceStrategy<2> {
    readonly dimension = 2 as const;

    // Implementation for 2D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: [number, number]): RealVector2D {
    return {type: REALVECTOR2D, coordinates};
}

    defaultVect(): RealVector2D {
        return {type: REALVECTOR2D, coordinates: [0, 0]};
    }

    addDescriptors(a: RealVector2D, b: RealVector2D): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: RealVector2D, b: RealVector2D): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
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

    normalizeRaw(v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            const norm = this.normDescriptor(v);
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm]};
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

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector2D, weight: Weight = new Weight()): ProjectiveVector2D {
        if(isVector2D(v)) {
            if(weight.value === 0) {
                return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], {type: WEIGHT, weight: weight}]};
            }
            return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0] * weight.value, v.coordinates[1] * weight.value, {type: WEIGHT, weight: weight}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector2D): ComplexVector {
        if(isVector2D(v)) {
            return {type: COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}