import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { DEFAULT_KNOT_INDEX, Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractStrictlyIncreasingOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";


export abstract class AbstractStrictlyIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected abstract _enableMaxMultiplicityOrderAtIntermediateKnots: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractStrictlyIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(DEFAULT_KNOT_INDEX);
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this._indexKnotOrigin.knotIndex = 0;
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = 0;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            this.generateKnotSequence(knotParameters);
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            if(knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
                error.logMessage();
            }
            for(let i = 0; i < knotParameters.periodicKnots.length; i++) {
                this.knotSequence.push(new Knot(knotParameters.periodicKnots[i], knotParameters.multiplicities[i]));
            }
        }
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    get indexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return this._indexKnotOrigin;
    }

    [Symbol.iterator]() {
        const lastIndex = this.knotSequence.length - 1;
        let index = 0;
        return  {
            next: () => {
                if (index <= lastIndex ) {
                    const abscissa = this.knotSequence[index].abscissa;
                    const multiplicity = this.knotSequence[index].multiplicity;
                    index++;
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, 
                    done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    abstract clone(): StrictlyIncreasingOpenKnotSequenceInterface;

    abstract toIncreasingKnotSequence(): IncreasingOpenKnotSequenceInterface;

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    checkKnotMultiplicities(multiplicities: number[]): void {
        for(let i = 0; i < multiplicities.length; i++) {
            if(multiplicities[i] <= 0) {
                const error = new ErrorLog(this.constructor.name, "checkKnotMultiplicities");
                error.addMessage("Some knot multiplicities are negative or null. Cannot proceed.");
                console.log(error.generateMessageString());
                throw new RangeError(error.generateMessageString());
            }
        }
    }

    generateKnotSequence(knotParameters: StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.knots);
        this.checkKnotMultiplicities(knotParameters.multiplicities);
        for(let i = 0; i < knotParameters.knots.length; i++) {
            this.knotSequence.push(new Knot(knotParameters.knots[i], knotParameters.multiplicities[i]));
        }
        if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE) {
            const {start: indexStart, end: indexEnd} = this.getKnotIndicesBoundingNormalizedBasis();
            this._uMax = this.abscissaAtIndex(indexEnd);
            this._indexKnotOrigin = indexStart;
        }
        if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            const {start: indexStart, end: indexEnd} = this.getKnotIndicesBoundingNormalizedBasis();
            this._uMax = this.abscissaAtIndex(indexEnd);
            this._indexKnotOrigin = indexStart;
        }
    }

    revertSequence(): number[] {
        const seq = this.clone();
        seq.revertKnots();
        return seq.distinctAbscissae();
    }

    length(): number {
        return this.knotSequence.length;
    }

    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number {
        let abscissa = RETURN_ERROR_CODE;
        let i = 0;
        for(const knot of this) {
            if(i === index.knotIndex && knot !== undefined) abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }

    incrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1): boolean {
        let increment = true;
        if(index.knotIndex < 0 || index.knotIndex > (this.knotSequence.length - 1)) {
            const error = new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessage();
            increment = false;
        } else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    }
}