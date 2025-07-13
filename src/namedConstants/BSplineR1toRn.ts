import { KNOT_SEQUENCE_ORIGIN } from "./KnotSequences";

export const CURVE_ORIGIN = KNOT_SEQUENCE_ORIGIN;

export const INVALID_VS_DIMENSION = -1;

export enum VectorSpaceType {
    REAL = 'Real',
    COMPLEX = 'Complex',
    PROJECTIVE = 'Projective',
    PROJECTIVECOMPLEX = 'Projective Complex',
    UNKNOWN_VECTORSPACE = 'Unknown vector space type'
}