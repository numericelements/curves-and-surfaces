import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEX, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, ProjectiveVector2D, PROJECTIVEVECTOR2D, ProjectiveVector3D, PROJECTIVEVECTOR3D, Real, RealVector, REALVECTOR2D, REALVECTOR3D, VectorSpace, WEIGHT, Weight_Interface } from "./VectorSpaceConstructorInterface";
import { isVector3D, isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

/**
 * Implementation of a real vector space
 */
// export class ProjectiveVectorSpace implements VectorSpace<Real, ProjectiveVector> {
//     private readonly dim: number;
//     protected _weightManagement: WeightManagement;

// constructor(dimension: number, weightManagement: WeightManagement = WeightManagement.AllStrictlyPositiveWeights) {
//         if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
//             const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//         this.dim = dimension;
//         this._weightManagement = weightManagement;
//     }

//     get weightManagement(): WeightManagement {
//         return this._weightManagement;
//     }

//     set weightManagement(weightManagement: WeightManagement) {
//         this._weightManagement = weightManagement;
//     }

//     areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
//         if((isVector3D(v1) && isVector3D(v2) && this.dim === MIN_DIMENSION_PROJECTIVEVECTORSPACE) ||
//             (isVector4D(v1) && isVector4D(v2) && this.dim === MAX_DIMENSION_PROJECTIVEVECTORSPACE)) {
//             return true;
//         } else return false;
//     }

//     shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
//         if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
//             if(v1.type === PROJECTIVEVECTOR2D && v2.type === PROJECTIVEVECTOR2D && this._weightManagement !== WeightManagement.SomeNullWeights) {
//                 if(v1.coordinates[2].value.strictlyPositive === v2.coordinates[2].value.strictlyPositive) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             } else if(v1.type === PROJECTIVEVECTOR2D && this._weightManagement === WeightManagement.SomeNullWeights) {
//                 return true;
//             } else if(v1.type === PROJECTIVEVECTOR3D && v2.type === PROJECTIVEVECTOR3D && this._weightManagement !== WeightManagement.SomeNullWeights) {
//                 if(v1.coordinates[3].value.strictlyPositive === v2.coordinates[3].value.strictlyPositive) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             } else if(v1.type === PROJECTIVEVECTOR3D && this._weightManagement === WeightManagement.SomeNullWeights) {
//                 return true;
//             } else {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//                 throw new RangeError(error.generateMessageString());
//             }
//         } else {
//             if(!this.areSameDimension(v1, v2)) {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
//                 throw new RangeError(error.generateMessageString());
//             }
//             const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
//         if (isVector3D(v) && this.dim === MIN_DIMENSION_PROJECTIVEVECTORSPACE) {
//             return v.type === PROJECTIVEVECTOR2D;
//         } else if (isVector4D(v) && this.dim === MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
//             return v.type === PROJECTIVEVECTOR3D;
//         } else return false;
//     }

//     defaultVect(): ProjectiveVector {
//         if (this.dim === MIN_DIMENSION_PROJECTIVEVECTORSPACE) {
//             let vector: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight()}]};
//             if(this._weightManagement === WeightManagement.AllPositiveWeights) {
//                 vector = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(DEFAULT_WEIGHT_VALUE, false)}]};
//             }
//             return vector;
//         } else {
//             // All other cases are 4D, i.e., with MAX_DIMENSION_PROJECTIVEVECTORSPACE, because dim is read-only and is checked in constructor
//             let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight()}]};
//             if(this._weightManagement === WeightManagement.AllPositiveWeights) {
//                 vector = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight(DEFAULT_WEIGHT_VALUE, false)}]};
//             }
//             return vector;
//         }
//     }

//     add(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
//         if (((isVector3D(a) && isVector3D(b)) || (isVector4D(a) && isVector4D(b))) && this.isInVectorSpace(a)) {
//             const result = (a.coordinates as number[]).map((val, i) => val + (b.coordinates as number[])[i]);
//             if(isVector3D(a)) {
//                 if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
//                     return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
//                 } else if(this._weightManagement === WeightManagement.AllPositiveWeights) {
//                     return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2], false)}]};
//                 } else {
//                     if(result[2] < NULL_WEIGHT_TOLERANCE) {
//                         return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(0, false)}]};
//                     }
//                     return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
//                 }
//             } else {
//                 // All other cases reduce to Vector4D because ProjectiveVector has been checked ProjectiveVector2D
//                 if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
//                     return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
//                 } else if(this._weightManagement === WeightManagement.AllPositiveWeights) {
//                     return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3], false)}]};
//                 } else {
//                     if(result[3] < NULL_WEIGHT_TOLERANCE) {
//                         return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(0, false)}]};
//                     }
//                     return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
//                 }
//             }
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     scale(scalar: Real, v: ProjectiveVector): ProjectiveVector {
//         const result = (v.coordinates as number[]).map((val) => (scalar * val));
//         if (isVector3D(v)) {
//             return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
//         } else if (isVector4D(v)) {
//             return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
//         if ((isVector3D(a) && isVector3D(b)) ||
//                 (isVector4D(a) && isVector4D(b))) {
//             const result = (a.coordinates as number[]).map((val, i) => val - (b.coordinates as number[])[i]);
//             if(isVector3D(a)) {
//                 return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
//             } else if(isVector4D(a)) {
//                 return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
//             } else {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
//                 throw new RangeError(error.generateMessageString());
//             }
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     dimension(): number {
//         return this.dim;
//     }

//     clone(v: ProjectiveVector): ProjectiveVector {
//         if(isVector3D(v)) {
//             return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], {type: WEIGHT, value: new Weight(v.coordinates[2].value.weight)}]};
//         } else if(isVector4D(v)) {
//             return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], {type: WEIGHT, value: new Weight(v.coordinates[3].value.weight)}]};
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
//         const result: number[] = [];
//         const weight = (v.coordinates[v.coordinates.length - 1] as Weight_Interface).value.weight
//         if(weight === 0) {
//             if(v.type === PROJECTIVEVECTOR3D) {
//                 return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
//             } else if(v.type === PROJECTIVEVECTOR2D) {
//                 return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
//             } else {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//                 throw new RangeError(error.generateMessageString());
//             }
//         } else {
//             for( let i = 0; i < v.coordinates.length - 1; i++) {
//                 result.push(v.coordinates[i] as number / weight) ;
//             }
//             if(v.type === PROJECTIVEVECTOR3D) {
//                 return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
//             } else if(v.type === PROJECTIVEVECTOR2D) {
//                 return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
//             } else {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//                 throw new RangeError(error.generateMessageString());
//             }
//         }
//     }

//     fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
//         const result: number[] = [];
//         const weight = (v.coordinates[v.coordinates.length - 1] as Weight_Interface).value
//         if(v.type === PROJECTIVEVECTOR2D) {
//             if(weight.weight === 0) {
//                 const cWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
//                 return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]}, cWeight]};  
//             } else {
//                 return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]},
//                 {type: COMPLEXWEIGHT, real: weight, imaginery: weight}]};
//             }
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }
// }

// Strategy interface
export interface ProjectiveVectorSpaceStrategy {
    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean;
    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector;
    defaultVect(weightManager: WeightManager): ProjectiveVector;
    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector;
    scale(scalar: Real, v: ProjectiveVector): ProjectiveVector;
    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector;
    clone(v: ProjectiveVector): ProjectiveVector;
    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector;
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector
}

export class ProjectiveVectorSpace3DStrategy implements ProjectiveVectorSpaceStrategy {
    // Implementation for 3D vectors

    shareSameWeightManagement(v1: ProjectiveVector2D, v2: ProjectiveVector2D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[2].value;
            const weight2 = v2.coordinates[2].value;
            return weightManager.isSameWeightManagement(weight1, weight2);
        } else {
            if(!this.areSameDimension(v1, v2)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        if(isVector3D(v)) return true;
        return false;
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector {
        let vector: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE))}]};
        return vector;
    }

    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector3D(a) && isVector3D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[2].value, b.coordinates[2].value);
            return {type: PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], {type: WEIGHT, value: sumWeights}]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
        if(isVector3D(a) && isVector3D(b)) {
            const diffWeights = a.coordinates[2].value.weight + b.coordinates[2].value.weight;
            return {type: PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], {type: WEIGHT, value: new Weight(diffWeights)}]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: ProjectiveVector): ProjectiveVector {
        if(isVector3D(v)) {
            return {type: PROJECTIVEVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], {type: WEIGHT, value: new Weight(scalar * v.coordinates[2].value.weight)}]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: ProjectiveVector): ProjectiveVector {
        if(isVector3D(v)) {
            return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], {type: WEIGHT, value: new Weight(v.coordinates[2].value.weight)}]};
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].value.weight;
            if(weight === 0) {
                return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].value;
            if(weight.weight === 0) {
                const cWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]}, cWeight]};  
            } else {
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]},
                {type: COMPLEXWEIGHT, real: weight, imaginery: weight}]};
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}

