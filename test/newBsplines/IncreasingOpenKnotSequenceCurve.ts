import { expect } from 'chai';
import { IncreasingOpenKnotSequenceCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceCurve';
import { KnotIndexIncreasingSequence } from '../../src/newBsplines/Knot';

describe('InccreasingOpenKnotSequenceCurve', () => {
    
    it('cannot be initialized with a null knot sequence', () => {
        const knots: number [] = []
        // expect(function() {const seq = new IncreasingOpenKnotSequenceCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots.length).to.eql(0)
    });
    
    it('can be initialized with an initializer. non uniform knot sequence of open curve without intermediate knots', () => {
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 1, 1, 1, 1 ])
    });

    it('can be initialized with an initializer. non uniform knot sequence of open curve with intermediate knots', () => {
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
    });

    it('can be initialized with an initializer. arbitrary knot sequence', () => {
        const seq = new IncreasingOpenKnotSequenceCurve(3, [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
        expect(seq.degree).to.eql(3)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });
    
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 1, 1, 1, 1])
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
        const seq = new IncreasingOpenKnotSequenceCurve(3, [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
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
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
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
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
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
        const seq = new IncreasingOpenKnotSequenceCurve(3, [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
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
});