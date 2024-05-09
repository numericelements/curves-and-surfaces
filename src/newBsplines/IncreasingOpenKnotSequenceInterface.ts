import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";

export interface IncreasingOpenKnotSequenceInterface {

    degree: number;
    distinctAbscissae(): number[];
    multiplicities(): number[];
    length(): number;

    // checkDegreeConsistency(): void;
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;
    getMultiplicityOfKnotAt(abcissa: number): number;
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): boolean;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
}