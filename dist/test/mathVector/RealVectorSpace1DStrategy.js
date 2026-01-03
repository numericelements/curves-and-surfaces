"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpace1DStrategy_1 = require("../../src/mathVector/RealVectorSpace1DStrategy");
const RealVectorSpaceTestFactory_1 = require("./RealVectorSpaceTestFactory");
const VectorSpaceUtilities_1 = require("../../src/mathVector/VectorSpaceUtilities");
const RealVectorSpace_1 = require("../../src/ErrorMessages/RealVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('RealVectorSpace1DStrategy', () => {
    describe('Methods', () => {
        const vectorSpace = new RealVectorSpace1DStrategy_1.RealVectorSpace1DStrategy();
        const vectorType = 'number';
        it('can check that two RealVectors are not of same dimension', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(vectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can check that a RealVector is not in the RealVectorSpace', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [1, 0] };
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(false);
        });
        it(`can add two Real1D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [2]);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            // Check coordinates
            (0, chai_1.expect)(result).to.eql(3);
        });
        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.addDescriptors(vec1, vec2)).to.throw();
        });
        it('can scale a RealVector', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            const vec1D = (0, VectorSpaceUtilities_1.isVector1D)(vec2);
            (0, chai_1.expect)(typeof vec2).to.eql(vectorType);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(vec2).to.eql(scaleFactor);
        });
        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            const scaleFactor = 2;
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw();
        });
        it(`can subtract two Real1D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [2]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            // Check coordinates
            (0, chai_1.expect)(result).to.eql(1);
        });
        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw();
        });
        it('can clone a RealVector', () => {
            let vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = vectorSpace.cloneVector(vec1);
            const vec1D = (0, VectorSpaceUtilities_1.isVector1D)(vec2);
            (0, chai_1.expect)(typeof vec2).to.eql(vectorType);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(vec2).to.eql(vec1);
            vec1 = 2;
            (0, chai_1.expect)(vec2).to.not.eql(vec1);
        });
        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.cloneVector(vec1)).to.throw();
        });
        it(`can get the norm of a RealVector`, () => {
            const vec1 = -1;
            const norm = vectorSpace.normDescriptor(vec1);
            (0, chai_1.expect)(norm).to.eql(1);
        });
        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.normDescriptor(vec1)).to.throw();
        });
        it('can get the normalized vector of a RealVector', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [2]);
            const normalized = vectorSpace.normalizeRaw(vec1);
            (0, chai_1.expect)(normalized).to.eql(vec1 / vectorSpace.normDescriptor(vec1));
        });
        it('cannot normalize a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.normalizeRaw(vec1)).to.throw();
        });
        it('cannot get the cross product of two RealVectors of dimension 1', () => {
            const vec1 = 0;
            const vec2 = 0;
            const vec1D = (0, VectorSpaceUtilities_1.isVector1D)(vec1);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(() => vectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_1.EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        });
        it('can get the dot product of two RealVectors', () => {
            const vec1 = 1;
            const vec2 = 2;
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            (0, chai_1.expect)(scalarProduct).to.eql(2);
        });
        it('cannot get the dot of two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.dotDescriptors(vec1, vec2)).to.throw();
        });
        it('cannot transform a RealVector1D into a ProjectiveRealVector', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1]);
            const weight = new Weight_1.Weight(2);
            (0, chai_1.expect)(() => vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight)).to.throw(RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });
        it('cannot transform a 1D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const vec1 = 1;
            (0, chai_1.expect)(() => vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });
        it(`can create a RealVector of dimension 1 from a number`, () => {
            const vec = vectorSpace.createVector([1]);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            (0, chai_1.expect)(vec).to.eql(1);
        });
    });
});
