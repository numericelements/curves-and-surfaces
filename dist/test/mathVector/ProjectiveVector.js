"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectiveVectorTestFactory_1 = require("./ProjectiveVectorTestFactory");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
describe('ProjectiveRealVector', () => {
    describe('Methods', () => {
        for (let dim = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; dim <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; dim++) {
            // dim D RealVector Space Tests
            describe(`${dim}D Vector Space`, () => {
                (0, ProjectiveVectorTestFactory_1.createCommonProjectiveVectorTests)(dim);
            });
        }
    });
});
