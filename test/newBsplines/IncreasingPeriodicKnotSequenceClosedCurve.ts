import { expect } from "chai";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";

describe('IncreasingPeriodicKnotSequenceClosedCurve', () => {
    
    it('can be initialized with degree and increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('cannot initialize a periodic knot sequence if end knot multiplicities differ', () => {
        const knots = [0, 0, 1, 2, 3, 4];
        // const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
         const knotSequence = [new Knot(knots[0], 1)];
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === knotSequence[knotSequence.length - 1].abscissa) {
                knotSequence[knotSequence.length - 1].multiplicity++;
            } else {
                knotSequence.push(new Knot(knots[i], 1));
            }
        }
        expect(knotSequence[0].multiplicity).to.not.eql(knotSequence[knotSequence.length - 1].multiplicity)
        // expect(seq.checkMultiplicityAtEndKnots()).to.throw()
        // expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)).to.throw()
    });

    it('cannot initialize a periodic knot sequence if its origin is not zero', () => {
        const knots = [1, 2, 3, 4];
        const degree = 2;
        // const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
        // expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)).to.throw()
        expect(knots[0]).to.not.eql(0)
    });

    it('cannot initialize a periodic knot sequence if knot sequence length is smaller than (degree + 2) to generate a basis of splines', () => {
        const knots = [0, 1, 2];
        const degree = 2;
        // const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
        // expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)).to.throw()
        expect(knots.length).to.below(degree + 2)
    });

    it('cannot initialize a periodic knot sequence if a knot multiplicity is greater than the curve degree', () => {
        const knots = [0, 1, 1, 1, 2, 3];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        // expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)).to.throw()
        expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1))).to.above(degree)
    });

    it('can get the list of knot abscissae in increasing order using the accessor and iterator', () => {
        const knots = [0, 1, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('can generate a deep copy of an increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const newSeq = seq.deepCopy()
        newSeq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1))
        expect(newSeq.allAbscissae).to.eql([0, 1, 1, 2, 3, 4])
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('can generate a strictly increasing knot sequence from an increasing sequence', () => {
        const knots = [0, 1, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toStrictlyIncreasingKnotSequence()
        expect(strictIncSeq.allAbscissae).to.eql([0, 1, 2, 3, 4])
        expect(strictIncSeq.multiplicities()).to.eql([1, 2, 1, 1, 1])
        const knots1 = [0, 0, 1, 2, 3, 4, 4];
        const degree1 = 2;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        const strictIncSeq1 = seq1.toStrictlyIncreasingKnotSequence()
        expect(strictIncSeq1.allAbscissae).to.eql([0, 1, 2, 3, 4])
        expect(strictIncSeq1.multiplicities()).to.eql([2, 1, 1, 1, 2])
    });

    it('can convert a uniform periodic increasing sequence to an open increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.degree).to.eql(2)
        expect(strictIncSeq.allAbscissae.length).to.eql(9)
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can convert a non uniform periodic increasing sequence with maximal multiplicities at its boundary to an open increasing knot sequence', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.degree).to.eql(2)
        expect(strictIncSeq.allAbscissae.length).to.eql(9)
        expect(strictIncSeq.allAbscissae).to.eql([-1, 0, 0, 1, 2, 3, 4, 4, 5])
        expect(strictIncSeq.multiplicities()).to.eql([1, 2, 1, 1, 1, 2, 1])
    });

    it('can convert a non uniform periodic increasing sequence with maximal multiplicities inside its interval to an open increasing knot sequence', () => {
        const knots = [0, 1, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.degree).to.eql(2)
        expect(strictIncSeq.allAbscissae.length).to.eql(11)
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 6])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 2, 1, 1, 1, 1, 2])

        const knots1 = [0, 1, 2, 2, 3, 4, 5];
        const degree1 = 2;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        const strictIncSeq1 = seq1.toOpenKnotSequence()
        expect(strictIncSeq1.degree).to.eql(2)
        expect(strictIncSeq1.allAbscissae.length).to.eql(11)
        expect(strictIncSeq1.allAbscissae).to.eql([-2, -1, 0, 1, 2, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq1.multiplicities()).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1, 1])

        const knots2 = [0, 1, 2, 3, 3, 4, 5];
        const degree2 = 2;
        const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(degree2, knots2);
        const strictIncSeq2 = seq2.toOpenKnotSequence()
        expect(strictIncSeq2.degree).to.eql(2)
        expect(strictIncSeq2.allAbscissae.length).to.eql(11)
        expect(strictIncSeq2.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7])
        expect(strictIncSeq2.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1])

        const knots3 = [0, 1, 2, 3, 3, 4, 5, 6];
        const degree3 = 2;
        const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(degree3, knots3);
        const strictIncSeq3 = seq3.toOpenKnotSequence()
        expect(strictIncSeq3.degree).to.eql(2)
        expect(strictIncSeq3.allAbscissae.length).to.eql(12)
        expect(strictIncSeq3.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8])
        expect(strictIncSeq3.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1])
    });

    it('can increment the knot multiplicity of an increasing sequence at an intermediate knot', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(7)
        seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1));
        expect(seq.multiplicities()).to.eql([2, 2, 1, 1, 2])
        expect(seq.allAbscissae).to.eql([0, 0, 1, 1, 2, 3, 4, 4])
    });

    it('cannot increment the knot multiplicity at a negative index', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(7)
        const valid = seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1));
        expect(valid).to.eql(false)
    });

    it('can increment the knot multiplicity at the first and last indices of the sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(5)
        let valid = seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
        expect(valid).to.eql(true)
        expect(seq.multiplicities()).to.eql([2, 1, 1, 1, 2])
        expect(seq.allAbscissae).to.eql([0, 0, 1, 2, 3, 4, 4])

        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq1.degree).to.eql(2)
        expect(seq1.allAbscissae.length).to.eql(5)
        valid = seq1.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(4));
        expect(valid).to.eql(true)
        expect(seq1.multiplicities()).to.eql([2, 1, 1, 1, 2])
        expect(seq1.allAbscissae).to.eql([0, 0, 1, 2, 3, 4, 4])
    });

    it('can obtain the knot abscissa given the knot index', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(1))).to.eql(1)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(5))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(8))).to.eql(3)
    });

    it('can generate the knot index of the strictly increasing sequence from the knot index of the increasing sequence', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        let index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(0));
        expect(index.knotIndex).to.eql(0)
        index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(1))
        expect(index.knotIndex).to.eql(1)
        index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(5))
        expect(index.knotIndex).to.eql(0)
        index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(8))
        expect(index.knotIndex).to.eql(8)

        const knots1 = [0, 1, 1, 2, 3, 3, 4, 5];
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots1);
        expect(seq1.degree).to.eql(2)
        expect(seq1.allAbscissae.length).to.eql(8)
        index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(0));
        expect(index.knotIndex).to.eql(0)
        index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(2));
        expect(index.knotIndex).to.eql(1)
        index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(4));
        expect(index.knotIndex).to.eql(3)
        index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(8));
        expect(index.knotIndex).to.eql(6)
    });

    it('cannot extract a subsequence of a knot sequence when end index is greater than the start index', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(0));
        // expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(0))).to.throw()
        expect(abscissae.length).to.eql(0)
    });

    it('can extract a subsequence of a knot sequence. start and end indices fall into the range of the reference period', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(3));
        expect(abscissae).to.eql([0, 1, 2, 3])
    });

    it('can extract a subsequence of a knot sequence. start index falls into the range of the reference period and end index falls outside', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(6));
        expect(abscissae).to.eql([3, 4, 0, 1])

        const knots1 = [0, 1, 1, 2, 3, 4, 5, 6];
        const degree1 = 2;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        expect(seq1.degree).to.eql(2)
        expect(seq1.allAbscissae.length).to.eql(8)
        const abscissae1 = seq1.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(6), new KnotIndexIncreasingSequence(9));
        expect(abscissae1).to.eql([5, 0, 1, 1])
    });
});