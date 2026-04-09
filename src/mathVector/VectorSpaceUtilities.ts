import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, VECTOR_DESCRIPTOR_INFO } from "../namedConstants/VectorTypeTags";
import type { ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVectorDesc, VectorDesc, VectorDesc1D, VectorDesc2D, VectorDesc3D, VectorDesc4D } from "./utilityTypes/VectorDescriptorTypes";

// ------------ Type Guards ------------

/**
 * Checks if the vector is one-dimensional
 * @param v Vector to check
 * @returns True if vector is 1D (Real or Complex)
 */
export function isVector1D(v: VectorDesc): v is VectorDesc1D {
    return typeof v === 'number' || v.type === COMPLEX};

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 2D (Real or Complex)
 */
export function isVector2D(v: VectorDesc): v is VectorDesc2D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR2D || v.type === COMPLEXVECTOR2D || v.type === PROJECTIVECOMPLEXVECTOR1D;
}

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 3D (Real or Complex)
 */
export function isVector3D(v: VectorDesc): v is VectorDesc3D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR3D || v.type === PROJECTIVEREALVECTOR2D;
}

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 4D (Real or Complex)
 */
export function isVector4D(v: VectorDesc): v is VectorDesc4D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR4D || v.type === PROJECTIVEREALVECTOR3D;
}


/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers and belongs to a real vector space
 */
export function isRealVector(v: VectorDesc): v is RealVectorDesc {
    return typeof v === 'number' || v.type === REALVECTOR2D || v.type === REALVECTOR3D || v.type === REALVECTOR4D;
}

/**
 * Checks if the vector contains complex numbers
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a complex vector space
 */
export function isComplexVector(v: VectorDesc): v is ComplexVectorDesc {
    if (typeof v === 'number') return false;
    return v.type === COMPLEX || v.type === COMPLEXVECTOR2D;
}

/**
 * Checks if the vector contains a weight as last component
 * @param v Vector to check
 * @returns True if vector contains a weight as last component and belongs to a projective vector space
 */
export function isProjectiveRealVector(v: VectorDesc): v is ProjectiveRealVectorDesc {
    if (typeof v === 'number') return false;
    return v.type === PROJECTIVEREALVECTOR2D || v.type === PROJECTIVEREALVECTOR3D;
}

/**
 * Checks if the vector contains complex numbers and complex weights
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a projective complex vector space
 */
export function isProjectiveComplexVector(v: VectorDesc): v is ProjectiveComplexVectorDesc {
    if (typeof v === 'number') return false;
    return v.type === PROJECTIVECOMPLEXVECTOR1D;
}

export function sendRangeErrorMessage(constructorName: string, functionName: string, message: string): ErrorLog {
    const error = new ErrorLog(constructorName, functionName);
    error.addMessage(message);
    console.log(error.generateMessageString());
    return error;
}

export function sendErrorMessage(constructorName: string, functionName: string, message: string): ErrorLog {
    const error = sendRangeErrorMessage(constructorName, functionName, message);
    return error;
}

export function areSameVSpaceAndDimension(v1: VectorDesc, v2: VectorDesc): boolean {
    if (isRealVector(v1) && isRealVector(v2)) {
        if((isVector1D(v1) && isVector1D(v2)) ||
            (isVector2D(v1) && isVector2D(v2)) ||
            (isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        } else return false;
    } else if(isComplexVector(v1) && isComplexVector(v2)) {
        if((isVector1D(v1) && isVector1D(v2)) ||
            (isVector2D(v1) && isVector2D(v2))) {
            return true;
        } else return false;
    } else if(isProjectiveRealVector(v1) && isProjectiveRealVector(v2)) {
        if((isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        } else return false;
    } else if(isProjectiveComplexVector(v1) && isProjectiveComplexVector(v2)) {
        if((isVector2D(v1) && isVector2D(v2))) {
            return true;
        } else return false;
    } else return false;
}

export function getVectorSpaceTypeAndDimension(vector: VectorDesc): {type: VectorSpaceType, dimension: number} {
    if(isRealVector(vector)) {
        const type = VectorSpaceType.REAL;
        if(isVector1D(vector)) {
            return {type: type, dimension: 1};
        } else if(isVector2D(vector)) {
            return {type: type, dimension: 2};
        } else if(isVector3D(vector)) {
            return {type: type, dimension: 3};
        } else if(isVector4D(vector)) {
            return {type: type, dimension: 4};
        } else {
            throw new Error("Unsupported vector space dimension");
        }
    } else if(isProjectiveRealVector(vector)) {
        const type = VectorSpaceType.PROJECTIVEREAL;
        if(isVector3D(vector)){
            return {type: type, dimension: 3};
        } else if(isVector4D(vector)) {
            return {type: type, dimension: 4};
        } else {
            throw new Error("Unsupported vector space dimension");
        }
    } else if(isComplexVector(vector)) {
        const type = VectorSpaceType.COMPLEX;
        if(isVector1D(vector)) {
            return {type: type, dimension: 1};
        } else if(isVector2D(vector)) {
            return {type: type, dimension: 2};
        } else {
            throw new Error("Unsupported vector space dimension");
        }
    } else if(isProjectiveComplexVector(vector)) {
        const type = VectorSpaceType.PROJECTIVECOMPLEX;
        if(isVector2D(vector)) {
            return {type: type, dimension: 2};
        } else {
            throw new Error("Unsupported vector space dimension");
        }   
    } else {
        throw new Error("Unsupported vector space");
    }
}

export function getVectorDescriptorInfo(vector: VectorDesc): typeof VECTOR_DESCRIPTOR_INFO[keyof typeof VECTOR_DESCRIPTOR_INFO] {
    if (typeof vector === 'number') {
        return VECTOR_DESCRIPTOR_INFO.RealVector1D;
    }
    if (typeof vector === 'object' && vector !== null && 'type' in vector) {
        const typeKey = Object.keys(VECTOR_DESCRIPTOR_INFO).find(key => 
            VECTOR_DESCRIPTOR_INFO[key as keyof typeof VECTOR_DESCRIPTOR_INFO].typeString === vector.type
        );
        if (typeKey) {
            return VECTOR_DESCRIPTOR_INFO[typeKey as keyof typeof VECTOR_DESCRIPTOR_INFO];
        }
    }
    return VECTOR_DESCRIPTOR_INFO.UndefinedVectorType;
}

