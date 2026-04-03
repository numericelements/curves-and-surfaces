import { EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX } from "../ErrorMessages/ProjectiveComplexVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { Complex } from "./Complex";
import type { ComplexWeight } from "./ComplexWeight";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { IComplexVector, IProjectiveComplexVector, IRealVector } from "./Vector";
import type { ProjectiveComplexVector, ProjectiveComplexVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

/**
 * Abstract base for projective complex vectors
 */
export abstract class AbstractProjectiveComplexVector<D extends number, V extends ProjectiveComplexVector = ProjectiveComplexVectorOfDimension<D>>
    extends AbstractVector<D, V, ProjectiveComplexVectorSpace<D, V>>
    implements IProjectiveComplexVector<D, V>
    {

    private static  readonly _spaceType = VectorSpaceType.PROJECTIVECOMPLEX;
    
    protected abstract readonly _vectorSpace: ProjectiveComplexVectorSpace<D, V>;

    get spaceType(): VectorSpaceType.PROJECTIVECOMPLEX { return AbstractProjectiveComplexVector._spaceType; }

    abstract get vectorSpace(): ProjectiveComplexVectorSpace<D, V>;
    abstract get descriptor(): V;
    abstract get coordinates(): readonly Complex[];
    abstract get weight(): ComplexWeight;
    abstract get homogeneousComplexCoordinates(): readonly Complex[];
    abstract getCoordinate(index: number): Complex;
    abstract clone(): this;
    // abstract toRealVector(vectorSpace?: RealVectorSpace<any>): IRealVector<any>;
    abstract toComplexVector(): IComplexVector<any>;
    abstract toString(): string;
    
    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ProjectiveComplexVectorSpace<D, V>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ProjectiveComplexVectorSpace<D, V>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.PROJECTIVECOMPLEX || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scalar: number): this;
    scale(scalar: Complex): this;
    scale(scalar: number | Complex): this {
        let result: V;
        if(scalar instanceof Complex) {
            const scalarDescriptor = scalar.toDescriptor();
            result = this._vectorSpace.scaleDescriptor(scalarDescriptor, this.descriptor);
        } else {
            result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        }
        return this.createVectorFromDescriptor(result);
    }

    distanceTo(other: IProjectiveComplexVector<D, V>): number {
        return this.affineDistance(other);
    }

    affineDistance(other: IProjectiveComplexVector<D, V>): number {
        // Denormalization then compute Hermitian distance
        const complexVector1 = this.toComplexVector(); // complex
        const complexVector2 = other.toComplexVector(); // complex
        
        let sum = 0;
        for (let i = 0; i < this.dimension; i++) {
            // z1/w1 - z2/w2
            const diff = complexVector1.subtract(complexVector2);
            // |diff|²
            sum += diff.getReal(i) * diff.getReal(i) + diff.getImaginary(i) * diff.getImaginary(i);
        }
        return Math.sqrt(sum);
    }

    toArray(): readonly number[] {
        const coord: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            const c = this.getCoordinate(i);
            coord.push(c.real);
            coord.push(c.imaginary);
        }
        return coord;
    }

    revert(): this {
        const error = sendRangeErrorMessage(this.constructor.name, 'revert', EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX);
        throw new RangeError(error.generateMessageString());
    }

    equals(other: IProjectiveComplexVector<D, V>, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: IProjectiveComplexVector<D, V>, tolerance?: number): boolean {
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

    isOrthogonal(other: IProjectiveComplexVector<D, V>, angularTolerance?: number): boolean {
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
}