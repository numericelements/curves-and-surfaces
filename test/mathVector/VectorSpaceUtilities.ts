import { expect } from "chai";
import { RealVector1D, Vector1D, Vector2D, Vector3D, Vector4D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { areSameVSpaceAndDimension, isComplexVector, isProjectiveComplexVector, isProjectiveVector, isRealVector, isVector1D, isVector2D, isVector3D, isVector4D, sendRangeErrorMessage } from "../../src/mathVector/VectorSpaceUtilities";
import { Weight } from "../../src/mathVector/Weight";
import { ErrorLog } from "../../src/errorProcessing/ErrorLoging";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../src/namedConstants/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../src/namedConstants/ProjectiveVectorSpace";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { COMPLEXWEIGHT, WEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('isVector1D', () => {

    it('checks that a Vector1d is effectively of type Real or RealVector1D or ' + COMPLEX, () => {
        const vec1: Vector1D = 0;
        const res = isVector1D(vec1)
        expect(res).to.eql(true)

        const vec3: RealVector1D = 0;
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(true)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res2 = isVector1D(vec2)
        expect(res2).to.eql(true)
    });

    it('checks that a Vector describing a Vector2D is not of type Vector1D', () => {
        const vec1: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isVector1D(vec2)
        expect(res2).to.eql(false)

        const vec3: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(false)
    });

    it('checks that a Vector describing a Vector3D is not of type Vector1D', () => {
        const vec1: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(false)
    });

    it('checks that a Vector describing a Vector4D is not of type Vector1D', () => {
        const vec1: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res1 = isVector1D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector1D(vec3)
        expect(res3).to.eql(false)
    });

});

describe('isVector2D', () => {

    it('checks that a Vector2D is effectively of type RealVector2D or ComplexVector2D or ProjectiveComplexVector1D', () => {
        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(true)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isVector2D(vec2)
        expect(res2).to.eql(true)

        const vec1: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isVector2D(vec1)
        expect(res1).to.eql(true)
    });

    it('checks that a Vector describing a Vector1D is not of type Vector2D', () => {
        const vec1: Vector1D = 0;
        const res = isVector2D(vec1)
        expect(res).to.eql(false)

        const vec3: RealVector1D = 0;
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res2 = isVector2D(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a Vector3D is not of type Vector2D', () => {
        const vec1: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isVector2D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)
    });

    it('checks that a Vector describing a Vector4D is not of type Vector2D', () => {
        const vec1: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res1 = isVector2D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector2D(vec3)
        expect(res3).to.eql(false)
    });
});

