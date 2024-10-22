import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { KnotSequenceInterface } from "./KnotSequenceInterface";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";

export interface IncreasingOpenKnotSequenceInterface extends KnotSequenceInterface{

    allAbscissae: number[];
    // [Symbol.iterator](): Iterator<Knot[], number, number>;

    // checkDegreeConsistency(): void;
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): boolean;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    revertKnotSequence():void;
    
    // toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;
}