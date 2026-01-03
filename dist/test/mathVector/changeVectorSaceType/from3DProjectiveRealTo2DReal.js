"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DefaultVectorSpaces_1 = require("../../../src/mathVector/internal/DefaultVectorSpaces");
const ProjectiveVectorSpace_1 = require("../../../src/namedConstants/ProjectiveVectorSpace");
const BSplineR1toRn_1 = require("../../../src/namedConstants/BSplineR1toRn");
const Weight_1 = require("../../../src/mathVector/Weight");
const ProjectiveVectorSpace_2 = require("../../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveVector2DTypeReal_1 = require("../../../src/mathVector/ProjectiveVector2DTypeReal");
const from3DProjectiveRealTo2DReal_1 = require("../../../src/mathVector/changeVectorSaceType/from3DProjectiveRealTo2DReal");
const RealVectorSpace_1 = require("../../../src/mathVector/RealVectorSpace");
const ProjectiveVectors_1 = require("../../../src/ErrorMessages/ProjectiveVectors");
describe('Projective vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces_1.DefaultVectorSpaces.reset();
    });
    it(`can transform a projective real 3D vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} into a real 2D vector of a default 2D real vector space`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight_1.Weight(2), vSpace);
        (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
        (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
        (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        (0, chai_1.expect)(projRealVector1.norm()).to.be.greaterThan(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE);
        const result = (0, from3DProjectiveRealTo2DReal_1.from3DProjectiveRealTo2DReal)(projRealVector1);
        (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
        (0, chai_1.expect)(result.dimension).to.eql(dimension - 1);
        for (let i = 0; i < coordinates.length; i++) {
            (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value);
        }
        (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(true);
    });
    it(`can transform a projective real 3D vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} into a real 2D vector of a user-defined 2D real vector space`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight_1.Weight(2), vSpace);
        (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
        (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
        (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        (0, chai_1.expect)(projRealVector1.weight.value).to.be.greaterThan(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 2;
        const realVSpace = new RealVectorSpace_1.RealVectorSpace(realSpaceDimension);
        const result = (0, from3DProjectiveRealTo2DReal_1.from3DProjectiveRealTo2DReal)(projRealVector1, realVSpace);
        (0, chai_1.expect)(result.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
        (0, chai_1.expect)(result.dimension).to.eql(dimension - 1);
        for (let i = 0; i < coordinates.length; i++) {
            (0, chai_1.expect)(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value);
        }
        (0, chai_1.expect)(result.vectorSpace).to.eql(realVSpace);
        (0, chai_1.expect)(result.vectorSpace.isDefault).to.eql(false);
    });
    it(`cannot transform a projective real 3D vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} into a real 2D vector`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dimension, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2), vSpace);
        (0, chai_1.expect)(projRealVector1.dimension).to.eql(dimension);
        (0, chai_1.expect)(projRealVector1.vectorSpace.isDefault).to.eql(false);
        (0, chai_1.expect)(projRealVector1.vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        (0, chai_1.expect)(projRealVector1.weight.value).to.be.lessThan(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 2;
        const realVSpace = new RealVectorSpace_1.RealVectorSpace(realSpaceDimension);
        (0, chai_1.expect)(() => (0, from3DProjectiveRealTo2DReal_1.from3DProjectiveRealTo2DReal)(projRealVector1, realVSpace)).to.throw(ProjectiveVectors_1.EM_WEIGHT_TOO_SMALL);
    });
});
