/* named constants */
import { INITIAL_INTERV_INDEX } from "./NeighboringEvents";

export class MaxIntervalVariation {
    
    private _index: number;
    private _value: number;

    constructor(intervalIndex?: number, value?: number) {
        if(intervalIndex !== undefined) {
            this._index = intervalIndex;
        } else {
            this._index = INITIAL_INTERV_INDEX;
        }
        if(value !== undefined) {
            this._value = value;
        } else {
            this._value = 0.0;
        }
    }

    get index() {
        return this._index;
    }

    get value() {
        return this._value;
    }

    set index(intervalIndex: number) {
        this._index = intervalIndex;
        return;
    }

    set value(value: number) {
        this._value = value;
        return;
    }

}