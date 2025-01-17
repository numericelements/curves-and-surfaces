import { expect } from "chai";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/KnotIndexStrictlyIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('KnotIndexStrictlyIncreasingSequence', () => {
    describe('KnotIndexStrictlyIncreasingSequence constructor', () => {
        it('cannot be initialized with a negative value', () => {
            const index = -1;
            expect(() => new KnotIndexStrictlyIncreasingSequence(index)).to.throw(EM_KNOT_INDEX_VALUE)
        });

        it('can be initialized with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexStrictlyIncreasingSequence(index);
            expect(knotIndex.knotIndex).to.eql(0)
        });
    });

    describe('Accessors', () => {
        it('can update the value of a knot index with a null or positive value', () => {
            const index = 0;
            const knotIndex = new KnotIndexStrictlyIncreasingSequence(index);
            knotIndex.knotIndex = 1;
            expect(knotIndex.knotIndex).to.eql(1)
        });

        it('cannot update the value of a knot index with a negative value', () => {
            const index = 0;
            const knotIndex = new KnotIndexStrictlyIncreasingSequence(index);
            expect(() => knotIndex.knotIndex = -1).to.throw(EM_KNOT_INDEX_VALUE)
        });
    });
});
