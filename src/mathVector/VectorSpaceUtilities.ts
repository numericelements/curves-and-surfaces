import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { COMPLEX, ComplexVector, COMPLEXVECTOR2D, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, RealVector, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, Scalar, Vector, Vector2D, Vector3D, Vector4D } from "./VectorSpaceConstructorInterface";

// ------------ Type Guards ------------

/**
 * Checks if the vector is one-dimensional
 * @param v Vector to check
 * @returns True if vector is 1D (Real or Complex)
 */
export function isVector1D(v: Vector): v is Scalar {
    return typeof v === 'number' || v.type === COMPLEX};

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 2D (Real or Complex)
 */
export function isVector2D(v: Vector): v is Vector2D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR2D || v.type === COMPLEXVECTOR2D || v.type === PROJECTIVECOMPLEXVECTOR1D;
}

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 3D (Real or Complex)
 */
export function isVector3D(v: Vector): v is Vector3D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR3D || v.type === PROJECTIVEVECTOR2D;
}

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 4D (Real or Complex)
 */
export function isVector4D(v: Vector): v is Vector4D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR4D || v.type === PROJECTIVEVECTOR3D;
}


/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers and belongs to a real vector space
 */
export function isRealVector(v: Vector): v is RealVector {
    return typeof v === 'number' || v.type === REALVECTOR2D || v.type === REALVECTOR3D || v.type === REALVECTOR4D;
}

/**
 * Checks if the vector contains complex numbers
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a complex vector space
 */
export function isComplexVector(v: Vector): v is ComplexVector {
    if (typeof v === 'number') return false;
    return v.type === COMPLEX || v.type === COMPLEXVECTOR2D;
}

/**
 * Checks if the vector contains a weight as last component
 * @param v Vector to check
 * @returns True if vector contains a weight as last component and belongs to a projective vector space
 */
export function isProjectiveVector(v: Vector): v is ProjectiveVector {
    if (typeof v === 'number') return false;
    return v.type === PROJECTIVEVECTOR2D || v.type === PROJECTIVEVECTOR3D;
}

/**
 * Checks if the vector contains complex numbers and complex weights
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a projective complex vector space
 */
export function isProjectiveComplexVector(v: Vector): v is ProjectiveComplexVector {
    if (typeof v === 'number') return false;
    return v.type === PROJECTIVECOMPLEXVECTOR1D;
}

export function sendRangeErrorMessage(constructorName: string, functionName: string, message: string): ErrorLog {
    const error = new ErrorLog(constructorName, functionName);
    error.addMessage(message);
    console.log(error.generateMessageString());
    return error;
}

export function areSameVSpaceAndDimension(v1: Vector, v2: Vector): boolean {
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
    } else if(isProjectiveVector(v1) && isProjectiveVector(v2)) {
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

