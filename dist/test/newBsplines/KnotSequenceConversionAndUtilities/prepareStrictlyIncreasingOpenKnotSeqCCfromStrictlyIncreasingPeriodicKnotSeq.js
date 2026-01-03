"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
const prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../../../src/namedConstants/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
describe('Preparation of parameters of a strictly increasing open knot sequence of a closed curve from a strictly increasing periodic knot sequence of a closed curve', () => {
    it('can get parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence. Case of uniform knot sequence', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        const strIncSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        (0, chai_1.expect)(strIncSeq.knots.length).to.eql(periodicKnots.length + 2 * (maxMultiplicityOrder - 1));
        (0, chai_1.expect)(strIncSeq.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        (0, chai_1.expect)(strIncSeq.multiplicities.length).to.eql(multiplicities.length + 2 * (maxMultiplicityOrder - 1));
        (0, chai_1.expect)(strIncSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can check that the parameters of the strictly increasing open knot sequence cannot describe a C0 discontinuity', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
        (0, chai_1.expect)(strIncSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('can check the preservation of the knot spacing property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(true);
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
        (0, chai_1.expect)(strIncSeq.isKnotSpacingUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity uniformity property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotMultiplicityUniform).to.eql(true);
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
        (0, chai_1.expect)(strIncSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity non uniformity property', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotMultiplicityNonUniform).to.eql(false);
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
        (0, chai_1.expect)(strIncSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('can get the parameters of a strictly increasing sequence of closed curve from a strictly increasing periodic knot sequence. Case of uniform knot sequence with non uniform knot spacing', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        // expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const allKnots = [-3.8, -2.9, -1.7, 0, 0.5, 1.2, 2.1, 3.3, 5, 5.5, 6.2, 7.1];
        (0, chai_1.expect)(paramStrIncOKnotSeq.knots.length).to.eql(allKnots.length);
        for (let i = 0; i < paramStrIncOKnotSeq.knots.length; i++) {
            (0, chai_1.expect)(paramStrIncOKnotSeq.knots[i]).to.be.closeTo(allKnots[i], KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(paramStrIncOKnotSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can check the preservation of non uniform spacing property when obtaining the parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence ', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(false);
        const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
        (0, chai_1.expect)(strIncSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('can get the parameters of a strictly increasing open knot sequence of closed curve from a strictly increasing periodic knot sequence. Case of non uniform knot sequence', () => {
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
                    const paramStrIncOKnotSeq = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq1);
                    const strIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: paramStrIncOKnotSeq.knots, multiplicities: paramStrIncOKnotSeq.multiplicities });
                    const boundsNormalizedBasis = strIncSeq.getKnotIndicesBoundingNormalizedBasis();
                    (0, chai_1.expect)(boundsNormalizedBasis.start.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    (0, chai_1.expect)(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.start.knot)).to.eql(periodicKnots[0]);
                    (0, chai_1.expect)(boundsNormalizedBasis.end.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    (0, chai_1.expect)(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.end.knot)).to.eql(periodicKnots[periodicKnots.length - 1]);
                    const knotOrigin = boundsNormalizedBasis.start.knot.knotIndex;
                    for (let knot = 0; knot < knotOrigin; knot++) {
                        (0, chai_1.expect)(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo((periodicKnots[periodicKnots.length - knotOrigin - 1 + knot] - periodicKnots[periodicKnots.length - 1]), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
                    }
                    let multiplicity = 0;
                    for (let knot = knotOrigin; knot >= 0; knot--) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot)));
                    }
                    (0, chai_1.expect)(multiplicity).to.eql(maxMultiplicityOrder);
                    const knotEnd = boundsNormalizedBasis.end.knot.knotIndex;
                    for (let knot = knotEnd + 1; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        const refKnot = periodicKnots[knot - knotEnd] - periodicKnots[0] + periodicKnots[periodicKnots.length - 1];
                        (0, chai_1.expect)(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo(refKnot, KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
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
