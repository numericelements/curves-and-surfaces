import { expect } from 'chai';
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS} from '../../../src/newBsplines/KnotSequenceConstructorInterface';
import { prepareStrictlyIncreasingOpenKnotSequenceCC } from '../../../src/newBsplines/KnotSequenceAndUtilities/prepareStrictlyIncreasingOpenKnotSequenceCC';
import { EM_MAXMULTIPLICITY_ORDER_KNOT } from '../../../src/ErrorMessages/KnotSequences';
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN } from '../../../src/namedConstants/KnotSequences';
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from '../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve';


describe('Generation of the input parameters of a strictly increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', () => {

    it('Can generate the strictly increasing open knot sequence parameters of closed curve from input parameters. Case of uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strIncSeq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strIncSeq.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
        expect(strIncSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(strIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strIncSeq.knots[strIncSeq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
    });

    it('Can generate the parameters of a strictly increasing open knot sequence of closed curve from input parameters. Case of non uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1]
        const multiplicities = [4, 4]
        const strIncSeq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strIncSeq.knots).to.eql([0, 1])
        expect(strIncSeq.multiplicities).to.eql([4, 4])
        expect(strIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strIncSeq.knots[strIncSeq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
    });

    it('Cannot generate the parameters of an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 0.5, 1]
        const multiplicities = [3, 4, 3]
        expect(() => prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
    });

    it('generates the parameters of an increasing knot sequence without C0 discontinuity property', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [2, 1, 1, 2, 2]
        const seq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for(let knot = 0; knot < seq.knots.length; knot++) {
            expect(seq.knots[knot]).to.be.closeTo(knots[knot], KNOT_COINCIDENCE_TOLERANCE)
        }
        expect(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1])
        expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities})
        expect(strSeq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('generates the parameters of an increasing knot sequence considering property about uniform knot spacing.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [2, 1, 1, 2, 2]
        const seq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for(let knot = 0; knot < seq.knots.length; knot++) {
            expect(seq.knots[knot]).to.be.closeTo(knots[knot], KNOT_COINCIDENCE_TOLERANCE)
        }
        expect(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1])
        expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities})
        expect(strSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('generates the parameters of an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 1]
        const multiplicities = [3, 3]
        const seq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
        for(let knot = 0; knot < seq.knots.length; knot++) {
            expect(seq.knots[knot]).to.be.closeTo(periodicKnots[knot], KNOT_COINCIDENCE_TOLERANCE)
        }
        expect(seq.multiplicities).to.eql(multiplicities)
        expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities})
        expect(strSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('generates the parameters of an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', () => {
        const maxMultiplicityOrder = 2
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
        const multiplicities = [1, 1, 1, 1, 1, 1, 1]
        const seq = prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
        const knots = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
        for(let knot = 0; knot < seq.knots.length; knot++) {
            expect(seq.knots[knot]).to.be.closeTo(knots[knot], KNOT_COINCIDENCE_TOLERANCE)
        }
        expect(seq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KNOT_SEQUENCE_ORIGIN)
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities})
        expect(strSeq.isKnotMultiplicityUniform).to.eql(true)
    });
});