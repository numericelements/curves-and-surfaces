import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR } from "../ErrorMessages/ComplexVectorSpace";
import { EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../namedConstants/ProjectiveComplexVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { COMPLEX, Complex, ComplexVector, COMPLEXWEIGHT, ComplexWeight, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, VectorSpace } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";



export class ProjectiveComplexVectorSpace implements VectorSpace<Complex, ProjectiveComplexVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
    }

    defaultVect(): ProjectiveComplexVector {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginery: 0};
        const defaultComplexWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginery: new Weight()};
        if(this.dim === MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, defaultComplexWeight]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1])]
            };
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    // Overloaded scale method
    scale(scalar: Complex, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    scale(scalar: number, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    // Implementation of the scale method
    scale(scalar: Complex | number, vector: ProjectiveComplexVector): ProjectiveComplexVector {
        if (typeof scalar === 'number') {
            if(isVector2D(vector)) {
                const result = (vector.coordinates as Complex[]).map((val, i) => ({type: COMPLEX, real: val.real * scalar, imaginery: val.imaginery * scalar}));
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: result[0].real, imaginery: result[0].imaginery},
                    {type: COMPLEXWEIGHT, real: new Weight(result[1].real), imaginery: new Weight(result[1].imaginery)}
                ]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else if(scalar.type === COMPLEX) {
            if(isVector2D(vector)) {
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: ComplexOperators.multiply(vector.coordinates[0], scalar).real, imaginery: ComplexOperators.multiply(vector.coordinates[0], scalar).imaginery},
                    {type: COMPLEXWEIGHT, real: ComplexOperators.multiplyWeight(scalar, vector.coordinates[1]).real, imaginery: ComplexOperators.multiplyWeight(scalar, vector.coordinates[1]).imaginery}]}
            } else {
                throw new Error('Scalar is out of the list of Complex types.');
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR);
            throw new RangeError(error.generateMessageString());
        }
    }



    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1])
            ]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension() {
        return this.dim;
    }

    clone(vector: ProjectiveComplexVector): ProjectiveComplexVector {
        return {type: vector.type, coordinates: [
            {type: vector.coordinates[0].type, real: vector.coordinates[0].real, imaginery: vector.coordinates[0].imaginery},
            {type: vector.coordinates[1].type, real: vector.coordinates[1].real, imaginery: vector.coordinates[1].imaginery}
        ]};
    }

    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector: ProjectiveComplexVector): ComplexVector {
        if(isVector2D(vector)) {
            let real = 0;
            let imaginery = 0;
            if(vector.coordinates[1].real.weight === 0) {
                real = vector.coordinates[0].real;
            } else {
                real = vector.coordinates[0].real / vector.coordinates[1].real.weight;
            }
            if(vector.coordinates[1].imaginery.weight === 0) {
                imaginery = vector.coordinates[0].imaginery;
            } else {
                imaginery = vector.coordinates[0].imaginery / vector.coordinates[1].imaginery.weight;
            }
            return {type: COMPLEX, real: real, imaginery: imaginery};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}