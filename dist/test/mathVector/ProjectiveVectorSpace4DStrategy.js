"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveVectorSpaceTestFactory_1 = require("./ProjectiveVectorSpaceTestFactory");
const ProjectiveVectorSpace_2 = require("../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveVectorSpace_3 = require("../../src/ErrorMessages/ProjectiveVectorSpace");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ProjectiveVectorSpace4DStrategy', () => {
    describe('Methods', () => {
        const weightIndex = 3;
        describe(`ProjectiveVectorSpace4D with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            it(`can add two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addDescriptors(vec1, vec2);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can subtract two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                // Check coordinates based on vector type
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can scale a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, true);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can clone a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, true);
                const result = vectorSpace.cloneVector(vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can generate the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector into the Real vector space ${VectorTypeTags_1.REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(1 / weight);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                    (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                }
            });
            it(`cannot generate the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, true);
                (0, chai_1.expect)(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });
            it(`can create a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(3);
                (0, chai_1.expect)(result.coordinates[3].type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(4);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(true);
            });
            it(`cannot creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                (0, chai_1.expect)(() => vectorSpace.createVector([1, 2, 3, -4])).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });
            it(`cannot creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                (0, chai_1.expect)(() => vectorSpace.createVector([1, 2, 3, 0])).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT);
            });
        });
        describe(`ProjectiveVectorSpace4D with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            it(`can add two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.addDescriptors(vec1, vec2);
                const result1 = vectorSpace.addDescriptors(vec1, vec3);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[0]).to.eql(2);
                (0, chai_1.expect)(result1.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[2]).to.eql(0);
            });
            it(`can subtract two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                const result1 = vectorSpace.subtractDescriptors(vec1, vec3);
                // Check coordinates based on vector type
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[0]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[2]).to.eql(0);
            });
            it(`can scale a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can scale a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const scale = 0;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can clone a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const result = vectorSpace.cloneVector(vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can find the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with strictly positive weight into the Real vector space ${VectorTypeTags_1.REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(1 / weight);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                    (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                }
            });
            it(`can find the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with null weight into the Real vector space ${VectorTypeTags_1.REALVECTOR3D}`, () => {
                const weight = 0;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                    (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                }
            });
            it(`cannot generate the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, true);
                (0, chai_1.expect)(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });
            it(`can create a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(3);
                (0, chai_1.expect)(result.coordinates[3].type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(4);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
            it(`cannot creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                (0, chai_1.expect)(() => vectorSpace.createVector([1, 2, -3, -4])).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });
            it(`can creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 0]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(3);
                (0, chai_1.expect)(result.coordinates[3].type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(0);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
        });
        describe(`ProjectiveVectorSpace4D with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            it(`can add two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.addDescriptors(vec1, vec2);
                const result1 = vectorSpace.addDescriptors(vec1, vec3);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[0]).to.eql(2);
                (0, chai_1.expect)(result1.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[2]).to.eql(0);
            });
            it(`can subtract two ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                const result1 = vectorSpace.subtractDescriptors(vec1, vec3);
                // Check coordinates based on vector type
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[0]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result1.coordinates[2]).to.eql(0);
            });
            it(`can scale a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[0]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can scale a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const scale = 0;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                for (let i = 0; i < result.coordinates.length - 1; i++) {
                    (0, chai_1.expect)(result.coordinates[i]).to.eql(0);
                }
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(0);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
            it(`can clone a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, 2, false);
                const result = vectorSpace.cloneVector(vec1);
                // Check coordinates
                (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
            });
            it(`can find the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with strictly positive weight into the Real vector space ${VectorTypeTags_1.REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(1 / weight);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                    (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                }
            });
            it(`can find the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with null weight into the Real vector space ${VectorTypeTags_1.REALVECTOR3D}`, () => {
                const weight = 0;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                (0, chai_1.expect)(typeof result).to.not.eql('number');
                if (typeof result !== 'number') {
                    (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                    (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                    (0, chai_1.expect)(result.coordinates[1]).to.eql(0);
                    (0, chai_1.expect)(result.coordinates[2]).to.eql(0);
                }
            });
            it(`cannot generate the image of a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = (0, ProjectiveVectorSpaceTestFactory_1.createTestProjectiveVector)(VectorTypeTags_1.PROJECTIVEVECTOR3D, weight, true);
                (0, chai_1.expect)(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });
            it(`can create a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(3);
                (0, chai_1.expect)(result.coordinates[3].type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(4);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(true);
            });
            it(`cannot creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                (0, chai_1.expect)(() => vectorSpace.createVector([1, 2, -3, -4])).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });
            it(`can creeate a ${VectorTypeTags_1.PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 0]);
                (0, chai_1.expect)(result.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(result.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(result.coordinates[1]).to.eql(2);
                (0, chai_1.expect)(result.coordinates[2]).to.eql(3);
                (0, chai_1.expect)(result.coordinates[3].type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(result.coordinates[3].weight.value).to.eql(0);
                (0, chai_1.expect)(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
        });
    });
});
