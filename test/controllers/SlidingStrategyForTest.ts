import { expect } from 'chai';
import { SlidingStrategyForTest, DiffEventType,
    NeighboringEvents, NeighboringEventsType } from "../../src/controllers/SlidingStrategyForTest";
import { CurveModel } from "../../src/models/CurveModel";

describe('SlidingStrategy, generateSequenceDifferentialEvents', () => {

    it('generates a sequence of differential events', () => {
        const curvExt = [0.1, 0.3];
        const inflections = [0.5];
        const curve = new CurveModel();
        const slidingStrategy = new SlidingStrategyForTest(curve, true, true);
        let seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
        expect(seq.length, 'sequence length: ').to.eql(3);
        expect(seq, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}, 
            {event: DiffEventType.curvatExtremum, loc: 0.3},
            {event: DiffEventType.inflection, loc: 0.5}]);
    });

    it('finds neighboring events with a curvature extremum appearing into a unique interval', () => {
        const curvExt: Array<number> = [];
        const inflections: Array<number> = [];
        const curve = new CurveModel();
        const slidingStrategy = new SlidingStrategyForTest(curve, true, true);
        const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
        const curvExtOptim: Array<number> = [0.1];
        const inflectionsOptim: Array<number> = [];
        const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
        expect(seq.length, 'sequence length: ').to.eql(0);
        expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}]);
        // thoughs an exception when computing intervals with computeIntervalsBetweenCurvatureExtrema
        //const neighEvent:Array<NeighboringEvents> = slidingStrategy.neighboringDifferentialEvents(seq, seqOptim);
        expect(slidingStrategy.neighboringDifferentialEvents, 'neighEvents : ').to.throw;
    });

    it('finds neighboring events with a curvature extremum appearing into an extreme interval', () => {
        const curvExt: Array<number> = [];
        const inflections: Array<number> = [0.5];
        const curve = new CurveModel();
        const slidingStrategy = new SlidingStrategyForTest(curve, true, true);
        const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
        const curvExtOptim: Array<number> = [0.1];
        const inflectionsOptim: Array<number> = [0.5];
        const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
        expect(seq.length, 'sequence length: ').to.eql(1);
        expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}, 
            {event: DiffEventType.inflection, loc: 0.5}]);
        expect(slidingStrategy.neighboringDifferentialEvents, 'neighboringDifferentialEvents : ').to.throw;
    });

    it('finds neighboring events with two curvature extrema appearing into a unique interval', () => {
        const curvExt: Array<number> = [];
        const inflections: Array<number> = [];
        const curve = new CurveModel();
        const slidingStrategy = new SlidingStrategyForTest(curve, true, true);
        const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
        const curvExtOptim: Array<number> = [0.38, 0.42];
        const inflectionsOptim: Array<number> = [];
        const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
        expect(seq.length, 'sequence length: ').to.eql(0);
        expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.38},
            {event: DiffEventType.curvatExtremum, loc: 0.42}]);
        const neighEvent:Array<NeighboringEvents> = slidingStrategy.neighboringDifferentialEvents(seq, seqOptim);
        expect(neighEvent.length, 'neighEvents : ').to.eql(1);
    });

});