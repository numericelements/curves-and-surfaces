// All knot sequences
// Maximal multiplicity order of a knot sequence
export const EM_MAXMULTIPLICITY_ORDER_SEQUENCE = "Maximal value of knot multiplicity order is too small for this category of knot sequence. Cannot proceed.";

// A normalized knot sequence cannot be generated over an interval covered by the knot abscissa. The number of basis functions that can be defined is not enough to obtained a normalized basis
export const EM_SIZENORMALIZED_BSPLINEBASIS = "Normalized knot sequence cannot be generated. The prescribed basis size is too small to generate a B-Spline basis. Cannot proceed.";

// The maximal multiplicity at a knot is greater than the maximal multiplicity order defined for the knot sequence
export const EM_MAXMULTIPLICITY_ORDER_KNOT = "Knot multiplicity is greater than the maximum multiplicity order set for the knot sequence.";

// The array containing the knot abscissae of the knot sequence has a null length
export const EM_NULL_KNOT_SEQUENCE = "Knot sequence with null length encountered. Cannot proceed.";

// The abscissae of the knots into the knot array do not follow an increasing order 
export const EM_NON_INCREASING_KNOT_VALUES = "Knot sequence is not increasing. Cannot proceed.";

// The abscissae of the knots into the knot sequence do not follow a strictly increasing order
export const EM_NON_STRICTLY_INCREASING_VALUES = "Knot sequence is not strictly increasing. Cannot proceed.";

// The knot index of a knot sequence cannot be negative
export const EM_KNOTINDEX_INC_SEQ_NEGATIVE = "The knot index cannot be negative. The corresponding method is not applied.";

// The knot index of a knot sequence, whether increasing or strictly increasing, cannot be greater than the last knot index of the equence
export const EM_KNOTINDEX_INC_SEQ_TOO_LARGE = "The knot index cannot be greater than the last knot index. The corresponding method is not applied.";

// Decrementing to a multiplicity 0 or removing the knot defining the origin of the sequence is not allowed
export const EM_SEQUENCE_ORIGIN_REMOVAL = "Decrementing knot multiplicity would remove this knot. This knot is the origin of the knot sequence. Cannot remove this knot.";

// A knot cannot be inserted into a knot sequence when its abscissa is greater than the max abscissa of the sequence, ie: uMAX
export const EM_KNOT_INSERTION_OVER_UMAX = "Knot insertion cannot take place over the largest knot abscissa. Please, create a new knot sequence incorporating the new abscissa.";

// A knot cannot be inserted into a knot sequence when its abscissa is lower than the origin of the knot sequence. This may not be consistent
// with the structure of the knot sequence (non uniform, periodic, ...) and/or may not be compatible with the interval where the normalized basis is defined
export const EM_KNOT_INSERTION_UNDER_SEQORIGIN = "Knot insertion cannot take place at abscissa lower than the knot sequence origin. Please, create a new knot sequence incorporating the new abscissa.";

// The knot multiplicity becomes greater than the maximal multiplicity order set for the knot sequence, which is not consistent
export const EM_MAXMULTIPLICITY_ORDER_ATKNOT = "The knot multiplicity becomes greater than the maximal multiplicity of the knot sequence. Perhaps, raise the maximal multiplicity before increasing the knot multiplicity.";

// The knot indices prescribed to define the sequence of knot abscissae to be extracted from a sequence are inconsistent
export const EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE = "Start and/or end indices values are out of range. Cannot perform the extraction.";

// The B-Spline basis is not normalized over the interval specified. Data are inconsistent.
export const EM_NOT_NORMALIZED_BASIS = "The B-Spline basis is not normalized over the knot interval defined. This basis cannot be used for curve modeling.";

// The normalized basis interval is not large enough to have a sufficient number of independent basis functions compared to the maximal multiplicity order defined for the knot sequence
export const EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT = "The normalized basis interval is not large enough to apply curve modeling algorithms.";

