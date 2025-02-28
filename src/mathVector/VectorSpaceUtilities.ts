import { COMPLEX, ComplexVector, COMPLEXVECTOR2D, COMPLEXVECTOR3D, RealVector, REALVECTOR2D, RealVector2D, REALVECTOR3D, Scalar, Vector, Vector2D, Vector3D } from "./VectorSpaceConstructorInterface";

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
 * @returns True if vector contains real numbers
 */
export function isVector2D(v: Vector): v is Vector2D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR2D || v.type === COMPLEXVECTOR2D;
}

/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers
 */
export function isVector3D(v: Vector): v is Vector3D {
    if (typeof v === 'number') return false;
    return v.type === REALVECTOR3D || v.type === COMPLEXVECTOR3D;
}


/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers
 */
export function isRealVector(v: Vector): v is RealVector {
    return typeof v === 'number' || (Array.isArray(v) && typeof v[0] === 'number');
}

/**
 * Checks if the vector contains complex numbers
 * @param v Vector to check
 * @returns True if vector contains complex numbers
 */
export function isComplexVector(v: Vector): v is ComplexVector {
    return Array.isArray(v) && (v.length === 2 || Array.isArray(v[0]));
}

// export function isProjectiveVector2D(v: Vector): v is ProjectiveVector2D {
//     return (
//         Array.isArray(v) &&
//         v.length === 3 &&
//         typeof v[0] === 'number' &&
//         typeof v[1] === 'number' &&
//         v[2] instanceof Weight
//     );
// }
