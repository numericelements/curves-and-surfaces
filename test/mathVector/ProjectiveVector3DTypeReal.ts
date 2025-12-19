import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { ProjectiveVector3DTypeReal } from "../../src/mathVector/ProjectiveVector3DTypeReal";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { EM_NORM_TOO_SMALL, EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE } from "../../src/namedConstants/Vectors";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_WEIGHT_TOO_SMALL } from "../../src/ErrorMessages/ProjectiveVectors";
import { PROJECTIVEVECTOR3D } from "../../src/namedConstants/VectorTypeTags";

describe('Projective vector 3D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {
        it(`can generate a default projective real vector into the default 4D projective vector space`, () => {
            const projRealVector = new ProjectiveVector3DTypeReal();
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with default weight into the default 4D projective vector space`, () => {
            const projRealVector = new ProjectiveVector3DTypeReal(-1, 2, 4);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, 4, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(4);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into the default 4D vector space`, () => {
            const weight = new Weight(2);
            const projRealVector = new ProjectiveVector3DTypeReal(-1, 2, -3, weight);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([-1, 2, -3, 2]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(-1);
            expect(projRealVector.getCoordinate(1)).to.eql(2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate a default projective real vector with a default weight into a user-defined 4D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DTypeReal(vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(0);
            expect(projRealVector.getCoordinate(1)).to.eql(0);
            expect(projRealVector.getCoordinate(2)).to.eql(0);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with default weight into a user-defined 4D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DTypeReal(1, -2, 3, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, 3, 1]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(3);
            expect(projRealVector.getCoordinate(3)).to.eql(new Weight().value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary projective real vector with prescribed weight into a user-defined 4D vector space`, () => {
            const weight = new Weight(2);
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DTypeReal(1, -2, -3, weight, vSpace);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([1, -2, -3, weight.value]);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.getCoordinate(0)).to.eql(1);
            expect(projRealVector.getCoordinate(1)).to.eql(-2);
            expect(projRealVector.getCoordinate(2)).to.eql(-3);
            expect(projRealVector.getCoordinate(3)).to.eql(weight.value);
            expect(projRealVector.weight.strictlyPositive).to.eql(true);
            expect(projRealVector.weight.value).to.eql(weight.value);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default 3D vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DTypeReal(vSpace);
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
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        });

        it(`can generate a default projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} and null weight`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 4, new Weight(0, false), vSpace);
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
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        });

        it(`can generate user-defined projective real vectors with prescribed weight management ${WeightManagement.SomeNullWeights} and null or strictly positive weights`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            // vector with explicit null weight
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, -3, new Weight(0, false), vSpace);
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
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            // vector with strictly positive weight
            const projRealVector1 = new ProjectiveVector3DTypeReal(0, -2, 4, vSpace);
            expect(projRealVector1.getCoordinate(0)).to.eql(0);
            expect(projRealVector1.getCoordinate(1)).to.eql(-2);
            expect(projRealVector1.getCoordinate(2)).to.eql(4);
            expect(projRealVector1.getCoordinate(3)).to.eql(1);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            // vector with possibly null weight
            const projRealVector2 = new ProjectiveVector3DTypeReal(0, -2, 5, new Weight(2, false), vSpace);
            expect(projRealVector2.getCoordinate(0)).to.eql(0);
            expect(projRealVector2.getCoordinate(1)).to.eql(-2);
            expect(projRealVector2.getCoordinate(2)).to.eql(5);
            expect(projRealVector2.getCoordinate(3)).to.eql(2);
            expect(projRealVector2.weight.strictlyPositive).to.eql(false);
            expect(projRealVector2.weight.value).to.eql(2);
        });

        it(`cannot change the status of the weight manager attached to a default 4D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector3DTypeReal(vSpace);
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
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(() => new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
        });

        it(`cannot change the status of the weight manager attached to a user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projRealVector = new ProjectiveVector3DTypeReal(vSpace);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            let weightMgmt = projRealVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.SomeNullWeights);
            expect(projRealVector.coordinates.length).to.eql(dimension);
            expect(projRealVector.coordinates).to.eql([0, 0, 0, 1]);
            // A new vector space is registered that is different from the initial one -> the modification of the weight 
            // management is not possible
            expect(() => new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights)).to.not.throw();
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and default 3D projective real vector space`, () => {
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(0, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(2, false))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a null weight, or a weight that can become null, to a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 1, 1, new Weight(2, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and default 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 2, -4, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot set a strictly positive weight to a vector with weight management ${WeightManagement.AllPositiveWeights} and user-defined 3D projective real vector space`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(() =>  new ProjectiveVector3DTypeReal(1, 2, -4, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`can generate a vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight value smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const smallWeight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 3, smallWeight);
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
            const vectorSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, -3, smallWeight, vectorSpace);
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
            const vectorSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 3, smallWeight, vectorSpace);
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
            const projRealVector1 = new ProjectiveVector3DTypeReal(1, 2, 3, smallWeight1, vectorSpace);
            expect(projRealVector1.coordinates).to.eql([1, 2, 3, NULL_WEIGHT_TOLERANCE / 2]);
            expect(projRealVector1.getCoordinate(0)).to.eql(1);
            expect(projRealVector1.getCoordinate(1)).to.eql(2);
            expect(projRealVector1.getCoordinate(2)).to.eql(3);
            expect(projRealVector1.getCoordinate(3)).to.eql(NULL_WEIGHT_TOLERANCE / 2);
            expect(projRealVector1.weight.strictlyPositive).to.eql(true);
            expect(projRealVector1.weight).to.eql(smallWeight1);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension);
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 3, vSpace);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
        });

        it(`can get the coordinates of a vector as x, y, z parameters`, () => {
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 3);
            expect(projRealVector.x).to.eql(1);
            expect(projRealVector.y).to.eql(2);
            expect(projRealVector.z).to.eql(3);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can get the weight of a vector as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, 3);
            const weight = 1;
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector3DTypeReal(1, 2, 3, new Weight(weight1));
            expect(projRealVector1.w).to.eql(weight1);
        });

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, -3, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it(`can get the weight as w parameter of a vector into a default vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const weight = 0;
            const projRealVector = new ProjectiveVector3DTypeReal(1, 2, -3, new Weight(weight, false), vSpace);
            expect(projRealVector.w).to.eql(weight);
            expect(projRealVector.dimension).to.eql(dimension);
            expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const weight1 = 3;
            const projRealVector1 = new ProjectiveVector3DTypeReal(1, 2, -3, new Weight(weight1, true), vSpace);
            expect(projRealVector1.w).to.eql(weight1);
            expect(projRealVector1.dimension).to.eql(dimension);
            expect(projRealVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projRealVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
            expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });
    });

    describe('Methods', () => {

        it(`can get the vector descriptor as a string`, () => {
            const coordinates = [1, 3, -2];
            const vSpace1 = new ProjectiveVectorSpace(dimension);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            const string = projectiveVector1.toString();
            expect(string).to.eql(PROJECTIVEVECTOR3D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]}, ${new Weight().toString()})` + ` ` + projectiveVector1.vectorSpace.toString());
        });

        it(`cannot get a null norm with weight management ${WeightManagement.AllStrictlyPositiveWeights} because a null projective vector cannot be created`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(() =>  new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });
        
        it(`can get a null norm with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });
        
        it(`can get a null norm with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(0, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.eql(0);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector1.norm()).to.be.lessThan(TOLERANCE_FLOAT);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });
        
        it(`cannot normalize a vector with a norm smaller than ${NULL_WEIGHT_TOLERANCE} and weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [0, 0, 0];
            const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const projectiveVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2, false), vSpace);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVEVECTOR3D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        // it(`can transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight greater than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector of a default 3D real vector space`, () => {
        //     const coordinates = [6, 12, 3];
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(3), vSpace);
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
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 3;
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

        // it(`cannot transform a projective real 4D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} and a weight smaller than ${NULL_WEIGHT_TOLERANCE} into a real 3D vector`, () => {
        //     const coordinates = [6, 12, 2];
        //     const vSpace = new ProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     const projRealVector1 = new ProjectiveVector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], new Weight(NULL_WEIGHT_TOLERANCE / 2), vSpace);
        //     expect(projRealVector1.dimension).to.eql(dimension);
        //     expect(projRealVector1.vectorSpace.isDefault).to.eql(false);
        //     expect(projRealVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(projRealVector1.weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
        //     const realSpaceDimension = 3;
        //     const realVSpace = new RealVectorSpace(realSpaceDimension);
        //     expect(() => projRealVector1.toRealVector(realVSpace)).to.throw(EM_WEIGHT_TOO_SMALL);
        // });
    });
})