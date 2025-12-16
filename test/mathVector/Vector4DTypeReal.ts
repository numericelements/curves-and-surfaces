import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Vector4DTypeReal } from "../../src/mathVector/Vector4DTypeReal";
import { REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";

describe('Vector 4D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 4D vector space`, () => {
            const realVector = new Vector4DTypeReal();
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
            const realVector = new Vector4DTypeReal(-1, 2, 3, -4);
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
            const realVector = new Vector4DTypeReal(vSpace);
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
            const realVector = new Vector4DTypeReal(1, -2, 3, -6, vSpace);
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
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal(1, 2, -3, 5, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
        });

        it(`can get the coordinates of a vector as x, y, z, t parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal(1, 2, -3, 5, vSpace);
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
            const realVector = new Vector4DTypeReal(1, 3, -1, 5, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor.type).to.eql(REALVECTOR4D);
        });
    });

    describe('Methods', () => {

        it(`can get the vector data structure as a string`, () => {
            const coordinates = [1, 3, 5, 7];
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace1);
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
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal(coordinates1[0], coordinates1[1], coordinates1[2], coordinates1[3], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR,
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DTypeReal(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, 
                        coordinates1[2], coordinates1[3] + ANGULAR_TOL_VECTOR * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, 
                        coordinates1[2] + LINEAR_TOL_VECTOR, coordinates1[3] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DTypeReal(coordinates1[0], coordinates1[1] + angularTolerance * 4, 
                        coordinates1[2], coordinates1[3] + angularTolerance * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });

        it(`cannot map a real 4D vector into a projective real vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal(1, 2, 3, 4, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR4D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toProjectiveVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});