// The abscissa value set for a knot sequence processing is outside the valid interval of the knot sequence
export const EM_U_OUTOF_KNOTSEQ_RANGE = "Parameter u is outside the valid knot sequence span.";



// Strictly increasing knot sequences
// The array containing the knot multiplicities of the knot sequence has a null length
export const EM_NULL_MULTIPLICITY_ARRAY = "Knot multiplicity array with null length encountered. Cannot proceed.";

// The arrays containing the knot abscissae and the knot multiplicities of the knot sequence don't have the same length
export const EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL = "Knot sequence with length not equal to the multiplicity array length. Cannot proceed.";

// The knot index of a knot into a strictly increasing knot sequence is out of range
export const EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE = "Knot index value in strictly increasing knot sequence is out of range.";

// The multiplicity order encountered at a knot is either null or negative. The knot sequence is invalid
export const EM_KNOT_MULTIPLICITY_OUT_OF_RANGE = "Some knot multiplicities are negative or null. Cannot proceed.";

// The knot at the origin of a non uniform knot sequence is not 0. The knot sequence is not valid
export const EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE = "Sequence origin is not zero. Non-uniform knot sequence origin must be set to 0.0. Not able to process this knot sequence.";

// Knot sequences whether open for closed curves or periodic that are specified from a range of periodic knots must have the first coinciding with the origin of the knot sequence, i.e. 0.0
// see EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE



// Open knot sequences
// The cumulative knot multiplicity (the sum of the multiplicity order of the first knots up to sequence origin) does not add up to the maximum multiplicity order defined for the knot sequence
// The cumulative multiplicity is either greater than the max multiplicity, meaning that the first knots may not be useful or their multplicity order is improperly set, or smaller than max multiplicity,
// meaning that the number of knots and/or their multiplicity orders before the sequence origin, is not consistent
export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART = "Knot multiplicities at sequence start don't add up correctly to produce a normalized basis starting from some knot. Cannot proceed.";

// The cumulative knot multiplicity does not add up to the maximum multiplicity order defined for the knot sequence at some knot to be able to define uMAX, the upper bound of the knot sequence
// Either some knots are supplementary or some knot multiplicities are inconsistent
export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND = "Knot multiplicities at sequence end don't add up correctly to produce a normalized basis ending from some knot. Cannot proceed.";

// Knot sequences of open curves typically with uniform or non uniform knot sequences where the concept of intermediate knot holds
export const EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT = "Maximal knot multiplicity reached at an intermediate knot. Please, split the curve at these knots to describe elementary B-splines.";

// A knot removal operation can take place at a boundary or outside the interval of definition of the normalized basis but this operation cannot be performed since it modifies the interval of definition of the normalized basis
export const EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS = "The knot multiplicity cannot be modified since it modifies the interval of the normalized basis. Please, change the normalized basis definition.";

// Either the knot index of the knot sequence origin is inconsistent or the abscissa at the knot sequence origin is not OPEN_KNOT_SEQUENCE_ORIGIN
export const EM_KNOT_SEQUENCE_ORIGIN_INCONSISTENT = "Either the knot sequence origin is not zero or the knot defining the origin of the sequence has an abscissa differing from zero. Knot sequence origin must be set to 0.0. Not able to process this knot sequence.";

// The knot multiplicity at the first knot abscissa is inconsistent with the setting of the sequene origin because the cumulative multiplicities of knots up to the origin of the sequence does not equal the max multiplicity of the sequence
export const EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT = "The knot multiplicity at the first knot is inconsistent with the sequence origin. Cannot proceed.";

// The knot multiplicity at the last knot abscissa is inconsistent with the setting of the sequene upper bound because the cumulative multiplicities of knots from the upper bound of the sequence to its end does not equal the max multiplicity of the sequence
export const EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT = "The knot multiplicity at the last knot is inconsistent with the sequence upper bound. Cannot proceed.";

