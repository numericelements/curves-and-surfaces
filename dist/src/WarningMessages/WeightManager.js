"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE = exports.WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE = void 0;
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
exports.WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE = `Weights have a value smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} whereas weight management is set to strictly positive weights.`;
exports.WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE = `Weights may have either null values or values smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}, please consider the assignment of a null value as result.`;
