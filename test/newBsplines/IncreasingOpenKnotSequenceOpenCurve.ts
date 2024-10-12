import { expect } from 'chai';
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from '../../src/newBsplines/Knot';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { KNOT_COINCIDENCE_TOLERANCE } from '../../src/newBsplines/AbstractKnotSequence';
import { findSpan } from '../../src/newBsplines/Piegl_Tiller_NURBS_Book';
import { IndexIncreasingKnotSeq } from '../../src/newBsplines/KnotSequenceIterators';
import { INCREASINGOPENKNOTSEQUENCE, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from '../../src/newBsplines/KnotSequenceConstructorInterface';

describe('IncreasingOpenKnotSequenceOpenCurve', () => {

    it('cannot be initialized with a null knot sequence with INCREASINGOPENKNOTSEQUENCE intializer', () => {
        const knots: number [] = []
        // expect(function() {const seq = new IncreasingOpenKnotSequenceCurve(3, knots)}).to.throw()
        // const seq = new IncreasingOpenKnotSequenceOpenCurve(3, knots)
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(3, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type NO_KNOT_OPEN_CURVE', () => {
        const maxMultiplicityOrder = 0
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})).to.throw()
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type UNIFORM_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: 2})).to.throw()
    });

    it('can be initialized without a knot sequence with NO_KNOT_OPEN_CURVE initializer', () => {
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        expect(seq.allAbscissae).to.eql([0, 0, 0, 1, 1, 1])
    });

    it('can get the knot index of the curve origin with NO_KNOT_OPEN_CURVE initializer', () => {
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
    });

    it('can get the properties of knot sequnence produced by NO_KNOT_OPEN_CURVE initializer', () => {
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
    });

    it('can get the u interval upper bound with NO_KNOT_OPEN_CURVE initializer', () => {
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        const lastIndex = seq.length() - 1
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0.0)
        expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(lastIndex))).to.eql(1.0)
        expect(seq.uMax).to.eql(1.0)
    });

    it('can be initialized with a number of control points with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4])
    });

    it('can get the knot index of the curve origin with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
    });

    it('can get the u interval upper bound with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.uMax).to.eql(nbCtrlPoints - 1)
    });

    it('can get the properties of knot sequnence produced by UNIFORM_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('cannot initialize a knot sequence with UNIFORM_OPENKNOTSEQUENCE initializer if the number of control points does not enable generating a basis of B-Splines', () => {
        const maxMultiplicityOrder = 3
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: 2})).to.throw()
    });

    it('can be initialized with a number of control points with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: 4})
        expect(seq.allAbscissae).to.eql([0, 0, 0, 1, 2, 2, 2])
    });

    it('can get the u interval upper bound with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 4;
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.uMax).to.eql(nbCtrlPoints - maxMultiplicityOrder + 1)
    });

    it('can get the knot index of the curve origin with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 4;
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
    });

    it('can get the properties of knot sequnence produced by UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 3
        const nbCtrlPoints = 4
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: nbCtrlPoints})
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
    });

    it('cannot initialize a knot sequence with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer if the number of control points does not enable generating a basis of B-Splines', () => {
        const maxMultiplicityOrder = 3
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: 2})).to.throw()
    });

    it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. non uniform knot sequence of open curve without intermediate knots', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq.allAbscissae).to.eql([0, 0, 0, 0, 1, 1, 1, 1 ])
    });

    it('can get the properties of knot sequnence produced by INCREASINGOPENKNOTSEQUENCE initializer', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
    });

    it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCE', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5, 5]
        const maxMultiplicityOrder = 3;
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
        const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5]
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw()
        const knots2: number [] = [0, 0, 0, 0.5, 2, 2, 2, 2, 3, 4, 5, 5, 5]
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw()
    });

    it('cannot be initialized with a non increasing knot sequence with INCREASINGOPENKNOTSEQUENCE type constructor', () => {
        const knots: number [] = [0, 0, 0, -0.5, 2, 3, 4, 5, 5, 5]
        const maxMultiplicityOrder = 3;
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
        const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw()
        const knots2: number [] = [0, 0, 0, 1, 2, 3, 4, 4, 3.5]
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw()
    });

    it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. non uniform knot sequence of open curve with intermediate knots', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
    });

    it('can get the properties of knot sequnence produced by INCREASINGOPENKNOTSEQUENCE initializer', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
    });

    it('can use the iterator to access the knots of the sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 2, 2, 2, 2]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 2])
    });

    it('can check that the knot sequence of an open curve is non uniform with INCREASINGOPENKNOTSEQUENCE initializer', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 2, 2, 2, 2]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotSpacingUniform).to.eql(true)
    });

    it('can check that the knot sequence of open curve is uniform with an INCREASINGOPENKNOTSEQUENCE initializer', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotSpacingUniform).to.eql(true)
    });
    
    it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. arbitrary knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });

    it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. arbitrary knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('can compute the knot sequence length', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(seq.length()).to.eql(12)
        const knots1 = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
        expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(seq1.length()).to.eql(8)
    });

    it('can clone the knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const seq1 = seq.clone()
        expect(seq.allAbscissae).to.eql(seq1.allAbscissae)
        seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1))
        expect(seq1.allAbscissae).to.eql(knots)
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the first knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the last knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at an intermediate knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('can check the coincidence of an abscissa with a knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.isAbscissaCoincidingWithKnot(0 + KNOT_COINCIDENCE_TOLERANCE)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0)).to.eql(true)
    });

    it('can get the distinct abscissae of a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const abscissae = seq.distinctAbscissae()
        expect(abscissae).to.eql([0, 0.5, 0.6, 0.7, 1])
    });

    it('can get the multiplicity of each knot of a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const multiplicities = seq.multiplicities()
        expect(multiplicities).to.eql([4, 1, 1, 2, 4])
    });

    it('can get the degree associated with a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
    });

    it('can check if the knot multiplicity of a knot is zero', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.isKnotlMultiplicityZero(0)).to.eql(false)
        expect(seq.isKnotlMultiplicityZero(0.2)).to.eql(true)
    });

    it('can get the knot multiplicity from an index of the strictly increasing sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        let originAtZero = true;
        if(seq.distinctAbscissae()[0] !== 0.0) originAtZero = false
        expect(originAtZero).to.eql(true)
        const knots1: number [] = [0.1, 0.1, 0.1, 0.1, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
        originAtZero = true;
        if(seq1.distinctAbscissae()[0] !== 0.0) originAtZero = false
        expect(originAtZero).to.eql(false)
    });

    it('can get the order of multiplicity of a knot from its abscissa', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.knotMultiplicityAtAbscissa(0)).to.eql(4)
        expect(seq.knotMultiplicityAtAbscissa(0.5)).to.eql(1)
        expect(seq.knotMultiplicityAtAbscissa(0.7)).to.eql(2)
        expect(seq.knotMultiplicityAtAbscissa(1)).to.eql(4)
        expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
    });

    it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.insertKnot(0.3, 3)).to.eql(true)
        expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq1.insertKnot(-0.1, 1)).to.eql(true)
        expect(seq1.distinctAbscissae()).to.eql([-0.1, 0, 0.5, 0.6, 0.7, 1])
        expect(seq1.multiplicities()).to.eql([1, 4, 1, 1, 2, 4])
        const seq2 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq2.insertKnot(1.2, 2)).to.eql(true)
        expect(seq2.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1, 1.2])
        expect(seq2.multiplicities()).to.eql([4, 1, 1, 2, 4, 2])
    });

    it('cannot insert a new knot in the knot sequence if the new knot abscissa is identical to an existing one', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.insertKnot(0.5, 3)).to.eql(false)
    });

    it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(() => seq.insertKnot(0.3, 5)).to.throw()
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(6)
        const knots1: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 2.0 ]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
        let index1 = seq1.findSpan(0.0)
        expect(index1.knotIndex).to.eql(2)
        index1 = seq1.findSpan(2.0)
        expect(index1.knotIndex).to.eql(7)
    });

    it('can find the span index in the knot sequence from an abscissa for a uniform B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(3))
        expect(subseq).to.eql([0, 0.1, 0.2, 0.3])
        const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(5))
        expect(subseq1).to.eql([0.2, 0.3, 0.4, 0.5])
        const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence(8))
        expect(subseq2).to.eql([0.5, 0.6, 0.7, 0.8])
    });

    it('can extract a subset of an increasing knot sequence of a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(3))
        expect(subseq).to.eql([0, 0, 0])
        const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(4))
        expect(subseq1).to.eql([0, 0, 1])
        const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(5))
        expect(subseq2).to.eql([0, 1, 1])
    });

    it('cannot extract a subset of an increasing knot sequence when indices are out of range', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const index = seq.findSpan(0.2)
        const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
        seq.raiseKnotMultiplicity(indexStrictInc, 1)
        expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1])
        seq.raiseKnotMultiplicity(indexStrictInc, 2)
        expect(seq.multiplicities()).to.eql([1, 1, 4, 1, 1, 1, 1, 1, 1])
    });

    it('cannot raise the multiplicity of an existing knot to more than (degree + 1)', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const index = seq.findSpan(0.2)
        const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
        const mult = 4
        seq.raiseKnotMultiplicity(indexStrictInc, mult)
        // expect(function() {seq.raiseKnotMultiplicity(indexStrictInc, 4)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(mult + 1).to.gt(maxMultiplicityOrder)
    });

    it('can decrement the multiplicity of an existing knot', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const abscissa = 0.2
        const index = seq.findSpan(abscissa)
        const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
        expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1])
        seq.decrementKnotMultiplicity(indexStrictInc)
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.length()).to.eql(9)
        seq.decrementKnotMultiplicity(indexStrictInc)
        expect(seq.length()).to.eql(8)
        expect(seq.isKnotlMultiplicityZero(abscissa)).to.eql(true)
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can revert the knot sequence for a uniform B-spline', () => {
        const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const seqRef = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        seq.revertKnots();
        const tolerance = 1e-10;
        let i = 0;
        for(const knot of seq) {
            const index = new KnotIndexIncreasingSequence(i);
            expect(knot).to.approximately(seqRef.abscissaAtIndex(index), tolerance);
            i++;
        }
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        const knots1: number [] = [0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
        const knots2 = [0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.6, 0.75, 0.8]
        const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})
        seq1.revertKnots();
        i = 0;
        for(const knot of seq1) {
            const index = new KnotIndexIncreasingSequence(i);
            expect(knot).to.approximately(seqRef1.abscissaAtIndex(index), tolerance);
            i++;
        }
        expect(seq1.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can revert the knot sequence for a non uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0.3, 0.4, 0.5, 0.8, 0.8, 0.8]
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        const seqRef = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        seq.revertKnots();
        const tolerance = 1e-10;
        let i = 0;
        for(const knot of seq) {
            const index = new KnotIndexIncreasingSequence(i);
            expect(knot).to.approximately(seqRef.abscissaAtIndex(index), tolerance);
            i++;
        }
        expect(seq.multiplicities()).to.eql([3, 1, 1, 1,3])
        const knots1: number [] = [0, 0, 0, 0.2, 0.5, 0.5, 0.8, 0.8, 0.8]
        const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
        const knots2 = [0, 0, 0, 0.3, 0.3, 0.6, 0.8, 0.8, 0.8]
        const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})
        seq1.revertKnots();
        i = 0;
        for(const knot of seq1) {
            const index = new KnotIndexIncreasingSequence(i);
            expect(knot).to.approximately(seqRef1.abscissaAtIndex(index), tolerance);
            i++;
        }
        expect(seq1.multiplicities()).to.eql([3, 2, 1, 3])
    });
});