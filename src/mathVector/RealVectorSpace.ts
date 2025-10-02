import { EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { DEFAULT_REAL_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import { REAL_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { RealVectorSpace1DStrategy } from "./RealVectorSpace1DStrategy";
import { RealVectorSpace2DStrategy } from "./RealVectorSpace2DStrategy";
import { RealVectorSpace3DStrategy } from "./RealVectorSpace3DStrategy";
import { RealVectorSpace4DStrategy } from "./RealVectorSpace4DStrategy";
import { IVector } from "./Vector";
import { Vector1DTypeReal } from "./Vector1DTypeReal";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { Vector4DTypeReal } from "./Vector4DTypeReal";
import { VectorInVectorSpace } from "./VectorInVectorSpace";
import { Complex, ComplexVector, IdentifiableVectorSpace, ProjectiveVector, Real, RealVector, RealVector1D, RealVector2D, RealVector3D, RealVector4D, RealVectorOfDimension, Scalar, Vector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Enhanced VectorSpace interface that can work with IVector instances
 */
export interface EnhancedVectorSpace<K extends Scalar, V extends Vector> extends VectorSpace<K, V> {
    // Original methods working with raw vectors
    addRaw(a: V, b: V): V;
    subtractRaw(a: V, b: V): V;
    scaleRaw(scalar: K, v: V): V;
    
    // New methods working with IVector instances
    addVectors(a: IVector, b: IVector): IVector;
    subtractVectors(a: IVector, b: IVector): IVector;
    scaleVector(scalar: K, v: IVector): IVector;
    
    // Factory method for creating vector instances
    createVectorInstance(raw: V): IVector;
    createVectorFromCoordinates(coords: (number | Complex)[]): IVector;
}



/**
 * Implementation of a real vector space
 */

// Strategy interface
export interface RealVectorSpaceStrategy<D extends number>  {
    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    createVector(coordinates: Real[]): RealVectorOfDimension<D>;
    defaultVect(): RealVectorOfDimension<D>;
    addRaw(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    scaleRaw(scalar: Real, v: RealVector): RealVectorOfDimension<D>;
    subtractRaw(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    cloneRaw(v: RealVector): RealVectorOfDimension<D>;
    normRaw(v: RealVector): number;
    normalizeRaw(v: RealVector): RealVector;
    crossProductRaw(a: RealVector, b: RealVector): RealVector;
    dotRaw(a: RealVector, b: RealVector): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector
}

// Main class using strategy
// export class RealVectorSpace<D extends number = number> implements VectorSpace<Real, RealVectorOfDimension<D>> {
export class RealVectorSpace<D extends number = number> implements IdentifiableVectorSpace<Real, RealVectorOfDimension<D>> {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    protected readonly dim: D;
    protected strategy: RealVectorSpaceStrategy<D>;
    
    constructor(dimension: D, name?: string, isDefault: boolean = false, id?: string) {
        this.dim = dimension;
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
        } else {
            // this._id = resolveVectorSpace(this, id);
            this._id = resolveVectorSpace(this);
        }
        if(this._isDefault) {
            this._name = DEFAULT_REAL_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._name = name || REAL_VECTOR_SPACE_NAME + dimension.toString();
        }
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

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }


    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<any, any>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<any, any>): boolean {
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
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

    /**
     * Creates a vector active into this vector space
     * @param coordinates - Vector coordinates
     * @returns VectorInVectorSpace instance for fluent operations
     */
    createVectorInVectorSpace(coordinates: Real[]): VectorInVectorSpace<Real, RealVectorOfDimension<D>, RealVectorSpace<D>> {
        const vector = this.createVector(coordinates);
        return this.bindVector(vector);
    }


    /**
     * Creates multiple bound vectors at once
     */
    createVectorsInVectorSpace(...coordinateSets: Real[][]): VectorInVectorSpace<Real, RealVectorOfDimension<D>, RealVectorSpace<D>>[] {
        return coordinateSets.map(coords => this.createVectorInVectorSpace(coords));
    }

    /**
     * Binds an existing vector to this vector space
     * Mathematical concept: embedding a vector into the vector space context
     * @param vector - Vector to bind
     * @returns VectorInVectorSpace instance for enhanced operations
     */
    // bindVector(vector: RealVectorOfDimension<D>): VectorInVectorSpace<Real, RealVectorOfDimension<D>, RealVectorSpace<D>>;
    // bindVector(vector: RealVector1D): VectorInVectorSpace<Real, RealVector1D, RealVectorSpace<1>>;
    // bindVector(vector: RealVector2D): VectorInVectorSpace<Real, RealVector2D, RealVectorSpace<2>>;
    // bindVector(vector: RealVector3D): VectorInVectorSpace<Real, RealVector3D, RealVectorSpace<3>>;
    // bindVector(vector: RealVector4D): VectorInVectorSpace<Real, RealVector4D, RealVectorSpace<4>>;
    bindVector(vector: RealVectorOfDimension<D>): VectorInVectorSpace<Real, RealVectorOfDimension<D>, RealVectorSpace<D>> {
        if (!this.isInVectorSpace(vector)) {
            const message = sendRangeErrorMessage(this.constructor.name, 'bindVector', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        return new VectorInVectorSpace(this.createVectorInstance(vector), this as any);
    }

    defaultVect(): RealVectorOfDimension<D> {
        return this.strategy.defaultVect();
    }

    defaultVectInVectorSpace(): VectorInVectorSpace<Real, RealVectorOfDimension<D>, RealVectorSpace<D>> {
        return new VectorInVectorSpace(this.createVectorInstance(this.strategy.defaultVect()), this);
    }

    // Validation methods
    private validateVectorCompatibility(a: IVector, b: IVector): void {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error(`Vectors are not compatible: ${a.vectorType} vs ${b.vectorType}`);
        }
        if (a.dimension !== this.dim) {
            throw new Error(`Vector dimension ${a.dimension} does not match space dimension ${this.dim}`);
        }
    }

    private validateVectorBelongsToSpace(v: IVector): void {
        if (v.spaceType !== VectorSpaceType.REAL) {
            throw new Error(`Vector is not a real vector: ${v.vectorType}`);
        }
        if (v.dimension !== this.dim) {
            throw new Error(`Vector dimension ${v.dimension} does not match space dimension ${this.dim}`);
        }
    }

    // Utility methods
    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    equals(other: any): boolean {
        return other instanceof RealVectorSpace && this.isSameSpace(other);
    }
    
    addRaw(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try { 
            return this.strategy.addRaw(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractRaw(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.subtractRaw(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scaleRaw(scalar: Real, v: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.scaleRaw(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    cloneRaw(v: RealVector): RealVectorOfDimension<D> {
        try{
            return this.strategy.cloneRaw(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REALVECTOR_NOT_IN_VECTORSPACE)
            throw new RangeError(message.generateMessageString());
        }
    }

    normRaw(v: RealVector): number {
        try {
            return this.strategy.normRaw(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'norm', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    normalizeRaw(v: RealVector): RealVector {
        try {
            return this.strategy.normalizeRaw(v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    crossProductRaw(a: RealVector, b: RealVector): RealVector {
            return this.strategy.crossProductRaw(a, b);
    }

    dotRaw(a: RealVector, b: RealVector): number {
        try {
            return this.strategy.dotRaw(a, b);
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


    // Enhanced methods working with IVector
    addVectors(a: IVector, b: IVector): IVector {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error('Vector dimensions or types do not match');
        }
        const rawA = a.raw as RealVectorOfDimension<D>;
        const rawB = b.raw as RealVectorOfDimension<D>;
        const result = this.addRaw(rawA, rawB);
        
        return this.createVectorInstance(result);
    }

    createVectorInstance(raw: RealVectorOfDimension<D>): IVector {
        // return this.strategy.fromRaw(raw as RealVector1D);
        switch (this.dim) {
            case 1:
                return Vector1DTypeReal.fromRaw(raw as RealVector1D);
            case 2:
                return Vector2DTypeReal.fromRaw(raw as RealVector2D);
            case 3:
                return Vector3DTypeReal.fromRaw(raw as RealVector3D);
            case 4:
                return Vector4DTypeReal.fromRaw(raw as RealVector4D);
            default:
                throw new Error('Unsupported dimension');
        }
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