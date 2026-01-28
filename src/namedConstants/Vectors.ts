// Tolerance for comparing the magnitude of vector components
export const LINEAR_TOL_VECTOR = 1e-10;

// Tolerance for comparing the magnitude of vector norms
export const ANGULAR_TOL_VECTOR = 1e-7;

// Error message when the coordinate index of a vector component is out of range
export const EM_VECTOR_COORDINATE_INDEX_OUT_RANGE = 'The coordinate index is incompatible with the vector space dimension';

// Error message when vector is not compatible with norm operator
export const EM_VECTOR_NOT_APPLICABLE_TO_NORM = 'Norm operation not available for this vector space';

// Error message when one vector, at least, has a norm too small
export const EM_VECTOR_NORM_TOO_SMALL = 'At least one vector has a norm too small to determine parallelism';

// Error message when trying to compare vectors from different vector spaces
export const EM_VECTORS_DIFFERENT_VECTOR_SPACES = 'Vectors belong to different vector spaces';

// Error message when vectors don't have the same dimensions
export const EM_VECTORS_DIFFERENT_DIM = 'Vector dimensions differ. Cannot proceed.';

// Error message when vectors don't belong to the same vector space
export const EM_VECTORS_NOT_IN_SAME_VECTORSPACE = `The vectors don't belong to the same vector space. Cannot proceed.`;

export const EM_NORM_TOO_SMALL = 'The vector norm is too small to perform the normalization operation';

export const EM_ISORTHOGONAL_NOT_APPLICABLE = 'The orthogonality property is not applicable to the vector space dimension or vector space type considered';

// Warning message when the norm of a vector is smaller than the tolerance
export const WM_VECTOR_NORM_TOO_SMALL = 'The norm of the vector is smaller than the tolerance';

// Error message when the weight status of a projective vector is incompatible with the weight management assigned to the vector space
export const EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE = 'The weight status of the projective vector is incompatible with the weight management assigned to the vector space';

export const EM_VECTORSPACE_DIMENSION_INCOMPATIBLE = `This method is not implemented for the current vector space dimension.`;

// Error message when trying to create a vector into a user-defined vector space that is not of same type or of same dimension as the desired vector
export const EM_VECTORSPACE_INCOMPATIBLE = 'The vector type and dimension desired are incompatible with the vector space type and/or dimension specified as input.';

// Error message when trying to create a vector with input parameters of different types than those required
export const EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE = 'At least one input parameter type differs from the type required. Cannot proceed.';