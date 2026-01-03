"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector1DTypeComplex = void 0;
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const AbstractComplexVector_1 = require("./AbstractComplexVector");
const Complex_1 = require("./Complex");
const ComplexVectorSpace_1 = require("./ComplexVectorSpace");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const SPACE_DIMENSION = 1;
class Vector1DTypeComplex extends AbstractComplexVector_1.AbstractComplexVector {
    constructor(realOrComplexOrVectorSpace, imaginaryOrVectorSpace, vectorSpace) {
        super();
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace_1.ComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            this.data = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
            return;
        }
        else if (realOrComplexOrVectorSpace instanceof Complex_1.Complex) {
            const complex = realOrComplexOrVectorSpace;
            this.data = { type: ComplexTypeTag_1.COMPLEX, real: complex.real, imaginary: complex.imaginary };
            if (imaginaryOrVectorSpace instanceof ComplexVectorSpace_1.ComplexVectorSpace) {
                this._vectorSpace = imaginaryOrVectorSpace;
            }
            else if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            }
            else {
                this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
            }
            return;
        }
        const real = realOrComplexOrVectorSpace !== null && realOrComplexOrVectorSpace !== void 0 ? realOrComplexOrVectorSpace : 0;
        if (typeof imaginaryOrVectorSpace === 'number') {
            this.data = { type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginaryOrVectorSpace };
        }
        else {
            this.data = { type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: 0 };
        }
        if (vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        }
        else {
            this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
        }
    }
    get dimension() { return SPACE_DIMENSION; }
    get vectorType() { return VectorTypeTags_1.COMPLEXVECTOR1D; }
    get real() { return this.data.real; }
    get imaginary() { return this.data.imaginary; }
    get coordinates() { return [new Complex_1.Complex(this.data.real, this.data.imaginary)]; }
    get descriptor() { return this.data; }
    getCoordinate(index) {
        if (index !== 0) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex_1.Complex(this.data.real, this.data.imaginary);
    }
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    dot(other) {
        return super.dot(other);
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    isParallel(other, angularTolerance) {
        return super.isParallel(other, angularTolerance);
    }
    isOrthogonal(other, angularTolerance) {
        return super.isOrthogonal(other, angularTolerance);
    }
    toString() {
        return this.vectorType + `(${this.getCoordinate(0).toString()})` + ` ` + this._vectorSpace.toString();
    }
    clone() {
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary, this.vectorSpace);
    }
    static fromRaw(raw, vectorSpace) {
        return new Vector1DTypeComplex(raw.real, raw.imaginary, vectorSpace);
    }
}
exports.Vector1DTypeComplex = Vector1DTypeComplex;
