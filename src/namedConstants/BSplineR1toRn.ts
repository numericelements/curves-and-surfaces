import { KNOT_SEQUENCE_ORIGIN } from "./KnotSequences";

export const CURVE_ORIGIN = KNOT_SEQUENCE_ORIGIN;

export const INVALID_VS_DIMENSION = -1;

export enum VectorSpaceType {
    REAL,
    COMPLEX,
    PROJECTIVE,
    PROJECTIVECOMPLEX,
    UNKNOWN_VECTORSPACE
}