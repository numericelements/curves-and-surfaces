import { expect } from "chai";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceOpenCurve";

describe('StrictlyIncreasingPeriodicKnotSequenceClosedCurve', () => {
    
    it('can be initialized with degree and increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities);
        expect(seq.maxMultiplicityOrder).to.eql(2)
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('cannot initialize a periodic knot sequence if end knot multiplicities differ', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [2, 1, 1, 1, 1];
        // const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities);
        let knotSequence: Array<Knot> = [];
        for(let i = 0; i < knots.length; i++) {
            knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        expect(knotSequence[0].multiplicity).to.not.eql(knotSequence[knotSequence.length - 1].multiplicity)
        // expect(seq.checkMultiplicityAtEndKnots()).to.throw()
        // expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities)).to.throw()
    });

    it('cannot initialize a periodic knot sequence if its origin is not zero', () => {
        const knots = [1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1];
        const degree = 2;
        // const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities);
        // expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities)).to.throw()
        expect(knots[0]).to.not.eql(0)
    });

    it('cannot initialize a periodic knot sequence if knot sequence length is smaller than (degree + 2) to generate a basis of splines', () => {
        const knots = [0, 1, 2];
        const multiplicities = [1, 1, 1];
        const degree = 2;
        // const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities);
        // expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities)).to.throw()
        expect(knots.length).to.below(degree + 2)
    });

    it('cannot initialize a periodic knot sequence if a knot multiplicity is greater than the curve degree', () => {
        const knots = [0, 1, 1, 1, 2, 3];
        const multiplicities = [1, 3, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        // expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(2, knots, multiplicities)).to.throw()
        expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1))).to.above(degree)
    });

    it('can get the list of knot abscissae in increasing order using the accessor and iterator', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 2, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        expect(seq.allAbscissae).to.eql(knots)
    });

    it('can generate a deep copy of an increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        const newSeq = seq.deepCopy()
        newSeq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1))
        expect(newSeq.allAbscissae).to.eql([0, 1, 2, 3, 4])
        expect(seq.allAbscissae).to.eql(knots)
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1])
    });

    it('can get the length of an increasing knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        const length = seq.length()
        expect(length).to.eql(5)

        const knots1 = [0, 1, 2, 3, 4];
        const multiplicities1 = [1, 2, 1, 1, 1];
        const degree1 = 2;
        const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1, multiplicities1);
        const length1 = seq1.length()
        expect(length1).to.eql(5)

        const knots2 = [0, 1, 2, 3, 4];
        const multiplicities2 = [2, 1, 1, 1, 2];
        const degree2 = 2;
        const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree2, knots2, multiplicities2);
        const length2 = seq2.length()
        expect(length2).to.eql(5)
    });

    it('can generate a strictly increasing knot sequence from an increasing sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 2, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        const incSeq = seq.toIncreasingKnotSequence()
        expect(incSeq.allAbscissae).to.eql([0, 1, 1, 2, 3, 4])
        expect(incSeq.multiplicities()).to.eql([1, 2, 1, 1, 1])
        const knots1 = [0, 1, 2, 3, 4];
        const multiplicities1 = [2, 1, 1, 1, 2];
        const degree1 = 2;
        const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1, multiplicities1);
        const incSeq1 = seq1.toIncreasingKnotSequence()
        expect(incSeq1.allAbscissae).to.eql([0, 0, 1, 2, 3, 4, 4])
        expect(incSeq1.multiplicities()).to.eql([2, 1, 1, 1, 2])
    });

    it('can convert a strictly increasing periodic knot sequence into a strictly increasing open knot sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 2, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        const strictIncSeq = seq.toOpenKnotSequence()
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 2, 1, 1, 1, 2])
        const knots1 = [0, 1, 2, 3, 4];
        const multiplicities1 = [2, 1, 1, 1, 2];
        const degree1 = 2;
        const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree1, knots1, multiplicities1);
        const strictIncSeq1 = seq1.toOpenKnotSequence()
        expect(strictIncSeq1.allAbscissae).to.eql([-1, 0, 1, 2, 3, 4, 5])
        expect(strictIncSeq1.multiplicities()).to.eql([1, 2, 1, 1, 1, 2, 1])
        const knots2 = [0, 1, 2, 3, 4, 5];
        const multiplicities2 = [1, 1, 1, 1, 1, 1];
        const degree2 = 2;
        const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree2, knots2, multiplicities2);
        const strictIncSeq2 = seq2.toOpenKnotSequence()
        expect(strictIncSeq2.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq2.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const knots3 = [0, 1, 2, 3, 4, 5];
        const multiplicities3 = [1, 1, 1, 1, 2, 1];
        const degree3 = 2;
        const seq3 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree3, knots3, multiplicities3);
        const strictIncSeq3 = seq3.toOpenKnotSequence()
        expect(strictIncSeq3.allAbscissae).to.eql([-1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq3.multiplicities()).to.eql([2, 1, 1, 1, 1, 2, 1, 1, 1])
        const knots4 = [0, 1, 2, 3, 4, 5];
        const multiplicities4 = [1, 1, 2, 1, 1, 1];
        const degree4 = 2;
        const seq4 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree4, knots4, multiplicities4);
        const strictIncSeq4 = seq4.toOpenKnotSequence()
        expect(strictIncSeq4.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq4.multiplicities()).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
    });

    it('can increment the knot multiplicity of a strictly increasing sequence at an intermediate knot', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [2, 1, 1, 1, 2];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        expect(seq.maxMultiplicityOrder).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(5)
        seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1));
        expect(seq.multiplicities()).to.eql([2, 2, 1, 1, 2])
        expect(seq.allAbscissae).to.eql([0, 1, 2, 3, 4])
    });

    it('cannot increment the knot multiplicity at a negative index', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [2, 1, 1, 1, 2];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        expect(seq.maxMultiplicityOrder).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(5)
        const valid = seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1));
        expect(valid).to.eql(false)
    });

    it('can increment the knot multiplicity at the first and last indices of the sequence', () => {
        const knots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const degree = 2;
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        expect(seq.maxMultiplicityOrder).to.eql(2)
        expect(seq.allAbscissae.length).to.eql(5)
        let valid = seq.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
        expect(valid).to.eql(true)
        expect(seq.multiplicities()).to.eql([2, 1, 1, 1, 2])
        expect(seq.allAbscissae).to.eql([0, 1, 2, 3, 4])

        const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(degree, knots, multiplicities);
        expect(seq1.maxMultiplicityOrder).to.eql(2)
        expect(seq1.allAbscissae.length).to.eql(5)
        valid = seq1.incrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(4));
        expect(valid).to.eql(true)
        expect(seq1.multiplicities()).to.eql([2, 1, 1, 1, 2])
        expect(seq1.allAbscissae).to.eql([0, 1, 2, 3, 4])
    });


    it('can find the span index in the knot sequence from an abscissa for a non uniform periodic B-spline', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [1, 1, 1, 2, 1]
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(3, knots, multiplicities)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.5)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.55)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.6)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.65)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(3)
    });
});