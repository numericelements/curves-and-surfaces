"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const prepareStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/prepareStrictlyIncreasingOpenKnotSequenceCC");
const KnotSequences_1 = require("../../../src/ErrorMessages/KnotSequences");
const KnotSequences_2 = require("../../../src/namedConstants/KnotSequences");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
describe('Generation of the input parameters of a strictly increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', () => {
    it('Can generate the strictly increasing open knot sequence parameters of closed curve from input parameters. Case of uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strIncSeq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strIncSeq.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        (0, chai_1.expect)(strIncSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        (0, chai_1.expect)(strIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(strIncSeq.knots[strIncSeq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
    });
    it('Can generate the parameters of a strictly increasing open knot sequence of closed curve from input parameters. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1];
        const multiplicities = [4, 4];
        const strIncSeq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        (0, chai_1.expect)(strIncSeq.knots).to.eql([0, 1]);
        (0, chai_1.expect)(strIncSeq.multiplicities).to.eql([4, 4]);
        (0, chai_1.expect)(strIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(strIncSeq.knots[strIncSeq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
    });
    it('Cannot generate the parameters of an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0.5, 1];
        const multiplicities = [3, 4, 3];
        (0, chai_1.expect)(() => (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
    });
    it('generates the parameters of an increasing knot sequence without C0 discontinuity property', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        const multiplicities = [2, 1, 1, 2, 2];
        const seq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for (let knot = 0; knot < seq.knots.length; knot++) {
            (0, chai_1.expect)(seq.knots[knot]).to.be.closeTo(knots[knot], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence considering property about uniform knot spacing.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        const multiplicities = [2, 1, 1, 2, 2];
        const seq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5];
        for (let knot = 0; knot < seq.knots.length; knot++) {
            (0, chai_1.expect)(seq.knots[knot]).to.be.closeTo(knots[knot], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 2, 1, 1, 2, 2, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 1];
        const multiplicities = [3, 3];
        const seq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        for (let knot = 0; knot < seq.knots.length; knot++) {
            (0, chai_1.expect)(seq.knots[knot]).to.be.closeTo(periodicKnots[knot], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql(multiplicities);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('generates the parameters of an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        const multiplicities = [1, 1, 1, 1, 1, 1, 1];
        const seq = (0, prepareStrictlyIncreasingOpenKnotSequenceCC_1.prepareStrictlyIncreasingOpenKnotSequenceCC)(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const knots = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
        for (let knot = 0; knot < seq.knots.length; knot++) {
            (0, chai_1.expect)(seq.knots[knot]).to.be.closeTo(knots[knot], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
        }
        (0, chai_1.expect)(seq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1]);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(seq.knots[seq.indexKnotOrigin.knotIndex]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: seq.knots, multiplicities: seq.multiplicities });
        (0, chai_1.expect)(strSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
