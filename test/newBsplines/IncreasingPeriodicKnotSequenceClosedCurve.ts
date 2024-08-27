import { expect } from "chai";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";
import { KNOT_COINCIDENCE_TOLERANCE } from "../../src/newBsplines/AbstractKnotSequenceCurve";

describe('IncreasingPeriodicKnotSequenceClosedCurve', () => {
    
    it('can be initialized with degree and increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('cannot initialize a periodic knot sequence if end knot multiplicities differ', () => {
        const knots = [0, 0, 1, 2, 3, 4];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots);
         const knotSequence = [new Knot(knots[0], 1)];
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === knotSequence[knotSequence.length - 1].abscissa) {
                knotSequence[knotSequence.length - 1].multiplicity++;
            } else {
                knotSequence.push(new Knot(knots[i], 1));
            }
        }
        expect(knotSequence[0].multiplicity).to.not.eql(knotSequence[knotSequence.length - 1].multiplicity)
        // expect(() => seq.checkMultiplicityAtEndKnots()).to.throw()
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

    it('can get the length of an increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const length = seq.length()
        expect(length).to.eql(5)

        const knots1 = [0, 1, 1, 2, 3, 4];
        const degree1 = 2;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        const length1 = seq1.length()
        expect(length1).to.eql(6)

        const knots2 = [0, 0, 1, 2, 3, 4, 4];
        const degree2 = 2;
        const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(degree2, knots2);
        const length2 = seq2.length()
        expect(length2).to.eql(7)
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

    it('can convert a non uniform periodic increasing sequence with multiplicity order of degree at its boundary to an open increasing knot sequence', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.degree).to.eql(2)
        expect(strictIncSeq.allAbscissae.length).to.eql(9)
        expect(strictIncSeq.allAbscissae).to.eql([-1, 0, 0, 1, 2, 3, 4, 4, 5])
        expect(strictIncSeq.multiplicities()).to.eql([1, 2, 1, 1, 1, 2, 1])
    });

    it('can convert a non uniform periodic increasing sequence with multiplicities greater than one at its boundary to an open increasing knot sequence', () => {
        const knots = [0, 0, 0.5, 2, 3, 4, 4];
        const degree = 3;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.degree).to.eql(3)
        expect(strictIncSeq.allAbscissae.length).to.eql(11)
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 0, 0.5, 2, 3, 4, 4, 4.5, 6])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 2, 1, 1])
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

    it('can obtain the knot abscissa given the knot index for a uniform knot sequence', () => {
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

    it('can obtain the knot abscissa given the knot index for a knot sequence with arbitrary multiplicities', () => {
        const knots = [0, 0, 1, 2, 3, 4, 5, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(8)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(1))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(2))).to.eql(1)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(6))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(7))).to.eql(0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(8))).to.eql(1)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(10))).to.eql(3)
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

    it('cannot extract a subsequence of a knot sequence when end index is greater than or equal to the start index', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        // extractSubsetOfAbscissae throws an error message
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(0));
        expect(abscissae.length).to.eql(0)
        const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(1));
        expect(abscissae1.length).to.eql(0)
    });

    it('cannot extract a subsequence of a knot sequence when start index is negative', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        // extractSubsetOfAbscissae throws an error message
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(-1), new KnotIndexIncreasingSequence(0));
        expect(abscissae.length).to.eql(0)
    });

    it('cannot extract a subsequence of a knot sequence when start index is greater than the last index of the increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        // extractSubsetOfAbscissae throws an error message
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(6), new KnotIndexIncreasingSequence(8));
        expect(abscissae.length).to.eql(0)
    });

    it('cannot extract a subsequence of a knot sequence when start and end indices span more than twice the period of the sequence', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        // extractSubsetOfAbscissae throws an error message
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(11));
        expect(abscissae.length).to.eql(0)
        const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(12));
        expect(abscissae1.length).to.eql(0)
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
        expect(abscissae).to.eql([3, 4, 5, 6])

        const knots1 = [0, 1, 1, 2, 3, 4, 5, 6];
        const degree1 = 2;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        expect(seq1.degree).to.eql(2)
        expect(seq1.allAbscissae.length).to.eql(8)
        const abscissae1 = seq1.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(6), new KnotIndexIncreasingSequence(9));
        expect(abscissae1).to.eql([5, 6, 7, 7])
    });

    it('can extract a subsequence of a knot sequence with knot multiplicities greater than one.', () => {
        const knots = [0, 1, 1, 2, 3, 4, 5];
        const degree = 3;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(3)
        expect(seq.allAbscissae.length).to.eql(7)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
        expect(abscissae).to.eql([0, 1, 1, 2, 3])

        const knots1 = [0, 1, 1, 2, 3, 4, 5, 6];
        const degree1 = 3;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1);
        expect(seq1.degree).to.eql(3)
        expect(seq1.allAbscissae.length).to.eql(8)
        const abscissae1 = seq1.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(6));
        expect(abscissae1).to.eql([1, 2, 3, 4, 5])

        const knots2 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        const degree2 = 3;
        const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(degree2, knots2);
        expect(seq2.degree).to.eql(3)
        expect(seq2.allAbscissae.length).to.eql(9)
        const abscissae2 = seq2.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
        expect(abscissae2).to.eql([0, 0, 1, 2, 3])

        const knots3 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        const degree3 = 3;
        const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(degree3, knots3);
        expect(seq3.degree).to.eql(3)
        expect(seq3.allAbscissae.length).to.eql(9)
        const abscissae3 = seq3.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(7));
        expect(abscissae3).to.eql([2, 3, 4, 5, 6])

        const knots4 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        const degree4 = 3;
        const seq4 = new IncreasingPeriodicKnotSequenceClosedCurve(degree4, knots4);
        expect(seq4.degree).to.eql(3)
        expect(seq4.allAbscissae.length).to.eql(9)
        const abscissae4 = seq4.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(8));
        expect(abscissae4).to.eql([3, 4, 5, 6, 6])
    });

    it('can extract a subsequence from a knot sequence with various knot multiplicities.', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12];
        const degree = 4;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(4)
        expect(seq.allAbscissae.length).to.eql(17)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(15), new KnotIndexIncreasingSequence(21));
        expect(abscissae).to.eql([12, 12, 13, 14, 15, 16, 16])
        const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(16), new KnotIndexIncreasingSequence(22));
        expect(abscissae1).to.eql([12, 13, 14, 15, 16, 16, 17])
    });

    it('can extract a subsequence from a knot sequence when indices cover the period of the B-Spline and knots are of multiplicity one.', () => {
        const knots = [0, 1, 2, 3, 4];
        const degree = 3;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(3)
        expect(seq.allAbscissae.length).to.eql(5)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(5));
        expect(abscissae).to.eql([1, 2, 3, 4, 5])
        const abscissae2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(7));
        expect(abscissae2).to.eql([3, 4, 5, 6, 7])
        const abscissae3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
        expect(abscissae3).to.eql([0, 1, 2, 3, 4])
        const abscissae4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(8));
        expect(abscissae4).to.eql([4, 5, 6, 7, 8])
    });

    it('can extract a subsequence from a knot sequence when indices cover the period of the B-Spline and end knots are of multiplicity greater than one.', () => {
        const knots = [0, 0, 1, 2, 3, 4, 4];
        const degree = 3;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(3)
        expect(seq.allAbscissae.length).to.eql(7)
        const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(7));
        expect(abscissae).to.eql([1, 2, 3, 4, 4, 5])
        const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(8));
        expect(abscissae1).to.eql([2, 3, 4, 4, 5, 6])
        const abscissae2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(9));
        expect(abscissae2).to.eql([3, 4, 4, 5, 6, 7])
        const abscissae3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(6));
        expect(abscissae3).to.eql([0, 1, 2, 3, 4, 4])
        const abscissae4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(6));
        expect(abscissae4).to.eql([0, 0, 1, 2, 3, 4, 4])
        const abscissae5 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(6), new KnotIndexIncreasingSequence(12));
        expect(abscissae5).to.eql([4, 5, 6, 7, 8, 8, 9])
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform periodic B-spline with multiplicity greater than one at its origin', () => {
        const knots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.5)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.55)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.6)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.65)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(6)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(6)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(6)
    });

    it('can find the span index in the knot sequence from an abscissa for an arbitrary periodic B-spline', () => {
        const knots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(6)
        const knots1: number [] = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 2.0, 2.0 ]
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots1)
        let index1 = seq1.findSpan(0.0)
        expect(index1.knotIndex).to.eql(1)
        index1 = seq1.findSpan(2.0)
        expect(index1.knotIndex).to.eql(6)
    });

    it('can find the span index in the knot sequence from an abscissa for a uniform periodic B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.05)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(7)
        index = seq.findSpan(0.75)
        expect(index.knotIndex).to.eql(7)
        index = seq.findSpan(0.8)
        expect(index.knotIndex).to.eql(7)
    });

    it('can raise the order of multiplicity of a knot in the knot sequence of a periodic B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        let index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(1))
        seq.raiseKnotMultiplicity(index, 1)
        expect(seq.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.knotMultiplicity(index)).to.eql(2)
        index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(0))
        seq.raiseKnotMultiplicity(index, 1)
        expect(seq.multiplicities()).to.eql([2, 2, 1, 1, 1, 1, 1, 1, 2])
        expect(seq.knotMultiplicity(index)).to.eql(2)
    });

    it('can obtain the order of multiplicity of a knot from an abscissa of a periodic B-spline', () => {
        const knots: number [] = [0, 0.1, 0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        expect(seq.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1])
        expect(seq.knotMultiplicityAtAbscissa(0)).to.eql(1)
        expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(2)
        expect(seq.knotMultiplicityAtAbscissa(0.1 + 1.1 * KNOT_COINCIDENCE_TOLERANCE)).to.eql(0)
    });

    it('can insert a knot into a knot sequence of a periodic B-spline', () => {
        const knots = [0, 1, 2, 3, 4, 5];
        const degree = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
        expect(seq.degree).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(6)
        let status = seq.insertKnot(-0.1);
        expect(status).to.eql(false)
        status = seq.insertKnot(6);
        expect(status).to.eql(false)
        status = seq.insertKnot(2);
        expect(status).to.eql(false)
        status = seq.insertKnot(1.5);
        expect(status).to.eql(true)
        expect(seq.allAbscissae.length).to.eql(7)
        expect(seq.allAbscissae).to.eql([0, 1, 1.5, 2, 3, 4, 5])
    });
});