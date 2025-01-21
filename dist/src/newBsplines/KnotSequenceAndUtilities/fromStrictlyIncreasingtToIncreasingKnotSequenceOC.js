"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStrictlyIncreasingtToIncreasingKnotSequenceOC = void 0;
var IncreasingOpenKnotSequenceOpenCurve_1 = require("../IncreasingOpenKnotSequenceOpenCurve");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strictIncSeq) {
    var knotAbscissae = [];
    var maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    var abscissae = strictIncSeq.distinctAbscissae();
    var multiplicities = strictIncSeq.multiplicities();
    for (var j = 0; j < abscissae.length; j++) {
        for (var i = 0; i < multiplicities[j]; i++) {
            knotAbscissae.push(abscissae[j]);
        }
    }
    if (strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae });
    }
    else {
        return new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae });
    }
}
exports.fromStrictlyIncreasingtToIncreasingKnotSequenceOC = fromStrictlyIncreasingtToIncreasingKnotSequenceOC;
