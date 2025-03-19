import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { COMPLEX, ComplexVector, ProjectiveVector, ProjectiveVector2D, PROJECTIVEVECTOR2D, ProjectiveVector3D, PROJECTIVEVECTOR3D, Real, RealVector, RealVector1D, RealVector2D, REALVECTOR2D, RealVector3D, REALVECTOR3D, RealVector4D, REALVECTOR4D, VectorSpace, WEIGHT } from "./VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

// /**
//  * Implementation of a real vector space
//  */
// export class RealVectorSpace implements VectorSpace<Real, RealVector> {
//     private readonly dim: number;

//     constructor(dimension: number) {
//         if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
//             const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
//             throw new RangeError(error.generateMessageString());
//         }
//         this.dim = dimension;
//     }

//     areSameDimension(v1: RealVector, v2: RealVector): boolean {
//         if((isVector1D(v1) && isVector1D(v2) && this.dim === MIN_DIMENSION_REALVECTORSPACE) ||
//             (isVector2D(v1) && isVector2D(v2) && this.dim === 2) ||
//             (isVector3D(v1) && isVector3D(v2) && this.dim === 3) ||
//             (isVector4D(v1) && isVector4D(v2) && this.dim === MAX_DIMENSION_REALVECTORSPACE)) {
//             return true;
//         } else return false;
//     }

//     isInVectorSpace(v: RealVector): v is RealVector {
//         if (isVector1D(v) && this.dim === MIN_DIMENSION_REALVECTORSPACE) {
//             return typeof v === 'number';
//         } else if (isVector2D(v) && this.dim === 2) {
//             return v.type === REALVECTOR2D;
//         } else if (isVector3D(v) && this.dim === 3) {
//             return v.type === REALVECTOR3D;
//         } else if (isVector4D(v) && this.dim === MAX_DIMENSION_REALVECTORSPACE) {
//             return v.type === REALVECTOR4D;
//         } else return false;
//     }

//     defaultVect(): RealVector {
//         if(this.dim === MIN_DIMENSION_REALVECTORSPACE) {
//             return 0;
//         } else if (this.dim === 2) {
//             return {type: REALVECTOR2D, coordinates: [0, 0]};
//         } else if (this.dim === 3) {
//             return {type: REALVECTOR3D, coordinates: [0, 0, 0]};
//         } else {
//             // All other cases are 4D because dim is read-only and is checked in constructor
//             return {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
//         }
//     }

