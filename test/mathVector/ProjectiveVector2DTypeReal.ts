import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { PROJECTIVEVECTOR2D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { EM_REALVECTORS_DIFFERENT_DIM } from "../../src/ErrorMessages/RealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";

describe('Projective vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {
        it(`can generate a default projective real vector into the default 3D vector space`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal();
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with default weight into the default 3D vector space`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal(-1, 2);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into the default 3D vector space`, () => {
            const weight = new Weight(2);
            const projRealVector = new ProjectiveVector2DTypeReal(-1, 2, weight);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(weight.weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(weight.weight);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate a default projective real vector with a default weight into a user-defined 3D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector2DTypeReal(vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 3D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector2DTypeReal(1, -2, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into a user-defined 3D vector space`, () => {
            const weight = new Weight(2);
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector2DTypeReal(1, -2, weight, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, weight.weight]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(weight.weight);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.weight).to.eql(weight.weight);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default 3D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector2DTypeReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(1);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        });

        it(`cannot change the status of the weight manager attached to a default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector2DTypeReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(1);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(() => new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true)).to.throw();
        });
    });
});