"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVector = exports.complexVector2D = exports.complexVector1D = exports.realVector4D = exports.realVector3D = exports.realVector2D = exports.realVector1D = void 0;
const Vector1DTypeReal_1 = require("./Vector1DTypeReal");
const Vector2DTypeReal_1 = require("./Vector2DTypeReal");
const Vector3DTypeReal_1 = require("./Vector3DTypeReal");
const Vector4DTypeReal_1 = require("./Vector4DTypeReal");
const Vector1DTypeComplex_1 = require("./Vector1DTypeComplex");
const Vector2DTypeComplex_1 = require("./Vector2DTypeComplex");
/**
 * Factory functions for creating vectors with clean API
 */
// Real vectors
function realVector1D(x = 0, vectorSpace) {
    return new Vector1DTypeReal_1.Vector1DTypeReal(x, vectorSpace);
}
exports.realVector1D = realVector1D;
function realVector2D(x = 0, y = 0, vectorSpace) {
    return new Vector2DTypeReal_1.Vector2DTypeReal(x, y, vectorSpace);
}
exports.realVector2D = realVector2D;
function realVector3D(x = 0, y = 0, z = 0, vectorSpace) {
    return new Vector3DTypeReal_1.Vector3DTypeReal(x, y, z, vectorSpace);
}
exports.realVector3D = realVector3D;
function realVector4D(x = 0, y = 0, z = 0, w = 0, vectorSpace) {
    return new Vector4DTypeReal_1.Vector4DTypeReal(x, y, z, w, vectorSpace);
}
exports.realVector4D = realVector4D;
// Complex vectors
function complexVector1D(z, vectorSpace) {
    return new Vector1DTypeComplex_1.Vector1DTypeComplex(z.real, z.imaginary, vectorSpace);
}
exports.complexVector1D = complexVector1D;
function complexVector2D(z1, z2, vectorSpace) {
    return new Vector2DTypeComplex_1.Vector2DTypeComplex(z1.real, z1.imaginary, z2.real, z2.imaginary, vectorSpace);
}
exports.complexVector2D = complexVector2D;
// Generic factory
function createVector(spaceType, dimension, coordinates, vectorSpace) {
    const x = 0;
    const y = 0;
    return new Vector2DTypeReal_1.Vector2DTypeReal(x, y, vectorSpace);
}
exports.createVector = createVector;
