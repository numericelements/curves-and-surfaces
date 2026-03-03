import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../../src/namedConstants/Vectors";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { ProjectiveVector3DTypeReal } from "../../src/mathVector/ProjectiveVector3DTypeReal";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";
import { IWeight } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { EM_REVERT_NOT_APPLICABLE, EM_WEIGHT_TOO_SMALL } from "../../src/ErrorMessages/ProjectiveVectors";


const defaultCoordinates = [1, 2, 3];
const defaultWeight = new Weight(DEFAULT_WEIGHT_VALUE);
const defaultPositiveWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);


export function createCommonProjectiveVectorTests<D extends 3 | 4>(
    dimension: D
    // dimension: number
) {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        // because default vector spaces may be required with different weight management types,
        // which effectively requires a default vector space with the corresponding weight manager
        DefaultVectorSpaces.reset();
    });

    describe('Common ProjectiveVector Tests', () => {

        describe('Accessors', () => {

            it(`can get the space dimension of a vector when it lies into a user-defined vector space`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector.dimension).to.eql(dimension);
            });

            it(`can get the space dimension of a vector when it lies into the default vector space`, () => {
                const projRealVector = createTestProjectiveVector(dimension);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.dimension).to.eql(dimension);
            });

            it(`can get the space type of a vector`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            });

            it(`can get the coordinates of a vector as an array of numbers`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                for (let i = 0; i < dimension; i++) {
                    expect(projRealVector.coordinates[i]).to.eql(coordinates[i]);
                }
            });

            it(`can get the coordinates of a vector also called homogeneous coordinates`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                for (let i = 0; i < dimension; i++) {
                    expect(projRealVector.homogeneousCoordinates[i]).to.eql(projRealVector.homogeneousCoordinates[i]);
                }
            });

            it(`can get the descriptor of a vector as vector coordinates`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const coordinates = [1, 3, 5, 7];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector.dimension).to.eql(dimension);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(projRealVector.descriptor.coordinates[i]).to.eql(coordinates[i]);
                }
                const weight = projRealVector.descriptor.coordinates[projRealVector.descriptor.coordinates.length - 1] as IWeight;
                expect(weight.weight).to.eql(new Weight(coordinates[dimension - 1]));
            });

            it(`can get the homogeneous coordinates of a vector as an array of numbers`, () => {
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector.homogeneousCoordinates.length).to.eql(dimension);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                for (let i = 0; i < dimension; i++) {
                    expect(projRealVector.homogeneousCoordinates[i]).to.eql(coordinates[i]);
                }
            });

            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + WeightManagement.AllStrictlyPositiveWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const weight = new Weight(coordinates[dimension - 1]);
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, weight);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector.weight).to.eql(weight);
            });

            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + WeightManagement.AllPositiveWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const weight = new Weight(coordinates[dimension - 1], false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, weight);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector.weight).to.eql(weight);
            });

            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + WeightManagement.SomeNullWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
                const weight = new Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, weight);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector.weight).to.eql(weight);
                const weight1 = new Weight(coordinates[dimension - 1], true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, weight1);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(weight1);
            });
        });

        describe('Methods', () => {
            // the tests for methods are reduced to unary operators because the type narrowing process is not efficient enough to test binary operators
            it(`can get a coordinate of a vector `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                for (let i = 0; i < dimension; i++) {
                    expect(projRealVector.getCoordinate(i)).to.eql(coordinates[i]);
                }
            });

            it(`cannot get a coordinate of a vector when the coordinate index is negative`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates);
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                expect(() => projRealVector.getCoordinate(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            it(`cannot get a coordinate of a vector when the coordinate index is greater than the vector space dimension`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates);
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                expect(() => projRealVector.getCoordinate(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });

            it(`can clone a vector living into a user-specified vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector.weight).to.eql(new Weight(coordinates[dimension - 1]));
                const newProjRealVector = projRealVector.clone();
                expect(newProjRealVector.dimension).to.eql(dimension);
                expect(newProjRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(newProjRealVector.vectorSpace.isDefault).to.eql(false);
                expect(newProjRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(newProjRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
                expect(newProjRealVector.weight).to.eql(new Weight(coordinates[dimension - 1]));
            });

            it(`can clone a vector living into a user-specified vector space with ${WeightManagement.AllPositiveWeights} and a null weight`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const nullWeight = new Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, nullWeight);
                const projCoordinates = coordinates.slice(0, dimension);
                projCoordinates[dimension - 1] = 0;
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector.weight).to.eql(nullWeight);
                const newProjRealVector = projRealVector.clone();
                expect(newProjRealVector.dimension).to.eql(dimension);
                expect(newProjRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(newProjRealVector.vectorSpace.isDefault).to.eql(false);
                expect(newProjRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(newProjRealVector.coordinates).to.eql(projCoordinates);
                expect(newProjRealVector.weight).to.eql(nullWeight);
            });

            it(`can clone a vector living into a default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector.weight).to.eql(new Weight(coordinates[dimension - 1]));
                const newProjRealVector = projRealVector.clone();
                expect(newProjRealVector.dimension).to.eql(dimension);
                expect(newProjRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(newProjRealVector.vectorSpace.isDefault).to.eql(true);
                expect(newProjRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(newProjRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
                expect(newProjRealVector.weight).to.eql(new Weight(coordinates[dimension - 1]));
            });

            it(`can clone a vector living into a default vector space with ${WeightManagement.SomeNullWeights} and a null weight`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
                const nullWeight = new Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, nullWeight);
                const projCoordinates = coordinates.slice(0, dimension);
                projCoordinates[dimension - 1] = 0;
                expect(projRealVector.dimension).to.eql(dimension);
                expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector.weight).to.eql(nullWeight);
                const newProjRealVector = projRealVector.clone();
                expect(newProjRealVector.dimension).to.eql(dimension);
                expect(newProjRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(newProjRealVector.vectorSpace.isDefault).to.eql(true);
                expect(newProjRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(newProjRealVector.coordinates).to.eql(projCoordinates);
                expect(newProjRealVector.weight).to.eql(nullWeight);
            });

            it(`can compute the norm of a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(0);
            });

            it(`can compute the norm of a vector with weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(0);
            });

            it(`can compute the norm of a vector with weight management ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(0);
            });

            it(`can normalize a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a norm greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                expect(result.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.strictlyPositive).to.eql(true);
            });

            it(`can normalize a vector with weight management ${WeightManagement.AllPositiveWeights} and a norm greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                expect(result.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.strictlyPositive).to.eql(false);
            });

            it(`can normalize a vector with weight management ${WeightManagement.SomeNullWeights} and a norm greater than ${NULL_WEIGHT_TOLERANCE} and strictlyPositive weight status false`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                expect(result.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.strictlyPositive).to.eql(false);
            });

            it(`can normalize a vector with weight management ${WeightManagement.SomeNullWeights} and a norm greater than ${NULL_WEIGHT_TOLERANCE} and strictlyPositive weight status true`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                expect(result.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.strictlyPositive).to.eql(true);
            });

            it(`can get the coordinates of a projective vector as an array of numbers`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coord = projRealVector1.toArray();
                for (let i = 0; i < projRealVector1.dimension - 1; i++) {
                    expect(coord[i]).to.eql(coordinates[i]);
                }
                expect(coord[projRealVector1.dimension - 1]).to.eql(coordinates[projRealVector1.dimension - 1]);
            });

            it(`cannot apply the revert operator to a projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(() => projRealVector1.revert()).to.throw(EM_REVERT_NOT_APPLICABLE);
            });

            it(`can apply the homogeneous transform to a projective vector to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
                for (let i = 0; i < projRealVector1.dimension - 1; i++) {
                    expect(scaledToDefaultWeight.descriptor.coordinates[i]).to.eql(coordinates[i] / coordinates[projRealVector1.dimension - 1]);
                }
            });

            it(`can apply the homogeneous transform to a projective vector into a default vector space to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
                for (let i = 0; i < projRealVector1.dimension - 1; i++) {
                    expect(scaledToDefaultWeight.descriptor.coordinates[i]).to.eql(coordinates[i] / coordinates[projRealVector1.dimension - 1]);
                }
            });

            it(`cannot apply the homogeneous transform to a projective vector into a default vector space if the vector norm is smaller than ${NULL_WEIGHT_TOLERANCE} with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(NULL_WEIGHT_TOLERANCE / 2, false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(() => projRealVector1.homogeneousTransform()).to.throw(EM_WEIGHT_TOO_SMALL);
            });

            it(`can adjust the tolerance threshold to compute the homogeneous transform of a projective vector into a default vector space with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(NULL_WEIGHT_TOLERANCE / 2, false));
                const tolerance = NULL_WEIGHT_TOLERANCE / 10;
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(() => projRealVector1.homogeneousTransform(tolerance)).to.not.throw();
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(tolerance / 2, false));
                expect(() => projRealVector2.homogeneousTransform(tolerance)).to.throw(EM_WEIGHT_TOO_SMALL);
            });
        });
    });
}

