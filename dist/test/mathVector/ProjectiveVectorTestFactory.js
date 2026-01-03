"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestProjectiveVector = exports.createCommonProjectiveVectorTests = void 0;
const chai_1 = require("chai");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const ProjectiveVectorSpace_1 = require("../../src/mathVector/ProjectiveVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const ProjectiveVector3DTypeReal_1 = require("../../src/mathVector/ProjectiveVector3DTypeReal");
const ProjectiveVector2DTypeReal_1 = require("../../src/mathVector/ProjectiveVector2DTypeReal");
const ProjectiveVectorSpace_2 = require("../../src/namedConstants/ProjectiveVectorSpace");
const DefaultVectorSpaces_1 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const Weight_2 = require("../../src/namedConstants/Weight");
const WeightManager_1 = require("../../src/ErrorMessages/WeightManager");
const ProjectiveVectorSpace_3 = require("../../src/ErrorMessages/ProjectiveVectorSpace");
const ProjectiveVectors_1 = require("../../src/ErrorMessages/ProjectiveVectors");
const defaultCoordinates = [1, 2, 3];
const defaultWeight = new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE);
const defaultPositiveWeight = new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false);
function createCommonProjectiveVectorTests(dimension) {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        // because default vector spaces may be required with different weight management types,
        // which effectively requires a default vector space with the corresponding weight manager
        DefaultVectorSpaces_1.DefaultVectorSpaces.reset();
    });
    describe('Common ProjectiveVector Tests', () => {
        describe('Accessors', () => {
            it(`can get the space dimension of a vector when it lies into a user-defined vector space`, () => {
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
            });
            it(`can get the space dimension of a vector when it lies into the default vector space`, () => {
                const projRealVector = createTestProjectiveVector(dimension);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
            });
            it(`can get the space type of a vector`, () => {
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
            });
            it(`can get the coordinates of a vector as an array of numbers`, () => {
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(projRealVector.coordinates[i]).to.eql(coordinates[i]);
                }
            });
            it(`can get the coordinates of a vector also called homogeneous coordinates`, () => {
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(projRealVector.homogeneousCoordinates[i]).to.eql(projRealVector.homogeneousCoordinates[i]);
                }
            });
            it(`can get the descriptor of a vector as vector coordinates`, () => {
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const coordinates = [1, 3, 5, 7];
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(projRealVector.descriptor.coordinates[i]).to.eql(coordinates[i]);
                }
                const weight = projRealVector.descriptor.coordinates[projRealVector.descriptor.coordinates.length - 1];
                (0, chai_1.expect)(weight.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1]));
            });
            it(`can get the homogeneous coordinates of a vector as an array of numbers`, () => {
                const coordinates = [-1, 0, 1, 2];
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector.homogeneousCoordinates.length).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(projRealVector.homogeneousCoordinates[i]).to.eql(coordinates[i]);
                }
            });
            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const weight = new Weight_1.Weight(coordinates[dimension - 1]);
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, weight);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(weight);
            });
            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
                const weight = new Weight_1.Weight(coordinates[dimension - 1], false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, weight);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(weight);
            });
            it(`can get the weight of a vector as a Weight in a default vector space with weight management ` + ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, () => {
                const coordinates = [-1, 0, 1, 2];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, true);
                const weight = new Weight_1.Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, weight);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(weight);
                const weight1 = new Weight_1.Weight(coordinates[dimension - 1], true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, weight1);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(weight1);
            });
        });
        describe('Methods', () => {
            it(`can get a coordinate of a vector `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                for (let i = 0; i < dimension; i++) {
                    (0, chai_1.expect)(projRealVector.getCoordinate(i)).to.eql(coordinates[i]);
                }
            });
            it(`cannot get a coordinate of a vector when the coordinate index is negative`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(() => projRealVector.getCoordinate(-1)).to.throw(Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });
            it(`cannot get a coordinate of a vector when the coordinate index is greater than the vector space dimension`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(() => projRealVector.getCoordinate(dimension)).to.throw(Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            });
            it(`can clone a vector living into a user-specified vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1]));
                const newProjRealVector = projRealVector.clone();
                (0, chai_1.expect)(newProjRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newProjRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(newProjRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
                (0, chai_1.expect)(newProjRealVector.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1]));
            });
            it(`can clone a vector living into a user-specified vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} and a null weight`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const nullWeight = new Weight_1.Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, nullWeight);
                const projCoordinates = coordinates.slice(0, dimension);
                projCoordinates[dimension - 1] = 0;
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(nullWeight);
                const newProjRealVector = projRealVector.clone();
                (0, chai_1.expect)(newProjRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newProjRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(newProjRealVector.coordinates).to.eql(projCoordinates);
                (0, chai_1.expect)(newProjRealVector.weight).to.eql(nullWeight);
            });
            it(`can clone a vector living into a default vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector = createTestProjectiveVector(dimension, undefined, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1]));
                const newProjRealVector = projRealVector.clone();
                (0, chai_1.expect)(newProjRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newProjRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(newProjRealVector.coordinates).to.eql(coordinates.slice(0, dimension));
                (0, chai_1.expect)(newProjRealVector.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1]));
            });
            it(`can clone a vector living into a default vector space with ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights} and a null weight`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, true);
                const nullWeight = new Weight_1.Weight(0, false);
                const projRealVector = createTestProjectiveVector(dimension, vSpace, coordinates, nullWeight);
                const projCoordinates = coordinates.slice(0, dimension);
                projCoordinates[dimension - 1] = 0;
                (0, chai_1.expect)(projRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector.weight).to.eql(nullWeight);
                const newProjRealVector = projRealVector.clone();
                (0, chai_1.expect)(newProjRealVector.dimension).to.eql(dimension);
                (0, chai_1.expect)(newProjRealVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(newProjRealVector.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(newProjRealVector.coordinates).to.eql(projCoordinates);
                (0, chai_1.expect)(newProjRealVector.weight).to.eql(nullWeight);
            });
            it(`can add a vector with another projective vector in the same default vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = createTestProjectiveVector(dimension);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const projRealVector2 = createTestProjectiveVector(dimension, vectorSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            });
            it(`can add a vector with another projective vector in the same user-defined vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            });
            it(`can add a vector with another projective vector in the same default vector space with ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(0, false));
                (0, chai_1.expect)(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.weight).to.eql(defaultWeight);
            });
            it(`can add a vector with another projective vector in the same user-defined vector space with ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [-1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(0, false));
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.weight).to.eql(defaultWeight);
            });
            it(`can add a vector with another projective vector in the same default vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, undefined, defaultPositiveWeight);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(0, false));
                (0, chai_1.expect)(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false));
            });
            it(`can add a vector with another projective vector with weight smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE} in the same default vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
                const coordinates = [-1, 3, 5, 7];
                const smallWeight = new Weight_1.Weight(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight);
                (0, chai_1.expect)(projRealVector2.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2));
            });
            it(`can add a vector with another projective vector with weight smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE} in the same default vector space with ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
                const coordinates = [1, -3, 5, 7];
                const smallWeight = new Weight_1.Weight(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, false);
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight);
                (0, chai_1.expect)(projRealVector2.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                (0, chai_1.expect)(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2);
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, false));
            });
            it(`cannot add vectors with different weight statuses under ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} weight management and get a resulting vector with weight status strictly positive: false`, () => {
                const coordinates = [1, -3, 5, 7];
                const smallWeight = new Weight_1.Weight(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, undefined, defaultPositiveWeight);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector1.weight).to.eql(new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false));
                (0, chai_1.expect)(() => createTestProjectiveVector(dimension, vSpace, coordinates, smallWeight)).to.throw(Vectors_1.EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            });
            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = createTestProjectiveVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, defaultCoordinates);
                (0, chai_1.expect)(projRealVector2.dimension).to.eql(projRealVector1.dimension);
                (0, chai_1.expect)(() => projRealVector1.add(projRealVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });
            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const projRealVector1 = createTestProjectiveVector(dimension, undefined, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, undefined, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });
            it(`can subtract a vector from another projective vector of same dimension belonging to the same user-defined vector space with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(vSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });
            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1], false));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(result.weight).to.eql(new Weight_1.Weight(coordinates[dimension - 1] - coordinates2[dimension - 1], false));
            });
            it(`can subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights} resulting into an arbitrary small positive weight`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] - ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE, coordinates[3] - ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                (0, chai_1.expect)(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                (0, chai_1.expect)(result.vectorSpace).to.eql(vSpace);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.weight.value).to.be.closeTo(new Weight_1.Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]).value, GeneralPurpose_1.TOLERANCE_FLOAT);
            });
            it(`cannot subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights} resulting into a negative weight difference even smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(() => projRealVector1.subtract(projRealVector2)).to.throw(WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
            });
            it(`can subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} resulting into a negative weight difference smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1], false));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.value).to.eql(0);
            });
            it(`cannot subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} resulting into a negative weight difference larger than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE * GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, coordinates[3] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE * GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1], false));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(() => projRealVector1.subtract(projRealVector2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });
            it(`can subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights} when each vector has a different weight status. The resulting weight status being false when the resulting weight is strictly positive and smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] - ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, coordinates[3] - ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.value).to.greaterThan(0);
                (0, chai_1.expect)(result.weight.value).to.lessThan(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(false);
            });
            it(`can subtract a vector from another projective vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights} resulting into a negative weight difference smaller than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = createTestProjectiveVector(dimension, vSpace, coordinates2, new Weight_1.Weight(coordinates2[dimension - 1]));
                (0, chai_1.expect)(projRealVector2.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    (0, chai_1.expect)(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.value).to.eql(0);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(false);
            });
            it(`can compute the norm of a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(0);
            });
            it(`can compute the norm of a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(0);
            });
            it(`can compute the norm of a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(0);
            });
            it(`can normalize a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights} and a norm greater than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                (0, chai_1.expect)(result.norm()).to.be.closeTo(1, GeneralPurpose_1.TOLERANCE_FLOAT);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(true);
            });
            it(`can normalize a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights} and a norm greater than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                (0, chai_1.expect)(result.norm()).to.be.closeTo(1, GeneralPurpose_1.TOLERANCE_FLOAT);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(false);
            });
            it(`can normalize a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights} and a norm greater than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE} and strictlyPositive weight status false`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1], false));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                (0, chai_1.expect)(result.norm()).to.be.closeTo(1, GeneralPurpose_1.TOLERANCE_FLOAT);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(false);
            });
            it(`can normalize a vector with weight management ${ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights} and a norm greater than ${ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE} and strictlyPositive weight status true`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(ProjectiveVectorSpace_2.NULL_WEIGHT_TOLERANCE);
                const result = projRealVector1.normalize();
                (0, chai_1.expect)(result.norm()).to.be.closeTo(1, GeneralPurpose_1.TOLERANCE_FLOAT);
                (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(result.dimension).to.eql(dimension);
                (0, chai_1.expect)(result.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
                (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(result.weight.strictlyPositive).to.eql(true);
            });
            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates);
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = createTestProjectiveVector(dimension, undefined, coordinates);
                (0, chai_1.expect)(() => projRealVector1.equals(projRealVector2)).to.throw(Vectors_1.EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });
            it(`can get the coordinates of a projective vector as an array of numbers`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const coord = projRealVector1.toArray();
                for (let i = 0; i < projRealVector1.dimension - 1; i++) {
                    (0, chai_1.expect)(coord[i]).to.eql(coordinates[i]);
                }
                (0, chai_1.expect)(coord[projRealVector1.dimension - 1]).to.eql(coordinates[projRealVector1.dimension - 1]);
            });
            it(`cannot apply the revert operator to a projective vector with wieght management ${ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = createTestProjectiveVector(dimension, vSpace, coordinates, new Weight_1.Weight(coordinates[dimension - 1]));
                (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
                (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
                (0, chai_1.expect)(() => projRealVector1.revert()).to.throw(ProjectiveVectors_1.EM_REVERT_NOT_APPLICABLE);
            });
        });
    });
}
exports.createCommonProjectiveVectorTests = createCommonProjectiveVectorTests;
// Helper function to create test vectors
function createTestProjectiveVector(dimension, vectorSpace, coordinates, weight) {
    switch (dimension) {
        case 3:
            if (vectorSpace !== undefined && vectorSpace.weightManagement === ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0], coordinates ? coordinates[1] : defaultCoordinates[1], weight ? weight : defaultPositiveWeight, vectorSpace ? vectorSpace : undefined);
            }
            return new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0], coordinates ? coordinates[1] : defaultCoordinates[1], weight ? weight : defaultWeight, vectorSpace ? vectorSpace : undefined);
        case 4:
            if (vectorSpace !== undefined && vectorSpace.weightManagement === ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector3DTypeReal_1.ProjectiveVector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0], coordinates ? coordinates[1] : defaultCoordinates[1], coordinates ? coordinates[2] : defaultCoordinates[2], weight ? weight : defaultPositiveWeight, vectorSpace ? vectorSpace : undefined);
            }
            return new ProjectiveVector3DTypeReal_1.ProjectiveVector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0], coordinates ? coordinates[1] : defaultCoordinates[1], coordinates ? coordinates[2] : defaultCoordinates[2], weight ? weight : defaultWeight, vectorSpace ? vectorSpace : undefined);
        default:
            throw new Error(`createTestProjectiveVector: Unsupported dimension: ${dimension}`);
    }
}
exports.createTestProjectiveVector = createTestProjectiveVector;
