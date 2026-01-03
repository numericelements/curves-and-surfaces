"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComplexVectorSpace_1 = require("../../src/namedConstants/ComplexVectorSpace");
const ComplexVectorTestFactory_1 = require("./ComplexVectorTestFactory");
describe('ComplexVector', () => {
    describe('Methods', () => {
        for (let dim = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; dim <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; dim++) {
            // dim D ComplexVector Space Tests
            describe(`${dim}D Complex Vector Space`, () => {
                (0, ComplexVectorTestFactory_1.createCommonComplexVectorTests)(dim);
            });
        }
    });
});
