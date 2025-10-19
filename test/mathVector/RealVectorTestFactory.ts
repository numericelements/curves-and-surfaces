import { expect } from "chai";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { Vector1DTypeReal } from "../../src/mathVector/Vector1DTypeReal";
import { Vector3DTypeReal } from "../../src/mathVector/Vector3DTypeReal";
import { Vector4DTypeReal } from "../../src/mathVector/Vector4DTypeReal";
import { IRealVector } from "../../src/mathVector/Vector";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_NORM_TOO_SMALL, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";


export type vectorTypeReal = Vector1DTypeReal | Vector2DTypeReal | Vector3DTypeReal | Vector4DTypeReal;

const defaultCoordinates = [1, 2, 3, 4];

export function createCommonRealVectorTests(
    dimension: number
) {
    describe('Common RealVector Space Tests', () => {

        describe('Accessors', () => {
            it(`can get the space dimension of a vector when the vector is into a user-specified vector space`, () => {
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace);
                expect(realVector.vectorSpace.isDefault).to.eql(false);
                expect(realVector.dimension).to.eql(dimension);
            });

            it(`can get the space dimension of a vector when the vector is into a default vector space`, () => {
                const realVector = createTestRealVector(dimension);
                expect(realVector.vectorSpace.isDefault).to.eql(true);
                expect(realVector.dimension).to.eql(dimension);
            });

            it(`can get the space type of a vector`, () => {
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            });

            it(`can get the coordinates of a vector as an array of numbers`, () => {
                const vSpace = new RealVectorSpace(dimension);
                const coordinates = [-1, 0, 1, 2];
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                for (let i = 0; i < dimension; i++) {
                    expect(realVector.coordinates[i]).to.eql(coordinates[i]);
                }
            });

            it(`can get the descriptor of a vector as vector coordinates`, () => {
                const vSpace = new RealVectorSpace(dimension);
                const coordinates = [1, 3, 5, 7];
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                if(typeof realVector.descriptor === 'number') {
                    expect(realVector.descriptor).to.eql(coordinates[0]);
                } else {
                    for (let i = 0; i < dimension; i++) {
                        expect(realVector.descriptor.coordinates[i]).to.eql(realVector.coordinates[i]);
                    }
                }
            });
        });

        describe('Methods', () => {
            it(`can get a coordinate of a vector `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector.vectorSpace.isDefault).to.eql(false);
                for (let i = 0; i < dimension; i++) {
                    expect(realVector.getCoordinate(i)).to.eql(coordinates[i]);
                }
            });

            it(`cannot get a coordinate of a vector when the coordinate index is negative`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector.vectorSpace.isDefault).to.eql(false);
                expect(() => realVector.getCoordinate(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            it(`cannot get a coordinate of a vector when the coordinate index is equal or larger than the vector space dimension`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector.vectorSpace.isDefault).to.eql(false);
                expect(() => realVector.getCoordinate(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            //unit tests removed to keep vectors as immutable entities
            // it(`can set a coordinate of a vector `, () => {
            //     const coordinates = [0, 0, 0, 0];
            //     const newCoordinates = [-1, 1, 3, 5];
            //     const vSpace = new RealVectorSpace(dimension);
            //     const realVector = createTestRealVector(dimension, vSpace, coordinates);
            //     expect(realVector.dimension).to.eql(dimension);
            //     expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            //     expect(realVector.vectorSpace.isDefault).to.eql(false);
            //     for (let i = 0; i < dimension; i++) {
            //         realVector.setCoordinate(i, newCoordinates[i]);
            //     }
            //     expect(realVector.coordinates).to.eql(newCoordinates.slice(0, dimension));
            // });
            //
            // it(`cannot set a coordinate of a vector when the coordinate index is negative`, () => {
            //     const coordinates = [1, 3, 5, 7];
            //     const vSpace = new RealVectorSpace(dimension);
            //     const realVector = createTestRealVector(dimension, vSpace, coordinates);
            //     expect(realVector.dimension).to.eql(dimension);
            //     expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            //     expect(realVector.vectorSpace.isDefault).to.eql(false);
            //     expect(() => realVector.setCoordinate(-1, coordinates[0])).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            // });

            it(`can clone a vector living into a user-specified vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector.vectorSpace.isDefault).to.eql(false);
                const newRealVector = realVector.clone();
                expect(newRealVector.dimension).to.eql(dimension);
                expect(newRealVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(newRealVector.vectorSpace.isDefault).to.eql(false);
                expect(newRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
            });

            it(`can clone a vector living into a default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector.dimension).to.eql(dimension);
                expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector.vectorSpace.isDefault).to.eql(true);
                const newRealVector = realVector.clone();
                expect(newRealVector.dimension).to.eql(dimension);
                expect(newRealVector.spaceType).to.eql(VectorSpaceType.REAL);
                expect(newRealVector.vectorSpace.isDefault).to.eql(true);
                expect(newRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
            });

            it(`can add a vector with another real vector in the same default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const vectorSpace = realVector1.vectorSpace;
                const realVector2 = createTestRealVector(dimension, vectorSpace, coordinates);
                const result = realVector1.add(realVector2);
                for (let i = 0; i < dimension; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.vectorSpace).to.eql(realVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.REAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can add a vector with another real vector in the same user-defined vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestRealVector(dimension, vSpace, defaultCoordinates);
                const result = realVector1.add(realVector2);
                for (let i = 0; i < dimension; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.REAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
            });

            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new RealVectorSpace(dimension);
                const realVector2 = createTestRealVector(dimension, vSpace, defaultCoordinates);
                expect(realVector2.dimension).to.eql(realVector1.dimension);
                expect(() => realVector1.add(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can subtract a vector from another real vector of same dimension in the same default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const coordinates2 = [2, 4, 6, 8];
                const realVector2 = createTestRealVector(dimension, undefined, coordinates2);
                const result = realVector1.subtract(realVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(realVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.REAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can subtract a vector from another real vector of same dimension belonging to the same vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [2, 4, 6, 8];
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates2);
                const result = realVector1.subtract(realVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.REAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
            });

            it(`cannot subtract a vector from another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new RealVectorSpace(dimension);
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector2.dimension).to.eql(realVector1.dimension);
                expect(() => realVector1.subtract(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can scale a vector using a scalar`, () => {
                const coordinates = [1, 3, 5, 7];
                const scalar = 2;
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const result = realVector1.scale(scalar);
                const resultCoordinates = coordinates.map((c, i) => c * scalar);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(realVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.REAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
            });

            it(`can compute the norm of a vector`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const result = realVector1.norm();
                const sqSum = coordinates.slice(0, dimension).reduce((sum, c) => sum + c * c, 0);
                expect(result).to.be.closeTo(Math.sqrt(sqSum), TOLERANCE_FLOAT);
            });

            it(`can normalize a vector`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const result = realVector1.normalize();
                const norm = realVector1.norm();
                for (let i = 0; i < dimension; i++) {
                    expect(result.coordinates[i]).to.be.closeTo(coordinates[i] / norm, TOLERANCE_FLOAT);
                }
            });

            it(`cannot normalize a null vector`, () => {
                const coordinates = [0, 0, 0, 0];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                expect(() => realVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
            });

            it(`cannot normalize a vector with a norm smaller than the reference linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                expect(() => realVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
            });

            it(`cannot normalize a vector with a norm smaller than the user-defined tolerance`, () => {
                const tolerance = 1e-5;
                const coordinates = [tolerance / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                expect(() => realVector1.normalize()).to.not.throw();
                expect(() => realVector1.normalize(tolerance)).to.throw(EM_NORM_TOO_SMALL);
            });

            it(`can compute the dot product of two vectors belonging to the default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const coordinates2 = [2, 2, 2, 2];
                const realVector2 = createTestRealVector(dimension, undefined, coordinates2);
                const result = realVector1.dot(realVector2);
                const expected = coordinates.slice(0, dimension).reduce((sum, c, i) => sum + c * coordinates2[i], 0);
                expect(result).to.be.closeTo(expected, TOLERANCE_FLOAT);
            });

            it(`can compute the dot product of two vectors belonging to the same vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [2, 2, 2, 2];
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates2);
                const result = realVector1.dot(realVector2);
                const expected = coordinates.slice(0, dimension).reduce((sum, c, i) => sum + c * coordinates2[i], 0);
                expect(result).to.be.closeTo(expected, TOLERANCE_FLOAT);
            });

            it(`cannot compute the dot product of one vector belonging to the default vector space and another vector belonging to a user-defined vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, undefined, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(true);
                const realVector2 = createTestRealVector(dimension, vSpace);
                expect(() => realVector1.dot(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot compute the dot product of two vectors belonging to two distinct user-defined vector spaces`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace1 = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace1, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const vSpace2 = new RealVectorSpace(dimension);
                const coordinates2 = [2, 2, 2, 2];
                const realVector2 = createTestRealVector(dimension, vSpace2, coordinates2);
                expect(() => realVector1.dot(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can get the vector coordinates as an array of numbers`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace1 = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace1, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const array = realVector1.toArray();
                expect(array).to.eql(coordinates.slice(0, dimension));
            });

            it(`can check whether two vectors are equal or not within the default linear tolerance`+ LINEAR_TOL_VECTOR, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.equals(realVector2)).to.eql(true);
            });

            it(`can check whether two different vectors, close enough to each other, are equal or not within the default tolerance`+ LINEAR_TOL_VECTOR, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedCoordinates = [coordinates[0] + LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF,
                                        coordinates[1] - LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF,
                                        coordinates[2] + LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF,
                                        coordinates[3] - LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF];
                const realVector2 = createTestRealVector(dimension, vSpace, perturbedCoordinates);
                expect(realVector1.equals(realVector2)).to.eql(true);
            });

            it(`check whether two vectors are not equal to each other within the default tolerance`+ LINEAR_TOL_VECTOR, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const perturbedCoordinates = [coordinates[0] + LINEAR_TOL_VECTOR, coordinates[1] - LINEAR_TOL_VECTOR,
                        coordinates[2] + LINEAR_TOL_VECTOR, coordinates[3] - LINEAR_TOL_VECTOR];
                const realVector2 = createTestRealVector(dimension, vSpace, perturbedCoordinates);
                expect(realVector1.equals(realVector2)).to.eql(false);
            });

            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestRealVector(dimension, undefined, coordinates);
                expect(() => realVector1.equals(realVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });

            it(`cannot check the parallelism of vectors belonging to different vector spaces`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const realVector2 = createTestRealVector(dimension, undefined, coordinates);
                expect(() => realVector1.isParallel(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the parallelism of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [1, 3, 5, 7];
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates2);
                expect(() => realVector1.isParallel(realVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the parallelism of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates2);
                expect(() => realVector1.isParallel(realVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`can check that two vectors are parallel to each other using the default angular tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates1 = [2, 6, 10, 14];
                const realVector2 = createTestRealVector(dimension, vSpace, coordinates1);
                expect(realVector1.isParallel(realVector2)).to.eql(true);
            });

            it(`can check that two angularly different vectors are parallel to each other using the default angular tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates1 = [2, 6, 10, 14];
                const perturbedCoordinates = [coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR,
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR];
                const realVector2 = createTestRealVector(dimension, vSpace, perturbedCoordinates);
                expect(realVector1.isParallel(realVector2)).to.eql(true);
            });

            it(`can check that two angularly different vectors of dimension greater than one are not parallel to each other within the default angular tolerance`, () => {
                if(dimension > 1) {
                    const coordinates = [0, 3, 5, 7];
                    const vSpace = new RealVectorSpace(dimension);
                    const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                    expect(realVector1.dimension).to.eql(dimension);
                    expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                    expect(realVector1.vectorSpace.isDefault).to.eql(false);
                    // Empirical coefficient taking into account the cross influence of linear tolerance and angular tolerance
                    const coef = 11;
                    const coordinates1 = [coordinates[0] + ANGULAR_TOL_VECTOR * coef, coordinates[1], coordinates[2], coordinates[3]];
                    const realVector2 = createTestRealVector(dimension, vSpace, coordinates1);
                    expect(realVector1.isParallel(realVector2)).to.eql(false);
                }
            });

            it(`can check that two angularly different vectors are parallel to each other using a user-specified angular tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const angularTolerance = 1e-4;
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates1 = [2, 6, 10, 14];
                const perturbedCoordinates = [coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR,
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR];
                const realVector2 = createTestRealVector(dimension, vSpace, perturbedCoordinates);
                expect(realVector1.isParallel(realVector2, angularTolerance)).to.eql(true);
            });

            it(`can check that two angularly different vectors are not parallel to each other within a user-specified angular tolerance`, () => {
                if(dimension > 1) {
                    const coordinates = [0, 3, 5, 7];
                    const angularTolerance = 1e-4;
                    const vSpace = new RealVectorSpace(dimension);
                    const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                    expect(realVector1.dimension).to.eql(dimension);
                    expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                    expect(realVector1.vectorSpace.isDefault).to.eql(false);
                    const coordinates1 = [coordinates[0] + angularTolerance, coordinates[1], coordinates[2], coordinates[3]];
                    const realVector2 = createTestRealVector(dimension, vSpace, coordinates1);
                    expect(realVector1.isParallel(realVector2)).to.eql(false);
                }
            });

            it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
                const coordinates = [0, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 =  createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [2, 4, 6, 8];
                const realVector2 = createTestRealVector(dimension, undefined, coordinates2);
                expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the orthogonality of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                if(dimension > 1) {
                    const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                    const vSpace = new RealVectorSpace(dimension);
                    const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                    expect(realVector1.dimension).to.eql(dimension);
                    expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                    expect(realVector1.vectorSpace.isDefault).to.eql(false);
                    const coordinates1 = [1, 3, 5, 7];
                    const realVector2 = createTestRealVector(dimension, vSpace, coordinates1);
                    expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
                }
            });

            it(`cannot check the orthogonality of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                if(dimension > 1) {
                    const coordinates = [1, 3, 5, 7];
                    const vSpace = new RealVectorSpace(dimension);
                    const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                    expect(realVector1.dimension).to.eql(dimension);
                    expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                    expect(realVector1.vectorSpace.isDefault).to.eql(false);
                    const coordinates1 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                    const realVector2 = createTestRealVector(dimension, vSpace, coordinates1);
                    expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
                }
            });

            it(`can reverse a vector`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new RealVectorSpace(dimension);
                const realVector1 = createTestRealVector(dimension, vSpace, coordinates);
                expect(realVector1.dimension).to.eql(dimension);
                expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
                expect(realVector1.vectorSpace.isDefault).to.eql(false);
                const reversed = realVector1.reverse();
                const resultCoordinates = coordinates.map((c) => - c);
                expect(reversed.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(reversed.dimension).to.eql(dimension);
                expect(reversed.spaceType).to.eql(VectorSpaceType.REAL);
                expect(reversed.vectorSpace.isDefault).to.eql(false);
            });

        });
    });
}

// Helper function to create test vectors
export function createTestRealVector(
    dimension: number, vectorSpace?: RealVectorSpace, coordinates?: number[]
): IRealVector {
    switch(dimension) {
        case 1:
            return new Vector1DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0], vectorSpace ? vectorSpace as RealVectorSpace<1>: undefined);
        case 2:
            return new Vector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1], vectorSpace ? vectorSpace as RealVectorSpace<2>: undefined);
        case 3:
            return new Vector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        coordinates ? coordinates[2] : defaultCoordinates[2], vectorSpace ? vectorSpace as RealVectorSpace<3>: undefined);
        case 4:
            return new Vector4DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        coordinates ? coordinates[2] : defaultCoordinates[2],
                                        coordinates ? coordinates[3] : defaultCoordinates[3], vectorSpace ? vectorSpace as RealVectorSpace<4>: undefined);
        default:
            throw new Error(`createTestRealVector: Unsupported dimension: ${dimension}`);
    }
}