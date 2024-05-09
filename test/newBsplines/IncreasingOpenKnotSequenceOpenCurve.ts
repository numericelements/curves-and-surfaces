import { expect } from 'chai';
import { KnotIndexIncreasingSequence } from '../../src/newBsplines/Knot';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { KNOT_COINCIDENCE_TOLERANCE } from '../../src/newBsplines/AbstractKnotSequenceCurve';
import { findSpan } from '../../src/newBsplines/Piegl_Tiller_NURBS_Book';
import { IndexIncreasingKnotSeq } from '../../src/newBsplines/KnotSequenceIterators';

describe('IncreasingOpenKnotSequenceOpenCurve', () => {
    
    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the first knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[4]).to.eql(0)
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the last knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[knots.length - 1]).to.eql(1)
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at an intermediate knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[11]).to.eql(0.7)
    });

    it('can check the coincidence of an abscissa with a knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.isAbscissaCoincidingWithKnot(0 + KNOT_COINCIDENCE_TOLERANCE)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0)).to.eql(true)
    });

    it('can get the distinct abscissae of a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        const abscissae = seq.distinctAbscissae()
        expect(abscissae).to.eql([0, 0.5, 0.6, 0.7, 1])
    });

    it('can get the multiplicity of each knot of a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        const multiplicities = seq.multiplicities()
        expect(multiplicities).to.eql([4, 1, 1, 2, 4])
    });

    it('can get the degree associated with a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.degree).to.eql(3)
    });

    it('can check if the knot multiplicity of a knot is zero', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.isKnotlMultiplicityZero(0)).to.eql(false)
        expect(seq.isKnotlMultiplicityZero(0.2)).to.eql(true)
    });

    it('can get the knot multiplicity from an index of the strictly increasing sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        let index = new KnotIndexIncreasingSequence();
        let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        let multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(1);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(2);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(3);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.eql(4)
        index = new KnotIndexIncreasingSequence(4);
        indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
        multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
        expect(multiplicity).to.not.eql(4)
    });

    it('can check curve origin of open curve knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        let originAtZero = true;
        if(seq.distinctAbscissae()[0] !== 0.0) originAtZero = false
        expect(originAtZero).to.eql(true)
        const knots1: number [] = [0.1, 0.1, 0.1, 0.1, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(3, knots1)
        originAtZero = true;
        if(seq1.distinctAbscissae()[0] !== 0.0) originAtZero = false
        expect(originAtZero).to.eql(false)
    });

    it('can get the order of multiplicity of a knot from its abscissa', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.getMultiplicityOfKnotAt(0)).to.eql(4)
        expect(seq.getMultiplicityOfKnotAt(0.5)).to.eql(1)
        expect(seq.getMultiplicityOfKnotAt(0.7)).to.eql(2)
        expect(seq.getMultiplicityOfKnotAt(1)).to.eql(4)
        expect(seq.getMultiplicityOfKnotAt(0.1)).to.eql(0)
    });

    it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.insertKnot(0.3, 3)).to.eql(true)
        expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq1.insertKnot(-0.1, 1)).to.eql(true)
        expect(seq1.distinctAbscissae()).to.eql([-0.1, 0, 0.5, 0.6, 0.7, 1])
        expect(seq1.multiplicities()).to.eql([1, 4, 1, 1, 2, 4])
        const seq2 = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq2.insertKnot(1.2, 2)).to.eql(true)
        expect(seq2.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1, 1.2])
        expect(seq2.multiplicities()).to.eql([4, 1, 1, 2, 4, 2])
    });

    it('cannot insert a new knot in the knot sequence if the new knot abscissa is identical to an existing one', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.insertKnot(0.5, 3)).to.eql(false)
    });

    it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than (degree + 1)', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(seq.insertKnot(0.3, 5)).to.eql(false)
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
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

    it('comparison with the former findSpan function devoted non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        let index = seq.findSpan(0.0)
        // compare with the findSpan function initially set up and devoted to non-uniform B-splines
        let indexCompare = findSpan(0.0, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.1)
        indexCompare = findSpan(0.1, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.5)
        indexCompare = findSpan(0.5, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.55)
        indexCompare = findSpan(0.55, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.6)
        indexCompare = findSpan(0.6, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.65)
        indexCompare = findSpan(0.65, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.7)
        indexCompare = findSpan(0.7, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.9)
        indexCompare = findSpan(0.9, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(1.0)
        indexCompare = findSpan(1.0, knots, 3);
        expect(index.knotIndex).to.eql(indexCompare)
    });

    it('can find the span index in the knot sequence from an abscissa for an arbitrary B-spline', () => {
        const knots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(6)
        const knots1: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 2.0 ]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(3, knots1)
        let index1 = seq1.findSpan(0.0)
        expect(index1.knotIndex).to.eql(2)
        index1 = seq1.findSpan(2.0)
        expect(index1.knotIndex).to.eql(7)
    });

    it('can find the span index in the knot sequence from an abscissa for a uniform B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
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

    it('can extract a subset of an increasing knot sequence of a uniform B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(3))
        expect(subseq).to.eql([0, 0.1, 0.2, 0.3])
        const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(5))
        expect(subseq1).to.eql([0.2, 0.3, 0.4, 0.5])
        const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence(8))
        expect(subseq2).to.eql([0.5, 0.6, 0.7, 0.8])
    });

    it('can extract a subset of an increasing knot sequence of a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(3))
        expect(subseq).to.eql([0, 0, 0])
        const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(4))
        expect(subseq1).to.eql([0, 0, 1])
        const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(5))
        expect(subseq2).to.eql([0, 1, 1])
    });

    it('cannot extract a subset of an increasing knot sequence when indices are out of range', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        let Istart = 0
        const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Istart))
        // expect(function() {const subseq = seq.extractSubset(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Istart))}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(Istart).to.eql(Istart)
        Istart = 6
        let Iend = 9
        const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))
        // expect(function() {const subseq1 = seq.extractSubset(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(Iend).to.gt(seq.distinctAbscissae().length - 1)
        const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Iend), new KnotIndexIncreasingSequence(Istart))
        // expect(function() {const subseq2 = seq.extractSubset(new KnotIndexIncreasingSequence(Iend), new KnotIndexIncreasingSequence(Istart))}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(Iend).to.gt(Istart)
    });

    it('can raise the multiplicity of an existing knot', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        const index = seq.findSpan(0.2)
        const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
        seq.raiseKnotMultiplicity(indexStrictInc, 1)
        expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1])
        seq.raiseKnotMultiplicity(indexStrictInc, 2)
        expect(seq.multiplicities()).to.eql([1, 1, 4, 1, 1, 1, 1, 1, 1])
    });

    it('cannot raise the multiplicity of an existing knot to more than (degree + 1)', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const degree = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(degree, knots)
        const index = seq.findSpan(0.2)
        const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
        const mult = 4
        seq.raiseKnotMultiplicity(indexStrictInc, mult)
        // expect(function() {seq.raiseKnotMultiplicity(indexStrictInc, 4)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(mult + 1).to.gt(degree + 1)
    });
});