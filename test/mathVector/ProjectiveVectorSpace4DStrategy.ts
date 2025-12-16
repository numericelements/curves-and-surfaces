import { expect } from "chai";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { createTestProjectiveVector } from "./ProjectiveVectorSpaceTestFactory";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/ProjectiveVectorSpace";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR3D, REALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";

describe('ProjectiveVectorSpace4DStrategy', () => {
    
    describe('Methods', () => {

        const weightIndex = 3;

        describe(`ProjectiveVectorSpace4D with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            
            const vectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);

            it(`can add two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addRaw(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.subtractRaw(vec1, vec2);
                // Check coordinates based on vector type
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, true);
                const scale = 2;
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can clone a ${PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, true);
                const result = vectorSpace.cloneRaw(vec1);
                // Check coordinates
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can generate the image of a ${PROJECTIVEVECTOR3D} vector into the Real vector space ${REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR3D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                    expect(result.coordinates[2]).to.eql(0);
                }
            });

            it(`cannot generate the image of a ${PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, true);
                expect(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });

            it(`can create a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                expect(result.type).to.eql(PROJECTIVEVECTOR3D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2]).to.eql(3);
                expect(result.coordinates[3].type).to.eql(WEIGHT);
                expect(result.coordinates[3].weight.value).to.eql(4);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(true);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, 3, -4])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, 3, 0])).to.throw(EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT);
            });
        });


        describe(`ProjectiveVectorSpace4D with weight management ${WeightManagement.AllPositiveWeights}`, () => {

            const vectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);

            it(`can add two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.addRaw(vec1, vec2);
                const result1 = vectorSpace.addRaw(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
                expect(result1.coordinates[2]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.subtractRaw(vec1, vec2);
                const result1 = vectorSpace.subtractRaw(vec1, vec3);
                // Check coordinates based on vector type
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
                expect(result1.coordinates[2]).to.eql(0);
            })

            it(`can scale a ${PROJECTIVEVECTOR3D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const scale = 2;
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR3D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const scale = 0;
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(0);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can clone a ${PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const result = vectorSpace.cloneRaw(vec1);
                // Check coordinates
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can find the image of a ${PROJECTIVEVECTOR3D} vector with strictly positive weight into the Real vector space ${REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR3D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                    expect(result.coordinates[2]).to.eql(0);
                }
            })

            it(`can find the image of a ${PROJECTIVEVECTOR3D} vector with null weight into the Real vector space ${REALVECTOR3D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR3D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                    expect(result.coordinates[2]).to.eql(0);
                }
            })

            it(`cannot generate the image of a ${PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, true);
                expect(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });

            it(`can create a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                expect(result.type).to.eql(PROJECTIVEVECTOR3D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2]).to.eql(3);
                expect(result.coordinates[3].type).to.eql(WEIGHT);
                expect(result.coordinates[3].weight.value).to.eql(4);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3, -4])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 0]);
                expect(result.type).to.eql(PROJECTIVEVECTOR3D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2]).to.eql(3);
                expect(result.coordinates[3].type).to.eql(WEIGHT);
                expect(result.coordinates[3].weight.value).to.eql(0);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
        });

        describe(`ProjectiveVectorSpace4D with weight management ${WeightManagement.SomeNullWeights}`, () => {

            const vectorSpace = new ProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);

            it(`can add two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.addRaw(vec1, vec2);
                const result1 = vectorSpace.addRaw(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
                expect(result1.coordinates[2]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR3D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 0, false);
                const result = vectorSpace.subtractRaw(vec1, vec2);
                const result1 = vectorSpace.subtractRaw(vec1, vec3);
                // Check coordinates based on vector type
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
                expect(result1.coordinates[2]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR3D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const scale = 2;
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR3D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const scale = 0;
                const result = vectorSpace.scaleRaw(scale, vec1);
                for(let i = 0; i < result.coordinates.length - 1; i++) {
                    expect(result.coordinates[i]).to.eql(0);
                }
                expect(result.coordinates[3].weight.value).to.eql(0);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });

            it(`can clone a ${PROJECTIVEVECTOR3D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, 2, false);
                const result = vectorSpace.cloneRaw(vec1);
                // Check coordinates
                expect(result.coordinates[2]).to.eql(0);
            });

            it(`can find the image of a ${PROJECTIVEVECTOR3D} vector with strictly positive weight into the Real vector space ${REALVECTOR3D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR3D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                    expect(result.coordinates[2]).to.eql(0);
                }
            });

            it(`can find the image of a ${PROJECTIVEVECTOR3D} vector with null weight into the Real vector space ${REALVECTOR3D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR3D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                    expect(result.coordinates[2]).to.eql(0);
                }
            });

            it(`cannot generate the image of a ${PROJECTIVEVECTOR3D} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveVector(PROJECTIVEVECTOR3D, weight, true);
                expect(() => vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            });

            it(`can create a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 4]);
                expect(result.type).to.eql(PROJECTIVEVECTOR3D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2]).to.eql(3);
                expect(result.coordinates[3].type).to.eql(WEIGHT);
                expect(result.coordinates[3].weight.value).to.eql(4);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(true);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3, -4])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can creeate a ${PROJECTIVEVECTOR3D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3, 0]);
                expect(result.type).to.eql(PROJECTIVEVECTOR3D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2]).to.eql(3);
                expect(result.coordinates[3].type).to.eql(WEIGHT);
                expect(result.coordinates[3].weight.value).to.eql(0);
                expect(result.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
        });
    });
});