import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_VECTOR_NORM_TOO_SMALL, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { IComplexVector, IProjectiveVector, IRealVector, VectorFactory } from "./Vector";
import { Complex, ComplexWeight, ProjectiveVector, Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Abstract base for projective vectors
 */
export abstract class AbstractProjectiveVector extends AbstractVector implements IProjectiveVector {

    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    get vectorSpace(): ProjectiveVectorSpace<any> { return this._vectorSpace as ProjectiveVectorSpace<any>; }

    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) };
    get y(): number { return this.getCoordinate(1) };
    get w(): number { return this.getCoordinate(this.dimension - 1) };

    abstract get descriptor(): ProjectiveVector;
    abstract get weight(): Weight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract getCoordinate(index: number): number;
    // abstract setCoordinate(index: number, value: number): void;
    abstract normalize(): IProjectiveVector;
    abstract clone(): IProjectiveVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveVector): IProjectiveVector {
        return super.add(other) as IProjectiveVector;
    }

    subtract(other: IProjectiveVector): IProjectiveVector {
        return super.subtract(other) as IProjectiveVector;
    }

    scale(scalar: number): IProjectiveVector {
        return super.scale(scalar) as IProjectiveVector;
    }

    reverse(): IProjectiveVector {
        return super.reverse() as IProjectiveVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    equals(other: IProjectiveVector, tolerance?: number): boolean {
        if (this.dimension !== other.dimension || this.vectorType !== other.vectorType || this._vectorSpace !== other.vectorSpace) {
            return false;
        }
        if( tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        for (let i = 0; i < this.dimension; i++) {
            if(this.getCoordinate(i) * other.getCoordinate(i) > 0 && Math.abs(this.getCoordinate(i) - other.getCoordinate(i)) > tolerance) {
                return false;
            }
        }
        return true;
    }

    isParallel(other: IProjectiveVector, tolerance?: number): boolean {
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

    isOrthogonal(other: IProjectiveVector, angularTolerance?: number): boolean {
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

    protected createVectorFromRaw(raw: Vector): IProjectiveVector {
        return VectorFactory.createProjectiveVectorFromRaw(raw as ProjectiveVector, this.vectorSpace);
    }
}