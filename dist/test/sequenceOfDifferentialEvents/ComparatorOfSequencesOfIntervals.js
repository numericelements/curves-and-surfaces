"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const SequenceOfIntervals_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfIntervals");
const ComparatorOfSequencesOfIntervals_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesOfIntervals");
const ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('ComparatorOfSequencesOfIntervals', () => {
    it('can be initialized with an initializer', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.15, 0.10, 0.18, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: -1, _value: 0.0 });
    });
    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        const candidateEventIndex = s2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(candidateEventIndex, 'candidateEventIndex: ').to.eql(0);
        comp.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: -1, _value: 0.0 });
    });
    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned reversed', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        const candidateEventIndex = s2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(candidateEventIndex, 'candidateEventIndex: ').to.eql(0);
        comp.indexIntervalMaximalVariationUnderReverseScan(candidateEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1.index, 'maximalVariation index: ').to.eql(2);
        (0, chai_1.expect)(comp.maxVariationInSeq1.value, 'maximalVariation value: ').is.closeTo(1.333333333333, 1.0e-10);
    });
    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned forward and has one interval initially', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [1.0]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.9]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        const candidateEventIndex = s2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(candidateEventIndex, 'candidateEventIndex: ').to.eql(0);
        comp.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: -1, _value: 0.0 });
    });
    it('return max interval variation when one event is inserted at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.2, 0.27, 0.08]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        const candidateEventIndex = s2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(candidateEventIndex, 'candidateEventIndex: ').to.eql(5);
        let invalid = false;
        if (candidateEventIndex >= comp.sequenceOfIntervals1.sequence.length) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect(() => comp.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL)).to.throw();
        comp.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex - 1, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 3, _value: 1.25 });
    });
    it('return max interval variation when one event is inserted at the left hand side of the interval sequence and the sequence is scanned reversed. The interval index is out of reach', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        const candidateEventIndex = s2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(candidateEventIndex, 'candidateEventIndex: ').to.eql(0);
        comp.indexIntervalMaximalVariationUnderReverseScan(candidateEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1.index, 'maximalVariation index: ').to.eql(2);
        (0, chai_1.expect)(comp.maxVariationInSeq1.value, 'maximalVariation value: ').is.closeTo(1.333333333333, 1.0e-10);
    });
    it('return max interval variation when two events are inserted at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.14, 0.21, 0.2, 0.27, 0.02, 0.06]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 3, _value: 1.25 });
    });
    it('return max interval variation when two events are inserted at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.06, 0.02, 0.1, 0.14, 0.21, 0.2, 0.27]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s1, s2);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 1, _value: 7.5 });
    });
    it('return max interval variation when one event is removed at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(3, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 0, _value: 2.0 });
    });
    it('return max interval variation when one event is removed at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.2, 0.2, 0.27, 0.08]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 3, _value: 1.25 });
    });
    it('return max interval variation when two events are removed at the right hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.14, 0.21, 0.2, 0.27, 0.02, 0.06]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 3, _value: 1.25 });
    });
    it('return max interval variation when two events are removed at the left hand side of the interval sequence and the sequence is scanned forward', () => {
        const s1 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.15, 0.21, 0.25, 0.29]);
        const s2 = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.06, 0.02, 0.1, 0.14, 0.21, 0.2, 0.27]);
        const comp = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(s2, s1);
        comp.indexIntervalMaximalVariationUnderForwardScan(4, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(comp.maxVariationInSeq1, 'maximalVariation: ').to.eql({ _index: 1, _value: 7.5 });
    });
});
