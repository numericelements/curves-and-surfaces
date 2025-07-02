import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NEGATIVE, EM_SCALE_FACTOR_NEGATIVE_OR_NULL, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ProjectiveVectorSpace3DStrategy } from "./ProjectiveVectorSpace3DStrategy";
import { ProjectiveVectorSpace4DStrategy } from "./ProjectiveVectorSpace4DStrategy";
import { IVector, ProjectiveVector2DTypeReal, ProjectiveVector3DTypeReal } from "./Vector";
import { ProjectiveComplexVector, ProjectiveVector, ProjectiveVector2D, ProjectiveVector3D, ProjectiveVectorOfDimension, Real, RealVector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { WeightManager } from "./WeightManager";

/**
 * Implementation of a projective vector space
 */


// Strategy interface
export interface ProjectiveVectorSpaceStrategy<D extends number> {
    getWeight(v: ProjectiveVector): Real;
    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean;
    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector;
    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    defaultVect(weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    scale(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    subtract(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    norm(a: ProjectiveVector): Real;
    clone(v: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector;
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector
}


// Main class using strategy
export class ProjectiveVectorSpace<D extends number = number> implements VectorSpace<Real, ProjectiveVectorOfDimension<D>> {
    private dim: D;
    protected strategy: ProjectiveVectorSpaceStrategy<D>;
    protected _weightManagement: WeightManagement;
    private weightManager: WeightManager;
    
    constructor(dimension: D, weightManagement: WeightManagement = WeightManagement.AllStrictlyPositiveWeights) {
        this.dim = dimension;
        this._weightManagement = weightManagement;
        // Create weight manager
        this.weightManager = new WeightManager(weightManagement);
      
        switch(this.dim) {
            case MIN_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace3DStrategy() as ProjectiveVectorSpaceStrategy<D>;
                break;
            case MAX_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace4DStrategy() as unknown as ProjectiveVectorSpaceStrategy<D>;
                break;
            default:
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
    }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    set weightManagement(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
    }

    getWeight(v: ProjectiveVector): Real {
        return this.strategy.getWeight(v);
    }

    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
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
    
    add(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVectorOfDimension<D> {
        try { 
            return this.strategy.add(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.subtract(a, b, this.weightManager);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                && error instanceof RangeError && error.message.includes(EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                const message3 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(message3.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR)) {
                const message4 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
                throw new RangeError(message4.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    norm(a: ProjectiveVector): number {
        try { 
            return this.strategy.norm(a);
        } catch (error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'norm', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scale(scalar: Real, v: ProjectiveVector): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.scale(scalar, v, this.weightManager);
        } catch(error) {
            if(error instanceof RangeError && error.message.includes(EM_SCALE_FACTOR_NEGATIVE_OR_NULL)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_SCALE_FACTOR_NEGATIVE_OR_NULL);
                throw new RangeError(message.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_SCALE_FACTOR_NEGATIVE)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_SCALE_FACTOR_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            }
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    clone(v: ProjectiveVector): ProjectiveVectorOfDimension<D> {
        try {
            return this.strategy.clone(v, this.weightManager);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
            throw new RangeError(message.generateMessageString());
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        try {
            return this.strategy.fromProjectiveVectorSpaceToRealVectorSpace(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
      return this.strategy.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v);
    }

    // Enhanced methods working with IVector
    addVectors(a: IVector, b: IVector): IVector {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error('Vector dimensions or types do not match');
        }
        const rawA = a.raw as ProjectiveVectorOfDimension<D>;
        const rawB = b.raw as ProjectiveVectorOfDimension<D>;
        const result = this.add(rawA, rawB);
        
        return this.createVectorInstance(result);
    }
    
    createVectorInstance(raw: ProjectiveVectorOfDimension<D>): IVector {
        // return this.strategy.fromRaw(raw as RealVector1D);
        switch (this.dim) {
            case 3:
                return ProjectiveVector2DTypeReal.fromRaw(raw as ProjectiveVector2D);
            case 4:
                return ProjectiveVector3DTypeReal.fromRaw(raw as ProjectiveVector3D);
            default:
                throw new Error('Unsupported dimension');
        }
    }
}

  