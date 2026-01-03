"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const IncreasingOpenKnotSequenceOpenCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve");
const increasingKnotSequenceOpenCurveParameterExtraction_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/increasingKnotSequenceOpenCurveParameterExtraction");
const IncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve");
describe('Extraction of major knot sequence parameters from an increasing open knot sequence of open curves', () => {
    it('can extract the increasing knot sequence abscissae, max multiplicity order, indices of knots bounding the normalized basis from an increasing knot sequence of an open curve. Non uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        const increasingSeq = (0, increasingKnotSequenceOpenCurveParameterExtraction_1.increasingKnotSequenceParameterExtraction)(seq);
        (0, chai_1.expect)(seq.uMax).to.eql(knots[knots.length - 1]);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(increasingSeq.knots).to.eql(knots);
        (0, chai_1.expect)(increasingSeq.indexLeft).to.eql(0);
        (0, chai_1.expect)(increasingSeq.indexRight).to.eql(4);
    });
    it('can extract the increasing knot sequence abscissae, max multiplicity order, indices of knots bounding the normalized basis from an increasing knot sequence of an open curve. Uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        const increasingSeq = (0, increasingKnotSequenceOpenCurveParameterExtraction_1.increasingKnotSequenceParameterExtraction)(seq);
        (0, chai_1.expect)(seq.uMax).to.eql(3);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(increasingSeq.knots).to.eql(knots);
        (0, chai_1.expect)(increasingSeq.indexLeft).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(increasingSeq.indexRight).to.eql(knots.length - maxMultiplicityOrder);
    });
});
describe('Extraction of major knot sequence parameters from an increasing knot sequence of closed curves', () => {
    it('can extract the increasing knot sequence abscissae, max multiplicity order, indices of knots bounding the normalized basis from an increasing knot sequence of a closed curve. Uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const increasingSeq = (0, increasingKnotSequenceOpenCurveParameterExtraction_1.increasingKnotSequenceParameterExtraction)(seq);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const knots = [-3, -2, -1];
        const knots1 = knots.concat(periodicKnots, [6, 7, 8]);
        (0, chai_1.expect)(increasingSeq.knots).to.eql(knots1);
        (0, chai_1.expect)(increasingSeq.indexLeft).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(increasingSeq.indexRight).to.eql(periodicKnots.length + maxMultiplicityOrder - 2);
    });
    it('can extract the increasing knot sequence abscissae, max multiplicity order, indices of knots bounding the normalized basis from an increasing knot sequence of a closed curve. Non-uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 0, 0, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        const increasingSeq = (0, increasingKnotSequenceOpenCurveParameterExtraction_1.increasingKnotSequenceParameterExtraction)(seq);
        (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const knots = [-1];
        const knots1 = knots.concat(periodicKnots, [2]);
        (0, chai_1.expect)(increasingSeq.knots).to.eql(knots1);
        (0, chai_1.expect)(increasingSeq.indexLeft).to.eql(1);
        (0, chai_1.expect)(increasingSeq.indexRight).to.eql(4);
    });
});
