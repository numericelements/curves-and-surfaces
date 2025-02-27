import { expect } from "chai";
import { COMPLEX, COMPLEXVECTOR2D, COMPLEXVECTOR3D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, RealVector1D, RealVector2D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, Vector, Vector1D, Vector2D, Vector3D, Vector4D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D } from "../../src/mathVector/VectorSpaceUtilities";
import { Weight } from "../../src/mathVector/Weight";

describe('isVector1D', () => {

    it('checks that a Vector1D is effectively of type Real or RealVector1D or Complex', () => {
        const vec1: Vector1D = 0;
        const res = isVector1D(vec1)
        expect(res).to.eql(true)

        const vec3: RealVector1D = 0;
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(true)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginery: 0};
        const res2 = isVector1D(vec2)
        expect(res2).to.eql(true)
    });

    it('checks that a Vector describing a Vector2D is not of type Vector1D', () => {
        const vec1: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}]};
        const res2 = isVector1D(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a Vector3D is not of type Vector1D', () => {
        const vec1: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector3D = {type: COMPLEXVECTOR3D, coordinates: [{type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}]};
        const res2 = isVector1D(vec2)
        expect(res2).to.eql(false)

        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(1)}]};
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(false)
    });

    it('checks that a Vector describing a Vector4D is not of type Vector1D', () => {
        const vec1: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight(1)}]};
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(false)
    });
});

describe('isVector2D', () => {

    it('checks that a Vector2D is effectively of type RealVector2D or ComplexVector2D', () => {
        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(true)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}]};
        const res2 = isVector2D(vec2)
        expect(res2).to.eql(true)
    });

    it('checks that a Vector describing a Vector1D is not of type Vector2D', () => {
        const vec1: Vector1D = 0;
        const res = isVector2D(vec1)
        expect(res).to.eql(false)

        const vec3: RealVector1D = 0;
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginery: 0};
        const res2 = isVector2D(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a Vector3D is not of type Vector2D', () => {
        const vec1: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isVector2D(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector3D = {type: COMPLEXVECTOR3D, coordinates: [{type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}, {type: COMPLEX, real: 0, imaginery: 0}]};
        const res2 = isVector2D(vec2)
        expect(res2).to.eql(false)

        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(1)}]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)
    });

    it('checks that a Vector describing a Vector4D is not of type Vector2D', () => {
        const vec1: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res1 = isVector2D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight(1)}]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)
    });
});