import { ErrorLog } from "../errorProcessing/ErrorLoging";


export class Knot {

    protected _abscissa: number;
    protected _multiplicity: number;

    constructor(abscissa: number, multiplicity?: number) {
        this._abscissa = abscissa;
        if(multiplicity !== undefined) {
            this._multiplicity = multiplicity;
            if(multiplicity < 1) {
                const error = new ErrorLog(this.constructor.name, "constructor", "Knot multiplicity value out of range");
                error.logMessageToConsole();
            }
        } else {
            this._multiplicity = 1;
        }

    }

    get abscissa() {
        return this._abscissa;
    }

    get multiplicity() {
        return this._multiplicity;
    }

    set abscissa(abscissa: number) {
        this._abscissa = abscissa;
    }

    set multiplicity(multiplicity: number) {
        this._multiplicity = multiplicity;
    }

    incrementMultiplicity(): void {
        this._multiplicity++;
        return
    }

    decrementMultiplicity(): void {
        this._multiplicity--;
        if(this._multiplicity < 1) {

        }
        return
    }
}

export abstract class AbstractKnotIndex {

    protected _knotIndex: number;

    constructor(value?: number) {
        this._knotIndex = 0;
        if(value !== undefined) {
            this._knotIndex = value;
        }
    }

    get knotIndex() {
        return this._knotIndex;
    }

    set knotIndex(value: number) {
        this._knotIndex = value;
        return;
    }
}

export class KnotIndexStrictlyIncreasingSequence extends AbstractKnotIndex {

    constructor(value?: number) {
        super(value);
    }
}

export class KnotIndexIncreasingSequence extends AbstractKnotIndex {

    constructor(value?: number) {
        super(value);

    }
}

export class KnotIndexLastKnotInIncreasingSequence extends AbstractKnotIndex {

    constructor(value?: number) {
        super(value);
    }
}

export interface KnotIndexInterface {
    knotIndex: number;
}

export function getDistinctKnots(knots: number[]): number[] {
    let result = [knots[0]];
    let temp = result[0];
    for (let i = 1; i < knots.length; i += 1) {
        if (knots[i] !== temp) {
            result.push(knots[i]);
            temp = knots[i];
        }
    }
    return result;
}
