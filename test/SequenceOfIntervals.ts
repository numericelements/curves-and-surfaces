import { expect } from 'chai';
import { SequenceOfIntervals } from "../src/sequenceOfDifferentialEvents/SequenceOfIntervals";

describe('SequenceOfIntervals', () => {

    it('can be initialized without an initializer', () => {
        const s = new SequenceOfIntervals();
        expect(s.span).to.equal(0.0);
        expect(s.sequence.length).to.equal(0);
    });

    it('can be initialized with an initializer', () => {
        const s = new SequenceOfIntervals(1.0, [0.5, 0.5]);
        expect(s.span).to.equal(1.0);
        expect(s.sequence).to.equal([0.5, 0.5]);
    })

});