import { expect } from "chai";
import { DEFAULT_KNOT_ABSCISSA_VALUE, EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA, EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY, EM_KNOT_DECREMENT_KNOT_MULTIPLICITY, EM_KNOT_INCREMENT_DECREMENT, EM_KNOT_INDEX_VALUE, Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";

describe('Knots', () => {

    describe('Knot constructor', () => {
        it('cannot be initialized with a multiplicity value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 0;
            expect(() => new Knot(abscissa, multiplicity)).to.throw(EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY)
        });
    
        it('cannot be initialized with an abscissa value equal to the default value', () => {
            const abscissa = DEFAULT_KNOT_ABSCISSA_VALUE;
            const multiplicity = 0;
            expect(() => new Knot(abscissa, multiplicity)).to.throw(EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA)
        });
    
        it('can be initialized with a multiplicity value greater or equal to one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(knot.multiplicity).to.eql(multiplicity);
        });

        it('can be initialized without prescribing a multiplicity value to a multiplicity of one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa);
            expect(knot.multiplicity).to.eql(multiplicity);
        });
    
        it('can be initialized with an abscissa with a value differing from the default one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(knot.abscissa).to.eql(abscissa);
        });

        it('can be initialized without presciption of an abscissa and multiplicity', () => {
            const knot = new Knot();
            expect(knot.abscissa).to.eql(DEFAULT_KNOT_ABSCISSA_VALUE);
            expect(knot.multiplicity).to.eql(1)
        });
    });

    describe('Accessors', () => {
        it('cannot set a knot abscissa value to the default value', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(() => knot.abscissa = DEFAULT_KNOT_ABSCISSA_VALUE).to.throw(EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA)
        });

        it('cannot set a knot multiplicity value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(() => knot.multiplicity = 0).to.throw(EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY)
        });

        it('can set a knot abscissa value to a value distinct from the default value', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(knot.abscissa = 1).to.eql(knot.abscissa)
        });

        it('can set a knot multiplicity value to a value greater or equal to one', () => {
            const abscissa = 0;
            const multiplicity = 2;
            const knot = new Knot(abscissa, multiplicity);
            expect(knot.multiplicity = 1).to.eql(knot.multiplicity)
        });
    });

    describe('Methods', () => {
        it('can increment the knot multiplicity by one as default', () => {
            const abscissa = 1;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            knot.incrementMultiplicity()
            expect(knot.multiplicity).to.eql(2)
        });

        it('can increment the knot multiplicity with a value greater than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            knot.incrementMultiplicity(3)
            expect(knot.multiplicity).to.eql(multiplicity + 3)
        });

        it('cannot increment the knot multiplicity with a value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(() => knot.incrementMultiplicity(0)).to.throw(EM_KNOT_INCREMENT_DECREMENT)
        });

        it('cannot decrement the multiplicity of a knot if its multiplicity becomes smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(() => knot.decrementMultiplicity()).to.throw(EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        });

        it('can decrement the knot multiplicity by one as default', () => {
            const abscissa = 1;
            const multiplicity = 2;
            const knot = new Knot(abscissa, multiplicity);
            knot.decrementMultiplicity()
            expect(knot.multiplicity).to.eql(1)
        });

        it('cannot decrement the knot multiplicity with a value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot(abscissa, multiplicity);
            expect(() => knot.decrementMultiplicity(0)).to.throw(EM_KNOT_INCREMENT_DECREMENT)
        });
    });


});

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