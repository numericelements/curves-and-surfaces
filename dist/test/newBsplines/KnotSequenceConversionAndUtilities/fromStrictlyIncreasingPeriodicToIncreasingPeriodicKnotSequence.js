"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
var fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence");
var KnotIndexIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexIncreasingSequence");
var AbstractBSplineR1toR2_1 = require("../../../src/newBsplines/AbstractBSplineR1toR2");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
describe('Conversions from a strictly increasing periodic knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', function () {
    it('can convert a strictly increasing periodic sequence to an increasing periodic knot sequence of closed curve. Case of non uniform knot sequence', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 1, 2, 3, 4];
        var multiplicities = [1, 1, 1, 1, 1];
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strictIncPeriodicSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strictIncPeriodicSeq.distinctAbscissae()).to.eql(periodicKnots);
        chai_1.expect(strictIncPeriodicSeq.multiplicities()).to.eql(multiplicities);
        var multiplicities1 = multiplicities.slice();
        for (var i = 0; i < maxMultiplicityOrder; i++) {
            for (var j = 1; j < multiplicities1.length - 1; j++) {
                var upperBound = Math.min(j, maxMultiplicityOrder - 1);
                if (j === multiplicities1.length - 2)
                    upperBound = Math.min(j, maxMultiplicityOrder);
                for (var k = 0; k < upperBound; k++) {
                    var strictIncPeriodicSeq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities1 });
                    chai_1.expect(strictIncPeriodicSeq1.distinctAbscissae()).to.eql(periodicKnots);
                    chai_1.expect(strictIncPeriodicSeq1.multiplicities()).to.eql(multiplicities1);
                    var incSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncPeriodicSeq1);
                    var cumulativeMultiplicity = 0;
                    for (var indexStrInc = 0; indexStrInc < periodicKnots.length; indexStrInc++) {
                        for (var knot = 0; knot < multiplicities1[indexStrInc]; knot++) {
                            if (indexStrInc < periodicKnots.length - 1) {
                                chai_1.expect(incSeq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(cumulativeMultiplicity + knot))).to.be.closeTo((periodicKnots[indexStrInc]), AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                            }
                            else {
                                chai_1.expect(incSeq.getPeriod()).to.be.closeTo((periodicKnots[indexStrInc]), AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
                            }
                        }
                        var multiplicity = incSeq.knotMultiplicity((new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(indexStrInc)));
                        chai_1.expect(multiplicity).to.eql(multiplicities1[indexStrInc]);
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
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [2, 1, 1, 2, 2];
        var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 1];
        var multiplicities = [3, 3];
        var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var maxMultiplicityOrder = 2;
        var periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        var multiplicities = [1, 1, 1, 1, 1, 1, 1];
        var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence_1.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
