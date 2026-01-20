import { ANGULAR_TOL_VECTOR, EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTOR_NORM_TOO_SMALL, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveVector, IRealVector } from "./Vector";
import type { RealVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector<D extends number> extends AbstractVector implements IRealVector {
    
    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    
    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) }

    abstract get vectorSpace(): RealVectorSpace<D>;   
    abstract get descriptor(): RealVector;
    abstract get coordinates(): number[];
    abstract toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector;
    abstract getCoordinate(index: number): number;
    abstract clone(): IRealVector;
    
    add(other: IRealVector): IRealVector {
        return super.add(other) as IRealVector;
    }

    subtract(other: IRealVector): IRealVector {
        return super.subtract(other) as IRealVector;
    }

    scale(scalar: number): IRealVector {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    dot(other: IRealVector): number {
        return super.dot(other) as number;
    }

    revert(): IRealVector {
        return super.revert() as IRealVector;
    }

    toArray(): number[] {
        return this.coordinates;
    }

    toString(): string {
        return this.vectorType + `(${this.toArray().join(', ')})` + ` ` + this._vectorSpace.toString();
    }

    equals(other: IRealVector, tolerance?: number): boolean {
        return super.equals(other, tolerance);
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

    protected abstract createVectorFromDescriptor(descriptor: RealVector): IRealVector;
}
