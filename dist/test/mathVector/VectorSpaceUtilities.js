"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VectorSpaceUtilities_1 = require("../../src/mathVector/VectorSpaceUtilities");
const Weight_1 = require("../../src/mathVector/Weight");
const ErrorLoging_1 = require("../../src/errorProcessing/ErrorLoging");
const RealVectorSpace_1 = require("../../src/namedConstants/RealVectorSpace");
const ComplexVectorSpace_1 = require("../../src/namedConstants/ComplexVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../src/namedConstants/ProjectiveComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('isVector1D', () => {
    it('checks that a Vector1d is effectively of type Real or RealVector1D or ' + ComplexTypeTag_1.COMPLEX, () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
        (0, chai_1.expect)(res).to.eql(true);
        const vec3 = 0;
        const res3 = (0, VectorSpaceUtilities_1.isVector1D)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res2 = (0, VectorSpaceUtilities_1.isVector1D)(vec2);
        (0, chai_1.expect)(res2).to.eql(true);
    });
    it('checks that a Vector describing a Vector2D is not of type Vector1D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isVector1D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector1D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
    it('checks that a Vector describing a Vector3D is not of type Vector1D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector1D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
    it('checks that a Vector describing a Vector4D is not of type Vector1D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector1D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
});
describe('isVector2D', () => {
    it('checks that a Vector2D is effectively of type RealVector2D or ComplexVector2D or ProjectiveComplexVector1D', () => {
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isVector2D)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isVector2D)(vec2);
        (0, chai_1.expect)(res2).to.eql(true);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isVector2D)(vec1);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('checks that a Vector describing a Vector1D is not of type Vector2D', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isVector2D)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = 0;
        const res3 = (0, VectorSpaceUtilities_1.isVector2D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res2 = (0, VectorSpaceUtilities_1.isVector2D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a Vector3D is not of type Vector2D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector2D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector2D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
    it('checks that a Vector describing a Vector4D is not of type Vector2D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector2D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector2D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
});
describe('isVector3D', () => {
    it('checks that a Vector3D is effectively of type RealVector3D or ProjectiveVector2D', () => {
        const vec3 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isVector3D)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isVector3D)(vec1);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('checks that a Vector describing a Vector1D is not of type Vector3D', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isVector3D)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = 0;
        const res3 = (0, VectorSpaceUtilities_1.isVector3D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res2 = (0, VectorSpaceUtilities_1.isVector3D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a Vector2D is not of type Vector3D', () => {
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isVector3D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isVector3D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isVector3D)(vec4);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('checks that a Vector describing a Vector4D is not of type Vector3D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector3D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector3D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
});
describe('isVector4D', () => {
    it('checks that a Vector4D is effectively of type RealVector4D or ProjectiveVector3D', () => {
        const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isVector4D)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('checks that a Vector describing a Vector1D is not of type Vector4D', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = 0;
        const res3 = (0, VectorSpaceUtilities_1.isVector4D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res2 = (0, VectorSpaceUtilities_1.isVector4D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a Vector2D is not of type Vector4D', () => {
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isVector4D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isVector4D)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isVector4D)(vec4);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('checks that a Vector describing a Vector3D is not of type Vector4D', () => {
        const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isVector4D)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
    });
});
describe('isRealVector', () => {
    it('checks that a RealVector is effectively of type Real or ' + VectorTypeTags_1.REALVECTOR2D + ' or ' + VectorTypeTags_1.REALVECTOR3D + ' or ' + VectorTypeTags_1.REALVECTOR4D, () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isRealVector)(vec1);
        (0, chai_1.expect)(res).to.eql(true);
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isRealVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isRealVector)(vec2);
        (0, chai_1.expect)(res1).to.eql(true);
        const vec4 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res4 = (0, VectorSpaceUtilities_1.isRealVector)(vec4);
        (0, chai_1.expect)(res4).to.eql(true);
    });
    it('checks that a Vector describing a ComplexVector is not of type RealVector', () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res1 = (0, VectorSpaceUtilities_1.isRealVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isRealVector)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveVector is not of type RealVector', () => {
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isRealVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isRealVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveComplexVector is not of type RealVector', () => {
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isRealVector)(vec4);
        (0, chai_1.expect)(res1).to.eql(false);
    });
});
describe('isComplexVector', () => {
    it('checks that a ComplexVector is effectively of type ' + ComplexTypeTag_1.COMPLEX + ' or ' + VectorTypeTags_1.COMPLEXVECTOR2D, () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res1 = (0, VectorSpaceUtilities_1.isComplexVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(true);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isComplexVector)(vec2);
        (0, chai_1.expect)(res2).to.eql(true);
    });
    it('checks that a Vector describing a RealVector is not of type ComplexVector', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isComplexVector)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isComplexVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isComplexVector)(vec2);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec4 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res4 = (0, VectorSpaceUtilities_1.isComplexVector)(vec4);
        (0, chai_1.expect)(res4).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveVector is not of type ComplexVector', () => {
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isComplexVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isComplexVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveComplexVector is not of type ComplexVector', () => {
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isComplexVector)(vec4);
        (0, chai_1.expect)(res1).to.eql(false);
    });
});
describe('isProjectiveVector', () => {
    it('checks that a ProjectiveVector is effectively of type ' + VectorTypeTags_1.PROJECTIVEVECTOR2D + ' or ' + VectorTypeTags_1.PROJECTIVEVECTOR3D, () => {
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(true);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('checks that a Vector describing a RealVector is not of type ProjectiveVector', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec2);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec4 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res4 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec4);
        (0, chai_1.expect)(res4).to.eql(false);
    });
    it('checks that a Vector describing a ComplexVector is not of type ProjectiveVector', () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveComplexVector is not of type isProjectiveVector', () => {
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveVector)(vec4);
        (0, chai_1.expect)(res1).to.eql(false);
    });
});
describe('isProjectiveComplexVector', () => {
    it('checks that a ProjectiveComplexVector is effectively of type ' + VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, () => {
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec4);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('checks that a Vector describing a RealVector is not of type ProjectiveComplexVector', () => {
        const vec1 = 0;
        const res = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec1);
        (0, chai_1.expect)(res).to.eql(false);
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec2);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec4 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const res4 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec4);
        (0, chai_1.expect)(res4).to.eql(false);
    });
    it('checks that a Vector describing a ComplexVector is not of type ProjectiveComplexVector', () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
        const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res2 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec2);
        (0, chai_1.expect)(res2).to.eql(false);
    });
    it('checks that a Vector describing a ProjectiveVector is not of type ProjectiveComplexVector', () => {
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res3 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec3);
        (0, chai_1.expect)(res3).to.eql(false);
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.isProjectiveComplexVector)(vec1);
        (0, chai_1.expect)(res1).to.eql(false);
    });
});
describe('sendRangeErrorMessage', () => {
    it('checks that sendRangeErrorMessage produces a correctly formated error message', () => {
        const constructorName = "constructor_test";
        const functionName = "function_test";
        const message = "message_test";
        const error = new ErrorLoging_1.ErrorLog(constructorName, functionName, " " + message);
        (0, chai_1.expect)((0, VectorSpaceUtilities_1.sendRangeErrorMessage)(constructorName, functionName, message)).to.eql(error);
    });
});
describe('areSameVSpaceAndDimension', () => {
    it('case of RealVectors of same dimesions ' + RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + ' through ' + RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, () => {
        const vec1 = 0;
        const vec2 = 1;
        const res = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec2);
        (0, chai_1.expect)(res).to.eql(true);
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const vec4 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 1] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec3, vec4);
        (0, chai_1.expect)(res1).to.eql(true);
        const vec5 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const vec6 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
        const res2 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec5, vec6);
        (0, chai_1.expect)(res2).to.eql(true);
        const vec7 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        const vec8 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 0] };
        const res3 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec7, vec8);
        (0, chai_1.expect)(res3).to.eql(true);
    });
    it('case of RealVectors of different dimesions ranging from ' + RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + ' through ' + RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, () => {
        const vec1 = 0;
        const vec3 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        const vec4 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 1] };
        const vec5 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
        const vec6 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
        const vec8 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 0] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec4);
        (0, chai_1.expect)(res1).to.eql(false);
        const res2 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec6);
        (0, chai_1.expect)(res2).to.eql(false);
        const res3 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec8);
        (0, chai_1.expect)(res3).to.eql(false);
        const res4 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec3, vec6);
        (0, chai_1.expect)(res4).to.eql(false);
        const res5 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec3, vec8);
        (0, chai_1.expect)(res5).to.eql(false);
        const res6 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec5, vec8);
        (0, chai_1.expect)(res6).to.eql(false);
    });
    it('case of Vectors of different types ', () => {
        const vec1 = 0;
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const vec4 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec2);
        (0, chai_1.expect)(res1).to.eql(false);
        const res2 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec3);
        (0, chai_1.expect)(res2).to.eql(false);
        const res3 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec4);
        (0, chai_1.expect)(res3).to.eql(false);
    });
    it('case of ComplexVectors of same dimesions ' + ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE + ' through ' + ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 };
        const res = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec2);
        (0, chai_1.expect)(res).to.eql(true);
        const vec3 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const vec4 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 1 }] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec3, vec4);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('case of ComplexVectors of different dimesions ranging from ' + ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE + ' through ' + ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
        const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const vec3 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec3);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('case of ProjectiveVectors of same dimesions ' + ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' through ' + ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec2);
        (0, chai_1.expect)(res).to.eql(true);
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const vec4 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec3, vec4);
        (0, chai_1.expect)(res1).to.eql(true);
    });
    it('case of ProjectiveVectors of different dimesions ranging from ' + ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' through ' + ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
        const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }] };
        const res1 = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec3);
        (0, chai_1.expect)(res1).to.eql(false);
    });
    it('case of ProjectiveComplexVectors of same dimesions ' + ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + ' through ' + ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, () => {
        const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) }] };
        const res = (0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(vec1, vec2);
        (0, chai_1.expect)(res).to.eql(true);
    });
});
