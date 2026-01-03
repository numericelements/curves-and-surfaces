"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE = exports.EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE = exports.EM_INVALID_VECTOR_SPACE_DIMENSION = exports.EM_INVALID_VECTOR_SPACE_TYPE = exports.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED = void 0;
// Uniqueness constraint error messages for default vector spaces
exports.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED = "A default vector space is already registered of same type and same dimension. Default vector spaces of a given type and dimension must be unique, cannot register another one";
// Error message for invalid vector space type
exports.EM_INVALID_VECTOR_SPACE_TYPE = "Invalid vector space type. Cannot resolve default vector space.";
// Error message for invalid vector space dimension
exports.EM_INVALID_VECTOR_SPACE_DIMENSION = "Vector space dimension out of range. Cannot resolve default vector space.";
// Error message when vector space id structure cannot be split into four sub-strings
exports.EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE = "The vector space ID structure is invalid. It must be formed of four sub-strings at least, separated by underscores.";
exports.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE = "The vector space ID is invalid. Its string representation must be a number within the range of indices values: [min value, max value].";
