"use strict";
/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDefaultVectorSpace = exports.getDefaultVectorSpace = exports.getDefaultProjectiveComplexVectorSpace = exports.getDefaultProjectiveRealVectorSpace = exports.getDefaultComplexVectorSpace = exports.getDefaultRealVectorSpace = void 0;
const DefaultVectorSpaces_1 = require("./DefaultVectorSpaces");
const BSplineR1toRn_1 = require("../../namedConstants/BSplineR1toRn");
const VectorSpaceIdentifierManager_1 = require("../../namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceUtilities_1 = require("../VectorSpaceUtilities");
const DefaultSpaceResolvers_1 = require("../../ErrorMessages/DefaultSpaceResolvers");
/**
 * Get default real vector space for given dimension
 * @internal
 */
function getDefaultRealVectorSpace(dimension) {
    try {
        return DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance().getRealVectorSpace(dimension);
    }
    catch (error) {
        const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultRealVectorSpace', 'getDefaultRealVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}
exports.getDefaultRealVectorSpace = getDefaultRealVectorSpace;
/**
 * Get default complex vector space for given dimension
 * @internal
 */
function getDefaultComplexVectorSpace(dimension) {
    try {
        return DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension);
    }
    catch (error) {
        const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultComplexVectorSpace', 'getDefaultComplexVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}
exports.getDefaultComplexVectorSpace = getDefaultComplexVectorSpace;
/**
 * Get default projective real vector space for given dimension
 * @internal
 */
function getDefaultProjectiveRealVectorSpace(dimension) {
    try {
        return DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(dimension);
    }
    catch (error) {
        const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultProjectiveRealVectorSpace', 'getDefaultProjectiveRealVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}
exports.getDefaultProjectiveRealVectorSpace = getDefaultProjectiveRealVectorSpace;
/**
 * Get default projective complex vector space for given dimension
 * @internal
 */
function getDefaultProjectiveComplexVectorSpace(dimension) {
    try {
        return DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance().getProjectiveComplexVectorSpace(dimension);
    }
    catch (error) {
        const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultProjectiveComplexVectorSpace', 'getDefaultProjectiveComplexVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}
exports.getDefaultProjectiveComplexVectorSpace = getDefaultProjectiveComplexVectorSpace;
function getDefaultVectorSpace(spaceType, dimension) {
    switch (spaceType) {
        case BSplineR1toRn_1.VectorSpaceType.REAL:
            return getDefaultRealVectorSpace(dimension);
        case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
            return getDefaultComplexVectorSpace(dimension);
        case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
            return getDefaultProjectiveRealVectorSpace(dimension);
        case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
            return getDefaultProjectiveComplexVectorSpace(dimension);
        default:
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultVectorSpace', 'getDefaultVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
            throw new RangeError(error.generateMessageString());
    }
}
exports.getDefaultVectorSpace = getDefaultVectorSpace;
function resolveDefaultVectorSpace(vectorSpace) {
    let defltVsId = "";
    const defaultSpaces = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
    if (!defaultSpaces.registerVectorSpace(vectorSpace)) {
        // VS already registered
        const message = DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED + `: type=${vectorSpace.spaceType}, dimension=${vectorSpace.dimension()}`;
        const error = (0, VectorSpaceUtilities_1.sendErrorMessage)('resolveDefaultVectorSpace', 'resolveDefaultVectorSpace', message);
        throw new Error(error.generateMessageString());
    }
    defltVsId = VectorSpaceIdentifierManager_1.DEFAULT + `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + defaultSpaces.generateId();
    return defltVsId;
}
exports.resolveDefaultVectorSpace = resolveDefaultVectorSpace;