export class ProjectiveVectorSpace4DStrategy implements ProjectiveVectorSpaceStrategy {
    // Implementation for 4D vectors

    shareSameWeightManagement(v1: ProjectiveVector3D, v2: ProjectiveVector3D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[3].value;
            const weight2 = v2.coordinates[3].value;
            return weightManager.isSameWeightManagement(weight1, weight2);
        } else {
            if(!this.areSameDimension(v1, v2)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        if(isVector4D(v)) return true;
        return false;
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector {
        let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE))}]};
        return vector;
    }

    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector4D(a) && isVector4D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[3].value, b.coordinates[3].value);
            return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], {type: WEIGHT, value: sumWeights}]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
        if(isVector4D(a) && isVector4D(b)) {
            const diffWeights = a.coordinates[3].value.weight + b.coordinates[3].value.weight;
            return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], {type: WEIGHT, value: new Weight(diffWeights)}]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: ProjectiveVector): ProjectiveVector {
        if(isVector4D(v)) {
            return {type: PROJECTIVEVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], {type: WEIGHT, value: new Weight(scalar * v.coordinates[3].value.weight)}]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: ProjectiveVector): ProjectiveVector {
        if(isVector4D(v)) {
            return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], {type: WEIGHT, value: new Weight(v.coordinates[3].value.weight)}]};
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        if(isVector4D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[3].value.weight;
            if(weight === 0) {
                return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
}

  // Main class using strategy
export class ProjectiveVectorSpace implements VectorSpace<Real, ProjectiveVector> {
    private dim: number;
    protected strategy: ProjectiveVectorSpaceStrategy;
    protected _weightManagement: WeightManagement;
    private weightManager: WeightManager;
    
    constructor(dimension: number, weightManagement: WeightManagement = WeightManagement.AllStrictlyPositiveWeights) {
        this.dim = dimension;
        console.log("dim = ", this.dim);
        this._weightManagement = weightManagement;
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }

        // Create weight manager
        this.weightManager = new WeightManager(weightManagement);
      
        // Select appropriate strategy based on dimension
        switch(this.dim) {
            case MIN_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace3DStrategy();
                break;
            case MAX_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace4DStrategy();
                break;
            default:
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    set weightManagement(weightManagement: WeightManagement) {
        this._weightManagement = weightManagement;
    }

    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
        return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
    }

    dimension(): number {
        return this.dim;
    }
    
    // Methods delegate to strategy
    areSameDimension(a: ProjectiveVector, b: ProjectiveVector): boolean {
        return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        return this.strategy.isInVectorSpace(v);
    }

    defaultVect(): ProjectiveVector {
        const vect = this.strategy.defaultVect(this.weightManager);
        return vect;
    }
    
    add(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
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
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
        try {
            return this.strategy.subtract(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scale(scalar: Real, v: ProjectiveVector): ProjectiveVector {
        try {
            return this.strategy.scale(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    clone(v: ProjectiveVector): ProjectiveVector {
        try{
            return this.strategy.clone(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
            throw new RangeError(message.generateMessageString());
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
      return this.strategy.fromProjectiveVectorSpaceToRealVectorSpace(v);
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
      return this.strategy.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v);
    }
}

  