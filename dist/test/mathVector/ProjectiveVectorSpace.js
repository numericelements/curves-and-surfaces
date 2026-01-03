"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ProjectiveVectorSpace_1 = require("../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveVectorSpace_2 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveVectorSpace_3 = require("../../src/ErrorMessages/ProjectiveVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const ProjectiveVectorSpaceTestFactory_1 = require("./ProjectiveVectorSpaceTestFactory");
const VectorSpaceResolvers_1 = require("../../src/namedConstants/VectorSpaceResolvers");
const DefaultVectorSpaces_1 = require("../../src/namedConstants/DefaultVectorSpaces");
const DefaultVectorSpaces_2 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const VectorSpaceIdentifierManager_1 = require("../../src/namedConstants/VectorSpaceIdentifierManager");
const DefaultSpaceResolvers_1 = require("../../src/ErrorMessages/DefaultSpaceResolvers");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ProjectiveVectorSpace', () => {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces_2.DefaultVectorSpaces.reset();
    });
    describe('Constructor', () => {
        it('can generate a ProjectiveVectorSpace with dimension between ' + ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' and ' + ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
            (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw();
            (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw();
        });
        it('cannot generate a ProjectiveVectorSpace outside dimension range', () => {
            (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it('can generate a user-specific ProjectiveVectorSpace and get its dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(projectiveVectorSpace.dimension()).to.eql(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
        });
        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(projectiveVectorSpace1.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
        });
        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
        });
        it(`can check that a user-specific Projective vector space has a default name containing ${VectorSpaceResolvers_1.PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it('can generate a default ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, true);
            (0, chai_1.expect)(projectiveVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a default ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights + ` and an explicit default prescription`, () => {
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, true);
            (0, chai_1.expect)(projectiveVectorSpace1.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace1.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a default ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true);
            (0, chai_1.expect)(projectiveVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
        });
        it('can generate a default ProjectiveVectorSpace with a weight management ' + ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, true);
            (0, chai_1.expect)(projectiveVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
        });
        it(`can check that a default Projective vector space has a default name containing ${DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, true);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can create a user-defined Projective vector space with a user-specified name`, () => {
            const usrSpecName = "My Projective Vector Space";
            const vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name).to.eql(usrSpecName);
        });
        it(`cannot create a default Projective vector space with a user-specified name`, () => {
            const usrSpecName = "My Default Projective Vector Space";
            const vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, true, usrSpecName);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name).to.not.eql(usrSpecName);
        });
        it(`check that two distinct ProjectiveVectorSpace with same dimension and weight management but one being default and the other user-specific are distinct`, () => {
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, true);
            const projectiveVectorSpace2 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, false);
            (0, chai_1.expect)(projectiveVectorSpace1.dimension()).to.eql(projectiveVectorSpace2.dimension());
            (0, chai_1.expect)(projectiveVectorSpace1.weightManagement).to.eql(projectiveVectorSpace2.weightManagement);
            (0, chai_1.expect)(projectiveVectorSpace1.isDefault).to.not.eql(projectiveVectorSpace2.isDefault);
            (0, chai_1.expect)(projectiveVectorSpace1.id).to.not.eql(projectiveVectorSpace2.id);
            (0, chai_1.expect)(projectiveVectorSpace1).to.not.eql(projectiveVectorSpace2);
        });
        it('cannot generate more than one default ProjectiveVectorSpace of a given dimension whatever the weight managment type', () => {
            for (let i = ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
                const vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(i, true);
                (0, chai_1.expect)(vectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(i, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(i, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                (0, chai_1.expect)(() => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(i, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });
    });
    describe('Accesssors', () => {
        it(`can get the identifier of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.id.includes(VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        });
        it(`can get the identifier of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            (0, chai_1.expect)(projectiveVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(true);
        });
        it(`can get the default name of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the default name of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            (0, chai_1.expect)(projectiveVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the status of a user-defined ProjectiveVectorSpace as not being default`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.isDefault).to.eql(false);
        });
        it(`can get the status of a default ProjectiveVectorSpace as being default`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            (0, chai_1.expect)(projectiveVectorSpace.isDefault).to.eql(true);
        });
        it(`can get the vector space type of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
        });
        it(`can get the vector space type of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            (0, chai_1.expect)(projectiveVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
        });
        it('can get the weight management type of a ProjectiveVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can get the weight management type of a ProjectiveVectorSpace as ' + ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights);
        });
        it('can get the weight management type of a ProjectiveVectorSpace as ' + ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights);
        });
        it('can get the weight management type of a ProjectiveVectorSpace as ' + ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
        });
    });
    describe('Methods', () => {
        it('can get the dimension of a ProjectiveVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            (0, chai_1.expect)(projectiveVectorSpace.dimension()).to.eql(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
        });
        // 3D ProjectiveVector Space Tests
        describe('3D Vector Space', () => {
            (0, ProjectiveVectorSpaceTestFactory_1.createCommonProjectiveVectorSpaceTests)((weightManagement) => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement), ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, VectorTypeTags_1.PROJECTIVEVECTOR2D, 2);
        });
        // 4D ProjectiveVector Space Tests
        describe('4D Vector Space', () => {
            (0, ProjectiveVectorSpaceTestFactory_1.createCommonProjectiveVectorSpaceTests)((weightManagement) => new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement), ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE, VectorTypeTags_1.PROJECTIVEVECTOR3D, 3);
        });
        it('can get the description of a complex vector space as a string', () => {
            for (const dim of [ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE, ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE]) {
                const complexVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(dim);
                (0, chai_1.expect)(complexVectorSpace.toString()).to.eql(`${complexVectorSpace.name} [ID: ${complexVectorSpace.id}]`);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.name)).to.eql(true);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.id)).to.eql(true);
            }
        });
        it(`cannot check that two vectors share the same weight management status if one of the vectors is not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2];
            let weight2 = vec2.coordinates[3];
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(() => projectiveVectorSpace1.shareSameWeightManagement(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
        });
        it(`cannot check that two vectors share the same weight management status if both vectors are not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(false);
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2];
            let weight2 = vec2.coordinates[2];
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec4 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace1.shareSameWeightManagement(vec3, vec4)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
        });
        it(`cannot generate a ${ProjectiveVectorSpace_1.ProjectiveVectorSpace} with a dimension lower than ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE} or higher than  ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            (0, chai_1.expect)(() => {
                new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            }).to.throw(Error, ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => {
                new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1);
            }).to.throw(Error, ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it('can check that two ProjectiveVectors are not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can check that two ProjectiveVectors of same dimension but not in the current Projective vector space are not declared as such', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight() }] };
            (0, chai_1.expect)(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('cannot add two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
        });
        it('cannot add two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight() }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot substract two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            (0, chai_1.expect)(() => projectiveVectorSpace1.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
        });
        it('cannot subtract two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(3) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const vec4 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight() }] };
            (0, chai_1.expect)(() => projectiveVectorSpace1.subtractDescriptors(vec3, vec4)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
        });
        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const scale = 2;
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            const scale = 2;
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.cloneVector(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.cloneVector(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot generate a RealVector of dimension outside the Projective vector space ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot generate a RealVector of dimension outside the Projective vector space ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot generate a Complex ProjectiveVector of dimension outside the Projective vector space ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ProjectiveVectorSpace_3.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        });
    });
});
