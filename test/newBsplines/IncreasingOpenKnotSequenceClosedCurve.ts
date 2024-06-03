import { expect } from "chai";
import { IncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve";
import { clampingFindSpan } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { KnotIndexIncreasingSequence } from "../../src/newBsplines/Knot";

describe('IncreasingOpenKnotSequenceClosedCurve', () => {
    
    it('cannot be initialized with a null knot sequence', () => {
        const knots: number [] = []
        // expect(function() {const seq = new IncreasingOpenKnotSequenceCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots.length).to.eql(0)
    });

    it('can be initialized with an initializer. non uniform knot sequence of open curve without intermediate knots', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 1, 1, 1, 1 ])
    });

    it('can be initialized with an initializer. non uniform knot sequence of open curve with intermediate knots', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
    });

    it('can be initialized with an initializer. arbitrary knot sequence', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });
    
    it('can get knot sequence length', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        expect(seq.length()).to.eql(12)
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 1, 1, 1, 1 ])
        expect(seq1.degree).to.eql(3)
        expect(seq1.length()).to.eql(8)
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 1, 1, 1, 1])
        const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(increasingSeq.degree).to.eql(3)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([0, 1])
        expect(multiplicity).to.eql([4, 4])
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
        const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(increasingSeq.degree).to.eql(3)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([-2, -1, 0, 0.5, 0.6, 0.7, 1])
        expect(multiplicity).to.eql([1, 1, 2, 1, 1, 2, 4])
    });

    it('can get the knot abscissa from a sequence index', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        let index = new KnotIndexIncreasingSequence();
        let abscissa = seq.abscissaAtIndex(index)
        expect(abscissa).to.eql(0.0)
        index = new KnotIndexIncreasingSequence(3);
        abscissa = seq.abscissaAtIndex(index)
        expect(abscissa).to.eql(0.0)
        index = new KnotIndexIncreasingSequence(4);
        abscissa = seq.abscissaAtIndex(index)
        expect(abscissa).to.eql(0.5)
        index = new KnotIndexIncreasingSequence(11);
        abscissa = seq.abscissaAtIndex(index)
        expect(abscissa).to.eql(1.0)
    });

    it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        let index = new KnotIndexIncreasingSequence();
        let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
        index = new KnotIndexIncreasingSequence(3);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
        expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
        index = new KnotIndexIncreasingSequence(4);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
        expect(indexStrictlyIncSeq.knotIndex).to.eql(1)
        index = new KnotIndexIncreasingSequence(11);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
        expect(indexStrictlyIncSeq.knotIndex).to.eql(4)
    });

    it('can get the knot multiplicity from a sequence index', () => {
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        let index = new KnotIndexIncreasingSequence();
        let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        let multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(3);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(4);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(1)
        index = new KnotIndexIncreasingSequence(11);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
    });

    it('can be initialized with a knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq.freeKnots).to.eql([0.5, 0.6, 0.7, 0.7])
    });

    it('can be initialized with a minimal knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae()).to.eql([0, 1])
        expect(seq.multiplicities()).to.eql([4, 4])
        expect(seq.freeKnots).to.eql([])
    });

    it('cannot be initialized with a knot sequence containing a knot with more than (degree + 1) multiplicity', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[4]).to.eql(0)
    });

    it('cannot be initialized with an origin differing from zero', () => {
        const knots: number [] = [0.1, 0.1, 0.1, 0.1, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[3]).not.to.eql(0)
        const knots1: number [] = [0, 0.1, 0.1, 0.1, 0.2, 0.6, 0.9, 0.9, 1, 1, 1, 1.1 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        expect(knots1[3]).not.to.eql(0)
        const knots2: number [] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const seq2 = new IncreasingOpenKnotSequenceClosedCurve(2, knots2)
        expect(knots1[2]).not.to.eql(0)
    });

    it('can be initialized with different orders of multiplicity at the curve origin', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        expect(seq.freeKnots).to.eql([0.1, 0.6, 0.7, 0.9])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        expect(seq1.freeKnots).to.eql([0.1, 0.2, 0.6, 0.7, 0.8, 0.9])
        const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        const seq2 = new IncreasingOpenKnotSequenceClosedCurve(3, knots2)
        expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('can be initialized with a knot sequence constrained by closure constraints', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.2, 0.2, 0.2, 0.3]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        expect(seq.freeKnots).to.eql([0.1])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.2, 0.3, 0.4 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        expect(seq1.freeKnots).to.eql([0.1])
        // const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        // const seq2 = new IncreasingOpenKnotSequenceClosedCurve(3, knots2)
        // expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('cannot be initialized when the knot sequence constrained is improperly set', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.3, 0.3, 0.3, 0.4]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots[5] - knots[4]).not.to.eql(knots[8] - knots[7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.2, 0.4, 0.5 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        // expect(function() {const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots1[2] - knots1[1]).not.to.eql(knots1[7] - knots1[6])
    });

    it('can be initialized with a knot sequence conforming to a uniform B-spline', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots)
        expect(seq.freeKnots).to.eql([1, 2, 3, 4])
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can get knot multiplicity at curve origin', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots)
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.getKnotMultiplicityAtCurveOrigin()).to.eql(1)
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
        expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        expect(seq1.getKnotMultiplicityAtCurveOrigin()).to.eql(2)
        const knots2: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1 ]
        const seq2 = new IncreasingOpenKnotSequenceClosedCurve(3, knots2)
        expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1])
        expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1])
        expect(seq2.getKnotMultiplicityAtCurveOrigin()).to.eql(3)
        const knots3: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq3 = new IncreasingOpenKnotSequenceClosedCurve(3, knots3)
        expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq3.getKnotMultiplicityAtCurveOrigin()).to.eql(4)
    });

    it('can check if an abscissa coincides with a knot belonging to the effective interval of the curve', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots)
        expect(seq.isAbscissaCoincidingWithKnot(0.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(-1)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(5.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(6.0)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0.5)).to.eql(false)
    });

    it('can convert the increasing knot sequence belonging to a strictly increasing knot sequence', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots)
        const seqStrictly = seq.toStrictlyIncreasingKnotSequence();
        expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqStrictly) {
            if(knot !== undefined) sequence.push(knot.abscissa)
        }
        expect(sequence).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots1)
        const seqStrictly1 = seq1.toStrictlyIncreasingKnotSequence();
        expect(seqStrictly1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        const sequence1: number[] = []
        for(const knot of seqStrictly1) {
            if(knot !== undefined) sequence1.push(knot.abscissa)
        }
        expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.5)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.55)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.6)
        expect(index.knotIndex).to.eql(5)
        index = seq.findSpan(0.65)
        expect(index.knotIndex).to.eql(5)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(7)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(7)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(7)
    });

    it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', () => {
        const knots: number [] = [- 0.2, - 0.1, 0, 0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.05)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.15)
        expect(index.knotIndex).to.eql(4)
        index = seq.findSpan(0.2)
        expect(index.knotIndex).to.eql(5)
        index = seq.findSpan(0.25)
        expect(index.knotIndex).to.eql(5)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(9)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(11)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(13)
    });

    it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines with a periodic uniform B-Spline', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots)
        let index = seq.findSpan(0.0)
        // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
        let indexCompare = clampingFindSpan(0.0, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(1)
        indexCompare = clampingFindSpan(1, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(2)
        indexCompare = clampingFindSpan(2, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(3)
        indexCompare = clampingFindSpan(3, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(4)
        indexCompare = clampingFindSpan(4, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(5)
        indexCompare = clampingFindSpan(5, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(6)
        indexCompare = clampingFindSpan(6, knots, 2);
        expect(index.knotIndex).to.eql(indexCompare)
        // Currently, 04/2024, clampingFindSpan does not behave like findSpan function for the last knot
        // The method findSpan, at the opposite has the same behavior for the classes of knot sequences
        // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
        // index = seq.findSpan(7)
        // indexCompare = clampingFindSpan(7, knots, 2);
        // expect(index.knotIndex).to.eql(indexCompare)
    });

    it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        let index = seq.findSpan(0.0)
        // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
        let indexCompare = clampingFindSpan(0.0, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.1)
        indexCompare = clampingFindSpan(0.1, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.5)
        indexCompare = clampingFindSpan(0.5, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.55)
        indexCompare = clampingFindSpan(0.55, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.6)
        indexCompare = clampingFindSpan(0.6, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.65)
        indexCompare = clampingFindSpan(0.65, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.7)
        indexCompare = clampingFindSpan(0.7, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.9)
        indexCompare = clampingFindSpan(0.9, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        // Similar remark to the test above
        // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
        // index = seq.findSpan(1.0)
        // indexCompare = clampingFindSpan(1.0, knots, 3);
        // expect(index.knotIndex).to.eql(indexCompare)
    });

    it('can decrement the degree of a knot sequence of degree 3 without knots of multiplicity greater than one', () => {
        const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots);
        const newSeq = seq.decrementDegree();
        const newKnots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        expect(newSeq.degree).to.eql(2)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 2 with knots of multiplicity greater than two', () => {
        const knots: number [] = [-2, -1, 0, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(2, knots);
        const newSeq = seq.decrementDegree();
        const newKnots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
        expect(newSeq.degree).to.eql(1)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 1 with knots of multiplicity greater than one', () => {
        const knots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(1, knots);
        const newSeq = seq.decrementDegree();
        const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
        expect(newSeq.degree).to.eql(0)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 1 with a knot of multiplicity greater than one at sequence origin', () => {
        const knots: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(1, knots);
        const newSeq = seq.decrementDegree();
        const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
        expect(newSeq.degree).to.eql(0)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

});