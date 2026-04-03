import { isIterable } from "../core-utils/TypeChecking";
import { IVector } from "../mathVector/Vector";
import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";

export class ControlPolygon<IV extends IVector<any, Vector>> extends VectorCollection1D<IV>
{

    constructor(controlPoints: IV);
    constructor(controlPoints: Iterable<IV>);
    constructor(controlPoints: IV | Iterable<IV>) {
        if (isIterable<IV>(controlPoints)) {
            // controlPoints is iterable
            super(controlPoints);
        } else {
            // single control point
            super(controlPoints);
        }
    }

    get controlPoints(): ReadonlyArray<IV> {
        return this.vectorCollection;
    }

    withMovedControlPoint(index: number, displacement: IV): ControlPolygon<IV> {
        if (index < 0 || index >= this._vectors.length) {
            throw new RangeError(`withMovedControlPoint: index ${index} out of range [0, ${this._vectors.length - 1}]`);
        }
        const tmp: IV[] = [...this._vectors];
        tmp[index] = tmp[index].add(displacement) as IV;
        return new ControlPolygon<IV>(tmp);
    }

    translated(transVector: IV): ControlPolygon<IV> {
        const tmp: IV[] = [];
        this._vectors.forEach((cp, index) => {
            tmp[index] = cp.add(transVector) as IV;
        });
        return new ControlPolygon<IV>([...tmp]);
    }

    reverted(): ControlPolygon<IV> {
        return new ControlPolygon<IV>([...this._vectors].reverse());
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
export function createControlPolygon<IV extends IVector<any, Vector>>(
    vectors: IV[]
): ControlPolygon<IV> {
    return new ControlPolygon(vectors);
}
