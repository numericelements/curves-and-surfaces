import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { IComplexVector, IVector, VectorFactory } from "./Vector";
import { IComplex, ComplexVector, Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { EM_COMPLEXVECTORS_DIFFERENT_DIM } from "../ErrorMessages/ComplexVectorSpace";
import { Complex } from "./Complex";

/**
 * Abstract base for complex vectors
 */

export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {

    get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }
    get vectorSpace(): ComplexVectorSpace<any> { return this._vectorSpace as ComplexVectorSpace<any>; }
    
    abstract get descriptor(): ComplexVector;
    abstract getCoordinate(index: number): Complex;
    // abstract setCoordinate(index: number, value: Complex): void;
    abstract get coordinates(): Complex[];
    abstract clone(): IComplexVector;
    
    add(other: IComplexVector): IComplexVector {
        return super.add(other) as IComplexVector;
    }

    subtract(other: IComplexVector): IComplexVector {
        return super.subtract(other) as IComplexVector;
    }

    scale(scalar: number): IComplexVector;
    scale(scalar: Complex): IComplexVector;
    scale(scalar: number | Complex): IComplexVector {
        const result = this._vectorSpace.scaleRaw(scalar, this.descriptor);
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
    
    // setReal(index: number, value: number): void {
    //     const coord = this.getCoordinate(index);
    //     this.setCoordinate(index, { ...coord, real: value });
    // }
    
    // setImaginary(index: number, value: number): void {
    //     const coord = this.getCoordinate(index);
    //     this.setCoordinate(index, { ...coord, imaginary: value });
    // }
    
    toArray(): number[] {
        // Flatten complex coordinates to [real1, imag1, real2, imag2, ...]
        // return this.coordinates.flatMap(c => [c.real, c.imaginary]);

        // return [this.coordinates[0].real, this.coordinates[0].imaginary]
        let result: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(this.coordinates[i].real);
            result.push(this.coordinates[i].imaginary);
        }
        return result;
    }

    equals(other: IComplexVector, tolerance?: number): boolean {
        if (this.dimension !== other.dimension) {
            const error = sendRangeErrorMessage(this.constructor.name, 'equals', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        } else if(this._vectorSpace !== other.vectorSpace) {
            const error = sendRangeErrorMessage(this.constructor.name, 'equals', EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            throw new RangeError(error.generateMessageString());
        }
        if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        for (let i = 0; i < this.dimension; i++) {
            if(this.getCoordinate(i).real * other.getCoordinate(i).real > 0 && Math.abs(this.getCoordinate(i).real - other.getCoordinate(i).real) > tolerance) {
                return false;
            } else if(this.getCoordinate(i).imaginary * other.getCoordinate(i).imaginary > 0 && Math.abs(this.getCoordinate(i).imaginary - other.getCoordinate(i).imaginary) > tolerance) {
                return false;
            }
        }
        return true;
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

    protected createVectorFromRaw(raw: Vector): IComplexVector {
        return VectorFactory.createComplexVectorFromRaw(raw as ComplexVector, this.vectorSpace);
    }
}