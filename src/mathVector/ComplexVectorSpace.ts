import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR, EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_COMPLEXVECTORS_DIFFERENT_DIM, EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_IMAGINARYWEIGHT_NEGATIVE, EM_INPUT_ARRAY_INCONSISTENT_LENGTH, EM_REALWEIGHT_NEGATIVE } from "../ErrorMessages/ComplexVectorSpace";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../namedConstants/ComplexVectorSpace";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { ComplexVectorSpace1DStrategy } from "./ComplexVectorSpace1DStrategy";
import { ComplexVectorSpace2DStrategy } from "./ComplexVectorSpace2DStrategy";
import { COMPLEX, Complex, ComplexVector, COMPLEXVECTOR2D, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, RealVector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

// Strategy interface
export interface ComplexVectorSpaceStrategy {
    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean;
    isInVectorSpace(v: ComplexVector): v is ComplexVector;
    createVector(coordinates: number[][]): ComplexVector;
    defaultVect(): ComplexVector;
    add(a: ComplexVector, b: ComplexVector): ComplexVector;
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVector;
    subtract(a: ComplexVector, b: ComplexVector): ComplexVector;
    clone(v: ComplexVector): ComplexVector;
    // norm(v: ComplexVector): number;
    // normalize(v: ComplexVector): ComplexVector;
    fromComplexVectorSpaceToRealVectorSpace(v: ComplexVector): RealVector;
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(v: ComplexVector, weight: ComplexWeight): ProjectiveComplexVector
}

export class ComplexVectorSpace implements VectorSpace<Complex, ComplexVector> {
    protected readonly dim: number;
    protected strategy: ComplexVectorSpaceStrategy;

    constructor(dimension: number) {
        this.dim = dimension;

        switch (this.dim) {
            case MIN_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace1DStrategy();
                break;
            case MAX_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace2DStrategy();
                break;
            default:
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
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

    createVector(coordinates: number[][]): ComplexVector {
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

    defaultVect(): ComplexVector {
        return this.strategy.defaultVect();
    }

    add(a: ComplexVector, b: ComplexVector): ComplexVector {
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

    scale(scalar: Complex, vector: ComplexVector): ComplexVector;
    scale(scalar: number, vector: ComplexVector): ComplexVector;
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVector {
        try {
            return this.strategy.scale(scalar, vector);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    subtract(a: ComplexVector, b: ComplexVector): ComplexVector {
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

    clone(vector: ComplexVector): ComplexVector {
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
}