"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KnotIndexIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexIncreasingSequence");
const Knots_1 = require("../../src/ErrorMessages/Knots");
describe('KnotIndexIncreasingSequence', () => {
    describe('KnotIndexIncreasingSequence constructor', () => {
        it('cannot be initialized with a negative value', () => {
            const index = -1;
            (0, chai_1.expect)(() => new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index)).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can be initialized with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
            (0, chai_1.expect)(knotIndex.knotIndex).to.eql(0);
        });
    });
    describe('Accessors', () => {
        it('can update the value of a knot index with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
            knotIndex.knotIndex = 1;
            (0, chai_1.expect)(knotIndex.knotIndex).to.eql(1);
        });
        it('cannot update the value of a knot index with a negative value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
            (0, chai_1.expect)(() => knotIndex.knotIndex = -1).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
    });
});
