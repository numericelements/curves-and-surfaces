import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { IComplexVector } from "./Vector";
import type { ComplexVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { Complex } from "./Complex";

/**
 * Abstract base for complex vectors
 */

export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {

    get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }
    get vectorSpace(): ComplexVectorSpace<any> { return this._vectorSpace as ComplexVectorSpace<any>; }
    
    abstract get descriptor(): ComplexVector;
    abstract getCoordinate(index: number): Complex;
    abstract get coordinates(): Complex[];
    abstract clone(): IComplexVector;
    
    add(other: IComplexVector): IComplexVector {
        return super.add(other) as IComplexVector;
    }

    subtract(other: IComplexVector): IComplexVector {
        return super.subtract(other) as IComplexVector;
    }

    dot(other: IComplexVector): number {
        return super.dot(other) as number;
    }

    scale(scalar: number): IComplexVector;
    scale(scalar: Complex): IComplexVector;
    scale(scalar: number | Complex): IComplexVector {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromRaw(result);
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

    abstract toString(): string;

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
            const ratio = Math.abs(dotProduct as number / (thisNorm * otherNorm));
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
        const ratio = Math.abs(dotProduct as number / (thisNorm * otherNorm));
        return ratio <= angularTolerance;
    }

    protected abstract createVectorFromRaw(raw: ComplexVector): IComplexVector;

    // protected createVectorFromRaw(raw: Vector): IComplexVector {
    //     return VectorFactory.createComplexVectorFromRaw(raw as ComplexVector, this.vectorSpace);
    // }
}