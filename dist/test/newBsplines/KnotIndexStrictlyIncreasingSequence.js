"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
var Knots_1 = require("../../src/ErrorMessages/Knots");
describe('KnotIndexStrictlyIncreasingSequence', function () {
    describe('KnotIndexStrictlyIncreasingSequence constructor', function () {
        it('cannot be initialized with a negative value', function () {
            var index = -1;
            chai_1.expect(function () { return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can be initialized with a null or positive value', function () {
            var index = 0;
            var knotIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(knotIndex.knotIndex).to.eql(0);
        });
    });
    describe('Accessors', function () {
        it('can update the value of a knot index with a null or positive value', function () {
            var index = 0;
            var knotIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
            knotIndex.knotIndex = 1;
            chai_1.expect(knotIndex.knotIndex).to.eql(1);
        });
        it('cannot update the value of a knot index with a negative value', function () {
            var index = 0;
            var knotIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(function () { return knotIndex.knotIndex = -1; }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
    });
});
