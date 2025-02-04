import { expect } from 'chai';
import { testFunctionForCoveragePurposesOnly_strictlyIncreasingKnotSequenceExtractionInterface } from '../../../src/newBsplines/KnotSequenceAndUtilities/strictlyIncreasingKnotSequenceExtractionInterface';

describe('strictlyIncreasingKnotSequenceExtractionInterface', () => {
    it('validates the structure and content of the interface using a test function', () => {
        const interfaceContent = testFunctionForCoveragePurposesOnly_strictlyIncreasingKnotSequenceExtractionInterface(
            4,
            0,
            5,
            [0, 0.5, 0.6, 0.7, 1],
            [4, 1, 1, 2, 4]
        );

        expect(interfaceContent.maxMultiplicityOrder).to.eql(4);
        expect(interfaceContent.indexLeft).to.eql(0);
        expect(interfaceContent.indexRight).to.eql(5);
        expect(interfaceContent.knots).to.eql([0, 0.5, 0.6, 0.7, 1]);
        expect(interfaceContent.multiplicities).to.eql([4, 1, 1, 2, 4]);
    });
});