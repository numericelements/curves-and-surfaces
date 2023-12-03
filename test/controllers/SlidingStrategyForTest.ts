// import { expect } from 'chai';
// import { SlidingStrategyForTest, DiffEventType,
//     NeighboringEvents, intervalsCurvatureExt, NeighboringEventsType } from "../../src/controllers/SlidingStrategyForTest";
// import { CurveModel } from "../../src/newModels/CurveModel";
// import { CurveShapeSpaceNavigator } from '../../src/curveShapeSpaceNavigation/CurveShapeSpaceNavigator';
// import { ShapeNavigableCurve } from '../../src/shapeNavigableCurve/ShapeNavigableCurve';

// describe('SlidingStrategy, indexIntervalMaximalVariation', () => {

//     it('localizes the maximal interval variation under reverse scan', () => {
//         const s1:intervalsCurvatureExt = {span: 1.0, sequence: [0.1, 0.15, 0.2, 0.25, 0.3]};
//         const s2:intervalsCurvatureExt = {span: 1.0, sequence: [0.05, 0.11, 0.12, 0.15, 0.27, 0.3]};
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         // here: one event appearing = -1, scan direction reverse = 1
//         const maxRatio = slidingStrategy.indexIntervalMaximalVariation(s1, s2, 4, -1, 1);
//         expect(maxRatio.index, 'index: ').to.eql(4);
//         expect(maxRatio.value, 'value: ').to.eql(1);
//     });
// });

// describe('SlidingStrategy, generateSequenceDifferentialEvents', () => {

//     it('generates a sequence of differential events', () => {
//         const curvExt = [0.1, 0.3];
//         const inflections = [0.5];
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         let seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
//         expect(seq.length, 'sequence length: ').to.eql(3);
//         expect(seq, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}, 
//             {event: DiffEventType.curvatExtremum, loc: 0.3},
//             {event: DiffEventType.inflection, loc: 0.5}]);
//     });

//     it('finds neighboring events with a curvature extremum appearing into a unique interval', () => {
//         const curvExt: Array<number> = [];
//         const inflections: Array<number> = [];
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
//         const curvExtOptim: Array<number> = [0.1];
//         const inflectionsOptim: Array<number> = [];
//         const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
//         expect(seq.length, 'sequence length: ').to.eql(0);
//         expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}]);
//         // thoughs an exception when computing intervals with computeIntervalsBetweenCurvatureExtrema
//         //const neighEvent:Array<NeighboringEvents> = slidingStrategy.neighboringDifferentialEvents(seq, seqOptim);
//         expect(slidingStrategy.neighboringDifferentialEvents, 'neighEvents : ').to.throw;
//     });

//     it('finds neighboring events with a curvature extremum appearing into an extreme interval', () => {
//         const curvExt: Array<number> = [];
//         const inflections: Array<number> = [0.5];
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
//         const curvExtOptim: Array<number> = [0.1];
//         const inflectionsOptim: Array<number> = [0.5];
//         const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
//         expect(seq.length, 'sequence length: ').to.eql(1);
//         expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}, 
//             {event: DiffEventType.inflection, loc: 0.5}]);
//         expect(slidingStrategy.neighboringDifferentialEvents, 'neighboringDifferentialEvents : ').to.throw;
//     });

//     it('for testing purposes and comparison with new code', () => {
//         const curvExt: Array<number> = [];
//         const inflections: Array<number> = [0.5];
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
//         const curvExtOptim: Array<number> = [0.1];
//         const inflectionsOptim: Array<number> = [0.5];
//         const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
//         expect(seq.length, 'sequence length: ').to.eql(1);
//         expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.1}, 
//             {event: DiffEventType.inflection, loc: 0.5}]);
//         const neighEvent:Array<NeighboringEvents> = slidingStrategy.neighboringDifferentialEvents(seq, seqOptim);
//         expect(neighEvent.length, 'neighEvents : ').to.eql(1);
//     });

//     it('finds neighboring events with two curvature extrema appearing into a unique interval', () => {
//         const curvExt: Array<number> = [];
//         const inflections: Array<number> = [];
//         const curve = new CurveModel();
//         const shapeNavigableCurve = new ShapeNavigableCurve();
//         const curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(shapeNavigableCurve);
//         const slidingStrategy = new SlidingStrategyForTest(curve, true, true, curveShapeSpaceNavigator);
//         const seq = slidingStrategy.generateSequenceDifferentialEvents(curvExt, inflections);
//         const curvExtOptim: Array<number> = [0.38, 0.42];
//         const inflectionsOptim: Array<number> = [];
//         const seqOptim = slidingStrategy.generateSequenceDifferentialEvents(curvExtOptim, inflectionsOptim);
//         expect(seq.length, 'sequence length: ').to.eql(0);
//         expect(seqOptim, 'sequence : ').to.eql([{event: DiffEventType.curvatExtremum, loc: 0.38},
//             {event: DiffEventType.curvatExtremum, loc: 0.42}]);
//         const neighEvent:Array<NeighboringEvents> = slidingStrategy.neighboringDifferentialEvents(seq, seqOptim);
//         expect(neighEvent.length, 'neighEvents : ').to.eql(1);
//     });

// });