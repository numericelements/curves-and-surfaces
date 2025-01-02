import { expect } from 'chai';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from '../../src/newBsplines/KnotSequenceConstructorInterface';
import { fromIncreasingOpentoIncreasingPeriodicKnotSequence, fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC, fromInputParametersToIncreasingOpenKnotSequenceCC, fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC, fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC, fromStrictlyIncreasingToIncreasingKnotSequenceCC, fromStrictlyIncreasingtToIncreasingKnotSequenceOC } from '../../src/newBsplines/KnotSequenceConversionAndUtilities';
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from '../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve';
import { TOL_KNOT_COINCIDENCE } from '../../src/newBsplines/AbstractBSplineR1toR2';
import { NormalizedBasisAtSequenceEnd } from '../../src/newBsplines/AbstractOpenKnotSequence';
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from '../../src/newBsplines/Knot';
import { IncreasingOpenKnotSequenceClosedCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve';
import { EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION, EM_MAXMULTIPLICITY_ORDER_KNOT } from '../../src/ErrorMessages/KnotSequences';
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve';
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from '../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve';
import { IncreasingPeriodicKnotSequenceClosedCurve } from '../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve';

describe('Conversions between knot sequences classes', () => {

    describe('Conversions from an increasing open knot sequence of an open curve to strictly increasing open knot sequence of open curve', () => {

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

        it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const curveDegree = 2;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });

        it('can convert an increasing sequence with knot multiplicities up to C0 discontinuity to a strictly increasing knot sequence.', () => {
            const maxMultiplicityOrder = 4
            const knots = [-3, -2, -1, 0, 1, 1, 2, 3, 4, 5]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
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

    describe('Conversion from an increasing open knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', () => {

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of strictIncreasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([0, 1])
            expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder])
        });
    
        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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

        it('can convert the increasing uniform knot sequence to a strictly increasing knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const seqStrictly = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            const sequence: number[] = []
            for(const knot of seqStrictly) {
                if(knot !== undefined) sequence.push(knot.abscissa)
            }
            expect(sequence).to.eql(knots)
        });

        it('can convert the increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
            const maxMultiplicityOrder = 4
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            const seqStrictly1 = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq1);
            expect(seqStrictly1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
            const sequence1: number[] = []
            for(const knot of seqStrictly1) {
                if(knot !== undefined) sequence1.push(knot.abscissa)
            }
            expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
        });

        it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const curveDegree = 2;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of strictIncreasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([0, 1])
            expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder])
        });
    
        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
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

        it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
            const curveDegree = 2;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        });
    });

    describe('Conversions from an increasing open knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', () => {

        it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.length()).to.eql(seq.periodicKnots.length)
            expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
        });

        it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.length()).to.eql(seq.periodicKnots.length)
            expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
        });
    
        it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.length()).to.eql(seq.periodicKnots.length)
            expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
        });

        it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.length()).to.eql(seq.periodicKnots.length)
            expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
        });

        it('cannot convert the knot sequence to a periodic knot sequence if containing extreme knots with multiplicity maxMultiplicity with type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 7]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(() => fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq)).to.throw(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION)
        });

        it('cannot convert the knot sequence to a periodic knot sequence if it contains a knot with multiplicity maxMultiplicity with type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 3, 3, 4, 5, 6, 7, 8, 9]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(() => fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq)).to.throw(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION)
        });

        it('preserves the uniform knot spacing of the knot sequence when converting to a periodic knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.isKnotSpacingUniform).to.eql(true)
        });

        it('preserves the uniform knot multiplicity of the knot sequence when converting to a periodic knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.isKnotMultiplicityUniform).to.eql(true)
        });

        it('cannot propagate the non uniform knot multiplicity of a knot sequence to a periodic knot sequence. Initial knot sequence cannot have non uniform multiplicity property with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
            expect(pSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });
    });

    describe('Conversions from a strictly increasing knot sequence of an open curve to an increasing open knot sequence of an open curve', () => {

        it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of non uniform knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 1]
            const multiplicities = [4, 4]
            const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const knotAbscissae: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    knotAbscissae.push(knot)
                }
            }
            const abscissaeInit: number[] = []
            for(const knot of strSeq) {
                if(knot !== undefined) {
                    for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
                }
            }
            expect(knotAbscissae).to.eql(abscissaeInit)
        });

        it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [1, 1, 2, 1, 1, 2, 4]
            const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const knotAbscissae: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    knotAbscissae.push(knot)
                }
            }
            const abscissaeInit: number[] = []
            for(const knot of strSeq) {
                if(knot !== undefined) {
                    for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
                }
            }
            expect(knotAbscissae).to.eql(abscissaeInit)
        });

        it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [1, 1, 2, 1, 1, 2, 4]
            const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(strSeq.isSequenceUpToC0Discontinuity).to.eql(true)
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
            const knotAbscissae: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    knotAbscissae.push(knot)
                }
            }
            const abscissaeInit: number[] = []
            for(const knot of strSeq) {
                if(knot !== undefined) {
                    for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
                }
            }
            expect(knotAbscissae).to.eql(abscissaeInit)
        });

        it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [1, 1, 2, 1, 1, 2, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [1, 1, 2, 1, 1, 2, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 1]
            const multiplicities = [4, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const curveDegree = 2;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });
    });

    describe('Conversions from a strictly increasing knot sequence of a closed curve to an increasing open knot sequence of a closed curve', () => {

        it('can convert a strictly increasing sequence to an increasing knot sequence. Case of non uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots: number [] = [0, 1]
            const multiplicities: number [] = [4, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissae.push(knot)
                }
            }
            const referenceAbscissae: number[] = []
            for(let i = 0; i < knots.length; i++) {
                for(let j = 0; j < multiplicities[i]; j++) {
                    referenceAbscissae.push(knots[i])
                }
            }
            expect(abscissae).to.eql(referenceAbscissae)
            expect(increasingSeq.multiplicities()).to.eql(multiplicities)
        });

        it('can convert a strictly increasing sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
            const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            const abscissae: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissae.push(knot)
                }
            }
            const referenceAbscissae: number[] = []
            for(let i = 0; i < knots.length; i++) {
                for(let j = 0; j < multiplicities[i]; j++) {
                    referenceAbscissae.push(knots[i])
                }
            }
            expect(abscissae).to.eql(referenceAbscissae)
            expect(increasingSeq.multiplicities()).to.eql(multiplicities)
        });

        it('can convert a strictly increasing uniform knot sequence to an increasing knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.multiplicities()).to.eql(multiplicities)
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            const sequence: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) sequence.push(knot)
            }
            expect(sequence).to.eql(knots)
        });

        it('can convert a strictly increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to an increasing knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
            const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
            const maxMultiplicityOrder = 4
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq1);
            expect(increasingSeq.multiplicities()).to.eql(multiplicities1)
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            const sequence1: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) sequence1.push(knot)
            }
            const referenceAbscissae: number[] = []
            for(let i = 0; i < knots1.length; i++) {
                for(let j = 0; j < multiplicities1[i]; j++) {
                    referenceAbscissae.push(knots1[i])
                }
            }
            expect(sequence1).to.eql(referenceAbscissae)
        });

        it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
            const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
            const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 1]
            const multiplicities = [4, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const curveDegree = 2;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });
    });

    describe('Conversions from an increasing periodic knot sequence of a closed curve to an increasing open knot sequence of a closed curve', () => {
       
        it('can convert a periodic increasing sequence to an open increasing knot sequence. Case of uniform knot sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
            expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(strictIncSeq.allAbscissae.length).to.eql(periodicKnots.length + 2 * maxMultiplicityOrder)
            expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6])
            expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        });
    
        it('can convert a non uniform periodic increasing sequence with multiplicity order of maxMultiplicityOrder at its boundary to an open increasing knot sequence', () => {
            const periodicKnots = [0, 0, 1, 2, 3, 4, 4];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
            expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(strictIncSeq.allAbscissae.length).to.eql(9)
            expect(strictIncSeq.allAbscissae).to.eql([-1, 0, 0, 1, 2, 3, 4, 4, 5])
            expect(strictIncSeq.multiplicities()).to.eql([1, 2, 1, 1, 1, 2, 1])
        });

        it('can convert a non uniform periodic increasing sequence with maximal multiplicities inside its interval to an open increasing knot sequence', () => {
            const periodicKnots = [0, 1, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
            expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(strictIncSeq.allAbscissae.length).to.eql(11)
            expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 6])
            expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 2, 1, 1, 1, 1, 2])
    
            const periodicKnots1 = [0, 1, 2, 2, 3, 4, 5];
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1});
            const strictIncSeq1 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq1)
            expect(strictIncSeq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq1.allAbscissae.length).to.eql(11)
            expect(strictIncSeq1.allAbscissae).to.eql([-2, -1, 0, 1, 2, 2, 3, 4, 5, 6, 7])
            expect(strictIncSeq1.multiplicities()).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1, 1])
    
            const periodicKnots2 = [0, 1, 2, 3, 3, 4, 5];
            const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2});
            const strictIncSeq2 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq2)
            expect(strictIncSeq2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq2.allAbscissae.length).to.eql(11)
            expect(strictIncSeq2.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7])
            expect(strictIncSeq2.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1])
    
            const periodicKnots3 = [0, 1, 2, 3, 4, 4, 5];
            const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots3});
            const strictIncSeq3 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq3)
            expect(strictIncSeq3.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
            expect(strictIncSeq3.allAbscissae.length).to.eql(11)
            expect(strictIncSeq3.allAbscissae).to.eql([-1, -1, 0, 1, 2, 3, 4, 4, 5, 6, 7])
            expect(strictIncSeq3.multiplicities()).to.eql([2, 1, 1, 1, 1, 2, 1, 1, 1])
        });
    });


    describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', () => {
        it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
            expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(strIncSeq.distinctAbscissae().length).to.eql(periodicKnots.length + 2 * (maxMultiplicityOrder - 1))
            expect(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
            expect(strIncSeq.multiplicities().length).to.eql(multiplicities.length + 2 * (maxMultiplicityOrder - 1))
            expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        });

        it('can check that the status of the strictly increasing open knot sequence cannot describe C0 discontinuity', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        });

        it('can check the preservation of the knot spacing property', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(true)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.isKnotSpacingUniform).to.eql(true)
        });

        it('can check the preservation of the knot multiplicity uniformity property', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.isKnotMultiplicityUniform).to.eql(true)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.isKnotMultiplicityUniform).to.eql(true)
        });

        it('can check the preservation of the knot multiplicity non uniformity property', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.isKnotMultiplicityNonUniform).to.eql(false)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence with non uniform knot spacing', () => {
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

        it('can check the preservation of non uniform spacing property when converting a strictly increasing sequence to a strictly increasing open knot sequence of closed curve', () => {
            const maxMultiplicityOrder = 4
            const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1]
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(false)
            const strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
            expect(strIncSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('can convert a strictly increasing periodic sequence to a strictly increasing open knot sequence of closed curve. Case of non uniform knot sequence', () => {
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

    describe('Conversions from an increasing periodic knot sequence of a closed curve to a strictly increasing periodic knot sequence of a closed curve', () => {

        it('can convert an increasing uniform periodic knot sequence to a strictly increasing periodic knot sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqStrictly = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
            expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1])
            const sequence: number[] = []
            for(const knot of seqStrictly) {
                if(knot !== undefined) sequence.push(knot.abscissa)
            }
            expect(sequence).to.eql(periodicKnots)
        });

        it('can convert the increasing periodic knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing periodic knot sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1]
            const maxMultiplicityOrder = 3
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqStrictly1 = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq1);
            expect(seqStrictly1.multiplicities()).to.eql([2, 1, 1, 1, 1, 1, 1, 2])
            const sequence1: number[] = []
            for(const knot of seqStrictly1) {
                if(knot !== undefined) sequence1.push(knot.abscissa)
            }
            expect(sequence1).to.eql([0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1])
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0, 0, 1, 1, 1]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const maxMultiplicityOrder = 2
            const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });

    });


    describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', () => {

        it('can convert a strictly increasing periodic sequence to an increasing periodic knot sequence of closed curve. Case of non uniform knot sequence', () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots: number [] = [0, 1, 2, 3, 4]
            const multiplicities: number [] = [1, 1, 1, 1, 1];
            const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots)
            expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities)
            let multiplicities1 = multiplicities.slice()
            for(let i = 0; i < maxMultiplicityOrder; i++) {
                for(let j = 1; j < multiplicities1.length - 1; j++) {
                    let upperBound = Math.min(j, maxMultiplicityOrder - 1)
                    if(j === multiplicities1.length - 2) upperBound = Math.min(j, maxMultiplicityOrder)
                    for(let k = 0; k < upperBound; k++) {
                        const strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1});
                        expect(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots)
                        expect(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1)
                        const incSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncPeriodicSeq1);
                        let cumulativeMultiplicity = 0
                        for(let indexStrInc = 0; indexStrInc < periodicKnots.length; indexStrInc++) {
                            for(let knot = 0; knot < multiplicities1[indexStrInc]; knot++) {
                                if(indexStrInc < periodicKnots.length - 1) {
                                    expect(incSeq.abscissaAtIndex(new KnotIndexIncreasingSequence(cumulativeMultiplicity + knot))).to.be.closeTo((periodicKnots[indexStrInc]), TOL_KNOT_COINCIDENCE)
                                } else {
                                    expect(incSeq.getPeriod()).to.be.closeTo((periodicKnots[indexStrInc]), TOL_KNOT_COINCIDENCE)
                                }
                            }
                            let multiplicity = incSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence(indexStrInc)))
                            expect(multiplicity).to.eql(multiplicities1[indexStrInc])
                            cumulativeMultiplicity += multiplicity
                        }
                        multiplicities1[j]++
                    }
                }
                multiplicities1 = multiplicities.slice()
                multiplicities1[0] = i + 2
                multiplicities1[multiplicities1.length - 1] = i + 2
            }
        });

        it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [2, 1, 1, 2, 2]
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
        });

        it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 1]
            const multiplicities = [3, 3]
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
            const maxMultiplicityOrder = 2
            const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
            expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
        });
    });

    describe('Generation of open knot sequences of a closed curve from input parameters describing the periodic knots of the sequence', () => {

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

        describe('Generation of a strictly increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', () => {

            it('Can create a strictly increasing open knot sequence of closed curve from input parameters. Case of uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 4
                const periodicKnots = [0, 1, 2, 3, 4, 5]
                const multiplicities = [1, 1, 1, 1, 1, 1]
                const strIncSeq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
                expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8])
                expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            });

            it('Can create a strictly increasing open knot sequence of closed curve from input parameters. Case of non uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 4
                const periodicKnots = [0, 1]
                const multiplicities = [4, 4]
                const strIncSeq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
                expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(strIncSeq.distinctAbscissae()).to.eql([0, 1])
                expect(strIncSeq.multiplicities()).to.eql([4, 4])
            });

            it('Cannot create an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 4
                const periodicKnots = [0, 0.5, 1]
                const multiplicities = [3, 4, 3]
                expect(() => fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('generates an increasing knot sequence without C0 discontinuity property', () => {
                const maxMultiplicityOrder = 3
                const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities = [2, 1, 1, 2, 2]
                const seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            });

            it('generates an increasing knot sequence considering property about uniform knot spacing.', () => {
                const maxMultiplicityOrder = 3
                const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities = [2, 1, 1, 2, 2]
                const seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(false)
            });
    
            it('generates an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', () => {
                const maxMultiplicityOrder = 3
                const periodicKnots = [0, 1]
                const multiplicities = [3, 3]
                const seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
    
            it('generates an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', () => {
                const maxMultiplicityOrder = 2
                const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
                const multiplicities = [1, 1, 1, 1, 1, 1, 1]
                const seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
            });
        });
    });
});