import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector } from "./Vector";
import type { ComplexVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Complex } from "./Complex";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";

/**
 * Abstract base for complex vectors
 */

export abstract class AbstractComplexVector<D extends number> extends AbstractVector implements IComplexVector {

    private static readonly _spaceType = VectorSpaceType.COMPLEX;
    
    get spaceType(): VectorSpaceType.COMPLEX { return AbstractComplexVector._spaceType; }

    abstract get vectorSpace(): ComplexVectorSpace<D>;
    abstract get descriptor(): ComplexVector;
    abstract get coordinates(): Complex[];
    abstract getCoordinate(index: number): Complex;
    abstract clone(): IComplexVector;
    abstract toString(): string;
    abstract toRealVector(): IRealVector;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ComplexVectorSpace<D>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ComplexVectorSpace<D>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.COMPLEX || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
    
    add(other: IComplexVector): IComplexVector {
        return super.add(other) as IComplexVector;
    }

    subtract(other: IComplexVector): IComplexVector {
        return super.subtract(other) as IComplexVector;
    }

    normalize(tolerance?: number): IComplexVector {
        return super.normalize(tolerance) as IComplexVector;
    }

    dot(other: IComplexVector): number {
        return super.dot(other);
    }

    scale(scalar: number): IComplexVector;
    scale(scalar: Complex): IComplexVector;
    scale(scalar: number | Complex): IComplexVector {
        let result: ComplexVector;
        if(scalar instanceof Complex) {
            const scalarDescriptor = scalar.toDescriptor();
            result = this._vectorSpace.scaleDescriptor(scalarDescriptor, this.descriptor);
        } else {
            result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        }
        return this.createVectorFromDescriptor(result);
    }
    
    revert(): IComplexVector {
        return super.revert() as IComplexVector;   
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
    
    toArray(): number[] {
        let result: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(this.coordinates[i].real);
            result.push(this.coordinates[i].imaginary);
        }
        return result;
    }

    equals(other: IComplexVector, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: IComplexVector, tolerance?: number): boolean {
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

    isOrthogonal(other: IComplexVector, angularTolerance?: number): boolean {
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

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toProjectiveVector(projectiveVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    protected abstract createVectorFromDescriptor(descriptor: ComplexVector): IComplexVector;
}