import { ErrorLog } from "../errorProcessing/ErrorLoging";

export abstract class AbstractIndexKnotSeq implements knotIndex {
    protected _index: number;

    constructor(index: number) {
        if(Number.isInteger(index)) {
            this._index = index;
        } else {
            const error = new ErrorLog(this.constructor.name, "AbstractIndexKnotSeq", "parameter input must be an integer");
            error.logMessageToConsole();
            this._index = 0;
        }
        
    }
    abstract get position(): number;
    abstract set position(index: number);

    abstract getIndex(): knotIndex;
}


export class IndexIncreasingKnotSeq extends AbstractIndexKnotSeq {

    constructor(index: number) {
        super(index);
        this._index = index;
    }

    get position() {
        return this._index;
    }

    set position(index: number) {
        this._index = index;
    }

    getIndex(): IndexIncreasingKnotSeq {
        let index = new IndexIncreasingKnotSeq(this._index)
        return index;
    }

}

export class IndexStrictlyIncreasingKnotSeq extends AbstractIndexKnotSeq {

    constructor(index: number) {
        super(index);
        this._index = index;
    }

    get position() {
        return this._index;
    }

    set position(index: number) {
        this._index = index;
    }

    getIndex(): IndexStrictlyIncreasingKnotSeq {
        let index = new IndexStrictlyIncreasingKnotSeq(this._index)
        return index;
    }
}

export interface knotIndex {
    getIndex(): knotIndex;
}

export interface Iterator<T> {
    current(): number;

    next(): number;

    // Return the key of the current element.
    key(): T;

    // Checks if current position is valid.
    valid(): boolean;

    // Rewind the Iterator to the first element.
    rewind(): void;
}

export interface KnotSequence {
    getIterator(): Iterator<IndexIncreasingKnotSeq>;

    getStrictlyIncIterator(): Iterator<IndexStrictlyIncreasingKnotSeq>;
}

export interface KnotSequenceIterator {
    current(): number;

    next(): number;

    key(): knotIndex;

    valid(): boolean;

    rewind(): void;
}


export class IncreasingKnotSeqIterator implements Iterator<IndexIncreasingKnotSeq> {
    
    private knotsequence: KnotSequenceTest;
    private position: IndexIncreasingKnotSeq = new IndexIncreasingKnotSeq(0);

    constructor(knotSequence: KnotSequenceTest) {
        this.knotsequence = knotSequence;
        this.position = new IndexIncreasingKnotSeq(knotSequence.getLength(this) - 1);
    }

    rewind(): void {
        this.position = new IndexIncreasingKnotSeq(0);
    }

    current(): number {
        return this.knotsequence.getKnots(this)[this.position.position];
    }

    key(): IndexIncreasingKnotSeq {
        return this.position;
    }

    next(): number {
        const item = this.knotsequence.getKnots(this)[this.position.position];
        this.position = new IndexIncreasingKnotSeq(this.position.position + 1);
        return item;
    }

    valid(): boolean {
        return this.position.position < this.knotsequence.getLength(this);
    }
}

export class StrictlyIncreasingKnotSeqIterator implements Iterator<IndexStrictlyIncreasingKnotSeq> {
    
    private knotsequence: KnotSequenceTest;
    private position: IndexStrictlyIncreasingKnotSeq = new IndexStrictlyIncreasingKnotSeq(0);

    constructor(knotSequence: KnotSequenceTest) {
        this.knotsequence = knotSequence;
        this.position = new IndexStrictlyIncreasingKnotSeq(knotSequence.getLength(this) - 1);
    }

    rewind(): void {
        this.position = new IndexStrictlyIncreasingKnotSeq(0);
    }

    current(): number {
        return this.knotsequence.getKnots(this)[this.position.position];
    }

    key(): IndexStrictlyIncreasingKnotSeq {
        return this.position;
    }

    next(): number {
        const item = this.knotsequence.getKnots(this)[this.position.position];
        this.position = new IndexStrictlyIncreasingKnotSeq(this.position.position + 1);
        return item;
    }

    valid(): boolean {
        return this.position.position < this.knotsequence.getLength(this);
    }
}

export class KnotSequenceTest implements KnotSequence {
    private items: number[] = [];

    public positionIncSeq: IndexIncreasingKnotSeq;
    public positionStrictIncSeq: IndexStrictlyIncreasingKnotSeq;

    constructor(items: number[]) {
        this.items = items;
        this.positionIncSeq = new IndexIncreasingKnotSeq(0);
        this.positionStrictIncSeq = new IndexStrictlyIncreasingKnotSeq(0);
    }

    getKnots(iterator: KnotSequenceIterator): number[] {
        return this.items;
    }

    getLength(iterator: KnotSequenceIterator): number {
        return this.items.length;
    }

    addItem(item: number): void {
        this.items.push(item);
    }

    getIterator(): Iterator<IndexIncreasingKnotSeq> {
        return new IncreasingKnotSeqIterator(this);
    }

    getStrictlyIncIterator(): Iterator<IndexStrictlyIncreasingKnotSeq> {
        return new StrictlyIncreasingKnotSeqIterator(this);
    }

    knotMutiplicity(abscissa: number): number {
        let multiplicity = 1;
        return multiplicity;
    }

    knotMultiplicityAtIndex(index: knotIndex): number {
        let multiplicity = 1;
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number): boolean {
        let insert = true;
        return insert;
    }

    insertKnotAtIndex(index: knotIndex, multiplicity: number): boolean {
        let insert = true;
        return insert;
    }

    incrementKnotMultiplicity(index: knotIndex, multiplicity: number) {

    }

    findSpan(abscissa: number, iterator: KnotSequenceIterator): knotIndex {
        return this.positionIncSeq;
    }

    checkConsistencyNonUniformBSpline(degree: number) {

    }

    checkConsistencyPeriodicBSpline(degree: number) {

    }
}

