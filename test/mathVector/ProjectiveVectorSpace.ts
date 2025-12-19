import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveVectorSpace";
import { ProjectiveVector2D, ProjectiveVector3D, IWeight } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonProjectiveVectorSpaceTests } from "./ProjectiveVectorSpaceTestFactory";
import { PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/VectorSpaceResolvers";
import { DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/DefaultVectorSpaces";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { DEFAULT, VECTOR_SPACE } from "../../src/namedConstants/VectorSpaceIdentifierManager";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D } from "../../src/namedConstants/VectorTypeTags";

describe('ProjectiveVectorSpace', () => {
    
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {

        it('can generate a ProjectiveVectorSpace with dimension between ' + MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' and ' + MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
            expect(() => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw()
            expect(() => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a ProjectiveVectorSpace outside dimension range', () => {
            expect(() => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a user-specific ProjectiveVectorSpace and get its dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(projectiveVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVEVECTORSPACE)
        });

        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveVectorSpace1.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it('can generate a user-specific ProjectiveVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it(`can check that a user-specific Projective vector space has a default name containing ${PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT)).to.eql(false);
            expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it('can generate a default ProjectiveVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, true);
            expect(projectiveVectorSpace.isDefault).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a default ProjectiveVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights + ` and an explicit default prescription`, () => {
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(projectiveVectorSpace1.isDefault).to.eql(true);
            expect(projectiveVectorSpace1.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a default ProjectiveVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights, true);
            expect(projectiveVectorSpace.isDefault).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it('can generate a default ProjectiveVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights, true);
            expect(projectiveVectorSpace.isDefault).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it(`can check that a default Projective vector space has a default name containing ${DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it(`can create a user-defined Projective vector space with a user-specified name`, () => {
            const usrSpecName = "My Projective Vector Space";
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name).to.eql(usrSpecName);
        });

        it(`cannot create a default Projective vector space with a user-specified name`, () => {
            const usrSpecName = "My Default Projective Vector Space";
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true, usrSpecName);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
            expect(vectorSpace.name).to.not.eql(usrSpecName);
        });

        it(`check that two distinct ProjectiveVectorSpace with same dimension and weight management but one being default and the other user-specific are distinct`, () => {
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            const projectiveVectorSpace2 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false);
            expect(projectiveVectorSpace1.dimension()).to.eql(projectiveVectorSpace2.dimension());
            expect(projectiveVectorSpace1.weightManagement).to.eql(projectiveVectorSpace2.weightManagement);
            expect(projectiveVectorSpace1.isDefault).to.not.eql(projectiveVectorSpace2.isDefault);
            expect(projectiveVectorSpace1.id).to.not.eql(projectiveVectorSpace2.id);
            expect(projectiveVectorSpace1).to.not.eql(projectiveVectorSpace2);
        });

        it('cannot generate more than one default ProjectiveVectorSpace of a given dimension whatever the weight managment type', () => {
            for(let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
                const vectorSpace = new ProjectiveVectorSpace(i, true);
                expect(vectorSpace.dimension()).to.eql(i);
                expect(vectorSpace.isDefault).to.eql(true);
                expect(() => new ProjectiveVectorSpace(i, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                expect(() => new ProjectiveVectorSpace(i, WeightManagement.SomeNullWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
                expect(() => new ProjectiveVectorSpace(i, WeightManagement.AllPositiveWeights, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });

    });

    describe('Accesssors', () => {

        it(`can get the identifier of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.id.includes(VECTOR_SPACE)).to.eql(true)
        });

        it(`can get the identifier of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            expect(projectiveVectorSpace.id.includes(DEFAULT)).to.eql(true)
        });

        it(`can get the default name of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the default name of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            expect(projectiveVectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the status of a user-defined ProjectiveVectorSpace as not being default`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.isDefault).to.eql(false)
        });

        it(`can get the status of a default ProjectiveVectorSpace as being default`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            expect(projectiveVectorSpace.isDefault).to.eql(true)
        });

        it(`can get the vector space type of a user-defined ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE)
        });

        it(`can get the vector space type of a default ProjectiveVectorSpace`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, true);
            expect(projectiveVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE)
        });

        it('can get the weight management type of a ProjectiveVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });

        it('can get the weight management type of a ProjectiveVectorSpace as ' + WeightManagement.AllPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, WeightManagement.AllPositiveWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights)
        });

        it('can get the weight management type of a ProjectiveVectorSpace as ' + WeightManagement.SomeNullWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, WeightManagement.SomeNullWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
        });

        it('can get the weight management type of a ProjectiveVectorSpace as ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });
    });


    describe('Methods', () => {
        it('can get the dimension of a ProjectiveVectorSpace', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(projectiveVectorSpace.dimension()).to.eql(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1)
        });


        // 3D ProjectiveVector Space Tests
        describe('3D Vector Space', () => {
            createCommonProjectiveVectorSpaceTests(
                (weightManagement) => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement),
                MIN_DIMENSION_PROJECTIVEVECTORSPACE,
                PROJECTIVEVECTOR2D,
                2
            );
            
        });
        
        // 4D ProjectiveVector Space Tests
        describe('4D Vector Space', () => {
            createCommonProjectiveVectorSpaceTests(
                (weightManagement) => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement),
                MAX_DIMENSION_PROJECTIVEVECTORSPACE,
                PROJECTIVEVECTOR3D,
                3
            );
            
        });

        it('can get the description of a complex vector space as a string', () => {
            for( const dim of [MIN_DIMENSION_PROJECTIVEVECTORSPACE, MAX_DIMENSION_PROJECTIVEVECTORSPACE]) {
                const complexVectorSpace = new ProjectiveVectorSpace(dim);
                expect(complexVectorSpace.toString()).to.eql(`${complexVectorSpace.name} [ID: ${complexVectorSpace.id}]`);
                expect(complexVectorSpace.toString().includes(complexVectorSpace.name)).to.eql(true);
                expect(complexVectorSpace.toString().includes(complexVectorSpace.id)).to.eql(true);
            }
        });

        it(`cannot check that two vectors share the same weight management status if one of the vectors is not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);

            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as IWeight;
            let weight2 = vec2.coordinates[3] as IWeight;
            expect(weight1.weight.strictlyPositive).to.eql(true);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(() => projectiveVectorSpace1.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it(`cannot check that two vectors share the same weight management status if both vectors are not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);

            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(false);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as IWeight;
            let weight2 = vec2.coordinates[2] as IWeight;
            expect(weight1.weight.strictlyPositive).to.eql(true);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const vec4: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace1.shareSameWeightManagement(vec3, vec4)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot generate a ${ProjectiveVectorSpace} with a dimension lower than ${MIN_DIMENSION_PROJECTIVEVECTORSPACE} or higher than  ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            expect(() => {
                new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1);
                }).to.throw(Error, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            expect(() => {
                new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1);
                }).to.throw(Error, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        });

        it('can check that two ProjectiveVectors are not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ProjectiveVectors of same dimension but not in the current Projective vector space are not declared as such', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight()}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('cannot add two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot add two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight()}]};
            expect(() => projectiveVectorSpace.addDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot substract two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)

            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(() => projectiveVectorSpace1.subtractDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot subtract two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(3)}]};
            expect(() => projectiveVectorSpace.subtractDescriptors(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
            
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const vec4: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight()}]};
            expect(() => projectiveVectorSpace1.subtractDescriptors(vec3, vec4)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneVector(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneVector(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a RealVector of dimension outside the Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a RealVector of dimension outside the Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a Complex ProjectiveVector of dimension outside the Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, weight: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
        });

    });

})