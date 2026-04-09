import { expect } from "chai";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM, EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveRealVectorSpace";
import { ProjectiveRealVector2D, ProjectiveRealVector3D, WeightDesc } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonProjectiveRealVectorSpaceTests } from "./ProjectiveRealVectorSpaceTestFactory";
import { PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/VectorSpaceResolvers";
import { DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/DefaultVectorSpaces";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { DEFAULT, VECTOR_SPACE } from "../../src/namedConstants/VectorSpaceIdentifierManager";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";

describe('ProjectiveRealVectorSpace', () => {
    
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {

        it('can generate a ProjectiveRealVectorSpace with dimension between ' + MIN_DIMENSION_PROJECTIVEREALVECTORSPACE + ' and ' + MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, () => {
            expect(() => new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE)).to.not.throw()
            expect(() => new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a ProjectiveRealVectorSpace outside dimension range', () => {
            expect(() => new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE - 1)).to.throw(EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE + 1)).to.throw(EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a user-specific ProjectiveRealVectorSpace and get its dimension', () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(projectiveRealVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE)
        });

        it('can generate a user-specific ProjectiveRealVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveRealVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveRealVectorSpace1.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a user-specific ProjectiveRealVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it('can generate a user-specific ProjectiveRealVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it(`can check that a user-specific ProjectiveRealVectorSpace has a default name containing ${PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT)).to.eql(false);
            expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it('can generate a default ProjectiveRealVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a default ProjectiveRealVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights + ` and an explicit default prescription`, () => {
            const projectiveRealVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(projectiveRealVectorSpace1.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace1.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a default ProjectiveRealVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllPositiveWeights, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it('can generate a default ProjectiveRealVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.SomeNullWeights, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it(`can check that a default ProjectiveRealVectorSpace has a default name containing ${DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it(`can create a user-defined ProjectiveRealVectorSpace with a user-specified name`, () => {
            const usrSpecName = "My ProjectiveRealVectorSpace";
            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name).to.eql(usrSpecName);
        });

        it(`cannot create a default ProjectiveRealVectorSpace with a user-specified name`, () => {
            const usrSpecName = "My Default ProjectiveRealVectorSpace";
            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true, usrSpecName);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
            expect(vectorSpace.name).to.not.eql(usrSpecName);
        });

        it(`check that two distinct ProjectiveRealVectorSpace with same dimension and weight management but one being default and the other user-specific are distinct`, () => {
            const projectiveRealVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            const projectiveRealVectorSpace2 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false);
            expect(projectiveRealVectorSpace1.dimension()).to.eql(projectiveRealVectorSpace2.dimension());
            expect(projectiveRealVectorSpace1.weightManagement).to.eql(projectiveRealVectorSpace2.weightManagement);
            expect(projectiveRealVectorSpace1.isDefault).to.not.eql(projectiveRealVectorSpace2.isDefault);
            expect(projectiveRealVectorSpace1.id).to.not.eql(projectiveRealVectorSpace2.id);
            expect(projectiveRealVectorSpace1).to.not.eql(projectiveRealVectorSpace2);
        });

        it('cannot generate more than one default ProjectiveRealVectorSpace of a given dimension whatever the weight managment type', () => {
            for(let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
                const vectorSpace = new ProjectiveRealVectorSpace(i, true);
                expect(vectorSpace.dimension()).to.eql(i);
                expect(vectorSpace.isDefault).to.eql(true);
                expect(() => new ProjectiveRealVectorSpace(i, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                expect(() => new ProjectiveRealVectorSpace(i, WeightManagement.SomeNullWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                expect(() => new ProjectiveRealVectorSpace(i, WeightManagement.AllPositiveWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });

    });

    describe('Accesssors', () => {

        it(`can get the identifier of a user-defined ProjectiveRealVectorSpace`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveRealVectorSpace.id.includes(VECTOR_SPACE)).to.eql(true)
        });

        it(`can get the identifier of a default ProjectiveRealVectorSpace`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, true);
            expect(projectiveRealVectorSpace.id.includes(DEFAULT)).to.eql(true)
        });

        it(`can get the default name of a user-defined ProjectiveRealVectorSpace`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveRealVectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the default name of a default ProjectiveRealVectorSpace`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, true);
            expect(projectiveRealVectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the status of a user-defined ProjectiveRealVectorSpace as not being default`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveRealVectorSpace.isDefault).to.eql(false)
        });

        it(`can get the status of a default ProjectiveRealVectorSpace as being default`, () => {
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true)
        });

        it(`can get the vector space type of a user-defined ProjectiveRealVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL)
        });

        it(`can get the vector space type of a default ProjectiveRealVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, true);
            expect(projectiveVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL)
        });

        it('can get the weight management type of a ProjectiveRealVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });

        it('can get the weight management type of a ProjectiveRealVectorSpace as ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, WeightManagement.AllPositiveWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights)
        });

        it('can get the weight management type of a ProjectiveRealVectorSpace as ' + WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, WeightManagement.SomeNullWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
        });

        it('can get the weight management type of a ProjectiveRealVectorSpace as ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1, WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });
    });


    describe('Methods', () => {
        it('can get the dimension of a ProjectiveRealVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            expect(projectiveVectorSpace.dimension()).to.eql(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1)
        });


        // 3D ProjectiveRealVector Space Tests
        describe('3D Vector Space', () => {
            createCommonProjectiveRealVectorSpaceTests(
                (dim, weightManagement) => new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, weightManagement),
                MIN_DIMENSION_PROJECTIVEREALVECTORSPACE,
                2
            );
            
        });
        
        // 4D ProjectiveRealVector Space Tests
        describe('4D Vector Space', () => {
            createCommonProjectiveRealVectorSpaceTests(
                (dim,weightManagement) => new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, weightManagement),
                MAX_DIMENSION_PROJECTIVEREALVECTORSPACE,
                3
            );
            
        });

        it('can get the description of a complex vector space as a string', () => {
            for( const dim of [MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, MAX_DIMENSION_PROJECTIVEREALVECTORSPACE]) {
                const complexVectorSpace = new ProjectiveRealVectorSpace(dim);
                expect(complexVectorSpace.toString()).to.eql(`${complexVectorSpace.name} [ID: ${complexVectorSpace.id}]`);
                expect(complexVectorSpace.toString().includes(complexVectorSpace.name)).to.eql(true);
                expect(complexVectorSpace.toString().includes(complexVectorSpace.id)).to.eql(true);
            }
        });

        it(`cannot check that two vectors share the same weight management status if one of the vectors is not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);

            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as WeightDesc;
            let weight2 = vec2.coordinates[3] as WeightDesc;
            expect(weight1.weight.strictlyPositive).to.eql(true);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1 as unknown as ProjectiveRealVector3D, vec2)).to.throw(EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM)
            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(() => projectiveVectorSpace1.shareSameWeightManagement(vec1, vec2 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM)
        });

        it(`cannot check that two vectors share the same weight management status if both vectors are not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);

            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(false);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as WeightDesc;
            let weight2 = vec2.coordinates[2] as WeightDesc;
            expect(weight1.weight.strictlyPositive).to.eql(true);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1 as unknown as ProjectiveRealVector3D, vec2 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE)
            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec3: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [0, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const vec4: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace1.shareSameWeightManagement(vec3 as unknown as ProjectiveRealVector2D, vec4 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot generate a ${ProjectiveRealVectorSpace} with a dimension lower than ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE} or higher than  ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            expect(() => {
                new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
                }).to.throw(Error, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE);
            expect(() => {
                new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE + 1);
                }).to.throw(Error, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE);
        });

        it('can check that two ProjectiveRealVectors are not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ProjectiveRealVectors of same dimension but not in the current ProjectiveRealVector space are not declared as such', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight()}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('cannot add two ProjectiveRealVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE - 1);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM)
        });

        it('cannot add two ProjectiveRealVectors of same dimension but not in the current ProjectiveRealVector space', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight()}]};
            expect(() => projectiveVectorSpace.addDescriptors(vec1 as unknown as ProjectiveRealVector3D, vec2 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot subtract two ProjectiveRealVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM)

            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(() => projectiveVectorSpace1.subtractDescriptors(vec1 as unknown as ProjectiveRealVector3D, vec2)).to.throw(EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM)
        });

        it('cannot subtract two ProjectiveRealVectors of same dimension but not in the current ProjectiveRealVector space', () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(3)}]};
            expect(() => projectiveVectorSpace.subtractDescriptors(vec1 as unknown as ProjectiveRealVector3D, vec2 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE)
            
            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec3: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const vec4: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight()}]};
            expect(() => projectiveVectorSpace1.subtractDescriptors(vec3 as unknown as ProjectiveRealVector2D, vec4 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot scale a ProjectiveRealVector of dimension outside the current ProjectiveRealVector space ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleDescriptor(scale, vec1 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ProjectiveRealVector of dimension outside the current ProjectiveRealVector space ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleDescriptor(scale, vec1 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveRealVector of dimension outside the current ProjectiveRealVector space ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneVector(vec1 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveRealVector of dimension outside the current ProjectiveRealVector space ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneVector(vec1 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot get the norm of a ProjectiveRealVector of dimension outside the vector space ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1 = 0;
            expect(() => projectiveVectorSpace.normDescriptor(vec1 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
            const vec2: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [0, 1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.normDescriptor(vec2 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
        });

        it(`cannot get the norm of a ProjectiveRealVector of dimension outside the vector space ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1 = 0;
            expect(() => projectiveVectorSpace.normDescriptor(vec1 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
            const vec2: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [0, 1, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.normDescriptor(vec2 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
        });

        it(`cannot generate a RealVector of dimension outside the ProjectiveRealVector space ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a RealVector of dimension outside the ProjectiveRealVector space ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MAX_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector2D = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1 as unknown as ProjectiveRealVector3D)).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a ProjectiveComplexVector of dimension outside the ProjectiveRealVector space ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            const vec1: ProjectiveRealVector3D = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1 as unknown as ProjectiveRealVector2D)).to.throw(EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it(`can compare 3D vector spaces to a 3D projective realvector space of same dimension and conclude their are isomorphic`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(3);
            expect(projectiveVectorSpace.isDefault).to.eql(false);
            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(3);
            expect(projectiveVectorSpace1.isDefault).to.eql(false);
            expect(projectiveVectorSpace.id).to.not.eql(projectiveVectorSpace1.id);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace1)).to.eql(true);

            const projectiveVectorSpace2 = new ProjectiveRealVectorSpace(3, true);
            expect(projectiveVectorSpace2.isDefault).to.eql(true);
            expect(projectiveVectorSpace.id).to.not.eql(projectiveVectorSpace2.id);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace2)).to.eql(true);
        });

        it(`can compare 4D vector spaces to a 4D projective real vector space of same dimension and conclude their are isomorphic`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(4);
            expect(projectiveVectorSpace.isDefault).to.eql(false);
            const projectiveVectorSpace1 = new ProjectiveRealVectorSpace(4);
            expect(projectiveVectorSpace1.isDefault).to.eql(false);
            expect(projectiveVectorSpace.id).to.not.eql(projectiveVectorSpace1.id);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace1)).to.eql(true);

            const projectiveVectorSpace2 = new ProjectiveRealVectorSpace(4, true);
            expect(projectiveVectorSpace2.isDefault).to.eql(true);
            expect(projectiveVectorSpace.id).to.not.eql(projectiveVectorSpace2.id);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace2)).to.eql(true);
        });

        it(`can compare vector spaces to a Projective real Vector space and check if they are isomorphic`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(3);
            const projectiveVectorSpace2 = new ProjectiveRealVectorSpace(4);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace2)).to.eql(false);

            const projectiveVectorSpace3 = new ProjectiveRealVectorSpace(3);
            expect(projectiveVectorSpace.isIsomorphicTo(projectiveVectorSpace3)).to.eql(true);
        });

        it(`can compare vector spaces of different types to a ProjectiveRealVector space and check if they are isomorphic`, () => {
            const projectiveVectorSpace = new ProjectiveRealVectorSpace(3);
            const realVS = new RealVectorSpace(3);
            expect(projectiveVectorSpace.isIsomorphicTo(realVS)).to.eql(false);

            const projectiveVectorSpace2 = new ProjectiveRealVectorSpace(4);
            const realVS1 = new RealVectorSpace(4);
            expect(projectiveVectorSpace2.isIsomorphicTo(realVS1)).to.eql(false);
        });

    });

})