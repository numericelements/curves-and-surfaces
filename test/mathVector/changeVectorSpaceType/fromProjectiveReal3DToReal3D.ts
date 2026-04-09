import { expect } from "chai";
import { DefaultVectorSpaces } from "../../../src/mathVector/internal/DefaultVectorSpaces";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../../src/namedConstants/ProjectiveRealVectorSpace";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { Weight } from "../../../src/mathVector/Weight";
import { ProjectiveRealVectorSpace } from "../../../src/mathVector/ProjectiveRealVectorSpace";
import { ProjectiveVector3DReal } from "../../../src/mathVector/ProjectiveVector3DReal";
import { fromProjectiveReal3DToReal3D } from "../../../src/mathVector/changeVectorSpaceType/fromProjectiveReal3DToReal3D";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { EM_WEIGHT_TOO_SMALL } from "../../../src/ErrorMessages/ProjectiveVectors";

describe('Projective vector 3D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    it(`can transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector of a default 3D real vector space`, () => {
        const coordinates = [6, 12, 18];
        const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        const result = fromProjectiveReal3DToReal3D(projRealVector1);
        expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        expect(result.dimension).to.eql(dimension - 1);
        for(let i = 0; i < coordinates.length; i++) {
            expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        }
        expect(result.vectorSpace.isDefault).to.eql(true);
    });

    it(`can transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector of a user-defined 3D real vector space`, () => {
        const coordinates = [6, 12, 18];
        const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 3;
        const realVSpace = new RealVectorSpace(realSpaceDimension);
        const result = fromProjectiveReal3DToReal3D(projRealVector1, realVSpace);
        expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        expect(result.dimension).to.eql(dimension - 1);
        for(let i = 0; i < coordinates.length; i++) {
            expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        }
        expect(result.vectorSpace).to.eql(realVSpace)
        expect(result.vectorSpace.isDefault).to.eql(false);
    });

    it(`cannot transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector`, () => {
        const coordinates = [6, 12, 18];
        const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
        expect(projRealVector1.dimension).to.eql(dimension);
        expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        expect(projRealVector1.weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
        const realSpaceDimension = 3;
        const realVSpace = new RealVectorSpace(realSpaceDimension);
        expect(() => fromProjectiveReal3DToReal3D(projRealVector1, realVSpace)).to.throw(EM_WEIGHT_TOO_SMALL);
    });
});
