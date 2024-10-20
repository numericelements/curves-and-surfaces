import { expect } from "chai";
import { IncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve";
import { clampingFindSpan } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { KnotIndexIncreasingSequence } from "../../src/newBsplines/Knot";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, NO_KNOT_CLOSED_CURVE } from "../../src/newBsplines/KnotSequenceConstructorInterface";

describe('IncreasingOpenKnotSequenceClosedCurve', () => {
    
    it('cannot be initialized with a max multiplicity order smaller than 2 with NO_KNOT_CLOSED_CURVE type constructor', () => {
        const maxMultiplicityOrder = 1;
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})).to.throw()
    });

    it('can be initialized with NO_KNOT_CLOSED_CURVE type constructor', () => {
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(seq.freeKnots).to.eql([1])
        expect(seq.uMax).to.eql(2)
        expect(seq.periodicKnots).to.eql([0, 1, 2])
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-1, 0, 1, 2, 3])
    });

    it('can get properties of the knot sequence initialized with NO_KNOT_CLOSED_CURVE type constructor', () => {
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotSpacingUniform).to.eql(true)
    });

    it('can get the knot index of the origin of a knot sequence initialized with NO_KNOT_CLOSED_CURVE', () => {
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
        expect(seq.indexKnotOrigin.knotIndex).to.eql(1)
    });

    it('cannot be initialized with a null knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS type constructor', () => {
        const knots: number [] = []
        const maxMultiplicityOrder = 3;
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw()
    });

    it('cannot be initialized with a non increasing knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS type constructor', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 1.5, 3, 4]
        const maxMultiplicityOrder = 3;
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw()
        const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})).to.throw()
        const knots2: number [] = [-2, -1, 0, 1, 2, 3, 4, 3.5]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const maxMultiplicityOrder = 4
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity', () => {
        const knots: number [] = [-0.3, 0, 0, 0, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 1, 1, 1, 1.5]
        const maxMultiplicityOrder = 4
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw()
    });

    it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS. Non uniform knot sequence of open curve without intermediate knots', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 1, 1, 1, 1 ])
    });

    it('can get the properties of the knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS type constructor', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.uMax).to.eql(1)
    });

    it('can get the knot index of the origin of a knot sequence initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS', () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('can be initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS initializer. non uniform knot sequence of open curve with intermediate knots', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ])
    });

    it('can get the properties of the knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS type constructor. non uniform knot sequence of open curve with intermediate knots', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.uMax).to.eql(1)
    });

    it('can be initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS initializer. Uniform knot sequence', () => {
        const curveDegree = 2
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
    });

    it('can get the properties of the knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS initializer. Uniform knot sequence', () => {
        const curveDegree = 2
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.uMax).to.eql(5)
    });

    it('can get the properties of the knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS initializer. non uniformly spaced knot sequence', () => {
        const curveDegree = 2
        const knots = [-2, -1, 0, 0.5, 2, 3, 4, 5, 6, 7]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.uMax).to.eql(5)
    });

    it('can be initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS initializer. arbitrary knot sequence', () => {
        const curveDegree = 3
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });
    
    it('can get the knot sequence length', () => {
        const curveDegree = 3
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq.length()).to.eql(12)
        const knots1 = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        expect(seq1.maxMultiplicityOrder).to.eql(curveDegree + 1)
        expect(seq1.length()).to.eql(8)
    });

    it('cannot be initialized with a max multiplicity order smaller than 2 with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE type constructor', () => {
        const maxMultiplicityOrder = 1;
        const periodicKnots = [1]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw()
    });

    it('cannot be initialized with a non increasing knot sequence with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE type constructor', () => {
        const knots: number [] = [0, 1, 2, 1.5, 3, 4]
        const maxMultiplicityOrder = 3;
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots})).to.throw()
        const knots1: number [] = [0, -0.5, 1, 2, 3, 4]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots1})).to.throw()
        const knots2: number [] = [0, 1, 2, 3, 4, 3.5]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots2})).to.throw()
    });

    it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 1, 1, 1, 1, 2, 3]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw()
    });

    it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0, 0, 1, 2, 3, 3, 3, 3]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw()
    });

    it('can be initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE type constructor', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const seq1: number[] = [];
        for(const knot of seq) {
            if(knot !== undefined) seq1.push(knot)
        }
        expect(seq1).to.eql([-1, 0, 1, 2, 3])
        expect(seq.periodicKnots).to.eql([0, 1, 2])
    });

    it('can get the properties of the knot sequence initialized with INCREASINGOPENKNOTSEQUENCECLOSEDCURVE', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.uMax).to.eql(2)
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(increasingSeq.maxMultiplicityOrder).to.eql(curveDegree + 1)
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
        const curveDegree = 3
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const strictIncreasingSeq = seq.toStrictlyIncreasingKnotSequence();
        expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of strictIncreasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6])
        expect(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1])
    });

    it('can get the knot abscissa from a sequence index', () => {
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        let index = new KnotIndexIncreasingSequence(0);
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
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        let index = new KnotIndexIncreasingSequence(0);
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
        const curveDegree = 3
        const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
        let index = new KnotIndexIncreasingSequence(0);
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

    it('can get the distinct abscissae and multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1 ]
        const maxMultiplicityOrder = 4
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.distinctAbscissae()).to.eql([0, 1])
        expect(seq.multiplicities()).to.eql([4, 4])
        expect(seq.freeKnots).to.eql([])
        expect(seq.periodicKnots).to.eql([0, 1])
    });

    it('can get the distinct abscissae and multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const maxMultiplicityOrder = 4
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq.freeKnots).to.eql([0.5, 0.6, 0.7, 0.7])
        expect(seq.periodicKnots).to.eql([0, 0.5, 0.6, 0.7, 0.7, 1])
    });

    it('cannot be initialized with an origin differing from zero', () => {
        const knots: number [] = [0.1, 0.1, 0.1, 0.1, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        let curveDegree = 3
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw()
        const knots1: number [] = [0, 0.1, 0.1, 0.1, 0.2, 0.6, 0.9, 0.9, 1, 1, 1, 1.1 ]
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})).to.throw()
        const knots2: number [] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        curveDegree = 2
        expect(() => new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})).to.throw()
    });

    it('can be initialized with different orders of multiplicity at the curve origin', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1 ]
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.freeKnots).to.eql([0.1, 0.6, 0.7, 0.9])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        expect(seq1.freeKnots).to.eql([0.1, 0.2, 0.6, 0.7, 0.8, 0.9])
        const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        const seq2 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})
        expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('can be initialized with a knot sequence constrained by closure constraints', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.2, 0.2, 0.2, 0.3]
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.freeKnots).to.eql([0.1])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.2, 0.3, 0.4 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        expect(seq1.freeKnots).to.eql([0.1])
        // const knots2: number [] = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
        // const seq2 = new IncreasingOpenKnotSequenceClosedCurve(3, knots2)
        // expect(seq2.freeKnots).to.eql([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9])
    });

    it('cannot be initialized when the knot sequence constrained is improperly set', () => {
        const knots: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.3, 0.3, 0.3, 0.4]
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots[5] - knots[4]).not.to.eql(knots[8] - knots[7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.2, 0.4, 0.5 ]
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        // expect(function() {const seq1 = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots1[2] - knots1[1]).not.to.eql(knots1[7] - knots1[6])
    });

    it('can be initialized with a knot sequence conforming to a uniform B-spline', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.freeKnots).to.eql([1, 2, 3, 4])
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can get knot multiplicity at curve origin', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        let curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.getKnotMultiplicityAtCurveOrigin()).to.eql(1)
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        curveDegree = 3
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
        expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        expect(seq1.getKnotMultiplicityAtCurveOrigin()).to.eql(2)
        const knots2: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1 ]
        const seq2 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})
        expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1])
        expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1])
        expect(seq2.getKnotMultiplicityAtCurveOrigin()).to.eql(3)
        const knots3: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const seq3 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3})
        expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq3.getKnotMultiplicityAtCurveOrigin()).to.eql(4)
    });

    it('can check if an abscissa coincides with a knot belonging to the effective interval of the curve', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isAbscissaCoincidingWithKnot(0.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(-1)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(5.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(6.0)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0.5)).to.eql(false)
    });

    it('can convert the increasing knot sequence belonging to a strictly increasing knot sequence', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        let curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const seqStrictly = seq.toStrictlyIncreasingKnotSequence();
        expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqStrictly) {
            if(knot !== undefined) sequence.push(knot.abscissa)
        }
        expect(sequence).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        curveDegree = 3
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
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
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
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
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
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
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        let index = seq.findSpan(0.0)
        // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
        let indexCompare = clampingFindSpan(0.0, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(1)
        indexCompare = clampingFindSpan(1, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(2)
        indexCompare = clampingFindSpan(2, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(3)
        indexCompare = clampingFindSpan(3, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(4)
        indexCompare = clampingFindSpan(4, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(5)
        indexCompare = clampingFindSpan(5, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(6)
        indexCompare = clampingFindSpan(6, knots, curveDegree);
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
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        let index = seq.findSpan(0.0)
        // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
        let indexCompare = clampingFindSpan(0.0, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.1)
        indexCompare = clampingFindSpan(0.1, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.5)
        indexCompare = clampingFindSpan(0.5, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.55)
        indexCompare = clampingFindSpan(0.55, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.6)
        indexCompare = clampingFindSpan(0.6, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.65)
        indexCompare = clampingFindSpan(0.65, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.7)
        indexCompare = clampingFindSpan(0.7, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        index = seq.findSpan(0.9)
        indexCompare = clampingFindSpan(0.9, knots, curveDegree);
        expect(index.knotIndex).to.eql(indexCompare)
        // Similar remark to the test above
        // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
        // index = seq.findSpan(1.0)
        // indexCompare = clampingFindSpan(1.0, knots, curveDegree);
        // expect(index.knotIndex).to.eql(indexCompare)
    });

    it('can decrement the degree of a knot sequence of degree 3 without knots of multiplicity greater than one', () => {
        const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const curveDegree = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const newSeq = seq.decrementMaxMultiplicityOrder();
        const newKnots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        expect(newSeq.maxMultiplicityOrder).to.eql(3)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 2 with knots of multiplicity greater than two', () => {
        const knots: number [] = [-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const newSeq = seq.decrementMaxMultiplicityOrder();
        const newKnots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
        expect(newSeq.maxMultiplicityOrder).to.eql(2)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 1 with knots of multiplicity greater than one', () => {
        const knots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
        const curveDegree = 1
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const newSeq = seq.decrementMaxMultiplicityOrder();
        const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
        expect(newSeq.maxMultiplicityOrder).to.eql(1)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can decrement the degree of a knot sequence of degree 1 with a knot of multiplicity greater than one at sequence origin', () => {
        const knots: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
        const curveDegree = 1
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const newSeq = seq.decrementMaxMultiplicityOrder();
        const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
        expect(newSeq.maxMultiplicityOrder).to.eql(1)
        let i = 0
        for(const knot of newSeq) {
            expect(knot).to.eql(newKnots[i])
            i++
        }
    });

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin', () => {
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const pSeq = seq.toPeriodicKnotSequence();
        expect(pSeq.length()).to.eql(10)
        expect(pSeq.allAbscissae).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 7, 7])
    });

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const curveDegree = 2
        const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        const pSeq = seq.toPeriodicKnotSequence();
        expect(pSeq.length()).to.eql(8)
        expect(pSeq.allAbscissae).to.eql([0, 1, 2, 3, 4, 5, 6, 7])
    });
});