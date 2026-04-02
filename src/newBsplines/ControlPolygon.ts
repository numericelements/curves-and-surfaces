import { isIterable } from "../core-utils/TypeChecking";
import { IVector } from "../mathVector/Vector";
import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPoint } from "./CurveEntitiesTypes";

// export class ControlPolygon < V extends IVector<any, Vector>>  extends VectorCollection1D<V>
export class ControlPolygon < V extends Vector, D extends number>  extends VectorCollection1D<IVector<D, V>>
{

    constructor(controlPoints: IVector<D, V>);
    constructor(controlPoints: Iterable<IVector<D, V>>);
    constructor(controlPoints: IVector<D, V> | Iterable<IVector<D, V>>) {
        if (isIterable<IVector<D, V>>(controlPoints)) {
            // controlPoints is iterable
            super(controlPoints);
        } else {
            // single control point
            super(controlPoints);
        }
    }

    get controlPoints(): ReadonlyArray<IVector<D, V>> {
        return this.vectorCollection;
    }

    withMovedControlPoint(index: number, displacement: IVector<D, V>): ControlPolygon<V, D> {
        if (index < 0 || index >= this._vectors.length) {
            throw new RangeError(`withMovedControlPoint: index ${index} out of range [0, ${this._vectors.length - 1}]`);
        }
        const tmp: IVector<D, V>[] = [...this._vectors];
        tmp[index] = tmp[index].add(displacement) as IVector<D, V>;
        return new ControlPolygon<V, D>(tmp);
    }

    translated(transVector: IVector<D, V>): ControlPolygon<V, D> {
        const tmp: IVector<D, V>[] = [];
        this._vectors.forEach((cp, index) => {
            tmp[index] = cp.add(transVector) as IVector<D, V>;
        });
        return new ControlPolygon<V, D>([...tmp]);
    }

    reverted(): ControlPolygon<V, D> {
        return new ControlPolygon<V, D>([...this._vectors].reverse());
    }

    polygonalLength(): number {
        let length = 0;
        for (let i = 0; i < this._vectors.length - 1; i++) {
            const v1 = this._vectors[i];
            const v2 = this._vectors[i + 1];
            length += v1.distanceTo(v2);
        }
        return length;
    }

    edgeLength(index: number): number {
        if (index < 0 || index >= this._vectors.length - 1) {
            throw new RangeError(`edgeLength: index ${index} out of range [0, ${this._vectors.length - 2}]`);
        }
        const v1 = this._vectors[index];
        const v2 = this._vectors[index + 1];
        return v1.distanceTo(v2);
    }
}

/**
 * Factory function that correctly infers the descriptor type V and dimension D
 * from a concrete vector class (e.g. Vector1DTypeComplex → ControlPolygon<ComplexVector1D, 1>).
 *
 * Use this instead of `new ControlPolygon([...])` when TypeScript inference of V is needed.
 */
export function createControlPolygon<IV extends IVector<any, Vector>>(
    vectors: IV[]
): ControlPolygon<IV['descriptor'], IV['dimension']> {
    return new ControlPolygon(vectors);
}
