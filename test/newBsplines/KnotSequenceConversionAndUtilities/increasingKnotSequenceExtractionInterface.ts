import { expect } from 'chai';
import { testFunctionForCoveragePurposesOnly_increasingKnotSequenceExtractionInterface } from '../../../src/newBsplines/KnotSequenceAndUtilities/increasingKnotSequenceExtractionInterface';

describe('increasingKnotSequenceExtractionInterface', () => {
    it('validates the structure and content of the interface using a test function', () => {
        const interfaceContent = testFunctionForCoveragePurposesOnly_increasingKnotSequenceExtractionInterface(
            4,
            0,
            5,
            [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
        );

        expect(interfaceContent.maxMultiplicityOrder).to.eql(4);
        expect(interfaceContent.indexLeft).to.eql(0);
        expect(interfaceContent.indexRight).to.eql(5);
        expect(interfaceContent.knots).to.eql([0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]);
    });
});