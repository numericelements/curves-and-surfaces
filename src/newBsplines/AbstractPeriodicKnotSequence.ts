import { AbstractKnotSequenceCurve } from "./AbstractKnotSequenceCurve";
import { KnotIndexInterface } from "./Knot";


export abstract class AbstractPeriodicKnotSequence extends AbstractKnotSequenceCurve {

    // protected _knotSequence: Knot[];
    protected abstract _index: KnotIndexInterface;
    protected abstract _end: KnotIndexInterface;

    constructor(degree: number) {
        super(degree);

    }

    // get knotSequence() {
    //     let result = [...this.knotSequence];
    //     return result;
    // }

}