export interface increasingKnotSequenceExtractionInterface {
    maxMultiplicityOrder: number;
    indexLeft: number;
    indexRight: number;
    knots: number[];
}


export function testFunctionForCoveragePurposesOnly_increasingKnotSequenceExtractionInterface(
    maxMultiplicityOrder: number,
    indexLeft: number, 
    indexRight: number,
    knots: number[]
): increasingKnotSequenceExtractionInterface {
    return {
        maxMultiplicityOrder,
        indexLeft,
        indexRight,
        knots
    };
}