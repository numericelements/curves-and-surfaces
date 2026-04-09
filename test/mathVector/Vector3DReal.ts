import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Vector3DReal } from "../../src/mathVector/Vector3DReal";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { PROJECTIVEREALVECTOR3D, REALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";

describe('Vector 3D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 3D vector space`, () => {
            const realVector = new Vector3DReal();
            expect(realVector.coordinates).to.eql([0, 0, 0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.getCoordinate(2)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into the default 3D vector space`, () => {
            const realVector = new Vector3DReal(-1, 2, 1);
            expect(realVector.coordinates).to.eql([-1, 2, 1]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(-1);
            expect(realVector.getCoordinate(1)).to.eql(2);
            expect(realVector.getCoordinate(2)).to.eql(1);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default real vector into a 3D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DReal(vSpace);
            expect(realVector.coordinates).to.eql([0, 0, 0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.getCoordinate(2)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into a 3D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector3DReal(1, -2, 4, vSpace);
            expect(realVector.coordinates).to.eql([1, -2, 4]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(1);
            expect(realVector.getCoordinate(1)).to.eql(-2);
            expect(realVector.getCoordinate(2)).to.eql(4);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is not of type real and of same dimension as the vector`, () => {
           // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector3DReal(vSpace as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector3DReal(vSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a default vector space if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector3DReal(0, 1, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(2, vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(vSpace as unknown as number, 0, -1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a user-specified vector space if the user-specified coordinates are not numbers and/or the vector space is not of type real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector3DReal(0, -2, 1, vSpace as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector3DReal(0, -2, 1, vSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(vSpace as unknown as number, -2, 1, vSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(0, vSpace as unknown as number, -2, vSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(0, 1, vSpace as unknown as number, vSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace2 = new RealVectorSpace(dimension);
            expect(() =>  new Vector3DReal(vSpace as unknown as number, -2, 1, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(0, vSpace as unknown as number, -2, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector3DReal(0, 1, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is followed by other parameters`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector3DReal(vSpace as unknown as number, 1, 2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DReal(1, 2, -4, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
        });

        it(`can get the coordinates of a vector as x, y, z parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DReal(1, 2, 4, vSpace);
            expect(realVector.x).to.eql(1);
            expect(realVector.y).to.eql(2);
            expect(realVector.z).to.eql(4);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DReal(1, 3, 5, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor.type).to.eql(REALVECTOR3D);
        });
    });

    describe('Methods', () => {

        it(`can get the vector data structure as a string`, () => {
            const coordinates = [1, 3, 5];
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR3D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]})` + ` ` + realVector1.vectorSpace.toString());
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3, 5];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2]);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DReal(coordinates1[0], coordinates1[1], coordinates1[2], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, coordinates1[2] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 0];
            const realVector2 = new Vector3DReal(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, coordinates1[2], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, coordinates1[2] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DReal(coordinates1[0], coordinates1[1] + angularTolerance * 8, coordinates1[2] + angularTolerance * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });

        it(`can map a real 3D vector into a 4D projective real vector of a default projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveRealVector = realVector1.toProjectiveRealVector();
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`can map a real 3D vector into a 4D projective real vector of a default projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveRealVectorSpace(4, WeightManagement.AllPositiveWeights, true);
            const projectiveRealVector = realVector1.toProjectiveRealVector(projectiveVSpace);
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(false);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`can map a real 3D vector into a 4D projective real vector of a default projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveRealVectorSpace(4, WeightManagement.SomeNullWeights, true);
            const projectiveRealVector = realVector1.toProjectiveRealVector(projectiveVSpace);
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`can map a real 3D vector into a 4D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveRealVectorSpace(4);
            const projectiveRealVector = realVector1.toProjectiveRealVector(projectiveVSpace);
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveRealVectorSpace(4, WeightManagement.AllPositiveWeights);
            const projectiveRealVector = realVector1.toProjectiveRealVector(projectiveVSpace);
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(false);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`can map a real 3D vector into a 4D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveRealVectorSpace(4, WeightManagement.SomeNullWeights);
            const projectiveRealVector = realVector1.toProjectiveRealVector(projectiveVSpace);
            expect(projectiveRealVector.dimension).to.eql(dimension + 1);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR3D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(1);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(2);
            expect(projectiveRealVector.getCoordinate(2)).to.eql(3);
        });

        it(`cannot map a real 3D vector into a complex vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toComplexVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });

        it(`cannot map a real 3D vector into a projective complex vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DReal(1, 2, 3, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toProjectiveComplexVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });

    });
});