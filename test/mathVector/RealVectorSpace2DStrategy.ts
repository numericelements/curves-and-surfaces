import { expect } from "chai";
import { createTestRealVector, } from "./RealVectorSpaceTestFactory";
import { RealVectorSpace2DStrategy } from "../../src/mathVector/RealVectorSpace2DStrategy";
import { ComplexVector, ProjectiveVector, RealVector1D, RealVector2D, RealVector3D, RealVector4D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";
import { EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE } from "../../src/ErrorMessages/RealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { PROJECTIVEVECTOR2D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('RealVectorSpace2DStrategy', () => {
    
    describe('Methods', () => {

        const vectorSpace = new RealVectorSpace2DStrategy();
        const vectorDim = 2;

        it('can check that two RealVectors are not of same dimension', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1]);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that a RealVector is not in the RealVectorSpace', () => {
            const vec1 = 1;
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(false)
        });

        it(`can add two Real2D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1]);
            const vec2 = createTestRealVector(vectorDim, [2, -1]);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            expect(result.type).to.eql(REALVECTOR2D);
            // Check coordinates
            expect(result.coordinates).to.eql([3, 0]);
        });

        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1]);
            const vec2: RealVector1D = 0;
            expect(() => vectorSpace.addDescriptors(vec1, vec2 as unknown as RealVector2D)).to.throw();
        });

        it('can scale a RealVector', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1])
            const scaleFactor = 2;
            const vec2 = vectorSpace.scaleDescriptor(scaleFactor, vec1);
            const vec1D = isVector2D(vec2);
            expect(vec2.type).to.eql(REALVECTOR2D);
            expect(vec1D).to.eql(true);
            expect(vec2.coordinates).to.eql([scaleFactor, scaleFactor]);
        });

        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const scaleFactor = 2;
            expect(() => vectorSpace.scaleDescriptor(scaleFactor, vec1 as unknown as RealVector2D)).to.throw();
        });

        it(`can subtract two Real2D vectors and check the coordinates of the resulting vector`, () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1]);
            const vec2 = createTestRealVector(vectorDim, [2, -1]);
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(result.type).to.eql(REALVECTOR2D);
            // Check coordinates
            expect(result.coordinates).to.eql([-1, 2]);
        });

        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1]);
            const vec2: RealVector1D = 0;
            expect(() => vectorSpace.subtractDescriptors(vec1, vec2 as unknown as RealVector2D)).to.throw();
        });

        it('can clone a RealVector', () => {
            let vec1 = createTestRealVector(vectorDim, [1, 2]);
            const vec2 = vectorSpace.cloneVector(vec1);
            const vec = isVector2D(vec2);
            expect(vec2.type).to.eql(REALVECTOR2D);
            expect(vec).to.eql(true);
            expect(vec2).to.eql(vec1);
            vec1 = createTestRealVector(vectorDim, [0, 1]);
            expect(vec2).to.not.eql(vec1);
        });

        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.cloneVector(vec1 as unknown as RealVector2D)).to.throw();
        });

        it(`can get the norm of a RealVector`, () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2]);
            const norm = vectorSpace.normDescriptor(vec1);
            expect(norm).to.eql(Math.sqrt(5));
        });

        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const vec1 = 0;
            expect(() => vectorSpace.normDescriptor(vec1 as unknown as RealVector2D)).to.throw();
        });

        it('can get the normalized vector of a RealVector', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2]) as RealVector2D;
            const normalized = vectorSpace.normalizeDescriptor(vec1);
            expect(normalized.type).to.eql(REALVECTOR2D);
            expect(normalized.coordinates).to.eql([vec1.coordinates[0] / vectorSpace.normDescriptor(vec1), vec1.coordinates[1] / vectorSpace.normDescriptor(vec1)]);
        });

        it('cannot normalize a RealVector of dimension outside the current vector space dimension', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.normalizeDescriptor(vec1 as unknown as RealVector2D)).to.throw();
        });

        it('can get the cross product of two RealVectors of dimension 2', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 0])
            const vec2 = createTestRealVector(vectorDim, [0, 1])
            const crossProduct = vectorSpace.crossProductRaw(vec1, vec2);
            let vec = isVector1D(crossProduct);
            expect(vec).to.eql(true);
            expect(crossProduct).to.eql(1);

            const vec3 = createTestRealVector(vectorDim, [1, 1])
            const vec4 = vec2;
            const crossProduct1 = vectorSpace.crossProductRaw(vec3, vec4);
            vec = isVector1D(crossProduct1);
            expect(vec).to.eql(true);
            expect(crossProduct1).to.eql(Math.sqrt(2) * Math.sin(Math.PI/4));
        });

        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => vectorSpace.crossProductRaw(vec1 as unknown as RealVector2D, vec2 as unknown as RealVector2D)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 1])
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(() => vectorSpace.crossProductRaw(vec1, vec2 as unknown as RealVector2D)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('can get the dot product of two RealVectors of dimension 2', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const vec2 = createTestRealVector(vectorDim, [3, 4])
            const scalarProduct = vectorSpace.dotDescriptors(vec1, vec2);
            expect(scalarProduct).to.eql(11);
        });

        it('cannot get the dot of two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.dotDescriptors(vec1, vec2 as unknown as RealVector2D)).to.throw();
        });

        it('can transform a 2D RealVector into a ProjectiveRealVector with custom strictly positive weight', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const weight = new Weight(3);
            const vec2: ProjectiveVector = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR2D);
            expect(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, {type: WEIGHT, weight: weight}]);
        });

        it('can transform a 2D RealVector into a ProjectiveRealVector with custom positive weight', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const weight = new Weight(3, false);
            const vec2: ProjectiveVector = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR2D);
            expect(vec2.coordinates).to.eql([1 * weight.value, 2 * weight.value, {type: WEIGHT, weight: weight}]);
            expect(vec2.coordinates[2].weight.strictlyPositive).to.eql(false);
        });

        it('can transform a 2D RealVector into a ProjectiveRealVector with null weight', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const weight = new Weight(0, false);
            const vec2: ProjectiveVector = vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR2D);
            expect(vec2.coordinates).to.eql([1, 2, {type: WEIGHT, weight: weight}]);
        });

        it('cannot transform a RealVector out of the current vector space into a ProjectiveRealVector with custom weight', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const weight = new Weight(2);
            expect(() => vectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1 as unknown as RealVector2D, weight)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('can transform a 2D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const vec1 = createTestRealVector(vectorDim, [1, 2])
            const vec2: ComplexVector = vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1);
            expect(vec2.type).to.eql(COMPLEX);
            expect(vec2).to.eql({type: COMPLEX, real: 1, imaginary: 2});
        });

        it('cannot transform a RealVector out of the current vector space into a ComplexVector', () => {
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => vectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1 as unknown as RealVector2D)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });

        it(`can create a RealVector of dimension 2 from a number`, () => {
            const vec = vectorSpace.createVector([1, 2]);
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            expect(vec.type).to.eql(REALVECTOR2D);
            expect(vec.coordinates).to.eql([1, 2]);
        });
    });
});