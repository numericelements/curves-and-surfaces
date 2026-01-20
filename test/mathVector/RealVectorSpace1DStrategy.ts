import { expect } from "chai";
import { RealVectorSpace1DStrategy } from "../../src/mathVector/RealVectorSpace1DStrategy";
import { createTestRealVector } from "./RealVectorSpaceTestFactory";
import { RealVector2D, RealVector3D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D } from "../../src/mathVector/VectorSpaceUtilities";
import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE } from "../../src/ErrorMessages/RealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { REALVECTOR2D, REALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";

describe('RealVectorSpace1DStrategy', () => {
    
    describe('Methods', () => {

        const vectorSpace = new RealVectorSpace1DStrategy();
        const vectorType = 1;

        it('can check that two RealVectors are not of same dimension', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that a RealVector is not in the RealVectorSpace', () => {
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(false)
        });

        it(`can add two Real1D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const vec2 = createTestRealVector(vectorType, [2]);
            const result = vectorSpace.addDescriptors(vec1, vec2)
            // Check coordinates
            expect(result).to.eql(3);
        });

        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.addDescriptors(vec1, vec2 as unknown as number)).to.throw();
        });

        it('can scale a RealVector', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            const vec1D = isVector1D(vec2);
            expect(typeof vec2).to.eql('number');
            expect(vec1D).to.eql(true);
            expect(vec2).to.eql(scaleFactor);
        });

        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const scaleFactor = 2;
            expect(() => vectorSpace.scaleDescriptor(scaleFactor, vec1 as unknown as number)).to.throw();
        });

        it(`can subtract two Real1D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorType, [2]);
            const vec2 = createTestRealVector(vectorType, [1]);
            const result = vectorSpace.subtractDescriptors(vec1, vec2)
            // Check coordinates
            expect(result).to.eql(1);
        });

        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.subtractDescriptors(vec1, vec2 as unknown as number)).to.throw();
        });

        it('can clone a RealVector', () => {
            let vec1 = createTestRealVector(vectorType, [1]);
            const vec2 = vectorSpace.cloneVector(vec1);
            const vec1D = isVector1D(vec2);
            expect(typeof vec2).to.eql('number');
            expect(vec1D).to.eql(true);
            expect(vec2).to.eql(vec1);
            vec1 = 2;
            expect(vec2).to.not.eql(vec1);
        });

        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.cloneVector(vec1 as unknown as number)).to.throw();
        });

        it(`can get the norm of a RealVector`, () => {
            const vec1 = -1;
            const norm = vectorSpace.normDescriptor(vec1);
            expect(norm).to.eql(1);
        });

        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.normDescriptor(vec1 as unknown as number)).to.throw();
        });

        it('can get the normalized vector of a RealVector', () => {
            const vec1 = createTestRealVector(vectorType, [2]) as number;
            const normalized = vectorSpace.normalizeRaw(vec1);
            expect(normalized).to.eql(vec1 / vectorSpace.normDescriptor(vec1));
        });

        it('cannot normalize a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.normalizeRaw(vec1 as unknown as number)).to.throw();
        });

        it('cannot get the cross product of two RealVectors of dimension 1', () => {
            const vec1 = 0;
            const vec2 = 0;
            const vec1D = isVector1D(vec1);
            expect(vec1D).to.eql(true);
            expect(() => vectorSpace.crossProductRaw(vec1, vec2)).to.throw(EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        });

        it('can get the dot product of two RealVectors', () => {
            const vec1 = 1;
            const vec2 = 2;
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            expect(scalarProduct).to.eql(2);
        });

        it('cannot get the dot of two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.dotDescriptors(vec1, vec2 as unknown as number)).to.throw();
        });

        it('cannot transform a RealVector1D into a ProjectiveRealVector', () => {
            const vec1 = createTestRealVector(vectorType, [1]);
            const weight = new Weight(2);
            expect(() => vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });

        it('cannot transform a 1D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const vec1 = 1;
            expect(() => vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });

        it(`can create a RealVector of dimension 1 from a number`, () => {
            const vec = vectorSpace.createVector([1]);
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            expect(vec).to.eql(1);
        });
    });
});
