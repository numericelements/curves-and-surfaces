import { expect } from "chai";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { ComplexVectorOfDimension } from "../../src/mathVector/conditionalTypes/VectorDescriptorTypes";
import { ComplexVector1D, ComplexVectorDesc } from "../../src/mathVector/utilityTypes/VectorDescriptorTypes";


export function createCommonComplexVectorSpaceTests<D extends 1 | 2>(
    createComplexVectorSpace: (dimension: D) => ComplexVectorSpace<D>,
    dimension: D
) {
    describe('Common ComplexVector Space Tests', () => {

        it(`can check if two ComplexVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const vec2 = createTestComplexVector(dimension);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a ComplexVector of type ${dimension} is in the ComplexVectorSpace of same dimension`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1: ComplexVectorDesc = createTestComplexVector(dimension);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it(`can add two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const vec2 = createTestComplexVector(dimension);
            const vec3 = vectorSpace.addDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can subtract two ComplexVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const vec2 = createTestComplexVector(dimension);
            const vec3 = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can scale a ComplexVector of dimension ${dimension} with a scalar and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can scale a ComplexVector of dimension ${dimension} with a complex and produce a vector in the same vector space`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const scaleComplex: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 3 };
            const vec2 = vectorSpace.scaleDescriptor(scaleComplex, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can clone a ComplexVector of dimension ${dimension}`, () => {
            const vectorSpace = createComplexVectorSpace(dimension);
            const vec1 = createTestComplexVector(dimension);
            const vec2 = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vec2).to.eql(vec1);
        });
    });
}

// Helper function to create test vectors
export function createTestComplexVector<D extends 1 | 2>(
    dimension: D, coordinates?: number[][]): ComplexVectorOfDimension<D>
{
    switch(dimension) {
        case 1 as D:
            return {
                type: COMPLEX,
                real: coordinates ? coordinates[0][0] : 0,
                imaginary: coordinates ? coordinates[0][1] : 1
            } as ComplexVectorOfDimension<D>;
        case 2 as D:
            return {
                type: COMPLEXVECTOR2D,
                coordinates: [ { type: COMPLEX, real: coordinates ? coordinates[0][0] : 0, imaginary: coordinates ? coordinates[0][1] : 1},
                { type: COMPLEX, real: coordinates ? coordinates[1][0] : 1, imaginary: coordinates ? coordinates[1][1] : 2} ]
            } as ComplexVectorOfDimension<D>;
        default:
            throw new Error(`Unsupported dimension: ${dimension}`);
    };
}