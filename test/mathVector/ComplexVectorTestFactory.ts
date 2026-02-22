import { expect } from "chai";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Vector1DTypeComplex } from "../../src/mathVector/Vector1DTypeComplex";
import { Vector2DTypeComplex } from "../../src/mathVector/Vector2DTypeComplex";
import { IComplexVector } from "../../src/mathVector/Vector";
import { Complex } from "../../src/mathVector/Complex";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { ComplexVector2D, IComplex } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { COMPLEXVECTOR1D } from "../../src/namedConstants/VectorTypeTags";

let complex1 = new Complex(1, 2);
let complex2 = new Complex(3, 4);
const defaultCoordinates = [complex1, complex2];

export function createCommonComplexVectorTests(
    dimension: number
) {
    describe('Common ComplexVector Tests', () => {

        describe('Accessors', () => {
            it(`can get the space dimension of a vector when the vector is into a user-specified vector space`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace);
                expect(complexVector.vectorSpace.isDefault).to.eql(false);
                expect(complexVector.dimension).to.eql(dimension);
            });

            it(`can get the space dimension of a vector when the vector is into a default vector space`, () => {
                const complexVector = createTestComplexVector(dimension);
                expect(complexVector.vectorSpace.isDefault).to.eql(true);
                expect(complexVector.dimension).to.eql(dimension);
            });

            it(`can get the space type of a vector`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            });

            it(`can get the coordinates of a vector as an array of numbers`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complex1 = new Complex(1, 2);
                const complex2 = new Complex(3, 4);
                const coordinates = [complex1, complex2];
                const complexVector = createTestComplexVector(dimension, vSpace, coordinates);
                for (let i = 0; i < dimension; i++) {
                    expect(complexVector.coordinates[i]).to.eql(coordinates[i]);
                }
            });

            it(`can get the descriptor of a vector as vector coordinates`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complex1 = new Complex(1, 3);
                const complex2 = new Complex(5, 7);
                const coordinates = [complex1, complex2];
                const complexVector = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector.dimension).to.eql(dimension);
                if(complexVector.vectorType === COMPLEXVECTOR1D) {
                    const descriptor = complexVector.descriptor as IComplex;
                    expect(descriptor.real).to.eql(coordinates[0].real);
                    expect(descriptor.imaginary).to.eql(coordinates[0].imaginary);
                } else {
                    const descriptor = complexVector.descriptor as ComplexVector2D;
                    for (let i = 0; i < dimension; i++) {
                        const complex = complexVector.coordinates[i] as Complex;
                        expect(descriptor.coordinates[i].real).to.eql(complex.real);
                        expect(descriptor.coordinates[i].imaginary).to.eql(complex.imaginary);
                    }
                }
            });
        });

        describe('Methods', () => {
            complex1 = new Complex(1, 3);
            complex2 = new Complex(5, 7);
            const coordinates = [complex1, complex2];

            it(`can get a coordinate of a complex vector `, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                expect(complexVector.dimension).to.eql(dimension);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector.vectorSpace.isDefault).to.eql(false);
                for (let i = 0; i < dimension; i++) {
                    expect(complexVector.getCoordinate(i)).to.eql(defaultCoordinates[i]);
                }
            });

            it(`cannot get a coordinate of a complex vector when the coordinate index is negative`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                expect(complexVector.dimension).to.eql(dimension);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector.vectorSpace.isDefault).to.eql(false);
                expect(() => complexVector.getCoordinate(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            it(`cannot get a coordinate of a vector when the coordinate index is equal or larger than the vector space dimension`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                expect(complexVector.dimension).to.eql(dimension);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector.vectorSpace.isDefault).to.eql(false);
                expect(() => complexVector.getCoordinate(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            it(`can clone a vector living into a user-specified vector space`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                expect(complexVector.dimension).to.eql(dimension);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector.vectorSpace.isDefault).to.eql(false);
                const newComplexVector = complexVector.clone();
                expect(newComplexVector.dimension).to.eql(dimension);
                expect(newComplexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(newComplexVector.vectorSpace.isDefault).to.eql(false);
                expect(newComplexVector.coordinates).to.eql(defaultCoordinates.slice(0, dimension));
            });

            it(`can clone a vector living into a default vector space`, () => {
                const complexVector = createTestComplexVector(dimension, undefined, defaultCoordinates);
                expect(complexVector.dimension).to.eql(dimension);
                expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector.vectorSpace.isDefault).to.eql(true);
                const newRealVector = complexVector.clone();
                expect(newRealVector.dimension).to.eql(dimension);
                expect(newRealVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(newRealVector.vectorSpace.isDefault).to.eql(true);
                expect(newRealVector.coordinates).to.eql(defaultCoordinates.slice(0, dimension));
            });

            it(`can add a vector with another complex vector in the same default vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vectorSpace = complexVector1.vectorSpace;
                const complexVector2 = createTestComplexVector(dimension, vectorSpace, coordinates);
                const result = complexVector1.add(complexVector2);
                for (let i = 0; i < dimension; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i].add(defaultCoordinates[i]));
                }
                expect(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can add a vector with another complex vector in the same user-defined vector space`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complexVector2 = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                const result = complexVector1.add(complexVector2);
                for (let i = 0; i < dimension; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i].add(defaultCoordinates[i]));
                }
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
            });

            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector2 = createTestComplexVector(dimension, vSpace, defaultCoordinates);
                expect(complexVector2.dimension).to.eql(complexVector1.dimension);
                expect(() => complexVector1.add(complexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can subtract a vector from another complex vector of same dimension in the same default vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const complex3 = new Complex(2, 4);
                const complex4 = new Complex(6, 8);
                const coordinates2 = [complex3, complex4];
                const complexVector2 = createTestComplexVector(dimension, undefined, coordinates2);
                const result = complexVector1.subtract(complexVector2);
                const resultCoordinates = coordinates.map((c, i) => c.subtract(coordinates2[i]));
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can subtract a vector from another complex vector of same dimension belonging to the same vector space`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complex3 = new Complex(2, 4);
                const complex4 = new Complex(6, 8);
                const coordinates2 = [complex3, complex4];
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates2);
                const result = complexVector1.subtract(complexVector2);
                const resultCoordinates = coordinates.map((c, i) => c.subtract(coordinates2[i]));
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
            });

            it(`cannot subtract a vector from another vector of same dimension but belonging to another vector space`, () => {
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector2.dimension).to.eql(complexVector1.dimension);
                expect(() => complexVector1.subtract(complexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can scale a vector using a scalar`, () => {
                const scalar = 2;
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const result = complexVector1.scale(scalar);
                const resultCoordinates = coordinates.map((c, i) => c.scale(scalar));
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can scale a vector using a complex`, () => {
                const complex = new Complex(2, 3);
                const complexVector1 = createTestComplexVector(dimension, undefined, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(true);
                const result = complexVector1.scale(complex);
                const resultCoordinates = coordinates.map((c, i) => c.scale(complex));
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(complexVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can get the vector coordinates as an array of numbers`, () => {
                const flattenedCoordinates: number[] = [];
                for (let i = 0; i < dimension; i++) {
                    flattenedCoordinates.push(coordinates[i].real);
                    flattenedCoordinates.push(coordinates[i].imaginary);
                }
                const vSpace1 = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace1, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const array = complexVector1.toArray();
                expect(array).to.eql(flattenedCoordinates.slice(0, 2 * dimension));
            });

            it(`can check whether two vectors are equal or not within the default linear tolerance`+ LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const complexVector2 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.equals(complexVector2)).to.eql(true);
            });

            it(`can check whether two different vectors, close enough to each other, are equal or not within the default tolerance`+ LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedComplex1 = new Complex(coordinates[0].real + LINEAR_TOL_VECTOR / (2 * Math.SQRT2),
                                                    coordinates[0].imaginary - LINEAR_TOL_VECTOR / (2 * Math.SQRT2));
                const perturbedComplex2 = new Complex(coordinates[1].real + LINEAR_TOL_VECTOR / (2 * Math.SQRT2),
                                                    coordinates[1].imaginary - LINEAR_TOL_VECTOR / (2 * Math.SQRT2));
                const perturbedCoordinates = [perturbedComplex1, perturbedComplex2];
                const complexVector2 = createTestComplexVector(dimension, vSpace, perturbedCoordinates);
                expect(complexVector1.equals(complexVector2)).to.eql(true);
            });

            it(`check whether two vectors are not equal to each other within the default tolerance`+ LINEAR_TOL_VECTOR, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedComplex1 = new Complex(coordinates[0].real + LINEAR_TOL_VECTOR * 2,
                                                    coordinates[0].imaginary - LINEAR_TOL_VECTOR * 2);
                const perturbedComplex2 = new Complex(coordinates[1].real + LINEAR_TOL_VECTOR * 2,
                                                    coordinates[1].imaginary - LINEAR_TOL_VECTOR * 2);
                const perturbedCoordinates = [perturbedComplex1, perturbedComplex2];
                const complexVector2 = createTestComplexVector(dimension, vSpace, perturbedCoordinates);
                expect(complexVector1.equals(complexVector2)).to.eql(false);
            });

            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const realVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestComplexVector(dimension, undefined, coordinates);
                expect(() => realVector1.equals(realVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });

            it(`can reverse a vector`, () => {
                const vSpace = new ComplexVectorSpace(dimension);
                const complexVector1 = createTestComplexVector(dimension, vSpace, coordinates);
                expect(complexVector1.dimension).to.eql(dimension);
                expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(complexVector1.vectorSpace.isDefault).to.eql(false);
                const reversed = complexVector1.revert();
                const resultCoordinates = coordinates.map((c) => c.opposite());
                expect(reversed.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(reversed.dimension).to.eql(dimension);
                expect(reversed.spaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(reversed.vectorSpace.isDefault).to.eql(false);
            });
        });
    });
}

// Helper function to create test vectors
export function createTestComplexVector(
    dimension: number, vectorSpace?: ComplexVectorSpace, coordinates?: Complex[]
): IComplexVector {
    switch(dimension) {
        case 1:
            return new Vector1DTypeComplex(coordinates ? coordinates[0] : defaultCoordinates[0], vectorSpace ? vectorSpace as ComplexVectorSpace<1>: undefined);
        case 2:
            return new Vector2DTypeComplex(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1], vectorSpace ? vectorSpace as ComplexVectorSpace<2>: undefined);
        default:
            throw new Error(`createTestRealVector: Unsupported dimension: ${dimension}`);
    }
}