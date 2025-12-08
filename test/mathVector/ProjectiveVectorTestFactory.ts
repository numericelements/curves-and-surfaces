import { expect } from "chai";

import { IProjectiveVector } from "../../src/mathVector/Vector";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_NORM_TOO_SMALL, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { ProjectiveVector3DTypeReal } from "../../src/mathVector/ProjectiveVector3DTypeReal";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";
import { IWeight } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../../src/ErrorMessages/WeightManager";
import { EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT } from "../../src/ErrorMessages/ProjectiveVectorSpace";


const defaultCoordinates = [1, 2, 3];
const defaultWeight = new Weight(DEFAULT_WEIGHT_VALUE);
const defaultPositiveWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);

export function createCommonProjectiveVectorTests(
    dimension: number
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

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = createTestProjectiveVector(dimension);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const projRealVector2 = createTestProjectiveVector(dimension, vectorSpace, coordinates, new Weight(coordinates[dimension - 1]));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same user-defined vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(0,false));
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.weight).to.eql(defaultWeight);
            });

            it(`can add a vector with another projective vector in the same user-defined vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [-1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(0,false));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.weight).to.eql(defaultWeight);
            });

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, undefined, defaultPositiveWeight);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(0,false));
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
            });

            it(`can add a vector with another projective vector with weight smaller than ${NULL_WEIGHT_TOLERANCE} in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
                const coordinates = [-1, 3, 5, 7];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight);
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value + NULL_WEIGHT_TOLERANCE / 2);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2));
            });

            it(`can add a vector with another projective vector with weight smaller than ${NULL_WEIGHT_TOLERANCE} in the same default vector space with ${WeightManagement.AllPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
                const coordinates = [1, -3, 5, 7];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight);
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value + NULL_WEIGHT_TOLERANCE / 2);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2, false));
            });

            it(`cannot add vectors with different weight statuses under ${WeightManagement.AllPositiveWeights} weight management and get a resulting vector with weight status strictly positive: false`, () => {
                const coordinates = [1, -3, 5, 7];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, undefined, defaultPositiveWeight);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                expect(() => createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            });

            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = createTestProjectiveVector(dimension, undefined, coordinates);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, defaultCoordinates);
                expect(projRealVector2.dimension).to.eql(projRealVector1.dimension);
                expect(() => projRealVector1.add(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const projRealVector1 = createTestProjectiveVector(dimension, undefined, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, undefined, coordinates2, new Weight(coordinates2[dimension - 1]));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });

            it(`can subtract a vector from another projective vector of same dimension belonging to the same user-defined vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1]));
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });

            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1], false));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1], false));
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into an arbitrary small positive weight`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE, coordinates[3] - NULL_WEIGHT_TOLERANCE];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1]));
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.weight.value).to.be.closeTo(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]).value, TOLERANCE_FLOAT);
            });

            it(`cannot subtract a vector from another projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into a negative weight difference even smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1]));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1], false));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.eql(0);
            });

            it(`cannot subtract a vector from another projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference larger than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, coordinates[3] + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1], false));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} when each vector has a different weight status. The resulting weight status being false when the resulting weight is strictly positive and smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE / 2, coordinates[3] - NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1]));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.greaterThan(0);
                expect(result.weight.value).to.lessThan(NULL_WEIGHT_TOLERANCE);
                expect(result.weight.strictlyPositive).to.eql(false);
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight(coordinates[dimension - 1], false));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight(coordinates2[dimension - 1]));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.eql(0);
                expect(result.weight.strictlyPositive).to.eql(false);
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
        });
    });
}

// Helper function to create test vectors
export function createTestProjectiveVector(
    dimension: number, vectorSpace?: ProjectiveVectorSpace, coordinates?: number[], weight?: Weight
): IProjectiveVector {
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