import { INVALID_VS_DIMENSION, VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ComplexVector, ComplexVector1D, ComplexVector2D, ProjectiveComplexVector, ProjectiveComplexVector1D, ProjectiveVector, ProjectiveVector2D, ProjectiveVector3D, RealVector, REALVECTOR1D, RealVector1D, RealVector2D, RealVector3D, RealVector4D, UndefinedVectorType, Vector, VECTOR_TYPE_INFO } from "./VectorSpaceConstructorInterface";
import { getVectorSpaceTypeAndDimension, getVectorTypeInfo } from "./VectorSpaceUtilities";



export class VectorCollection1D <T extends Vector = Vector> {

    protected _vectorCollection: Array<T>;
    protected _type: string;
    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;

    constructor(vectorArray?: Array<T>) {
        this._spaceDimension = INVALID_VS_DIMENSION;
        this._vectorSpaceType = VectorSpaceType.UNKNOWN_VECTORSPACE;
        if(vectorArray !== undefined && vectorArray.length > 0) {
            this._vectorCollection = vectorArray;
            this.checkTypeConsistency();
            this._type = getVectorTypeInfo(this._vectorCollection[0]).typeString;
            const { type: vectorSpaceType, dimension: spaceDimension } = getVectorSpaceTypeAndDimension(this._vectorCollection[0]);
            this._vectorSpaceType = vectorSpaceType;
            this._spaceDimension = spaceDimension;
        } else {
            this._vectorCollection = [];
            this._type = getVectorTypeInfo(this._vectorCollection).typeString;
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

    get vectorCollection(): Array<T> {
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

    isRealVectorSpace(): this is VectorCollection1D<RealVector> {
        return this._vectorSpaceType === VectorSpaceType.REAL;
    }

    isComplexVectorSpace(): this is VectorCollection1D<ComplexVector> {
        return this._vectorSpaceType === VectorSpaceType.COMPLEX;
    }

    isProjectiveVectorSpace(): this is VectorCollection1D<ProjectiveVector> {
        return this._vectorSpaceType === VectorSpaceType.PROJECTIVE;
    }

    isProjectiveComplexVectorSpace(): this is VectorCollection1D<ProjectiveComplexVector> {
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

    push(vector: T): void {
        if(this._vectorCollection.length === 0) {
            this._vectorCollection.push(vector);
            this._type = getVectorTypeInfo(this._vectorCollection[0]).typeString;
        } else if (typeof vector === typeof this._vectorCollection[0]) {
            this._vectorCollection.push(vector);
        } else {
            throw new RangeError();
        }
    }

    pop(): T {
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

    insert(index: number, vector: T): VectorCollection1D {
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

export function createVectorCollection1D(vectors: number[]): VectorCollection1D<number>;
export function createVectorCollection1D(vectors: RealVector1D[]): VectorCollection1D<RealVector1D>;
export function createVectorCollection1D(vectors: RealVector2D[]): VectorCollection1D<RealVector2D>;
export function createVectorCollection1D(vectors: RealVector3D[]): VectorCollection1D<RealVector3D>;
export function createVectorCollection1D(vectors: RealVector4D[]): VectorCollection1D<RealVector4D>;
export function createVectorCollection1D(vectors: ComplexVector1D[]): VectorCollection1D<ComplexVector1D>;
export function createVectorCollection1D(vectors: ComplexVector2D[]): VectorCollection1D<ComplexVector2D>;
export function createVectorCollection1D(vectors: ProjectiveVector2D[]): VectorCollection1D<ProjectiveVector2D>;
export function createVectorCollection1D(vectors: ProjectiveVector3D[]): VectorCollection1D<ProjectiveVector3D>;
export function createVectorCollection1D(vectors: ProjectiveComplexVector1D[]): VectorCollection1D<ProjectiveComplexVector1D>;
export function createVectorCollection1D<T extends Vector>(vectors: T[]): VectorCollection1D<T>;
export function createVectorCollection1D<T extends Vector>(vectors: T[]): VectorCollection1D<T> {
    return new VectorCollection1D(vectors);
}