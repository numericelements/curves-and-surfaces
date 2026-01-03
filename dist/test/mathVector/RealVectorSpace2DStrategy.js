"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpaceTestFactory_1 = require("./RealVectorSpaceTestFactory");
const RealVectorSpace2DStrategy_1 = require("../../src/mathVector/RealVectorSpace2DStrategy");
const VectorSpaceUtilities_1 = require("../../src/mathVector/VectorSpaceUtilities");
const RealVectorSpace_1 = require("../../src/ErrorMessages/RealVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('RealVectorSpace2DStrategy', () => {
    describe('Methods', () => {
        const vectorSpace = new RealVectorSpace2DStrategy_1.RealVectorSpace2DStrategy();
        const vectorType = VectorTypeTags_1.REALVECTOR2D;
        it('can check that two RealVectors are not of same dimension', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(vectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can check that a RealVector is not in the RealVectorSpace', () => {
            const vec1 = 1;
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(false);
        });
        it(`can add two Real2D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [2, -1]);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            // Check coordinates
            (0, chai_1.expect)(result.coordinates).to.eql([3, 0]);
        });
        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = 0;
            (0, chai_1.expect)(() => vectorSpace.addDescriptors(vec1, vec2)).to.throw();
        });
        it('can scale a RealVector', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            const vec1D = (0, VectorSpaceUtilities_1.isVector2D)(vec2);
            (0, chai_1.expect)(vec2.type).to.eql(vectorType);
            (0, chai_1.expect)(vec1D).to.eql(true);
            (0, chai_1.expect)(vec2.coordinates).to.eql([scaleFactor, scaleFactor]);
        });
        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            const scaleFactor = 2;
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw();
        });
        it(`can subtract two Real2D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [2, -1]);
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            // Check coordinates
            (0, chai_1.expect)(result.coordinates).to.eql([-1, 2]);
        });
        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = 0;
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw();
        });
        it('can clone a RealVector', () => {
            let vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const vec2 = vectorSpace.cloneVector(vec1);
            const vec = (0, VectorSpaceUtilities_1.isVector2D)(vec2);
            (0, chai_1.expect)(vec2.type).to.eql(vectorType);
            (0, chai_1.expect)(vec).to.eql(true);
            (0, chai_1.expect)(vec2).to.eql(vec1);
            vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [0, 1]);
            (0, chai_1.expect)(vec2).to.not.eql(vec1);
        });
        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.cloneVector(vec1)).to.throw();
        });
        it(`can get the norm of a RealVector`, () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const norm = vectorSpace.normDescriptor(vec1);
            (0, chai_1.expect)(norm).to.eql(Math.sqrt(5));
        });
        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = 0;
            (0, chai_1.expect)(() => vectorSpace.normDescriptor(vec1)).to.throw();
        });
        it('can get the normalized vector of a RealVector', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const normalized = vectorSpace.normalizeRaw(vec1);
            (0, chai_1.expect)(normalized.type).to.eql(vectorType);
            (0, chai_1.expect)(normalized.coordinates).to.eql([vec1.coordinates[0] / vectorSpace.normDescriptor(vec1), vec1.coordinates[1] / vectorSpace.normDescriptor(vec1)]);
        });
        it('cannot normalize a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.normalizeRaw(vec1)).to.throw();
        });
        it('can get the cross product of two RealVectors of dimension 2', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 0]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [0, 1]);
            const crossProduct = vectorSpace.crossProductRaw(vec1, vec2);
            let vec = (0, VectorSpaceUtilities_1.isVector1D)(crossProduct);
            (0, chai_1.expect)(vec).to.eql(true);
            (0, chai_1.expect)(crossProduct).to.eql(1);
            const vec3 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec4 = vec2;
            const crossProduct1 = vectorSpace.crossProductRaw(vec3, vec4);
            vec = (0, VectorSpaceUtilities_1.isVector1D)(crossProduct1);
            (0, chai_1.expect)(vec).to.eql(true);
            (0, chai_1.expect)(crossProduct1).to.eql(Math.sqrt(2) * Math.sin(Math.PI / 4));
        });
        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [1, 0, 0, 0] };
            const vec2 = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 1, 0, 0] };
            const vec4D = (0, VectorSpaceUtilities_1.isVector4D)(vec1);
            (0, chai_1.expect)(vec4D).to.eql(true);
            (0, chai_1.expect)(() => vectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_1.EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 1]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [1, 0, 0] };
            (0, chai_1.expect)(() => vectorSpace.crossProductRaw(vec1, vec2)).to.throw(RealVectorSpace_1.EM_REALVECTORS_DIFFERENT_DIM);
        });
        it('can get the dot product of two RealVectors of dimension 2', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const vec2 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [3, 4]);
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            (0, chai_1.expect)(scalarProduct).to.eql(11);
        });
        it('cannot get the dot of two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const vec2 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.dotDescriptors(vec1, vec2)).to.throw();
        });
        it('can transform a 2D RealVector into a ProjectiveRealVector with custom strictly positive weight', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const weight = new Weight_1.Weight(3);
            const vec2 = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, { type: WeightTypeTags_1.WEIGHT, weight: weight }]);
        });
        it('can transform a 2D RealVector into a ProjectiveRealVector with custom positive weight', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const weight = new Weight_1.Weight(3, false);
            const vec2 = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, { type: WeightTypeTags_1.WEIGHT, weight: weight }]);
            (0, chai_1.expect)(vec2.coordinates[2].weight.strictlyPositive).to.eql(false);
        });
        it('can transform a 2D RealVector into a ProjectiveRealVector with null weight', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const weight = new Weight_1.Weight(0, false);
            const vec2 = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            (0, chai_1.expect)(vec2.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
            (0, chai_1.expect)(vec2.coordinates).to.eql([1, 2, { type: WeightTypeTags_1.WEIGHT, weight: weight }]);
        });
        it('cannot transform a RealVector out of the current vector space into a ProjectiveRealVector with custom weight', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            const weight = new Weight_1.Weight(2);
            (0, chai_1.expect)(() => vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight)).to.throw(RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
        it('can transform a 2D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const vec1 = (0, RealVectorSpaceTestFactory_1.createTestRealVector)(vectorType, [1, 2]);
            const vec2 = vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1);
            (0, chai_1.expect)(vec2.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(vec2).to.eql({ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 });
        });
        it('cannot transform a RealVector out of the current vector space into a ComplexVector', () => {
            const vec1 = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 1, 0] };
            (0, chai_1.expect)(() => vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });
        it(`can create a RealVector of dimension 2 from a number`, () => {
            const vec = vectorSpace.createVector([1, 2]);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            (0, chai_1.expect)(vec.type).to.eql(VectorTypeTags_1.REALVECTOR2D);
            (0, chai_1.expect)(vec.coordinates).to.eql([1, 2]);
        });
    });
});
