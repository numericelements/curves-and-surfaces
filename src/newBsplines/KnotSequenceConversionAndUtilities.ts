import { EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION } from "../ErrorMessages/KnotSequences";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { IncreasingOpenKnotSequenceClosedCurve } from "./IncreasingOpenKnotSequenceClosedCurve";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, IncreasingOpenKnotSequenceCCurve, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";


export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingSeq: IncreasingOpenKnotSequenceOpenCurve): StrictlyIncreasingOpenKnotSequenceOpenCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}

export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(increasingSeq: IncreasingOpenKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}

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

export function fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strictIncSeq: StrictlyIncreasingOpenKnotSequenceOpenCurve): IncreasingOpenKnotSequenceOpenCurve {
    const knotAbscissae: number[] = [];
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const abscissae = strictIncSeq.distinctAbscissae();
    const multiplicities = strictIncSeq.multiplicities();
    for (let j = 0; j < abscissae.length; j++) {
        for(let i = 0; i < multiplicities[j]; i++) {
            knotAbscissae.push(abscissae[j]);
        }
    }
    if(strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae});
    }
}

export function fromStrictlyIncreasingToIncreasingKnotSequenceCC(strictIncSeq: StrictlyIncreasingOpenKnotSequenceClosedCurve): IncreasingOpenKnotSequenceClosedCurve {
    const knotAbscissae: number[] = [];
    for (const knot of strictIncSeq) {
        if(knot !== undefined) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
    }
    if(strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    }
}

export function fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): IncreasingOpenKnotSequenceClosedCurve {
    const knotsOpenSequence: number[] = [];
    const multiplicityAtOrigin = increasingSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
    const strictlyIncSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq);
    const strictSeqLength = strictlyIncSeq.length();
    const lastAbscissa = strictlyIncSeq.uMax;
    let knotNumber = 1;
    for( let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for(let j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
                knotsOpenSequence.splice(0, 0,(strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)) - lastAbscissa));
            else break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) break;
    }
    for(const knot of increasingSeq) {
        if(knot !== undefined) knotsOpenSequence.push(knot);
    }
    knotNumber = 1;
    for(let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for(let j = 0; j <strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) {
                if(i === (strictSeqLength - 1)) {
                    knotsOpenSequence.push(lastAbscissa + (lastAbscissa - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
                } else {
                    knotsOpenSequence.push(lastAbscissa + (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i)) - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
                }
            } else break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) break;
    }
    return new IncreasingOpenKnotSequenceClosedCurve(increasingSeq.maxMultiplicityOrder + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence});
}

export function fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const knotsOpenSequence: number[] = [];
    const multiplicitiesOpenSequence: number[] = [];
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const lastIndex = strictIncSeq.length() - 1;
    const lastAbscissa = strictIncSeq.uMax;
    const multiplicityAtOrigin = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
    let nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    let index = 0;
    while(index < nbComplementaryKnots) {
        const multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(lastIndex - (index + 1))) - index;
        if(multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        } else if(multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        } else {
            index++;
        }
    }
    let cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for(let i = 0; i < nbComplementaryKnots; i++) {
        knotsOpenSequence.splice(0, 0, (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1))) - lastAbscissa));
        let multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1)));
        if((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.splice(0, 0, multiplicityCurrentKnot);
    }
    for(const knot of strictIncSeq) {
        if(knot !== undefined) {
            knotsOpenSequence.push(knot.abscissa);
            multiplicitiesOpenSequence.push(knot.multiplicity);
        }
    }
    nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    index = 0;
    while(index < nbComplementaryKnots) {
        const multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(index + 1)) - index;
        if(multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        } else if(multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        } else {
            index++;
        }
    }
    cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for(let i = 0; i < nbComplementaryKnots; i++) {
        knotsOpenSequence.push(lastAbscissa + (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i + 1)) - strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
        let multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i + 1));
        if((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.push(multiplicityCurrentKnot);
    }
    return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence});
}

export function fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder,  {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
}

export function fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): IncreasingPeriodicKnotSequenceClosedCurve {
    const knotAbscissae: number[] = [];
    for (const knot of strictIncSeq) {
        if(knot !== undefined) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae});
}

export function fromInputParametersToOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceCCurve): IncreasingOpenKnotSequenceClosedCurve {
    const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots});
    const openSequence = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(periodicSeq);
    return new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae});
}

export function fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceCCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    if(knotParameters.multiplicities[0] < maxMultiplicityOrder) {
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities});
        const openSequence = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae, multiplicities: openSequence.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities});
    }
}