// Helper function to create test vectors
export function createTestProjectiveVector<D extends 3 | 4>(
    dimension: D,
    vectorSpace?: ProjectiveVectorSpace<D>,
    coordinates?: number[],
    weight?: Weight
): D extends 3 ? ProjectiveVector2DTypeReal : D extends 4 ? ProjectiveVector3DTypeReal : never;

export function createTestProjectiveVector(
    dimension: 3 | 4, vectorSpace?: ProjectiveVectorSpace<3 | 4>, coordinates?: number[], weight?: Weight
): ProjectiveVector2DTypeReal | ProjectiveVector3DTypeReal {
    switch(dimension) {
        case 3:
            if(vectorSpace !== undefined && vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
            return new ProjectiveVector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        weight ? weight : defaultPositiveWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<3>: undefined);
            }
            return new ProjectiveVector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        weight ? weight : defaultWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<3>: undefined);
        case 4:
            if(vectorSpace !== undefined && vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
            return new ProjectiveVector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        coordinates ? coordinates[2] : defaultCoordinates[2],
                                        weight ? weight : defaultPositiveWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<4>: undefined);
            }
            return new ProjectiveVector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        coordinates ? coordinates[2] : defaultCoordinates[2],
                                        weight ? weight : defaultWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<4>: undefined);
        default:
            throw new Error(`createTestProjectiveVector: Unsupported dimension: ${dimension}`);
    }
}