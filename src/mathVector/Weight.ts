import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "./VectorSpaceConstructorInterface";

export class Weight {

    private readonly type: typeof WEIGHT;
    private readonly _strictlyPositive: boolean;
    protected _weight: number;

    constructor(weight?: number, strictlyPositive: boolean = true) {
        this.type = WEIGHT;
        this._strictlyPositive = strictlyPositive;
        if(weight !== undefined && this._strictlyPositive) {
            this.assessmentInputWeightValueStrictlyPositive(weight);
            this._weight = weight;
        } else if(weight !== undefined && !this._strictlyPositive) {
            this.assessmentInputWeightValue(weight);
            this._weight = weight;
        } else {
            this._weight = DEFAULT_WEIGHT_VALUE;
        }
    }

    get weight(): number {
        return this._weight;
    }

    get strictlyPositive(): boolean {
        return this._strictlyPositive;
    }

    set weight(weight: number) {
        if(this.strictlyPositive) {
            this.assessmentInputWeightValueStrictlyPositive(weight);
        } else {
            this.assessmentInputWeightValue(weight);
        }
        this._weight = weight;
    }

    protected assessmentInputWeightValueStrictlyPositive(weight: number) {
        if (weight <= 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    protected assessmentInputWeightValue(weight: number) {
        if (weight < 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_WEIGHT_VALUE_POSITIVE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
}