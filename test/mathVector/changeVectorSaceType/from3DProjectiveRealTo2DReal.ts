import { expect } from "chai";
import { DefaultVectorSpaces } from "../../../src/mathVector/internal/DefaultVectorSpaces";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../../src/namedConstants/ProjectiveVectorSpace";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { Weight } from "../../../src/mathVector/Weight";
import { ProjectiveVectorSpace } from "../../../src/mathVector/ProjectiveVectorSpace";
import { ProjectiveVector2DTypeReal } from "../../../src/mathVector/ProjectiveVector2DTypeReal";
import { from3DProjectiveRealTo2DReal } from "../../../src/mathVector/changeVectorSaceType/from3DProjectiveRealTo2DReal";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { EM_WEIGHT_TOO_SMALL } from "../../../src/ErrorMessages/ProjectiveVectors";

describe('Projective vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    it(`can transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector of a default 2D real vector space`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        const result = from3DProjectiveRealTo2DReal(projRealVector1);
        expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        expect(result.dimension).to.eql(dimension - 1);
        for(let i = 0; i < coordinates.length; i++) {
            expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        }
        expect(result.vectorSpace.isDefault).to.eql(true);
    });

    it(`can transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector of a user-defined 2D real vector space`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 2;
        const realVSpace = new RealVectorSpace(realSpaceDimension);
        const result = from3DProjectiveRealTo2DReal(projRealVector1, realVSpace);
        expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        expect(result.dimension).to.eql(dimension - 1);
        for(let i = 0; i < coordinates.length; i++) {
            expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        }
        expect(result.vectorSpace).to.eql(realVSpace)
        expect(result.vectorSpace.isDefault).to.eql(false);
    });

    it(`cannot transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector`, () => {
        const coordinates = [6, 12];
        const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 2;
        const realVSpace = new RealVectorSpace(realSpaceDimension);
        expect(() => from3DProjectiveRealTo2DReal(projRealVector1, realVSpace)).to.throw(EM_WEIGHT_TOO_SMALL);
    });
});
