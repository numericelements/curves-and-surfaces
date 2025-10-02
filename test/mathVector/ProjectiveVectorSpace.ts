import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveVectorSpace";
import { PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, WEIGHT, Weight_Interface } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonProjectiveVectorSpaceTests } from "./ProjectiveVectorSpaceTestFactory";
import { PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/VectorSpaceResolvers";
import { DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME } from "../../src/namedConstants/DefaultVectorSpaces";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";

describe('ProjectiveVectorSpace', () => {
    
    describe('Constructor', () => {

        beforeEach(() => {
            // Reset the default projective space manager singleton before each test
            DefaultVectorSpaces.reset();
        });

        it('can generate a valid ProjectiveVectorSpace dimension between ' + MIN_DIMENSION_PROJECTIVEVECTORSPACE + ' and ' + MAX_DIMENSION_PROJECTIVEVECTORSPACE, () => {
            expect(() => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw()
            expect(() => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a ProjectiveVectorSpace outside dimension range', () => {
            expect(() => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a valid ProjectiveVectorSpace and get its dimension', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(realVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVEVECTORSPACE)
        });

        it('can generate a valid ProjectiveVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a valid ProjectiveVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it('can generate a valid ProjectiveVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });

        it(`can check that a user specific Projective vector space has a default name containing ${PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes("Default ")).to.eql(false);
        });

        it(`can check that a default Projective vector space has a default name containing ${DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it(`can create a user-defined Projective vector space with a user-specified name and id`, () => {
            const usrSpecName = "My Projective Vector Space";
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
            expect(vectorSpace.name).to.eql(usrSpecName);
        });

        // it(`can create a user-defined Projective vector space with a user-specified id`, () => {
        //     const usrSpecName = undefined;
        //     const usrSpecId = "MyId";
        //     const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights, false, usrSpecName, usrSpecId);
        //     expect(vectorSpace.isDefault).to.eql(false);
        //     expect(vectorSpace.name.includes(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(false);
        //     expect(vectorSpace.name.includes(PROJECTIVE_VECTOR_SPACE_NAME)).to.eql(true);
        //     expect(vectorSpace.id).to.eql(usrSpecId);
        // });

    });

    describe('Accesssors', () => {
        it('can get the weight management type of a ProjectiveVectorSpace', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });

        it('can set the weight management type of a ProjectiveVectorSpace to ' + WeightManagement.AllPositiveWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
            realVectorSpace.weightManagement = WeightManagement.AllPositiveWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights)
        });

        it('can set the weight management type of a ProjectiveVectorSpace to ' + WeightManagement.SomeNullWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            realVectorSpace.weightManagement = WeightManagement.SomeNullWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
        });

        it('can set the weight management type of a ProjectiveVectorSpace to ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1, WeightManagement.SomeNullWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
            realVectorSpace.weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });
    });


    describe('Methods', () => {
        it('can get the dimension of a ProjectiveVectorSpace', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            expect(realVectorSpace.dimension()).to.eql(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1)
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

        it(`cannot check that two vectors share the same weight management status if one of the vectors is not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);

            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as Weight_Interface;
            let weight2 = vec2.coordinates[3] as Weight_Interface;
            expect(weight1.value.strictlyPositive).to.eql(true);
            expect(weight2.value.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(() => projectiveVectorSpace1.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it(`cannot check that two vectors share the same weight management status if both vectors are not in the vector space`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);

            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(projectiveVectorSpace.isInVectorSpace(vec2)).to.eql(false);
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[2] as Weight_Interface;
            let weight2 = vec2.coordinates[2] as Weight_Interface;
            expect(weight1.value.strictlyPositive).to.eql(true);
            expect(weight2.value.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            const vec4: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
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
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ProjectiveVectors of same dimension but not in the current Projective vector space are not declared as such', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(projectiveVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('cannot add two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.addRaw(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot add two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(() => projectiveVectorSpace.addRaw(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot substract two ProjectiveVectors not of same dimension', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)

            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(() => projectiveVectorSpace1.subtractRaw(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot subtract two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(3)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
            
            const projectiveVectorSpace1 = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec3: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            const vec4: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight()}]};
            expect(() => projectiveVectorSpace1.subtractRaw(vec3, vec4)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ProjectiveVector of dimension outside the current Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            const scale = 2;
            expect(() => projectiveVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneRaw(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.cloneRaw(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a RealVector of dimension outside the Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a RealVector of dimension outside the Projective vector space ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a Complex ProjectiveVector of dimension outside the Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const projectiveVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => projectiveVectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
        });

    });

})