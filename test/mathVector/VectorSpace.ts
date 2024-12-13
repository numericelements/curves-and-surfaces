import { expect } from "chai";
import { Complex, isVector1D, Vector1D, Vector2D, Vector3D } from "../../src/mathVector/VectorSpace";

describe('IncreasingOpenKnotSequenceClosedCurve', () => {

    it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor', () => {
        const vec1: Vector1D = 0;
        const res = isVector1D(vec1)
        expect(res).to.eql(true)
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