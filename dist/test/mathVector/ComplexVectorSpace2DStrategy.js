"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const ComplexVectorSpace_2 = require("../../src/namedConstants/ComplexVectorSpace");
const ComplexVectorSpaceTestFactory_1 = require("./ComplexVectorSpaceTestFactory");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ComplexVectorSpace2DStrategy', () => {
    describe('Methods', () => {
        describe(`ComplexVectorSpace2D `, () => {
            const vectorSpace = new ComplexVectorSpace_1.ComplexVectorSpace(ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE);
            it(`can add two ${VectorTypeTags_1.COMPLEXVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(VectorTypeTags_1.COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addDescriptors(vec1, vec2);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(2);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(3);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(4);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(5);
            });
            it(`can subtract two ${VectorTypeTags_1.COMPLEXVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(VectorTypeTags_1.COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const vec2 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(VectorTypeTags_1.COMPLEXVECTOR2D, [[4, 5], [6, 7]]);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(-2);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(-2);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(-2);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(-2);
            });
            it(`can scale a ${VectorTypeTags_1.COMPLEXVECTOR2D} vector with a scalar and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(VectorTypeTags_1.COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(4);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(6);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(8);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(10);
            });
            it(`can scale a ${VectorTypeTags_1.COMPLEXVECTOR2D} vector with a complex and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(VectorTypeTags_1.COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const scale = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(-5);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(12);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(-7);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(22);
            });
            it(`can create a ${VectorTypeTags_1.COMPLEXVECTOR2D} vector with user-defined coordinates`, () => {
                const result = vectorSpace.createVector([[1, 2], [3, 4]]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(1);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(2);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(3);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(4);
            });
        });
    });
});
