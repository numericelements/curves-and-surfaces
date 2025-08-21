import { expect } from "chai";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { REALVECTOR2D } from "../../src/mathVector/VectorSpaceConstructorInterface";

describe('Vector 2D in real vector space: generation and operators in this vector space', () => {
    const dimension = 2;

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
        });

        it(`can generate an arbitrary real vector into a 2D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
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

    });

    describe('Accessors', () => {
        it(`can get the coordinates of a vector as x, y parameters`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(1, 2, vSpace);
            expect(realVector.x).to.eql(1);
            expect(realVector.y).to.eql(2);
            // expect(realVector.z).to.eql(undefined);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`cannot acces coordinates z, w, of a vector `, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector2DTypeReal(1, 2, vSpace);
            // expect(realVector.z).to.eql(undefined);
            // expect(realVector.w).to.eql(undefined);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });
    });
});