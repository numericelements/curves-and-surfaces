// Origin of all knot sequences
export const OPEN_KNOT_SEQUENCE_ORIGIN = 0.0;

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 1e-9;