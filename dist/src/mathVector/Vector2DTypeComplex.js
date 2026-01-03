"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2DTypeComplex = void 0;
const ComplexVectors_1 = require("../ErrorMessages/ComplexVectors");
const ComplexVectorSpace_1 = require("../ErrorMessages/ComplexVectorSpace");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const AbstractComplexVector_1 = require("./AbstractComplexVector");
const Complex_1 = require("./Complex");
const ComplexVectorSpace_2 = require("./ComplexVectorSpace");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const SPACE_DIMENSION = 2;
class Vector2DTypeComplex extends AbstractComplexVector_1.AbstractComplexVector {
    constructor(realOrComplexOrVectorSpace, imaginaryOrComplex, real2OrVectorSpace, imaginary2, vectorSpace) {
        super();
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace_2.ComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            const nullComplex = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
            this.data = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
            return;
        }
        else if (realOrComplexOrVectorSpace instanceof Complex_1.Complex && imaginaryOrComplex instanceof Complex_1.Complex) {
            const complex1 = realOrComplexOrVectorSpace;
            const complex2 = imaginaryOrComplex;
            this.data = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [
                    { type: ComplexTypeTag_1.COMPLEX, real: complex1.real, imaginary: complex1.imaginary },
                    { type: ComplexTypeTag_1.COMPLEX, real: complex2.real, imaginary: complex2.imaginary }
                ] };
            if (real2OrVectorSpace instanceof ComplexVectorSpace_2.ComplexVectorSpace) {
                this._vectorSpace = real2OrVectorSpace;
            }
            else if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            }
            else {
                this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
            }
            return;
        }
        else if (realOrComplexOrVectorSpace instanceof Complex_1.Complex) {
            const complex1 = realOrComplexOrVectorSpace;
            if (typeof imaginaryOrComplex === 'number') {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexVectors_1.EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
                throw new RangeError(error.generateMessageString());
            }
            else if (imaginaryOrComplex instanceof Complex_1.Complex) {
                const complex2 = imaginaryOrComplex;
                this.data = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [
                        { type: ComplexTypeTag_1.COMPLEX, real: complex1.real, imaginary: complex1.imaginary },
                        { type: ComplexTypeTag_1.COMPLEX, real: complex2.real, imaginary: complex2.imaginary }
                    ] };
                if (real2OrVectorSpace instanceof ComplexVectorSpace_2.ComplexVectorSpace) {
                    this._vectorSpace = real2OrVectorSpace;
                }
                else if (vectorSpace !== undefined) {
                    this._vectorSpace = vectorSpace;
                }
                else {
                    this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
                }
                return;
            }
            else {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexVectors_1.EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
                throw new RangeError(error.generateMessageString());
            }
        }
        const real = realOrComplexOrVectorSpace !== null && realOrComplexOrVectorSpace !== void 0 ? realOrComplexOrVectorSpace : 0;
        if (typeof imaginaryOrComplex === 'number') {
            real2OrVectorSpace = real2OrVectorSpace !== null && real2OrVectorSpace !== void 0 ? real2OrVectorSpace : 0;
            imaginary2 = imaginary2 !== null && imaginary2 !== void 0 ? imaginary2 : 0;
        }
        else if (imaginaryOrComplex instanceof Complex_1.Complex) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexVectors_1.EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
            throw new RangeError(error.generateMessageString());
        }
        const imaginary = imaginaryOrComplex !== null && imaginaryOrComplex !== void 0 ? imaginaryOrComplex : 0;
        if (typeof real2OrVectorSpace !== 'number') {
            real2OrVectorSpace = 0;
        }
        real2OrVectorSpace = real2OrVectorSpace !== null && real2OrVectorSpace !== void 0 ? real2OrVectorSpace : 0;
        imaginary2 = imaginary2 !== null && imaginary2 !== void 0 ? imaginary2 : 0;
        this.data = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginary }, { type: ComplexTypeTag_1.COMPLEX, real: real2OrVectorSpace, imaginary: imaginary2 }] };
        if (vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        }
        else {
            this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
        }
    }
    get dimension() { return SPACE_DIMENSION; }
    get vectorType() { return VectorTypeTags_1.COMPLEXVECTOR2D; }
    getCoordinate(index) {
        if (index < 0 || index >= 2) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex_1.Complex(this.data.coordinates[index].real, this.data.coordinates[index].imaginary);
    }
    get coordinates() {
        let result = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(new Complex_1.Complex(this.data.coordinates[i].real, this.data.coordinates[i].imaginary));
        }
        return result;
    }
    ;
    get descriptor() { return this.data; }
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    dot(other) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'dot', Vectors_1.EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    isParallel(other, angularTolerance) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isParallel', ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
    isOrthogonal(other, angularTolerance) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isOrthogonal', ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
    toString() {
        return this.vectorType + `(${this.coordinates[0].toString()}, ${this.coordinates[1].toString()})` + ` ` + this._vectorSpace.toString();
    }
    clone() {
        return new Vector2DTypeComplex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.data.coordinates[1].real, this.data.coordinates[1].imaginary, this.vectorSpace);
    }
    static fromRaw(raw) {
        return new Vector2DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}
exports.Vector2DTypeComplex = Vector2DTypeComplex;
