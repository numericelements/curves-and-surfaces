import { ANGULAR_TOL_VECTOR, EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector } from "./Vector";
import type { RealVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector<D extends number> 
    extends AbstractVector<D, RealVectorOfDimension<D>, RealVectorSpace<D>> 
    implements IRealVector<D>
    {
    
    private static readonly _spaceType = VectorSpaceType.REAL;

    protected abstract readonly _vectorSpace: RealVectorSpace<D>;

    get spaceType(): VectorSpaceType.REAL { return AbstractRealVector._spaceType; }
    
    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) }

    abstract get vectorSpace(): RealVectorSpace<D>;   
    abstract get descriptor(): RealVectorOfDimension<D>;
    abstract get coordinates(): number[];
    abstract getCoordinate(index: number): number;
    abstract clone(): this;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: RealVectorSpace<D>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: RealVectorSpace<D>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.REAL || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scalar: number): this {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    toArray(): number[] {
        return this.coordinates;
    }

    toString(): string {
        return this.vectorType + `(${this.toArray().join(', ')})` + ` ` + this._vectorSpace.toString();
    }

    equals(other: IRealVector<D>, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: IRealVector<D>, angularTolerance?: number): boolean {
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

    isOrthogonal(other: IRealVector<D>, angularTolerance?: number): boolean {
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

    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toComplexVector(complexVectorSpace?: ComplexVectorSpace<any>): IComplexVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
