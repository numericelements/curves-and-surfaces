import { Vector } from "./VectorSpaceConstructorInterface";

export const UNDEFINEDVECTORTYPE = 'UndefinedVectorType' as const;

export interface UndefinedVectorType {
    readonly type: typeof UNDEFINEDVECTORTYPE;
}

export type VectorCollection = Vector | UndefinedVectorType;

export class VectorCollection1D {

    protected _vectorCollection: Array<Vector>;
    protected _type: VectorCollection;

    constructor(vectorArray?: Array<Vector>) {
        if(vectorArray !== undefined) {
            this._vectorCollection = vectorArray;
            this.checkTypeConsistency();
            this._type = this._vectorCollection[0];
        } else {
            this._vectorCollection = [];
            this._type = {type: UNDEFINEDVECTORTYPE};
        }
    }


    [Symbol.iterator]() {
        const lastIndex = this._vectorCollection.length - 1;
        let index = 0;
        return  {
            next: () => {
                if (index <= lastIndex) {
                    const vector = this._vectorCollection[index];
                    index++;
                    return { value: {vector}, done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    get vectorCollection(): Array<Vector> {
        return this._vectorCollection;
    }

    get length(): number {
        return this._vectorCollection.length;
    }

    get type(): VectorCollection {
        return this._type;
    }

    checkTypeConsistency(): void {
        const refType = typeof this._vectorCollection[0];
        for(const vector of this._vectorCollection) {
            if (typeof vector !== refType) {
                throw new RangeError();
            }
        }
    }

    getVector(index: number): Vector {
        if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return this._vectorCollection[index];
    }

    push(vector: Vector): void {
        if(this._vectorCollection.length === 0) {
            this._vectorCollection.push(vector);
            this._type = this._vectorCollection[0];
        } else if (typeof vector === typeof this._vectorCollection[0]) {
            this._vectorCollection.push(vector);
        } else {
            throw new RangeError();
        }
    }

    pop(): Vector {
        const vector = this._vectorCollection.pop();
        if(vector !== undefined) {
            return vector;
        } else {
            throw new RangeError();
        }
    }

    revert(): VectorCollection1D {
        const revertedVectorCollection = new VectorCollection1D();
        for(const vector of this) {
            revertedVectorCollection.push(this.pop());
        }
        return revertedVectorCollection;
    }

    insert(index: number, vector: Vector): VectorCollection1D {
        if (typeof vector !== typeof this._vectorCollection[0]) {
            throw new RangeError();
        } else if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorCollection1D([...this._vectorCollection.slice(0, index), vector, ...this._vectorCollection.slice(index)]);
    }

    remove(index: number): VectorCollection1D {
        if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorCollection1D([...this._vectorCollection.slice(0, index), ...this._vectorCollection.slice(index + 1)]);
    }

    isNullLength(): boolean {
        let isNullLength = false;
        if(this._vectorCollection.length === 0) isNullLength = true;
        return isNullLength;
    }   

    clone(): VectorCollection1D {
        return new VectorCollection1D([...this._vectorCollection]);
    }
}