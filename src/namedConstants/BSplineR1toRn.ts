import { KNOT_SEQUENCE_ORIGIN } from "./KnotSequences";

export const CURVE_ORIGIN = KNOT_SEQUENCE_ORIGIN;

export const REAL = "Real" as const;
export const COMPLEX = "Complex" as const;
export const PROJECTIVE = "Projective" as const;
export const PROJECTIVECOMPLEX = "ProjectiveComplex" as const;

export enum VectorSpaceType {
    REAL,
    COMPLEX,
    PROJECTIVE,
    PROJECTIVECOMPLEX
}