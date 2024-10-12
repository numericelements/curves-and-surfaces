import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractStrictlyIncreasingOpenKnotSequence_type, STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE } from "./KnotSequenceConstructorInterface";


export abstract class AbstractStrictlyIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected knotSequence: Knot[];
    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractStrictlyIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence();
        this._uMax = 0;
        this._isKnotMultiplicityNonUniform = false;
        if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE) {
            if(knotParameters.knots.length !== knotParameters.multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
                error.logMessageToConsole();
            }
            for(let i = 0; i < knotParameters.knots.length; i++) {
                this.knotSequence.push(new Knot(knotParameters.knots[i], knotParameters.multiplicities[i]));
            }
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            if(knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
                error.logMessageToConsole();
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

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
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

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
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
            error.logMessageToConsole();
            increment = false;
        } else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    }

    abstract clone(): StrictlyIncreasingOpenKnotSequenceInterface;

    abstract toIncreasingKnotSequence(): IncreasingOpenKnotSequenceInterface;
}