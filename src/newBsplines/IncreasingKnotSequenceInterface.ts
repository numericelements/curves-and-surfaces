import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";


export interface IncreasingKnotSequenceInterface extends KnotSequenceInterface {

    allAbscissae: number[];
    isKnotMultiplicityNonUniform: boolean;
    uMax: number;

    clone(): IncreasingKnotSequenceInterface;
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): IncreasingKnotSequenceInterface;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): IncreasingKnotSequenceInterface;
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): void;
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    // updateKnotSequenceThroughNormalizedBasisAnalysis(): void;
    // toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;
}