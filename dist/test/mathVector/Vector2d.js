"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Vector2d_1 = require("../../src/mathVector/Vector2d");
describe('Vector2d', function () {
    it('can be initialized without an initializer', function () {
        var v = new Vector2d_1.Vector2d();
        chai_1.expect(v.x).to.equal(0);
        chai_1.expect(v.y).to.eql(0);
    });
    it('can be initialized with an initializer', function () {
        var v = new Vector2d_1.Vector2d(1, 2);
        chai_1.expect(v.x).to.equal(1);
        chai_1.expect(v.y).to.eql(2);
    });
});
