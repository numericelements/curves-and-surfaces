"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Vector2d_1 = require("../../src/mathVector/Vector2d");
describe('Vector2d', () => {
    it('can be initialized without an initializer', () => {
        const v = new Vector2d_1.Vector2d();
        (0, chai_1.expect)(v.x).to.equal(0);
        (0, chai_1.expect)(v.y).to.eql(0);
    });
    it('can be initialized with an initializer', () => {
        const v = new Vector2d_1.Vector2d(1, 2);
        (0, chai_1.expect)(v.x).to.equal(1);
        (0, chai_1.expect)(v.y).to.eql(2);
    });
});
