import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR } from "../ErrorMessages/ComplexVectorSpace";
import { EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM, EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER as EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER } from "../ErrorMessages/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../namedConstants/ProjectiveComplexVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { COMPLEX, Complex, ComplexVector, ComplexVector1D, COMPLEXWEIGHT, ComplexWeight, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, VectorSpace } from "./VectorSpaceConstructorInterface";
import { isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";



export class ProjectiveComplexVectorSpace implements VectorSpace<Complex, ProjectiveComplexVector> {
    private readonly dim: number;
    protected _weightManagement: WeightManagement;
    private weightManager: WeightManager;

    constructor(dimension: number, weightManagement: WeightManagement = WeightManagement.AllStrictlyPositiveWeights) {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
        this._weightManagement = weightManagement;
        this.weightManager = new WeightManager(weightManagement);
    }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    set weightManagement(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
    }

    dimension() {
        return this.dim;
    }

    // There is currently only one vector space dimension, so these methods are not neccessary yet
    // areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
    //     if(isVector2D(v1) && isVector2D(v2)) return true;
    //     return false;
    // }

    // isInVectorSpace(v: ProjectiveComplexVector): v is ProjectiveComplexVector {
    //     if(isVector2D(v)) return true;
    //     return false;
    // }

    shareSameWeightManagement(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
        // not required with only one dimension of projective complex vector space
        // if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            if(this.hasSameRealImagineryWeightManagement(v1) && this.hasSameRealImagineryWeightManagement(v2)) {
                const weight1 = v1.coordinates[1].real;
                const weight2 = v2.coordinates[1].real;
                const realWeightManagement = this.weightManager.isSameWeightManagement(weight1, weight2);
                return realWeightManagement;
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
                throw new RangeError(error.generateMessageString());
            }
        // } else {
        //     if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
        //         const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
        //         throw new RangeError(error.generateMessageString());
        //     }
        //     const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
        //     throw new RangeError(error.generateMessageString());
        // }
    }

    hasSameRealImagineryWeightManagement(v: ProjectiveComplexVector): boolean {
        // not required with only one dimension of projective complex vector space
        // if(isVector2D(v)) {
            const realWeight = v.coordinates[1].real;
            const imaginaryWeight = v.coordinates[1].imaginary;
            return this.weightManager.isSameWeightManagement(realWeight, imaginaryWeight);
        // } else {
        //     const error = sendRangeErrorMessage(this.constructor.name, 'hasSameRealImagineryWeightManagement', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_INCOMPATIBLE);
        //     throw new RangeError(error.generateMessageString());
        // }
    }

    defaultVect(): ProjectiveComplexVector {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginary: 0};
        const defaultComplexWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()};
        return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, defaultComplexWeight]};
    }

    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive === true && b.coordinates[1].real.strictlyPositive === true) {
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                    ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1])]
                };
            } else if(this._weightManagement === WeightManagement.AllPositiveWeights) {
                const complexWeight = ComplexOperators.addWeights(a.coordinates[1], b.coordinates[1]);
                if(complexWeight.real.strictlyPositive === true && complexWeight.imaginary.strictlyPositive === false) {
                    complexWeight.real = new Weight(complexWeight.real.weight, false);
                } else if(complexWeight.real.strictlyPositive === false && complexWeight.imaginary.strictlyPositive === true) {
                    complexWeight.imaginary = new Weight(complexWeight.imaginary.weight, false);
                }
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    ComplexOperators.add(a.coordinates[0], b.coordinates[0]),
                    complexWeight]
                };
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scaleFactor: Complex, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    scale(scaleFactor: number, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    scale(scaleFactor: Complex | number, vector: ProjectiveComplexVector): ProjectiveComplexVector {
        if(!this.hasSameRealImagineryWeightManagement(vector)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        if (typeof scaleFactor === 'number') {
            if(vector.coordinates[1].real.strictlyPositive === true) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.weight * scaleFactor), imaginary: new Weight(vector.coordinates[1].imaginary.weight * scaleFactor)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else if (this._weightManagement === WeightManagement.AllPositiveWeights) {
                const scaledWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(vector.coordinates[1].real.weight * scaleFactor, false), imaginary: new Weight(vector.coordinates[1].imaginary.weight * scaleFactor, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor},
                    scaledWeight]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const scaledWeight = ComplexOperators.multiplyWeight(scaleFactor, vector.coordinates[1]);
            if(this._weightManagement === WeightManagement.AllPositiveWeights) {
                if(scaledWeight.real.strictlyPositive === true && scaledWeight.imaginary.strictlyPositive === false) {
                    scaledWeight.real = new Weight(scaledWeight.real.weight, false);
                } else if(scaledWeight.real.strictlyPositive === false && scaledWeight.imaginary.strictlyPositive === true) {
                    scaledWeight.imaginary = new Weight(scaledWeight.imaginary.weight, false);
                }
            } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                if(scaledWeight.real.strictlyPositive === false || scaledWeight.imaginary.strictlyPositive === false) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                    throw new RangeError(error.generateMessageString());
                }
            }
            return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [ {type: COMPLEX, real: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).real, imaginary: ComplexOperators.multiply(vector.coordinates[0], scaleFactor).imaginary},
            scaledWeight]};
        }
    }

    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive === true && b.coordinates[1].real.strictlyPositive === true) {
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                    ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1])]
                };
            } else if(this._weightManagement === WeightManagement.AllPositiveWeights) {
                const complexWeight = ComplexOperators.subtractWeights(a.coordinates[1], b.coordinates[1]);
                if(complexWeight.real.strictlyPositive === true && complexWeight.imaginary.strictlyPositive === false) {
                    complexWeight.real = new Weight(complexWeight.real.weight, false);
                } else if(complexWeight.real.strictlyPositive === false && complexWeight.imaginary.strictlyPositive === true) {
                    complexWeight.imaginary = new Weight(complexWeight.imaginary.weight, false);
                }
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    ComplexOperators.subtract(a.coordinates[0], b.coordinates[0]),
                    complexWeight]
                };
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    clone(vector: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            return {type: vector.type, coordinates: [
                {type: vector.coordinates[0].type, real: vector.coordinates[0].real, imaginary: vector.coordinates[0].imaginary},
                {type: vector.coordinates[1].type, real: vector.coordinates[1].real, imaginary: vector.coordinates[1].imaginary}
            ]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector: ProjectiveComplexVector): ComplexVector1D {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            let real = 0;
            let imaginary = 0;
            if(vector.coordinates[1].real.weight === 0 && this._weightManagement === WeightManagement.AllPositiveWeights) {
                real = vector.coordinates[0].real;
            } else if (vector.coordinates[1].real.weight > 0 ) {
                real = vector.coordinates[0].real / vector.coordinates[1].real.weight;
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            if(vector.coordinates[1].imaginary.weight === 0 && this._weightManagement === WeightManagement.AllPositiveWeights) {
                imaginary = vector.coordinates[0].imaginary;
            } else if (vector.coordinates[1].imaginary.weight > 0 ) {
                imaginary = vector.coordinates[0].imaginary / vector.coordinates[1].imaginary.weight;
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            return {type: COMPLEX, real: real, imaginary: imaginary};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
}