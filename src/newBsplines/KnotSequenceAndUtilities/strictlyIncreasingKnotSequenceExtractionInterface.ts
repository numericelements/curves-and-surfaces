import { increasingKnotSequenceExtractionInterface } from "./increasingKnotSequenceExtractionInterface";

export interface strictlyIncreasingKnotSequenceExtractionInterface extends increasingKnotSequenceExtractionInterface {
    multiplicities: number[];
}

export function testFunctionForCoveragePurposesOnly_strictlyIncreasingKnotSequenceExtractionInterface(
    maxMultiplicityOrder: number,
    indexLeft: number, 
    indexRight: number,
    knots: number[],
    multiplicities: number[]
): strictlyIncreasingKnotSequenceExtractionInterface {
    return {
        maxMultiplicityOrder,
        indexLeft,
        indexRight,
        knots,
        multiplicities
    };
}