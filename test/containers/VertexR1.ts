import { expect } from 'chai';
import { VertexR1 } from '../../src/containers/VertexR1';
import { RETURN_ERROR_CODE } from '../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents';

describe('VertexR1', () => {

    it('has an index and a value', () => {
        const index = 0;
        const value = 1.0;
        let vertex = new VertexR1(index, value);
        expect(vertex.index).to.equal(0);
        expect(vertex.value).to.equal(1.0);
    });

    it('has an index out of range', () => {
        const index = -1;
        const value = 1.0;
        let vertex = new VertexR1(index, value);
        expect(vertex.index).to.equal(-1);
        expect(vertex.checkIndex()).to.equal(RETURN_ERROR_CODE);
    });
});