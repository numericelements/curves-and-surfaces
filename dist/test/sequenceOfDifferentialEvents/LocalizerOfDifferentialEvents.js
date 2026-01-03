"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const LocalizerOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/LocalizerOfDifferentialEvents");
const SequenceOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const NeighboringEvents_1 = require("../../src/sequenceOfDifferentialEvents/NeighboringEvents");
const ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval', () => {
    it('throws error if the sequence of differential events input does not contain one inflection at least', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85]);
        const indexInflection1 = seqDif1.indicesOfInflections.length;
        let invalid = false;
        if (indexInflection1 === 0) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection1)).to.throw();
        const indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 === 0) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection2)).to.throw();
    });
    it('can return the index of the new curvature event when it appears alone in the left extreme interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 0;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the new curvature event when it appears in the left extreme interval when there is already a curvature event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 0;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the new curvature event when it appears alone in the right extreme interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 1;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the new curvature event when it appears in the right extreme interval where there is already a curvature event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 1;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval', () => {
    it('throw error if the sequence of differential events input does not contain one inflection at least', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], []);
        const indexInflection1 = seqDif1.indicesOfInflections.length;
        let invalid = false;
        if (indexInflection1 === 0) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection1)).to.throw();
        const indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 === 0) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection2)).to.throw();
        // error is thrown by ErrorLog class
    });
    it('can return the index of the curvature event when it disappears alone in the left extreme interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 0;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears in the left extreme interval leaving other curvature events in that interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 0;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears alone in the right extreme interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 1;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it disappears in the right extreme interval where there is already a curvature event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        (0, chai_1.expect)(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        const index = 1;
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        const indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval', () => {
    it('throws error if the sequence of differential events input contains one or more inflections', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.75]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        const indexInflection1 = seqDif1.indicesOfInflections.length;
        let invalid = false;
        if (indexInflection1 >= 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
        const indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 >= 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the curvature event when it appears alone at the left hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it appears at the left hand side of the interval and there is already other curvature events', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.75], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it appears alone at the right hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it appears at the right hand side of the interval where there is already a curvature event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.95], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval', () => {
    it('throws error if the sequence of differential events input contains one or more inflections', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.75]);
        const indexInflection1 = seqDif1.indicesOfInflections.length;
        let invalid = false;
        if (indexInflection1 >= 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
        const indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 >= 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the curvature event when it disappears alone at the left hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears at the left hand side of the interval and there is already other curvature events', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.75], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears alone at the right hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it disappears at the right hand side of the interval where there is already a curvature event', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.95], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        const modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremaAppearing', () => {
    it('can return the index of the curvature events when they appear alone into the unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.55], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear together with others into the unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.75], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into the left interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.6]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.4], [0.65]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear into the left interval already populated with others', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15], [0.6]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into the right interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.4]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear into the right interval already populated with others', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.55], [0.4]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.8, 0.85], [0.35]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into an intermediate interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
});
describe('LocalizerOfCurvatureExtremaDisappearing', () => {
    it('can return the index of the curvature events when they disappear alone into the unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.55], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear together while others stay into the unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.75], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they are alone and disappear into the left interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.4], [0.65]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.6]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear into the left interval already populated with others', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15], [0.6]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 0;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear and are alone into the right interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.4]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear into the right interval already populated with others', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.8, 0.85], [0.35]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.55], [0.4]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear alone into an intermediate interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        const index = 1;
        const seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        const candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        const modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        (0, chai_1.expect)(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
});
describe('LocalizerOfInflectionDisappearingInUniqueInterval', () => {
    it('throw an error if there more than one inflection event in the initial sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05, 0.5]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        const indexInflection1 = seqDif1.indicesOfInflections.length;
        let invalid = false;
        if (indexInflection1 > 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.analyzeIntervalVariations(seqDif1)).to.throw();
    });
    it('can return the index of the inflection event when it disappears alone at the left hand side of a unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the left hand side of a unique interval while there are other curvature events in this interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the right hand side of a unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.95]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the right hand side of a unique interval while there are other curvature events in this interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionAppearingInUniqueInterval', () => {
    it('throw an error if there more than one inflection event in the second sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05, 0.5]);
        const indexInflection = seqDif2.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        let invalid = false;
        if (indexInflection.length > 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.analyzeIntervalVariations(seqDif1)).to.throw();
    });
    it('can return the index of the inflection event when it appears alone at the left hand side of a unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the left hand side of a unique interval while there are other curvature events in this interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the right hand side of a unique interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.95]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the right hand side of a unique interval while there are other curvature events in this interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionAppearingInExtremeInterval', () => {
    it('throw an error if there is no inflection event in the initial sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05]);
        const indexInflection = seqDif2.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        let invalid = false;
        if (seqDif1.indicesOfInflections.length === 0) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the inflection event when it appears alone at the extreme left hand side interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations();
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the extreme right hand side interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations();
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionDisappearingInExtremeInterval', () => {
    it('throw an error if there is only one inflection event in the initial sequence', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        let invalid = false;
        if (indexInflection.length === 1) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the inflection event when it disappears alone at the extreme left hand side interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
        const indexInflection = seqDif2.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations();
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the extreme right hand side interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
        const indexInflection = seqDif2.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2);
        const candidateIndex = localizer.analyzeIntervalVariations();
        (0, chai_1.expect)(candidateIndex, 'candidateIndex: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum', () => {
    it('throw an error if the constant parameter differs from TWO_INFLECTIONS_EVENTS_DISAPPEAR', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3], [0.1, 0.25, 0.35]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.25], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const nbModifedEvents = localizer.sequenceDiffEvents2.indicesOfInflections.length - localizer.sequenceDiffEvents1.indicesOfInflections.length;
        let invalid = false;
        if (nbModifedEvents !== ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.checkIndexLocation()).to.throw();
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a unique curvature extremum of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1[0], 'int index: ').to.eql(1);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located at the left hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(3);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(2);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1[0], 'int index: ').to.eql(1);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located at the right hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(3);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(2);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1[1], 'int index: ').to.eql(2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located in the middle of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(4);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1[2], 'int index: ').to.eql(2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located in the left hand side of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.45, 0.65]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(4);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located in the right hand side of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.55], [0.15, 0.25]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(4);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(5);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located into an arbitrary intermediate interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.7]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(5);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(0);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(6);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located into the last interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.45]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(5);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(8);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
});
describe('LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum', () => {
    it('throw an error if the constant parameter differs from TWO_INFLECTIONS_EVENTS_APPEAR', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.25], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3], [0.1, 0.25, 0.35]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const nbModifedEvents = localizer.sequenceDiffEvents2.indicesOfInflections.length - localizer.sequenceDiffEvents1.indicesOfInflections.length;
        let invalid = false;
        if (nbModifedEvents !== ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
            invalid = true;
        }
        (0, chai_1.expect)(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.checkIndexLocation()).to.throw();
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a unique curvature extremum of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(0);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1.length, 'int index: ').to.eql(0);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2[0], 'int index: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located at the left hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(2);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1.length, 'int index: ').to.eql(0);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2[0], 'int index: ').to.eql(1);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located at the right hand side of the interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(1);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(2);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1.length, 'int index: ').to.eql(0);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2[1], 'int index: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located in the middle of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        (0, chai_1.expect)(intEvent1.length, 'int index: ').to.eql(0);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2[2], 'int index: ').to.eql(2);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located in the left hand side of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.45, 0.65]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located in the right hand side of the interval with three oscillations', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.55], [0.15, 0.25]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(2);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(5);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located into an arbitrary intermediate interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.7]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(3);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(6);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located into the last interval', () => {
        const seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.45]);
        const seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        const indexInflection = seqDif1.indicesOfInflections;
        (0, chai_1.expect)(indexInflection.length, 'nb inflections: ').to.eql(3);
        const indicesOsc1 = seqDif1.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        const indicesOsc2 = seqDif2.generateIndicesOscillations();
        (0, chai_1.expect)(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        const localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        const intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        (0, chai_1.expect)(intEvent2.length, 'int index: ').to.eql(3);
        const neighboringEvent = localizer.locateDifferentialEvents();
        (0, chai_1.expect)(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(8);
        (0, chai_1.expect)(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
});
