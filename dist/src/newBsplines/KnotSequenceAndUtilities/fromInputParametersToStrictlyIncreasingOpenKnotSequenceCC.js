"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC = void 0;
var fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
var StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingOpenKnotSequenceClosedCurve");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
function fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, knotParameters) {
    if (knotParameters.multiplicities[0] < maxMultiplicityOrder) {
        var strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities });
        var openSequence = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae, multiplicities: openSequence.multiplicities() });
    }
    else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities });
    }
}
exports.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC;
