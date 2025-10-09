import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR, EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_COMPLEXVECTORS_DIFFERENT_DIM, EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_IMAGINARYWEIGHT_NEGATIVE, EM_INPUT_ARRAY_INCONSISTENT_LENGTH, EM_REALWEIGHT_NEGATIVE } from "../ErrorMessages/ComplexVectorSpace";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../namedConstants/ComplexVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import { COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { ComplexVectorSpace1DStrategy } from "./ComplexVectorSpace1DStrategy";
import { ComplexVectorSpace2DStrategy } from "./ComplexVectorSpace2DStrategy";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { IVector } from "./Vector";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { Vector2DTypeComplex } from "./Vector2DTypeComplex";
import { Complex, ComplexVector, ComplexVector1D, ComplexVector2D, ComplexVectorOfDimension, ComplexWeight, COMPLEXWEIGHT, IdentifiableVectorSpace, ProjectiveComplexVector, RealVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

// Strategy interface
export interface ComplexVectorSpaceStrategy<D extends number> {
    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean;
    isInVectorSpace(v: ComplexVector): v is ComplexVector;
    createVector(coordinates: number[][]): ComplexVectorOfDimension<D>;
    defaultVect(): ComplexVectorOfDimension<D>;
    add(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D>;
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVectorOfDimension<D>;
    subtract(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D>;
    clone(v: ComplexVector): ComplexVectorOfDimension<D>;
    norm(v: ComplexVector): number;
    // normalize(v: ComplexVector): ComplexVector;
    fromComplexVectorSpaceToRealVectorSpace(v: ComplexVector): RealVector;
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(v: ComplexVector, weight: ComplexWeight): ProjectiveComplexVector
}


export class ComplexVectorSpace<D extends number = number> implements IdentifiableVectorSpace<Complex, ComplexVectorOfDimension<D>> {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    
    protected readonly dim: D;
    protected strategy: ComplexVectorSpaceStrategy<D>;

    // constructor(dimension: D) {
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
            this._name = DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._name = name || COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case MIN_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace1DStrategy() as unknown as ComplexVectorSpaceStrategy<D>;
                break;
            case MAX_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace2DStrategy() as unknown as ComplexVectorSpaceStrategy<D>;
                break;
            default:
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }

    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<any, any>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<any, any>): boolean {
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    dimension() {
        return this.dim;
    }

    areSameDimension(a: ComplexVector, b: ComplexVector): boolean {
        return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: ComplexVector): v is ComplexVector {
        return this.strategy.isInVectorSpace(v);
    }

    createVector(coordinates: number[][]): ComplexVectorOfDimension<D> {
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

    createComplexWeight(a: number, b: number): ComplexWeight {
        try {
            const realWeight = this.createWeight(a);
            const imagWeight = this.createWeight(b);
            return { type: COMPLEXWEIGHT, real: realWeight, imaginary: imagWeight };
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

    defaultVect(): ComplexVectorOfDimension<D> {
        return this.strategy.defaultVect();
    }

    addRaw(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D> {
        try {
            return this.strategy.add(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    norm(vector: ComplexVector): number {
        try {
            return this.strategy.norm(vector);
        } catch(error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'norm', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scaleRaw(scalar: Complex, vector: ComplexVector): ComplexVectorOfDimension<D>;
    scaleRaw(scalar: number, vector: ComplexVector): ComplexVectorOfDimension<D>;
    scaleRaw(scalar: Complex | number, vector: ComplexVector): ComplexVectorOfDimension<D> {
        try {
            return this.strategy.scale(scalar, vector);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    subtractRaw(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D> {
        try {
            return this.strategy.subtract(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    cloneRaw(vector: ComplexVector): ComplexVectorOfDimension<D> {
        try {
            return this.strategy.clone(vector);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector): RealVector {
        return this.strategy.fromComplexVectorSpaceToRealVectorSpace(vector);
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}): ProjectiveComplexVector {
        return this.strategy.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight);
    }

    // Enhanced methods working with IVector
    addVectors(a: IVector, b: IVector): IVector {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error('Vector dimensions or types do not match');
        }
        const rawA = a.descriptor as ComplexVectorOfDimension<D>;
        const rawB = b.descriptor as ComplexVectorOfDimension<D>;
        const result = this.addRaw(rawA, rawB);
        
        return this.createVectorInstance(result);
    }

    createVectorInstance(raw: ComplexVectorOfDimension<D>): IVector {
        // return this.strategy.fromRaw(raw as RealVector1D);
        switch (this.dim) {
            case 1:
                return Vector1DTypeComplex.fromRaw(raw as ComplexVector1D);
            case 2:
                return Vector2DTypeComplex.fromRaw(raw as ComplexVector2D);
            default:
                throw new Error('Unsupported dimension');
        }
    }
}