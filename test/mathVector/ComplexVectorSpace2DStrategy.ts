import { expect } from "chai";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { IComplex } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { MAX_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { createTestComplexVector } from "./ComplexVectorSpaceTestFactory";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D } from "../../src/namedConstants/VectorTypeTags";


describe('ComplexVectorSpace2DStrategy', () => {
    
    describe('Methods', () => {

        describe(`ComplexVectorSpace2D `, () => {

            const vectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);

            it(`can add two ${COMPLEXVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addRaw(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(2);
                expect(result.coordinates[0].imaginary).to.eql(3);
                expect(result.coordinates[1].type).to.eql(COMPLEX);
                expect(result.coordinates[1].real).to.eql(4);
                expect(result.coordinates[1].imaginary).to.eql(5);
            });

            it(`can subtract two ${COMPLEXVECTOR2D} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const vec2 = createTestComplexVector(COMPLEXVECTOR2D, [[4, 5], [6, 7]]);
                const result = vectorSpace.subtractRaw(vec1, vec2);
                // Check coordinates
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(-2);
                expect(result.coordinates[0].imaginary).to.eql(-2);
                expect(result.coordinates[1].type).to.eql(COMPLEX);
                expect(result.coordinates[1].real).to.eql(-2);
                expect(result.coordinates[1].imaginary).to.eql(-2);
            });

            it(`can scale a ${COMPLEXVECTOR2D} vector with a scalar and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const scale = 2;
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.type).to.eql(COMPLEXVECTOR2D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(4);
                expect(result.coordinates[0].imaginary).to.eql(6);
                expect(result.coordinates[1].type).to.eql(COMPLEX);
                expect(result.coordinates[1].real).to.eql(8);
                expect(result.coordinates[1].imaginary).to.eql(10);
            });

            it(`can scale a ${COMPLEXVECTOR2D} vector with a complex and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(COMPLEXVECTOR2D, [[2, 3], [4, 5]]);
                const scale: IComplex = { type: COMPLEX, real: 2, imaginary: 3 };
                const result = vectorSpace.scaleRaw(scale, vec1);
                // Check coordinates
                expect(result.type).to.eql(COMPLEXVECTOR2D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(-5);
                expect(result.coordinates[0].imaginary).to.eql(12);
                expect(result.coordinates[1].type).to.eql(COMPLEX);
                expect(result.coordinates[1].real).to.eql(-7);
                expect(result.coordinates[1].imaginary).to.eql(22);
            });

            it(`can create a ${COMPLEXVECTOR2D} vector with user-defined coordinates`, () => {
                const result = vectorSpace.createVector([[1, 2], [3, 4]]);
                expect(result.type).to.eql(COMPLEXVECTOR2D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(1);
                expect(result.coordinates[0].imaginary).to.eql(2);
                expect(result.coordinates[1].type).to.eql(COMPLEX);
                expect(result.coordinates[1].real).to.eql(3);
                expect(result.coordinates[1].imaginary).to.eql(4);
            });

        });
    });
});