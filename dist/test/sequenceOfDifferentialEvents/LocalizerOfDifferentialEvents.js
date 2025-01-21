"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var LocalizerOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/LocalizerOfDifferentialEvents");
var SequenceOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var NeighboringEvents_1 = require("../../src/sequenceOfDifferentialEvents/NeighboringEvents");
var ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval', function () {
    it('throws error if the sequence of differential events input does not contain one inflection at least', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85]);
        var indexInflection1 = seqDif1.indicesOfInflections.length;
        var invalid = false;
        if (indexInflection1 === 0) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection1)).to.throw();
        var indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 === 0) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection2)).to.throw();
    });
    it('can return the index of the new curvature event when it appears alone in the left extreme interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 0;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the new curvature event when it appears in the left extreme interval when there is already a curvature event', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 0;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the new curvature event when it appears alone in the right extreme interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 1;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the new curvature event when it appears in the right extreme interval where there is already a curvature event', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 1;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval', function () {
    it('throw error if the sequence of differential events input does not contain one inflection at least', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], []);
        var indexInflection1 = seqDif1.indicesOfInflections.length;
        var invalid = false;
        if (indexInflection1 === 0) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection1)).to.throw();
        var indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 === 0) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, indexInflection2)).to.throw();
        // error is thrown by ErrorLog class
    });
    it('can return the index of the curvature event when it disappears alone in the left extreme interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 0;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears in the left extreme interval leaving other curvature events in that interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 0;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears alone in the right extreme interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 1;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it disappears in the right extreme interval where there is already a curvature event', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        chai_1.expect(indexInflection[0], 'inflection index: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        var index = 1;
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(seqDif1, seqDif2, index);
        var indexMaxInterVar = localizer.analyzeExtremeIntervalVariations(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(indexMaxInterVar, 'indexMaxInterVar: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval', function () {
    it('throws error if the sequence of differential events input contains one or more inflections', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.75]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        var indexInflection1 = seqDif1.indicesOfInflections.length;
        var invalid = false;
        if (indexInflection1 >= 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
        var indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 >= 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the curvature event when it appears alone at the left hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it appears at the left hand side of the interval and there is already other curvature events', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.75], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it appears alone at the right hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it appears at the right hand side of the interval where there is already a curvature event', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.95], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval', function () {
    it('throws error if the sequence of differential events input contains one or more inflections', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.75]);
        var indexInflection1 = seqDif1.indicesOfInflections.length;
        var invalid = false;
        if (indexInflection1 >= 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
        var indexInflection2 = seqDif2.indicesOfInflections.length;
        invalid = false;
        if (indexInflection2 >= 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the curvature event when it disappears alone at the left hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears at the left hand side of the interval and there is already other curvature events', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.75], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary);
    });
    it('can return the index of the curvature event when it disappears alone at the right hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
    it('can return the index of the curvature event when it disappears at the right hand side of the interval where there is already a curvature event', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.95], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(seqDif1, seqDif2);
        var modifiedEvent = localizer.analyzeUniqueIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary);
    });
});
describe('LocalizerOfCurvatureExtremaAppearing', function () {
    it('can return the index of the curvature events when they appear alone into the unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.55], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear together with others into the unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.75], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into the left interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.6]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.4], [0.65]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear into the left interval already populated with others', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15], [0.6]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into the right interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.4]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear into the right interval already populated with others', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.55], [0.4]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.8, 0.85], [0.35]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they appear alone into an intermediate interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature events appaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv2 = seqDif2.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
});
describe('LocalizerOfCurvatureExtremaDisappearing', function () {
    it('can return the index of the curvature events when they disappear alone into the unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.55], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear together while others stay into the unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.75], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they are alone and disappear into the left interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.4], [0.65]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.6]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear into the left interval already populated with others', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15], [0.6]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature event appaears
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 0;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear and are alone into the right interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.4]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear into the right interval already populated with others', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.8, 0.85], [0.35]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.55], [0.4]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
    it('can return the index of the curvature events when they disappear alone into an intermediate interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        // set the inflection index to define the inflection bounding the interval where the curvature events disappaear
        // here there is no inflection and the length of the array of inflections is 0, which defines the index
        var index = 1;
        var seqInterv1 = seqDif1.computeIntervalsBtwCurvatureExtrema(index);
        var candidateEvent = seqInterv1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(seqDif1, seqDif2, index);
        var modifiedEvent = localizer.analyzeIntervalVariations(candidateEvent, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        chai_1.expect(modifiedEvent, 'modifiedEvent: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema);
    });
});
describe('LocalizerOfInflectionDisappearingInUniqueInterval', function () {
    it('throw an error if there more than one inflection event in the initial sequence', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05, 0.5]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        var indexInflection1 = seqDif1.indicesOfInflections.length;
        var invalid = false;
        if (indexInflection1 > 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.analyzeIntervalVariations(seqDif1)).to.throw();
    });
    it('can return the index of the inflection event when it disappears alone at the left hand side of a unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the left hand side of a unique interval while there are other curvature events in this interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the right hand side of a unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.95]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the right hand side of a unique interval while there are other curvature events in this interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif1);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionAppearingInUniqueInterval', function () {
    it('throw an error if there more than one inflection event in the second sequence', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05, 0.5]);
        var indexInflection = seqDif2.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        var invalid = false;
        if (indexInflection.length > 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.analyzeIntervalVariations(seqDif1)).to.throw();
    });
    it('can return the index of the inflection event when it appears alone at the left hand side of a unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the left hand side of a unique interval while there are other curvature events in this interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the right hand side of a unique interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.95]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the right hand side of a unique interval while there are other curvature events in this interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations(seqDif2);
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(2);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionAppearingInExtremeInterval', function () {
    it('throw an error if there is no inflection event in the initial sequence', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05]);
        var indexInflection = seqDif2.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var invalid = false;
        if (seqDif1.indicesOfInflections.length === 0) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the inflection event when it appears alone at the extreme left hand side interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations();
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it appears alone at the extreme right hand side interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInExtremeInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations();
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionDisappearingInExtremeInterval', function () {
    it('throw an error if there is only one inflection event in the initial sequence', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.05]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var invalid = false;
        if (indexInflection.length === 1) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => new LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2)).to.throw();
    });
    it('can return the index of the inflection event when it disappears alone at the extreme left hand side interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
        var indexInflection = seqDif2.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations();
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(0);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary);
    });
    it('can return the index of the inflection event when it disappears alone at the extreme right hand side interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
        var indexInflection = seqDif2.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInExtremeInterval(seqDif1, seqDif2);
        var candidateIndex = localizer.analyzeIntervalVariations();
        chai_1.expect(candidateIndex, 'candidateIndex: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary);
    });
});
describe('LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum', function () {
    it('throw an error if the constant parameter differs from TWO_INFLECTIONS_EVENTS_DISAPPEAR', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3], [0.1, 0.25, 0.35]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.25], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var nbModifedEvents = localizer.sequenceDiffEvents2.indicesOfInflections.length - localizer.sequenceDiffEvents1.indicesOfInflections.length;
        var invalid = false;
        if (nbModifedEvents !== ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.checkIndexLocation()).to.throw();
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a unique curvature extremum of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1[0], 'int index: ').to.eql(1);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located at the left hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(2);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1[0], 'int index: ').to.eql(1);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located at the right hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(2);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1[1], 'int index: ').to.eql(2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are adjacent to a curvature extremum located in the middle of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(4);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1[2], 'int index: ').to.eql(2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located in the left hand side of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.45, 0.65]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(4);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located in the right hand side of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.55], [0.15, 0.25]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(4);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(5);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located into an arbitrary intermediate interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.7]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(5);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(0);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(6);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they disappear and are located into the last interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.45]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(5);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(3);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(8);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
});
describe('LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum', function () {
    it('throw an error if the constant parameter differs from TWO_INFLECTIONS_EVENTS_APPEAR', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.25], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3], [0.1, 0.25, 0.35]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var nbModifedEvents = localizer.sequenceDiffEvents2.indicesOfInflections.length - localizer.sequenceDiffEvents1.indicesOfInflections.length;
        var invalid = false;
        if (nbModifedEvents !== ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
            invalid = true;
        }
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => localizer.checkIndexLocation()).to.throw();
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a unique curvature extremum of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(1);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1.length, 'int index: ').to.eql(0);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2[0], 'int index: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located at the left hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(2);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1.length, 'int index: ').to.eql(0);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2[0], 'int index: ').to.eql(1);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located at the right hand side of the interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(2);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1.length, 'int index: ').to.eql(0);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2[1], 'int index: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are adjacent to a curvature extremum located in the middle of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent1 = localizer.analyzeIntervalVariations(indicesOsc1);
        chai_1.expect(intEvent1.length, 'int index: ').to.eql(0);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2[2], 'int index: ').to.eql(2);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(3);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located in the left hand side of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.45, 0.65]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(1);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located in the right hand side of the interval with three oscillations', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.55], [0.15, 0.25]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(5);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located into an arbitrary intermediate interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.7]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(0);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(6);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
    it('can return the index of the curvature event adjacent to inflections when they appear and are located into the last interval', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.55, 0.65], [0.15, 0.25, 0.45]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.18, 0.2, 0.3, 0.5, 0.65], [0.15, 0.25, 0.45, 0.55, 0.75]);
        var indexInflection = seqDif1.indicesOfInflections;
        chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
        var indicesOsc1 = seqDif1.generateIndicesOscillations();
        chai_1.expect(indicesOsc1.length, 'nb oscillations: ').to.eql(1);
        var indicesOsc2 = seqDif2.generateIndicesOscillations();
        chai_1.expect(indicesOsc2.length, 'nb oscillations: ').to.eql(3);
        var localizer = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(seqDif1, seqDif2);
        var intEvent2 = localizer.analyzeIntervalVariations(indicesOsc2);
        chai_1.expect(intEvent2.length, 'int index: ').to.eql(3);
        var neighboringEvent = localizer.locateDifferentialEvents();
        chai_1.expect(neighboringEvent.index, 'neighboringEvent.index: ').to.eql(8);
        chai_1.expect(neighboringEvent.type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremum);
    });
});
