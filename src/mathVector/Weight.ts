import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";

export class Weight {

    private readonly _type: typeof WEIGHT;
    private readonly _strictlyPositive: boolean;
    protected _value: number;

    constructor(weight?: number, strictlyPositive: boolean = true) {
        this._type = WEIGHT;
        this._strictlyPositive = strictlyPositive;
        if(weight !== undefined && this._strictlyPositive) {
            this.assessmentInputWeightValueStrictlyPositive(weight);
            this._value = weight;
        } else if(weight !== undefined && !this._strictlyPositive) {
            this.assessmentInputWeightValue(weight);
            this._value = weight;
        } else {
            this._value = DEFAULT_WEIGHT_VALUE;
        }
    }

    get value(): number {
        return this._value;
    }

    get strictlyPositive(): boolean {
        return this._strictlyPositive;
    }

    get type(): typeof WEIGHT {
        return this._type;
    }

    clone(): Weight {
        return new Weight(this._value, this._strictlyPositive);
    }

    toString(): string {
        return WEIGHT + `(value: ${this._value}, strictlyPositive: ${this._strictlyPositive})`;
    }

    protected assessmentInputWeightValueStrictlyPositive(weight: number): void {
        if (weight <= 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    protected assessmentInputWeightValue(weight: number): void {
        if (weight < 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}