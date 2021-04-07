import { expect } from 'chai';
import { SequenceOfIntervals } from "../src/sequenceOfDifferentialEvents/SequenceOfIntervals";
import { MaxIntervalVariation } from "../src/sequenceOfDifferentialEvents/MaxIntervalVariation";
import { ComparatorOfSequencesOfIntervals } from "../src/sequenceOfDifferentialEvents/ComparatorOfSequencesOfIntervals";

describe('ComparatorOfSequencesOfIntervals', () => {

    it('can be initialized with an initializer', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.15, 0.10, 0.18, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index:-1, _value: 0.0});
    });


    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(3, 1);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 0, _value: 2.0});
    });

    it('return max interval variation when one event is inserted at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.2, 0.27, 0.08]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, 1);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 3, _value: 1.25});
    });
    
    it('return max interval variation when two events are inserted at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.14, 0.21, 0.2, 0.27, 0.02, 0.06]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, 2);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 3, _value: 1.25});
    });

    it('return max interval variation when two events are inserted at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.06, 0.02, 0.1, 0.14, 0.21, 0.2, 0.27]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, 2);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 1, _value: 7.5});
    });

    it('return max interval variation when one event is removed at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(3, -1);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 0, _value: 2.0});
    });

    it('return max interval variation when one event is removed at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.2, 0.27, 0.08]);
        const comp = new ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, -1);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 3, _value: 1.25});
    });

    it('return max interval variation when two events are removed at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.14, 0.21, 0.2, 0.27, 0.02, 0.06]);
        const comp = new ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, -2);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 3, _value: 1.25});
    });

    it('return max interval variation when two events are removed at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.06, 0.02, 0.1, 0.14, 0.21, 0.2, 0.27]);
        const comp = new ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, -2);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: 1, _value: 7.5});
    });

    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned reversed. The interval index is out of reach', () => {
        const s1:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2:SequenceOfIntervals = new SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderReverseScan(3, 1);
        expect(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({_index: -1, _value: 0.0});
    });
});
