import { EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEREALVECTOR_WITH_NULL_WEIGHT, EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM, EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveRealVectorSpace";
import { EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { ProjectiveRealVectorSpace2DStrategy } from "./ProjectiveRealVectorSpace2DStrategy";
import { ProjectiveRealVectorSpace3DStrategy } from "./ProjectiveRealVectorSpace3DStrategy";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { WeightManager } from "./WeightManager";
import { DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { PROJECTIVE_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import type { ProjectiveRealVectorSpaceStrategy } from "./interfaces/VectorSpaceStrategyInterfaces";
import type { IdentifiableVectorSpace, ProjectiveRealVectorSpaceInterface } from "./interfaces/VectorSpaceInterfaces";
import type { ProjectiveRealVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, Real, RealVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";

/**
 * Implementation of a projective real vector space
 */

export class ProjectiveRealVectorSpace<D extends number = number, VD extends ProjectiveRealVectorDesc = ProjectiveRealVectorOfDimension<D>> implements ProjectiveRealVectorSpaceInterface<D, VD> {
    
    private static readonly _spaceType = VectorSpaceType.PROJECTIVEREAL as const;
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    private readonly dim: D;
    private readonly weightManager: WeightManager;
    protected readonly strategy: ProjectiveRealVectorSpaceStrategy<D, VD>;
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

    private createStrategy(dimension: number): ProjectiveRealVectorSpaceStrategy<D, VD> {
        switch(dimension) {
            case MIN_DIMENSION_PROJECTIVEREALVECTORSPACE:
                return new ProjectiveRealVectorSpace2DStrategy() as unknown as ProjectiveRealVectorSpaceStrategy<D, VD>;
            case MAX_DIMENSION_PROJECTIVEREALVECTORSPACE:
                return new ProjectiveRealVectorSpace3DStrategy() as unknown as ProjectiveRealVectorSpaceStrategy<D, VD>;
            default:
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'createStrategy', EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType.PROJECTIVEREAL { return ProjectiveRealVectorSpace._spaceType; }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    shareSameWeightManagement(v1: VD, v2: VD): boolean {
        return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
    }

    dimension(): number {
        return this.dim;
    }
    
    // Methods delegate to strategy
    areSameDimension(a: ProjectiveRealVectorDesc, b: ProjectiveRealVectorDesc): boolean {
        return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: ProjectiveRealVectorDesc): v is ProjectiveRealVectorDesc {
        return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: readonly Real[]): VD {
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
        try{
            const vect = this.strategy.createVector(coordinates, this.weightManager);
            return vect;
        } catch(error) {
            if(error instanceof RangeError && error.message.includes(EM_WEIGHT_VALUE_STRICTLY_POSITIVE) && coordinates[coordinates.length - 1] === 0) {
                const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEREALVECTOR_WITH_NULL_WEIGHT);
                throw new RangeError(message.generateMessageString());
            }
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
            throw new RangeError(message.generateMessageString());
        }
    }

    defaultVect(): VD {
        const vect = this.strategy.defaultVect(this.weightManager);
        return vect;
    }
    
    addDescriptors(a: VD, b: VD): VD {
        try { 
            return this.strategy.addDescriptors(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractDescriptors(a: VD, b: VD): VD {
        try {
            return this.strategy.subtractDescriptors(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                && error instanceof RangeError && error.message.includes(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                const message3 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(message3.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR)) {
                const message4 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
                throw new RangeError(message4.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    normDescriptor(a: VD): number {
        try { 
            return this.strategy.normDescriptor(a);
        } catch (error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'norm', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scaleDescriptor(scalar: Real, v: VD): VD {
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
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    cloneVector(v: VD): VD {
        try {
            return this.strategy.cloneVector(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
            throw new RangeError(message.generateMessageString());
        }
    }

    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    fromProjectiveRealVSpaceToRealVSpace(v: VD): RealVectorDesc {
        try {
            return this.strategy.fromProjectiveRealVectorSpaceToRealVectorSpace(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveRealVectorSpaceToRealVectorSpace', EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    fromProjectiveRealVSpaceToProjectiveComplexVSpace(v: VD): ProjectiveComplexVectorDesc {
      return this.strategy.fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace(v);
    }
}

  