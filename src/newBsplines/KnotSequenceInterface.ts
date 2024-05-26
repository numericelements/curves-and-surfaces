import { KnotIndexStrictlyIncreasingSequence } from "./Knot";

export interface KnotSequenceInterface {

    degree: number;
    isUniform: boolean;
    distinctAbscissae(): number[];
    multiplicities(): number[];
    length(): number;
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number;
}