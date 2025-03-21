import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveVectorSpace";
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
            
            // Add any 3D-specific tests here
        });
        
        // 4D Vector Space Tests
        describe('4D Vector Space', () => {
            createCommonVectorSpaceTests(
                (weightManagement) => new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, weightManagement),
                MAX_DIMENSION_PROJECTIVEVECTORSPACE,
                PROJECTIVEVECTOR3D,
                3
            );
            
            // Add any 4D-specific tests here
        });

        // it('can check if two ProjectiveVectors are of same dimension 3D', () => {
        //     const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
        //     const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
        //     expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        // });

        // it('can check if two ProjectiveVectors are of same dimension 4D', () => {
        //     const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
        //     const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        // });

        it('can check that two ProjectiveVectors are not of same dimension', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE - 1);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ProjectiveVectors of same dimension but not in the current RealVectorSpace are not declared as such', () => {
            const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        // it('can check that two 2D ProjectiveVectors share the same weight management status ' + WeightManagement.AllStrictlyPositiveWeights, () => {
        //     const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
        //     const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
        //     expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
        //     expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(vec1.coordinates[2].value.strictlyPositive).to.eql(true);
        //     expect(vec2.coordinates[2].value.strictlyPositive).to.eql(true);
        //     expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        // });

        // it('can check that two 3D ProjectiveVectors share the same weight management status ' + WeightManagement.AllStrictlyPositiveWeights, () => {
        //     const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
        //     const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
        //     expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
        //     expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(vec1.coordinates[3].value.strictlyPositive).to.eql(true);
        //     expect(vec2.coordinates[3].value.strictlyPositive).to.eql(true);
        //     expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        // });

        // it('can check that two 2D ProjectiveVectors share the same weight management status ' + WeightManagement.SomeNullWeights, () => {
        //     const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
        //     let vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        //     let vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
        //     expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
        //     expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        //     expect(vec1.coordinates[2].value.strictlyPositive).to.eql(false);
        //     expect(vec2.coordinates[2].value.strictlyPositive).to.eql(true);
        //     expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        //     vec1 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
        //     vec2 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        //     expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        //     vec1 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        //     vec2 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        //     expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        // });

//         it('can check that two 3D ProjectiveVectors share the same weight management status ' + WeightManagement.SomeNullWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
//             let vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             let vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
//             expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
//             expect(vec1.coordinates[3].value.strictlyPositive).to.eql(false);
//             expect(vec2.coordinates[3].value.strictlyPositive).to.eql(true);
//             expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
//             vec1 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
//             vec2 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
//             vec1 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             vec2 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
//         });

//         it('can check that two 2D ProjectiveVectors share the same weight management status ' + WeightManagement.AllPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
//             const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2, false)}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
//             expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
//             expect(vec1.coordinates[2].value.strictlyPositive).to.eql(false);
//             expect(vec2.coordinates[2].value.strictlyPositive).to.eql(false);
//             expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
//         });

//         it('can check that two 3D ProjectiveVectors share the same weight management status ' + WeightManagement.AllPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
//             const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2, false)}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
//             expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
//             expect(vec1.coordinates[3].value.strictlyPositive).to.eql(false);
//             expect(vec2.coordinates[3].value.strictlyPositive).to.eql(false);
//             expect(realVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
//         });

//         it('can check if a ' + PROJECTIVEVECTOR2D + ' is in the vector space ', () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
//             const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight()}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
//         });
//         it('can check if a ' + PROJECTIVEVECTOR3D + ' is in the vector space ', () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
//             const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight()}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(true);
//         });

//         it('can check if a ' + PROJECTIVEVECTOR2D + ' is not in the vector space ', () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
//             const vec2: ProjectiveVector2D = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(false);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(false);
//         });

//         it('can check if a ' + PROJECTIVEVECTOR3D + ' is not in the vector space ', () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
//             const vec2: ProjectiveVector3D = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(false);
//             expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(false);
//         });

//         it('can get a default ' + PROJECTIVEVECTOR2D + ' in the vector space with weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR2D);
//             if(vec1.type === PROJECTIVEVECTOR2D) {
//                 expect(vec1.coordinates[2].value.strictlyPositive).to.eql(true);
//             }
//         });

//         it('can get a default ' + PROJECTIVEVECTOR3D + ' in the vector space with weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR3D);
//             if(vec1.type === PROJECTIVEVECTOR3D) {
//                 expect(vec1.coordinates[3].value.strictlyPositive).to.eql(true);
//             }
//         });

//         it('can get a default ' + PROJECTIVEVECTOR2D + ' in the vector space with weight management ' + WeightManagement.SomeNullWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR2D);
//             if(vec1.type === PROJECTIVEVECTOR2D) {
//                 expect(vec1.coordinates[2].value.strictlyPositive).to.eql(true);
//             }
//         });
//         it('can get a default ' + PROJECTIVEVECTOR3D + ' in the vector space with weight management ' + WeightManagement.SomeNullWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR3D);
//             if(vec1.type === PROJECTIVEVECTOR3D) {
//                 expect(vec1.coordinates[3].value.strictlyPositive).to.eql(true);
//             }
//         });

//         it('can get a default ' + PROJECTIVEVECTOR2D + ' in the vector space with weight management ' + WeightManagement.AllPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR2D);
//             if(vec1.type === PROJECTIVEVECTOR2D) {
//                 expect(vec1.coordinates[2].value.strictlyPositive).to.eql(false);
//             }
//         });

//         it('can get a default ' + PROJECTIVEVECTOR3D + ' in the vector space with weight management ' + WeightManagement.AllPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
//             const vec1: ProjectiveVector = realVectorSpace.defaultVect();
//             expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true);
//             expect(vec1.type).to.eql(PROJECTIVEVECTOR3D);
//             if(vec1.type === PROJECTIVEVECTOR3D) {
//                 expect(vec1.coordinates[3].value.strictlyPositive).to.eql(false);
//             }
//         });

//         it('can add two ProjectiveVectors ' + PROJECTIVEVECTOR2D + ' in the vector space with weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
//             const realVectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
//             const vec1: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
//             const vec2: ProjectiveVector = realVectorSpace.defaultVect();
//             const vec3: ProjectiveVector = realVectorSpace.add(vec1, vec2);
//             expect(realVectorSpace.isInVectorSpace(vec3)).to.eql(true);
//             expect(vec3.type).to.eql(PROJECTIVEVECTOR2D);
//             if(vec3.type === PROJECTIVEVECTOR2D) {
//                 expect(vec3.coordinates).to.eql([1, 0, {type: WEIGHT, value: new Weight(3)}]);
//                 expect(vec3.coordinates[2].value.strictlyPositive).to.eql(true);
//             }
//         });
    });

})