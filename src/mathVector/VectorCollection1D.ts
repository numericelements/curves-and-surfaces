import { EM_VECTOR_SPACE_DIMENSION_DIFFER, EM_VECTOR_SPACE_IDENTIFIER_DIFFER, EM_VECTOR_SPACE_TYPE_DIFFER } from "../ErrorMessages/VectorCollection1D";
import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { isIterable } from "../core-utils/TypeChecking";
import type { Vector } from "./interfaces/VectorInterfaces";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { IdentifiableVectorSpace } from "./interfaces/VectorSpaceInterfaces";
import type { VectorDesc } from "./utilityTypes/VectorDescriptorTypes";

export class VectorCollection1D< V extends Vector<any, VectorDesc> = Vector<any, VectorDesc> > 
    implements Iterable<V>
{
    protected readonly _vectors: ReadonlyArray<V>;
    private readonly _vectorSpace: IdentifiableVectorSpace<VectorDesc>;
    private readonly _weightManagement?: WeightManagement;
    private readonly _spaceDimension: number;


    constructor(items: V);
    constructor(items: Iterable<V>);
    constructor(items: V | Iterable<V>) {
        const tmp: V[] = [];
        if (items !== undefined) {
            if (isIterable<V>(items)) {
                // items is iterable
                for (const v of items) {
                    tmp.push(v);
                }
            } else {
                // single element
                tmp.push(items);
            }
        }
        this._vectors = tmp;
        this._vectorSpace = this._vectors[0].vectorSpace;
        this._spaceDimension = this._vectorSpace.dimension();
        if (this._vectorSpace instanceof ProjectiveRealVectorSpace || this._vectorSpace instanceof ProjectiveComplexVectorSpace) {
            this._weightManagement = this._vectorSpace.weightManagement;
        }
        this.checkConsistency();
    }

    private checkConsistency(): void {
        const first = this._vectors[0];
        for (const v of this._vectors) {
            this.validateCollectionParameters(v);
        }
    }

    // There is no need to validate the weight management of a collection because the weight management is uniquely assigned to
    // a vector space. Consequently, a valid vector space ensures a valid weight management parameter, whenever applicable
    private validateCollectionParameters(v: V): void {
        const vSpaceType = v.vectorSpace.spaceType;
        if (this._vectorSpace !== undefined && vSpaceType !== this._vectorSpace.spaceType) {
            const error = sendRangeErrorMessage(this.constructor.name, 'push', EM_VECTOR_SPACE_TYPE_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        if ( this._spaceDimension !== undefined && v.dimension !== this._spaceDimension) {
            const error = sendRangeErrorMessage(this.constructor.name, 'push', EM_VECTOR_SPACE_DIMENSION_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        if (this._vectorSpace !== undefined && v.vectorSpace.id !== this._vectorSpace!.id) {
            const error = sendRangeErrorMessage(this.constructor.name, 'push', EM_VECTOR_SPACE_IDENTIFIER_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    [Symbol.iterator](): Iterator<V> {
        let i = 0;
        const arr = this._vectors;
        return {
            next(): IteratorResult<V> {
                if (i < arr.length) { return { value: arr[i++], done: false }; }
                else { return { value: undefined as any, done: true }; }
            }
        };
    }

    get length(): number { return this._vectors.length; }

    get vectorSpace(): IdentifiableVectorSpace<VectorDesc> {
        return this._vectorSpace;
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }

    get weightManagement(): WeightManagement | undefined {
        return this._weightManagement;
    }

    get vectorCollection(): ReadonlyArray<V> {
        return this._vectors;
    }

    withPushed(v: V): VectorCollection1D<V> {
        return new VectorCollection1D<V>([...this._vectors, v]);
    }

    withInserted(index: number, v: V): VectorCollection1D<V> {
        if (index < 0 || index > this._vectors.length) throw new RangeError('index out of range');
        return new VectorCollection1D<V>([
            ...this._vectors.slice(0, index), v,
            ...this._vectors.slice(index)
        ]);
    }

    withReplacedAt(index: number, vector: V): VectorCollection1D<V> {
        if (typeof vector !== typeof this._vectors[0]) {
            throw new RangeError();
        } else if(index < 0 || index >= this._vectors.length) {
            throw new RangeError();
        }
        return new VectorCollection1D<V>([
            ...this._vectors.slice(0, index),
            vector,
            ...this._vectors.slice(index + 1)
        ]);
    }

    withoutAt(index: number): VectorCollection1D<V> {
        if (index < 0 || index >= this._vectors.length) throw new RangeError('index out of range');
        if (this._vectors.length === 1) throw new RangeError('cannot remove last vector: collection must contain at least one vector');
        return new VectorCollection1D<V>([
            ...this._vectors.slice(0, index),
            ...this._vectors.slice(index + 1)
        ]);
    }

    reverted(): VectorCollection1D<V> {
        return new VectorCollection1D<V>([...this._vectors].reverse());
    }

    get(index: number): V {
        if (index < 0 || index >= this._vectors.length) { throw new RangeError(); }
        return this._vectors[index];
    }

    clone(): VectorCollection1D<V> {
        const clonedVectors = this._vectors.map(v => v.clone() as V);
        return new VectorCollection1D(clonedVectors);
    }

    toArray(): ReadonlyArray<readonly number[]> {
        return this._vectors.map(vector => vector.toArray());
    }

    toString(): string[] {
        return this._vectors.map(vector => vector.toString());
    }
}