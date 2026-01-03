"use strict";
/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVectorSpace = exports.isRegisteredVectorSpace = exports.isRegisteredProjectiveComplexVectorSpace = exports.isRegisteredProjectiveRealVectorSpace = exports.isRegisteredComplexVectorSpace = exports.isRegisteredRealVectorSpace = void 0;
const VectorSpaceIdentifierManager_1 = require("./VectorSpaceIdentifierManager");
const BSplineR1toRn_1 = require("../../namedConstants/BSplineR1toRn");
const VectorSpaceUtilities_1 = require("../VectorSpaceUtilities");
const DefaultSpaceResolvers_1 = require("../../ErrorMessages/DefaultSpaceResolvers");
const VectorSpaceResolvers_1 = require("../../ErrorMessages/VectorSpaceResolvers");
/**
 * Register a real vector space for given dimension if not already registered
 * @internal
 */
function isRegisteredRealVectorSpace(realVS) {
    const registered = !VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance().registerRealVectorSpace(realVS);
    return registered;
}
exports.isRegisteredRealVectorSpace = isRegisteredRealVectorSpace;
/**
 * Register a complex vector space for given dimension if not already registered
 * @internal
 */
function isRegisteredComplexVectorSpace(complexVS) {
    const registered = !VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance().registerComplexVectorSpace(complexVS);
    return registered;
}
exports.isRegisteredComplexVectorSpace = isRegisteredComplexVectorSpace;
/**
 * Register a projective real vector space for given dimension if not already registered
 * @internal
 */
function isRegisteredProjectiveRealVectorSpace(projectiveVS) {
    const registered = !VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance().registerProjectiveRealVectorSpace(projectiveVS);
    return registered;
}
exports.isRegisteredProjectiveRealVectorSpace = isRegisteredProjectiveRealVectorSpace;
/**
 * Register a projective complex vector space for given dimension if not already registered
 * @internal
 */
function isRegisteredProjectiveComplexVectorSpace(projectiveComplexVS) {
    const registered = !VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance().registerProjectiveComplexVectorSpace(projectiveComplexVS);
    return registered;
}
exports.isRegisteredProjectiveComplexVectorSpace = isRegisteredProjectiveComplexVectorSpace;
function isRegisteredVectorSpace(vectorSpace) {
    switch (vectorSpace.spaceType) {
        case BSplineR1toRn_1.VectorSpaceType.REAL:
            return isRegisteredRealVectorSpace(vectorSpace);
        case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
            return isRegisteredComplexVectorSpace(vectorSpace);
        case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
            return isRegisteredProjectiveRealVectorSpace(vectorSpace);
        case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
            return isRegisteredProjectiveComplexVectorSpace(vectorSpace);
        default:
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('getDefaultVectorSpace', 'getDefaultVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
            throw new RangeError(error.generateMessageString());
    }
}
exports.isRegisteredVectorSpace = isRegisteredVectorSpace;
function resolveVectorSpace(vectorSpace) {
    let vsId = "";
    const idManager = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
    if (isRegisteredVectorSpace(vectorSpace)) {
        const message = VectorSpaceResolvers_1.EM_VECTOR_SPACE_ALREADY_REGISTERED + `: type=${vectorSpace.spaceType}, dimension=${vectorSpace.dimension()}`;
        const error = (0, VectorSpaceUtilities_1.sendErrorMessage)('resolveVectorSpace', 'resolveVectorSpace', message);
        throw new Error(error.generateMessageString());
    }
    idManager.registerVectorSpace(vectorSpace);
    vsId = `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + idManager.generateId();
    return vsId;
}
exports.resolveVectorSpace = resolveVectorSpace;
