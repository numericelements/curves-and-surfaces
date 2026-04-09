import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_COMPLEXVECTORS_DIFFERENT_DIM, EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_IMAGINARYWEIGHT_NEGATIVE, EM_INPUT_ARRAY_INCONSISTENT_LENGTH, EM_REALWEIGHT_NEGATIVE, EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../namedConstants/ComplexVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveRealVectorSpace";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import { COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { ComplexVectorSpace1DStrategy } from "./complexVectorSpaceStrategies/ComplexVectorSpace1DStrategy";
import { ComplexVectorSpace2DStrategy } from "./complexVectorSpaceStrategies/ComplexVectorSpace2DStrategy";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { createComplexWeightDescriptor } from "./VectorDescriptorFactory";
import type { ComplexDesc, ComplexWeightDesc } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import type { ComplexVectorSpaceStrategy } from "./interfaces/VectorSpaceStrategyInterfaces";
import type { ComplexVectorSpaceInterface, IdentifiableVectorSpace } from "./interfaces/VectorSpaceInterfaces";
import type { ComplexVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { ComplexVectorDesc, ProjectiveComplexVectorDesc, RealVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";


export class ComplexVectorSpace<D extends number = number, CVD extends ComplexVectorDesc = ComplexVectorOfDimension<D>> implements ComplexVectorSpaceInterface<D, CVD> {

    private static readonly _spaceType = VectorSpaceType.COMPLEX as const;
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    protected readonly dim: D;
    protected readonly strategy: ComplexVectorSpaceStrategy<D, CVD>;

    constructor(dimension: D, isDefault: boolean = false, name?: string) {
        this.dim = dimension;
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
            this._name = DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._id = resolveVectorSpace(this);
            this._name = name || COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        this.strategy = this.createStrategy(dimension) as ComplexVectorSpaceStrategy<D, CVD>;
    }

    private createStrategy(dimension: number): ComplexVectorSpaceStrategy<number, ComplexVectorDesc> {
        switch (dimension) {
            case MIN_DIMENSION_COMPLEXVECTORSPACE: return new ComplexVectorSpace1DStrategy();
            case MAX_DIMENSION_COMPLEXVECTORSPACE: return new ComplexVectorSpace2DStrategy();
            default:
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'createStrategy', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType.COMPLEX { return ComplexVectorSpace._spaceType; }

    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        if(other.spaceType === VectorSpaceType.REAL && other.dimension() === 2
            && this.dim === 1) return true;
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    dimension(): number {
        return this.dim;
    }

    areSameDimension(a: ComplexVectorDesc, b: ComplexVectorDesc): boolean {
        return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: ComplexVectorDesc): v is ComplexVectorDesc {
        return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: readonly (readonly number[])[]): CVD {
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
        for (const coord of coordinates) {
            if (coord.length !== 2) {
                const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
                throw new RangeError(message.generateMessageString());
            }
        }
        const vect = this.strategy.createVector(coordinates);
        return vect;
    }

    createComplexWeight(a: number, b: number): ComplexWeightDesc {
        try {
            const realWeight = this.createWeight(a);
            const imagWeight = this.createWeight(b);
            return createComplexWeightDescriptor(realWeight, imagWeight);
        } catch(error) {
            if(error instanceof RangeError && error.message.includes(EM_WEIGHT_VALUE_STRICTLY_POSITIVE) && a < 0) {
                const message = sendRangeErrorMessage(this.constructor.name, 'createComplexWeight', EM_REALWEIGHT_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            } else {
                const message = sendRangeErrorMessage(this.constructor.name, 'createComplexWeight', EM_IMAGINARYWEIGHT_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            }
        }
    }

    private createWeight(a: number): Weight {
        let weight;
        if(Math.abs(a) < NULL_WEIGHT_TOLERANCE) {
            a = 0;
        }
        if(a === 0) {
            weight = new Weight(0, false);
        } else {
            weight = new Weight(a);
        }
        return weight;
    }

    defaultVect(): CVD {
        return this.strategy.defaultVect();
    }

    addDescriptors(a: CVD, b: CVD): CVD {
        try {
            return this.strategy.addDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    normDescriptor(vector: CVD): number {
        try {
            return this.strategy.normDescriptor(vector);
        } catch(error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'normDescriptor', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scaleDescriptor(scalar: ComplexDesc, vector: CVD): CVD;
    scaleDescriptor(scalar: number, vector: CVD): CVD;
    scaleDescriptor(scalar: ComplexDesc | number, vector: CVD): CVD {
        try {
            return this.strategy.scaleDescriptor(scalar, vector);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    dotDescriptors(a: CVD, b: CVD): number {
        try {
            return this.strategy.dotDescriptors(a, b);
        } catch(error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'dotDescriptors', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'dotDescriptors', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtractDescriptors(a: CVD, b: CVD): CVD {
        try {
            return this.strategy.subtractDescriptors(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    cloneVector(vector: CVD): CVD {
        try {
            return this.strategy.cloneVector(vector);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'cloneVector', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: CVD): RealVectorDesc {
        return this.strategy.fromComplexVectorSpaceToRealVectorSpace(vector);
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: CVD, weight?: ComplexWeightDesc): ProjectiveComplexVectorDesc {
        return this.strategy.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight!);
    }
}