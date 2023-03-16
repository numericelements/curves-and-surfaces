import { expect } from 'chai';
import { SequenceOfDifferentialEvents } from '../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents';
import { ComparatorOfSequencesOfDiffEvents, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL, ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL, ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL, ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL, TWO_CURVEXT_EVENTS_APPEAR, TWO_CURVEXT_EVENTS_DISAPPEAR, TWO_INFLECTIONS_EVENTS_APPEAR, TWO_INFLECTIONS_EVENTS_DISAPPEAR } from '../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents';
import { ModifiedCurvatureEvents, ModifiedInflectionEvents } from '../../src/sequenceOfDifferentialEvents/ModifiedDifferentialEvents';

import { NeighboringEvents, NeighboringEventsType } from '../../src/sequenceOfDifferentialEvents/NeighboringEvents';

describe('ComparatorOfSequencesOfDiffEvents', () => {
    describe('locateIntervalAndNumberOfCurvExEventChanges', () => {
        it('throws warning only if the sequences of differential events have the same length and contain one inflection, at least, when trying to locate curvature extrema changes', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.1, 0.75], [0.5]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.85], [0.45]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            expect( () => comparator.checkConsistencyModifiedEvents()).not.to.throw();
            expect( () => comparator.locateIntervalAndNumberOfCurvExEventChanges()).not.to.throw();
        });

        it('throws error if the sequences of differential events have not an even number of curvature extrema changes between two successive inflections', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.1, 0.5, 0.75], [0.3, 0.85]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.85], [0.25, 0.9]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            expect(comparator.sequenceDiffEvents1.indicesOfInflections[0]).to.eql(1);
            expect(comparator.sequenceDiffEvents1.indicesOfInflections[1]).to.eql(4);
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateIntervalAndNumberOfCurvExEventChanges()).to.throw();
        });

        it('generates the number and interval of curvature events changes when one appears', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05], []);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(0);
            expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(1);
        });

        it('generates the number and interval of curvature events changes when one disappears', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(0);
            expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(-1);
        });

        it('generates the number and interval of curvature events changes when two disappears between inflections', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.25, 0.4, 0.55], [0.1, 0.8]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.45], [0.15, 0.75]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(1);
            expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(-2);
        });
    });

    describe('checkConsistencyModifiedEvents', () => {
        const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
        const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
        const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
        comparator.modifiedCurvExEvents = [];
        comparator.modifiedCurvExEvents.push(new ModifiedCurvatureEvents(0, 1));
        let sum = 0;
        comparator.modifiedCurvExEvents.forEach(element => {
            sum += element.nbEvents;
        });
        expect(sum).to.not.eql(0);
        // error is thrown by ErrorLog class
        // expect( () => comparator.checkConsistencySumModifiedEvents()).to.throw();
    });

    describe('checkConsistencyModifiedEvents', () => {
        const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.3, 0.5], [0.2, 0.7]);
        const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.3], [0.2, 0.7]);
        const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
        comparator.modifiedCurvExEvents = [];
        comparator.modifiedCurvExEvents.push(new ModifiedCurvatureEvents(1, 1));
        let invalid = false;
        comparator.modifiedCurvExEvents.forEach(element => {
            if(element.indexInflection > 0 && element.indexInflection < comparator.sequenceDiffEvents1.indicesOfInflections.length) {
                if(element.nbEvents % 2 !== 0) {
                    invalid = true;
                }
            }
        });
        expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => comparator.checkConsistencyModifiedEvents()).to.throw();
    });

    describe('locateIntervalAndNumberOfInflectionEventChanges', () => {
        it('does not throw an error if the sequences of differential events have changes of curvature extrema and inflections', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5], [0.25, 0.9]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            expect( () => comparator.locateIntervalAndNumberOfInflectionEventChanges()).not.to.throw();
        });

        it('generates the index of curvature event when two inflections appear', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5], [0.45, 0.55]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(2);
        });

        it('generates the index of curvature event when one inflection appears into a unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], [0.15]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });

        it('generates the index of curvature event when one inflection appears into the left extreme interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.4], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.4], [0.15]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });

        it('generates the index of curvature event when one inflection appears into the right extreme interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.4], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.4], [0.85]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });

        it('generates the index of curvature event when two inflections appear into an intermediate interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.1, 0.3, 0.4], [0.2]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.15, 0.3, 0.45], [0.25, 0.35, 0.55]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(3);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(2);
        });

        it('generates the index of curvature events when two inflections appear into the left and the right extreme intervals', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.1, 0.3, 0.4], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.15, 0.3, 0.45], [0.05, 0.9]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(2);
            expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
            expect(comparator.modifiedInflectionEvents[1].indexCurvatureEx, 'index curvEx of modification: ').to.eql(3);
            expect(comparator.modifiedInflectionEvents[1].nbEvents, 'nb inflections modified: ').to.eql(1);
        });

    });

    describe('locateNeiboringEventsUnderInflectionEventChanges', () => {
        it('does not generate any neighboring event if there is no change of inflections and generate a warning', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], []);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            expect(comparator.neighboringEvents.length, 'nb neighboringEvents: ').to.eql(0);
        });

        it('throws an error if the number of modified inflections does not match the predefined list', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], [0.1, 0.3, 0.9]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.modifiedInflectionEvents = [];
            comparator.modifiedInflectionEvents.push(new ModifiedInflectionEvents(0, 3));
            let invalid = false;
            for(let modifiedInflectionEvent of comparator.modifiedInflectionEvents) {
                if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length > 0) {
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length > 0) {
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length === 0) {
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                } else {
                    invalid = true;
                }
            }
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateNeiboringEventsUnderInflectionEventChanges()).to.throw();
            expect(invalid).to.eql(true);
        });

        it('can return the neighboring event when an inflection event disappears alone at the left hand side of a unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], [0.05]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event disappears alone at the left hand side of a unique interval while there are other curvature events in this interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.85], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event disappears alone at the right hand side of a unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], [0.95]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionRightBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event disappears alone at the right hand side of a unique interval while there are other curvature events in this interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.85], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionRightBoundaryDisappear, _index: 2});
        });

        it('can return the neighboring event when an inflection event disappears alone at the extreme left hand side interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
            const indexInflection = seqDif2.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event disappears alone at the extreme right hand side interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
            const indexInflection = seqDif2.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionRightBoundaryDisappear, _index: 3});
        });

        it('can return the neighboring event when an inflection event appears alone at the left hand side of a unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], [0.05]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryAppear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event appears alone at the left hand side of a unique interval while there are other curvature events in this interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.85], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryAppear, _index: 0});
        });

        it('can return the neighboring event when an inflection event appears alone at the extreme left hand side interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionLeftBoundaryAppear, _index: 0});
        });
    
        it('can return the neighboring event when an inflection event appears alone at the extreme right hand side interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionRightBoundaryAppear, _index: 3});
        });

        it('can return the neighboring event when an inflection event disappears and is adjacent to a unique curvature extremum of the interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, _index: 1});
        });
    
        it('can return the neighboring event when an inflection event disappears and is adjacent to a curvature extremum located at the left hand side of the interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(3);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, _index: 3});
        });

        it('can return the neighboring event when an inflection event appears and is adjacent to a curvature extremum located at the right hand side of the interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, _index: 1});
        });
    
        it('can return the neighboring event when an inflection event appears and is adjacent to a curvature extremum located in the middle of the interval with three oscillations', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, _index: 3});
        });

    });

    describe('locateNeiboringEventsUnderInflectionEventChanges', () => {
        it('does not generate any neighboring event if there is no change of curvature extremum and generate a warning', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], [0.8]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], [0.75]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            expect(comparator.neighboringEvents.length, 'nb neighboringEvents: ').to.eql(0);
        });

        it('throws an error if the number of modified curvature extrema does not match the predefined list', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5, 0.75], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.modifiedCurvExEvents = [];
            comparator.modifiedCurvExEvents.push(new ModifiedCurvatureEvents(1, 3));
            let invalid = false;
            for(let modifiedCurvExEvent of comparator.modifiedCurvExEvents) {
                if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length === 0) {
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length > 0) {
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length > 0){
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_APPEAR) {
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR) {
                } else {
                    invalid = true;
                }
            }
            expect(invalid).to.eql(true);
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateNeiboringEventsUnderCurvExEventChanges()).to.throw();
        });

        it('can return the neighboring event when a curvature extremum appears alone in the left extreme interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.75], [0.5]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear, _index: 0});
        });
    
        it('can return the neighboring event when a curvature extremum appears alone in the right extreme interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.25], [0.5]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear, _index: 2});
        });

        it('can return the neighboring event when a curvature extremum disappears in the left extreme interval leaving other curvature events in that interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when a curvature extremum disappears in the right extreme interval where there is already a curvature event', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.75], [0.5]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear, _index: 2});
        });

        it('can return the neighboring event when a curvature extremum appears alone at the left hand side of the interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear, _index: 0});
        });
    
        it('can return the neighboring event when a curvature extremum appears alone at the right hand side of the interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.95], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear, _index: 0});
        });

        it('can return the neighboring event when a curvature extremum disappears at the left hand side of the interval and there is already other curvature events', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.75], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear, _index: 0});
        });
    
        it('can return the neighboring event when a curvature extremum disappears at the right hand side of the interval where there is already a curvature event', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5, 0.95], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear, _index: 1});
        });

        it('can return the neighboring event when two curvature extrema appear together into the unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.55], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurvatureExtrema, _index: 0});
        });
    
        it('can return the neighboring event when two curvature extrema appear together with others into the unique interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.15, 0.75], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurvatureExtrema, _index: 1});
        });

        it('can return the neighboring event when two curvature extrema disappear into the left interval already populated with others', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.15], [0.6]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurvatureExtrema, _index: 1});
        });
    
        it('can return the neighboring event when two curvature extrema disappear and are alone into the right interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([], [0.4]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurvatureExtrema, _index: 1});
        });
    
        it('can return the neighboring event when two curvature extrema disappear into an intermediate interval', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
            const indexInflection = seqDif1.indicesOfInflections;
            expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            expect(comparator.neighboringEvents[0], 'neighboringEvent: ').to.eql({_type: NeighboringEventsType.neighboringCurvatureExtrema, _index: 2});
        });

    });

    // Other tests of this method covering configurations of variations of curvature extrema have 
    // been performed under 
    // locateNeiboringEventsUnderCurvExEventChanges
    // Similarly for inflections, tests have been performed under
    // locateNeiboringEventsUnderInflectionEventChanges
    // Tests are performed regarding the flow of locateNeiboringEventsUnderCurvExEventChanges and
    // locateNeiboringEventsUnderInflectionEventChanges, not all the possible variations of sequences
    // of differential events that have tested in LocalizerOfDifferentialEvents
    describe('locateNeiboringEvents', () => {
        it('does not generate any modified event if curvature extrema and inflections are modified simultaneously', () => {
            const seqDif1: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.2, 0.5], []);
            const seqDif2: SequenceOfDifferentialEvents = new SequenceOfDifferentialEvents([0.5], [0.45, 0.55]);
            const comparator = new ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(0);
            expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(0);
        });
    });
});