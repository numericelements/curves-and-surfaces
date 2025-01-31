import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";
import { StrictlyIncreasingKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";

// export interface IncreasingOpenKnotSequenceInterface extends KnotSequenceInterface {
export interface StrictlyIncreasingOpenKnotSequenceInterface extends StrictlyIncreasingKnotSequenceInterface {

    indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    uMax: number;
    allAbscissae: number[];
    isKnotMultiplicityNonUniform: boolean;

    // checkDegreeConsistency(): void;
    clone(): StrictlyIncreasingOpenKnotSequenceInterface;
    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;
    // toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): StrictlyIncreasingOpenKnotSequenceInterface;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): StrictlyIncreasingOpenKnotSequenceInterface;
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): StrictlyIncreasingOpenKnotSequenceInterface;
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void;
    // extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    
    // raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices: Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number, checkSequenceConsistency: boolean);
    // toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;
}