"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var SequenceOfIntervals_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfIntervals");
describe('SequenceOfIntervals', function () {
    it('can be initialized without an initializer', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals();
        chai_1.expect(s.span).to.equal(0.0);
        chai_1.expect(s.sequence.length).to.equal(0);
    });
    it('can be initialized with an initializer', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.5, 0.5]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.sequence).to.eql([0.5, 0.5]);
    });
    it('can generate the index of the smallest interval when located at the left hand side with 1 event modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.1, 0.2, 0.65]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(1)).to.eql(0);
    });
    it('can generate the index of the smallest interval showing that intermediate intervals have no influence with 1 event modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.05, 0.2, 0.65]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(1)).to.eql(0);
    });
    it('can generate the index of the smallest interval when located at the rignt hand side with 1 event modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.65, 0.05, 0.2, 0.1]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(1)).to.eql(3);
    });
    it('can generate the index of the smallest interval when located at the left hand side with 2 events modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.1, 0.2, 0.65]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(2)).to.eql(1);
    });
    it('can generate the index of the smallest interval when located at the right hand side with 2 events modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.2, 0.1, 0.65, 0.05]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(2)).to.eql(1);
    });
    it('can generate the index of the smallest interval when located in between the first or last positions, with 2 events modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.1, 0.05, 0.2, 0.65]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(2)).to.eql(1);
    });
    it('can generate the index of the smallest interval when located in an interval after the first two smallest if these are at the first and last positions, with 2 events modified', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.65, 0.2, 0.1]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(2)).to.eql(2);
    });
    it('cannot return the Initial_Interv_index if the number of events differs from 1 or 2', function () {
        var s = new SequenceOfIntervals_1.SequenceOfIntervals(1.0, [0.05, 0.65, 0.2, 0.1]);
        chai_1.expect(s.span).to.equal(1.0);
        chai_1.expect(s.indexSmallestInterval(0)).to.eql(-1);
    });
});
