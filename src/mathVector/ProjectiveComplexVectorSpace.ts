import { EM_COMPLEX_SCALE_FACTOR_TYPE_ERROR, EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM, EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_PRPROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER as EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER } from "../ErrorMessages/ProjectiveComplexVectorSpace";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE } from "../ErrorMessages/ProjectiveVectorSpace";
import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../namedConstants/ProjectiveComplexVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ComplexOperators } from "./ComplexOperators";
import { ProjectiveComplexVectorSpace2DStrategy } from "./ProjectiveComplexVectorSpace2DStrategy";
import { IVector, ProjectiveVector1DTypeComplex } from "./Vector";
import { COMPLEX, Complex, ComplexVector, ComplexVector1D, COMPLEXWEIGHT, ComplexWeight, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveComplexVectorOfDimension, Real, VectorSpace, Weight_Interface } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

// Strategy interface
export interface ProjectiveComplexVectorSpaceStrategy<D extends number> {
    getWeight(v: ProjectiveComplexVector): Real;
    shareSameWeightManagement(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean;
    isInVectorSpace(v: ProjectiveComplexVector): v is ProjectiveComplexVector;
    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    defaultVect(weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    scale(scalar: Complex | number, v: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    norm(a: ProjectiveComplexVector): Real;
    clone(v: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(v: ProjectiveComplexVector, weightManager: WeightManager): ComplexVector1D;
}


export class ProjectiveComplexVectorSpace<D extends number = number> implements VectorSpace<Complex, ProjectiveComplexVectorOfDimension<D>> {
    private readonly dim: D;
    protected strategy: ProjectiveComplexVectorSpaceStrategy<D>;
    protected _weightManagement: WeightManagement;
    private weightManager: WeightManager;

    constructor(dimension: D, weightManagement: WeightManagement = WeightManagement.AllStrictlyPositiveWeights) {
        this.dim = dimension;
        this._weightManagement = weightManagement;
        this.weightManager = new WeightManager(weightManagement);
        switch (this.dim) {
            case MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE:
                this.strategy = new ProjectiveComplexVectorSpace2DStrategy() as unknown as ProjectiveComplexVectorSpaceStrategy<D>;
                break;
            default:
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
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

    isInVectorSpace(v: ProjectiveComplexVector): v is ProjectiveComplexVector {
        return this.strategy.isInVectorSpace(v);
    }

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

    createVector(coordinates: number[][], weightManager: WeightManager): ProjectiveComplexVector {
        const complex1: Complex = {type: COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1]};
        const complexWeight: Complex = {type: COMPLEX, real: coordinates[1][0], imaginary: coordinates[1][1]};
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PRPROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[1][0] === 0)) {
            let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [complex1, {type: COMPLEXWEIGHT,
                real: weightManager.setWeightStatus(new Weight(coordinates[1][0], false)), imaginary: weightManager.setWeightStatus(new Weight(coordinates[1][1], false))}]};
            return vector;
        } else {
            let vector: ProjectiveComplexVector = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [complex1, {type: COMPLEXWEIGHT, 
                real: weightManager.setWeightStatus(new Weight(coordinates[1][0])), imaginary: weightManager.setWeightStatus(new Weight(coordinates[1][1]))}]};
            return vector;
        }
    }

    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.add(a, b, this.weightManager);
            } catch (error) {
                if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                }
                const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    norm(v: ProjectiveComplexVector): number {
        try { 
            return this.strategy.norm(v);
        } catch (error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'norm', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scale(scaleFactor: Complex, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    scale(scaleFactor: number, vector: ProjectiveComplexVector): ProjectiveComplexVector;
    scale(scaleFactor: Complex | number, vector: ProjectiveComplexVector): ProjectiveComplexVector {
        if(!this.hasSameRealImagineryWeightManagement(vector)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        try {
            return this.strategy.scale(scaleFactor, vector, this.weightManager);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }

    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.subtract(a, b, this.weightManager);
            } catch (error) {
                if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                    && error instanceof RangeError && error.message.includes(EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                    const message3 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                    throw new RangeError(message3.generateMessageString());
                } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR)) {
                    const message4 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
                    throw new RangeError(message4.generateMessageString());
                }
                const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    clone(vector: ProjectiveComplexVector): ProjectiveComplexVector {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.clone(vector, this.weightManager);
            } catch (error) {
                const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
                throw new RangeError(message.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector: ProjectiveComplexVector): ComplexVector1D {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector, this.weightManager);
            } catch (error) {
                const message = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    // Enhanced methods working with IVector
    addVectors(a: IVector, b: IVector): IVector {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error('Vector dimensions or types do not match');
        }
        const rawA = a.raw as ProjectiveComplexVector;
        const rawB = b.raw as ProjectiveComplexVector;
        const result = this.add(rawA, rawB);
        
        return this.createVectorInstance(result);
    }
    
    createVectorInstance(raw: ProjectiveComplexVector): IVector {
        return ProjectiveVector1DTypeComplex.fromRaw(raw as ProjectiveComplexVector);
    }
}