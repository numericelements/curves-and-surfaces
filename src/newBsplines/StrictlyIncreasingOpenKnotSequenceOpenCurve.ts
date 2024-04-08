import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./KnotSequence";
import { StrictlyIncreasingOpenKnotSequenceCurve } from "./StrictlyIncreasingOpenKnotSequenceCurve";

export class StrictlyIncreasingOpenKnotSequenceOpenCurve extends StrictlyIncreasingOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexStrictlyIncreasingSequence;
    protected _end: KnotIndexStrictlyIncreasingSequence;

    constructor(degree: number, knots: number[], multiplicities: number[]) {
        super(degree, knots, multiplicities);
        this.knotSequence = [];
        this._index = new KnotIndexStrictlyIncreasingSequence();
        this._end = new KnotIndexStrictlyIncreasingSequence(Infinity);
        if(knots.length !== multiplicities.length) {
            const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
            error.logMessageToConsole();
        }
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this.checkCurveOrigin();
        this.checkDegreeConsistency();
    }

    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this not sequence.");
            error.logMessageToConsole();
        }
    }
}