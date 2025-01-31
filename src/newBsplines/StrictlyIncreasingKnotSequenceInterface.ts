import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";

export interface StrictlyIncreasingKnotSequenceInterface extends KnotSequenceInterface {

    allAbscissae: number[];

    // [Symbol.iterator](): StrictlyIncreasingOpenKnotSequenceInterface;
    
    // checkDegreeConsistency(): void;
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;
    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    // toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): StrictlyIncreasingKnotSequenceInterface;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void
    // extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    revertKnotSequence(): StrictlyIncreasingKnotSequenceInterface;
}