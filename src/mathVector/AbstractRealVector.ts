import { ANGULAR_TOL_VECTOR, EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { ComplexVector, ProjectiveComplexVector, ProjectiveRealVector, RealVector } from "./interfaces/VectorInterfaces";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { RealVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { RealVectorDesc } from "./utilityTypes/VectorDescriptorTypes";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector<D extends number, RVD extends RealVectorDesc = RealVectorOfDimension<D>> 
    extends AbstractVector<D, RVD, RealVectorSpace<D, RVD>> 
    implements RealVector<D, RVD>
    {
    
    private static readonly _spaceType = VectorSpaceType.REAL;

    protected abstract readonly _vectorSpace: RealVectorSpace<D, RVD>;

    get spaceType(): VectorSpaceType.REAL { return AbstractRealVector._spaceType; }
    
    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) }

    abstract get vectorSpace(): RealVectorSpace<D, RVD>;   
    abstract get descriptor(): RVD;
    abstract get coordinates(): readonly number[];
    abstract getCoordinate(index: number): number;
    abstract clone(): this;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: RealVectorSpace<D, RVD>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: RealVectorSpace<D, RVD>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.REAL || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scalar: number): this {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    distanceTo(other: RealVector<D, RVD>): number {
        return this.affineDistance(other);
    }

    affineDistance(other: RealVector<D, RVD>): number {
        let sum = 0;
        const diffrence = this.subtract(other);
        for (let i = 0; i < this.dimension; i++) {
            const diff = diffrence.getCoordinate(i);
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    toArray(): readonly number[] {
        return this.coordinates;
    }

    toString(): string {
        return this.vectorType + `(${this.toArray().join(', ')})` + ` ` + this._vectorSpace.toString();
    }

    isParallel(other: RealVector<D, RVD>, angularTolerance?: number): boolean {
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

    isOrthogonal(other: RealVector<D, RVD>, angularTolerance?: number): boolean {
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

    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<any>): ProjectiveRealVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveRealVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toComplexVector(complexVectorSpace?: ComplexVectorSpace<any>): ComplexVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): ProjectiveComplexVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
