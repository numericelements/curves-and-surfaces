import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveVectorSpace";
import { PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonVectorSpaceTests } from "./ProjectiveVectorSpaceTestFactory";

describe('ProjectiveVectorSpace', () => {
    
    describe('Constructor', () => {
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


        // 3D Vector Space Tests
        describe('3D Vector Space', () => {
            createCommonVectorSpaceTests(
                (weightManagement) => new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement),
                MIN_DIMENSION_PROJECTIVEVECTORSPACE,
                PROJECTIVEVECTOR2D,
                2
            );
            
        });
        
        // 4D Vector Space Tests
        describe('4D Vector Space', () => {
            createCommonVectorSpaceTests(
                (weightManagement) => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement),
                MAX_DIMENSION_PROJECTIVEVECTORSPACE,
                PROJECTIVEVECTOR3D,
                3
            );
            
        });

        it('can check that two ProjectiveVectors are not of same dimension', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ProjectiveVectors of same dimension but not in the current Projective vector space are not declared as such', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('cannot add two ProjectiveVectors not of same dimension', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => realVectorSpace.add(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot add two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(() => realVectorSpace.add(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot substract two ProjectiveVectors not of same dimension', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => realVectorSpace.subtract(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_DIFFERENT_DIM)
        });

        it('cannot subtract two ProjectiveVectors of same dimension but not in the current Projective vector space', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(() => realVectorSpace.subtract(vec1, vec2)).to.throw(EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot scale a ProjectiveVector of dimension outside the current Projective vector space', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const scale = 2;
            expect(() => realVectorSpace.scale(scale, vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ProjectiveVector of dimension outside the current Projective vector space`, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => realVectorSpace.clone(vec1)).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate a Complex ProjectiveVector of dimension outside the Projective vector space ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
            const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 2, {type: WEIGHT, value: new Weight(2)}]};
            expect(() => realVectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE)
        });

    });

})