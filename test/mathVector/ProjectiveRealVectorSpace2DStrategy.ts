import { expect } from "chai";
import { MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { ProjectiveRealVector2D } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { createTestProjectiveRealVector } from "./ProjectiveRealVectorSpaceTestFactory";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEREALVECTOR_WITH_NULL_WEIGHT } from "../../src/ErrorMessages/ProjectiveRealVectorSpace";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXWEIGHT, WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, REALVECTOR2D } from "../../src/namedConstants/VectorTypeTags";

describe('ProjectiveRealVectorSpace2DStrategy', () => {
    
    describe('Methods', () => {

        const weightIndex = 2;
        const vectorDim = 3;

        describe(`ProjectiveRealVectorSpace2D with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            
            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);

            it(`can add two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addDescriptors(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEREALVECTOR2D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, true);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, true);
                const result = vectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, true) as ProjectiveRealVector2D;
                const result = vectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginary).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].weight);
                expect(result.coordinates[1].imaginary).to.eql(vec1.coordinates[2].weight);
            });

            it(`can create a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3])
                expect(result.type).to.eql(PROJECTIVEREALVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].weight.value).to.eql(3);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(true);
            });

            it(`cannot creeate a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`cannot creeate a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, 0])).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NULL_WEIGHT);
            });
        });


        describe(`ProjectiveRealVectorSpace2D with weight management ${WeightManagement.AllPositiveWeights}`, () => {

            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);

            it(`can add two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveRealVector(vectorDim, 0, false);
                const result = vectorSpace.addDescriptors(vec1, vec2);
                const result1 = vectorSpace.addDescriptors(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveRealVector(vectorDim, 0, false);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                const result1 = vectorSpace.subtractDescriptors(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEREALVECTOR2D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, false);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEREALVECTOR2D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, false);
                const scale = 0;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(0);
                expect(result.coordinates[1]).to.eql(0);
            })

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with strictly positive weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false);
                const result = vectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });
            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with null weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false);
                const result = vectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with strictly positive weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false) as ProjectiveRealVector2D;
                const result = vectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginary).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].weight);
                expect(result.coordinates[1].imaginary).to.eql(vec1.coordinates[2].weight);
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with null weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false) as ProjectiveRealVector2D;
                const result = vectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginary).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(0, false));
                expect(result.coordinates[1].imaginary).to.eql(new Weight(0, false));
            });

            it(`can create a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3]);
                expect(result.type).to.eql(PROJECTIVEREALVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].weight.value).to.eql(3);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(false);
            });

            it(`cannot creeate a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can creeate a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 0]);
                expect(result.type).to.eql(PROJECTIVEREALVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].weight.value).to.eql(0);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(false);
            });

        });

        describe(`ProjectiveRealVectorSpace2D with weight management ${WeightManagement.SomeNullWeights}`, () => {

            const vectorSpace = new ProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEREALVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);

            it(`can add two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveRealVector(vectorDim, 0, false);
                const result = vectorSpace.addDescriptors(vec1, vec2);
                const result1 = vectorSpace.addDescriptors(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEREALVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestProjectiveRealVector(vectorDim, 0, false);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                const result1 = vectorSpace.subtractDescriptors(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
            })

            it(`can scale a ${PROJECTIVEREALVECTOR2D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, true);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEREALVECTOR2D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestProjectiveRealVector(vectorDim, 2, true);
                const scale = 0;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                for(let i = 0; i < result.coordinates.length - 1; i++) {
                    expect(result.coordinates[i]).to.eql(0);
                }
                expect(result.coordinates[2].weight.value).to.eql(0);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(false);
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with strictly positive weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, true);
                const result = vectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            })

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with null weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false);
                const result = vectorSpace.fromProjectiveRealVSpaceToRealVSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with strictly positive weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, true) as ProjectiveRealVector2D;
                const result = vectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginary).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].weight);
                expect(result.coordinates[1].imaginary).to.eql(vec1.coordinates[2].weight);
            });

            it(`can generate the image of ${PROJECTIVEREALVECTOR2D} vector with null weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 0;
                const vec1 = createTestProjectiveRealVector(vectorDim, weight, false) as ProjectiveRealVector2D;
                const result = vectorSpace.fromProjectiveRealVSpaceToProjectiveComplexVSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginary).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(0, false));
                expect(result.coordinates[1].imaginary).to.eql(new Weight(0, false));
            });

            it(`can create a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3]);
                expect(result.type).to.eql(PROJECTIVEREALVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].weight.value).to.eql(3);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(true);
            });

            it(`cannot create a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can create a ${PROJECTIVEREALVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 0]);
                expect(result.type).to.eql(PROJECTIVEREALVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].weight.value).to.eql(0);
                expect(result.coordinates[2].weight.strictlyPositive).to.eql(false);
            });
        });
    });
});