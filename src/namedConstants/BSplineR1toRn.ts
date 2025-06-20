import { KNOT_SEQUENCE_ORIGIN } from "./KnotSequences";

export const CURVE_ORIGIN = KNOT_SEQUENCE_ORIGIN;

export const INVALID_VS_DIMENSION = -1;

export const REAL = "Real" as const;
export const COMPLEX = "Complex" as const;
export const PROJECTIVE = "Projective" as const;
export const PROJECTIVECOMPLEX = "ProjectiveComplex" as const;
export const UNKNOWN_VECTORSPACE = "Unkown_VectorSpace" as const;

export enum VectorSpaceType {
    REAL,
    COMPLEX,
    PROJECTIVE,
    PROJECTIVECOMPLEX,
    UNKNOWN_VECTORSPACE
}