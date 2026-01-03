"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve");
const strictlyIncreasingKnotSequenceOpenCurveParameterExtraction_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/strictlyIncreasingKnotSequenceOpenCurveParameterExtraction");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
describe('Extraction of major knot sequence parameters from a strictly increasing open knot sequence of open curves', () => {
    it('can extract the strictly increasing knot sequence abscissae and knot multiplicities, max multiplicity order, indices of knots bounding the normalized basis from a strictly increasing knot sequence of an open curve. Non uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 1];
        const multiplicities = [4, 4];
        const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        const strIncreasingSeq = (0, strictlyIncreasingKnotSequenceOpenCurveParameterExtraction_1.strictlyIncreasingKnotSequenceParameterExtraction)(strSeq);
        (0, chai_1.expect)(strSeq.uMax).to.eql(knots[knots.length - 1]);
        (0, chai_1.expect)(strIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strIncreasingSeq.knots).to.eql(knots);
        (0, chai_1.expect)(strIncreasingSeq.multiplicities).to.eql(multiplicities);
        (0, chai_1.expect)(strIncreasingSeq.indexLeft).to.eql(0);
        (0, chai_1.expect)(strIncreasingSeq.indexRight).to.eql(1);
    });
    it('can extract the strictly increasing knot sequence abscissae and knot multiplicities, max multiplicity order, indices of knots bounding the normalized basis from a strictly increasing knot sequence of an open curve. Uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
        const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        const strIncreasingSeq = (0, strictlyIncreasingKnotSequenceOpenCurveParameterExtraction_1.strictlyIncreasingKnotSequenceParameterExtraction)(strSeq);
        (0, chai_1.expect)(strSeq.uMax).to.eql(3);
        (0, chai_1.expect)(strIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strIncreasingSeq.knots).to.eql(knots);
        (0, chai_1.expect)(strIncreasingSeq.multiplicities).to.eql(multiplicities);
        (0, chai_1.expect)(strIncreasingSeq.indexLeft).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strIncreasingSeq.indexRight).to.eql(knots.length - maxMultiplicityOrder);
    });
});
describe('Extraction of major knot sequence parameters from a strictly increasing knot sequence of closed curves', () => {
    it('can extract the strictly increasing knot sequence abscissae and knot multiplicities, max multiplicity order, indices of knots bounding the normalized basis from a strictly increasing knot sequence of a closed curve. Uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const multiplicities = [1, 1, 1, 1, 1, 1];
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const strIncreasingSeq = (0, strictlyIncreasingKnotSequenceOpenCurveParameterExtraction_1.strictlyIncreasingKnotSequenceParameterExtraction)(strSeq);
        (0, chai_1.expect)(strSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(strIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const knots = [-3, -2, -1];
        const knots1 = knots.concat(periodicKnots, [6, 7, 8]);
        const multiplicities1 = [1, 1, 1].concat(multiplicities, [1, 1, 1]);
        (0, chai_1.expect)(strIncreasingSeq.knots).to.eql(knots1);
        (0, chai_1.expect)(strIncreasingSeq.multiplicities).to.eql(multiplicities1);
        (0, chai_1.expect)(strIncreasingSeq.indexLeft).to.eql(maxMultiplicityOrder - 1);
        (0, chai_1.expect)(strIncreasingSeq.indexRight).to.eql(periodicKnots.length + maxMultiplicityOrder - 2);
    });
    it('can extract the strictly increasing knot sequence abscissae and knot multiplicities, max multiplicity order, indices of knots bounding the normalized basis from a strictly increasing knot sequence of a closed curve. Non-uniform B-spline case', () => {
        const maxMultiplicityOrder = 4;
        const periodicKnots = [0, 1, 2];
        const multiplicities = [3, 1, 3];
        const strSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        const strIncreasingSeq = (0, strictlyIncreasingKnotSequenceOpenCurveParameterExtraction_1.strictlyIncreasingKnotSequenceParameterExtraction)(strSeq);
        (0, chai_1.expect)(strSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
        (0, chai_1.expect)(strIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const knots = [-1];
        const knots1 = knots.concat(periodicKnots, [3]);
        (0, chai_1.expect)(strIncreasingSeq.knots).to.eql(knots1);
        const multiplicities1 = [1].concat(multiplicities, [1]);
        (0, chai_1.expect)(strIncreasingSeq.multiplicities).to.eql(multiplicities1);
        (0, chai_1.expect)(strIncreasingSeq.indexLeft).to.eql(1);
        (0, chai_1.expect)(strIncreasingSeq.indexRight).to.eql(3);
    });
});
