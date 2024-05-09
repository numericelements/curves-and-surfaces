import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { clampingFindSpan } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";

describe('StrictlyIncreasingOpenKnotSequenceClosedCurve', () => {

    it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2]
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(knots.length).not.to.eql(multiplicities.length)
    });

    it('can be initialized with a minimal knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 1]
        const multiplicities: number[] = [4,4]
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae()).to.eql([0, 1])
        expect(seq.multiplicities()).to.eql([4, 4])
        expect(seq.freeKnots).to.eql([])
    });

    it('can be initialized with a knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0,0.5, 0.6, 0.7, 1]
        const multiplicities: number [] = [4, 1, 1, 2, 4];
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq.freeKnots).to.eql([0.5, 0.6, 0.7])
    });

    it('cannot be initialized with a knot sequence containing a knot with more than (degree + 1) multiplicity', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number [] = [5, 1, 1, 2, 4];
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(knots[0]).to.eql(0)
    });

    it('cannot be initialized with an origin differing from zero', () => {
        const knots: number [] = [0.1, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const multiplicities: number [] = [4, 1, 1, 2, 4];
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(knots[0]).not.to.eql(0)
        const knots1: number [] = [0, 0.1, 0.2, 0.6, 0.9, 1, 1.1]
        const multiplicities1: number [] = [1, 3, 1, 1, 2, 3, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1)
        expect(knots1[1]).not.to.eql(0)
        const knots2: number [] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const multiplicities2: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(2, knots2, multiplicities2)
        expect(knots1[2]).not.to.eql(0)
    });

    it('can be initialized with different orders of multiplicity at the curve origin', () => {
        const knots: number [] = [-0.1, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1.1 ]
        const multiplicities: number [] = [1, 3, 1, 1, 1, 1, 3, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)
        expect(seq.freeKnots).to.eql([0.1, 0.6, 0.7, 0.9])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1)
        expect(seq1.freeKnots).to.eql([0.1, 0.2, 0.6, 0.7, 0.8, 0.9])
        const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        const multiplicities2: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots2, multiplicities2)
        expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('can be initialized with a knot sequence constrained by closure constraints', () => {
        const knots: number [] = [-0.1, 0.0, 0.1, 0.2, 0.3]
        const multiplicities: number [] = [1, 3, 1, 3, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)
        expect(seq.freeKnots).to.eql([0.1])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 2, 1, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1)
        expect(seq1.freeKnots).to.eql([0.1])
        // const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        // const seq2 = new IncreasingOpenKnotSequenceClosedCurve(3, knots2)
        // expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('cannot be initialized when the knot sequence constrained is improperly set', () => {
        const knots: number [] = [-0.1, 0.0, 0.1, 0.3, 0.4]
        const multiplicities: number [] = [1, 3, 1, 3, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots[1] - knots[0]).not.to.eql(knots[4] - knots[3])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.2, 0.4, 0.5 ]
        const multiplicities1: number [] = [1, 3, 1, 3, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities)
        // expect(function() {const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots1[2] - knots1[1]).not.to.eql(knots1[7] - knots1[6])
    });

    it('can be initialized as a description of a uniform B-spline', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(2, knots, multiplicities);
        expect(seq.freeKnots).to.eql([1, 2, 3, 4])
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can get knot multiplicity at curve origin', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(2, knots, multiplicities)
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.getKnotMultiplicityAtCurveOrigin()).to.eql(1)
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1)
        expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
        expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        expect(seq1.getKnotMultiplicityAtCurveOrigin()).to.eql(2)
        const knots2: number [] = [-0.1, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1.1 ]
        const multiplicities2: number [] = [1, 3, 1, 1, 1, 1, 3, 1];
        const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots2, multiplicities2)
        expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1])
        expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1])
        expect(seq2.getKnotMultiplicityAtCurveOrigin()).to.eql(3)
        const knots3: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities3: number [] = [4, 1, 1, 2, 4];
        const seq3 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots3, multiplicities3)
        expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq3.getKnotMultiplicityAtCurveOrigin()).to.eql(4)
    });

    it('can check if an abscissa coincides with a knot belonging to the effective interval of the curve', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(2, knots, multiplicities)
        expect(seq.isAbscissaCoincidingWithKnot(0.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(-1)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(5.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(6.0)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0.5)).to.eql(false)
    });

    it('can convert the increasing knot sequence belonging to a strictly increasing knot sequence', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(2, knots, multiplicities)
        const seqIncreasing = seq.toIncreasingKnotSequence();
        expect(seqIncreasing.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqIncreasing) {
            if(knot !== undefined) sequence.push(knot)
        }
        expect(sequence).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1)
        const seqIncreasing1 = seq1.toIncreasingKnotSequence();
        expect(seqIncreasing1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        const sequence1: number[] = []
        for(const knot of seqIncreasing1) {
            if(knot !== undefined) sequence1.push(knot)
        }
        expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2])
    });

    it('can insert a knot into knot sequence', () => {
        const knots: number [] = [-0.1, 0.0, 0.1, 0.5, 0.6, 0.9, 1, 1.1]
        const multiplicities: number[] = [1, 3, 1, 1, 1, 1, 3, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities);
        expect(seq.insertKnot(0.2, 2)).to.eql(true)
        expect(seq.distinctAbscissae()).to.eql([-0.1, 0.0, 0.1, 0.2, 0.5, 0.6, 0.9, 1, 1.1])
        expect(seq.multiplicities()).to.eql([1, 3, 1, 2, 1, 1, 1, 3, 1])
        const knots1: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities1: number[] = [4, 1, 1, 2, 4]
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots1, multiplicities1);
        expect(seq1.insertKnot(0.2, 2)).to.eql(true)
        expect(seq1.distinctAbscissae()).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1])
        expect(seq1.multiplicities()).to.eql([4, 2, 1, 1, 2, 4])
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number [] = [4, 1, 1, 2, 4];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(3, knots, multiplicities)
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