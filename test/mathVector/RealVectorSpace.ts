import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/RealVectorSpace";
import { COMPLEX, ComplexVector, ProjectiveVector, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonRealVectorSpaceTests } from "./RealVectorSpaceTestFactory";
import { REAL_VECTOR_SPACE_NAME } from "../../src/namedConstants/VectorSpaceResolvers";
import { DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../src/namedConstants/DefaultVectorSpaces";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED } from "../../src/ErrorMessages/DefaultSpaceResolvers";
import { DEFAULT, VECTOR_SPACE } from "../../src/namedConstants/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";

describe('RealVectorSpace', () => {

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {

        it('can generate a RealVectorSpace dimension between ' + MIN_DIMENSION_REALVECTORSPACE + ' and ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            expect(() => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE)).to.not.throw()
            expect(() => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a RealVectorSpace outside dimension range', () => {
            expect(() => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw(EM_REALVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw(EM_REALVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a RealVectorSpace and get its dimension', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE + 1);
            expect(realVectorSpace.dimension()).to.eql(MIN_DIMENSION_REALVECTORSPACE + 1)
        });

        it(`can check that a user specific Real vector space has a default name containing ${REAL_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            expect(vectorSpace.isDefault).to.eql(false);
            expect(vectorSpace.name.includes(DEFAULT)).to.eql(false);
        });

        it(`can check that a default Real vector space has a default name containing ${DEFAULT_REAL_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE, true);
            expect(vectorSpace.isDefault).to.eql(true);
            expect(vectorSpace.name.includes(DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true);
        });

        it('can generate a RealVectorSpace specifying its dimension only. The resulting vector space is a user-specific vector space', () => {
            for(let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace(i);
                expect(realVectorSpace.dimension()).to.eql(i);
                expect(realVectorSpace.isDefault).to.eql(false);
                expect(realVectorSpace.name.includes(REAL_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });

        it('can generate a default RealVectorSpace for any valid space dimension', () => {
            for(let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace(i, true);
                expect(realVectorSpace.dimension()).to.eql(i);
                expect(realVectorSpace.isDefault).to.eql(true);
                expect(realVectorSpace.name.includes(DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });

        it('cannot generate more than one default RealVectorSpace of a given dimension', () => {
            for(let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
                const realVectorSpace = new RealVectorSpace(i, true);
                expect(realVectorSpace.dimension()).to.eql(i);
                expect(realVectorSpace.isDefault).to.eql(true);
                expect(() => new RealVectorSpace(i, true)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });
    });

    describe('Accesssors', () => {

        it(`can get the identifier of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1);
            expect(realVectorSpace.id.includes(VECTOR_SPACE)).to.eql(true)
        });

        it(`can get the identifier of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1, true);
            expect(realVectorSpace.id.includes(DEFAULT)).to.eql(true)
        });

        it(`can get the default name of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            expect(realVectorSpace.name.includes(REAL_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the default name of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1, true);
            expect(realVectorSpace.name.includes(DEFAULT_REAL_VECTOR_SPACE_NAME)).to.eql(true)
        });

        it(`can get the status of a user-defined RealVectorSpace as not being default`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1);
            expect(realVectorSpace.isDefault).to.eql(false)
        });

        it(`can get the status of a default RealVectorSpace as being default`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1, true);
            expect(realVectorSpace.isDefault).to.eql(true)
        });

        it(`can get the vector space type of a user-defined RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
        });

        it(`can get the vector space type of a default RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE, true);
            expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
        });
    });

    describe('Methods', () => {
        it('can get the dimension of a RealVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1);
            expect(realVectorSpace.dimension()).to.eql(MAX_DIMENSION_REALVECTORSPACE - 1)
        });

        // 1D RealVector Space Tests
        describe('1D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                () => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE),
                MIN_DIMENSION_REALVECTORSPACE,
                'number'
            );
        });

        // 2D RealVector Space Tests
        describe('2D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                () => new RealVectorSpace(2),
                2,
                REALVECTOR2D
            );
        });

        // 3D RealVector Space Tests
        describe('3D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                () => new RealVectorSpace(3),
                3,
                REALVECTOR3D
            );
        });

        // 4D RealVector Space Tests
        describe('4D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                () => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE),
                MAX_DIMENSION_REALVECTORSPACE,
                REALVECTOR4D
            );
        });

        it('can check if two RealVectors of different coordinates are of same dimension 1D', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = 0;
            const vec2: RealVector1D = 1;
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors of different coordinates are of same dimension 2D', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors of different coordinates are of same dimension 3D', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors of different coordinates are of same dimension 4D', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 1]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check that two RealVectors of same dimension but not in the current RealVectorSpace are not declared as such', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can get a default RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector = realVectorSpace.defaultVect();
            const vec1D = isVector1D(vec1);
            expect(vec1D).to.eql(true);
            expect(vec1).to.eql(0);
        });

        it('can get a default RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector = realVectorSpace.defaultVect();
            const vec2D = isVector2D(vec1);
            expect(vec2D).to.eql(true);
            expect(vec1).to.eql({type: REALVECTOR2D, coordinates: [0, 0]});
        });

        it('can get a default RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector = realVectorSpace.defaultVect();
            const vec3D = isVector3D(vec1);
            expect(vec3D).to.eql(true);
            expect(vec1).to.eql({type: REALVECTOR3D, coordinates: [0, 0, 0]});
        });

        it('can get a default RealVector of dimension 4' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector = realVectorSpace.defaultVect();
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(vec1).to.eql({type: REALVECTOR4D, coordinates: [0, 0, 0, 0]});
        });

        it('can check if a RealVector of dimension 2 is not in the RealVectorSpace of different dimension', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(false)
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(false)
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec3)).to.eql(false)
        });

        it('can check if a RealVector of dimension 3 is not in the RealVectorSpace of different dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec: RealVector1D = 0;
            expect(realVectorSpace.isInVectorSpace(vec)).to.eql(false)
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(false)
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec2)).to.eql(false)
        });

        it('cannot add two RealVectors of dimensions outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.addRaw(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.addRaw(vec1, vec3)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.addRaw(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });
    
        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            const scaleFactor = 2;
            expect(() => realVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.scaleRaw(scaleFactor, vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.scaleRaw(scaleFactor, vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot subtract two RealVectors of dimensions outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.subtractRaw(vec1, vec3)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.subtractRaw(vec1, vec3)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec4: RealVector1D = 0;
            expect(() => realVectorSpace.subtractRaw(vec1, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.cloneRaw(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.cloneRaw(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.cloneRaw(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.normRaw(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.normRaw(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.normRaw(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the normalized vector of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.normalizeRaw(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.normalizeRaw(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.normalizeRaw(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 0;
            const vec2 = 0;
            const vec1D = isVector1D(vec1);
            expect(vec1D).to.eql(true);
            expect(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        });

        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec4: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.crossProductRaw(vec3, vec4)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5: RealVector1D = 1;
            const vec6: RealVector1D = 0;
            expect(() => realVectorSpace.crossProductRaw(vec5, vec6)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(() => realVectorSpace.crossProductRaw(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec4: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProductRaw(vec3, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec5: RealVector1D = 1;
            const vec6: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProductRaw(vec5, vec6)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec7: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec8: RealVector1D = 1;
            expect(() => realVectorSpace.crossProductRaw(vec7, vec8)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec9: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec10: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProductRaw(vec9, vec10)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot get the dot product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec4: RealVector1D = 1;
            expect(() => realVectorSpace.dotRaw(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dotRaw(vec2, vec1)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dotRaw(vec1, vec3)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dotRaw(vec1, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot get the dot product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => realVectorSpace.dotRaw(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec4: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.dotRaw(vec3, vec4)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5: RealVector1D = 1;
            const vec6: RealVector1D = 0;
            expect(() => realVectorSpace.dotRaw(vec5, vec6)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('can transform a 2D RealVector into a ProjectiveRealVector with default weight', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 2]};
            const vec2: ProjectiveVector = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR2D);
            expect(vec2.coordinates).to.eql([1, 2, {type: WEIGHT, value: new Weight(1)}]);
        });

        it('can transform a 3D RealVector into a ProjectiveRealVector with default weight', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 2, 3]};
            const vec2: ProjectiveVector = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR3D);
            expect(vec2.coordinates).to.eql([1, 2, 3, {type: WEIGHT, value: new Weight(1)}]);
        });

        it('can transform a 3D RealVector into a ProjectiveRealVector with custom weight', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const x = 1;
            const y = 2;
            const z = 3;
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [x, y, z]};
            const weight = new Weight(3);
            const vec2: ProjectiveVector = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR3D);
            expect(vec2.coordinates).to.eql([x * weight.weight, y * weight.weight, z * weight.weight, {type: WEIGHT, value: weight}]);
        });

        it('cannot transform a 1D RealVector into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = 1;
            expect(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });

        it('cannot transform a 4D RealVector into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 2, 3, 4]};
            expect(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        });

        it('cannot transform a RealVector of dimension outside of RealVectorSpace dimension into a ProjectiveRealVector', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec3D = isVector3D(vec3);
            expect(vec3D).to.eql(true);
            expect(() => realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);

            const realVectorSpace2 = new RealVectorSpace(3);
            const vec4: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2D = isVector2D(vec4);
            expect(vec2D).to.eql(true);
            expect(() => realVectorSpace2.fromRealVectorSpaceToProjectiveVectorSpace(vec4)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('can transform a 2D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 2]};
            const vec2: ComplexVector = realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1);
            expect(vec2.type).to.eql(COMPLEX);
            expect(vec2).to.eql({type: COMPLEX, real: 1, imaginary: 2});
        });

        it('cannot transform a 1D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace(1);
            const vec1: RealVector1D = 1;
            expect(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });

        it('cannot transform a 3D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 2, 3]};
            expect(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });

        it('cannot transform a 4D RealVector into a ComplexVector in a ComplexVectorSpace', () => {
            const realVectorSpace = new RealVectorSpace(4);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 2, 3, 4]};
            expect(() => realVectorSpace.fromRealVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        });

        it(`can create a RealVector when the number of coordinates is not equal to the dimension of the RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(4);
            const vec1 = realVectorSpace.createVector([1, 2, 3, 0]) as RealVector4D;
            expect(vec1.type).to.eql(REALVECTOR4D);
            expect(vec1.coordinates).to.eql([1, 2, 3, 0]);
        });

        it(`cannot create a RealVector when the number of coordinates is not equal to the dimension of the RealVectorSpace`, () => {
            const realVectorSpace = new RealVectorSpace(4);
            expect(() => realVectorSpace.createVector([1, 2, 3])).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });
    });

});