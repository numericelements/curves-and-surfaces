import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { PROJECTIVEVECTOR2D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { ANGULAR_TOL_VECTOR, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";

describe('Projective vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {
        it(`can generate a default projective real vector into the default 3D projective vector space`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal();
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with default weight into the default 3D projective vector space`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal(-1, 2);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projRealVector.getCoordinate(2)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
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
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projRealVector.coordinates).to.eql([1, -2, weight.value]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
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
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} and null weight`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, new Weight(0, false), vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, 0]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(0);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        });

        it(`can generate user-defined projective real vectors with prescribed weight management ${WeightManagement.SomeNullWeights} and null or strictly positive weights`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            // vector with explicit null weight
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, new Weight(0, false), vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, 0]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(0);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            // vector with strictly positive weight
            const projRealVector1 = new ProjectiveVector2DTypeReal(0, -2, vSpace);
            expect(projRealVector1.getCoordinate(0)).to.eql(0);
            expect(projRealVector1.getCoordinate(1)).to.eql(-2);
            expect(projRealVector1.getCoordinate(2)).to.eql(1);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            // vector with possibly null weight
            const projRealVector2 = new ProjectiveVector2DTypeReal(0, -2, new Weight(2, false), vSpace);
            expect(projRealVector2.getCoordinate(0)).to.eql(0);
            expect(projRealVector2.getCoordinate(1)).to.eql(-2);
            expect(projRealVector2.getCoordinate(2)).to.eql(2);
            expect(projRealVector2.weight.strictlyPositive).to.eql(false);
            expect(projRealVector2.weight.value).to.eql(2);
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
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(() => new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
        });

        it(`cannot change the status of the weight manager attached to a user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector = new ProjectiveVector2DTypeReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 1]);
            // A new vector space is registered that is different from the initial one -> the modification of the weight 
            // management is not possible
            expect(() => new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights)).to.not.throw();
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(0, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(2, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 2, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 2, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`can generate a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, smallWeight);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight).to.eql(smallWeight);
        });

        it(`can generate a vector with weight management ${WeightManagement.AllPositiveWeights} and an input weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const vectorSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, smallWeight, vectorSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight).to.eql(smallWeight);
        });

        it(`can generate a vector with weight management ${WeightManagement.SomeNullWeights} and an input weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const vectorSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, smallWeight, vectorSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight).to.eql(smallWeight);

            const smallWeight1 = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const projRealVector1 = new ProjectiveVector2DTypeReal(1, 2, smallWeight1, vectorSpace);
            expect(projRealVector1.coordinates).to.eql([1, 2, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector1.getCoordinate(0)).to.eql(1);
            expect(projRealVector1.getCoordinate(1)).to.eql(2);
            expect(projRealVector1.getCoordinate(2)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            expect(projRealVector1.weight).to.eql(smallWeight1);
        });
    });

    describe('Accessors', () => {
    
        it(`can get the vector type of a vector`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, vSpace);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        });

        it(`can get the coordinates of a vector as x, y parameters`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2);
            expect(projRealVector.x).to.eql(1);
            expect(projRealVector.y).to.eql(2);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can get the weight of a vector as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2);
            const weight = 1;
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector2DTypeReal(1, 2, new Weight(weight1));
            expect(projRealVector1.w).to.eql(weight1);
        });

        it(`can get the weight of a vector as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

    });
});