// At the left hand side of the knot sequence, with respect to knot origin, the knots are not periodically distributed compared to the left hand side of the right bound of the normalized basis
// Knot intervals on the left hand side of the origin (closure point) are not consistently set with respect to the distribution of knots in the normalized basis
export const EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT = "Knot intervals are not periodically distributed around the closure point (left hand side). This sequence cannot be processed.";

// At the right hand side of the knot sequence, with respect to knot at the right bound of the normalized basis, the knots are not periodically distributed compared to the right hand side of the knot origin of the knot sequence
// Knot intervals on the right hand side of the origin (closure point) are not consistently set with respect to the distribution of knots in the normalized basis
export const EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT = "Knot intervals are not periodically distributed around the closure point (right hand side). This sequence cannot be processed.";

// An abscissa differs from the abscissae of all the knots of the sequence but it is too close from one of them to able to create a new knot independent of the others
export const EM_ABSCISSA_TOO_CLOSE_TO_KNOT = "Abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.";

// Increasing open knot sequences
// The size of the increasing knot sequence generated is incompatible with the multiplicity orders computed and associated with the strictly increasing knot sequence set up internally
// as reference representation of every knot sequence class
export const EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ = "Increasing knot sequence size incompatible with the multiplicity orders of the strictly increasing sequence. Cannot proceed.";

// The knot index defining the left bound of the normalized basis of the knot sequence is associated with an abscissa differing from OPEN_KNOT_SEQUENCE_ORIGIN, ie: 0.0 
export const EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE = "The abscissa defining the origin of the normalized basis of the knot sequence is not 0.0. The knot sequence is not consistent. Cannot proceed.";

// The knot index specifying the origin of the knot sequence is inconsistent with the abscissa of the origin of the knot sequence
export const EM_ABSCISSA_AND_INDEX_ORIGIN_KNOT_SEQUENCE_INCONSISTENT = "The abscissa of the origin of the knot sequence is inconsistent with the knot index specifying the origin. Cannot proceed.";

// Increasing open knot sequences of closed curves
// The multiplicity orders of the knots at the left and right bounds of the normalized basis are not equal
export const EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER = "Multiplicities at knots bounding the normalized basis differ. Cannot proceed with this sequence.";

// The abscissa specified to search for a coinciding knot is out of the interval where the normalized basis of the knot sequenbce is defined
export const EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE = "Knot abscissa is outside the definition interval of the normalized basis.";

// The conversion of an increasing open knot sequence of a closed curve is possible only if all knots have a multiplicity strictly lower to the maximal multiplicity order defined for the knot sequence
export const EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION = "Some knot of the sequence has a multiplicity order that can describe a C0 discontinuity, which incompatible with a closed curve. The conversion is not possible.";

// Strictly incresing open knot sequences of closed curves
// Intervals around the origin (the closure point) are not correctly distributed
export const EM_INCORRECT_INTERVALS_AT_ORIGIN = "Knot intervals are not spread correctly around the closure point. This sequence cannot be processed.";


// Periodic knot sequences
// The size of the periodic knot sequence is incompatible with the max multiplicity order of the knot sequence set up to generate a normalized basis over the interval defined by the knots
export const EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS = "The knot sequence size and knot multiplicities cannot produce a normalized basis over the interval spanned by the knots. Cannot proceed.";

// Indices set to extract a subset of a knot sequence span an interval larger than twice the period of the sequence
export const EM_INDICES_SPAN_TWICE_PERIOD = "Start and end indices span more than twice the period of the sequence. No extraction is performed.";

// The start index to extract a subset of a knot sequence is greater than the last knot index of the sequence
export const EM_START_INDEX_OUTOF_RANGE = "Start index must be strictly lower than the end one. Cannot perform the extraction.";

// The start index is greater than the end index
export const EM_START_INDEX_GREATER_THAN_END_INDEX = "Start index must be strictly lower than the end one. Cannot perform the extraction.";