describe('isVector3D', () => {

    it('checks that a Vector3D is effectively of type RealVector3D or ProjectiveVector2D', () => {
        const vec3: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res3 = isVector3D(vec3)
        expect(res3).to.eql(true)

        const vec1: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isVector3D(vec1)
        expect(res1).to.eql(true)
    });

    it('checks that a Vector describing a Vector1D is not of type Vector3D', () => {
        const vec1: Vector1D = 0;
        const res = isVector3D(vec1)
        expect(res).to.eql(false)

        const vec3: RealVector1D = 0;
        const res3 = isVector3D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res2 = isVector3D(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a Vector2D is not of type Vector3D', () => {
        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isVector3D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isVector3D(vec2)
        expect(res2).to.eql(false)

        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isVector3D(vec4)
        expect(res1).to.eql(false)
    });

    it('checks that a Vector describing a Vector4D is not of type Vector3D', () => {
        const vec1: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res1 = isVector3D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector3D(vec3)
        expect(res3).to.eql(false)
    });
});

describe('isVector4D', () => {

    it('checks that a Vector4D is effectively of type RealVector4D or ProjectiveVector3D', () => {
        const vec3: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res3 = isVector4D(vec3)
        expect(res3).to.eql(true)

        const vec1: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isVector4D(vec1)
        expect(res1).to.eql(true)
    });

    it('checks that a Vector describing a Vector1D is not of type Vector4D', () => {
        const vec1: Vector1D = 0;
        const res = isVector4D(vec1)
        expect(res).to.eql(false)

        const vec3: RealVector1D = 0;
        const res3 = isVector4D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res2 = isVector4D(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a Vector2D is not of type Vector4D', () => {
        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isVector4D(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isVector4D(vec2)
        expect(res2).to.eql(false)

        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isVector4D(vec4)
        expect(res1).to.eql(false)
    });

    it('checks that a Vector describing a Vector3D is not of type Vector4D', () => {
        const vec1: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isVector4D(vec1)
        expect(res1).to.eql(false)

        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isVector4D(vec3)
        expect(res3).to.eql(false)
    });
});

describe('isRealVector', () => {

    it('checks that a RealVector is effectively of type Real or ' + REALVECTOR2D + ' or ' + REALVECTOR3D + ' or ' + REALVECTOR4D, () => {
        const vec1: Vector1D = 0;
        const res = isRealVector(vec1)
        expect(res).to.eql(true)

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isRealVector(vec3)
        expect(res3).to.eql(true)

        const vec2: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isRealVector(vec2)
        expect(res1).to.eql(true)

        const vec4: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res4 = isRealVector(vec4)
        expect(res4).to.eql(true)
    });

    it('checks that a Vector describing a ComplexVector is not of type RealVector', () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res1 = isRealVector(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isRealVector(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveVector is not of type RealVector', () => {
        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isRealVector(vec3)
        expect(res3).to.eql(false)

        const vec1: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isRealVector(vec1)
        expect(res1).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveComplexVector is not of type RealVector', () => {
        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isRealVector(vec4)
        expect(res1).to.eql(false)
    });
});

describe('isComplexVector', () => {

    it('checks that a ComplexVector is effectively of type ' + COMPLEX + ' or ' + COMPLEXVECTOR2D, () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res1 = isComplexVector(vec1)
        expect(res1).to.eql(true)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isComplexVector(vec2)
        expect(res2).to.eql(true)
    });

    it('checks that a Vector describing a RealVector is not of type ComplexVector', () => {
        const vec1: Vector1D = 0;
        const res = isComplexVector(vec1)
        expect(res).to.eql(false)

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isComplexVector(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isComplexVector(vec2)
        expect(res1).to.eql(false)

        const vec4: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res4 = isComplexVector(vec4)
        expect(res4).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveVector is not of type ComplexVector', () => {
        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isComplexVector(vec3)
        expect(res3).to.eql(false)

        const vec1: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isComplexVector(vec1)
        expect(res1).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveComplexVector is not of type ComplexVector', () => {
        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isComplexVector(vec4)
        expect(res1).to.eql(false)
    });
});


describe('isProjectiveVector', () => {

    it('checks that a ProjectiveVector is effectively of type ' + PROJECTIVEVECTOR2D + ' or ' + PROJECTIVEVECTOR3D, () => {
        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isProjectiveVector(vec3)
        expect(res3).to.eql(true)

        const vec1: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isProjectiveVector(vec1)
        expect(res1).to.eql(true)
    });

    it('checks that a Vector describing a RealVector is not of type ProjectiveVector', () => {
        const vec1: Vector1D = 0;
        const res = isProjectiveVector(vec1)
        expect(res).to.eql(false)

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isProjectiveVector(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isProjectiveVector(vec2)
        expect(res1).to.eql(false)

        const vec4: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res4 = isProjectiveVector(vec4)
        expect(res4).to.eql(false)
    });

    it('checks that a Vector describing a ComplexVector is not of type ProjectiveVector', () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res1 = isProjectiveVector(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isProjectiveVector(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveComplexVector is not of type isProjectiveVector', () => {
        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isProjectiveVector(vec4)
        expect(res1).to.eql(false)
    });
});


describe('isProjectiveComplexVector', () => {

    it('checks that a ProjectiveComplexVector is effectively of type ' + PROJECTIVECOMPLEXVECTOR1D, () => {
        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res1 = isProjectiveComplexVector(vec4)
        expect(res1).to.eql(true)
    });

    it('checks that a Vector describing a RealVector is not of type ProjectiveComplexVector', () => {
        const vec1: Vector1D = 0;
        const res = isProjectiveComplexVector(vec1)
        expect(res).to.eql(false)

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const res3 = isProjectiveComplexVector(vec3)
        expect(res3).to.eql(false)

        const vec2: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const res1 = isProjectiveComplexVector(vec2)
        expect(res1).to.eql(false)

        const vec4: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const res4 = isProjectiveComplexVector(vec4)
        expect(res4).to.eql(false)
    });

    it('checks that a Vector describing a ComplexVector is not of type ProjectiveComplexVector', () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const res1 = isProjectiveComplexVector(vec1)
        expect(res1).to.eql(false)

        const vec2: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const res2 = isProjectiveComplexVector(vec2)
        expect(res2).to.eql(false)
    });

    it('checks that a Vector describing a ProjectiveVector is not of type ProjectiveComplexVector', () => {
        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res3 = isProjectiveComplexVector(vec3)
        expect(res3).to.eql(false)

        const vec1: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = isProjectiveComplexVector(vec1)
        expect(res1).to.eql(false)
    });
});

describe('sendRangeErrorMessage', () => {

    it('checks that sendRangeErrorMessage produces a correctly formated error message', () => {
        const constructorName = "constructor_test";
        const functionName = "function_test";
        const message = "message_test";
        const error = new ErrorLog(constructorName, functionName, " " + message);
        expect(sendRangeErrorMessage(constructorName, functionName, message)).to.eql(error)
    });
});

describe('areSameVSpaceAndDimension', () => {

    it('case of RealVectors of same dimesions ' + MIN_DIMENSION_REALVECTORSPACE + ' through ' + MAX_DIMENSION_REALVECTORSPACE, () => {
        const vec1: Vector1D = 0;
        const vec2: Vector1D = 1;
        const res = areSameVSpaceAndDimension(vec1, vec2);
        expect(res).to.eql(true)

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const vec4: Vector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
        const res1 = areSameVSpaceAndDimension(vec3, vec4)
        expect(res1).to.eql(true)

        const vec5: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const vec6: Vector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
        const res2 = areSameVSpaceAndDimension(vec5, vec6)
        expect(res2).to.eql(true)

        const vec7: Vector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        const vec8: Vector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
        const res3 = areSameVSpaceAndDimension(vec7, vec8)
        expect(res3).to.eql(true)
    });

    it('case of RealVectors of different dimesions ranging from ' + MIN_DIMENSION_REALVECTORSPACE + ' through ' + MAX_DIMENSION_REALVECTORSPACE, () => {
        const vec1: Vector1D = 0;

        const vec3: Vector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
        const vec4: Vector2D = {type: REALVECTOR2D, coordinates: [0, 1]};

        const vec5: Vector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        const vec6: Vector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};

        const vec8: Vector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};

        const res1 = areSameVSpaceAndDimension(vec1, vec4)
        expect(res1).to.eql(false)
        const res2 = areSameVSpaceAndDimension(vec1, vec6)
        expect(res2).to.eql(false)
        const res3 = areSameVSpaceAndDimension(vec1, vec8)
        expect(res3).to.eql(false)
        const res4 = areSameVSpaceAndDimension(vec3, vec6)
        expect(res4).to.eql(false)
        const res5 = areSameVSpaceAndDimension(vec3, vec8)
        expect(res5).to.eql(false)
        const res6 = areSameVSpaceAndDimension(vec5, vec8)
        expect(res6).to.eql(false)
    });

    it('case of Vectors of different types ', () => {
        const vec1: Vector1D = 0;

        const vec2: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const vec3: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const vec4: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};

        const res1 = areSameVSpaceAndDimension(vec1, vec2)
        expect(res1).to.eql(false)
        const res2 = areSameVSpaceAndDimension(vec1, vec3)
        expect(res2).to.eql(false)
        const res3 = areSameVSpaceAndDimension(vec1, vec4)
        expect(res3).to.eql(false)
    });

    it('case of ComplexVectors of same dimesions ' + MIN_DIMENSION_COMPLEXVECTORSPACE + ' through ' + MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const vec2: Vector1D = {type: COMPLEX, real: 1, imaginary: 0};
        const res = areSameVSpaceAndDimension(vec1, vec2);
        expect(res).to.eql(true)

        const vec3: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};
        const vec4: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 1, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 1}]};
        const res1 = areSameVSpaceAndDimension(vec3, vec4)
        expect(res1).to.eql(true)
    });

    it('case of ComplexVectors of different dimesions ranging from ' + MIN_DIMENSION_COMPLEXVECTORSPACE + ' through ' + MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
        const vec1: Vector1D = {type: COMPLEX, real: 0, imaginary: 0};
        const vec3: Vector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEX, real: 0, imaginary: 0}]};

        const res1 = areSameVSpaceAndDimension(vec1, vec3)
        expect(res1).to.eql(false)
    });

    it('case of ProjectiveVectors of same dimesions ' + MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' through ' + MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
        const vec1: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const vec2: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res = areSameVSpaceAndDimension(vec1, vec2);
        expect(res).to.eql(true)

        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const vec4: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const res1 = areSameVSpaceAndDimension(vec3, vec4);
        expect(res1).to.eql(true)
    });

    it('case of ProjectiveVectors of different dimesions ranging from ' + MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' through ' + MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
        const vec1: Vector3D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(1)}]};
        const vec3: Vector4D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: new Weight(1)}]};

        const res1 = areSameVSpaceAndDimension(vec1, vec3)
        expect(res1).to.eql(false)
    });

    it('case of ProjectiveComplexVectors of same dimesions ' + MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + ' through ' + MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, () => {
        const vec1: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 0, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const vec2: Vector2D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 0}, {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)}]};
        const res = areSameVSpaceAndDimension(vec1, vec2);
        expect(res).to.eql(true)
    });
});