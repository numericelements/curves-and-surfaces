import { ANGULAR_TOL_VECTOR, EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import { RealVectorSpace } from "./RealVectorSpace";
import { IRealVector, VectorFactory } from "./Vector";
import { RealVector, Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { EM_REALVECTORS_DIFFERENT_DIM } from "../ErrorMessages/RealVectorSpace";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector extends AbstractVector implements IRealVector {
    
    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    get vectorSpace(): RealVectorSpace<any> { return this._vectorSpace as RealVectorSpace<any>; }
    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) }
    // get x(): number | undefined { return this.dimension >= 1 ? this.getCoordinate(0) : undefined; }
    // get y(): number | undefined { return this.dimension >= 2 ? this.getCoordinate(1) : undefined; }
    // get z(): number | undefined { return this.dimension >= 3 ? this.getCoordinate(2) : undefined; }
    // get w(): number | undefined { return this.dimension >= 4 ? this.getCoordinate(3) : undefined; }

    abstract get raw(): RealVector;
    abstract get coordinates(): number[];

    abstract getCoordinate(index: number): number;
    abstract setCoordinate(index: number, value: number): void;
    abstract clone(): IRealVector;
    
    // Override with more specific types
    add(other: IRealVector): IRealVector {
        return super.add(other) as IRealVector;
    }

    subtract(other: IRealVector): IRealVector {
        return super.subtract(other) as IRealVector;
    }

    scale(scalar: number): IRealVector {
        return super.scale(scalar) as IRealVector;
    }

    dot(other: IRealVector): number {
        return super.dot(other) as number;
    }

    reverse(): IRealVector {
        return super.reverse() as IRealVector;
    }

    toArray(): number[] {
        return this.coordinates;
    }

    equals(other: IRealVector, tolerance?: number): boolean {
        if (this.dimension !== other.dimension) {
            const error = sendRangeErrorMessage(this.constructor.name, 'equals', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        } else if(this._vectorSpace !== other.vectorSpace) {
            const error = sendRangeErrorMessage(this.constructor.name, 'equals', EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            throw new RangeError(error.generateMessageString());
        }
        if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        for (let i = 0; i < this.dimension; i++) {
            if(this.getCoordinate(i) * other.getCoordinate(i) > 0 && Math.abs(this.getCoordinate(i) - other.getCoordinate(i)) > tolerance) {
                return false;
            }
        }
        return true;
    }

    isParallel(other: IRealVector, angularTolerance?: number): boolean {
        this.validateCompatibility(other);
        if( angularTolerance === undefined) angularTolerance = ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if(thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isParallel', EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const dotProduct = this.dot(other);
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        return angle <= angularTolerance;
    }

    isOrthogonal(other: IRealVector, angularTolerance?: number): boolean {
        this.validateCompatibility(other);
        if(this.dimension === 1) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_ISORTHOGONAL_NOT_APPLICABLE);
            throw new RangeError(error.generateMessageString());
        }
        if( angularTolerance === undefined) angularTolerance = ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if(thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        // better to use cross product if available
        const dotProduct = this.dot(other);
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        const halfPi = Math.atan(1) * 2;
        return (halfPi - angle) <= angularTolerance;
    }

    protected createVectorFromRaw(raw: Vector): IRealVector {
        return VectorFactory.createRealVectorFromRaw(raw as RealVector, this.vectorSpace);
    }
}
