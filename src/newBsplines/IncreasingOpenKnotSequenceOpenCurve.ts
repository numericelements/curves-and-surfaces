import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { IncreasingOpenKnotSequenceCurve } from "./IncreasingOpenKnotSequenceCurve";
import { Knot, KnotIndexIncreasingSequence } from "./Knot";


export class IncreasingOpenKnotSequenceOpenCurve extends IncreasingOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;

    constructor(degree: number, knots: number[]) {
        super(degree, knots);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        if(knots.length < 1) {
            const error = new ErrorLog(this.constructor.name, "constructor", "null length knot sequence cannot be processed.");
            error.logMessageToConsole();
        }
        this.knotSequence.push(new Knot(knots[0], 1));
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knots[i], 1));
            }
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