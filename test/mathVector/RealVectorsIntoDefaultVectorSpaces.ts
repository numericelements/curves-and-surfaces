import { expect } from "chai";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { Vector2DReal } from "../../src/mathVector/Vector2DReal";
import { createVector2DRealFromDescriptor } from "../../src/mathVector/VectorFromDescriptorFactory";
import { EM_VECTORS_DIFFERENT_VECTOR_SPACES } from "../../src/namedConstants/Vectors";

describe('Real Vectors into a default vector space', () => {

    describe('Constructor', () => {
        const SPACE_DIM = 2;
        it('can generate a default vector into a RealVectorSpace 2D', () => {
            const realVector2D1 = new Vector2DReal();
            expect(realVector2D1.dimension).to.eql(SPACE_DIM);
            expect(realVector2D1.vectorSpace.isDefault).to.eql(true);
            expect(realVector2D1.vectorSpace.dimension()).to.eql(SPACE_DIM);
        });

        it(`check that two distinct ${Vector2DReal} vectors into a RealVectorSpace 2D belong to the same default vector space`, () => {
            const realVector2D1 = new Vector2DReal();
            const realVector2D2 = new Vector2DReal(1, 1);
            expect(realVector2D1.vectorSpace.isDefault).to.eql(true);
            expect(realVector2D2.vectorSpace.isDefault).to.eql(true);
            expect(realVector2D1.vectorSpace.id).to.eql(realVector2D2.vectorSpace.id);
            expect(realVector2D1.vectorSpace).to.eql(realVector2D2.vectorSpace);
        });

        it(`check that a ${Vector2DReal} vector into a default RealVectorSpace 2D is distinct from vectors created into any other vector space`, () => {
            const realVector2D1 = new Vector2DReal();
            expect(realVector2D1.vectorSpace.isDefault).to.eql(true);
            const realVectorSpace = new RealVectorSpace(SPACE_DIM)
            expect(realVectorSpace.isDefault).to.eql(false);
            const defaultVector = realVectorSpace.defaultVect();
            const vectorInVectorSpace = createVector2DRealFromDescriptor(defaultVector, realVectorSpace);
            expect(() => realVector2D1.equals(vectorInVectorSpace)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });
        
        it(`can generate a ${Vector2DReal} vector into an existing RealVectorSpace 2D`, () => {
            const realVectorSpace = new RealVectorSpace(SPACE_DIM)
            const realVector2D1 = new Vector2DReal(0, 0, realVectorSpace);
            expect(realVector2D1.coordinates).to.eql([0, 0]);
            expect(realVector2D1.vectorSpace.id).to.eql(realVectorSpace.id);
            expect(realVector2D1.vectorSpace).to.eql(realVectorSpace);
        });
    });
});