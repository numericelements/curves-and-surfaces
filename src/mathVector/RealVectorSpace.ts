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
import type { RealVectorSpaceStrategy } from "./interfaces/VectorSpaceStrategyInterfaces";
import type { IdentifiableVectorSpace, RealVectorSpaceInterface } from "./interfaces/VectorSpaceInterfaces";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import type { RealVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { ComplexVectorDesc, ProjectiveRealVectorDesc, Real, RealVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";

/**
 * Implementation of a real vector space
 */

export class RealVectorSpace<D extends number = number, RVD extends RealVectorDesc = RealVectorOfDimension<D>> implements RealVectorSpaceInterface<D, RVD> {

    private static readonly _spaceType = VectorSpaceType.REAL as const;
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;

    protected readonly dim: D;
    protected readonly strategy: RealVectorSpaceStrategy<D, RVD>;

    
    constructor(dimension: D, isDefault: boolean = false, name?: string) {
        this.dim = dimension;
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
            this._name = DEFAULT_REAL_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._id = resolveVectorSpace(this);
            this._name = name || REAL_VECTOR_SPACE_NAME + dimension.toString();
        }
        this.strategy = this.createStrategy(dimension);
    }

    private createStrategy(dimension: number): RealVectorSpaceStrategy<D, RVD> {
        switch (dimension) {
            case MIN_DIMENSION_REALVECTORSPACE: return new RealVectorSpace1DStrategy() as unknown as RealVectorSpaceStrategy<D, RVD>;
            case 2: return new RealVectorSpace2DStrategy() as unknown as RealVectorSpaceStrategy<D, RVD>;
            case 3: return new RealVectorSpace3DStrategy() as unknown as RealVectorSpaceStrategy<D, RVD>;
            case MAX_DIMENSION_REALVECTORSPACE: return new RealVectorSpace4DStrategy() as unknown as RealVectorSpaceStrategy<D, RVD>;
            default: 
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType.REAL { return RealVectorSpace._spaceType; }


    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        if(other.spaceType === VectorSpaceType.COMPLEX && other.dimension() === 1
            && this.dim === 2) return true;
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    dimension(): number {
        return this.dim;
    }
    
    areSameDimension(a: RealVectorDesc, b: RealVectorDesc): boolean {
      return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: RVD): v is RVD {
      return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: readonly Real[]): RVD {
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        const vect = this.strategy.createVector(coordinates);
        return vect;
    }

    defaultVect(): RVD {
        return this.strategy.defaultVect();
    }

    // Utility methods
    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    // equals(other: any): boolean {
    //     return other instanceof RealVectorSpace && this.isSameSpace(other);
    // }
    
    addDescriptors(a: RVD, b: RVD): RVD {
        try { 
            return this.strategy.addDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractDescriptors(a: RVD, b: RVD): RVD {
        try {
            return this.strategy.subtractDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scaleDescriptor(scalar: Real, v: RVD): RVD {
        try {
            return this.strategy.scaleDescriptor(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    cloneVector(v: RVD): RVD {
        try{
            return this.strategy.cloneVector(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'cloneVector', EM_REALVECTOR_NOT_IN_VECTORSPACE)
            throw new RangeError(message.generateMessageString());
        }
    }

    normDescriptor(v: RVD): number {
        try {
            return this.strategy.normDescriptor(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'normDescriptor', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    normalizeDescriptor(v: RVD): RVD {
        try {
            return this.strategy.normalizeDescriptor(v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'normalizeDescriptor', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    crossProductRaw(a: RVD, b: RVD): RealVectorDesc {
            return this.strategy.crossProductRaw(a, b);
    }

    dotDescriptors(a: RVD, b: RVD): number {
        try {
            return this.strategy.dotDescriptors(a, b);
        } catch(error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'dotDescriptors', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'dotDescriptors', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    fromRealVSpaceToProjectiveRealVSpace(v: RVD, weight: Weight = new Weight()): ProjectiveRealVectorDesc {
      return this.strategy.fromRealVectorSpaceToProjectiveRealVectorSpace(v, weight);
    }

    fromRealVSpaceToComplexVSpace(v: RVD): ComplexVectorDesc {
      return this.strategy.fromRealVectorSpaceToComplexVectorSpace(v);
    }

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
  