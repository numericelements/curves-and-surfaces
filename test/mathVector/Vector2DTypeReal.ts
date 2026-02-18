import { expect } from "chai";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { COMPLEXVECTOR1D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, REALVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Complex } from "../../src/mathVector/Complex";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";

describe('Vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 2;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 2D vector space`, () => {
            const realVector = new Vector2DTypeReal();
            expect(realVector.coordinates).to.eql([0, 0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into the default 2D vector space`, () => {
            const realVector = new Vector2DTypeReal(-1, 2);
            expect(realVector.coordinates).to.eql([-1, 2]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(-1);
            expect(realVector.getCoordinate(1)).to.eql(2);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default real vector into a 2D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(vSpace);
            expect(realVector.coordinates).to.eql([0, 0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into a 2D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector2DTypeReal(1, -2, vSpace);
            expect(realVector.coordinates).to.eql([1, -2]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(1);
            expect(realVector.getCoordinate(1)).to.eql(-2);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is not of type real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeReal(vSpace as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new Vector2DTypeReal(vSpace1 as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a default vector space if the user-specified coordinates are not numbers`, () => {
           // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeReal(0, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeReal(vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a user-specified vector space if the user-specified coordinates are not numbers and/or the vector space is not of type real and of same dimension as the vector`, () => {
           // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeReal(0, -2, vSpace as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new Vector2DTypeReal(0, -2, vSpace1 as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeReal(vSpace as unknown as number, -2, vSpace1 as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace2 = new RealVectorSpace(dimension);
            expect(() =>  new Vector2DTypeReal(vSpace as unknown as number, -2, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeReal(0, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is followed by other parameters`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector2DTypeReal(vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
        });

        it(`can get the coordinates of a vector as x, y parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector.x).to.eql(1);
            expect(realVector.y).to.eql(2);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(1, 3, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor.type).to.eql(REALVECTOR2D);
        });
    });

    describe('Methods', () => {

        it(`can get the vector descriptor as a string`, () => {
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(3, -2, vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR2D + `(${realVector1.x.toString()}, ${realVector1.y.toString()})` + ` ` + realVector1.vectorSpace.toString());
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector2DTypeReal(coordinates[0], coordinates[1]);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const realVector2 = new Vector2DTypeReal(coordinates1[0], coordinates1[1], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const realVector2 = new Vector2DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const realVector2 = new Vector2DTypeReal(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const realVector2 = new Vector2DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const realVector2 = new Vector2DTypeReal(coordinates1[0], coordinates1[1] + angularTolerance * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a default projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVector = realVector1.toProjectiveVector();
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a default projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveVectorSpace(3, WeightManagement.AllPositiveWeights, true);
            const projectiveVector = realVector1.toProjectiveVector(projectiveVSpace);
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(false);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a default projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveVectorSpace(3, WeightManagement.SomeNullWeights, true);
            const projectiveVector = realVector1.toProjectiveVector(projectiveVSpace);
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveVectorSpace(3);
            const projectiveVector = realVector1.toProjectiveVector(projectiveVSpace);
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveVectorSpace(3, WeightManagement.AllPositiveWeights);
            const projectiveVector = realVector1.toProjectiveVector(projectiveVSpace);
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(false);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 3D projective real vector of a user-defined projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveVSpace = new ProjectiveVectorSpace(3, WeightManagement.SomeNullWeights);
            const projectiveVector = realVector1.toProjectiveVector(projectiveVSpace);
            expect(projectiveVector.dimension).to.eql(dimension + 1);
            expect(projectiveVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
            expect(projectiveVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveVector.weight.strictlyPositive).to.eql(true);
            expect(projectiveVector.getCoordinate(0)).to.eql(1);
            expect(projectiveVector.getCoordinate(1)).to.eql(2);
        });

        it(`can map a real 2D vector into a 1D complex vector of a default complex vector space`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector = realVector1.toComplexVector();
            expect(complexVector.dimension).to.eql(dimension - 1);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
        });

        it(`can map a real 2D vector into a 1D complex vector of a user-defined complex vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const complexVSpace = new ComplexVectorSpace(1);
            const complexVector = realVector1.toComplexVector(complexVSpace);
            expect(complexVector.dimension).to.eql(dimension - 1);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a default projective complex vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector();
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a default projective complex vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights, true);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector(projectiveComplexVSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a default projective complex vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            DefaultVectorSpaces.reset();
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights, true);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector(projectiveComplexVSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a user-defined projective complex vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVSpace = new ProjectiveComplexVectorSpace(2);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector(projectiveComplexVSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a user-defined projective complex vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector(projectiveComplexVSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });

        it(`can map a real 2D vector into a 2D projective complex vector of a user-defined projective complex vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR2D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights);
            const projectiveComplexVector = realVector1.toProjectiveComplexVector(projectiveComplexVSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(1, 2));
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
        });
    });
});