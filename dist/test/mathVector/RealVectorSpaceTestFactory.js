"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestRealVector = exports.createCommonRealVectorSpaceTests = void 0;
const chai_1 = require("chai");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
function createCommonRealVectorSpaceTests(createRealVectorSpace, dimension, vectorType) {
    describe('Common RealVector Space Tests', () => {
        it(`can check if two RealVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            (0, chai_1.expect)(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it(`can check if a RealVector of type ${vectorType} is in the RealVectorSpace of same dimension`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
        });
        it(`can add two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const vec3 = vectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });
        it(`can scale a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });
        it(`can subtract two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const vec3 = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });
        it(`can clone a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = vectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(vec2).to.eql(vec1);
        });
        it(`can get the norm of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const norm = vectorSpace.normDescriptor(vec1);
            (0, chai_1.expect)(typeof norm).to.eql("number");
        });
        it(`can get the normalized vector of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const normalized = vectorSpace.normalizeRaw(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(normalized)).to.eql(true);
        });
        it(`can get the dot product of two RealVectors of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            (0, chai_1.expect)(typeof scalarProduct).to.eql("number");
        });
    });
}
exports.createCommonRealVectorSpaceTests = createCommonRealVectorSpaceTests;
// Helper function to create test vectors
function createTestRealVector(vectorType, coordinates) {
    if (vectorType === 'number') {
        return coordinates ? coordinates[0] : 0;
    }
    if (vectorType === VectorTypeTags_1.REALVECTOR2D) {
        return {
            type: VectorTypeTags_1.REALVECTOR2D,
            coordinates: coordinates ? [coordinates[0], coordinates[1]] : [1, 0]
        };
    }
    else if (vectorType === VectorTypeTags_1.REALVECTOR3D) {
        return {
            type: VectorTypeTags_1.REALVECTOR3D,
            coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2]] : [1, 2, 0]
        };
    }
    else {
        return {
            type: VectorTypeTags_1.REALVECTOR4D,
            coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2], coordinates[3]] : [1, 2, 3, 0]
        };
    }
}
exports.createTestRealVector = createTestRealVector;
