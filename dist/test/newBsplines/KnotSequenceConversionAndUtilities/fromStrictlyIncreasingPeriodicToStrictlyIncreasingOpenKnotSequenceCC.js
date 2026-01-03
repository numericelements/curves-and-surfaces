"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
const fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const AbstractBSplineR1toR2_1 = require("../../../src/newBsplines/AbstractBSplineR1toR2");
const KnotSequences_1 = require("../../../src/namedConstants/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', () => {
    it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strIncSeq.distinctAbscissae().length).to.eql(periodicKnots.length + 2 * (maxMultiplicityOrder - 1));
        (0, chai_1.expect)(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        (0, chai_1.expect)(strIncSeq.multiplicities().length).to.eql(multiplicities.length + 2 * (maxMultiplicityOrder - 1));
        (0, chai_1.expect)(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can check that the status of the strictly increasing open knot sequence cannot describe C0 discontinuity', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('can check the preservation of the knot spacing property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(true);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.isKnotSpacingUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity uniformity property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotMultiplicityUniform).to.eql(true);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity non uniformity property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotMultiplicityNonUniform).to.eql(false);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence with non uniform knot spacing', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const allKnots = [-3.8, -2.9, -1.7, 0, 0.5, 1.2, 2.1, 3.3, 5, 5.5, 6.2, 7.1];
        (0, chai_1.expect)(strIncSeq.distinctAbscissae().length).to.eql(allKnots.length);
        for (let i = 0; i < strIncSeq.distinctAbscissae().length; i++) {
            (0, chai_1.expect)(strIncSeq.distinctAbscissae()[i]).to.be.closeTo(allKnots[i], AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
        }
        (0, chai_1.expect)(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of non uniform knot sequence', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1];
        const multiplicities = [maxMultiplicityOrder - 1, maxMultiplicityOrder - 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strIncSeq.distinctAbscissae().length).to.eql(periodicKnots.length + 2);
        (0, chai_1.expect)(strIncSeq.distinctAbscissae()).to.eql([-1, 0, 1, 2]);
        (0, chai_1.expect)(strIncSeq.multiplicities().length).to.eql(multiplicities.length + 2);
        (0, chai_1.expect)(strIncSeq.multiplicities()).to.eql([1, maxMultiplicityOrder - 1, maxMultiplicityOrder - 1, 1]);
    });
    it('can check the preservation of non uniform spacing property when converting a strictly increasing sequence to a strictly increasing open knot sequence of closed curve', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(false);
        const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('can convert a strictly increasing periodic sequence to a strictly increasing open knot sequence of closed curve. Case of non uniform knot sequence', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        let multiplicities1 = multiplicities.slice();
        for (let i = 0; i < maxMultiplicityOrder - 1; i++) {
            for (let j = 1; j < multiplicities1.length - 1; j++) {
                let upperBound = Math.min(j, maxMultiplicityOrder - 2);
                if (j === multiplicities1.length - 2)
                    upperBound = Math.min(j, maxMultiplicityOrder - 1);
                for (let k = 0; k < upperBound; k++) {
                    const strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1 });
                    (0, chai_1.expect)(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots);
                    (0, chai_1.expect)(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1);
                    const strIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictIncPeriodicSeq1);
                    const boundsNormalizedBasis = strIncSeq.getKnotIndicesBoundingNormalizedBasis();
                    (0, chai_1.expect)(boundsNormalizedBasis.start.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    (0, chai_1.expect)(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.start.knot)).to.eql(periodicKnots[0]);
                    (0, chai_1.expect)(boundsNormalizedBasis.end.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    (0, chai_1.expect)(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.end.knot)).to.eql(periodicKnots[periodicKnots.length - 1]);
                    const knotOrigin = boundsNormalizedBasis.start.knot.knotIndex;
                    for (let knot = 0; knot < knotOrigin; knot++) {
                        (0, chai_1.expect)(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo((periodicKnots[periodicKnots.length - knotOrigin - 1 + knot] - periodicKnots[periodicKnots.length - 1]), AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                    }
                    let multiplicity = 0;
                    for (let knot = knotOrigin; knot >= 0; knot--) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot)));
                    }
                    (0, chai_1.expect)(multiplicity).to.eql(maxMultiplicityOrder);
                    const knotEnd = boundsNormalizedBasis.end.knot.knotIndex;
                    for (let knot = knotEnd + 1; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        const refKnot = periodicKnots[knot - knotEnd] - periodicKnots[0] + periodicKnots[periodicKnots.length - 1];
                        (0, chai_1.expect)(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo(refKnot, AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                    }
                    multiplicity = 0;
                    for (let knot = knotEnd; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot)));
                    }
                    (0, chai_1.expect)(multiplicity).to.eql(maxMultiplicityOrder);
                    multiplicities1[j]++;
                }
            }
            multiplicities1 = multiplicities.slice();
            multiplicities1[0] = i + 2;
            multiplicities1[multiplicities1.length - 1] = i + 2;
        }
    });
});
