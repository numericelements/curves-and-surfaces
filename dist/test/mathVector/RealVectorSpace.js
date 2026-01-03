"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpace_1 = require("../../src/namedConstants/RealVectorSpace");
const RealVectorSpace_2 = require("../../src/mathVector/RealVectorSpace");
const RealVectorSpace_3 = require("../../src/ErrorMessages/RealVectorSpace");
const VectorSpaceUtilities_1 = require("../../src/mathVector/VectorSpaceUtilities");
const Weight_1 = require("../../src/mathVector/Weight");
const RealVectorSpaceTestFactory_1 = require("./RealVectorSpaceTestFactory");
const VectorSpaceResolvers_1 = require("../../src/namedConstants/VectorSpaceResolvers");
const DefaultVectorSpaces_1 = require("../../src/namedConstants/DefaultVectorSpaces");
const DefaultVectorSpaces_2 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const DefaultSpaceResolvers_1 = require("../../src/ErrorMessages/DefaultSpaceResolvers");
const VectorSpaceIdentifierManager_1 = require("../../src/namedConstants/VectorSpaceIdentifierManager");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('RealVectorSpace', () => {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces_2.DefaultVectorSpaces.reset();
    });
    describe('Constructor', () => {
        it('can generate a RealVectorSpace dimension between ' + RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + ' and ' + RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, () => {
            (0, chai_1.expect)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE)).to.not.throw();
            (0, chai_1.expect)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE)).to.not.throw();
        });
        it('cannot generate a RealVectorSpace outside dimension range', () => {
            (0, chai_1.expect)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw(RealVectorSpace_3.EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw(RealVectorSpace_3.EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it('can generate a RealVectorSpace and get its dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + 1);
            (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + 1);
        });
        it(`can check that a user specific Real vector space has a default name containing ${VectorSpaceResolvers_1.REAL_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(false);
        });
        it(`can check that a default Real vector space has a default name containing ${DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE, true);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it('can generate a RealVectorSpace specifying its dimension only. The resulting vector space is a user-specific vector space', () => {
            for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(i);
                (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(realVectorSpace.name.includes(VectorSpaceResolvers_1.REAL_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });
        it('can generate a default RealVectorSpace for any valid space dimension', () => {
            for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(i, true);
                (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(realVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });
        it('cannot generate more than one default RealVectorSpace of a given dimension', () => {
            for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(i, true);
                (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(() => new RealVectorSpace_2.RealVectorSpace(i, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });
    });
    describe('Accesssors', () => {
        it(`can get the identifier of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1);
            (0, chai_1.expect)(realVectorSpace.id.includes(VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        });
        it(`can get the identifier of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1, true);
            (0, chai_1.expect)(realVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(true);
        });
        it(`can get the default name of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE);
            (0, chai_1.expect)(realVectorSpace.name.includes(VectorSpaceResolvers_1.REAL_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the default name of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1, true);
            (0, chai_1.expect)(realVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the status of a user-defined RealVectorSpace as not being default`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1);
            (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(false);
        });
        it(`can get the status of a default RealVectorSpace as being default`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1, true);
            (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(true);
        });
        it(`can get the vector space type of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE);
            (0, chai_1.expect)(realVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
        });
        it(`can get the vector space type of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, true);
            (0, chai_1.expect)(realVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
        });
    });
    describe('Methods', () => {
        it('can get the dimension of a RealVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1);
            (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1);
        });
        // 1D RealVector Space Tests
        describe('1D Vector Space', () => {
            (0, RealVectorSpaceTestFactory_1.createCommonRealVectorSpaceTests)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE), RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE, 'number');
        });
        // 2D RealVector Space Tests
        describe('2D Vector Space', () => {
            (0, RealVectorSpaceTestFactory_1.createCommonRealVectorSpaceTests)(() => new RealVectorSpace_2.RealVectorSpace(2), 2, VectorTypeTags_1.REALVECTOR2D);
        });
        // 3D RealVector Space Tests
        describe('3D Vector Space', () => {
            (0, RealVectorSpaceTestFactory_1.createCommonRealVectorSpaceTests)(() => new RealVectorSpace_2.RealVectorSpace(3), 3, VectorTypeTags_1.REALVECTOR3D);
        });
        // 4D RealVector Space Tests
        describe('4D Vector Space', () => {
            (0, RealVectorSpaceTestFactory_1.createCommonRealVectorSpaceTests)(() => new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE), RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, VectorTypeTags_1.REALVECTOR4D);
        });
        it('can get the description of a real vector space as a string', () => {
            for (const dim of [RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE, 2, 3, RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE]) {
                const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(dim);
                (0, chai_1.expect)(realVectorSpace.toString()).to.eql(`${realVectorSpace.name} [ID: ${realVectorSpace.id}]`);
                (0, chai_1.expect)(realVectorSpace.toString().includes(realVectorSpace.name)).to.eql(true);
                (0, chai_1.expect)(realVectorSpace.toString().includes(realVectorSpace.id)).to.eql(true);
            }
        });
        it('can check if two RealVectors of different coordinates are of same dimension 1D', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 0;
            const vec2 = 1;
            (0, chai_1.expect)(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it('can check if two RealVectors of different coordinates are of same dimension 2D', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it('can check if two RealVectors of different coordinates are of same dimension 3D', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE - 1);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it('can check if two RealVectors of different coordinates are of same dimension 4D', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 1] };
            (0, chai_1.expect)(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it('can check that two RealVectors of same dimension but not in the current RealVectorSpace are not declared as such', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 1] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can get a default RealVector of dimension ' + RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = realVectorSpace.defaultVect();
            const vec1D = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(vec1).to.eql(0);
        });
        it('can get a default RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = realVectorSpace.defaultVect();
            const vec2D = (0, VectorSpaceUtilities_1.isVector2D)(vec1);
            (0, chai_1.expect)(vec2D).to.eql(true);
            (0, chai_1.expect)(vec1).to.eql({ type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] });
        });
        it('can get a default RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(3);
            const vec1 = realVectorSpace.defaultVect();
            const vec3D = (0, VectorSpaceUtilities_1.isVector3D)(vec1);
            (0, chai_1.expect)(vec3D).to.eql(true);
            (0, chai_1.expect)(vec1).to.eql({ type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] });
        });
        it('can get a default RealVector of dimension 4' + RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE);
            const vec1 = realVectorSpace.defaultVect();
            const vec4D = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
            (0, chai_1.expect)(vec4D).to.eql(true);
            (0, chai_1.expect)(vec1).to.eql({ type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] });
        });
        it('can check if a RealVector of dimension 2 is not in the RealVectorSpace of different dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec1)).to.eql(false);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec2)).to.eql(false);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec3)).to.eql(false);
        });
        it('can check if a RealVector of dimension 3 is not in the RealVectorSpace of different dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec = 0;
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec)).to.eql(false);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec1)).to.eql(false);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            (0, chai_1.expect)(realVectorSpace.isInVectorSpace(vec2)).to.eql(false);
        });
        it('cannot add two RealVectors of dimensions outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.addDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.addDescriptors(vec1, vec3)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.addDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
        });
        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            const scaleFactor = 2;
            (0, chai_1.expect)(() => realVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.scaleDescriptor(scaleFactor, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.scaleDescriptor(scaleFactor, vec3)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('cannot subtract two RealVectors of dimensions outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.subtractDescriptors(vec1, vec3)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.subtractDescriptors(vec1, vec3)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec4 = 0;
            (0, chai_1.expect)(() => realVectorSpace.subtractDescriptors(vec1, vec4)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
        });
        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            (0, chai_1.expect)(() => realVectorSpace.cloneVector(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.cloneVector(vec2)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.cloneVector(vec3)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            (0, chai_1.expect)(() => realVectorSpace.normDescriptor(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.normDescriptor(vec2)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.normDescriptor(vec3)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('cannot get the normalized vector of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = 0;
            (0, chai_1.expect)(() => realVectorSpace.normalizeRaw(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.normalizeRaw(vec2)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 1] };
            (0, chai_1.expect)(() => realVectorSpace.normalizeRaw(vec3)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('cannot get the cross product of two RealVectors of dimension ' + RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 0;
            const vec2 = 0;
            const vec1D = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_3.EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        });
        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 0] };
            const vec4D = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
            (0, chai_1.expect)(vec4D).to.eql(true);
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 1] };
            const vec4 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec3, vec4)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5 = 1;
            const vec6 = 0;
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec5, vec6)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            const vec4 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec3, vec4)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec5 = 1;
            const vec6 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec5, vec6)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec7 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec8 = 1;
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec7, vec8)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            const vec9 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            const vec10 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.crossProductRaw(vec9, vec10)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
        });
        it('cannot get the dot product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            const vec3 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            const vec4 = 1;
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec2, vec1)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec1, vec3)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec1, vec4)).to.throw(RealVectorSpace_3.EM_REALVECTORS_DIFFERENT_DIM);
        });
        it('cannot get the dot product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 0] };
            const vec4D = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
            (0, chai_1.expect)(vec4D).to.eql(true);
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec1, vec2)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 1] };
            const vec4 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec3, vec4)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5 = 1;
            const vec6 = 0;
            (0, chai_1.expect)(() => realVectorSpace.dotDescriptors(vec5, vec6)).to.throw(RealVectorSpace_3.EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });
        it('can transform a 2D RealVector into a ProjectiveRealVector with default weight', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 2] };
            const vec2 = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([1, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }]);
        });
        it('can transform a 3D RealVector into a ProjectiveRealVector with default weight', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(3);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 2, 3] };
            const vec2 = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([1, 2, 3, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(1) }]);
        });
        it('can transform a 3D RealVector into a ProjectiveRealVector with custom weight', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(3);
            const x = 1;
            const y = 2;
            const z = 3;
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [x, y, z] };
            const weight = new Weight_1.Weight(3);
            const vec2 = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([x * weight.value, y * weight.value, z * weight.value, { type: WeightTypeTags_1.WEIGHT, weight: weight }]);
        });
        it('cannot transform a 1D RealVector into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 1;
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });
        it('cannot transform a 4D RealVector into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 2, 3, 4] };
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });
        it('cannot transform a RealVector of dimension outside of RealVectorSpace dimension into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec3 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 1] };
            const vec3D = (0, VectorSpaceUtilities_1.isVector3D)(vec3);
            (0, chai_1.expect)(vec3D).to.eql(true);
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec3)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const realVectorSpace2 = new RealVectorSpace_2.RealVectorSpace(3);
            const vec4 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            const vec2D = (0, VectorSpaceUtilities_1.isVector2D)(vec4);
            (0, chai_1.expect)(vec2D).to.eql(true);
            (0, chai_1.expect)(() => realVectorSpace2.fromRealVectorSpaceToProjectiveVectorSpace(vec4)).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('can transform a 2D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(2);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 2] };
            const vec2 = realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1);
            (0, chai_1.expect)(vec2.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(vec2).to.eql({ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 });
        });
        it('cannot transform a 1D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(1);
            const vec1 = 1;
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });
        it('cannot transform a 3D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(3);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 2, 3] };
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });
        it('cannot transform a 4D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(4);
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 2, 3, 4] };
            (0, chai_1.expect)(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(RealVectorSpace_3.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });
        it(`can create a RealVector when the number of coordinates is not equal to the dimension of the RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(4);
            const vec1 = realVectorSpace.createVector([1, 2, 3, 0]);
            (0, chai_1.expect)(vec1.type).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(vec1.coordinates).to.eql([1, 2, 3, 0]);
        });
        it(`cannot create a RealVector when the number of coordinates is not equal to the dimension of the RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace_2.RealVectorSpace(4);
            (0, chai_1.expect)(() => realVectorSpace.createVector([1, 2, 3])).to.throw(RealVectorSpace_3.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
    });
});
