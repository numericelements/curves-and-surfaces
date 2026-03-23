import { EM_REVERT_NOT_APPLICABLE, EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveComplexVector, IProjectiveVector, IRealVector, IVector } from "./Vector";
import type { ProjectiveVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { Weight } from "./Weight";

/**
 * Abstract base for projective vectors
 */
export abstract class AbstractProjectiveVector<D extends number> 
    extends AbstractVector<D, ProjectiveVectorOfDimension<D>, ProjectiveVectorSpace<D>>
    implements IProjectiveVector<D>
{

    private static readonly _spaceType = VectorSpaceType.PROJECTIVE;
    protected abstract readonly _vectorSpace: ProjectiveVectorSpace<D>;
    
    get spaceType(): VectorSpaceType.PROJECTIVE { return AbstractProjectiveVector._spaceType; }

    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) };
    get y(): number { return this.getCoordinate(1) };
    get w(): number { return this.getCoordinate(this.dimension - 1) };

    abstract get vectorSpace(): ProjectiveVectorSpace<D>;
    abstract get descriptor(): ProjectiveVectorOfDimension<D>;
    abstract get coordinates(): number[];
    abstract get weight(): Weight;

    abstract get homogeneousCoordinates(): number[];
    abstract getCoordinate(index: number): number;
    abstract clone(): this;
    abstract toRealVector(vectorSpace?: RealVectorSpace<any>): IRealVector;
    abstract homogeneousTransform(tolerance?: number): this;
    abstract toString(): string;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ProjectiveVectorSpace<D>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ProjectiveVectorSpace<D>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.PROJECTIVE || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    private dotForGeometricProperties(other: IProjectiveVector<D>): number {
        let dotProduct = 0;
        for (let i = 0; i < this.dimension; i++) {
            dotProduct += this.coordinates[i] * other.coordinates[i];
        }
        return dotProduct;
    }

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

    applyHomogeneousTransformation(tolerance?: number): number[] {
        if(tolerance === undefined) tolerance = NULL_WEIGHT_TOLERANCE;
        if(this.weight.value < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'applyHomogeneousTransformation', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const realCoordinates: number[] = [];
        for (let i = 0; i < this._vectorSpace.dimension() - 1; i++) {
            realCoordinates.push(this.coordinates[i] / this.coordinates[this._vectorSpace.dimension() - 1])
        }
        return realCoordinates;
    }

    scale(scalar: number): this {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    distanceTo(other: IProjectiveVector<D>): number {
        return this.affineDistance(other);
    }

    affineDistance(other: IProjectiveVector<D>): number {
        // Denormalization then compute Euclidean distance
        const realVector1 = this.applyHomogeneousTransformation();
        const realVector2 = other.homogeneousTransform().toRealVector().coordinates;
        
        let sum = 0;
        for (let i = 0; i < realVector1.length; i++) {
            const diff = realVector1[i] - realVector2[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    private ambientDistance(other: IProjectiveVector<D>): number {
        // Distance between projective vectors (without denormalization)
        let sum = 0;
        for (let i = 0; i <= this.dimension; i++) {
            const diff = this.coordinates[i] - other.coordinates[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    revert(): this {
        const error = sendRangeErrorMessage(this.constructor.name, 'revert', EM_REVERT_NOT_APPLICABLE);
        throw new RangeError(error.generateMessageString());
    }

    toArray(): number[] {
        return this.homogeneousCoordinates;
    }

    isParallel(other: IProjectiveVector<D>, angularTolerance?: number): boolean {
        this.validateCompatibility(other);
        if( angularTolerance === undefined) angularTolerance = ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isParallel', EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const dotProduct = this.dotForGeometricProperties(other);
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        return angle <= angularTolerance;
    }

    isOrthogonal(other: IProjectiveVector<D>, angularTolerance?: number): boolean {
        this.validateCompatibility(other);
        if( angularTolerance === undefined) angularTolerance = ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm < LINEAR_TOL_VECTOR || otherNorm < LINEAR_TOL_VECTOR) {
            const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const dotProduct = this.dotForGeometricProperties(other);
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        return Math.abs(angle - Math.PI / 2) <= angularTolerance;
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}