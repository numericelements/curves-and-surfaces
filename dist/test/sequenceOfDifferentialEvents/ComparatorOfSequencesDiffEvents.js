"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var SequenceOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var ModifiedDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/ModifiedDifferentialEvents");
var NeighboringEvents_1 = require("../../src/sequenceOfDifferentialEvents/NeighboringEvents");
describe('ComparatorOfSequencesOfDiffEvents', function () {
    describe('locateIntervalAndNumberOfCurvExEventChanges', function () {
        it('throws warning only if the sequences of differential events have the same length and contain one inflection, at least, when trying to locate curvature extrema changes', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.1, 0.75], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.45]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            chai_1.expect(function () { return comparator.checkConsistencyModifiedEvents(); }).not.to.throw();
            chai_1.expect(function () { return comparator.locateIntervalAndNumberOfCurvExEventChanges(); }).not.to.throw();
        });
        it('throws error if the sequences of differential events have not an even number of curvature extrema changes between two successive inflections', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.1, 0.5, 0.75], [0.3, 0.85]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.25, 0.9]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            chai_1.expect(comparator.sequenceDiffEvents1.indicesOfInflections[0]).to.eql(1);
            chai_1.expect(comparator.sequenceDiffEvents1.indicesOfInflections[1]).to.eql(4);
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateIntervalAndNumberOfCurvExEventChanges()).to.throw();
        });
        it('generates the number and interval of curvature events changes when one curvature extremum appears', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            chai_1.expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(0);
            chai_1.expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(1);
        });
        it('generates the number and interval of curvature events changes when one curvature extremum disappears', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            chai_1.expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(0);
            chai_1.expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(-1);
        });
        it('generates the number and interval of curvature events changes when two curvature extrema disappear between inflections', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.25, 0.4, 0.55], [0.1, 0.8]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.45], [0.15, 0.75]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfCurvExEventChanges();
            chai_1.expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedCurvExEvents[0].indexInflection, 'index interval modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedCurvExEvents[0].nbEvents, 'nb curvEx modified: ').to.eql(-2);
        });
    });
    describe('checkConsistencyModifiedEvents', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
        var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
        comparator.modifiedCurvExEvents = [];
        comparator.modifiedCurvExEvents.push(new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(0, 1));
        var sum = 0;
        comparator.modifiedCurvExEvents.forEach(function (element) {
            sum += element.nbEvents;
        });
        chai_1.expect(sum).to.not.eql(0);
        // error is thrown by ErrorLog class
        // expect( () => comparator.checkConsistencySumModifiedEvents()).to.throw();
    });
    describe('checkConsistencyModifiedEvents', function () {
        var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.2, 0.7]);
        var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.2, 0.7]);
        var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
        comparator.modifiedCurvExEvents = [];
        comparator.modifiedCurvExEvents.push(new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(1, 1));
        var invalid = false;
        comparator.modifiedCurvExEvents.forEach(function (element) {
            if (element.indexInflection > 0 && element.indexInflection < comparator.sequenceDiffEvents1.indicesOfInflections.length) {
                if (element.nbEvents % 2 !== 0) {
                    invalid = true;
                }
            }
        });
        chai_1.expect(invalid).to.eql(true);
        // error is thrown by ErrorLog class
        // expect( () => comparator.checkConsistencyModifiedEvents()).to.throw();
    });
    describe('locateIntervalAndNumberOfInflectionEventChanges', function () {
        it('does not throw an error if the sequences of differential events have changes of curvature extrema and inflections', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], [0.25, 0.9]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            chai_1.expect(function () { return comparator.locateIntervalAndNumberOfInflectionEventChanges(); }).not.to.throw();
        });
        it('generates the index of curvature event when two inflections appear', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], [0.45, 0.55]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(2);
        });
        it('generates the index of curvature event when one inflection appears into a unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.15]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });
        it('generates the index of curvature event when one inflection appears into the left extreme interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.4], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.4], [0.15]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });
        it('generates the index of curvature event when one inflection appears into the right extreme interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.4], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.4], [0.85]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(0);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
        });
        it('generates the index of curvature event when two inflections appear into an intermediate interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.1, 0.3, 0.4], [0.2]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3, 0.45], [0.25, 0.35, 0.55]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(3);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(2);
        });
        it('generates the index of curvature events when two inflections appear into the left and the right extreme intervals', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.1, 0.3, 0.4], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.3, 0.45], [0.05, 0.9]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateIntervalAndNumberOfInflectionEventChanges();
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(2);
            chai_1.expect(comparator.modifiedInflectionEvents[0].indexCurvatureEx, 'index curvEx of modification: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[0].nbEvents, 'nb inflections modified: ').to.eql(1);
            chai_1.expect(comparator.modifiedInflectionEvents[1].indexCurvatureEx, 'index curvEx of modification: ').to.eql(3);
            chai_1.expect(comparator.modifiedInflectionEvents[1].nbEvents, 'nb inflections modified: ').to.eql(1);
        });
    });
    describe('locateNeiboringEventsUnderInflectionEventChanges', function () {
        it('does not generate any neighboring event if there is no change of inflections and generate a warning', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            chai_1.expect(comparator.neighboringEvents.length, 'nb neighboringEvents: ').to.eql(0);
        });
        it('throws an error if the number of modified inflections does not match the predefined list', function () {
            var e_1, _a;
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], [0.1, 0.3, 0.9]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.modifiedInflectionEvents = [];
            comparator.modifiedInflectionEvents.push(new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(0, 3));
            var invalid = false;
            try {
                for (var _b = __values(comparator.modifiedInflectionEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var modifiedInflectionEvent = _c.value;
                    if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    }
                    else if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    }
                    else if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    }
                    else if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    }
                    else if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
                    }
                    else if (modifiedInflectionEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                    }
                    else {
                        invalid = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateNeiboringEventsUnderInflectionEventChanges()).to.throw();
            chai_1.expect(invalid).to.eql(true);
        });
        it('can return the neighboring event when an inflection event disappears alone at the left hand side of a unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event disappears alone at the left hand side of a unique interval while there are other curvature events in this interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event disappears alone at the right hand side of a unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.95]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event disappears alone at the right hand side of a unique interval while there are other curvature events in this interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.95]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(2);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event disappears alone at the extreme left hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
            var indexInflection = seqDif2.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event disappears alone at the extreme right hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
            var indexInflection = seqDif2.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(3);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear);
        });
        it('can return the neighboring event when an inflection event appears alone at the left hand side of a unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.05]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear);
        });
        it('can return the neighboring event when an inflection event appears alone at the left hand side of a unique interval while there are other curvature events in this interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.85], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.8], [0.05]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear);
        });
        it('can return the neighboring event when an inflection event appears alone at the extreme left hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.8]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.95], [0.05, 0.85]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear);
        });
        it('can return the neighboring event when an inflection event appears alone at the extreme right hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.9], [0.75]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.85], [0.7, 0.95]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(3);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear);
        });
        it('can return the neighboring event when an inflection event disappears and is adjacent to a unique curvature extremum of the interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3], [0.25, 0.35]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear);
        });
        it('can return the neighboring event when an inflection event disappears and is adjacent to a curvature extremum located at the left hand side of the interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.35, 0.6]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.45], [0.55]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(3);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(3);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear);
        });
        it('can return the neighboring event when an inflection event appears and is adjacent to a curvature extremum located at the right hand side of the interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.55], [0.15]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.3, 0.5], [0.25, 0.45, 0.55]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear);
        });
        it('can return the neighboring event when an inflection event appears and is adjacent to a curvature extremum located in the middle of the interval with three oscillations', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.3, 0.55], [0.15, 0.65]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.3, 0.5], [0.15, 0.25, 0.45, 0.55]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(3);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear);
        });
    });
    describe('locateNeiboringEventsUnderInflectionEventChanges', function () {
        it('does not generate any neighboring event if there is no change of curvature extremum and generate a warning', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], [0.8]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], [0.75]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            chai_1.expect(comparator.neighboringEvents.length, 'nb neighboringEvents: ').to.eql(0);
        });
        it('throws an error if the number of modified curvature extrema does not match the predefined list', function () {
            var e_2, _a;
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5, 0.75], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.modifiedCurvExEvents = [];
            comparator.modifiedCurvExEvents.push(new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(1, 3));
            var invalid = false;
            try {
                for (var _b = __values(comparator.modifiedCurvExEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var modifiedCurvExEvent = _c.value;
                    if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    }
                    else if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    }
                    else if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    }
                    else if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && comparator.sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    }
                    else if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR) {
                    }
                    else if (modifiedCurvExEvent.nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR) {
                    }
                    else {
                        invalid = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            chai_1.expect(invalid).to.eql(true);
            // error is thrown by ErrorLog class
            // expect( () => comparator.locateNeiboringEventsUnderCurvExEventChanges()).to.throw();
        });
        it('can return the neighboring event when a curvature extremum appears alone in the left extreme interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.85], [0.5]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear);
        });
        it('can return the neighboring event when a curvature extremum appears alone in the right extreme interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.30, 0.95], [0.5]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(2);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear);
        });
        it('can return the neighboring event when a curvature extremum disappears in the left extreme interval leaving other curvature events in that interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.4, 0.85], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.35, 0.75], [0.5]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear);
        });
        it('can return the neighboring event when a curvature extremum disappears in the right extreme interval where there is already a curvature event', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.70, 0.95], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.75], [0.5]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(2);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear);
        });
        it('can return the neighboring event when a curvature extremum appears alone at the left hand side of the interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear);
        });
        it('can return the neighboring event when a curvature extremum appears alone at the right hand side of the interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear);
        });
        it('can return the neighboring event when a curvature extremum disappears at the left hand side of the interval and there is already other curvature events', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.51, 0.78], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.75], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear);
        });
        it('can return the neighboring event when a curvature extremum disappears at the right hand side of the interval where there is already a curvature event', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5, 0.95], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear);
        });
        it('can return the neighboring event when two curvature extrema appear together into the unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.55], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear);
        });
        it('can return the neighboring event when two curvature extrema appear together with others into the unique interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.75], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15, 0.45, 0.5, 0.75], []);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(0);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear);
        });
        it('can return the neighboring event when two curvature extrema disappear into the left interval already populated with others', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.17, 0.37, 0.4], [0.65]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.15], [0.6]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear);
        });
        it('can return the neighboring event when two curvature extrema disappear and are alone into the right interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.65, 0.7], [0.35]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([], [0.4]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(1);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear);
        });
        it('can return the neighboring event when two curvature extrema disappear into an intermediate interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45, 0.6, 0.65], [0.3, 0.75]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.45], [0.3, 0.7]);
            var indexInflection = seqDif1.indicesOfInflections;
            chai_1.expect(indexInflection.length, 'nb inflections: ').to.eql(2);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(2);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear);
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
    describe('locateNeiboringEvents', function () {
        it('does not generate any modified event if curvature extrema and inflections are modified simultaneously', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.5], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.5], [0.45, 0.55]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            chai_1.expect(comparator.modifiedInflectionEvents.length, 'nb inflections modified: ').to.eql(0);
            chai_1.expect(comparator.modifiedCurvExEvents.length, 'nb curvEx modified: ').to.eql(0);
        });
        it('behavior when one curvature extremum disappear at the left hand side and is replaced by one inflection at the left hand side when the starting interval is a unique principal interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.95], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.94], [0.05]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear);
        });
        it('behavior when one curvature extremum disappear at the left hand side and is replaced by one inflection at the left hand side when the starting interval is the left hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.2, 0.95], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25, 0.93], [0.05, 0.6]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear);
        });
        it('behavior when one curvature extremum disappear at the right hand side and is replaced by one inflection at the right hand side when the starting interval is a unique principal interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.95], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.04], [0.95]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear);
        });
        it('behavior when one curvature extremum disappear at the right hand side and is replaced by one inflection at the right hand side when the starting interval is the right hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.70, 0.95], [0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.04, 0.75], [0.6, 0.95]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear);
        });
        it('behavior when one inflection disappear at the left hand side and is replaced by one curvature extremum at the left hand side when the starting interval is a unique principal interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.95], [0.05]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.94], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear);
        });
        it('behavior when one inflection disappear at the left hand side and is replaced by one curvature extremum at the left hand side when the starting interval is the left hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.2, 0.95], [0.05, 0.5]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.25, 0.93], [0.6]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear);
        });
        it('behavior when one inflection disappear at the right hand side and is replaced by one curvature extremum at the right hand side when the starting interval is a unique principal interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05], [0.95]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.04, 0.92], []);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear);
        });
        it('behavior when one inflection disappear at the right hand side and is replaced by one curvature extremum at the right hand side when the starting interval is the right hand side interval', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.70], [0.5, 0.95]);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.04, 0.75, 0.95], [0.6]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(1);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear);
        });
        it('behavior when one curvature extremum disappears at the left hand side and one inflection appears at the right hand side', function () {
            var seqDif1 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.05, 0.2], []);
            var seqDif2 = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents([0.25], [0.95]);
            var comparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(seqDif1, seqDif2);
            comparator.locateNeiboringEvents();
            chai_1.expect(comparator.neighboringEvents.length, 'neighboringEvent length: ').to.eql(2);
            chai_1.expect(comparator.neighboringEvents[0].index, 'neighboringEvent.index: ').to.eql(0);
            chai_1.expect(comparator.neighboringEvents[0].type, 'neighboringEvent.type: ').to.eql(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear);
        });
    });
});
