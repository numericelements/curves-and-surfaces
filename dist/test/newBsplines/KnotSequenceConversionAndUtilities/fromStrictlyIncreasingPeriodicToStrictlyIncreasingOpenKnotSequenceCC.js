"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
var fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
var AbstractBSplineR1toR2_1 = require("../../../src/newBsplines/AbstractBSplineR1toR2");
var KnotSequences_1 = require("../../../src/namedConstants/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', function () {
    it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        chai_1.expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        chai_1.expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strIncSeq.distinctAbscissae().length).to.eql(periodicKnots.length + 2 * (maxMultiplicityOrder - 1));
        chai_1.expect(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        chai_1.expect(strIncSeq.multiplicities().length).to.eql(multiplicities.length + 2 * (maxMultiplicityOrder - 1));
        chai_1.expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can check that the status of the strictly increasing open knot sequence cannot describe C0 discontinuity', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('can check the preservation of the knot spacing property', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(true);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.isKnotSpacingUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity uniformity property', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.isKnotMultiplicityUniform).to.eql(true);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can check the preservation of the knot multiplicity non uniformity property', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.isKnotMultiplicityNonUniform).to.eql(false);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('can convert a strictly increasing sequence to a strictly increasing open knot sequence of closed curve. Case of uniform knot sequence with non uniform knot spacing', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        chai_1.expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        chai_1.expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var allKnots = [-3.8, -2.9, -1.7, 0, 0.5, 1.2, 2.1, 3.3, 5, 5.5, 6.2, 7.1];
        chai_1.expect(strIncSeq.distinctAbscissae().length).to.eql(allKnots.length);
        for (var i = 0; i < strIncSeq.distinctAbscissae().length; i++) {
            chai_1.expect(strIncSeq.distinctAbscissae()[i]).to.be.closeTo(allKnots[i], AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
        }
        chai_1.expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('can check the preservation of non uniform spacing property when converting a strictly increasing sequence to a strictly increasing open knot sequence of closed curve', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 0.5, 1.2, 2.1, 3.3, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        chai_1.expect(strictIncPeriodicSeq.isKnotSpacingUniform).to.eql(false);
        var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        chai_1.expect(strIncSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('can convert a strictly increasing periodic sequence to a strictly increasing open knot sequence of closed curve. Case of non uniform knot sequence', function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4];
        var multiplicities = [1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
        chai_1.expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        chai_1.expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        var multiplicities1 = multiplicities.slice();
        for (var i = 0; i < maxMultiplicityOrder - 1; i++) {
            for (var j = 1; j < multiplicities1.length - 1; j++) {
                var upperBound = Math.min(j, maxMultiplicityOrder - 2);
                if (j === multiplicities1.length - 2)
                    upperBound = Math.min(j, maxMultiplicityOrder - 1);
                for (var k = 0; k < upperBound; k++) {
                    var strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1 });
                    chai_1.expect(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots);
                    chai_1.expect(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1);
                    var strIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq1);
                    var boundsNormalizedBasis = strIncSeq.getKnotIndicesBoundingNormalizedBasis();
                    chai_1.expect(boundsNormalizedBasis.start.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    chai_1.expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.start.knot)).to.eql(periodicKnots[0]);
                    chai_1.expect(boundsNormalizedBasis.end.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
                    chai_1.expect(strIncSeq.abscissaAtIndex(boundsNormalizedBasis.end.knot)).to.eql(periodicKnots[periodicKnots.length - 1]);
                    var knotOrigin = boundsNormalizedBasis.start.knot.knotIndex;
                    for (var knot = 0; knot < knotOrigin; knot++) {
                        chai_1.expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo((periodicKnots[periodicKnots.length - knotOrigin - 1 + knot] - periodicKnots[periodicKnots.length - 1]), AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                    }
                    var multiplicity = 0;
                    for (var knot = knotOrigin; knot >= 0; knot--) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot)));
                    }
                    chai_1.expect(multiplicity).to.eql(maxMultiplicityOrder);
                    var knotEnd = boundsNormalizedBasis.end.knot.knotIndex;
                    for (var knot = knotEnd + 1; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        var refKnot = periodicKnots[knot - knotEnd] - periodicKnots[0] + periodicKnots[periodicKnots.length - 1];
                        chai_1.expect(strIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot))).to.be.closeTo(refKnot, AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                    }
                    multiplicity = 0;
                    for (var knot = knotEnd; knot < strIncSeq.distinctAbscissae().length; knot++) {
                        multiplicity = multiplicity + strIncSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(knot)));
                    }
                    chai_1.expect(multiplicity).to.eql(maxMultiplicityOrder);
                    multiplicities1[j]++;
                }
            }
            multiplicities1 = multiplicities.slice();
            multiplicities1[0] = i + 2;
            multiplicities1[multiplicities1.length - 1] = i + 2;
        }
    });
});
