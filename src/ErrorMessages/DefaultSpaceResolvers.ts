// Uniqueness constraint error messages for default vector spaces
export const EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED = "A default vector space is already registered of same type and same dimension. Default vector spaces of a given type and dimension must be unique, cannot register another one";

// Error message for invalid vector space type
export const EM_INVALID_VECTOR_SPACE_TYPE = "Invalid vector space type. Cannot resolve default vector space.";

// Error message for invalid vector space dimension
export const EM_INVALID_VECTOR_SPACE_DIMENSION = "Vector space dimension out of range. Cannot resolve default vector space.";

// Error message when vector space id structure cannot be split into four sub-strings
export const EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE = "The vector space ID structure is invalid. It must be formed of four sub-strings at least, separated by underscores.";

export const EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE = "The vector space ID is invalid. Its string representation must be a number within the range of indices values: [min value, max value].";
