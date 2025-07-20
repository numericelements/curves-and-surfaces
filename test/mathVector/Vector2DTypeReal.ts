import { expect } from "chai";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";

describe('Vector 2D in real vector space: generation and operators in vector space', () => {
    it(`can generate a default real vector space `, () => {
        const realVector = new Vector2DTypeReal();
        // expect(realVectorSpace.isDefault).to.eql(true);
        // expect(realVectorSpace.dimension()).to.eql(i);
        // expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
        // expect(realVectorSpace.name).to.eql(DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());

        // // uniqueness of the vector space identifier
        // const realVectorSpace1 = getDefaultRealVectorSpace(i);
        // expect(realVectorSpace.id).to.eql(realVectorSpace1.id);
        // expect(realVectorSpace).to.eql(realVectorSpace1);
    });
});