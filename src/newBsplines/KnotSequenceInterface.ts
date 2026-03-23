import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

export interface KnotSequenceInterface {

    readonly maxMultiplicityOrder: number;
    readonly isKnotSpacingUniform: boolean;
    readonly isKnotMultiplicityUniform: boolean;
    readonly indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    // throwRangeErrorMessage(functionName: string, message: string): void;
    distinctAbscissae(): number[];
    multiplicities(): number[];
    checkMaxMultiplicityOrderConsistency(): void;
    checkUniformityOfKnotSpacing(): void;
    checkUniformityOfKnotMultiplicity(): void;
    checkMaxKnotMultiplicityAtIntermediateKnots(): void;
    checkKnotIncreasingValues(knots: number[]): void;
    checkKnotStrictlyIncreasingValues(knots: number[]): void;
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;
    isKnotlMultiplicityZero(abscissa: number): boolean;
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number;
    revertKnotSequence(): KnotSequenceInterface;
    length(): number;
}