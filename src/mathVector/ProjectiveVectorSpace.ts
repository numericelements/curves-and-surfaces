import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { ProjectiveVectorSpace3DStrategy } from "./ProjectiveVectorSpace3DStrategy";
import { ProjectiveVectorSpace4DStrategy } from "./ProjectiveVectorSpace4DStrategy";
import type { ProjectiveComplexVector, ProjectiveVector, ProjectiveVectorOfDimension, Real, RealVector, Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { WeightManager } from "./WeightManager";
import { DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { PROJECTIVE_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import type { IProjectiveVectorSpaceStrategy } from "./strategies/interfaces/IProjectiveVectorSpaceStrategy";
import type { IdentifiableVectorSpace, ProjectiveVectorSpaceInterface } from "./IVectorSpace";

/**
 * Implementation of a projective vector space
 */

// export class ProjectiveVectorSpace<D extends number = number> implements IdentifiableVectorSpace<ProjectiveVectorOfDimension<D>> {
export class ProjectiveVectorSpace<D extends number = number> implements ProjectiveVectorSpaceInterface<D> {
    
    private static readonly _spaceType = VectorSpaceType.PROJECTIVE as const;
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    private readonly dim: D;
    private readonly weightManager: WeightManager;
    protected readonly strategy: IProjectiveVectorSpaceStrategy<D>;
    protected readonly _weightManagement: WeightManagement;

    
    constructor(dimension: D);
    constructor(dimension: D, isDefault: boolean);
    constructor(dimension: D, weightManagement: WeightManagement);
    constructor(dimension: D, weightManagement?: WeightManagement, isDefault?: boolean);
    constructor(dimension: D, weightManagement?: WeightManagement, isDefault?: boolean, name?: string);
    constructor(dimension: D, isDefltOrWeightMgmt?: boolean | WeightManagement, isDefault?: boolean, name?: string) {
        this.dim = dimension;
        if(typeof isDefltOrWeightMgmt === 'string') {
            this._weightManagement = isDefltOrWeightMgmt;
        } else if(typeof isDefltOrWeightMgmt === 'boolean') {
            isDefault = isDefltOrWeightMgmt;
            this._weightManagement = WeightManagement.AllStrictlyPositiveWeights;
        } else {
            this._weightManagement = WeightManagement.AllStrictlyPositiveWeights;
        }
        if(isDefault === undefined) isDefault = false;
        this.weightManager = new WeightManager(this._weightManagement);
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
            this._name = DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._id = resolveVectorSpace(this);
            this._name = name || PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
        }
        this.strategy = this.createStrategy(dimension);
    }

    private createStrategy(dimension: number): IProjectiveVectorSpaceStrategy<any> {
        switch(dimension) {
            case MIN_DIMENSION_PROJECTIVEVECTORSPACE:
                return new ProjectiveVectorSpace3DStrategy();
            case MAX_DIMENSION_PROJECTIVEVECTORSPACE:
                return new ProjectiveVectorSpace4DStrategy();
            default:
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'createStrategy', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType.PROJECTIVE { return ProjectiveVectorSpace._spaceType; }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<Vector>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<Vector>): boolean {
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    shareSameWeightManagement(v1: ProjectiveVectorOfDimension<D>, v2: ProjectiveVectorOfDimension<D>): boolean {
        return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
    }

    dimension(): number {
        return this.dim;
    }
    
    // Methods delegate to strategy
    areSameDimension(a: ProjectiveVector, b: ProjectiveVector): boolean {
        return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: Real[]): ProjectiveVectorOfDimension<D> {
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
        try{
            const vect = this.strategy.createVector(coordinates, this.weightManager);
            return vect;
        } catch(error) {
            if(error instanceof RangeError && error.message.includes(EM_WEIGHT_VALUE_STRICTLY_POSITIVE) && coordinates[coordinates.length - 1] === 0) {
                const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT);
                throw new RangeError(message.generateMessageString());
            }
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            throw new RangeError(message.generateMessageString());
        }
    }

    defaultVect(): ProjectiveVectorOfDimension<D> {
        const vect = this.strategy.defaultVect(this.weightManager);
        return vect;
    }
    
    addDescriptors(a: ProjectiveVectorOfDimension<D>, b: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D> {
        try { 
            return this.strategy.addDescriptors(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractDescriptors(a: ProjectiveVectorOfDimension<D>, b: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.subtractDescriptors(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                && error instanceof RangeError && error.message.includes(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                const message3 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(message3.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR)) {
                const message4 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
                throw new RangeError(message4.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    normDescriptor(a: ProjectiveVectorOfDimension<D>): number {
        try { 
            return this.strategy.normDescriptor(a);
        } catch (error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'norm', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scaleDescriptor(scalar: Real, v: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.scaleDescriptor(scalar, v, this.weightManager);
        } catch(error) {
            if(error instanceof RangeError && error.message.includes(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_SCALE_FACTOR_NULL)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_SCALE_FACTOR_NULL);
                throw new RangeError(message.generateMessageString());
            }
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    cloneVector(v: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.cloneVector(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
            throw new RangeError(message.generateMessageString());
        }
    }

    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVectorOfDimension<D>): RealVector {
        try {
            return this.strategy.fromProjectiveVectorSpaceToRealVectorSpace(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVectorOfDimension<D>): ProjectiveComplexVector {
      return this.strategy.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v);
    }
}

  