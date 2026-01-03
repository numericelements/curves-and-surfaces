"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBSplineR1toR1 = void 0;
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractBSplineR1toRn_1 = require("./AbstractBSplineR1toRn");
const BSplineR1toRnConstructorInterface_1 = require("./BSplineR1toRnConstructorInterface");
const IncreasingOpenKnotSequenceOpenCurve_1 = require("./IncreasingOpenKnotSequenceOpenCurve");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("./StrictlyIncreasingOpenKnotSequenceOpenCurve");
class OpenBSplineR1toR1 extends AbstractBSplineR1toRn_1.AbstractBSplineR1toRn {
    constructor(curveParameters, degree) {
        super(curveParameters);
        this._curveOrigin = KnotSequences_1.KNOT_SEQUENCE_ORIGIN;
        this._degree = degree;
        if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
            this._controlPolygon = curveParameters.controlPoints;
            if (curveParameters.knotSequence.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
                this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots, multiplicities: curveParameters.knotSequence.multiplicities });
            }
            else if (curveParameters.knotSequence.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
                const incKnotSeq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots });
                this._knotSequence = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(incKnotSeq);
            }
            else {
                throw new Error("Invalid knot sequence type for OpenBSplineR1toR1 constructor");
            }
        }
        else {
            throw new Error("Invalid curve parameters for OpenBSplineR1toR1 constructor");
        }
    }
    get controlPolygon() {
        return this._controlPolygon;
    }
}
exports.OpenBSplineR1toR1 = OpenBSplineR1toR1;
