import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_OUT_RANGE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { COMPLEX, ComplexVector, ProjectiveVector, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, Real, RealVector, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, VectorSpace, WEIGHT } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Implementation of a real vector space
 */
export class RealVectorSpace implements VectorSpace<Real, RealVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
    }

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if((isVector1D(v1) && isVector1D(v2)) ||
            (isVector2D(v1) && isVector2D(v2)) ||
            (isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        } else return false;
    }

    zero(): RealVector {
        if(this.dim === MIN_DIMENSION_REALVECTORSPACE) {
            return 0;
        } else if (this.dim === 2) {
            return {type: REALVECTOR2D, coordinates: [0, 0]};
        } else if (this.dim === 3) {
            return {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        } else if (this.dim === MAX_DIMENSION_REALVECTORSPACE) {
            return {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(a: RealVector, b: RealVector): RealVector {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        } else if ((isVector2D(a) && isVector2D(b)) ||
                (isVector3D(a) && isVector3D(b)) ||
                (isVector4D(a) && isVector4D(b))) {
            const result = (a.coordinates as number[]).map((val, i) => val + (b.coordinates as number[])[i]);
            if(isVector2D(a)) {
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            } else if(isVector3D(a)) {
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            } else if(isVector4D(a)) {
                return {type: REALVECTOR4D, coordinates: [result[0], result[1], result[2], result[3]]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scalar: Real, v: RealVector): RealVector {
        if (typeof v === 'number') {
            return scalar * v;
        } else if (isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
        } else if (isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]]};
        } else if (isVector4D(v)) {
            return {type: REALVECTOR4D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scalar * v.coordinates[3]]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else if ((isVector2D(a) && isVector2D(b)) ||
                (isVector3D(a) && isVector3D(b)) ||
                (isVector4D(a) && isVector4D(b))) {
            const result = (a.coordinates as number[]).map((val, i) => val - (b.coordinates as number[])[i]);
            if(isVector2D(a)) {
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            } else if(isVector3D(a)) {
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            } else if(isVector4D(a)) {
                return {type: REALVECTOR4D, coordinates: [result[0], result[1], result[2], result[3]]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension(): number {
        return this.dim;
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector {
        if(isVector2D(v) || isVector3D(v)) {
            const result = (v.coordinates as number[]).map((val) => (val * weight.weight));
            if(isVector2D(v)) {
                return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: weight}]};
            } else if(isVector3D(v)) {
                return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: weight}]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector {
        if(isVector2D(v)) {
            return {type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}