"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const ComplexVectorSpace_2 = require("../../src/namedConstants/ComplexVectorSpace");
const ComplexVectorSpaceTestFactory_1 = require("./ComplexVectorSpaceTestFactory");
const Weight_1 = require("../../src/mathVector/Weight");
const VectorSpaceIdentifierManager_1 = require("../../src/mathVector/internal/VectorSpaceIdentifierManager");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ComplexVectorSpace1DStrategy', () => {
    describe('Methods', () => {
        describe(`ComplexVectorSpace1D `, () => {
            beforeEach(() => {
                // Reset the default vector space manager singleton before each test
                VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.reset();
            });
            const vectorSpace = new ComplexVectorSpace_1.ComplexVectorSpace(ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE);
            it(`can add two ${ComplexTypeTag_1.COMPLEX} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addDescriptors(vec1, vec2);
                // Check coordinates
                (0, chai_1.expect)(result.real).to.eql(2);
                (0, chai_1.expect)(result.imaginary).to.eql(3);
            });
            it(`can subtract two ${ComplexTypeTag_1.COMPLEX} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const vec2 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[4, 5]]);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                // Check coordinates
                (0, chai_1.expect)(result.real).to.eql(-2);
                (0, chai_1.expect)(result.imaginary).to.eql(-2);
            });
            it(`can scale a ${ComplexTypeTag_1.COMPLEX} vector with a scalar and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.real).to.eql(4);
                (0, chai_1.expect)(result.imaginary).to.eql(6);
            });
            it(`can scale a ${ComplexTypeTag_1.COMPLEX} vector with a complex and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const scale = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.real).to.eql(-5);
                (0, chai_1.expect)(result.imaginary).to.eql(12);
            });
            it(`can create a ${ComplexTypeTag_1.COMPLEX} vector with user-defined coordinates`, () => {
                const result = vectorSpace.createVector([[1, 2]]);
                (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.real).to.eql(1);
                (0, chai_1.expect)(result.imaginary).to.eql(2);
            });
            it(`can generate the image of ${ComplexTypeTag_1.COMPLEX} vector into the Real vector space ${VectorTypeTags_1.REALVECTOR2D}`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR2D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(2);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(3);
                }
            });
            it(`can generate the image of ${ComplexTypeTag_1.COMPLEX} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} with a default weight`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(vec1.real);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(new Weight_1.Weight());
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(new Weight_1.Weight());
            });
            it(`can generate the image of ${ComplexTypeTag_1.COMPLEX} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} with a user-defined weight`, () => {
                const weightReal = new Weight_1.Weight(2);
                const weightImaginary = new Weight_1.Weight(3);
                const cWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: weightReal, imaginary: weightImaginary };
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1, cWeight);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(vec1.real);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(weightReal);
                (0, chai_1.expect)(result.coordinates[1].real.strictlyPositive).to.eql(true);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(weightImaginary);
                (0, chai_1.expect)(result.coordinates[1].imaginary.strictlyPositive).to.eql(true);
            });
            it(`can generate the image of ${ComplexTypeTag_1.COMPLEX} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} with a null complex weight`, () => {
                const weightReal = new Weight_1.Weight(0, false);
                const weightImaginary = new Weight_1.Weight(0, false);
                const cWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: weightReal, imaginary: weightImaginary };
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1, cWeight);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(vec1.real);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(weightReal);
                (0, chai_1.expect)(result.coordinates[1].real.strictlyPositive).to.eql(false);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(weightImaginary);
                (0, chai_1.expect)(result.coordinates[1].imaginary.strictlyPositive).to.eql(false);
            });
            it(`can generate the image of ${ComplexTypeTag_1.COMPLEX} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} with a default complex weight`, () => {
                const vec1 = (0, ComplexVectorSpaceTestFactory_1.createTestComplexVector)(ComplexTypeTag_1.COMPLEX, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
                (0, chai_1.expect)(result.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(result.coordinates[0].real).to.eql(vec1.real);
                (0, chai_1.expect)(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                (0, chai_1.expect)(result.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
                (0, chai_1.expect)(result.coordinates[1].real).to.eql(new Weight_1.Weight());
                (0, chai_1.expect)(result.coordinates[1].real.strictlyPositive).to.eql(true);
                (0, chai_1.expect)(result.coordinates[1].imaginary).to.eql(new Weight_1.Weight());
                ;
                (0, chai_1.expect)(result.coordinates[1].imaginary.strictlyPositive).to.eql(true);
            });
        });
    });
});
