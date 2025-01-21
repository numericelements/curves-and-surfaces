"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromInputParametersToIncreasingOpenKnotSequenceCC = void 0;
var KnotSequences_1 = require("../../namedConstants/KnotSequences");
var IncreasingOpenKnotSequenceClosedCurve_1 = require("../IncreasingOpenKnotSequenceClosedCurve");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
var fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC_1 = require("./fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC");
function fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, knotParameters) {
    var multiplicityFirstKnot = 0;
    var i = 0;
    while (knotParameters.periodicKnots[i] === KnotSequences_1.KNOT_SEQUENCE_ORIGIN) {
        i++;
        multiplicityFirstKnot++;
    }
    if (multiplicityFirstKnot < maxMultiplicityOrder) {
        var periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots });
        var openSequence = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC_1.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(periodicSeq);
        return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae });
    }
    else {
        return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotParameters.periodicKnots });
    }
}
exports.fromInputParametersToIncreasingOpenKnotSequenceCC = fromInputParametersToIncreasingOpenKnotSequenceCC;
