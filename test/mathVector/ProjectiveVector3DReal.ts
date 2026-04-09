import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { ProjectiveVector3DReal } from "../../src/mathVector/ProjectiveVector3DReal";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { ANGULAR_TOL_VECTOR, EM_NORM_TOO_SMALL, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { PROJECTIVEREALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../../src/ErrorMessages/WeightManager";
import { EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT } from "../../src/ErrorMessages/ProjectiveRealVectorSpace";
import { EM_DOT_PRODUCT_NOT_AVAILABLE } from "../../src/ErrorMessages/ProjectiveVectors";
import { createRealVectorSpace } from "../../src/mathVector/VectorSpaceFactory";

describe('Projective vector 3D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {
        it(`can generate a default projective real vector into the default 4D projective vector space`, () => {
            const projRealVector = new ProjectiveVector3DReal();
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with default weight into the default 4D projective vector space`, () => {
            const projRealVector = new ProjectiveVector3DReal(-1, 2, 4);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, 4, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(4);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into the default 4D vector space`, () => {
            const weight = new Weight(2);
            const projRealVector = new ProjectiveVector3DReal(-1, 2, -3, weight);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, -3, 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate a default projective real vector with a default weight into a user-defined 4D vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DReal(vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 4D vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DReal(1, -2, 3, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, 3, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(3);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into a user-defined 4D vector space`, () => {
            const weight = new Weight(2);
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DReal(1, -2, -3, weight, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, -3, weight.value]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default 3D vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(1);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} and null weight`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DReal(1, 2, 4, new Weight(0, false), vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, 4, 0]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(4);
            expect(projRealVector.getCoordinate(3)).to.eql(0);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(0);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
        });

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 4D vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const x = 4;
            const y = -2;
            const z = 6;
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projRealVector = new ProjectiveVector3DReal(x, y, z, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([x, y, z, DEFAULT_WEIGHT_VALUE]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(x);
            expect(projRealVector.getCoordinate(1)).to.eql(y);
            expect(projRealVector.getCoordinate(2)).to.eql(z);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate user-defined projective real vectors with prescribed weight management ${WeightManagement.SomeNullWeights} and null or strictly positive weights`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
            // vector with explicit null weight
            const projRealVector = new ProjectiveVector3DReal(1, 2, -3, new Weight(0, false), vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, -3, 0]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(0);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight.value).to.eql(0);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            // vector with strictly positive weight
            const projRealVector1 = new ProjectiveVector3DReal(0, -2, 4, vSpace);
            expect(projRealVector1.getCoordinate(0)).to.eql(0);
            expect(projRealVector1.getCoordinate(1)).to.eql(-2);
            expect(projRealVector1.getCoordinate(2)).to.eql(4);
            expect(projRealVector1.getCoordinate(3)).to.eql(1);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            // vector with possibly null weight
            const projRealVector2 = new ProjectiveVector3DReal(0, -2, 5, new Weight(2, false), vSpace);
            expect(projRealVector2.getCoordinate(0)).to.eql(0);
            expect(projRealVector2.getCoordinate(1)).to.eql(-2);
            expect(projRealVector2.getCoordinate(2)).to.eql(5);
            expect(projRealVector2.getCoordinate(3)).to.eql(2);
            expect(projRealVector2.weight.strictlyPositive).to.eql(false);
            expect(projRealVector2.weight.value).to.eql(2);
        });

        it(`cannot change the status of the weight manager attached to a default 4D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector3DReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(1);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(() => new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
        });

        it(`cannot change the status of the weight manager attached to a user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector = new ProjectiveVector3DReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            // A new vector space is registered that is different from the initial one -> the modification of the weight 
            // management is not possible
            expect(() => new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights)).to.not.throw();
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(0, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(2, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(1, 1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector3DReal(1, 2, -4, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(() =>  new ProjectiveVector3DReal(1, 2, -4, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`can generate a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const projRealVector = new ProjectiveVector3DReal(1, 2, 3, smallWeight);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, 3, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(3);
            expect(projRealVector.getCoordinate(3)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight).to.eql(smallWeight);
        });

        it(`can generate a vector with weight management ${WeightManagement.AllPositiveWeights} and an input weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const vectorSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DReal(1, 2, -3, smallWeight, vectorSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, -3, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight).to.eql(smallWeight);
        });

        it(`can generate a vector with weight management ${WeightManagement.SomeNullWeights} and an input weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const vectorSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector3DReal(1, 2, 3, smallWeight, vectorSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, 2, 3, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(3);
            expect(projRealVector.getCoordinate(3)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector.weight.strictlyPositive).to.eql(false);
            expect(projRealVector.weight).to.eql(smallWeight);

            const smallWeight1 = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const projRealVector1 = new ProjectiveVector3DReal(1, 2, 3, smallWeight1, vectorSpace);
            expect(projRealVector1.coordinates).to.eql([1, 2, 3, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector1.getCoordinate(0)).to.eql(1);
            expect(projRealVector1.getCoordinate(1)).to.eql(2);
            expect(projRealVector1.getCoordinate(2)).to.eql(3);
            expect(projRealVector1.getCoordinate(3)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            expect(projRealVector1.weight).to.eql(smallWeight1);
        });

        it(`cannot generate a default projective vector into a user-defined vector space if this vector space is not of type projective real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = createRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new ProjectiveRealVectorSpace(3);
            expect(() =>  new ProjectiveVector3DReal(vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space  with a default weight if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = createRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(2, -1, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(2, vSpace as unknown as number, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as number, -1, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            expect(() =>  new ProjectiveVector3DReal(2, -1, new Weight() as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(2, new Weight() as unknown as number, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, -1, 0)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a user-defined vector space if the user-specified coordinates are not numbers and/or the vector space is not of type projective real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(3);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 6, vSpace as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(4);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 6, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as number, -2, 6, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace as unknown as number, 6, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, vSpace as unknown as number, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(0, 4, new Weight() as unknown as number, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, new Weight() as unknown as number, -3, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 4, -3, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as number, -2, 3, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace as unknown as number, 3, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(1, 6, new Weight() as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(1, new Weight() as unknown as number, 4, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 6, 4, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space if the user-specified coordinates are not numbers and a weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(3);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 4, vSpace as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(4);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 4, vSpace1 as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as number, -2, 4, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace as unknown as number, 4, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, vSpace as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(4, 0, new Weight() as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(4, new Weight() as unknown as number, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 0, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(vSpace2 as unknown as number, -2, 3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace2 as unknown as number, 3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, vSpace2 as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(0, 1, new Weight() as unknown as number, -3 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, new Weight() as unknown as number, 4, 2 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 1, 4, 2 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a user-defined vector space if the user-specified coordinates are not numbers and a weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(3);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 3, new Weight(2), vSpace as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(4);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 3, new Weight(2), vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(vSpace as unknown as number, -2, 3, new Weight(), vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace as unknown as number, 3, new Weight(), vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -3, 3, vSpace as unknown as Weight, vSpace1 as unknown as ProjectiveRealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(0, 4, new Weight() as unknown as number, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, new Weight() as unknown as number, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 4, -3, new Weight())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            const vSpace2 = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(vSpace2 as unknown as number, -2, 4, new Weight(), vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, vSpace2 as unknown as number, 4, new Weight(), vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, vSpace2 as unknown as number, new Weight(), vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(0, -2, 4, vSpace2 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(1, 5, new Weight() as unknown as number, -3 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(1, new Weight() as unknown as number, 4, 2 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DReal(new Weight() as unknown as number, 5, 4, 2 as unknown as Weight, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective vector into a default vector space with user-specified coordinates and a prescribed weight of incorrect type`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const x = -1;
            const y = 6;
            const z = -6;
            const vSpace = new ProjectiveRealVectorSpace(3);
            expect(() =>  new ProjectiveVector3DReal(x, y, z, vSpace as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(4);
            expect(() =>  new ProjectiveVector3DReal(x, y, z, vSpace1 as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector3DReal(x, y, z, x as unknown as Weight)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`can generate a user-defined projective vector into a user-defined vector space even if the vector space is type casted into a Weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector3DReal(1, 3, 5, vSpace as unknown as Weight)).to.not.throw();
            const vector = new ProjectiveVector3DReal(1, 3, 5, vSpace as unknown as Weight);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(1);
            expect(vector.getCoordinate(1)).to.eql(3);
            expect(vector.getCoordinate(2)).to.eql(5);
            expect(vector.getCoordinate(3)).to.eql(1);
            expect(vector.weight).to.eql(new Weight());
        });

        it(`can generate a user-defined projective vector into a default vector space even if the weight is type casted into a projective vector space`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            expect(() =>  new ProjectiveVector3DReal(1, 3, 5, new Weight(3) as unknown as ProjectiveRealVectorSpace<4>)).to.not.throw();
            const vector = new ProjectiveVector3DReal(1, 3, 5, new Weight(3) as unknown as ProjectiveRealVectorSpace<4>);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.getCoordinate(0)).to.eql(1);
            expect(vector.getCoordinate(1)).to.eql(3);
            expect(vector.getCoordinate(2)).to.eql(5);
            expect(vector.getCoordinate(3)).to.eql(3);
            expect(vector.weight).to.eql(new Weight(3));
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DReal(1, 2, 3, vSpace);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
        });

        it(`can get the coordinates of a vector as x, y, z parameters`, () => {
            const projRealVector = new ProjectiveVector3DReal(1, 2, 3);
            expect(projRealVector.x).to.eql(1);
            expect(projRealVector.y).to.eql(2);
            expect(projRealVector.z).to.eql(3);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can get the weight of a vector as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projRealVector = new ProjectiveVector3DReal(1, 2, 3);
            const weight = 1;
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector3DReal(1, 2, 3, new Weight(weight1));
            expect(projRealVector1.w).to.eql(weight1);
        });

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector3DReal(1, 2, -3, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector3DReal(1, 2, -3, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector3DReal(1, 2, -3, new Weight(weight1, true), vSpace);
            expect(projRealVector1.w).to.eql(weight1);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });
    });

    describe('Methods', () => {

        it(`can get the vector descriptor as a string`, () => {
            const coordinates = [1, 3, -2];
            const vSpace1 = new ProjectiveRealVectorSpace(dimension);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            const string = projectiveVector1.toString();
            expect(string).to.eql(PROJECTIVEREALVECTOR3D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]}, ${new Weight().toString()})` + ` ` + projectiveVector1.vectorSpace.toString());
        });

        it(`cannot get a null norm with weight management ${WeightManagement.AllStrictlyPositiveWeights} because a null projective vector cannot be created`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });
        
        it(`can get a null norm with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });
        
        it(`can get a null norm with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.lessThan(TOLERANCE_FLOAT);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`can apply the homogeneous transform to a projective vector to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [2, 4, 6, 8];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
            expect(scaledToDefaultWeight.descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        });

        it(`can apply the homogeneous transform to a projective vector into a default vector space to set a weight with default value ${DEFAULT_WEIGHT_VALUE} with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [2, 4, 6, 8];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const scaledToDefaultWeight = projRealVector1.homogeneousTransform();
            expect(scaledToDefaultWeight.descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        });

        it(`can map a projective vector into a vector of a default real vector space`, () => {
            const coordinates = [2, 4, 6, 8];
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const realVector = projRealVector1.toRealVector();
            expect(realVector.dimension).to.eql(3);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(2)).to.eql(coordinates[2] / projRealVector1.weight.value);
        });

        it(`can map a projective vector into a vector of a user-defined real vector space`, () => {
            const coordinates = [2, 4, 6, 10];
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const realVSpace = new RealVectorSpace(3);
            const realVector = projRealVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(3);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace.id).to.eql(realVSpace.id);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1] / projRealVector1.weight.value);
            expect(realVector.getCoordinate(2)).to.eql(coordinates[2] / projRealVector1.weight.value);
        });

        it(`can map a projective vector with null weight into a vector of a user-defined real vector space`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const realVSpace = new RealVectorSpace(3);
            const realVector = projRealVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(3);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace.id).to.eql(realVSpace.id);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
            expect(realVector.getCoordinate(2)).to.eql(coordinates[2]);
        });

        it(`can map a projective vector with null weight into a vector of a default real vector space`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const realVector = projRealVector1.toRealVector();
            expect(realVector.dimension).to.eql(3);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
            expect(realVector.getCoordinate(2)).to.eql(coordinates[2]);
        });

        it(`cannot map a projective vector into a vector of a projective complex vector space`, () => {
            const coordinates = [2, 4, 6];
            const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(), vSpace);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => projRealVector1.toProjectiveComplexVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });


        describe('Methods with binary operators whose unit tests cannot be factorized', () => {
            const defaultCoordinates = [1, 2, 3];
            const defaultWeight = new Weight(DEFAULT_WEIGHT_VALUE);
            const defaultPositiveWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultWeight, new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vectorSpace);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same user-defined vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], new Weight(DEFAULT_WEIGHT_VALUE), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(coordinates[dimension - 1] + defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            });

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0,false), vSpace);
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.weight).to.eql(defaultWeight);
            });

            it(`can add a vector with another projective vector in the same user-defined vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [-1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(projRealVector1.weight).to.eql(defaultWeight);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0,false), vSpace);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.weight).to.eql(defaultWeight);
            });

            it(`can add a vector with another projective vector in the same default vector space with ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [1, -3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0,false), vSpace);
                expect(projRealVector2.vectorSpace.isDefault).to.eql(true);
                const result = projRealVector1.add(projRealVector2);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(coordinates[i] + defaultCoordinates[i]);
                }
                expect(result.getCoordinate(dimension - 1)).to.eql(defaultWeight.value);
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
            });

            it(`can add a vector with another projective vector with weight smaller than ${NULL_WEIGHT_TOLERANCE} in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
                const coordinates = [-1, 3, 5, 7];
                const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE));
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], smallWeight, vSpace);
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
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], smallWeight, vSpace);
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
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultPositiveWeight, vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(projRealVector1.weight).to.eql(new Weight(DEFAULT_WEIGHT_VALUE, false));
                expect(() => new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], smallWeight, vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            });

            it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
                const coordinates = [1, 3, 5, 7];
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[3]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector2 = new ProjectiveVector3DReal(defaultCoordinates[0], defaultCoordinates[1], defaultCoordinates[2], defaultWeight, vSpace);
                expect(projRealVector2.dimension).to.eql(projRealVector1.dimension);
                expect(() => projRealVector1.add(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]));
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });

            it(`can subtract a vector from another projective vector of same dimension belonging to the same user-defined vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vSpace);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]));
            });

            it(`can subtract a vector from another projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(projRealVector1.vectorSpace);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(true);
                expect(result.weight).to.eql(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1], false));
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into an arbitrary small positive weight`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE, coordinates[3] - NULL_WEIGHT_TOLERANCE];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vSpace);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                expect(result.coordinates).to.eql(resultCoordinates.slice(0, dimension));
                expect(result.vectorSpace).to.eql(vSpace);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.weight.value).to.be.closeTo(new Weight(coordinates[dimension - 1] - coordinates2[dimension - 1]).value, TOLERANCE_FLOAT);
            });

            it(`cannot subtract a vector from another projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into a negative weight difference even smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.eql(0);
            });

            it(`cannot subtract a vector from another projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference larger than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, coordinates[3] + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                expect(() => projRealVector1.subtract(projRealVector2)).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT)
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} when each vector has a different weight status. The resulting weight status being false when the resulting weight is strictly positive and smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] - NULL_WEIGHT_TOLERANCE / 2, coordinates[3] - NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.greaterThan(0);
                expect(result.weight.value).to.lessThan(NULL_WEIGHT_TOLERANCE);
                expect(result.weight.strictlyPositive).to.eql(false);
            });

            it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
                const coordinates = [2, 4, 6, 8];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const coordinates2 = [1, 3, coordinates[2] + NULL_WEIGHT_TOLERANCE / 2, coordinates[3] + NULL_WEIGHT_TOLERANCE / 2];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(projRealVector2.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const result = projRealVector1.subtract(projRealVector2);
                const resultCoordinates = coordinates.map((c, i) => c - coordinates2[i]);
                for (let i = 0; i < dimension - 1; i++) {
                    expect(result.getCoordinate(i)).to.eql(resultCoordinates[i]);
                }
                expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(result.dimension).to.eql(dimension);
                expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                expect(result.vectorSpace.isDefault).to.eql(false);
                expect(result.weight.value).to.eql(0);
                expect(result.weight.strictlyPositive).to.eql(false);
            });

            it(`cannot check the parallelism of vectors belonging to different vector spaces`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]));
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the parallelism of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the parallelism of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isParallel(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]));
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            });

            it(`cannot check the orthogonality of vectors if the first one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [1, 3, 5, 7];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`cannot check the orthogonality of vectors if the second one has a norm smaller than the linear tolerance`, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vSpace);
                expect(() => projRealVector1.isOrthogonal(projRealVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, -1, 2];
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]),
                    new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1, 1];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
                const coordinates = [1, 0, -1, 1];
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]),
                    new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1, 2];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllPositiveWeights}`, () => {
                const coordinates = [2, 1, 1, 0];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 1, 0];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1], false), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.SomeNullWeights}`, () => {
                const coordinates = [2, 1, 1, 0];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.SomeNullWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1], false), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 1, 1];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space with ${WeightManagement.AllStrictlyPositiveWeights} within the default tolerance ${ANGULAR_TOL_VECTOR}`, () => {
                const coordinates = [1, 1, 0, ANGULAR_TOL_VECTOR / 2];
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 0, 1];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2)).to.eql(true);
            });

            it(`can check the orthogonality of a vector with another projective vector in the same custom vector space within a user-defined tolerance`, () => {
                const coordinates = [1, 1, 0, ANGULAR_TOL_VECTOR * 1.5];
                const userDefinedTolerance = ANGULAR_TOL_VECTOR * 2;
                expect(userDefinedTolerance).to.be.greaterThan(ANGULAR_TOL_VECTOR);
                const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 1, 0, 1];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(projRealVector1.isOrthogonal(projRealVector2, userDefinedTolerance)).to.eql(true);
            });

            it(`cannot use the dot product for projective vectors`, () => {
                const coordinates = [1, 0, 1, 1];
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]),
                    new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true));
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(true);
                expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
                const vectorSpace = projRealVector1.vectorSpace;
                const coordinates2 = [-1, 0, 1, 1];
                const projRealVector2 = new ProjectiveVector3DReal(coordinates2[0], coordinates2[1], coordinates2[2], new Weight(coordinates2[dimension - 1]), vectorSpace);
                expect(() => projRealVector1.dot(projRealVector2)).to.throw(EM_DOT_PRODUCT_NOT_AVAILABLE);
            });

            it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
                const coordinates = [1, 3, 5, 7];
                const vSpace = new ProjectiveRealVectorSpace(dimension);
                const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), vSpace);
                expect(projRealVector1.dimension).to.eql(dimension);
                expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
                expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
                const projRealVector2 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(coordinates[dimension - 1]), undefined);
                expect(() => projRealVector1.equals(projRealVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            });
        });

        // it(`can transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector of a default 3D real vector space`, () => {
        //     const coordinates = [6, 12, 3];
        //     const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(3), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        //     const result = projRealVector1.toRealVector();
        //     expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        //     expect(result.dimension).to.eql(dimension - 1);
        //     for(let i = 0; i < coordinates.length; i++) {
        //         expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        //     }
        //     expect(result.vectorSpace.isDefault).to.eql(true);
        // });

        // it(`can transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector of a user-defined 3D real vector space`, () => {
        //     const coordinates = [6, 12, 8];
        //     const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 3;
        //     const realVSpace = createRealVectorSpace(realSpaceDimension);
        //     const result = projRealVector1.toRealVector(realVSpace);
        //     expect(result.spaceType).to.eql(VectorSpaceType.REAL);
        //     expect(result.dimension).to.eql(dimension - 1);
        //     for(let i = 0; i < coordinates.length; i++) {
        //         expect(result.getCoordinate(i)).to.eql(coordinates[i] / projRealVector1.weight.value)
        //     }
        //     expect(result.vectorSpace).to.eql(realVSpace)
        //     expect(result.vectorSpace.isDefault).to.eql(false);
        // });

        // it(`cannot transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector`, () => {
        //     const coordinates = [6, 12, 2];
        //     const vSpace = new ProjectiveRealVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 3;
        //     const realVSpace = createRealVectorSpace(realSpaceDimension);
        //     expect(() => projRealVector1.toRealVector(realVSpace)).to.throw(EM_WEIGHT_TOO_SMALL);
        // });
    });
})