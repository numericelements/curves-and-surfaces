import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";
import { NO_KNOT_OPEN_CURVE, STRICTLYINCREASINGOPENKNOTSEQUENCE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";

describe('StrictlyIncreasingOpenKnotSequenceOpenCurve', () => {

    it('cannot be initialized with a null knot sequence with STRICTLYINCREASINGOPENKNOTSEQUENCE intializer', () => {
        const maxMultiplicityOrder = 3
        const knots: number [] = []
        const multiplicities: number[] = [1]
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
    });

    it('cannot be initialized with a null length array of multiplicities with STRICTLYINCREASINGOPENKNOTSEQUENCE intializer', () => {
        const maxMultiplicityOrder = 3
        const knots: number [] = [0, 0, 0, 1, 2, 2, 2]
        const multiplicities: number[] = []
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
    });

    it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities with STRICTLYINCREASINGOPENKNOTSEQUENCE', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2]
        const maxMultiplicityOrder = 4;
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
    });

    it('cannot be initialized with a knot multiplicity smaller than one using STRICTLYINCREASINGOPENKNOTSEQUENCE', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [3, 1, 1, 2, 3]
        const maxMultiplicityOrder = 3;
        for(let i = 0; i < knots.length; i++) {
            const multiplicity = multiplicities[i];
            multiplicities[i] = 0;
            expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
            multiplicities[i] = multiplicity;
        }
    });

    it('cannot be initialized if the knot sequence is not strictly increasing using STRICTLYINCREASINGOPENKNOTSEQUENCE', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [3, 1, 1, 2, 3]
        const maxMultiplicityOrder = 3;
        for(let i = 1; i < knots.length; i++) {
            const knot = knots[i];
            knots[i] = knots[i - 1];
            expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
            knots[i] = knot;
        }
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type STRICTLYINCREASINGOPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 0
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [3, 1, 1, 2, 3]
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type NO_KNOT_OPEN_CURVE', () => {
        const maxMultiplicityOrder = 0
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})).to.throw()
    });

    it('can initialize a knot sequence with a maximal multiplicity order of one for a constructor type NO_KNOT_OPEN_CURVE', () => {
        const maxMultiplicityOrder = 1
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        expect(seq.allAbscissae).to.eql([0, 1])
        expect(seq.multiplicities()).to.eql([1, 1])
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.uMax).to.eql(1)
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('can initialize a knot sequence with a maximal multiplicity order greater than one as a non uniform B-spline with NO_KNOT_OPEN_CURVE', () => {
        const maxMultiplicityOrder = 2
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
        expect(seq.allAbscissae).to.eql([0, 1])
        expect(seq.multiplicities()).to.eql([2, 2])
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.uMax).to.eql(1)
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type UNIFORM_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 1
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: 2})).to.throw()
    });

    it('can initialize a knot sequence with a maximal multiplicity order of two for a constructor type UNIFORM_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 2
        const BsplBasisSize = 2
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
        expect(seq.allAbscissae).to.eql([-1, 0, 1, 2])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1])
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        expect(seq.uMax).to.eql(1)
        expect(seq.indexKnotOrigin.knotIndex).to.eql(1)
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order of two if the size of the B-spline basis is lower than maxMultiplicityOrder using UNIFORM_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 2
        const BsplBasisSize = maxMultiplicityOrder - 1
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw()

    });

    it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 1
        const BsplBasisSize = 2
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw()
    });

    it('cannot initialize a knot sequence with a maximal multiplicity order of two if the size of the B-spline basis is lower than maxMultiplicityOrder using UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
        const maxMultiplicityOrder = 2
        const BsplBasisSize = maxMultiplicityOrder - 1
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw()
    });

    it('can initialize a knot sequence with a maximal multiplicity order greater than two that can define a Bézier curve for a constructor type UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 3
        const BsplBasisSize = 3
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
        const knots = [0, 1]
        expect(seq.allAbscissae).to.eql(knots)
        expect(seq.multiplicities()).to.eql([3, 3])
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.uMax).to.eql(knots[knots.length - 1])
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('can initialize a knot sequence with a maximal multiplicity order greater than two that can define a B-Spline for a constructor type UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE', () => {
        const maxMultiplicityOrder = 3
        const BsplBasisSize = 5
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
        const knots = [0, 1, 2, 3]
        expect(seq.allAbscissae).to.eql(knots)
        expect(seq.multiplicities()).to.eql([3, 1, 1, 3])
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.uMax).to.eql(knots[knots.length - 1])
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('cannot initialize a non uniform knot sequence with STRICTLYINCREASINGOPENKNOTSEQUENCE initializer if the first knot is not zero ', () => {
        const knots: number [] = [0.1, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw()
    });

    it('can be initialized as a description of a non-uniform B-spline with STRICTLYINCREASINGOPENKNOTSEQUENCE initializer', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.distinctAbscissae()).to.eql([0.0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
    });

    it('can get the description of a non-uniform B-spline with STRICTLYINCREASINGOPENKNOTSEQUENCE initializer', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        expect(seq.uMax).to.eql(1)
        expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('can be initialized as a description of a uniform B-spline with STRICTLYINCREASINGOPENKNOTSEQUENCE initializer', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [1, 1, 1, 1, 1]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.distinctAbscissae()).to.eql([0.0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1])
    });

    it('can get the description of a uniform B-spline with STRICTLYINCREASINGOPENKNOTSEQUENCE initializer', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [1, 1, 1, 1, 1]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.isKnotSpacingUniform).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        // expect(seq.uMax).to.eql(1)
        // expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
    });

    it('can get the length of a knot sequence', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [1, 1, 1, 1, 1]
        let maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.length()).to.eql(5)
        const knots1: number [] = [0.0, 1]
        const multiplicities1: number[] = [3, 3]
        maxMultiplicityOrder = 3;
        const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1});
        expect(seq1.length()).to.eql(2)
    });

    it('can convert knot sequence to an increasing knot sequence of open curve', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        const seqIncreasing = seq.toIncreasingKnotSequence();
        const abscissae: number[] = []
        for(const knot of seqIncreasing) {
            if(knot !== undefined) abscissae.push(knot)
        }
        expect(abscissae).to.eql([0.0, 0.0, 0.0, 0.0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });

    it('can insert a knot into knot sequence', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
        expect(seq.insertKnot(0.2, 2)).to.eql(true)
        expect(seq.distinctAbscissae()).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities()).to.eql([4, 2, 1, 1, 2, 4])
    });

    it('can check if the knot multiplicity of a knot is zero', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotlMultiplicityZero(0)).to.eql(false)
        expect(seq.isKnotlMultiplicityZero(0.2)).to.eql(true)
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
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

    it('can get the knot multiplicity from a sequence index', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        let index = new KnotIndexStrictlyIncreasingSequence();
        let multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(4);
        index = new KnotIndexStrictlyIncreasingSequence(1);
        multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(1);
        index = new KnotIndexStrictlyIncreasingSequence(3);
        multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(2);
    });

    it('can get the knot abscissa from a knot index of the strictly increasing sequence', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        for(let i = 0; i < seq.length(); i++) {
            const index = new KnotIndexStrictlyIncreasingSequence(i);
            const abscissa = seq.abscissaAtIndex(index);
            expect(abscissa).to.eql(knots[i]);
        }
    });
});