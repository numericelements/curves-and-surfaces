import { expect } from "chai";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { RealVectorOfDimension } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";


export function createCommonRealVectorSpaceTests<D extends 1 | 2 | 3 | 4>(
    createRealVectorSpace: (dimension: D) => RealVectorSpace<D>,
    dimension: D
) {
    describe('Common RealVector Space Tests', () => {

        it(`can check if two RealVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const vec2 = createTestRealVector(dimension);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a RealVector of type ${dimension} is in the RealVectorSpace of same dimension`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it(`can add two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const vec2 = createTestRealVector(dimension);
            const vec3 = vectorSpace.addDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can scale a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can subtract two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const vec2 = createTestRealVector(dimension);
            const vec3 = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can clone a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const vec2 = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vec2).to.eql(vec1);
        });

        it(`can get the norm of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const norm = vectorSpace.normDescriptor(vec1);
            expect(typeof norm).to.eql("number");
        });

        it(`can get the normalized vector of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const normalized = vectorSpace.normalizeDescriptor(vec1);
            expect(vectorSpace.isInVectorSpace(normalized)).to.eql(true);
        });

        it(`can get the dot product of two RealVectors of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace(dimension);
            const vec1 = createTestRealVector(dimension);
            const vec2 = createTestRealVector(dimension);
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            expect(typeof scalarProduct).to.eql("number");
        });
    });
}

// Helper function to create test vectors

export function createTestRealVector<D extends 1 | 2 | 3 | 4>(
    dimension:  D, coordinates?: number[]
): RealVectorOfDimension<D> {
    switch(dimension) {
        case 1 as D:
            return (coordinates ? coordinates[0] : 0) as RealVectorOfDimension<D>;
        case 2 as D:
            return {
                type: REALVECTOR2D,
                coordinates: coordinates ? [coordinates[0], coordinates[1]] : [1, 0]
            } as RealVectorOfDimension<D>;
        case 3:
            return {
                type: REALVECTOR3D, 
                coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2]] : [ 1, 2, 0]
            } as RealVectorOfDimension<D>;
        case 4:
            return {
                type: REALVECTOR4D,
                coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2], coordinates[3]] : [ 1, 2, 3, 0]
            } as RealVectorOfDimension<D>;
        default:
            throw new Error(`Unsupported dimension: ${dimension}`);
    }
}