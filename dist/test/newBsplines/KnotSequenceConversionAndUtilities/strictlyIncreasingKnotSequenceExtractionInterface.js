"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const strictlyIncreasingKnotSequenceExtractionInterface_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/strictlyIncreasingKnotSequenceExtractionInterface");
describe('strictlyIncreasingKnotSequenceExtractionInterface', () => {
    it('validates the structure and content of the interface using a test function', () => {
        const interfaceContent = (0, strictlyIncreasingKnotSequenceExtractionInterface_1.testFunctionForCoveragePurposesOnly_strictlyIncreasingKnotSequenceExtractionInterface)(4, 0, 5, [0, 0.5, 0.6, 0.7, 1], [4, 1, 1, 2, 4]);
        (0, chai_1.expect)(interfaceContent.maxMultiplicityOrder).to.eql(4);
        (0, chai_1.expect)(interfaceContent.indexLeft).to.eql(0);
        (0, chai_1.expect)(interfaceContent.indexRight).to.eql(5);
        (0, chai_1.expect)(interfaceContent.knots).to.eql([0, 0.5, 0.6, 0.7, 1]);
        (0, chai_1.expect)(interfaceContent.multiplicities).to.eql([4, 1, 1, 2, 4]);
    });
});
