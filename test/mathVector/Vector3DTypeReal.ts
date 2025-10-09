import { expect } from "chai";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { REALVECTOR2D, REALVECTOR3D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { ANGULAR_TOL_VECTOR, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Vector3DTypeReal } from "../../src/mathVector/Vector3DTypeReal";
import { EM_REALVECTORS_DIFFERENT_DIM } from "../../src/ErrorMessages/RealVectorSpace";

describe('Vector 3D in real vector space: generation and operators in this vector space', () => {
    const dimension = 3;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 3D vector space`, () => {
            const realVector = new Vector3DTypeReal();
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
            const realVector = new Vector3DTypeReal(-1, 2, 1);
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
            const realVector = new Vector3DTypeReal(vSpace);
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
            const realVector = new Vector3DTypeReal(1, -2, 4, vSpace);
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
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DTypeReal(1, 2, -4, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR3D);
        });

        it(`can get the coordinates of a vector as x, y, z parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector3DTypeReal(1, 2, 4, vSpace);
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
            const realVector = new Vector3DTypeReal(1, 3, 5, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor.type).to.eql(REALVECTOR3D);
        });
    });

    describe('Methods', () => {

        it(`cannot add a vector with another vector of different dimension`, () => {
            const coordinates = [1, 3, 5];
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2]);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(true);
            const realVector2 = new Vector2DTypeReal(2, -1);
            expect(realVector2.dimension).to.not.eql(realVector1.dimension);
            expect(() => realVector1.add(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`cannot subtract a vector from another vector of different dimension`, () => {
            const coordinates = [1, 3, 5];
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2]);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(true);
            const realVector2 = new Vector2DTypeReal(2, -1);
            expect(realVector2.dimension).to.not.eql(realVector1.dimension);
            expect(() => realVector1.subtract(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`can get the vector data structure as a string`, () => {
            const coordinates = [1, 3, 5];
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR3D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]})`);
        });

        it(`cannot check the equality of vectors of different dimensions `, () => {
            const coordinates = [1, 3, 5];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(2);
            const realVector2 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace1);
            expect(() => realVector1.equals(realVector2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it(`cannot check the parallelism of vectors belonging to different vector spaces of different dimensions`, () => {
            const coordinates = [1, 3, 5];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(2);
            const realVector2 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace1);
            expect(() => realVector1.isParallel(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3, 5];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2]);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`cannot check the orthogonality of vectors belonging to vector spaces of different dimensions`, () => {
            const coordinates = [1, 3, 5];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(2);
            const realVector2 = new Vector2DTypeReal(coordinates[0], coordinates[1], vSpace1);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DTypeReal(coordinates1[0], coordinates1[1], coordinates1[2], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, coordinates1[2] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3, 2];
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 0];
            const realVector2 = new Vector3DTypeReal(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, coordinates1[2], vSpace);
            expect(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DTypeReal(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, coordinates1[2] + LINEAR_TOL_VECTOR, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 2];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR3D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-8, 2, 1];
            const realVector2 = new Vector3DTypeReal(coordinates1[0], coordinates1[1] + angularTolerance * 8, coordinates1[2] + angularTolerance * 4, vSpace);
            expect(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });
    });
});