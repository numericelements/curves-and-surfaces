import { expect } from 'chai';
import { SequenceOfIntervals } from "../../src/sequenceOfDifferentialEvents/SequenceOfIntervals";

describe('SequenceOfIntervals', () => {

    it('can be initialized without an initializer', () => {
        const s = new SequenceOfIntervals();
        expect(s.span).to.equal(0.0);
        expect(s.sequence.length).to.equal(0);
    });

    it('can be initialized with an initializer', () => {
        const s = new SequenceOfIntervals(1.0, [0.5, 0.5]);
        expect(s.span).to.equal(1.0);
        expect(s.sequence).to.eql([0.5, 0.5]);
    })

    it('can generate the index of the smallest interval when located at the left hand side with 1 event modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.05, 0.1, 0.2, 0.65]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(1)).to.eql(0);
    })

    it('can generate the index of the smallest interval showing that intermediate intervals have no influence with 1 event modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.1, 0.05, 0.2, 0.65]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(1)).to.eql(0);
    })

    it('can generate the index of the smallest interval when located at the rignt hand side with 1 event modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.65, 0.05, 0.2, 0.1]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(1)).to.eql(3);
    })

    it('can generate the index of the smallest interval when located at the left hand side with 2 events modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.05, 0.1, 0.2, 0.65]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(2)).to.eql(1);
    })

    it('can generate the index of the smallest interval when located at the right hand side with 2 events modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.2, 0.1, 0.65, 0.05]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(2)).to.eql(1);
    })

    it('can generate the index of the smallest interval when located in between the first or last positions, with 2 events modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.1, 0.05, 0.2, 0.65]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(2)).to.eql(1);
    })

    it('can generate the index of the smallest interval when located in an interval after the first two smallest if these are at the first and last positions, with 2 events modified', () => {
        const s = new SequenceOfIntervals(1.0, [0.05, 0.65, 0.2, 0.1]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(2)).to.eql(2);
    })

    it('can return the Initial_Interv_index if the number of events differs from 1 or 2', () => {
        const s = new SequenceOfIntervals(1.0, [0.05, 0.65, 0.2, 0.1]);
        expect(s.span).to.equal(1.0);
        expect(s.indexSmallestInterval(0)).to.eql(-1);
    })

});