import { ANGULAR_TOL_VECTOR, EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector, IVector } from "./Vector";
import type { RealVector, RealVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { IdentifiableVectorSpace } from "./IVectorSpace";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector<D extends number> 
    extends AbstractVector<D, RealVectorOfDimension<D>, RealVectorSpace<D>> 
    implements IRealVector<D>
    {
    
    private static readonly _spaceType = VectorSpaceType.REAL;

    protected abstract readonly _vectorSpace: RealVectorSpace<D>;
    // protected abstract readonly _vectorSpace: IdentifiableVectorSpace<RealVector>;

    get spaceType(): VectorSpaceType.REAL { return AbstractRealVector._spaceType; }
    
    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) }

    abstract get vectorSpace(): RealVectorSpace<D>;   
    // abstract get descriptor(): RealVector;
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
    
    // abstract add(other: IVector<D, RealVectorOfDimension<D>>): IVector<D, RealVectorOfDimension<D>>;
    // add(other: IRealVector<D>): IRealVector<D> {
    //     return super.add(other) as IRealVector<D>;
    // }

    // abstract subtract(other: IVector<D, RealVectorOfDimension<D>>): IVector<D, RealVectorOfDimension<D>>
    // subtract(other: IRealVector): IRealVector<D> {
    //     return super.subtract(other) as IRealVector<D>;
    // }

    // scale(scalar: number): IRealVector {
    // scale(scalar: number): IVector<D, RealVectorOfDimension<D>> {
    scale(scalar: number): this {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    // abstract normalize(tolerance?: number): IVector<D, RealVectorOfDimension<D>>
    // normalize(tolerance?: number): IRealVector {
    //     return super.normalize(tolerance) as IRealVector;
    // }

    // abstract dot(other: IVector<D, RealVectorOfDimension<D>>): number
    // dot(other: IRealVector): number {
    //     return super.dot(other);
    // }

    // abstract revert(): IVector<D, RealVectorOfDimension<D>>;
    // revert(): IRealVector {
    //     return super.revert() as IRealVector;
    // }

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
    // isParallel(other: IVector<D, RealVectorOfDimension<D>>, angularTolerance?: number): boolean {
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
    // isOrthogonal(other: IVector<D, RealVectorOfDimension<D>>, angularTolerance?: number): boolean {
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

    // protected abstract createVectorFromDescriptor(descriptor: RealVector): IRealVector;
    // protected abstract createVectorFromDescriptor(descriptor: RealVector): IVector<D, RealVectorOfDimension<D>>;
}
