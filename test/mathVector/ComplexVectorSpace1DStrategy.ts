import { expect } from "chai";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { ComplexDesc, ComplexWeightDesc, ComplexVector2D } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { createTestComplexVector } from "./ComplexVectorSpaceTestFactory";
import { Weight } from "../../src/mathVector/Weight";
import { VectorSpaceIdentifierManager } from "../../src/mathVector/internal/VectorSpaceIdentifierManager";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXWEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, REALVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE } from "../../src/ErrorMessages/ComplexVectorSpace";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ComplexVector1D } from "../../src/mathVector/utilityTypes/VectorDescriptorTypes";


describe('ComplexVectorSpace1DStrategy', () => {
    
    describe('Methods', () => {

        describe(`ComplexVectorSpace1D `, () => {

            beforeEach(() => {
                // Reset the default vector space manager singleton before each test
                VectorSpaceIdentifierManager.reset();
            });

            const vectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vectorDim = 1;

            it(`can add two ${COMPLEX} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]);
                const vec2 = vectorSpace.defaultVect();
                const result = vectorSpace.addDescriptors(vec1, vec2);
                // Check coordinates
                expect(result.real).to.eql(2);
                expect(result.imaginary).to.eql(3);
            });

            it(`can subtract two ${COMPLEX} vectors and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]);
                const vec2 = createTestComplexVector(vectorDim, [[4, 5]]);
                const result = vectorSpace.subtractDescriptors(vec1, vec2);
                // Check coordinates
                expect(result.real).to.eql(-2);
                expect(result.imaginary).to.eql(-2);
            });

            it(`can scale a ${COMPLEX} vector with a scalar and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]);
                const scale = 2;
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.real).to.eql(4);
                expect(result.imaginary).to.eql(6);
            });

            it(`can scale a ${COMPLEX} vector with a complex and check the coordinates of the resulting vector`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]);
                const scale: ComplexDesc = { type: COMPLEX, real: 2, imaginary: 3 };
                const result = vectorSpace.scaleDescriptor(scale, vec1);
                // Check coordinates
                expect(result.real).to.eql(-5);
                expect(result.imaginary).to.eql(12);
            });

            it(`cannot get the norm a ComplexVector of dimension outside the current Complex vector space ${MIN_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Complex`, () => {
                const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
                const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 1}]};
                expect(() => complexVectorSpace.normDescriptor(vec1 as unknown as ComplexVector1D)).to.throw(EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE)
            });

            it(`can create a ${COMPLEX} vector with user-defined coordinates`, () => {
                const result = vectorSpace.createVector([[1, 2]]);
                expect(result.type).to.eql(COMPLEX);
                expect(result.real).to.eql(1);
                expect(result.imaginary).to.eql(2);
            });

            it(`can generate the image of ${COMPLEX} vector into the Real vector space ${REALVECTOR2D}`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]);
                const result = vectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1);
                expect(typeof result).to.not.eql('number');
                if(typeof result !== 'number') {
                    expect(result.type).to.eql(REALVECTOR2D);
                    expect(result.coordinates[0]).to.eql(2);
                    expect(result.coordinates[1]).to.eql(3);
                }
            });

            it(`can generate the image of ${COMPLEX} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D} with a default weight`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]) as ComplexVector1D;
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.real);
                expect(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(DEFAULT_WEIGHT_VALUE));
                expect(result.coordinates[1].imaginary).to.eql(new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
            });

            it(`can generate the image of ${COMPLEX} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D} with a user-defined weight`, () => {
                const weightReal = new Weight(2);
                const weightImaginary = new Weight(3);
                const cWeight: ComplexWeightDesc = { type: COMPLEXWEIGHT, real: weightReal, imaginary: weightImaginary };
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]) as ComplexVector1D;
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1, cWeight);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.real);
                expect(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(weightReal);
                expect(result.coordinates[1].real.strictlyPositive).to.eql(true);
                expect(result.coordinates[1].imaginary).to.eql(weightImaginary);
                expect(result.coordinates[1].imaginary.strictlyPositive).to.eql(true);
            });

            it(`can generate the image of ${COMPLEX} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D} with a null complex weight`, () => {
                const weightReal = new Weight(0, false);
                const weightImaginary = new Weight(0, false);
                const cWeight: ComplexWeightDesc = { type: COMPLEXWEIGHT, real: weightReal, imaginary: weightImaginary };
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]) as ComplexVector1D;
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1, cWeight);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.real);
                expect(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(weightReal);
                expect(result.coordinates[1].real.strictlyPositive).to.eql(false);
                expect(result.coordinates[1].imaginary).to.eql(weightImaginary);
                expect(result.coordinates[1].imaginary.strictlyPositive).to.eql(false);
            });

            it(`can generate the image of ${COMPLEX} vector into the projective Complex vector space ${PROJECTIVECOMPLEXVECTOR1D} with a default complex weight`, () => {
                const vec1 = createTestComplexVector(vectorDim, [[2, 3]]) as ComplexVector1D;
                const result = vectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1);
                expect(result.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
                expect(result.coordinates[0].type).to.eql(COMPLEX);
                expect(result.coordinates[0].real).to.eql(vec1.real);
                expect(result.coordinates[0].imaginary).to.eql(vec1.imaginary);
                expect(result.coordinates[1].type).to.eql(COMPLEXWEIGHT);
                expect(result.coordinates[1].real).to.eql(new Weight(DEFAULT_WEIGHT_VALUE));
                expect(result.coordinates[1].real.strictlyPositive).to.eql(true);
                expect(result.coordinates[1].imaginary).to.eql(new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
                expect(result.coordinates[1].imaginary.strictlyPositive).to.eql(false);
            });

        });
    });
});