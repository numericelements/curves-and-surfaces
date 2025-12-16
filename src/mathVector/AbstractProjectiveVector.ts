import { EM_REVERT_NOT_APPLICABLE, EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM } from "../ErrorMessages/ProjectiveVectorSpace";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { IComplexVector, IProjectiveVector, IRealVector, VectorFactory } from "./Vector";
import { IComplex, ProjectiveVector, Vector } from "./VectorSpaceConstructorInterface";
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
    abstract get coordinates(): number[];
    abstract get weight(): Weight;
    abstract get homogeneousCoordinates(): number[];
    abstract getCoordinate(index: number): number;
    abstract clone(): IProjectiveVector;
    abstract toRealVector(realVectorSpace?: RealVectorSpace<any>): IRealVector;
    abstract toString(): string;

    checkValidityWeightStatus(weightOrVSpace: Weight, vectorSpace: ProjectiveVectorSpace<any>): boolean {
        let strictlyPosWeight = true;
        if(vectorSpace !== undefined && vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
            if(weightOrVSpace !== undefined && weightOrVSpace.strictlyPositive) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            strictlyPosWeight = false;
        }
        if(vectorSpace !== undefined) {
            // When the vector space is explicitly defined and its weight management restricted to stricly positive, the weight must be effectively strictly positive
            if(vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights && weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        } else if(weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
            // When the vector space is not explicitly defined and
            // the weight is explicitly defined as not strictly positive, the weight must be effectively strictly positive 
            // since the weight management is: AllStrictlyPositiveWeights
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        return strictlyPosWeight;
    }

    applyHomogeneousTransformation(): number[] {
        if(this.weight.value < NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'toVector2DReal', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const realCoordinates: number[] = [];
        for (let i = 0; i < this._vectorSpace.dimension() - 1; i++) {
            realCoordinates.push(this.coordinates[i] / this.coordinates[this._vectorSpace.dimension() - 1])
        }
        return realCoordinates;
    }
    
    add(other: IProjectiveVector): IProjectiveVector {
        return super.add(other) as IProjectiveVector;
    }

    subtract(other: IProjectiveVector): IProjectiveVector {
        return super.subtract(other) as IProjectiveVector;
    }

    scale(scalar: number): IProjectiveVector {
        const result = this._vectorSpace.scaleRaw(scalar, this.descriptor);
        return this.createVectorFromRaw(result);
    }

    revert(): IProjectiveVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'revert', EM_REVERT_NOT_APPLICABLE);
        throw new RangeError(error.generateMessageString());
    }

    normalize(): IProjectiveVector {
        return super.normalize() as IProjectiveVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates;
    }

    equals(other: IProjectiveVector, tolerance?: number): boolean {
        return super.equals(other, tolerance);
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