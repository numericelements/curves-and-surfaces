import { KnotIndexStrictlyIncreasingSequence } from "./Knot";

export interface KnotSequenceInterface {

    maxMultiplicityOrder: number;
    isKnotSpacingUniform: boolean;
    distinctAbscissae(): number[];
    multiplicities(): number[];
    length(): number;
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number;
}