"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RealVectorTestFactory_1 = require("./RealVectorTestFactory");
const RealVectorSpace_1 = require("../../src/namedConstants/RealVectorSpace");
describe('RealVector', () => {
    describe('Methods', () => {
        for (let dim = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; dim <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; dim++) {
            // dim D RealVector Space Tests
            describe(`${dim}D Vector Space`, () => {
                (0, RealVectorTestFactory_1.createCommonRealVectorTests)(dim);
            });
        }
    });
});
