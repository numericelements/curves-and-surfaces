"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVectorTypeInfo = exports.getVectorSpaceTypeAndDimension = exports.areSameVSpaceAndDimension = exports.sendErrorMessage = exports.sendRangeErrorMessage = exports.isProjectiveComplexVector = exports.isProjectiveVector = exports.isComplexVector = exports.isRealVector = exports.isVector4D = exports.isVector3D = exports.isVector2D = exports.isVector1D = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const VectorSpaceConstructorInterface_1 = require("./VectorSpaceConstructorInterface");
// ------------ Type Guards ------------
/**
 * Checks if the vector is one-dimensional
 * @param v Vector to check
 * @returns True if vector is 1D (Real or Complex)
 */
function isVector1D(v) {
    return typeof v === 'number' || v.type === ComplexTypeTag_1.COMPLEX;
}
exports.isVector1D = isVector1D;
;
/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 2D (Real or Complex)
 */
function isVector2D(v) {
    if (typeof v === 'number')
        return false;
    return v.type === VectorTypeTags_1.REALVECTOR2D || v.type === VectorTypeTags_1.COMPLEXVECTOR2D || v.type === VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D;
}
exports.isVector2D = isVector2D;
/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 3D (Real or Complex)
 */
function isVector3D(v) {
    if (typeof v === 'number')
        return false;
    return v.type === VectorTypeTags_1.REALVECTOR3D || v.type === VectorTypeTags_1.PROJECTIVEVECTOR2D;
}
exports.isVector3D = isVector3D;
/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector is 4D (Real or Complex)
 */
function isVector4D(v) {
    if (typeof v === 'number')
        return false;
    return v.type === VectorTypeTags_1.REALVECTOR4D || v.type === VectorTypeTags_1.PROJECTIVEVECTOR3D;
}
exports.isVector4D = isVector4D;
/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers and belongs to a real vector space
 */
function isRealVector(v) {
    return typeof v === 'number' || v.type === VectorTypeTags_1.REALVECTOR2D || v.type === VectorTypeTags_1.REALVECTOR3D || v.type === VectorTypeTags_1.REALVECTOR4D;
}
exports.isRealVector = isRealVector;
/**
 * Checks if the vector contains complex numbers
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a complex vector space
 */
function isComplexVector(v) {
    if (typeof v === 'number')
        return false;
    return v.type === ComplexTypeTag_1.COMPLEX || v.type === VectorTypeTags_1.COMPLEXVECTOR2D;
}
exports.isComplexVector = isComplexVector;
/**
 * Checks if the vector contains a weight as last component
 * @param v Vector to check
 * @returns True if vector contains a weight as last component and belongs to a projective vector space
 */
function isProjectiveVector(v) {
    if (typeof v === 'number')
        return false;
    return v.type === VectorTypeTags_1.PROJECTIVEVECTOR2D || v.type === VectorTypeTags_1.PROJECTIVEVECTOR3D;
}
exports.isProjectiveVector = isProjectiveVector;
/**
 * Checks if the vector contains complex numbers and complex weights
 * @param v Vector to check
 * @returns True if vector contains complex numbers and belongs to a projective complex vector space
 */
function isProjectiveComplexVector(v) {
    if (typeof v === 'number')
        return false;
    return v.type === VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D;
}
exports.isProjectiveComplexVector = isProjectiveComplexVector;
function sendRangeErrorMessage(constructorName, functionName, message) {
    const error = new ErrorLoging_1.ErrorLog(constructorName, functionName);
    error.addMessage(message);
    console.log(error.generateMessageString());
    return error;
}
exports.sendRangeErrorMessage = sendRangeErrorMessage;
function sendErrorMessage(constructorName, functionName, message) {
    const error = sendRangeErrorMessage(constructorName, functionName, message);
    return error;
}
exports.sendErrorMessage = sendErrorMessage;
function areSameVSpaceAndDimension(v1, v2) {
    if (isRealVector(v1) && isRealVector(v2)) {
        if ((isVector1D(v1) && isVector1D(v2)) ||
            (isVector2D(v1) && isVector2D(v2)) ||
            (isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        }
        else
            return false;
    }
    else if (isComplexVector(v1) && isComplexVector(v2)) {
        if ((isVector1D(v1) && isVector1D(v2)) ||
            (isVector2D(v1) && isVector2D(v2))) {
            return true;
        }
        else
            return false;
    }
    else if (isProjectiveVector(v1) && isProjectiveVector(v2)) {
        if ((isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        }
        else
            return false;
    }
    else if (isProjectiveComplexVector(v1) && isProjectiveComplexVector(v2)) {
        if ((isVector2D(v1) && isVector2D(v2))) {
            return true;
        }
        else
            return false;
    }
    else
        return false;
}
exports.areSameVSpaceAndDimension = areSameVSpaceAndDimension;
function getVectorSpaceTypeAndDimension(vector) {
    if (isRealVector(vector)) {
        const type = BSplineR1toRn_1.VectorSpaceType.REAL;
        if (isVector1D(vector)) {
            return { type: type, dimension: 1 };
        }
        else if (isVector2D(vector)) {
            return { type: type, dimension: 2 };
        }
        else if (isVector3D(vector)) {
            return { type: type, dimension: 3 };
        }
        else if (isVector4D(vector)) {
            return { type: type, dimension: 4 };
        }
        else {
            throw new Error("Unsupported vector space dimension");
        }
    }
    else if (isProjectiveVector(vector)) {
        const type = BSplineR1toRn_1.VectorSpaceType.PROJECTIVE;
        if (isVector3D(vector)) {
            return { type: type, dimension: 3 };
        }
        else if (isVector4D(vector)) {
            return { type: type, dimension: 4 };
        }
        else {
            throw new Error("Unsupported vector space dimension");
        }
    }
    else if (isComplexVector(vector)) {
        const type = BSplineR1toRn_1.VectorSpaceType.COMPLEX;
        if (isVector1D(vector)) {
            return { type: type, dimension: 1 };
        }
        else if (isVector2D(vector)) {
            return { type: type, dimension: 2 };
        }
        else {
            throw new Error("Unsupported vector space dimension");
        }
    }
    else if (isProjectiveComplexVector(vector)) {
        const type = BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX;
        if (isVector2D(vector)) {
            return { type: type, dimension: 2 };
        }
        else {
            throw new Error("Unsupported vector space dimension");
        }
    }
    else {
        throw new Error("Unsupported vector space");
    }
}
exports.getVectorSpaceTypeAndDimension = getVectorSpaceTypeAndDimension;
function getVectorTypeInfo(vector) {
    if (typeof vector === 'number') {
        return VectorSpaceConstructorInterface_1.VECTOR_TYPE_INFO.RealVector1D;
    }
    if (typeof vector === 'object' && vector !== null && 'type' in vector) {
        const typeKey = Object.keys(VectorSpaceConstructorInterface_1.VECTOR_TYPE_INFO).find(key => VectorSpaceConstructorInterface_1.VECTOR_TYPE_INFO[key].typeString === vector.type);
        if (typeKey) {
            return VectorSpaceConstructorInterface_1.VECTOR_TYPE_INFO[typeKey];
        }
    }
    return VectorSpaceConstructorInterface_1.VECTOR_TYPE_INFO.UndefinedVectorType;
}
exports.getVectorTypeInfo = getVectorTypeInfo;
