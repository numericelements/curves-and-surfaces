import { EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX } from "../ErrorMessages/ProjectiveComplexVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { Complex } from "./Complex";
import type { ComplexWeight } from "./ComplexWeight";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { IComplexVector, IProjectiveComplexVector } from "./Vector";
import type { IComplex, ProjectiveComplexVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

/**
 * Abstract base for projective complex vectors
 */
export abstract class AbstractProjectiveComplexVector<D extends number> extends AbstractVector implements IProjectiveComplexVector {

    private static  readonly _spaceType = VectorSpaceType.PROJECTIVECOMPLEX;
    
    get spaceType(): VectorSpaceType.PROJECTIVECOMPLEX { return AbstractProjectiveComplexVector._spaceType; }

    abstract get vectorSpace(): ProjectiveComplexVectorSpace<D>;
    abstract get descriptor(): ProjectiveComplexVector;
    abstract get coordinates(): Complex[];
    abstract get weight(): ComplexWeight;
    abstract get homogeneousComplexCoordinates(): Complex[];
    abstract getCoordinate(index: number): Complex;
    abstract clone(): IProjectiveComplexVector;
    abstract normalize(): IProjectiveComplexVector;
    abstract toComplexVector(): IComplexVector;
    abstract toString(): string;
    
    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ProjectiveComplexVectorSpace<D>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ProjectiveComplexVectorSpace<D>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.PROJECTIVECOMPLEX || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.add(other) as IProjectiveComplexVector;
    }

    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.subtract(other) as IProjectiveComplexVector;
    }

    scale(scalar: number): IProjectiveComplexVector;
    scale(scalar: Complex): IProjectiveComplexVector;
    scale(scalar: number | Complex): IProjectiveComplexVector {
        let result: ProjectiveComplexVector;
        if(scalar instanceof Complex) {
            const scalarDescriptor = scalar.toDescriptor();
            result = this._vectorSpace.scaleDescriptor(scalarDescriptor, this.descriptor);
        } else {
            result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        }
        return this.createVectorFromDescriptor(result);
    }

    revert(): IProjectiveComplexVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'revert', EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX);
        throw new RangeError(error.generateMessageString());
    }

    toArray(): number[] {
        const coord: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            const c = this.getCoordinate(i);
            coord.push(c.real);
            coord.push(c.imaginary);
        }
        return coord;
    }

    equals(other: IProjectiveComplexVector, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: IProjectiveComplexVector, tolerance?: number): boolean {
        this.validateCompatibility(other);
        if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm === 0 || otherNorm === 0) {
            return true; // Zero vectors are colinear
        }
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
        return ratio >= 1 - tolerance;
    }

    isOrthogonal(other: IProjectiveComplexVector, angularTolerance?: number): boolean {
        this.validateCompatibility(other);
        if( angularTolerance === undefined) angularTolerance = ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if(thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        // better to use cross product if available
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
        return ratio <= angularTolerance;
    }

    protected abstract createVectorFromDescriptor(descriptor: ProjectiveComplexVector): IProjectiveComplexVector;
}