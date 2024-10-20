import { ErrorLog } from "../errorProcessing/ErrorLoging";

export const DEFAULT_KNOT_INDEX = Infinity;
export const DEFAULT_KNOT_ABSCISSA_VALUE = Infinity;
export const EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA = "Knot abscissa value out of range. Cannot proceed.";
export const EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY = "Knot multiplicity value out of range. Cannot proceed.";
export const EM_KNOT_DECREMENT_KNOT_MULTIPLICITY = "Encountered a knot multiplicity smaller than one when decrementing. Cannot proceed.";
export const EM_KNOT_INDEX_VALUE = "Knot index is negative. Must be positive or null. Cannot proceed.";
export const EM_KNOT_INCREMENT_DECREMENT = "Knot multiplicity cannot be incremented/decremented by an increment/decrement value smaller than one."

export class Knot {

    protected _abscissa: number;
    protected _multiplicity: number;

    constructor(abscissa?: number, multiplicity?: number) {
        if(abscissa !== undefined) {
            if(abscissa === DEFAULT_KNOT_ABSCISSA_VALUE) {
                this.throwRangeErrorMessage("constructor", EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
            }
            this._abscissa = abscissa;
        } else {
            this._abscissa = DEFAULT_KNOT_ABSCISSA_VALUE;
        }
        if(multiplicity !== undefined) {
            if(multiplicity < 1) {
                this.throwRangeErrorMessage("constructor", EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
            }
            this._multiplicity = multiplicity;
        } else {
            this._multiplicity = 1;
        }
    }

    get abscissa(): number {
        return this._abscissa;
    }

    get multiplicity(): number {
        return this._multiplicity;
    }

    set abscissa(abscissa: number) {
        if(abscissa === DEFAULT_KNOT_ABSCISSA_VALUE) {
            this.throwRangeErrorMessage("abscissa_setter", EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        } else {
            this._abscissa = abscissa;
        }
    }

    set multiplicity(multiplicity: number) {
        if(multiplicity < 1) {
            this.throwRangeErrorMessage("multiplicity_setter", EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        } else {
            this._multiplicity = multiplicity;
        }
    }

    incrementMultiplicity(increment: number = 1): void {
        if(increment < 1) this.throwRangeErrorMessage("incrementMultiplicity", EM_KNOT_INCREMENT_DECREMENT);
        this._multiplicity = this._multiplicity + increment;
        return
    }

    decrementMultiplicity(decrement: number = 1): void {
        if(decrement < 1) this.throwRangeErrorMessage("incrementMultiplicity", EM_KNOT_INCREMENT_DECREMENT);
        if(this._multiplicity < (decrement + 1)) {
            this.throwRangeErrorMessage("decrementMultiplicity", EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        } else {
            this._multiplicity = this._multiplicity - decrement;
        }
        return
    }

    throwRangeErrorMessage(functionName: string, message: string): void {
        const error = new ErrorLog(this.constructor.name, functionName);
        error.addMessage(message);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
}


export interface IncreasingSequence {
    type: 'KnotIndexIncreasingSequence';
    index : number;
}

export interface StrictlyIncreasingSequence {
    type: 'KnotIndexStrictlyIncreasingSequence';
    index : number;
}

export type AbstractKnotIndex_type = IncreasingSequence | StrictlyIncreasingSequence;

export interface KnotIndexInterface {
    knotIndex: number;
}

export abstract class AbstractKnotIndex {

    protected abstract _knotIndex: AbstractKnotIndex_type;

    constructor(value: number) {
        this.assessmentInputIndexValue(value);
    }

    get knotIndex() {
        return this._knotIndex.index;
    }

    set knotIndex(value: number) {
        this.assessmentInputIndexValue(value);
        this._knotIndex.index = value;
        return;
    }

    assessmentInputIndexValue(value: number): void {
        if(value < 0) {
            const error = new ErrorLog(this.constructor.name, "constructor");
            error.addMessage(EM_KNOT_INDEX_VALUE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }

}

export class KnotIndexStrictlyIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: StrictlyIncreasingSequence;

    constructor(value: number) {
        super(value);
        this._knotIndex = {type: 'KnotIndexStrictlyIncreasingSequence', index: value};
    }
}

export class KnotIndexIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: IncreasingSequence;

    constructor(value: number) {
        super(value);
        this._knotIndex = {type: 'KnotIndexIncreasingSequence', index: value};
    }
}
