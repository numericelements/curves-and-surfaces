import { WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";

export class VertexR1 {

    private _index: number;
    private _value: number;

    constructor(index: number, value: number) {
        this._index = index;
        this._value = value;
    }

    get index() {
        return this._index;
    }

    get value() {
        return this._value;
    }

    set index(index: number) {
        this._index = index;
    }

    set value(value: number) {
        this._value = value;
    }

    checkIndex(): number {
        let code = 0;
        if(this._index < 0) {
            const warning = new WarningLog(this.constructor.name, "checkIndex", "Inconsistent vertex index");
            warning.logMessageToConsole();
            code = RETURN_ERROR_CODE;
        } return code;
    }
}