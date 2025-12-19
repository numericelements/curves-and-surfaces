import { expect } from "chai";
import { ComplexVector, ComplexVector1D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D } from "../../src/namedConstants/VectorTypeTags";

export type vectorTypeComplex = typeof COMPLEX | typeof COMPLEXVECTOR2D;

export function createCommonComplexVectorSpaceTests(
    createComplexVectorSpace: () => ComplexVectorSpace,
    dimension: number,
    vectorType: vectorTypeComplex
) {
    describe('Common ComplexVector Space Tests', () => {

        it(`can check if two ComplexVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a ComplexVector of type ${vectorType} is in the ComplexVectorSpace of same dimension`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1: ComplexVector = createTestComplexVector(vectorType);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it(`can add two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            const vec3 = vectorSpace.addDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can subtract two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = createTestComplexVector(vectorType);
            const vec3 = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can scale a ComplexVector of dimension ${dimension} with a scalar and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can scale a ComplexVector of dimension ${dimension} with a complex and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const scaleComplex: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 3 };
            const vec2 = vectorSpace.scaleDescriptor(scaleComplex, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can clone a ComplexVector of dimension ${dimension}`, () => {
            const vectorSpace = createComplexVectorSpace();
            const vec1 = createTestComplexVector(vectorType);
            const vec2 = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vec2).to.eql(vec1);
        });
    });
}

// Helper function to create test vectors
export function createTestComplexVector(
    vectorType: vectorTypeComplex, coordinates?: number[][]): ComplexVector 
{
    if(vectorType === COMPLEX) {
        return {
            type: COMPLEX,
            real: coordinates ? coordinates[0][0] : 0,
            imaginary: coordinates ? coordinates[0][1] : 1
        };
    } else {
        return {
            type: COMPLEXVECTOR2D, 
            coordinates: [ { type: COMPLEX, real: coordinates ? coordinates[0][0] : 0, imaginary: coordinates ? coordinates[0][1] : 1},
            { type: COMPLEX, real: coordinates ? coordinates[1][0] : 1, imaginary: coordinates ? coordinates[1][1] : 2} ]
        };
    };
}