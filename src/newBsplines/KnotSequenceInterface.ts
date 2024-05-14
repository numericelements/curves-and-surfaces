import { KnotIndexStrictlyIncreasingSequence } from "./Knot";

export interface KnotSequenceInterface {

    degree: number;
    distinctAbscissae(): number[];
    multiplicities(): number[];
    length(): number;
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number;
}