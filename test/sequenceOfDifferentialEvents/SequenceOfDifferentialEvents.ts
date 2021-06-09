import { expect } from 'chai';
import { DifferentialEvent } from '../../src/sequenceOfDifferentialEvents/DifferentialEvent';
import { SequenceOfDifferentialEvents } from '../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents';

describe('SequenceOfDifferentialEvents', () => {

    it('can return the lengthes of indices of inflections and the sequence length when there is no event in the sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents();
        const seqLength = seqDif1.length();
        expect(seqDif1.indicesOfInflections.length, 'indicesOfInflections length: ').to.eql(0);
        expect(seqDif1.sequence.length, 'sequence length: ').to.eql(0);
        expect(seqLength, 'sequence length: ').to.eql(0);
    });

    it('can return the lengthes of indices of inflections and the sequence length when there is no inlection in the sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.1, 0.5,0.85]);
        const seqLength = seqDif1.length();
        expect(seqDif1.indicesOfInflections.length, 'indicesOfInflections length: ').to.eql(0);
        expect(seqDif1.sequence.length, 'sequence length: ').to.eql(4);
        expect(seqLength, 'sequence length: ').to.eql(4);
    });

    it('can return the array of indices of inflections in the sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.75], [0.5]);
        expect(seqDif1.indicesOfInflections, 'indicesOfInflections: ').to.eql([0]);
    });

    it('can return the length of array of indices of inflections in the sequence when there no inflection', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.75]);
        expect(seqDif1.indicesOfInflections.length, 'indicesOfInflections length: ').to.eql(0);
    });

    it('can return the length of array of indices of inflections in the sequence when there no curvature extremum', () => {
        const seqDif1 = new SequenceOfDifferentialEvents(undefined, [0.75]);
        expect(seqDif1.indicesOfInflections.length, 'indicesOfInflections length: ').to.eql(1);
        expect(seqDif1.indicesOfInflections, 'indicesOfInflections: ').to.eql([0]);
    });

    it('can return the first event in the sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        expect(seqDif1.eventAt(0).location, 'event location: ').to.eql(0.05);
        expect(seqDif1.eventAt(0).order, 'event order: ').to.eql(1);
    });

    it('can return the last event in the sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        expect(seqDif1.eventAt(seqDif1.length() - 1).location, 'event location: ').to.eql(0.95);
        expect(seqDif1.eventAt(seqDif1.length() - 1).order, 'event order: ').to.eql(0);
    });

    it('cannot return the event in the sequence because the index is out of range', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        expect(seqDif1.eventAt(seqDif1.length()), 'event: ').to.eql(undefined);
    });

    it('can return the intervals when there is no event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([], []);
        const inflection = 0;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.eql(1.0);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence, 'sequence of intervals: ').to.eql([1.0]);
    });

        // The inflection unsed here is the index of the inflection event in the sequence of inflections
        // If interval designated is the last one, the index is set to the length of the sequence of inflections

    it('can return the intervals when there is no inflection', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.4, 0.8], []);
        const inflection = 0;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.eql(1.0);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.4, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[1], 'sequence of intervals: ').to.be.closeTo(0.4, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[2], 'sequence of intervals: ').to.be.closeTo(0.2, 1.0e-10);
    });

    it('can return the intervals in the first interval when there is one inflection and no curvature extremum', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([], [0.4]);
        const inflection = 0;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.eql(0.4);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.4, 1.0e-10);
    });

    it('can return the intervals in the last interval when there is one inflection and no curvature extremum', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([], [0.4]);
        const inflection = 1;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.eql(0.6);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.6, 1.0e-10);
    });

    it('can return the intervals between curvature extrema before the first inflection', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        const inflection = 0;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.eql(0.5);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence, 'sequence of intervals: ').to.eql([0.05, 0.45]);
    });

    it('can return the intervals between curvature extrema between inflections', () => {
        const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        const inflection = 1;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.be.closeTo(0.45, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.25, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[1], 'sequence of intervals: ').to.be.closeTo(0.1, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[2], 'sequence of intervals: ').to.be.closeTo(0.1, 1.0e-10);
    });

    it('can return the intervals between curvature extrema after the last inflection', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85, 0.98], [0.5, 0.95]);
        const inflection = 2;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.be.closeTo(0.05, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.03, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[1], 'sequence of intervals: ').to.be.closeTo(0.02, 1.0e-10);
    });

    it('can return the intervals between curvature extrema when there is no inflection', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85, 0.98]);
        const inflection = 0;
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).span, 'interval span: ').to.be.closeTo(1.0, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[0], 'sequence of intervals: ').to.be.closeTo(0.05, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[1], 'sequence of intervals: ').to.be.closeTo(0.7, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[2], 'sequence of intervals: ').to.be.closeTo(0.1, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[3], 'sequence of intervals: ').to.be.closeTo(0.13, 1.0e-10);
        expect(seqDif1.computeIntervalsBtwCurvatureExtrema(inflection).sequence[4], 'sequence of intervals: ').to.be.closeTo(0.02, 1.0e-10);
    });

    it('returns an error when the curvatue extrema value is not strictly increasing', () => {
        const seqDif1 = new SequenceOfDifferentialEvents([0.05, 0.75, 0.85], [0.5, 0.95]);
        const event = new DifferentialEvent(1, 0.7);
        expect(() => seqDif1.insertAt(event, 3)).to.throw();
    });

});