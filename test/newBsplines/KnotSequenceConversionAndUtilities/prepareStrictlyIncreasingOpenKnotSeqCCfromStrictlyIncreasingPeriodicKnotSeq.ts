import { expect } from 'chai';
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from '../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve';
import { prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq } from '../../../src/newBsplines/KnotSequenceAndUtilities/prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq';
import { STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from '../../../src/newBsplines/KnotSequenceConstructorInterface';
import { KNOT_COINCIDENCE_TOLERANCE, NormalizedBasisAtSequenceExtremity } from '../../../src/namedConstants/KnotSequences';
import { KnotIndexStrictlyIncreasingSequence } from '../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence';
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from '../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve';

describe('Preparation of parameters of a strictly increasing open knot sequence of a closed curve from a strictly increasing periodic knot sequence of a closed curve', () => {
    it('can get parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence. Case of uniform knot sequence', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
        expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
        expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
        const strIncSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        expect(strIncSeq.knots.length).to.eql(periodicKnots.length + 2 * (maxMultiplicityOrder - 1))
        expect(strIncSeq.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
        expect(strIncSeq.multiplicities.length).to.eql(multiplicities.length + 2 * (maxMultiplicityOrder - 1))
        expect(strIncSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can check that the parameters of the strictly increasing open knot sequence cannot describe a C0 discontinuity', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
        expect(strIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('can check the preservation of the knot spacing property', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(true)
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
        expect(strIncSeq.isKnotSpacingUniform).to.eql(true)
    });

    it('can check the preservation of the knot multiplicity uniformity property', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.isKnotMultiplicityUniform).to.eql(true)
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
        expect(strIncSeq.isKnotMultiplicityUniform).to.eql(true)
    });

    it('can check the preservation of the knot multiplicity non uniformity property', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.isKnotMultiplicityNonUniform).to.eql(false)
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
        expect(strIncSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('can get the parameters of a strictly increasing sequence of closed curve from a strictly increasing periodic knot sequence. Case of uniform knot sequence with non uniform knot spacing', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
        expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
        expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        // expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const allKnots = [-3.8, -2.9, -1.7, 0, 0.5, 1.2, 2.1, 3.3, 5, 5.5, 6.2, 7.1]
        expect(paramStrIncOKnotSeq.knots.length).to.eql(allKnots.length)
        for(let i = 0; i < paramStrIncOKnotSeq.knots.length; i++) {
            expect(paramStrIncOKnotSeq.knots[i]).to.be.closeTo(allKnots[i], KNOT_COINCIDENCE_TOLERANCE)
        }
        expect(paramStrIncOKnotSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can check the preservation of non uniform spacing property when obtaining the parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence ', () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
        expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(false)
        const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
        expect(strIncSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('can get the parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence. Case of non uniform knot sequence', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots: number [] = [0, 1, 2, 3, 4]
        const multiplicities: number [] = [1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
        expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
        expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
        let multiplicities1 = multiplicities.slice()
        for(let i = 0; i < maxMultiplicityOrder - 1; i++) {
            for(let j = 1; j < multiplicities1.length - 1; j++) {
                let upperBound = Math.min(j, maxMultiplicityOrder - 2)
                if(j === multiplicities1.length - 2) upperBound = Math.min(j, maxMultiplicityOrder - 1)
                for(let k = 0; k < upperBound; k++) {
                    const strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1});
                    expect(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots)
                    expect(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1)
                    const paramStrIncOKnotSeq = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq1);
                    const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities});
                    const boundsNormalizedBasis = strIncSeq.getKnotIndicesBoundingNormalizedBasis()
                    expect(boundsNormalizedBasis.start.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
                    expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.start.knot)).to.eql(periodicKnots[0])
                    expect(boundsNormalizedBasis.end.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
                    expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.end.knot)).to.eql(periodicKnots[periodicKnots.length - 1])
                    const knotOrigin = boundsNormalizedBasis.start.knot.knotIndex
                    for(let knot = 0; knot < knotOrigin; knot++) {
                        expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo((periodicKnots[periodicKnots.length - knotOrigin - 1 + knot] - periodicKnots[periodicKnots.length - 1]), KNOT_COINCIDENCE_TOLERANCE)
                    }
                    let multiplicity = 0
                    for(let knot = knotOrigin; knot >= 0; knot--) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence(knot)))
                    }
                    expect(multiplicity).to.eql(maxMultiplicityOrder)
                    const knotEnd = boundsNormalizedBasis.end.knot.knotIndex
                    for(let knot = knotEnd + 1; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        const refKnot = periodicKnots[knot - knotEnd] - periodicKnots[0] + periodicKnots[periodicKnots.length -1]
                        expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo(refKnot, KNOT_COINCIDENCE_TOLERANCE)
                    }
                    multiplicity = 0
                    for(let knot = knotEnd; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence(knot)))
                    }
                    expect(multiplicity).to.eql(maxMultiplicityOrder)

                    multiplicities1[j]++
                }
            }
            multiplicities1 = multiplicities.slice()
            multiplicities1[0] = i + 2
            multiplicities1[multiplicities1.length - 1] = i + 2
        }
    });
}); 