"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
const fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence");
const KnotIndexIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexIncreasingSequence");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const KnotIndexStrictlyIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
const KnotSequences_1 = require("../../../src/namedConstants/KnotSequences");
describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', () => {
    it('can convert a strictly increasing periodic sequence to an increasing periodic knot sequence of closed curve. Case of non uniform knot sequence', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 1, 2, 3, 4];
        const multiplicities = [1, 1, 1, 1, 1];
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        (0, chai_1.expect)(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        let multiplicities1 = multiplicities.slice();
        for (let i = 0; i < maxMultiplicityOrder; i++) {
            for (let j = 1; j < multiplicities1.length - 1; j++) {
                let upperBound = Math.min(j, maxMultiplicityOrder - 1);
                if (j === multiplicities1.length - 2)
                    upperBound = Math.min(j, maxMultiplicityOrder);
                for (let k = 0; k < upperBound; k++) {
                    const strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1 });
                    (0, chai_1.expect)(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots);
                    (0, chai_1.expect)(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1);
                    const incSeq = (0, fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence)(strictIncPeriodicSeq1);
                    let cumulativeMultiplicity = 0;
                    for (let indexStrInc = 0; indexStrInc < periodicKnots.length; indexStrInc++) {
                        for (let knot = 0; knot < multiplicities1[indexStrInc]; knot++) {
                            if (indexStrInc < periodicKnots.length - 1) {
                                (0, chai_1.expect)(incSeq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(cumulativeMultiplicity + knot))).to.be.closeTo((periodicKnots[indexStrInc]), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
                            }
                            else {
                                (0, chai_1.expect)(incSeq.getPeriod()).to.be.closeTo((periodicKnots[indexStrInc]), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
                            }
                        }
                        let multiplicity = incSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(indexStrInc)));
                        (0, chai_1.expect)(multiplicity).to.eql(multiplicities1[indexStrInc]);
                        cumulativeMultiplicity += multiplicity;
                    }
                    multiplicities1[j]++;
                }
            }
            multiplicities1 = multiplicities.slice();
            multiplicities1[0] = i + 2;
            multiplicities1[multiplicities1.length - 1] = i + 2;
        }
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        const multiplicities = [2, 1, 1, 2, 2];
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 1];
        const multiplicities = [3, 3];
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        const multiplicities = [1, 1, 1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
        const increasingSeq = (0, fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
