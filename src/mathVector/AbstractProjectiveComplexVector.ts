import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { IComplexVector, IProjectiveComplexVector, IRealVector, VectorFactory } from "./Vector";
import { Complex, ComplexWeight, ProjectiveComplexVector, Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Abstract base for projective complex vectors
 */
export abstract class AbstractProjectiveComplexVector extends AbstractVector implements IProjectiveComplexVector {

    get vectorSpace(): ProjectiveComplexVectorSpace<any> { return this._vectorSpace as ProjectiveComplexVectorSpace<any>; }

    abstract getCoordinate(index: number): Complex;
    // abstract setCoordinate(index: number, value: Complex): void;
    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveComplexVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.add(other) as IProjectiveComplexVector;
    }

    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.subtract(other) as IProjectiveComplexVector;
    }

    scale(scalar: number): IProjectiveComplexVector {
        return super.scale(scalar) as IProjectiveComplexVector;
    }

    revert(): IProjectiveComplexVector {
        return super.revert() as IProjectiveComplexVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    equals(other: IProjectiveComplexVector, tolerance?: number): boolean {
        if (this.dimension !== other.dimension || this.vectorType !== other.vectorType || this._vectorSpace !== other.vectorSpace) {
            return false;
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

    isParallel(other: IProjectiveComplexVector, tolerance?: number): boolean {
        this.validateCompatibility(other);
        if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm === 0 || otherNorm === 0) {
            return true; // Zero vectors are colinear
        }
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct as number / (thisNorm * otherNorm));
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
        const ratio = Math.abs(dotProduct as number / (thisNorm * otherNorm));
        return ratio <= angularTolerance;
    }

    protected createVectorFromRaw(raw: Vector): IProjectiveComplexVector {
        return VectorFactory.createProjectiveComplexVectorFromRaw(raw as ProjectiveComplexVector, this.vectorSpace);
    }
}