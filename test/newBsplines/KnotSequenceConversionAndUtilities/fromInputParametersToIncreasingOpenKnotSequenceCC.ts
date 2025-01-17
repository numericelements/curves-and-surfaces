import { expect } from 'chai';
import { fromInputParametersToIncreasingOpenKnotSequenceCC } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromInputParametersToIncreasingOpenKnotSequenceCC';
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE } from '../../../src/newBsplines/KnotSequenceConstructorInterface';
import { EM_MAXMULTIPLICITY_ORDER_KNOT } from '../../../src/ErrorMessages/KnotSequences';

describe('Generation of an increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', () => {

    it('Can create an increasing open knot sequence of closed curves from input parameters. Case of uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const increasingSeq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots});
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(increasingSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
        expect(increasingSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('Can create an increasing open knot sequence of closed curves from input parameters. Case of non uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 0, 0, 0, 1, 1, 1, 1]
        const increasingSeq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots});
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(increasingSeq.distinctAbscissae()).to.eql([0, 1])
        expect(increasingSeq.multiplicities()).to.eql([4, 4])
    });

    it('Cannot create an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1]
        expect(() => fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
    });

    it('generates an increasing knot sequence without C0 discontinuity property', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
        const seq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('generates an increasing knot sequence considering property about uniform knot spacing.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
        const seq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.isKnotSpacingUniform).to.eql(false)
    });

    it('generates an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0, 0, 1, 1, 1]
        const seq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('generates an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', () => {
        const maxMultiplicityOrder = 2
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
        const seq = fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
    });
});
