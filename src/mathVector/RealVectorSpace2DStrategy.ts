import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/RealVectorSpace";
import { RealVectorSpaceStrategy } from "./RealVectorSpace";
import { COMPLEX, ComplexVector, PROJECTIVEVECTOR2D, ProjectiveVector2D, Real, RealVector, RealVector2D, REALVECTOR2D, WEIGHT } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class RealVectorSpace2DStrategy implements RealVectorSpaceStrategy<2> {
    // Implementation for 2D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector2D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[]): RealVector2D {
        let vector: RealVector2D = {type: REALVECTOR2D, coordinates: [coordinates[0], coordinates[1]]};
        return vector;
    }

    defaultVect(): RealVector2D {
        return {type: REALVECTOR2D, coordinates: [0, 0]};
    }

    addRaw(a: RealVector, b: RealVector): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    subtractRaw(a: RealVector, b: RealVector): RealVector2D {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    scaleRaw(scalar: Real, v: RealVector): RealVector2D {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    cloneRaw(v: RealVector): RealVector2D {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    normRaw(v: RealVector): number {
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

    normalizeRaw(v: RealVector): RealVector2D {
        if(isVector2D(v)) {
            const norm = this.normRaw(v);
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProductRaw(a: RealVector, b: RealVector): number {
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

    dotRaw(a: RealVector, b: RealVector): number {
        if(isVector2D(a) && isVector2D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector2D {
        if(isVector2D(v)) {
            if(weight.weight === 0) {
                return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], {type: WEIGHT, value: weight}]};
            }
            return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0] * weight.weight, v.coordinates[1] * weight.weight, {type: WEIGHT, value: weight}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector {
        if(isVector2D(v)) {
            return {type: COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}