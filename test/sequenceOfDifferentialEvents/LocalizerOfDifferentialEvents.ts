import { expect } from 'chai';
import { LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval } from "../../src/sequenceOfDifferentialEvents/LocalizerOfDifferentialEvents";
import { SequenceOfDifferentialEvents } from '../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents';

import { NeighboringEventsType } from '../../src/sequenceOfDifferentialEvents/NeighboringEvents';

import { ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL, 
    ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL,
    ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL,
    TWO_CURVEXT_EVENTS_APPEAR,
    TWO_CURVEXT_EVENTS_DISAPPEAR,
    TWO_INFLECTIONS_EVENTS_APPEAR,
    TWO_INFLECTIONS_EVENTS_DISAPPEAR,
    UPPER_BOUND_CURVE_INTERVAL
    } from "../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";

describe('LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval', () => {

    // it('can return the index of the new curvature event when it appears alone in the left extreme interval', () => {
    //     const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.75], [0.5]);
    //     const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
    //     const indexInflection = 0;
    //     const localizer = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection);
    //     const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
    //     expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
    //     const neighboringEvent = localizer.locateDifferentialEvents();
    //     expect(neighboringEvent, 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundary, _index: 0});
    // });

    // it('can return the index of the new curvature event when it appears in the left extreme interval', () => {
    //     const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
    //     const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
    //     const indexInflection = 0;
    //     const localizer = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection);
    //     const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
    //     expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
    //     const neighboringEvent = localizer.locateDifferentialEvents();
    //     expect(neighboringEvent, 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundary, _index: 0});
    // });
});