import { EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { RealVectorSpace1DStrategy } from "./RealVectorSpace1DStrategy";
import { RealVectorSpace2DStrategy } from "./RealVectorSpace2DStrategy";
import { RealVectorSpace3DStrategy } from "./RealVectorSpace3DStrategy";
import { RealVectorSpace4DStrategy } from "./RealVectorSpace4DStrategy";
import { ComplexVector, ProjectiveVector, Real, RealVector, RealVectorOfDimension, VectorSpace } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Implementation of a real vector space
 */


// Strategy interface
export interface RealVectorSpaceStrategy<D extends number> {
    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    createVector(coordinates: Real[]): RealVectorOfDimension<D>;
    defaultVect(): RealVectorOfDimension<D>;
    add(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    scale(scalar: Real, v: RealVector): RealVectorOfDimension<D>;
    subtract(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    clone(v: RealVector): RealVectorOfDimension<D>;
    norm(v: RealVector): number;
    normalize(v: RealVector): RealVector;
    crossProduct(a: RealVector, b: RealVector): RealVector;
    dot(a: RealVector, b: RealVector): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector
}

  // Main class using strategy
export class RealVectorSpace<D extends number = number> implements VectorSpace<Real, RealVectorOfDimension<D>> {
    protected readonly dim: D;
    protected strategy: RealVectorSpaceStrategy<D>;
    
    constructor(dimension: D) {
        this.dim = dimension;
      
        switch(this.dim) {
            case MIN_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace1DStrategy() as unknown as RealVectorSpaceStrategy<D>;
                break;
            case 2:
                this.strategy = new RealVectorSpace2DStrategy() as RealVectorSpaceStrategy<D>;
                break;
            case 3:
                this.strategy = new RealVectorSpace3DStrategy() as unknown as RealVectorSpaceStrategy<D>;
                break;
            case MAX_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace4DStrategy() as unknown as RealVectorSpaceStrategy<D>;
                break;
            default:
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension(): number {
        return this.dim;
    }
    
    areSameDimension(a: RealVector, b: RealVector): boolean {
      return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: RealVector): v is RealVector {
      return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: Real[]): RealVectorOfDimension<D> {
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        const vect = this.strategy.createVector(coordinates);
        return vect;
    }

    defaultVect(): RealVectorOfDimension<D> {
        return this.strategy.defaultVect();
    }
    
    add(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try { 
            return this.strategy.add(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtract(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.subtract(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scale(scalar: Real, v: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.scale(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    clone(v: RealVector): RealVectorOfDimension<D> {
        try{
            return this.strategy.clone(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REALVECTOR_NOT_IN_VECTORSPACE)
            throw new RangeError(message.generateMessageString());
        }
    }

    norm(v: RealVector): number {
        try {
            return this.strategy.norm(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'norm', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    normalize(v: RealVector): RealVector {
        try {
            return this.strategy.normalize(v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    crossProduct(a: RealVector, b: RealVector): RealVector {
            return this.strategy.crossProduct(a, b);
    }

    dot(a: RealVector, b: RealVector): number {
        try {
            return this.strategy.dot(a, b);
        } catch(error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'dot', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'dot', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector {
      return this.strategy.fromRealVectorSpaceToProjectiveVectorSpace(v, weight);
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector {
      return this.strategy.fromRealVectorSpaceToComplexVectorSpace(v);
    }
  }
  
export function createRealVectorSpace(dimension: 1): RealVectorSpace<1>;
export function createRealVectorSpace(dimension: 2): RealVectorSpace<2>;
export function createRealVectorSpace(dimension: 3): RealVectorSpace<3>;
export function createRealVectorSpace(dimension: 4): RealVectorSpace<4>;
export function createRealVectorSpace(dimension: number): RealVectorSpace<number>;
export function createRealVectorSpace(dimension: number): RealVectorSpace<any> {
    if(dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
        const error = sendRangeErrorMessage("createRealVectorSpace", 'function', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
    return new RealVectorSpace(dimension);
}