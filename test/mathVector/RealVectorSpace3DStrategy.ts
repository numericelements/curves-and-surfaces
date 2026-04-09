import { expect } from "chai";
import { createTestRealVector } from "./RealVectorSpaceTestFactory";
import { RealVector2D, RealVector3D, RealVector4D } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { RealVectorSpace3DStrategy } from "../../src/mathVector/RealVectorSpace3DStrategy";
import { isVector3D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";
import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../../src/ErrorMessages/RealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { ProjectiveRealVectorDesc } from "../../src/mathVector/utilityTypes/VectorDescriptorTypes";

describe('RealVectorSpace3DStrategy', () => {
    
    describe('Methods', () => {

        const vectorSpace = new RealVectorSpace3DStrategy();
        const vectorType = 3;

        it('can check that two RealVectors are not of same dimension', () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that a RealVector is not in the RealVectorSpace', () => {
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(false)
        });

        it(`can add two Real3D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const vec2 = createTestRealVector(vectorType, [2, -1, 1]);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            expect(result.type).to.eql(REALVECTOR3D);
            // Check coordinates
            expect(result.coordinates).to.eql([3, 0, 2]);
        });

        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            expect(() => vectorSpace.addDescriptors(vec1, vec2 as unknown as RealVector3D)).to.throw();
        });

        it('can scale a RealVector', () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            const vec1D = isVector3D(vec2);
            expect(vec2.type).to.eql(REALVECTOR3D);
            expect(vec1D).to.eql(true);
            expect(vec2.coordinates).to.eql([scaleFactor, scaleFactor, scaleFactor]);
        });

        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            const scaleFactor = 2;
            expect(() => vectorSpace.scaleDescriptor(scaleFactor, vec1 as unknown as RealVector3D)).to.throw();
        });

        it(`can subtract two Real3D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const vec2 = createTestRealVector(vectorType, [2, -1, 1]);
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(result.type).to.eql(REALVECTOR3D);
            // Check coordinates
            expect(result.coordinates).to.eql([-1, 2, 0]);
        });

        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1, 1, 1]);
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            expect(() => vectorSpace.subtractDescriptors(vec1, vec2 as unknown as RealVector3D)).to.throw();
        });

        it('can clone a RealVector', () => {
            let vec1 = createTestRealVector(vectorType, [1, 2, 3]);
            const vec2 = vectorSpace.cloneVector(vec1);
            const vec = isVector3D(vec2);
            expect(vec2.type).to.eql(REALVECTOR3D);
            expect(vec).to.eql(true);
            expect(vec2).to.eql(vec1);
            vec1 = createTestRealVector(vectorType, [0, 1, 2]);
            expect(vec2).to.not.eql(vec1);
        });

        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            expect(() => vectorSpace.cloneVector(vec1 as unknown as RealVector3D)).to.throw();
        });

        it(`can get the norm of a RealVector`, () => {
            const vec1 = createTestRealVector(vectorType, [1, 2, 3]);
            const norm = vectorSpace.normDescriptor(vec1);
            expect(norm).to.eql(Math.sqrt(14));
        });

        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = 0;
            expect(() => vectorSpace.normDescriptor(vec1 as unknown as RealVector3D)).to.throw();
        });

        it('can get the normalized vector of a RealVector', () => {
            const vec1 = createTestRealVector(vectorType, [1, 2, 3]) as RealVector3D;
            const normalized = vectorSpace.normalizeDescriptor(vec1);
            const vec = isVector3D(normalized);
            expect(normalized.type).to.eql(REALVECTOR3D);
            expect(vec).to.eql(true);
            expect(normalized.coordinates).to.eql([vec1.coordinates[0] / vectorSpace.normDescriptor(vec1), vec1.coordinates[1] / vectorSpace.normDescriptor(vec1), vec1.coordinates[2] / vectorSpace.normDescriptor(vec1)]);
        });

        it('cannot normalize a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            expect(() => vectorSpace.normalizeDescriptor(vec1 as unknown as RealVector3D)).to.throw();
        });

        it('can get the cross product of two RealVectors of dimension 3', () => {
            const vec1 = createTestRealVector(vectorType, [1, 0, 0]);
            const vec2 = createTestRealVector(vectorType, [0, 1, 0]);
            const crossProduct = vectorSpace.crossProductRaw(vec1, vec2);
            let vec3D = isVector3D(crossProduct);
            expect(vec3D).to.eql(true);
            expect(crossProduct).to.eql({type: REALVECTOR3D, coordinates: [0, 0, 1]});

            const vec3 = createTestRealVector(vectorType, [1, 1, 0]);
            const vec4 = createTestRealVector(vectorType, [0, 1, 0]);
            const crossProduct1 = vectorSpace.crossProductRaw(vec3, vec4);
            vec3D = isVector3D(crossProduct1);
            expect(vec3D).to.eql(true);
            expect(crossProduct1).to.eql({type: REALVECTOR3D, coordinates: [0, 0, Math.sqrt(2) * Math.sin(Math.PI/4)]});

            const vec5 = createTestRealVector(vectorType, [0, 1, 1]);
            const vec6 = createTestRealVector(vectorType, [0, 0, 1]);
            const crossProduct2 = vectorSpace.crossProductRaw(vec5, vec6);
            vec3D = isVector3D(crossProduct2);
            expect(vec3D).to.eql(true);
            expect(crossProduct2).to.eql({type: REALVECTOR3D, coordinates: [Math.sqrt(2) * Math.sin(Math.PI/4), 0, 0]});

            const vec7 = createTestRealVector(vectorType, [1, 0, 1]);
            const vec8 = createTestRealVector(vectorType, [1, 0, 0]);
            const crossProduct3 = vectorSpace.crossProductRaw(vec7, vec8);
            vec3D = isVector3D(crossProduct3);
            expect(vec3D).to.eql(true);
            expect(crossProduct3).to.eql({type: REALVECTOR3D, coordinates: [0, Math.sqrt(2) * Math.sin(Math.PI/4), 0]});
        });

        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => vectorSpace.crossProductRaw(vec1 as unknown as RealVector3D, vec2 as unknown as RealVector3D)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const vec1 = createTestRealVector(vectorType, [1, 1])
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            expect(() => vectorSpace.crossProductRaw(vec1, vec2 as unknown as RealVector3D)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('can get the dot product of two RealVectors of dimension 3', () => {
            const vec1 = createTestRealVector(vectorType, [1, 2, 3])
            const vec2 = createTestRealVector(vectorType, [4, 5, 6])
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            expect(scalarProduct).to.eql(32);
        });

        it('cannot get the dot of two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorType, [1, 2, 3])
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            expect(() => vectorSpace.dotDescriptors(vec1, vec2 as unknown as RealVector3D)).to.throw();
        });

            it('can transform a 3D RealVector into a ProjectiveRealVector with custom strictly positive weight', () => {
                const vec1 = createTestRealVector(vectorType, [1, 2, 3])
                const weight = new Weight(3);
                const vec2: ProjectiveRealVectorDesc = vectorSpace.fromRealVectorSpaceToProjectiveRealVectorSpace(vec1, weight);
                expect(vec2.type).to.eql(PROJECTIVEREALVECTOR3D);
                expect(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, 3 * weight.value, {type: WEIGHT, weight: weight}]);
            });
    
            it('can transform a 3D RealVector into a ProjectiveRealVector with custom positive weight', () => {
                const vec1 = createTestRealVector(vectorType, [1, 2, 1])
                const weight = new Weight(3, false);
                const vec2: ProjectiveRealVectorDesc = vectorSpace.fromRealVectorSpaceToProjectiveRealVectorSpace(vec1, weight);
                expect(vec2.type).to.eql(PROJECTIVEREALVECTOR3D);
                expect(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, 1 * weight.value, {type: WEIGHT, weight: weight}]);
                expect(vec2.coordinates[3].weight.strictlyPositive).to.eql(false);
            });
    
            it('can transform a 3D RealVector into a ProjectiveRealVector with null weight', () => {
                const vec1 = createTestRealVector(vectorType, [1, 2, 3])
                const weight = new Weight(0, false);
                const vec2: ProjectiveRealVectorDesc = vectorSpace.fromRealVectorSpaceToProjectiveRealVectorSpace(vec1, weight);
                expect(vec2.type).to.eql(PROJECTIVEREALVECTOR3D);
                expect(vec2.coordinates).to.eql([1, 2, 3, {type: WEIGHT, weight: weight}]);
            });
    
            it('cannot transform a RealVector out of the current vector space into a ProjectiveRealVector with custom weight', () => {
                const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
                const weight = new Weight(2);
                expect(() => vectorSpace.fromRealVectorSpaceToProjectiveRealVectorSpace(vec1 as unknown as RealVector3D, weight)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            });

            it('cannot transform a 3D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
                const vec1 = createTestRealVector(vectorType, [1, 2, 3])
                expect(() => vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
            });

            it(`can create a RealVector of dimension 3 from a number`, () => {
                const vec = vectorSpace.createVector([1, 2, 3]);
                expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
                expect(vec.type).to.eql(REALVECTOR3D);
                expect(vec.coordinates).to.eql([1, 2, 3]);
            });
    });
});