import { INVALID_VS_DIMENSION, VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { ComplexVector1D, ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVector1D, RealVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";
import type { ComplexVector2D, ProjectiveComplexVector1D, ProjectiveRealVector2D, ProjectiveRealVector3D, RealVector2D, RealVector3D, RealVector4D } from "./VectorDescriptorConstructorInterface";
import { getVectorSpaceTypeAndDimension, getVectorDescriptorInfo } from "./VectorSpaceUtilities";



export class VectorDescriptorCollection1D <T extends VectorDesc = VectorDesc> {

    protected _vectorCollection: Array<T>;
    protected _type: string;
    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;

    constructor(vectorDescriptorArray?: Array<T>) {
        this._spaceDimension = INVALID_VS_DIMENSION;
        this._vectorSpaceType = VectorSpaceType.UNKNOWN_VECTORSPACE;
        if(vectorDescriptorArray !== undefined && vectorDescriptorArray.length > 0) {
            this._vectorCollection = vectorDescriptorArray;
            this.checkTypeConsistency();
            this._type = getVectorDescriptorInfo(this._vectorCollection[0]).typeString;
            const { type: vectorSpaceType, dimension: spaceDimension } = getVectorSpaceTypeAndDimension(this._vectorCollection[0]);
            this._vectorSpaceType = vectorSpaceType;
            this._spaceDimension = spaceDimension;
        } else {
            this._vectorCollection = [];
            this._type = getVectorDescriptorInfo(this._vectorCollection[0]).typeString;
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

    get vectorCollection(): ReadonlyArray<T> {
        return this._vectorCollection;
    }

    get length(): number {
        return this._vectorCollection.length;
    }

    get type(): string {
        return this._type;
    }

    get vectorSpaceType(): VectorSpaceType {
        return this._vectorSpaceType;
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }

    isRealVectorSpace(): this is VectorDescriptorCollection1D<RealVectorDesc> {
        return this._vectorSpaceType === VectorSpaceType.REAL;
    }

    isComplexVectorSpace(): this is VectorDescriptorCollection1D<ComplexVectorDesc> {
        return this._vectorSpaceType === VectorSpaceType.COMPLEX;
    }

    isProjectiveRealVectorSpace(): this is VectorDescriptorCollection1D<ProjectiveRealVectorDesc> {
        return this._vectorSpaceType === VectorSpaceType.PROJECTIVEREAL;
    }

    isProjectiveComplexVectorSpace(): this is VectorDescriptorCollection1D<ProjectiveComplexVectorDesc> {
        return this._vectorSpaceType === VectorSpaceType.PROJECTIVECOMPLEX;
    }

    is1D(): boolean {
        return this._spaceDimension === 1;
    }

    is2D(): boolean {
        return this._spaceDimension === 2;
    }

    is3D(): boolean {
        return this._spaceDimension === 3;
    }

    is4D(): boolean {
        return this._spaceDimension === 4;
    }

    checkTypeConsistency(): void {
        const refType = typeof this._vectorCollection[0];
        for(const vector of this._vectorCollection) {
            if (typeof vector !== refType) {
                throw new RangeError();
            }
        }
    }

    getVector(index: number): T {
        if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return this._vectorCollection[index];
    }

    withReplacedAt(index: number, vector: T): VectorDescriptorCollection1D<T> {
        if (typeof vector !== typeof this._vectorCollection[0]) {
            throw new RangeError();
        } else if(index < 0 || index >= this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorDescriptorCollection1D<T>([
            ...this._vectorCollection.slice(0, index),
            vector,
            ...this._vectorCollection.slice(index + 1)
        ]);
    }

    withPushed(vector: T): VectorDescriptorCollection1D<T> {
        if (this._vectorCollection.length > 0 && typeof vector !== typeof this._vectorCollection[0]) {
            throw new RangeError();
        }
        return new VectorDescriptorCollection1D<T>([...this._vectorCollection, vector]);
    }

    reverted(): VectorDescriptorCollection1D<T> {
        return new VectorDescriptorCollection1D<T>([...this._vectorCollection].reverse());
    }

    withInserted(index: number, vector: T): VectorDescriptorCollection1D {
        if (typeof vector !== typeof this._vectorCollection[0]) {
            throw new RangeError();
        } else if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorDescriptorCollection1D([...this._vectorCollection.slice(0, index), vector, ...this._vectorCollection.slice(index)]);
    }

    withoutAt(index: number): VectorDescriptorCollection1D {
        if(index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorDescriptorCollection1D([...this._vectorCollection.slice(0, index), ...this._vectorCollection.slice(index + 1)]);
    }

    isNullLength(): boolean {
        let isNullLength = false;
        if(this._vectorCollection.length === 0) isNullLength = true;
        return isNullLength;
    }   

    clone(): VectorDescriptorCollection1D {
        return new VectorDescriptorCollection1D([...this._vectorCollection]);
    }
}

export function createVectorCollection1D(vectors: number[]): VectorDescriptorCollection1D<number>;
export function createVectorCollection1D(vectors: RealVector1D[]): VectorDescriptorCollection1D<RealVector1D>;
export function createVectorCollection1D(vectors: RealVector2D[]): VectorDescriptorCollection1D<RealVector2D>;
export function createVectorCollection1D(vectors: RealVector3D[]): VectorDescriptorCollection1D<RealVector3D>;
export function createVectorCollection1D(vectors: RealVector4D[]): VectorDescriptorCollection1D<RealVector4D>;
export function createVectorCollection1D(vectors: ComplexVector1D[]): VectorDescriptorCollection1D<ComplexVector1D>;
export function createVectorCollection1D(vectors: ComplexVector2D[]): VectorDescriptorCollection1D<ComplexVector2D>;
export function createVectorCollection1D(vectors: ProjectiveRealVector2D[]): VectorDescriptorCollection1D<ProjectiveRealVector2D>;
export function createVectorCollection1D(vectors: ProjectiveRealVector3D[]): VectorDescriptorCollection1D<ProjectiveRealVector3D>;
export function createVectorCollection1D(vectors: ProjectiveComplexVector1D[]): VectorDescriptorCollection1D<ProjectiveComplexVector1D>;
export function createVectorCollection1D<T extends VectorDesc>(vectors: T[]): VectorDescriptorCollection1D<T>;
export function createVectorCollection1D<T extends VectorDesc>(vectors: T[]): VectorDescriptorCollection1D<T> {
    return new VectorDescriptorCollection1D(vectors);
}