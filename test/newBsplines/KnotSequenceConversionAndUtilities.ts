import { expect } from 'chai';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from '../../src/newBsplines/KnotSequenceConstructorInterface';
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC, fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC } from '../../src/newBsplines/KnotSequenceConversionAndUtilities';
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from '../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve';
import { TOL_KNOT_COINCIDENCE } from '../../src/newBsplines/AbstractBSplineR1toR2';
import { NormalizedBasisAtSequenceEnd } from '../../src/newBsplines/AbstractOpenKnotSequence';
import { KnotIndexStrictlyIncreasingSequence } from '../../src/newBsplines/Knot';

describe('Conversions between knot sequences classes', () => {

    describe('Conversions from an increasing open knot sequence of an open curve to other knot sequences', () => {

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
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

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
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

        it('can convert an increasing sequence with knot multiplicities up to C0 discontinuity to a strictly increasing knot sequence.', () => {
            const maxMultiplicityOrder = 4
            const knots = [-3, -2, -1, 0, 1, 1, 2, 3, 4, 5]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5])
            expect(multiplicity).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1])
        });
    });

    describe('Conversions from an strictly increasing periodic knot sequence to other knot sequences', () => {
        it('can convert an strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
            expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
            expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        });

        it('can convert an strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence with non uniform knot spacing', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
            expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const allKnots = [-3.8, -2.9, -1.7, 0, 0.5, 1.2, 2.1, 3.3, 5, 5.5, 6.2, 7.1]
            expect(strIncSeq.distinctAbscissae().length).to.eql(allKnots.length)
            for(let i = 0; i < strIncSeq.distinctAbscissae().length; i++) {
                expect(strIncSeq.distinctAbscissae()[i]).to.be.closeTo(allKnots[i], TOL_KNOT_COINCIDENCE)
            }
            expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        });

        it('can convert an strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of non uniform knot sequence', () => {
            const maxMultiplicityOrder = 4;
            const periodicKnots: number [] = [0, 1, 2, 3, 4]
            const multiplicities: number [] = [1, 1, 1, 1, 1];
            // const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            // const multiplicities: number [] = [1, 1, 1, 1, 1, 1];
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
                        const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq1);
                        const boundsNormalizedBasis = strIncSeq.getKnotIndicesBoundingNormalizedBasis()
                        expect(boundsNormalizedBasis.start.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
                        expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.start.knot)).to.eql(periodicKnots[0])
                        expect(boundsNormalizedBasis.end.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
                        expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.end.knot)).to.eql(periodicKnots[periodicKnots.length - 1])
                        const knotOrigin = boundsNormalizedBasis.start.knot.knotIndex
                        for(let knot = 0; knot < knotOrigin; knot++) {
                            expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo((periodicKnots[periodicKnots.length - knotOrigin - 1 + knot] - periodicKnots[periodicKnots.length - 1]), TOL_KNOT_COINCIDENCE)
                        }
                        let multiplicity = 0
                        for(let knot = knotOrigin; knot >= 0; knot--) {
                            multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence(knot)))
                        }
                        expect(multiplicity).to.eql(maxMultiplicityOrder)
                        const knotEnd = boundsNormalizedBasis.end.knot.knotIndex
                        for(let knot = knotEnd + 1; knot < strIncSeq.distinctAbscissae().length; knot++) {
                            const refKnot = periodicKnots[knot - knotEnd] - periodicKnots[0] + periodicKnots[periodicKnots.length -1]
                            expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo(refKnot, TOL_KNOT_COINCIDENCE)
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

    it('Can create a strictly increasing open knot sequence of closed curve from input parameters of type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4
        const periodicKnots = [0, 1, 2, 3, 4, 5]
        const multiplicities = [1, 1, 1, 1, 1, 1]
        const increasingSeq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(increasingSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
        expect(increasingSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    });
});