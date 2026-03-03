import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_NORM_TOO_SMALL, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { PROJECTIVEVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { Complex } from "../../src/mathVector/Complex";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { EM_DOT_PRODUCT_NOT_AVAILABLE, EM_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../../src/ErrorMessages/ProjectiveVectors";
import { createTestProjectiveVector } from "./ProjectiveVectorSpaceTestFactory";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../../src/ErrorMessages/WeightManager";
import { EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT } from "../../src/ErrorMessages/ProjectiveVectorSpace";

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
            const x = -1;
            const y = 2;
            const projRealVector = new ProjectiveVector2DTypeReal(x, y);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight).to.eql(new Weight());
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

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 3D vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const x = 4;
            const y = -2;
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projRealVector = new ProjectiveVector2DTypeReal(x, y, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 3D vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const x = 4;
            const y = -2;
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projRealVector = new ProjectiveVector2DTypeReal(x, y, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a default 3D vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const x = 4;
            const y = -2;
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projRealVector = new ProjectiveVector2DTypeReal(x, y, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a default 3D vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const x = 4;
            const y = -2;
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projRealVector = new ProjectiveVector2DTypeReal(x, y, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
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
            expect(vSpace.isDefault).to.eql(true);
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

        it(`cannot generate a default projective vector into a user-defined vector space if this vector space is not of type projective real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new ProjectiveVectorSpace(4);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space  with a default weight if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(2, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as number, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector2DTypeReal(2, new Weight() as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a user-defined vector space if the user-specified coordinates are not numbers and/or the vector space is not of type projective real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveVectorSpace(4);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, vSpace as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as number, -2, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace as unknown as number, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(0, new Weight() as unknown as number, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, -3, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as number, -2, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(1, new Weight() as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, 4, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space if the user-specified coordinates are not numbers and a weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveVectorSpace(4);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, vSpace as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, vSpace1 as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as number, -2, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(0, new Weight() as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace2 as unknown as number, -2, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace2 as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(1, new Weight() as unknown as number, -3 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, 4, 2 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a user-defined vector space if the user-specified coordinates are not numbers and a weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveVectorSpace(4);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, new Weight(2), vSpace as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, new Weight(2), vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace as unknown as number, -2, new Weight(), vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace as unknown as number, new Weight(), vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -3, vSpace as unknown as Weight, vSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(0, new Weight() as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(vSpace2 as unknown as number, -2, new Weight(), vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, vSpace2 as unknown as number, new Weight(), vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(0, -2, vSpace2 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(1, new Weight() as unknown as number, -3 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector2DTypeReal(new Weight() as unknown as number, 4, 2 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space with user-specified coordinates and a prescribed weight of incorrect type`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const x = -1;
            const y = 6;
            const vSpace = new ProjectiveVectorSpace(4);
            expect(() =>  new ProjectiveVector2DTypeReal(x, y, vSpace as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new ProjectiveVector2DTypeReal(x, y, vSpace1 as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector2DTypeReal(x, y, x as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`can generate a user-defined projective vector into a user-defined vector space even if the vector space is type casted into a Weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveVectorSpace(dimension);
            expect(() =>  new ProjectiveVector2DTypeReal(1, 3, vSpace as unknown as Weight)).to.not.throw();
            const vector = new ProjectiveVector2DTypeReal(1, 3, vSpace as unknown as Weight);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(1);
            expect(vector.getCoordinate(1)).to.eql(3);
            expect(vector.getCoordinate(2)).to.eql(1);
            expect(vector.weight).to.eql(new Weight());
        });

        it(`can generate a user-defined projective vector into a default vector space even if the weight is type casted into a projective vector space`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            expect(() =>  new ProjectiveVector2DTypeReal(1, 3, new Weight(3) as unknown as ProjectiveVectorSpace<3>)).to.not.throw();
            const vector = new ProjectiveVector2DTypeReal(1, 3, new Weight(3) as unknown as ProjectiveVectorSpace<3>);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.getCoordinate(0)).to.eql(1);
            expect(vector.getCoordinate(1)).to.eql(3);
            expect(vector.getCoordinate(2)).to.eql(3);
            expect(vector.weight).to.eql(new Weight(3));
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

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
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

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector2DTypeReal(1, 2, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector2DTypeReal(1, 2, new Weight(weight1, true), vSpace);
            expect(projRealVector1.w).to.eql(weight1);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });
    });

    describe('Methods', () => {

        it(`can get the vector descriptor as a string`, () => {
            const coordinates = [1, 3];
            const vSpace1 = new ProjectiveVectorSpace(dimension);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], vSpace1);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            const string = projectiveVector1.toString();
            expect(string).to.eql(PROJECTIVEVECTOR2D + `(${coordinates[0]}, ${coordinates[1]}, ${new Weight().toString()})` + ` `+ projectiveVector1.vectorSpace.toString());
        });

        it(`cannot get a null norm with weight management ${WeightManagement.AllStrictlyPositiveWeights} because a null projective vector cannot be created`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`can get a null norm with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });

        it(`can get a null norm with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });

        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.lessThan(TOLERANCE_FLOAT);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`can apply the homogeneous transform to a projective vector to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
            expect(scaledToDefaultWeight.descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        });

        it(`can apply the homogeneous transform to a projective vector into a default vector space to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
            expect(scaledToDefaultWeight.descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        });

        it(`can map a projective vector into a vector of a default real vector space`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const realVector = projRealVector1.toRealVector();
            expect(realVector.dimension).to.eql(2);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1] / projRealVector1.weight.value);
        });

        it(`can map a projective vector into a vector of a user-defined real vector space`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const realVSpace = new RealVectorSpace(2);
            const realVector = projRealVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(2);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace.id).to.eql(realVSpace.id);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1] / projRealVector1.weight.value);
        });

        it(`can map a projective vector with null weight into a vector of a user-defined real vector space`, () => {
            const coordinates = [2, 4];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(0, false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const realVSpace = new RealVectorSpace(2);
            const realVector = projRealVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(2);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace.id).to.eql(realVSpace.id);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
        });

        it(`can map a projective vector with null weight into a vector of a default real vector space`, () => {
            const coordinates = [2, 4];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(0, false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const realVector = projRealVector1.toRealVector();
            expect(realVector.dimension).to.eql(2);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
        });

        it(`can map a projective vector into a projective complex vector of a default projective complex vector space and same weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector();
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a projective vector into a projective complex vector of a default projective complex vector space and same weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights, true);
            // projectiveComplexVS is not used as input of toProjectiveComplexVector because it is a default projective complex vector space.
            // However, being created, it exists and is available as default without using its identifier.
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector();
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a projective vector into a projective complex vector of a default projective complex vector space and same weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [2, 4, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights, true);
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector(projectiveComplexVS);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot map a projective vector into a projective complex vector of a default projective complex vector space with different categories of weight management`, () => {
            const coordinates = [2, 4, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights, true);
            expect(() => projRealVector1.toProjectiveComplexVector(projectiveComplexVS)).to.throw(EM_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`can map a projective vector into a projective complex vector of a custom projective complex vector space and same weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector(projectiveComplexVS);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a projective vector into a projective complex vector of a custom projective complex vector space and same weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [2, 4, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights);
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector(projectiveComplexVS);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a projective vector into a projective complex vector of a custom projective complex vector space and same weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights);
            const projectiveComplexVector = projRealVector1.toProjectiveComplexVector(projectiveComplexVS);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(coordinates[dimension - 1]);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        // it(`can transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector of a default 2D real vector space`, () => {
        //     const coordinates = [6, 12];
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.norm()).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        //     const result = projRealVector1.toRealVector();
        //     expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        //     expect(result.dimension).to.eql(dimension - 1);
        //     for(let i = 0; i < coordinates.length; i++) {
        //         expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        //     }
        //     expect(result.vectorSpace.isDefault).to.eql(true);
        // });

        // it(`can transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector of a user-defined 2D real vector space`, () => {
        //     const coordinates = [6, 12];
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 2;
        //     const realVSpace = new RealVectorSpace(realSpaceDimension);
        //     const result = projRealVector1.toRealVector(realVSpace);
        //     expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        //     expect(result.dimension).to.eql(dimension - 1);
        //     for(let i = 0; i < coordinates.length; i++) {
        //         expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        //     }
        //     expect(result.vectorSpace).to.eql(realVSpace)
        //     expect(result.vectorSpace.isDefault).to.eql(false);
        // });

        // it(`cannot transform a projective real 3D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${NULL_WEIGHT_TOLERANCE} into a real 2D vector`, () => {
        //     const coordinates = [6, 12];
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 2;
        //     const realVSpace = new RealVectorSpace(realSpaceDimension);
        //     expect(() => projRealVector1.toRealVector(realVSpace)).to.throw(EM_WEIGHT_TOO_SMALL);
        // });

        describe('Methods with binary operators whose unit tests cannot be factorized', () => {
            const defaultCoordinates = [1, 2, 3];
            const defaultWeight = new Weight(DEFAULT_WEIGHT_VALUE);
            const defaultPositiveWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const coordinates = [1, 3, 5];

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {

                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], new Weight(defaultCoordinates[dimension - 1]), vectorSpace);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultCoordinates[dimension - 1]);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same user-defined vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], new Weight(defaultCoordinates[dimension - 1]), vSpace);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultCoordinates[dimension - 1]);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, -3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], new Weight(0,false), vSpace);
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
                const coordinates = [-1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], new Weight(0,false), vSpace);
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
                const coordinates = [1, -3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], new Weight(0,false), vSpace);
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
                const coordinates = [-1, 3, 5];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE));
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], smallWeight, vSpace);
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
                const coordinates = [1, -3, 5];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], smallWeight, vSpace);
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
                const coordinates = [1, -3, 5];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                expect(() => new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], smallWeight, vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            });

            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], defaultWeight, undefined);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector2 = new ProjectiveVector2DTypeReal(defaultCoordinates[0], defaultCoordinates[1], defaultWeight, vSpace);
                expect(projRealVector2.dimension).to.eql(projRealVector1.dimension);
                expect(() => projRealVector1.add(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]));
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vSpace);
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, 5];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vSpace);
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} when each vector has a different weight status. The resulting weight status being false when the resulting weight is strictly positive and smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
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
                const coordinates = [2, 4, 6];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
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

            it(`cannot check the parallelism of vectors belonging to different vector spaces`, () => {
                const coordinates = [1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]));
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the parallelism of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [1, 3, 5];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the parallelism of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`can check the parallelism of a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, 1];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 0, 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2)).to.eql(true);
            });

            it(`can check the parallelism of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, 1];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 0, 2];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2)).to.eql(true);
            });

            it(`can check the parallelism of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [1, 1, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 2, 0];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2)).to.eql(true);
            });

            it(`can check the parallelism of a vector with another projective vector in the same custom vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, 1, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 2, 0];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2)).to.eql(true);
            });

            it(`can check the parallelism of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights} within the default tolerance ${ANGULAR_TOL_VECTOR}`, () => {
                const coordinates = [1, 1, ANGULAR_TOL_VECTOR / 2];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 2, ANGULAR_TOL_VECTOR];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2)).to.eql(true);
            });

            it(`can check the parallelism of a vector with another projective vector in the same custom vector space within a user-defined tolerance`, () => {
                const coordinates = [1, 1, ANGULAR_TOL_VECTOR * 1.5];
                const userDefinedTolerance = ANGULAR_TOL_VECTOR * 2;
                expect(userDefinedTolerance).to.be.greaterThan(ANGULAR_TOL_VECTOR);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [2, 2, ANGULAR_TOL_VECTOR];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isParallel(projRealVector2, userDefinedTolerance)).to.eql(true);
            });

            it(`cannot check the orthogonality of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [1, 3, 5];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
                const coordinates = [1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]));
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the orthogonality of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, 1];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, 1];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [1, 1, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 0];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1], false), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, 1, 0];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights} within the default tolerance ${ANGULAR_TOL_VECTOR}`, () => {
                const coordinates = [1, 1, ANGULAR_TOL_VECTOR / 2];
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space within a user-defined tolerance`, () => {
                const coordinates = [1, 1, ANGULAR_TOL_VECTOR * 1.5];
                const userDefinedTolerance = ANGULAR_TOL_VECTOR * 2;
                expect(userDefinedTolerance).to.be.greaterThan(ANGULAR_TOL_VECTOR);
                const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2, userDefinedTolerance)).to.eql(true);
            });

            it(`cannot use the dot product for projective vectors`, () => {
                const coordinates = [1, 0, 1];
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]),
                    new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1];
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates2[0], coordinates2[1], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(() => projRealVector1.dot(projRealVector2)).to.throw(EM_DOT_PRODUCT_NOT_AVAILABLE);
           });

            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const coordinates = [1, 3, 5];
                const vSpace = new ProjectiveVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector2DTypeReal(coordinates[0], coordinates[1], new Weight(coordinates[dimension - 1]));
                expect(() => projRealVector1.equals(projRealVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });
        });
    });
});