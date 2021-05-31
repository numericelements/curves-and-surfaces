import { expect } from 'chai';
import { LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval } from "../../src/sequenceOfDifferentialEvents/LocalizerOfDifferentialEvents";
import { SequenceOfDifferentialEvents } from '../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents';

import { NeighboringEventsType } from '../../src/sequenceOfDifferentialEvents/NeighboringEvents';

describe('LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval', () => {

    it('', () => {
        const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.75], [0.5]);
        const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        console.log(JSON.parse(JSON.stringify(seqDif1)));
        const indexInflection = 0;
        const localizer = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection);
        const neighboringEvent = localizer.locateDifferentialEvents();
        expect(neighboringEvent, 'neighboringEvent: ').to.eql({_index: 0, _type: NeighboringEventsType.neighboringCurExtremumLeftBoundary});
    });
});