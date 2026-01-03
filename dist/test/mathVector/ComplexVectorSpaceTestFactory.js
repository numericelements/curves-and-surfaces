"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestComplexVector = exports.createCommonComplexVectorSpaceTests = void 0;
const chai_1 = require("chai");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
function createCommonComplexVectorSpaceTests(createComplexVectorSpace, dimension, vectorType) {
    describe('Common ComplexVector Space Tests', () => {
        it(`can check if two ComplexVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            (0, chai_1.expect)(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it(`can check if a ComplexVector of type ${vectorType} is in the ComplexVectorSpace of same dimension`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
        });
        it(`can add two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            const vec3 = vectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });
        it(`can subtract two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            const vec3 = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });
        it(`can scale a ComplexVector of dimension ${dimension} with a scalar and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });
        it(`can scale a ComplexVector of dimension ${dimension} with a complex and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const scaleComplex = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
            const vec2 = vectorSpace.scaleDescriptor(scaleComplex, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });
        it(`can clone a ComplexVector of dimension ${dimension}`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = vectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(vec2).to.eql(vec1);
        });
    });
}
exports.createCommonComplexVectorSpaceTests = createCommonComplexVectorSpaceTests;
// Helper function to create test vectors
function createTestComplexVector(vectorType, coordinates) {
    if (vectorType === ComplexTypeTag_1.COMPLEX) {
        return {
            type: ComplexTypeTag_1.COMPLEX,
            real: coordinates ? coordinates[0][0] : 0,
            imaginary: coordinates ? coordinates[0][1] : 1
        };
    }
    else {
        return {
            type: VectorTypeTags_1.COMPLEXVECTOR2D,
            coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: coordinates ? coordinates[0][0] : 0, imaginary: coordinates ? coordinates[0][1] : 1 },
                { type: ComplexTypeTag_1.COMPLEX, real: coordinates ? coordinates[1][0] : 1, imaginary: coordinates ? coordinates[1][1] : 2 }]
        };
    }
    ;
}
exports.createTestComplexVector = createTestComplexVector;
