"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorSpaceType = exports.INVALID_VS_DIMENSION = exports.CURVE_ORIGIN = void 0;
const KnotSequences_1 = require("./KnotSequences");
exports.CURVE_ORIGIN = KnotSequences_1.KNOT_SEQUENCE_ORIGIN;
exports.INVALID_VS_DIMENSION = -1;
var VectorSpaceType;
(function (VectorSpaceType) {
    VectorSpaceType["REAL"] = "Real";
    VectorSpaceType["COMPLEX"] = "Complex";
    VectorSpaceType["PROJECTIVE"] = "Projective";
    VectorSpaceType["PROJECTIVECOMPLEX"] = "Projective Complex";
    VectorSpaceType["UNKNOWN_VECTORSPACE"] = "Unknown vector space type";
})(VectorSpaceType = exports.VectorSpaceType || (exports.VectorSpaceType = {}));
