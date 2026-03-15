import { isIterable } from "../core-utils/TypeChecking";
import { IVector } from "../mathVector/Vector";
import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";

export class ControlPolygon < V extends IVector<any, Vector>>  extends VectorCollection1D<V>
{
    constructor(controlPoints: V);
    constructor(controlPoints: Iterable<V>);
    constructor(controlPoints: V | Iterable<V>) {
        if (isIterable<V>(controlPoints)) {
            // controlPoints is iterable
            super(controlPoints);
        } else {
            // single control point
            super(controlPoints);
        }
    }

    get controlPoints(): ReadonlyArray<V> {
        return this.vectorCollection;
    }

    withMovedControlPoint(index: number, displacement: V): ControlPolygon<V> {
        if (index < 0 || index >= this._vectors.length) {
            throw new RangeError(`withMovedControlPoint: index ${index} out of range [0, ${this._vectors.length - 1}]`);
        }
        const tmp: V[] = [...this._vectors];
        tmp[index] = tmp[index].add(displacement) as V;
        return new ControlPolygon<V>(tmp);
    }

    translated(transVector: V): ControlPolygon<V> {
        const tmp: V[] = [];
        this._vectors.forEach((cp, index) => {
            tmp[index] = cp.add(transVector) as V;
        });
        return new ControlPolygon<V>([...tmp]);
    }

    reverted(): ControlPolygon<V> {
        return new ControlPolygon<V>([...this._vectors].reverse());
    }
}
