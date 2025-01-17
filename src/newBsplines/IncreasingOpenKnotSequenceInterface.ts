import { IncreasingKnotSequenceInterface } from "./IncreasingKnotSequenceInterface";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";

// export interface IncreasingOpenKnotSequenceInterface extends KnotSequenceInterface {
export interface IncreasingOpenKnotSequenceInterface extends IncreasingKnotSequenceInterface {

    uMax: number;
    allAbscissae: number[];
    isKnotMultiplicityNonUniform: boolean;

    // checkDegreeConsistency(): void;
    clone(): IncreasingOpenKnotSequenceInterface;
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): boolean;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void;
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): void;
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void;
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    
    // toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;
}