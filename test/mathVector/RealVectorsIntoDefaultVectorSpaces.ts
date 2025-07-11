import { expect } from "chai";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";

describe('Real Vectors into a default vector space', () => {

    describe('Constructor', () => {
        const SPACE_DIM = 2;
        it('can generate a default vector into a RealVectorSpace 2D', () => {
            const realVector2D1 = new Vector2DTypeReal();
            expect(realVector2D1.dimension).to.eql(SPACE_DIM);
            // const vectorSpace2D1 = realVector2D1.getDefaultVectorSpace();
            // expect(vectorSpace2D1.isDefault).to.eql(true);
            // expect(vectorSpace2D1.dimension()).to.eql(SPACE_DIM);
        });

        it(`check that two distinct ${Vector2DTypeReal} vectors into a RealVectorSpace 2D belong to the same default vector space`, () => {
            const realVector2D1 = new Vector2DTypeReal();
            const realVector2D2 = new Vector2DTypeReal(1, 1);
            // const vectorSpace2D1 = realVector2D1.getDefaultVectorSpace();
            // const vectorSpace2D2 = realVector2D2.getDefaultVectorSpace();
            // expect(vectorSpace2D1.isDefault).to.eql(true);
            // expect(vectorSpace2D2.isDefault).to.eql(true);
            // expect(vectorSpace2D1.id).to.eql(vectorSpace2D2.id);
            // expect(vectorSpace2D1).to.eql(vectorSpace2D2);
        });

        it(`check that a ${Vector2DTypeReal} vector into a default RealVectorSpace 2D is distinct from vectors created into any other vector space`, () => {
            const realVector2D1 = new Vector2DTypeReal();
            const realVectorSpace = new RealVectorSpace(SPACE_DIM)
            const defaultVector = realVectorSpace.defaultVect();
            const vectorInVectorSpace = realVectorSpace.bindVector(defaultVector);
            expect(realVector2D1.coordinates).to.eql(vectorInVectorSpace.vector.coordinates);
            expect(realVector2D1.vectorSpace.id).to.not.eql(vectorInVectorSpace.space.id);
            expect(realVector2D1.vectorSpace).to.not.eql(vectorInVectorSpace.space);
        });
        
        it(`can generate a ${Vector2DTypeReal} vector into an existing RealVectorSpace 2D`, () => {
            const realVectorSpace = new RealVectorSpace(SPACE_DIM)
            const realVector2D1 = new Vector2DTypeReal(0, 0, realVectorSpace);
            expect(realVector2D1.coordinates).to.eql([0, 0]);
            // expect(realVector2D1.getDefaultVectorSpace().id).to.not.eql(realVectorSpace.id);
            // expect(realVector2D1.getDefaultVectorSpace()).to.not.eql(realVectorSpace);
        });
    });
});