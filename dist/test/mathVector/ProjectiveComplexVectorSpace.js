"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ProjectiveComplexVectorSpace_1 = require("../../src/namedConstants/ProjectiveComplexVectorSpace");
const ProjectiveComplexVectorSpace_2 = require("../../src/mathVector/ProjectiveComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_3 = require("../../src/ErrorMessages/ProjectiveComplexVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const ComplexOperators_1 = require("../../src/ErrorMessages/ComplexOperators");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const VectorSpaceResolvers_1 = require("../../src/namedConstants/VectorSpaceResolvers");
const DefaultVectorSpaces_1 = require("../../src/namedConstants/DefaultVectorSpaces");
const DefaultVectorSpaces_2 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const VectorSpaceIdentifierManager_1 = require("../../src/namedConstants/VectorSpaceIdentifierManager");
const DefaultSpaceResolvers_1 = require("../../src/ErrorMessages/DefaultSpaceResolvers");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const Weight_2 = require("../../src/namedConstants/Weight");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ProjectiveComplexVectorSpace', () => {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces_2.DefaultVectorSpaces.reset();
    });
    describe('Constructor', () => {
        it('can generate a valid ProjectiveComplexVectorSpace dimension between ' + ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + ' and ' + ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, () => {
            (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.not.throw();
            (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.not.throw();
        });
        it('cannot generate a ProjectiveComplexVectorSpace outside dimension range', () => {
            (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw(ProjectiveComplexVectorSpace_3.EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw(ProjectiveComplexVectorSpace_3.EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it('can generate a user-specific ProjectiveComplexVectorSpace and get its dimension', () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.dimension()).to.eql(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
        });
        it('can generate a user-specific ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVectorSpace1 = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(projectiveComplexVectorSpace1.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a user-specific ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
        });
        it('can generate a user-specific ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
        });
        it(`can check that a user specific ProjectiveComplexVectorSpace has a default name containing ${VectorSpaceResolvers_1.PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it('can generate a default ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a default ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights + ` and an explicit default prescription`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can generate a default ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
        });
        it('can generate a default ProjectiveComplexVectorSpace with a weight management ' + ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
        });
        it(`can check that a default ProjectiveComplexVectorSpace has a default name containing ${DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can create a user-defined ProjectiveComplexVectorSpace with a user-specified name`, () => {
            const usrSpecName = "My Complex Projective Vector Space";
            const vectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name).to.eql(usrSpecName);
        });
        it(`cannot create a default ProjectiveComplexVectorSpace with a user-specified name`, () => {
            const usrSpecName = "My Default Complex Projective Vector Space";
            const vectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, true, usrSpecName);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name).to.not.eql(usrSpecName);
        });
        it(`check that two distinct ProjectiveComplexVectorSpace with same dimension and weight management but one being default and the other user-specific are distinct`, () => {
            const projectiveComplexVectorSpace1 = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, true);
            const projectiveComplexVectorSpace2 = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, false);
            (0, chai_1.expect)(projectiveComplexVectorSpace1.dimension()).to.eql(projectiveComplexVectorSpace2.dimension());
            (0, chai_1.expect)(projectiveComplexVectorSpace1.weightManagement).to.eql(projectiveComplexVectorSpace2.weightManagement);
            (0, chai_1.expect)(projectiveComplexVectorSpace1.isDefault).to.not.eql(projectiveComplexVectorSpace2.isDefault);
            (0, chai_1.expect)(projectiveComplexVectorSpace1.id).to.not.eql(projectiveComplexVectorSpace2.id);
            (0, chai_1.expect)(projectiveComplexVectorSpace1).to.not.eql(projectiveComplexVectorSpace2);
        });
        it('cannot generate more than one default ProjectiveComplexVectorSpace of a given dimension whatever the weight managment type', () => {
            for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
                const vectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(i, true);
                (0, chai_1.expect)(vectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(i, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(i, ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                (0, chai_1.expect)(() => new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(i, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });
    });
    describe('Accesssors', () => {
        it(`can get the identifier of a user-defined ProjectiveComplexVectorSpace`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        });
        it(`can get the identifier of a default ProjectiveComplexVectorSpace`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(true);
        });
        it(`can get the default name of a user-defined ProjectiveComplexVectorSpace`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.name.includes(VectorSpaceResolvers_1.PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the default name of a default ProjectiveComplexVectorSpace`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the status of a user-defined ProjectiveComplexVectorSpace as not being default`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(false);
        });
        it(`can get the status of a default ProjectiveComplexVectorSpace as being default`, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
        });
        it(`can get the vector space type of a user-defined ProjectiveComplexVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
        });
        it(`can get the vector space type of a default ProjectiveComplexVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(projectiveVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
        });
        it('can get the weight management type of a ProjectiveComplexVectorSpace', () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        });
        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            projectiveComplexVectorSpace.weightManagement = ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights;
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
        });
        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            projectiveComplexVectorSpace.weightManagement = ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights;
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
        });
        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            projectiveComplexVectorSpace.weightManagement = ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights;
            (0, chai_1.expect)(projectiveComplexVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        });
    });
    describe('Methods', () => {
        it('can get the dimension of a ProjectiveComplexVectorSpace', () => {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            (0, chai_1.expect)(projectiveComplexVectorSpace.dimension()).to.eql(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
        });
        it('can get the description of a complex vector space as a string', () => {
            for (const dim of [ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE]) {
                const complexVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(dim);
                (0, chai_1.expect)(complexVectorSpace.toString()).to.eql(`${complexVectorSpace.name} [ID: ${complexVectorSpace.id}]`);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.name)).to.eql(true);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.id)).to.eql(true);
            }
        });
        it(`cannot check that two vectors share the same weight management status if one of the vectors has not the same weight management for its real and imaginary weights`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            let vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            (0, chai_1.expect)(weight1.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight2.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`can check that two vectors share the same weight management status if both vectors are in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            (0, chai_1.expect)(weight1.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight2.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });
        it(`can check that two vectors share the same weight management status if both vectors are in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(projectiveVectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            (0, chai_1.expect)(weight1.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight2.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });
        it(`can generate a default ProjectiveComplexVector`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const res = projectiveVectorSpace.defaultVect();
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(0);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight());
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight());
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(3));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3));
        });
        it(`cannot add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} when one vector has a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it(`cannot add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} when both vectors have a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it('cannot add two ProjectiveComplexVectors of same dimension if one vector has not the same weight positivity management for real and imaginary weights', () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(3, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one complex real weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(2, false) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(4, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one complex imaginary weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(4, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one null complex weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one null real weight and one null imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(3);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(0.5) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(1);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(2);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight());
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(0.5));
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} when one vector has a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} when both vectors have a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it('cannot subtract two ProjectiveComplexVectors of same dimension if one vector has not the same weight positivity management for real and imaginary weights', () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`cannot subtract two ProjectiveVectors of same dimension producing a negative real weight with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(0.5) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative imaginary weight with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight() }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(1.5) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative real weight with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight() }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLPOS);
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative imaginary weight with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        });
        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing negative real and imaginary weights with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(3, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(-1);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(1, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one complex real weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0.5, false) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(1);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(1.5, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one complex imaginary weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(1);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(1, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one null complex weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(1);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and one null real weight and one null imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(2, false) }] };
            const vec2 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const res = projectiveVectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(1);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(2, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(4);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(4));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3));
        });
        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(4);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(4));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3));
        });
        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} and a positive weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(2);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(4);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`can scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1.5) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(5);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2.5));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(5));
        });
        it(`can scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5, false), imaginary: new Weight_1.Weight(0, false) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(5);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(3, true));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(1.5, true));
        });
        it(`can scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} producing some null real weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(3) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(5);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(7.5, false));
        });
        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} producing some null imaginery weight when the scale factor is a null complex`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(3) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it(`can scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} producing some null weight based on ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5 + ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 3), imaginary: new Weight_1.Weight(3) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            const res = projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(0);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(5);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary.value).to.be.closeTo(7.5, GeneralPurpose_1.TOLERANCE_FLOAT);
            (0, chai_1.expect)(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });
        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights} if the resulting weight is negative`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1.5, false) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });
        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} if the resulting weight is negative`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0.5), imaginary: new Weight_1.Weight(1.5) }] };
            const scaleFactor = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 1 };
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });
        it(`cannot scale a ProjectiveComplexVector if its real and imaginary weights don't conform to the same positivity constraint`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(0, false) }] };
            const scaleFactor = 2;
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`cannot scale a ProjectiveComplexVector if its complex weight doesn't conform to the weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const scaleFactor = 2;
            (0, chai_1.expect)(() => projectiveVectorSpace.scaleDescriptor(scaleFactor, vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it(`can clone a ProjectiveComplexVector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) }] };
            const res = projectiveVectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(1);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(2);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3));
            vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 5, imaginary: 3 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(1);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(2);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(2));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3));
        });
        it(`can clone a ProjectiveComplexVector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3, false) }] };
            const res = projectiveVectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(1);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(2);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3, false));
            vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 5, imaginary: 3 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight(2) }] };
            (0, chai_1.expect)(res.type).to.eql(VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D);
            (0, chai_1.expect)(res.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(res.coordinates[0].real).to.eql(1);
            (0, chai_1.expect)(res.coordinates[0].imaginary).to.eql(2);
            (0, chai_1.expect)(res.coordinates[1].type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(res.coordinates[1].real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(res.coordinates[1].imaginary).to.eql(new Weight_1.Weight(3, false));
        });
        it(`cannot clone a ProjectiveComplexVector with different weight positivity conditions`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.cloneVector(vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`can generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) }] };
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(result.real).to.eql(0.5);
            (0, chai_1.expect)(result.imaginary).to.eql(2 / 3);
        });
        it(`cannot generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX} with different weight positivity conditions`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });
        it(`can generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX} when the real weight is null`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3, false) }] };
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(result.real).to.eql(1);
            (0, chai_1.expect)(result.imaginary).to.eql(2 / 3);
        });
        it(`can generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX} when the imaginary weight is null`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2, false), imaginary: new Weight_1.Weight(0, false) }] };
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(result.real).to.eql(0.5);
            (0, chai_1.expect)(result.imaginary).to.eql(2);
        });
        it(`cannot generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX} with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} if positivity condition exists for real weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        it(`cannot generate the image of ${VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${ComplexTypeTag_1.COMPLEX} with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights} if positivity condition exists for imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1 = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 }, { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(3, false), imaginary: new Weight_1.Weight(0, false) }] };
            (0, chai_1.expect)(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(ProjectiveComplexVectorSpace_3.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
        });
        // const PROJECTIVECOMPLEXVECTOR2D = 'ProjectiveComplexVector2D';
        // interface ProjectiveComplexVector2D {
        //     type: typeof PROJECTIVECOMPLEXVECTOR2D;
        //     coordinates: [Complex, Complex, ComplexWeight];
        // }
        // type ProjectiveComplexVector = ProjectiveComplexVector1D | ProjectiveComplexVector2D;
        // let ExtendedProjectiveComplexVectorSpace: {
        //     new (dim: number, weightManagement: WeightManagement): ProjectiveComplexVectorSpace & {
        //         areSameDimensionTest(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean;
        //     }
        // };
        // beforeEach(() => {
        //     ExtendedProjectiveComplexVectorSpace = class extends ProjectiveComplexVectorSpace {
        //         constructor(dim: number, weightManagement: WeightManagement) {
        //             super(dim, weightManagement);
        //         }
        //         areSameDimensionTest(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
        //             return this.areSameDimension(v1, v2);
        //         }
        //     }
        // });
    });
});
