import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { Complex } from "./Complex";
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
            this._imaginary = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
        } else {
            // Deactivated method to set the imaginary weight free of strict positivity constraint
            // because the default imaginary weight value is 0
            // this.assessmentInputWeightStrictlyPositiveStatus(this._real, imaginary);
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

    toComplex(): Complex {
        return new Complex(this._real.value, this._imaginary.value);
    }

    clone(): ComplexWeight {
        return new ComplexWeight(this._real.clone(), this._imaginary.clone());
    }

    // This method is deactivated to be able to create imaginary weights that are not strictly positive for all categories of weight management
    // private assessmentInputWeightStrictlyPositiveStatus(real: Weight, imaginary: Weight): void {
    //     if (real.strictlyPositive !== imaginary.strictlyPositive) {
    //         const error = new ErrorLog(this.constructor.name, "constructor");
    //         error.addMessage(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
    //         console.log(error.generateMessageString());
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }
}