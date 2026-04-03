import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector } from "./Vector";
import type { ComplexVector, ComplexVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Complex } from "./Complex";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";

/**
 * Abstract base for complex vectors
 */

export abstract class AbstractComplexVector<D extends number, V extends ComplexVector = ComplexVectorOfDimension<D>>
    extends AbstractVector<D, V, ComplexVectorSpace<D, V>>
    implements IComplexVector<D, V> 
{

    private static readonly _spaceType = VectorSpaceType.COMPLEX;
    
    protected abstract readonly _vectorSpace: ComplexVectorSpace<D, V>;
    
    get spaceType(): VectorSpaceType.COMPLEX { return AbstractComplexVector._spaceType; }

    abstract get vectorSpace(): ComplexVectorSpace<D, V>;
    abstract get descriptor(): V;
    abstract get coordinates(): readonly Complex[];
    abstract getCoordinate(index: number): Complex;
    abstract clone(): this;
    abstract toString(): string;
    abstract toRealVector(): IRealVector;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ComplexVectorSpace<D, V>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ComplexVectorSpace<D, V>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.COMPLEX || vSpace.dimension() !== vectorDim)) {
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
    
    distanceTo(other: IComplexVector<D, V>): number {
        return this.affineDistance(other);
    }

    affineDistance(other: IComplexVector<D, V>): number {
        // Hermitian Distance  (≡ Euclidean in ℝ²ⁿ)
        let sum = 0;
        for (let i = 0; i < this.dimension; i++) {
            const z1 = this.getCoordinate(i);
            const z2 = other.getCoordinate(i);
            // |z1 - z2|² = (a1-a2)² + (b1-b2)²
            const diffReal = z1.real - z2.real;
            const diffImag = z1.imaginary - z2.imaginary;
            sum += diffReal * diffReal + diffImag * diffImag;
        }
        return Math.sqrt(sum);
    }

    // Complex-specific implementations
    getReal(index: number): number {
        const coord = this.getCoordinate(index);
        return coord.real;
    }
    
    getImaginary(index: number): number {
        const coord = this.getCoordinate(index);
        return coord.imaginary;
    }
    
    toArray(): readonly number[] {
        let result: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(this.coordinates[i].real);
            result.push(this.coordinates[i].imaginary);
        }
        return result;
    }

    equals(other: IComplexVector<D, V>, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: IComplexVector<D, V>, tolerance?: number): boolean {
            this.validateCompatibility(other);
            if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
            const thisNorm = this.norm();
            const otherNorm = other.norm();
            if(thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
                const error = sendRangeErrorMessage(this.constructor.name, 'isParallel', EM_VECTOR_NORM_TOO_SMALL);
                throw new RangeError(error.generateMessageString());
            }
            const dotProduct = this.dot(other);
            const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
            return ratio >= (1 - tolerance);
    }

    isOrthogonal(other: IComplexVector<D, V>, angularTolerance?: number): boolean {
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

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toProjectiveVector(projectiveVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector<any> {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}