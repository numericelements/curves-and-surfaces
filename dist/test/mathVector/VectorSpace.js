"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var VectorSpace_1 = require("../../src/mathVector/VectorSpace");
describe('IncreasingOpenKnotSequenceClosedCurve', function () {
    it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor', function () {
        var vec1 = 0;
        var res = VectorSpace_1.isVector1D(vec1);
        chai_1.expect(res).to.eql(true);
        // const vec2: Vector2D = [0, 0];
        // const res2 = isVector1D(vec2)
        // expect(res2).to.eql(true)
        // const vecComplex: Complex = [0, 0];
        // const resC = isVector1D(vecComplex)
        // expect(resC).to.eql(true)
        // const vec3: Vector3D = [0, 0, 0];
        // const res3 = isVector1D(vec3)
        // expect(res3).to.eql(false)
    });
});
