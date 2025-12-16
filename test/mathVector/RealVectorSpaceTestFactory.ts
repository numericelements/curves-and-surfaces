import { expect } from "chai";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { RealVector, RealVector2D, RealVector3D, RealVector4D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";


export type vectorTypeReal = 'number' | typeof REALVECTOR2D | typeof REALVECTOR3D | typeof REALVECTOR4D;

export function createCommonRealVectorSpaceTests(
    createRealVectorSpace: (weightManagement?: WeightManagement) => RealVectorSpace,
    dimension: number,
    vectorType: vectorTypeReal
) {
    describe('Common RealVector Space Tests', () => {

        it(`can check if two RealVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a RealVector of type ${vectorType} is in the RealVectorSpace of same dimension`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1: RealVector = createTestRealVector(vectorType);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it(`can add two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const vec3 = vectorSpace.addRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can scale a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleRaw(scaleFactor, vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        });

        it(`can subtract two RealVectors of dimension ${dimension} and produce a vector in the same vector space`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const vec3 = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(vec3)).to.eql(true);
        });

        it(`can clone a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = vectorSpace.cloneRaw(vec1);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vec2).to.eql(vec1);
        });

        it(`can get the norm of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const norm = vectorSpace.normRaw(vec1);
            expect(typeof norm).to.eql("number");
        });

        it(`can get the normalized vector of a RealVector of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const normalized = vectorSpace.normalizeRaw(vec1);
            expect(vectorSpace.isInVectorSpace(normalized)).to.eql(true);
        });

        it(`can get the dot product of two RealVectors of dimension ${dimension}`, () => {
            const vectorSpace = createRealVectorSpace();
            const vec1 = createTestRealVector(vectorType);
            const vec2 = createTestRealVector(vectorType);
            const scalarProduct = vectorSpace.dotRaw(vec1, vec2);
            expect(typeof scalarProduct).to.eql("number");
        });
    });
}

// Helper function to create test vectors
export function createTestRealVector(
    vectorType: vectorTypeReal, coordinates?: number[]
): RealVector {
    if(vectorType === 'number') {
        return coordinates ? coordinates[0] : 0;
    }
    if (vectorType === REALVECTOR2D) {
        return {
            type: REALVECTOR2D, 
            coordinates: coordinates ? [coordinates[0], coordinates[1]] : [1, 0]
        } as RealVector2D;
    } else if (vectorType === REALVECTOR3D) {
        return {
            type: REALVECTOR3D, 
            coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2]] : [ 1, 2, 0]
        } as RealVector3D;
    } else {
        return {
            type: REALVECTOR4D,
            coordinates: coordinates ? [coordinates[0], coordinates[1], coordinates[2], coordinates[3]] : [ 1, 2, 3, 0]
        } as RealVector4D;
    }
}