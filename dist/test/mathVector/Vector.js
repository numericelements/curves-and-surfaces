"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const Vector2DTypeReal_1 = require("../../src/mathVector/Vector2DTypeReal");
describe('Vector', () => {
    it('generate a default vector of a RealVectorSpace 2D', () => {
        const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal();
        (0, chai_1.expect)(realVector2D1.dimension).to.eql(2);
        // const vectorSpace2D1 = realVector2D1.getDefaultVectorSpace();
        const realVector2D2 = new Vector2DTypeReal_1.Vector2DTypeReal();
        (0, chai_1.expect)(realVector2D2.dimension).to.eql(2);
        // const vectorSpace2D2 = realVector2D1.getDefaultVectorSpace();
        // expect(vectorSpace2D1).to.eql(vectorSpace2D2);
    });
    it('generate a default vector of a RealVectorSpace 2D', () => {
        const realVector2D1 = new Vector2DTypeReal_1.Vector2DTypeReal(1, 1);
        (0, chai_1.expect)(realVector2D1.dimension).to.eql(2);
        // const vectorSpace2D1 = realVector2D1.getDefaultVectorSpace();
        const realVector2D2 = new Vector2DTypeReal_1.Vector2DTypeReal();
        (0, chai_1.expect)(realVector2D2.dimension).to.eql(2);
        // const vectorSpace2D2 = realVector2D1.getDefaultVectorSpace();
        // expect(vectorSpace2D1).to.eql(vectorSpace2D2);
        const realVec = realVector2D1.add(realVector2D2);
        (0, chai_1.expect)(realVec).to.eql(realVector2D1);
        const realVectorSpace = new RealVectorSpace_1.RealVectorSpace(2);
        (0, chai_1.expect)(realVectorSpace).to.not.eql(realVector2D1.vectorSpace);
        const realVec2 = realVectorSpace.defaultVect();
        const realVec3 = realVectorSpace.createVector([1, 1]);
        (0, chai_1.expect)(realVec2.coordinates).to.eql(realVector2D2.coordinates);
        const realVec4 = realVectorSpace.createVector([1, 2]);
        const realVec5 = realVectorSpace.addDescriptors(realVec3, realVec4);
        (0, chai_1.expect)(realVec5.coordinates).to.eql([2, 3]);
    });
});
