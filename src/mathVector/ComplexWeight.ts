import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../ErrorMessages/ComplexWeight";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { IComplexWeight } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

export class ComplexWeight {

    private readonly _type: typeof COMPLEXWEIGHT;
    private readonly _real: Weight;
    private readonly _imaginary: Weight;

    constructor();
    constructor(real: Weight);
    constructor(real: Weight, imaginary: Weight);
    constructor(real?: Weight, imaginary?: Weight) {
        this._type = COMPLEXWEIGHT;
        if(real === undefined) {
            this._real = new Weight();
        } else {
            this._real = real;
        }
        if(imaginary === undefined) {
            if(this._real.strictlyPositive) {
                this._imaginary = new Weight();
            } else this._imaginary = new Weight(DEFAULT_WEIGHT_VALUE, false);
        } else {
            this.assessmentInputWeightStrictlyPositiveStatus(this._real, imaginary);
            this._imaginary = imaginary;
        }
    }

    get real(): Weight {
        return this._real;
    }

    get imaginary(): Weight {
        return this._imaginary;
    }
    
    get type(): typeof COMPLEXWEIGHT {
        return this._type;
    }

    toString(): string {
        return COMPLEXWEIGHT + `(real: ${this._real.toString()}, imaginary: ${this._imaginary.toString()})`;
    }

    toDescriptor(): IComplexWeight {
        return { type: COMPLEXWEIGHT, real: this._real.clone(), imaginary: this._imaginary.clone() };
    }

    clone(): ComplexWeight {
        return new ComplexWeight(this._real.clone(), this._imaginary.clone());
    }

    protected assessmentInputWeightStrictlyPositiveStatus(real: Weight, imaginary: Weight): void {
        if (real.strictlyPositive !== imaginary.strictlyPositive) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}