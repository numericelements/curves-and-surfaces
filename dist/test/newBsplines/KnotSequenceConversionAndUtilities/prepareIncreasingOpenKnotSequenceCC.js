"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../../../src/ErrorMessages/KnotSequences");
const prepareIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/prepareIncreasingOpenKnotSequenceCC");
const KnotSequences_2 = require("../../../src/namedConstants/KnotSequences");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
describe('Generation of parameters  of an increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', () => {
    it('Can get the parameters of an increasing open knot sequence of closed curves from input parameters. Case of uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const increasingSeq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        (0, chai_1.expect)(increasingSeq.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        (0, chai_1.expect)(increasingSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        (0, chai_1.expect)(increasingSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(increasingSeq.indexKnotOrigin.knotIndex).to.eql(3);
    });
    it('Can get the parameters of an increasing open knot sequence of closed curves from input parameters. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0, 0, 0, 1, 1, 1, 1];
        const increasingSeq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        (0, chai_1.expect)(increasingSeq.knots).to.eql([0, 1]);
        (0, chai_1.expect)(increasingSeq.multiplicities).to.eql([4, 4]);
        (0, chai_1.expect)(increasingSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(increasingSeq.indexKnotOrigin.knotIndex).to.eql(0);
    });
    it('Cannot get the parameters of an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1];
        (0, chai_1.expect)(() => (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
    });
    it('generates the parameters of an increasing open knot sequence of closed curves without C0 discontinuity property', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        const seq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for (let index = 0; index < seq.knots.length; index++) {
            (0, chai_1.expect)(seq.knots[index]).to.be.closeTo(knots[index], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(1);
        const strIncreasingSeqCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strIncreasingSeqCC.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence of closed curves considering property about uniform knot spacing.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        const seq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for (let index = 0; index < seq.knots.length; index++) {
            (0, chai_1.expect)(seq.knots[index]).to.be.closeTo(knots[index], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(1);
        const strIncreasingSeqCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strIncreasingSeqCC.isKnotSpacingUniform).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence of closed curves considering property about non uniform knot multiplicity of closed curves that is always set to false.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0, 1, 1, 1];
        const seq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const knots = [0, 1];
        for (let index = 0; index < seq.knots.length; index++) {
            (0, chai_1.expect)(seq.knots[index]).to.be.closeTo(knots[index], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([3, 3]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(0);
        const strIncreasingSeqCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strIncreasingSeqCC.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence of closed curves considering property about uniform knot multiplicity of closed curves.', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        const seq = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const knots = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
        for (let index = 0; index < seq.knots.length; index++) {
            (0, chai_1.expect)(seq.knots[index]).to.be.closeTo(knots[index], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(1);
        const strIncreasingSeqCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strIncreasingSeqCC.isKnotMultiplicityUniform).to.eql(true);
    });
});
