"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestComplexVector = exports.createCommonComplexVectorTests = void 0;
const chai_1 = require("chai");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const Vector1DTypeComplex_1 = require("../../src/mathVector/Vector1DTypeComplex");
const Vector2DTypeComplex_1 = require("../../src/mathVector/Vector2DTypeComplex");
const Complex_1 = require("../../src/mathVector/Complex");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
let complex1 = new Complex_1.Complex(1, 2);
let complex2 = new Complex_1.Complex(3, 4);
let defaultCoordinates = [complex1, complex2];
function createCommonComplexVectorTests(dimension) {
    describe('Common ComplexVector Tests', () => {
        describe('Accessors', () => {
            it(`can get the space dimension of a vector when the vector is into a user-specified vector space`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            });
            it(`can get the space dimension of a vector when the vector is into a default vector space`, () => {
                const complexVector = createTestComplexVector(dimension);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            });
            it(`can get the space type of a vector`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            });
            it(`can get the coordinates of a vector as an array of numbers`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complex1 = new Complex_1.Complex(1, 2);
                const complex2 = new Complex_1.Complex(3, 4);
                const coordinates = [complex1, complex2];
                const complexVector = createTestComplexVector(dimension, vSpace, coordinates);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(complexVector.coordinates[i]).to.eql(coordinates[i]);
                }
            });
            it(`can get the descriptor of a vector as vector coordinates`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complex1 = new Complex_1.Complex(1, 3);
                const complex2 = new Complex_1.Complex(5, 7);
                const coordinates = [complex1, complex2];
                const complexVector = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                if (complexVector.vectorType === VectorTypeTags_1.COMPLEXVECTOR1D) {
                    const descriptor = complexVector.descriptor;
                    (0, chai_1.expect)(descriptor.real).to.eql(coordinates[0].real);
                    (0, chai_1.expect)(descriptor.imaginary).to.eql(coordinates[0].imaginary);
                }
                else {
                    const descriptor = complexVector.descriptor;
                    for (let i = 0; i < dimension; i++) {
                        (0, chai_1.expect)(descriptor.coordinates[i].real).to.eql(complexVector.coordinates[i].real);
                        (0, chai_1.expect)(descriptor.coordinates[i].imaginary).to.eql(complexVector.coordinates[i].imaginary);
                    }
                }
            });
        });
        describe('Methods', () => {
            complex1 = new Complex_1.Complex(1, 3);
            complex2 = new Complex_1.Complex(5, 7);
            const coordinates = [complex1, complex2];
            it(`can get a coordinate of a complex vector `, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(complexVector.getCoordinate(i)).to.eql(defaultCoordinates[i]);
                }
            });
            it(`cannot get a coordinate of a complex vector when the coordinate index is negative`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(() => complexVector.getCoordinate(-1)).to.throw(Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });
            it(`cannot get a coordinate of a vector when the coordinate index is equal or larger than the vector space dimension`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(() => complexVector.getCoordinate(dimension)).to.throw(Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });
            it(`can clone a vector living into a user-specified vector space`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
                const newComplexVector = complexVector.clone();
                (0, chai_1.expect)(newComplexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newComplexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(newComplexVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(newComplexVector.coordinates).to.eql(defaultCoordinates.slice(0, dimension));
            });
            it(`can clone a vector living into a default vector space`, () => {
                const complexVector = createTestComplexVector(dimension, undefined, defaultCoordinates);
                (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
                const newRealVector = complexVector.clone();
                (0, chai_1.expect)(newRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(newRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(newRealVector.coordinates).to.eql(defaultCoordinates.slice(0, dimension));
            });
            it(`can add a vector with another complex vector in the same default vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vectorSpace = complexVector1.vectorSpace;
                const complexVector2 = createTestComplexVector(dimension, vectorSpace, coordinates);
                const result = complexVector1.add(complexVector2);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i].add(defaultCoordinates[i]));
                }
                (0, chai_1.expect)(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
            });
            it(`can add a vector with another complex vector in the same user-defined vector space`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complexVector2 = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                const result = complexVector1.add(complexVector2);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i].add(defaultCoordinates[i]));
                }
                (0, chai_1.expect)(result.vectorSpace).to.eql(vSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
            });
            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector2 = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(complexVector2.dimension).to.eql(complexVector1.dimension);
                (0, chai_1.expect)(() => complexVector1.add(complexVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });
            it(`can subtract a vector from another complex vector of same dimension in the same default vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const complex3 = new Complex_1.Complex(2, 4);
                const complex4 = new Complex_1.Complex(6, 8);
                const coordinates2 = [complex3, complex4];
                const complexVector2 = createTestComplexVector(dimension, undefined, coordinates2);
                const result = complexVector1.subtract(complexVector2);
                const resultCoordinates = coordinates.map((c, i) => c.subtract(coordinates2[i]));
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
            });
            it(`can subtract a vector from another complex vector of same dimension belonging to the same vector space`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complex3 = new Complex_1.Complex(2, 4);
                const complex4 = new Complex_1.Complex(6, 8);
                const coordinates2 = [complex3, complex4];
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates2);
                const result = complexVector1.subtract(complexVector2);
                const resultCoordinates = coordinates.map((c, i) => c.subtract(coordinates2[i]));
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(vSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
            });
            it(`cannot subtract a vector from another vector of same dimension but belonging to another vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector2.dimension).to.eql(complexVector1.dimension);
                (0, chai_1.expect)(() => complexVector1.subtract(complexVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });
            it(`can scale a vector using a scalar`, () => {
                const scalar = 2;
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const result = complexVector1.scale(scalar);
                const resultCoordinates = coordinates.map((c, i) => c.scale(scalar));
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
            });
            it(`can scale a vector using a complex`, () => {
                const complex = new Complex_1.Complex(2, 3);
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
                const result = complexVector1.scale(complex);
                const resultCoordinates = coordinates.map((c, i) => c.scale(complex));
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
            });
            it(`can get the vector coordinates as an array of numbers`, () => {
                const flattenedCoordinates = [];
                for (let i = 0; i < dimension; i++) {
                    flattenedCoordinates.push(coordinates[i].real);
                    flattenedCoordinates.push(coordinates[i].imaginary);
                }
                const vSpace1 = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace1, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const array = complexVector1.toArray();
                (0, chai_1.expect)(array).to.eql(flattenedCoordinates.slice(0, 2 * dimension));
            });
            it(`can check whether two vectors are equal or not within the default linear tolerance` + Vectors_1.LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.equals(complexVector2)).to.eql(true);
            });
            it(`can check whether two different vectors, close enough to each other, are equal or not within the default tolerance` + Vectors_1.LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedComplex1 = new Complex_1.Complex(coordinates[0].real + Vectors_1.LINEAR_TOL_VECTOR / (2 * Math.SQRT2), coordinates[0].imaginary - Vectors_1.LINEAR_TOL_VECTOR / (2 * Math.SQRT2));
                const perturbedComplex2 = new Complex_1.Complex(coordinates[1].real + Vectors_1.LINEAR_TOL_VECTOR / (2 * Math.SQRT2), coordinates[1].imaginary - Vectors_1.LINEAR_TOL_VECTOR / (2 * Math.SQRT2));
                const perturbedCoordinates = [perturbedComplex1, perturbedComplex2];
                const complexVector2 = createTestComplexVector(dimension, vSpace, perturbedCoordinates);
                (0, chai_1.expect)(complexVector1.equals(complexVector2)).to.eql(true);
            });
            it(`check whether two vectors are not equal to each other within the default tolerance` + Vectors_1.LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedComplex1 = new Complex_1.Complex(coordinates[0].real + Vectors_1.LINEAR_TOL_VECTOR * 2, coordinates[0].imaginary - Vectors_1.LINEAR_TOL_VECTOR * 2);
                const perturbedComplex2 = new Complex_1.Complex(coordinates[1].real + Vectors_1.LINEAR_TOL_VECTOR * 2, coordinates[1].imaginary - Vectors_1.LINEAR_TOL_VECTOR * 2);
                const perturbedCoordinates = [perturbedComplex1, perturbedComplex2];
                const complexVector2 = createTestComplexVector(dimension, vSpace, perturbedCoordinates);
                (0, chai_1.expect)(complexVector1.equals(complexVector2)).to.eql(false);
            });
            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const realVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestComplexVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(() => realVector1.equals(realVector2)).to.throw(Vectors_1.EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });
            it(`can reverse a vector`, () => {
                const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
                const reversed = complexVector1.revert();
                const resultCoordinates = coordinates.map((c) => c.opposite());
                (0, chai_1.expect)(reversed.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(reversed.dimension).to.eql(dimension);
                (0, chai_1.expect)(reversed.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(reversed.vectorSpace.isDefault).to.eql(false);
            });
        });
    });
}
exports.createCommonComplexVectorTests = createCommonComplexVectorTests;
// Helper function to create test vectors
function createTestComplexVector(dimension, vectorSpace, coordinates) {
    switch (dimension) {
        case 1:
            return new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates ? coordinates[0] : defaultCoordinates[0], vectorSpace ? vectorSpace : undefined);
        case 2:
            return new Vector2DTypeComplex_1.Vector2DTypeComplex(coordinates ? coordinates[0] : defaultCoordinates[0], coordinates ? coordinates[1] : defaultCoordinates[1], vectorSpace ? vectorSpace : undefined);
        default:
            throw new Error(`createTestRealVector: Unsupported dimension: ${dimension}`);
    }
}
exports.createTestComplexVector = createTestComplexVector;
