import { isIterable } from "../core-utils/TypeChecking";
import { Vector } from "../mathVector/interfaces/VectorInterfaces";
import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";

export class ControlPolygon<V extends Vector<any, VectorDesc>> extends VectorCollection1D<V>
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
 * Factory function that correctly infers the concrete vector type IV
 * from an array of vectors (e.g. Vector1DTypeComplex[] → ControlPolygon<Vector1DTypeComplex>).
 */
export function createControlPolygon<IV extends Vector<any, VectorDesc>>(
    vectors: IV[]
): ControlPolygon<IV> {
    return new ControlPolygon(vectors);
}
