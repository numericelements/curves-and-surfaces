"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence = void 0;
const IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncSeq) {
    const knotAbscissae = [];
    for (const knot of strictIncSeq) {
        if (knot !== undefined) {
            for (let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae });
}
exports.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence;
