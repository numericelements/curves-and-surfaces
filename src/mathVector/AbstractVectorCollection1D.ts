import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { IdentifiableVectorSpace } from "./IVectorSpace";
import { IVector } from "./Vector";
import { Vector } from "./VectorSpaceConstructorInterface";

export abstract class AbstractVectorCollection1D<VS extends IdentifiableVectorSpace<V> = IdentifiableVectorSpace<any>, V extends Vector = Vector> {
// implements Iterable<{vector: IVector}>

    protected abstract _vectorSpace: VS;
    protected abstract _vectorCollection: Array<V>;

    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get vectorSpace(): VS;
    abstract get spaceType(): VectorSpaceType;


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
}
