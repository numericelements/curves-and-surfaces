import { expect } from "chai";
import { KnotIndexIncreasingSequence } from "../../src/newBsplines/KnotIndexIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('KnotIndexIncreasingSequence', () => {
    describe('KnotIndexIncreasingSequence constructor', () => {
        it('cannot be initialized with a negative value', () => {
            const index = -1;
            expect(() => new KnotIndexIncreasingSequence(index)).to.throw(EM_KNOT_INDEX_VALUE)
        });

        it('can be initialized with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence(index);
            expect(knotIndex.knotIndex).to.eql(0)
        });
    });

    describe('Accessors', () => {
        it('can update the value of a knot index with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence(index);
            knotIndex.knotIndex = 1;
            expect(knotIndex.knotIndex).to.eql(1)
        });

        it('cannot update the value of a knot index with a negative value', () => {
            const index = 0;
            const knotIndex = new KnotIndexIncreasingSequence(index);
            expect(() => knotIndex.knotIndex = -1).to.throw(EM_KNOT_INDEX_VALUE)
        });
    });
});