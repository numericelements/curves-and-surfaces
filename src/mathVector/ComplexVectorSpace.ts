import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR, EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../namedConstants/ComplexVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { COMPLEX, Complex, ComplexVector, COMPLEXVECTOR2D, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, RealVector, REALVECTOR2D, VectorSpace } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";



export class ComplexVectorSpace implements VectorSpace<Complex, ComplexVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
    }

    defaultVect(): ComplexVector {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginery: 0};
        if(this.dim === MIN_DIMENSION_COMPLEXVECTORSPACE) {
            return nullComplex;
        } else if (this.dim === MAX_DIMENSION_COMPLEXVECTORSPACE) {
            return {type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(a: ComplexVector, b: ComplexVector): ComplexVector {
        if (isVector1D(a) && isVector1D(b)) {
            return ComplexOperators.add(a as Complex, b as Complex);
        } else if(isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.add(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    // Overloaded scale method
    scale(scalar: Complex, vector: ComplexVector): ComplexVector;
    scale(scalar: number, vector: ComplexVector): ComplexVector;
    // Implementation of the scale method
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVector {
        if (typeof scalar === 'number') {
            if(isVector1D(vector)) {
                return {type: COMPLEX, real: scalar * vector.real, imaginery: scalar * vector.imaginery};
            } else if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => ({type: COMPLEX, real: val.real * scalar, imaginery: val.imaginery * scalar}));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginery: result[0].imaginery},
                    {type: COMPLEX, real: result[1].real, imaginery: result[1].imaginery}
                ]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else if(scalar.type === COMPLEX) {
            if(isVector1D(vector)) {
                return {type: COMPLEX,
                    real: ComplexOperators.multiply(scalar, vector).real,
                    imaginery: ComplexOperators.multiply(scalar, vector).imaginery}
            } else if(isVector2D(vector)) {
                const result = vector.coordinates.map((val) => ComplexOperators.multiply(scalar, val));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginery: result[0].imaginery},
                    {type: COMPLEX, real: result[1].real, imaginery: result[1].imaginery}
                ]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR);
            throw new RangeError(error.generateMessageString());
        }
    }

    subtract(a: ComplexVector, b: ComplexVector): ComplexVector {
        if (isVector1D(a) && isVector1D(b)) {
            return ComplexOperators.subtract(a as Complex, b as Complex);
        } else if(isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.subtract(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension() {
        return this.dim;
    }

    fromComplexVectorSpaceToRealVectorSpace(vector: ComplexVector): RealVector {
        if(isVector1D(vector)) {
            return {type: REALVECTOR2D, coordinates: [vector.real, vector.imaginery]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector: ComplexVector, weight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginery: new Weight()}): ProjectiveComplexVector {
        if(isVector1D(vector)) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [vector, weight]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}