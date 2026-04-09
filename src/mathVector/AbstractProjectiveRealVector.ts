import { EM_REVERT_NOT_APPLICABLE, EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../namedConstants/Vectors";
import { AbstractVector } from "./AbstractVector";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { ProjectiveComplexVector, ProjectiveRealVector, RealVector } from "./interfaces/VectorInterfaces";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { Weight } from "./Weight";
import type { ProjectiveRealVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { ProjectiveRealVectorDesc } from "./utilityTypes/VectorDescriptorTypes";

/**
 * Abstract base for projective vectors
 */
export abstract class AbstractProjectiveRealVector<D extends number, PRVD extends ProjectiveRealVectorDesc = ProjectiveRealVectorOfDimension<D>> 
    extends AbstractVector<D, PRVD, ProjectiveRealVectorSpace<D, PRVD>>
    implements ProjectiveRealVector<D, PRVD>
{

    private static readonly _spaceType = VectorSpaceType.PROJECTIVEREAL;
    protected abstract readonly _vectorSpace: ProjectiveRealVectorSpace<D, PRVD>;
    
    get spaceType(): VectorSpaceType.PROJECTIVEREAL { return AbstractProjectiveRealVector._spaceType; }

    // Default implementations for coordinate accessors
    get x(): number { return this.getCoordinate(0) };
    get y(): number { return this.getCoordinate(1) };
    get w(): number { return this.getCoordinate(this.dimension - 1) };

    abstract get vectorSpace(): ProjectiveRealVectorSpace<D, PRVD>;
    abstract get descriptor(): PRVD;
    abstract get coordinates(): readonly number[];
    abstract get weight(): Weight;

    abstract get homogeneousCoordinates(): readonly number[];
    abstract getCoordinate(index: number): number;
    abstract clone(): this;
    abstract toRealVector(vectorSpace?: RealVectorSpace<any>): RealVector;
    abstract homogeneousTransform(tolerance?: number): this;
    abstract toString(): string;

    protected checkVectorSpaceDimensionConsistency(vectorDim: number, vSpace: ProjectiveRealVectorSpace<D, PRVD>): void {
        if(vSpace.dimension() !== vectorDim) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    protected checkVectorSpaceConsistency(vectorDim: number, vSpace?: ProjectiveRealVectorSpace<D, PRVD>): void {
        if(vSpace !== undefined && (vSpace.spaceType !== VectorSpaceType.PROJECTIVEREAL || vSpace.dimension() !== vectorDim)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    private dotForGeometricProperties(other: ProjectiveRealVector<D, PRVD>): number {
        let dotProduct = 0;
        for (let i = 0; i < this.dimension; i++) {
            dotProduct += this.coordinates[i] * other.coordinates[i];
        }
        return dotProduct;
    }

    checkValidityWeightStatus(weightOrVSpace: Weight, vectorSpace: ProjectiveRealVectorSpace<any>): boolean {
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

    applyHomogeneousTransformation(tolerance?: number): readonly number[] {
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

    distanceTo(other: ProjectiveRealVector<D, PRVD>): number {
        return this.affineDistance(other);
    }

    affineDistance(other: ProjectiveRealVector<D, PRVD>): number {
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

    private ambientDistance(other: ProjectiveRealVector<D, PRVD>): number {
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

    toArray(): readonly number[] {
        return this.homogeneousCoordinates;
    }

    isParallel(other: ProjectiveRealVector<D, PRVD>, angularTolerance?: number): boolean {
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

    isOrthogonal(other: ProjectiveRealVector<D, PRVD>, angularTolerance?: number): boolean {
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

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): ProjectiveComplexVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}