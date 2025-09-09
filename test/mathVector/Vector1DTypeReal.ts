import { expect } from "chai";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { REALVECTOR1D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Vector1DTypeReal } from "../../src/mathVector/Vector1DTypeReal";
import { EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTORS_DIFFERENT_DIM } from "../../src/namedConstants/Vectors";
import { Vector3DTypeReal } from "../../src/mathVector/Vector3DTypeReal";
import { EM_REALVECTORS_DIFFERENT_DIM } from "../../src/ErrorMessages/RealVectorSpace";

describe('Vector 1D in real vector space: generation and operators in this vector space', () => {
    const dimension = 1;

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal();
            expect(realVector.coordinates).to.eql([0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal(-1);
            expect(realVector.coordinates).to.eql([-1]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(-1);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate a default real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(vSpace);
            expect(realVector.coordinates).to.eql([0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(1, vSpace);
            expect(realVector.coordinates).to.eql([1]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(1);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });

    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(2, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
        });

        it(`can get the coordinate of a vector as x parameter`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(2, vSpace);
            expect(realVector.x).to.eql(2);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the datastructure of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(3, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.raw).to.eql(realVector.x);
        });
    });

    describe('Methods', () => {

        it(`cannot add a vector with another vector of different dimension`, () => {
            const realVector = new Vector1DTypeReal(2);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            const coordinates = [1, 3];
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1]);
            expect(realVector1.dimension).to.not.eql(realVector.dimension);
            expect(() => realVector.add(realVector1)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`cannot subtract a vector from another vector of different dimension`, () => {
            const realVector = new Vector1DTypeReal(2);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            const coordinates = [1, 3];
            const realVector1 = new Vector2DTypeReal(coordinates[0], coordinates[1]);
            expect(realVector.dimension).to.not.eql(realVector1.dimension);
            expect(() => realVector.subtract(realVector1)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`can get the vector data structure as a string`, () => {
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(3, vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR1D + `(${realVector1.x.toString()})`);
        });

        it(`cannot check the equality of vectors of different dimensions `, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(1, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(3);
            const coordinates = [1, 3, 0];
            const realVector2 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(() => realVector1.equals(realVector2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it(`cannot check the parallelism of vectors belonging to different vector spaces of different dimensions`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(0, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(3);
            const coordinates = [1, 3, 0];
            const realVector2 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(() => realVector1.isParallel(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces of different dimensions`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(0, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = new RealVectorSpace(3);
            const coordinates = [1, 3, 0];
            const realVector2 = new Vector3DTypeReal(coordinates[0], coordinates[1], coordinates[2], vSpace1);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`check orthogonality property of vectors of dimension one is not available`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(1, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector1DTypeReal(0, vSpace);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_ISORTHOGONAL_NOT_APPLICABLE);
        });
    });
});