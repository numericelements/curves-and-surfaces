"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVectorCollection1D = exports.VectorCollection1D = void 0;
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
class VectorCollection1D {
    constructor(vectorArray) {
        this._spaceDimension = BSplineR1toRn_1.INVALID_VS_DIMENSION;
        this._vectorSpaceType = BSplineR1toRn_1.VectorSpaceType.UNKNOWN_VECTORSPACE;
        if (vectorArray !== undefined && vectorArray.length > 0) {
            this._vectorCollection = vectorArray;
            this.checkTypeConsistency();
            this._type = (0, VectorSpaceUtilities_1.getVectorTypeInfo)(this._vectorCollection[0]).typeString;
            const { type: vectorSpaceType, dimension: spaceDimension } = (0, VectorSpaceUtilities_1.getVectorSpaceTypeAndDimension)(this._vectorCollection[0]);
            this._vectorSpaceType = vectorSpaceType;
            this._spaceDimension = spaceDimension;
        }
        else {
            this._vectorCollection = [];
            this._type = (0, VectorSpaceUtilities_1.getVectorTypeInfo)(this._vectorCollection).typeString;
        }
    }
    [Symbol.iterator]() {
        const lastIndex = this._vectorCollection.length - 1;
        let index = 0;
        return {
            next: () => {
                if (index <= lastIndex) {
                    const vector = this._vectorCollection[index];
                    index++;
                    return { value: { vector }, done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    }
    get vectorCollection() {
        return this._vectorCollection;
    }
    get length() {
        return this._vectorCollection.length;
    }
    get type() {
        return this._type;
    }
    get vectorSpaceType() {
        return this._vectorSpaceType;
    }
    get spaceDimension() {
        return this._spaceDimension;
    }
    isRealVectorSpace() {
        return this._vectorSpaceType === BSplineR1toRn_1.VectorSpaceType.REAL;
    }
    isComplexVectorSpace() {
        return this._vectorSpaceType === BSplineR1toRn_1.VectorSpaceType.COMPLEX;
    }
    isProjectiveVectorSpace() {
        return this._vectorSpaceType === BSplineR1toRn_1.VectorSpaceType.PROJECTIVE;
    }
    isProjectiveComplexVectorSpace() {
        return this._vectorSpaceType === BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX;
    }
    is1D() {
        return this._spaceDimension === 1;
    }
    is2D() {
        return this._spaceDimension === 2;
    }
    is3D() {
        return this._spaceDimension === 3;
    }
    is4D() {
        return this._spaceDimension === 4;
    }
    checkTypeConsistency() {
        const refType = typeof this._vectorCollection[0];
        for (const vector of this._vectorCollection) {
            if (typeof vector !== refType) {
                throw new RangeError();
            }
        }
    }
    getVector(index) {
        if (index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return this._vectorCollection[index];
    }
    push(vector) {
        if (this._vectorCollection.length === 0) {
            this._vectorCollection.push(vector);
            this._type = (0, VectorSpaceUtilities_1.getVectorTypeInfo)(this._vectorCollection[0]).typeString;
        }
        else if (typeof vector === typeof this._vectorCollection[0]) {
            this._vectorCollection.push(vector);
        }
        else {
            throw new RangeError();
        }
    }
    pop() {
        const vector = this._vectorCollection.pop();
        if (vector !== undefined) {
            return vector;
        }
        else {
            throw new RangeError();
        }
    }
    revert() {
        const revertedVectorCollection = new VectorCollection1D();
        for (const vector of this) {
            revertedVectorCollection.push(this.pop());
        }
        return revertedVectorCollection;
    }
    insert(index, vector) {
        if (typeof vector !== typeof this._vectorCollection[0]) {
            throw new RangeError();
        }
        else if (index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorCollection1D([...this._vectorCollection.slice(0, index), vector, ...this._vectorCollection.slice(index)]);
    }
    remove(index) {
        if (index < 0 || index > this._vectorCollection.length) {
            throw new RangeError();
        }
        return new VectorCollection1D([...this._vectorCollection.slice(0, index), ...this._vectorCollection.slice(index + 1)]);
    }
    isNullLength() {
        let isNullLength = false;
        if (this._vectorCollection.length === 0)
            isNullLength = true;
        return isNullLength;
    }
    clone() {
        return new VectorCollection1D([...this._vectorCollection]);
    }
}
exports.VectorCollection1D = VectorCollection1D;
function createVectorCollection1D(vectors) {
    return new VectorCollection1D(vectors);
}
exports.createVectorCollection1D = createVectorCollection1D;
