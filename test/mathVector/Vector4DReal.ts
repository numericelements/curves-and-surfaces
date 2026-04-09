import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Vector4DReal } from "../../src/mathVector/Vector4DReal";
import { COMPLEXVECTOR2D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { Complex } from "../../src/mathVector/Complex";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";

describe('Vector 4D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 4D vector space`, () => {
            const realVector = new Vector4DReal();
            expect(realVector.coordinates).to.eql([0, 0, 0 ,0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.getCoordinate(2)).to.eql(0);
            expect(realVector.getCoordinate(3)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into the default 4D vector space`, () => {
            const realVector = new Vector4DReal(-1, 2, 3, -4);
            expect(realVector.coordinates).to.eql([-1, 2, 3, -4]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(-1);
            expect(realVector.getCoordinate(1)).to.eql(2);
            expect(realVector.getCoordinate(2)).to.eql(3);
            expect(realVector.getCoordinate(3)).to.eql(-4);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default real vector into a 4D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DReal(vSpace);
            expect(realVector.coordinates).to.eql([0, 0, 0, 0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.getCoordinate(1)).to.eql(0);
            expect(realVector.getCoordinate(2)).to.eql(0);
            expect(realVector.getCoordinate(3)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into a 4D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector4DReal(1, -2, 3, -6, vSpace);
            expect(realVector.coordinates).to.eql([1, -2, 3, -6]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(1);
            expect(realVector.getCoordinate(1)).to.eql(-2);
            expect(realVector.getCoordinate(2)).to.eql(3);
            expect(realVector.getCoordinate(3)).to.eql(-6);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is not of type real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector4DReal(vSpace as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector4DReal(vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a default vector space if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector4DReal(0, 1, 2, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(2, 0, vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(2, vSpace as unknown as number, 0, -1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(vSpace as unknown as number, 0, -1, 2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a user-specified vector space if the user-specified coordinates are not numbers and/or the vector space is not of type real and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveRealVectorSpace(dimension);
            expect(() =>  new Vector4DReal(0, -2, 1, -4, vSpace as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector4DReal(0, -2, 1, -4, vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(vSpace as unknown as number, -2, 1, 0, vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, vSpace as unknown as number, -2, 1, vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, 1, vSpace as unknown as number, 2, vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, 1, 2, vSpace as unknown as number, vSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace2 = new RealVectorSpace(dimension);
            expect(() =>  new Vector4DReal(vSpace as unknown as number, -2, 1, 0, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, vSpace as unknown as number, -2, 1, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, 1, vSpace as unknown as number, 2, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector4DReal(0, 1, 3, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is followed by other parameters`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector4DReal(vSpace as unknown as number, 1, 2, -3)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DReal(1, 2, -3, 5, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
        });

        it(`can get the coordinates of a vector as x, y, z, t parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DReal(1, 2, -3, 5, vSpace);
            expect(realVector.x).to.eql(1);
            expect(realVector.y).to.eql(2);
            expect(realVector.z).to.eql(-3);
            expect(realVector.t).to.eql(5);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DReal(1, 3, -1, 5, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor.type).to.eql(REALVECTOR4D);
        });
    });

    describe('Methods', () => {

        it(`can get the vector data structure as a string`, () => {
            const coordinates = [1, 3, 5, 7];
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR4D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]}, ${coordinates[3]})` + ` ` + realVector1.vectorSpace.toString());
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3, 5, 7];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DReal(coordinates1[0], coordinates1[1], coordinates1[2], coordinates1[3], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR,
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DReal(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, 
                        coordinates1[2], coordinates1[3] + ANGULAR_TOL_VECTOR * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, 
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DReal(coordinates1[0], coordinates1[1] + angularTolerance * 4, 
                        coordinates1[2], coordinates1[3] + angularTolerance * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });

        it(`cannot map a real 4D vector into a projective real vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(1, 2, 3, 4, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toProjectiveRealVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });

        it(`cannot map a real 4D vector into a projective complex vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(1, 2, 3, 5, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toProjectiveComplexVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });

        it(`can map a real 4D vector into a 2D complex vector of a default complex vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(1, 2, 3, 5, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector = realVector1.toComplexVector();
            expect(complexVector.dimension).to.eql(2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            expect(complexVector.coordinates[0]).to.eql(new Complex(1, 2));
            expect(complexVector.coordinates[1]).to.eql(new Complex(3, 5));
        });

        it(`can map a real 4D vector into a 2D complex vector of a custom complex vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DReal(1, 2, 3, 5, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const complexVS = new ComplexVectorSpace(2);
            const complexVector = realVector1.toComplexVector(complexVS);
            expect(complexVector.dimension).to.eql(2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.coordinates[0]).to.eql(new Complex(1, 2));
            expect(complexVector.coordinates[1]).to.eql(new Complex(3, 5));
        });

    });
});