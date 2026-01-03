"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const Vector2DTypeReal_1 = require("../../src/mathVector/Vector2DTypeReal");
describe('Real Vectors into a default vector space', () => {
    describe('Constructor', () => {
        const SPACE_DIM = 2;
        it('can generate a default vector into a RealVectorSpace 2D', () => {
            const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal();
            (0, chai_1.expect)(realVector2D1.dimension).to.eql(SPACE_DIM);
            (0, chai_1.expect)(realVector2D1.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVector2D1.vectorSpace.dimension()).to.eql(SPACE_DIM);
        });
        it(`check that two distinct ${Vector2DTypeReal_1.Vector2DTypeReal} vectors into a RealVectorSpace 2D belong to the same default vector space`, () => {
            const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal();
            const realVector2D2 = new Vector2DTypeReal_1.Vector2DTypeReal(1, 1);
            (0, chai_1.expect)(realVector2D1.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVector2D2.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVector2D1.vectorSpace.id).to.eql(realVector2D2.vectorSpace.id);
            (0, chai_1.expect)(realVector2D1.vectorSpace).to.eql(realVector2D2.vectorSpace);
        });
        it(`check that a ${Vector2DTypeReal_1.Vector2DTypeReal} vector into a default RealVectorSpace 2D is distinct from vectors created into any other vector space`, () => {
            const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal();
            const realVectorSpace = new RealVectorSpace_1.RealVectorSpace(SPACE_DIM);
            const defaultVector = realVectorSpace.defaultVect();
            // const vectorInVectorSpace = realVectorSpace.bindVector(defaultVector);
            // expect(realVector2D1.coordinates).to.eql(vectorInVectorSpace.vector.coordinates);
            // expect(realVector2D1.vectorSpace.id).to.not.eql(vectorInVectorSpace.space.id);
            // expect(realVector2D1.vectorSpace).to.not.eql(vectorInVectorSpace.space);
        });
        it(`can generate a ${Vector2DTypeReal_1.Vector2DTypeReal} vector into an existing RealVectorSpace 2D`, () => {
            const realVectorSpace = new RealVectorSpace_1.RealVectorSpace(SPACE_DIM);
            const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal(0, 0, realVectorSpace);
            (0, chai_1.expect)(realVector2D1.coordinates).to.eql([0, 0]);
            (0, chai_1.expect)(realVector2D1.vectorSpace.id).to.eql(realVectorSpace.id);
            (0, chai_1.expect)(realVector2D1.vectorSpace).to.eql(realVectorSpace);
        });
    });
});
