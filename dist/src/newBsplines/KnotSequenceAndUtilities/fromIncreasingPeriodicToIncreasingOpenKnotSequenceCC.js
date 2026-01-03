"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC = void 0;
const IncreasingOpenKnotSequenceClosedCurve_1 = require("../IncreasingOpenKnotSequenceClosedCurve");
const KnotIndexStrictlyIncreasingSequence_1 = require("../KnotIndexStrictlyIncreasingSequence");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
function fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(increasingSeq) {
    const knotsOpenSequence = [];
    const multiplicityAtOrigin = increasingSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
    const strictlyIncSeq = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(increasingSeq);
    const strictSeqLength = strictlyIncSeq.length();
    const lastAbscissa = strictlyIncSeq.uMax;
    let knotNumber = 1;
    for (let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for (let j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
                knotsOpenSequence.splice(0, 0, (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)) - lastAbscissa));
            else
                break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
            break;
    }
    for (const knot of increasingSeq) {
        if (knot !== undefined)
            knotsOpenSequence.push(knot);
    }
    knotNumber = 1;
    for (let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for (let j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) {
                if (i === (strictSeqLength - 1)) {
                    knotsOpenSequence.push(lastAbscissa + (lastAbscissa - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))));
                }
                else {
                    knotsOpenSequence.push(lastAbscissa + (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i)) - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))));
                }
            }
            else
                break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
            break;
    }
    return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(increasingSeq.maxMultiplicityOrder + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence });
}
exports.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC;
