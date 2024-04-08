import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot, KnotIndexIncreasingSequence } from "./KnotSequence";

export class IncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;

    constructor(degree: number, freeKnots: number[]) {
        super(degree);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
    }
}