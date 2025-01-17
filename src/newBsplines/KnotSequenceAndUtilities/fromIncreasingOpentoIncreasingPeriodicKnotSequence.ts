import { EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION } from "../../ErrorMessages/KnotSequences";
import { ErrorLog } from "../../errorProcessing/ErrorLoging";
import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";

export function fromIncreasingOpentoIncreasingPeriodicKnotSequence(increasingSeq: IncreasingOpenKnotSequenceClosedCurve): IncreasingPeriodicKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    const indexOrigin = increasingSeq.indexKnotOrigin.knotIndex;
    const knotAbscissae = increasingSeq.allAbscissae;
    knotAbscissae.splice(knotAbscissae.length - 1 - (indexOrigin - 1), indexOrigin);
    knotAbscissae.splice(0, indexOrigin);
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        const multiplicities = increasingSeq.multiplicities();
        for(const multiplicity of multiplicities) {
            if(multiplicity === maxMultOrder) {
                const error = new ErrorLog("function", "fromIncreasingOpentoIncreasingPeriodicKnotSequence");
                error.addMessage(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
                console.log(error.generateMessageString());
                throw new RangeError(error.generateMessageString());
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder - 1, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae});
}