//     add(a: RealVector, b: RealVector): RealVector {
//         if (typeof a === 'number' && typeof b === 'number' && this.isInVectorSpace(a)) {
//             return a + b;
//         } else if (((isVector2D(a) && isVector2D(b)) ||
//                 (isVector3D(a) && isVector3D(b)) ||
//                 (isVector4D(a) && isVector4D(b))) && this.isInVectorSpace(a)) {
//             const result = (a.coordinates as number[]).map((val, i) => val + (b.coordinates as number[])[i]);
//             if(isVector2D(a)) {
//                 return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
//             } else if(isVector3D(a)) {
//                 return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
//             } else {
//                 // All other cases reduce to Vector4D because RealVector has been checked number, RealVector2D, RealVector3D
//                 return {type: REALVECTOR4D, coordinates: [result[0], result[1], result[2], result[3]]};
//             }
//         } else {
//             if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_NOT_IN_VECTORSPACE);
//                 throw new RangeError(error.generateMessageString());
//             }
//             const error = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_DIFFERENT_DIM);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     scale(scalar: Real, v: RealVector): RealVector {
//         if (typeof v === 'number' && this.isInVectorSpace(v)) {
//             return scalar * v;
//         } else if (isVector2D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
//         } else if (isVector3D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]]};
//         } else if (isVector4D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR4D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scalar * v.coordinates[3]]};
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REALVECTOR_NOT_IN_VECTORSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     subtract(a: RealVector, b: RealVector): RealVector {
//         if (typeof a === 'number' && typeof b === 'number' && this.isInVectorSpace(a)) {
//             return a - b;
//         } else if (((isVector2D(a) && isVector2D(b)) ||
//                 (isVector3D(a) && isVector3D(b)) ||
//                 (isVector4D(a) && isVector4D(b))) && this.isInVectorSpace(a)) {
//             const result = (a.coordinates as number[]).map((val, i) => val - (b.coordinates as number[])[i]);
//             if(isVector2D(a)) {
//                 return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
//             } else if(isVector3D(a)) {
//                 return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
//             } else {
//                 // All other cases reduce to Vector4D because RealVector has been checked number, RealVector2D, RealVector3D
//                 return {type: REALVECTOR4D, coordinates: [result[0], result[1], result[2], result[3]]};
//             }
//         } else {
//             if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_NOT_IN_VECTORSPACE);
//                 throw new RangeError(error.generateMessageString());
//             }
//             const error = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_DIFFERENT_DIM);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     dimension(): number {
//         return this.dim;
//     }

//     clone(v: RealVector): RealVector {
//         if (typeof v === 'number' && this.isInVectorSpace(v)) {
//             return v;
//         } else if (isVector2D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
//         } else if (isVector3D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
//         } else if (isVector4D(v) && this.isInVectorSpace(v)) {
//             return {type: REALVECTOR4D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], v.coordinates[3]]};
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REALVECTOR_NOT_IN_VECTORSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     norm(v: RealVector): number {
//         if (typeof v === 'number' && this.isInVectorSpace(v)) {
//             return Math.abs(v);
//         } else if ((isVector2D(v) || isVector3D(v) || isVector4D(v)) && this.isInVectorSpace(v)) {
//             let result = 0;
//             for(const component of v.coordinates) {
//                 result += Math.pow(component, 2);
//             }
//             result = Math.sqrt(result);
//             return result;
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'norm', EM_REALVECTOR_NOT_IN_VECTORSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     normalize(v: RealVector): RealVector {
//         if (typeof v === 'number' && this.isInVectorSpace(v)) {
//             return v / this.norm(v);
//         } else if ((isVector2D(v) || isVector3D(v) || isVector4D(v)) && this.isInVectorSpace(v)) {
//             const norm = this.norm(v);
//             const result = (v.coordinates as number[]).map(val => val / norm);
//             if(isVector2D(v)) {
//                 return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
//             } else if(isVector3D(v)) {
//                 return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
//             } else {
//                 return {type: REALVECTOR4D, coordinates: [result[0], result[1], result[2], result[3]]};
//             } 
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_REALVECTOR_NOT_IN_VECTORSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     crossProduct(a: RealVector, b: RealVector): RealVector {
//         if (typeof a === 'number' && typeof b === 'number' && this.isInVectorSpace(a)) {
//             const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
//             throw new RangeError(error.generateMessageString());
//         } else if(isVector2D(a) && isVector2D(b) && this.isInVectorSpace(a)) {
//             return (a.coordinates[0] * b.coordinates[1]) - (a.coordinates[1] * b.coordinates[0]);
//         } else if(isVector3D(a) && isVector3D(b) && this.isInVectorSpace(a)) {
//             const result = [
//                 (a.coordinates[1] * b.coordinates[2]) - (a.coordinates[2] * b.coordinates[1]),
//                 (a.coordinates[2] * b.coordinates[0]) - (a.coordinates[0] * b.coordinates[2]),
//                 (a.coordinates[0] * b.coordinates[1]) - (a.coordinates[1] * b.coordinates[0])
//             ];
//             return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
//         } else if (isVector4D(a) && isVector4D(b) && this.isInVectorSpace(a)) {
//             const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
//             throw new RangeError(error.generateMessageString());
//         } else {
//             if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
//                 throw new RangeError(error.generateMessageString());
//             }
//             const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     dot(a: RealVector, b: RealVector): number {
//         if (typeof a === 'number' && typeof b === 'number' && this.isInVectorSpace(a)) {
//             return a * b;
//         } else if (((isVector2D(a) && isVector2D(b)) ||
//                 (isVector3D(a) && isVector3D(b)) ||
//                 (isVector4D(a) && isVector4D(b))) && this.isInVectorSpace(a)) {
//             let result = 0;
//             for(let i = 0; i < a.coordinates.length; i++) {
//                 result += a.coordinates[i] * b.coordinates[i];
//             }
//             return result;
//         } else {
//             if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'dot', EM_REALVECTORS_NOT_IN_VECTORSPACE);
//                 throw new RangeError(error.generateMessageString());
//             }
//             const error = sendRangeErrorMessage(this.constructor.name, 'dot', EM_REALVECTORS_DIFFERENT_DIM);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector {
//         if(isVector2D(v) || isVector3D(v)) {
//             const result = (v.coordinates as number[]).map((val) => (val * weight.weight));
//             if(isVector2D(v) && this.isInVectorSpace(v)) {
//                 return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: weight}]};
//             } else if(isVector3D(v) && this.isInVectorSpace(v)) {
//                 return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: weight}]};
//             } else {
//                 const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
//                 throw new RangeError(error.generateMessageString());
//             }
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }

//     fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector {
//         if(isVector2D(v) && this.isInVectorSpace(v)) {
//             return {type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]};
//         } else {
//             const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
//             throw new RangeError(error.generateMessageString());
//         }
//     }
// }

// Strategy interface
export interface RealVectorSpaceStrategy {
    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    defaultVect(): RealVector;
    add(a: RealVector, b: RealVector): RealVector;
    scale(scalar: Real, v: RealVector): RealVector;
    subtract(a: RealVector, b: RealVector): RealVector;
    clone(v: RealVector): RealVector;
    norm(v: RealVector): number;
    normalize(v: RealVector): RealVector;
    crossProduct(a: RealVector, b: RealVector): RealVector;
    dot(a: RealVector, b: RealVector): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector
}
  
// Concrete strategies

export class RealVectorSpace1DStrategy implements RealVectorSpaceStrategy {
    // Implementation for 1D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector1D(v1) && isVector1D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector1D(v)) return true;
        return false;
    }
    defaultVect(): RealVector {
        return 0;
    }
    add(a: RealVector, b: RealVector): RealVector {
        if(isVector1D(a) && isVector1D(b)) {
            return a + b;
        } else {
            throw new RangeError();
        }
    }
    scale(scalar: Real, v: RealVector): RealVector {
        if(isVector1D(v)) {
            return scalar * v;
        } else {
            throw new RangeError();
        }
    }
    subtract(a: RealVector, b: RealVector): RealVector {
        if(isVector1D(a) && isVector1D(b)) {
            return a - b;
        } else {
            throw new RangeError();
        }
    }
    clone(v: RealVector): RealVector {
        if(isVector1D(v)) {
            return v;
        } else {
            throw new RangeError();
        }
    }

    norm(v: RealVector): number {
        if(isVector1D(v)) {
            return Math.abs(v);
        } else {
            throw new RangeError();
        }
    }

    normalize(v: RealVector): RealVector {
        if(isVector1D(v)) {
            return v / this.norm(v);
        } else {
            throw new RangeError();
        }
    }

    crossProduct(a: RealVector, b: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        throw new RangeError(error.generateMessageString());
    }

    dot(a: RealVector, b: RealVector): number {
        if(isVector1D(a) && isVector1D(b)) {
            return a * b;
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

}

export class RealVectorSpace2DStrategy implements RealVectorSpaceStrategy {
    // Implementation for 2D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector2D(v1) && isVector2D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector2D(v)) return true;
        return false;
    }

    defaultVect(): RealVector {
        return {type: REALVECTOR2D, coordinates: [0, 0]};
    }

    add(a: RealVector, b: RealVector): RealVector {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector {
        if(isVector2D(a) && isVector2D(b)) {
            return {type: REALVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: RealVector2D): RealVector2D {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: RealVector): RealVector {
        if(isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
        } else {
            throw new RangeError();
        }
    }

    norm(v: RealVector): number {
        if(isVector2D(v)) {
            let result = 0;
            for(const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    normalize(v: RealVector): RealVector {
        if(isVector2D(v)) {
            const norm = this.norm(v);
            return {type: REALVECTOR2D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProduct(a: RealVector, b: RealVector): number {
        if(isVector2D(a) && isVector2D(b)) {
            return (a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]);
        } else {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    dot(a: RealVector, b: RealVector): number {
        if(isVector2D(a) && isVector2D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector2D {
        if(isVector2D(v)) {
            return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0] * weight.weight, v.coordinates[1] * weight.weight, {type: WEIGHT, value: weight}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector {
        if(isVector2D(v)) {
            return {type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
}
  
export class RealVectorSpace3DStrategy implements RealVectorSpaceStrategy {
    // Implementation for 3D vectors

    areSameDimension(v1: RealVector, v2: RealVector): boolean {
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector3D(v)) return true;
        return false;
    }

    defaultVect(): RealVector {
        return {type: REALVECTOR3D, coordinates: [0, 0, 0]};
    }

    add(a: RealVector, b: RealVector): RealVector {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: RealVector): RealVector {
        if(isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: RealVector): RealVector {
        if(isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
        } else {
            throw new RangeError();
        }
    }

    norm(v: RealVector): number {
        if(isVector3D(v)) {
            let result = 0;
            for(const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    normalize(v: RealVector): RealVector {
        if(isVector3D(v)) {
            const norm = this.norm(v);
            return {type: REALVECTOR3D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProduct(a: RealVector, b: RealVector): RealVector {
        if(isVector3D(a) && isVector3D(b)) {
            return {type: REALVECTOR3D, coordinates: [a.coordinates[1] * b.coordinates[2] - a.coordinates[2] * b.coordinates[1], a.coordinates[2] * b.coordinates[0] - a.coordinates[0] * b.coordinates[2], a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]]};
        } else {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    dot(a: RealVector, b: RealVector): number {
        if(isVector3D(a) && isVector3D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight = new Weight()): ProjectiveVector3D {
        if(isVector3D(v)) {
            return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0] * weight.weight, v.coordinates[1] * weight.weight, v.coordinates[2] * weight.weight, {type: WEIGHT, value: weight}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}

export class RealVectorSpace4DStrategy implements RealVectorSpaceStrategy {
    // Implementation for 4D vectors

    areSameDimension(a: RealVector, b: RealVector): boolean {
        if(isVector4D(a) && isVector4D(b)) return true;
        return false;
    }

    isInVectorSpace(v: RealVector): v is RealVector {
        if(isVector4D(v)) return true;
        return false;
    }

    defaultVect(): RealVector {
        return {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
    }

    add(a: RealVector, b: RealVector): RealVector {
        if(isVector4D(a) && isVector4D(b)) {
            return {type: REALVECTOR4D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], a.coordinates[3] + b.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector {
        if(isVector4D(a) && isVector4D(b)) {
            return {type: REALVECTOR4D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], a.coordinates[3] - b.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: RealVector): RealVector {
        if(isVector4D(v)) {
            return {type: REALVECTOR4D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scalar * v.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    clone(v: RealVector): RealVector {
        if(isVector4D(v)) {
            return {type: REALVECTOR4D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], v.coordinates[3]]};
        } else {
            throw new RangeError();
        }
    }

    norm(v: RealVector): number {
        if(isVector4D(v)) {
            let result = 0;
            for(const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    normalize(v: RealVector): RealVector {
        if(isVector4D(v)) {
            const norm = this.norm(v);
            return {type: REALVECTOR4D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm, v.coordinates[3] / norm]};
        } else {
            throw new RangeError();
        }
    }

    crossProduct(a: RealVector, b: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'crossProduct', EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
        throw new RangeError(error.generateMessageString());
    }

    dot(a: RealVector, b: RealVector): number {
        if(isVector4D(a) && isVector4D(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2] + a.coordinates[3] * b.coordinates[3];
        } else {
            throw new RangeError();
        }
    }

    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }

    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
  
}

  // Main class using strategy
export class RealVectorSpace implements VectorSpace<Real, RealVector> {
    protected readonly dim: number;
    protected strategy: RealVectorSpaceStrategy;
    
    constructor(dimension: number) {
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
      
        // Select appropriate strategy based on dimension
        switch(this.dim) {
            case MIN_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace1DStrategy();
                break;
            case 2:
                this.strategy = new RealVectorSpace2DStrategy();
                break;
            case 3:
                this.strategy = new RealVectorSpace3DStrategy();
                break;
            case MAX_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace4DStrategy();
                break;
            default:
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension(): number {
        return this.dim;
    }
    
    // Methods delegate to strategy
    areSameDimension(a: RealVector, b: RealVector): boolean {
      return this.strategy.areSameDimension(a, b);
    }

    isInVectorSpace(v: RealVector): v is RealVector {
      return this.strategy.isInVectorSpace(v);
    }

    defaultVect(): RealVector {
      return this.strategy.defaultVect();
    }
    
    add(a: RealVector, b: RealVector): RealVector {
        try { 
            return this.strategy.add(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'add', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    subtract(a: RealVector, b: RealVector): RealVector {
        try {
            return this.strategy.subtract(a, b);
        } catch (error) {
            if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = sendRangeErrorMessage(this.constructor.name, 'subtract', EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }

    scale(scalar: Real, v: RealVector): RealVector {
        try {
            return this.strategy.scale(scalar, v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'scale', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    clone(v: RealVector): RealVector {
        try{
            return this.strategy.clone(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'clone', EM_REALVECTOR_NOT_IN_VECTORSPACE)
            throw new RangeError(message.generateMessageString());
        }
    }

    norm(v: RealVector): number {
        try {
            return this.strategy.norm(v);
        } catch (error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'norm', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    normalize(v: RealVector): RealVector {
        try {
            return this.strategy.normalize(v);
        } catch(error) {
            const message = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }

    crossProduct(a: RealVector, b: RealVector): RealVector {
            return this.strategy.crossProduct(a, b);
    }

    dot(a: RealVector, b: RealVector): number {
        try {
            return this.strategy.dot(a, b);
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
  }
  