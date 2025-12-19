import { EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { DEFAULT_REAL_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import { REAL_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { IdentifiableVectorSpace } from "./IVectorSpace";
import { RealVectorSpace1DStrategy } from "./RealVectorSpace1DStrategy";
import { RealVectorSpace2DStrategy } from "./RealVectorSpace2DStrategy";
import { RealVectorSpace3DStrategy } from "./RealVectorSpace3DStrategy";
import { RealVectorSpace4DStrategy } from "./RealVectorSpace4DStrategy";
import { IRealVectorSpaceStrategy } from "./strategies/interfaces/IRealVectorSpaceStrategy";
import { IVector } from "./Vector";
import { ComplexVector, ProjectiveVector, Real, RealVector, RealVectorOfDimension } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Implementation of a real vector space
 */

export class RealVectorSpace<D extends number = number> implements IdentifiableVectorSpace<Real, RealVectorOfDimension<D>> {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    protected readonly dim: D;
    protected strategy: IRealVectorSpaceStrategy<D>;
    
    constructor(dimension: D, isDefault: boolean = false, name?: string) {
        this.dim = dimension;
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
        } else {
            this._id = resolveVectorSpace(this);
        }
        if(this._isDefault) {
            this._name = DEFAULT_REAL_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._name = name || REAL_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch(this.dim) {
            case MIN_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace1DStrategy() as unknown as IRealVectorSpaceStrategy<D>;
                break;
            case 2:
                this.strategy = new RealVectorSpace2DStrategy() as IRealVectorSpaceStrategy<D>;
                break;
            case 3:
                this.strategy = new RealVectorSpace3DStrategy() as unknown as IRealVectorSpaceStrategy<D>;
                break;
            case MAX_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace4DStrategy() as unknown as IRealVectorSpaceStrategy<D>;
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

    defaultVect(): RealVectorOfDimension<D> {
        return this.strategy.defaultVect();
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
    
    addDescriptors(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try { 
            return this.strategy.addDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractDescriptors(a: RealVector, b: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.subtractDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scaleDescriptor(scalar: Real, v: RealVector): RealVectorOfDimension<D> {
        try {
            return this.strategy.scaleDescriptor(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    cloneVector(v: RealVector): RealVectorOfDimension<D> {
        try{
            return this.strategy.cloneVector(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REALVECTOR_NOT_IN_VECTORSPACE)
            throw new RangeError(message.generateMessageString());
        }
    }

    normDescriptor(v: RealVector): number {
        try {
            return this.strategy.normDescriptor(v);
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

    dotDescriptors(a: RealVector, b: RealVector): number {
        try {
            return this.strategy.dotDescriptors(a, b);
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
    // addVectors(a: IVector, b: IVector): IVector {
    //     if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
    //         throw new Error('Vector dimensions or types do not match');
    //     }
    //     const rawA = a.descriptor as RealVectorOfDimension<D>;
    //     const rawB = b.descriptor as RealVectorOfDimension<D>;
    //     const result = this.addRaw(rawA, rawB);
        
    //     return this.createVectorInstance(result);
    // }

    // createVectorInstance(raw: RealVectorOfDimension<D>): IVector {
    //     // return this.strategy.fromRaw(raw as RealVector1D);
    //     switch (this.dim) {
    //         case 1:
    //             return Vector1DTypeReal.fromRaw(raw as RealVector1D);
    //         case 2:
    //             return Vector2DTypeReal.fromRaw(raw as RealVector2D);
    //         case 3:
    //             return Vector3DTypeReal.fromRaw(raw as RealVector3D);
    //         case 4:
    //             return Vector4DTypeReal.fromRaw(raw as RealVector4D);
    //         default:
    //             throw new Error('Unsupported dimension');
    //     }
    // }

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