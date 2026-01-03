"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VertexR1_1 = require("../../src/containers/VertexR1");
const ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('VertexR1', () => {
    it('has an index and a value', () => {
        const index = 0;
        const value = 1.0;
        let vertex = new VertexR1_1.VertexR1(index, value);
        (0, chai_1.expect)(vertex.index).to.equal(0);
        (0, chai_1.expect)(vertex.value).to.equal(1.0);
    });
    it('has an index out of range', () => {
        const index = -1;
        const value = 1.0;
        let vertex = new VertexR1_1.VertexR1(index, value);
        (0, chai_1.expect)(vertex.index).to.equal(-1);
        (0, chai_1.expect)(vertex.checkIndex()).to.equal(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE);
    });
});
