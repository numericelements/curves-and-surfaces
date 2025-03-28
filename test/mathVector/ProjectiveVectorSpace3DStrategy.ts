import { expect } from "chai";
import { MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { COMPLEX, COMPLEXWEIGHT, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector2D, PROJECTIVEVECTOR2D, REALVECTOR2D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { ProjectiveVectorSpace3DStrategy } from "../../src/mathVector/ProjectiveVectorSpace3DStrategy";
import { createTestVector } from "./ProjectiveVectorSpaceTestFactory";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT } from "../../src/ErrorMessages/ProjectiveVectorSpace";

describe('ProjectiveVectorSpace3DStrategy', () => {
    
    describe('Methods', () => {

        const weightIndex = 2;

        describe(`ProjectiveVectorSpace3D with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            
            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);

            it(`can add two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.add(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, true);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.subtract(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR2D} vector and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, true);
                const scale = 2;
                const result = vectorSpace.scale(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, true) as ProjectiveVector2D;
                const result = vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginery).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].value);
                expect(result.coordinates[1].imaginery).to.eql(vec1.coordinates[2].value);
            });

            it(`can create a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3]) as ProjectiveVector2D;
                expect(result.type).to.eql(PROJECTIVEVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].value.weight).to.eql(3);
                expect(result.coordinates[2].value.strictlyPositive).to.eql(true);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, 0])).to.throw(EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT);
            });
        });


        describe(`ProjectiveVectorSpace3D with weight management ${WeightManagement.AllPositiveWeights}`, () => {

            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);

            it(`can add two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const result = vectorSpace.add(vec1, vec2);
                const result1 = vectorSpace.add(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const result = vectorSpace.subtract(vec1, vec2);
                const result1 = vectorSpace.subtract(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR2D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, false);
                const scale = 2;
                const result = vectorSpace.scale(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR2D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, false);
                const scale = 0;
                const result = vectorSpace.scale(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(0);
                expect(result.coordinates[1]).to.eql(0);
            })

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with strictly positive weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });
            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with null weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 0;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with strictly positive weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false) as ProjectiveVector2D;
                const result = vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginery).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].value);
                expect(result.coordinates[1].imaginery).to.eql(vec1.coordinates[2].value);
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with null weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 0;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false) as ProjectiveVector2D;
                const result = vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginery).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(0, false));
                expect(result.coordinates[1].imaginery).to.eql(new Weight(0, false));
            });

            it(`can create a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3]) as ProjectiveVector2D;
                expect(result.type).to.eql(PROJECTIVEVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].value.weight).to.eql(3);
                expect(result.coordinates[2].value.strictlyPositive).to.eql(false);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 0]) as ProjectiveVector2D;
                expect(result.type).to.eql(PROJECTIVEVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].value.weight).to.eql(0);
                expect(result.coordinates[2].value.strictlyPositive).to.eql(false);
            });

        });

        describe(`ProjectiveVectorSpace3D with weight management ${WeightManagement.SomeNullWeights}`, () => {

            const vectorSpace = new ProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);

            it(`can add two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const result = vectorSpace.add(vec1, vec2);
                const result1 = vectorSpace.add(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(2);
                expect(result1.coordinates[1]).to.eql(0);
            });

            it(`can subtract two ${PROJECTIVEVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, false);
                const vec2 = vectorSpace.defaultVect();
                const vec3 = createTestVector(PROJECTIVEVECTOR2D, 0, false);
                const result = vectorSpace.subtract(vec1, vec2);
                const result1 = vectorSpace.subtract(vec1, vec3);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(0);

                expect(result1.coordinates[0]).to.eql(0);
                expect(result1.coordinates[1]).to.eql(0);
            })

            it(`can scale a ${PROJECTIVEVECTOR2D} vector with a strictly positive value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, true);
                const scale = 2;
                const result = vectorSpace.scale(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(2);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can scale a ${PROJECTIVEVECTOR2D} vector with a null value and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, 2, true);
                const scale = 0;
                const result = vectorSpace.scale(scale, vec1);
                // Check coordinates
                expect(result.coordinates[0]).to.eql(0);
                expect(result.coordinates[1]).to.eql(0);
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with strictly positive weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, true);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1 / weight);
                    expect(result.coordinates[1]).to.eql(0);
                }
            })

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with null weight into the Real vector space ${REALVECTOR2D}`, () => {
                const weight = 0;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false);
                const result = vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(1);
                    expect(result.coordinates[1]).to.eql(0);
                }
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with strictly positive weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 2;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, true) as ProjectiveVector2D;
                const result = vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginery).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(vec1.coordinates[2].value);
                expect(result.coordinates[1].imaginery).to.eql(vec1.coordinates[2].value);
            });

            it(`can generate the image of ${PROJECTIVEVECTOR2D} vector with null weight into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
                const weight = 0;
                const vec1 = createTestVector(PROJECTIVEVECTOR2D, weight, false) as ProjectiveVector2D;
                const result = vectorSpace.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.coordinates[0]);
                expect(result.coordinates[0].imaginery).to.eql(vec1.coordinates[1]);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(0, false));
                expect(result.coordinates[1].imaginery).to.eql(new Weight(0, false));
            });

            it(`can create a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and weight`, () => {
                const result = vectorSpace.createVector([1, 2, 3]) as ProjectiveVector2D;
                expect(result.type).to.eql(PROJECTIVEVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].value.weight).to.eql(3);
                expect(result.coordinates[2].value.strictlyPositive).to.eql(true);
            });

            it(`cannot creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and negative weight`, () => {
                expect(() => vectorSpace.createVector([1, 2, -3])).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            });

            it(`can creeate a ${PROJECTIVEVECTOR2D} vector with user-defined coordinates and null weight`, () => {
                const result = vectorSpace.createVector([1, 2, 0]) as ProjectiveVector2D;
                expect(result.type).to.eql(PROJECTIVEVECTOR2D);
                expect(result.coordinates[0]).to.eql(1);
                expect(result.coordinates[1]).to.eql(2);
                expect(result.coordinates[2].type).to.eql(WEIGHT);
                expect(result.coordinates[2].value.weight).to.eql(0);
                expect(result.coordinates[2].value.strictlyPositive).to.eql(false);
            });
        });
    });
});