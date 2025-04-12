import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/RealVectorSpace";
import { COMPLEX, ComplexVector, ProjectiveVector, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";
import { Weight } from "../../src/mathVector/Weight";
import { createCommonRealVectorSpaceTests } from "./RealVectorSpaceTestFactory";

describe('RealVectorSpace', () => {

    describe('Constructor', () => {
        it('can generate a valid RealVectorSpace dimension between ' + MIN_DIMENSION_REALVECTORSPACE + ' and ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            expect(() => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE)).to.not.throw()
            expect(() => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE)).to.not.throw()
        });

        it('cannot generate an invalid RealVectorSpace outside dimension range', () => {
            expect(() => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw(EM_REALVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw(EM_REALVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a valid RealVectorSpace and get its dimension', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE + 1);
            expect(realVectorSpace.dimension()).to.eql(MIN_DIMENSION_REALVECTORSPACE + 1)
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
                (weightManagement) => new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE),
                MIN_DIMENSION_REALVECTORSPACE,
                'number'
            );
        });

        // 2D RealVector Space Tests
        describe('2D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                (weightManagement) => new RealVectorSpace(2),
                2,
                REALVECTOR2D
            );
        });

        // 3D RealVector Space Tests
        describe('3D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                (weightManagement) => new RealVectorSpace(3),
                3,
                REALVECTOR3D
            );
        });

        // 4D RealVector Space Tests
        describe('4D Vector Space', () => {
            createCommonRealVectorSpaceTests(
                (weightManagement) => new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE),
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

        it('can check if two RealVectors of different coordinatesare of same dimension 3D', () => {
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

        it('can get a default RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
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
            expect(() => realVectorSpace.add(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.add(vec1, vec3)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot add two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.add(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });
    
        it('cannot scale a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            const scaleFactor = 2;
            expect(() => realVectorSpace.scale(scaleFactor, vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.scale(scaleFactor, vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.scale(scaleFactor, vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot subtract two RealVectors of dimensions outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.subtract(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.subtract(vec1, vec3)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot subtract two RealVectors of different dimensions. Only one vector belongs to the current vector space.', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.subtract(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.subtract(vec1, vec3)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec4: RealVector1D = 0;
            expect(() => realVectorSpace.subtract(vec1, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot clone a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.clone(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.clone(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.clone(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the norm of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.norm(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.norm(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.norm(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the normalized vector of a RealVector of dimension outside the current vector space dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1 = 0;
            expect(() => realVectorSpace.normalize(vec1)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.normalize(vec2)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.normalize(vec3)).to.throw(EM_REALVECTOR_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 0;
            const vec2 = 0;
            const vec1D = isVector1D(vec1);
            expect(vec1D).to.eql(true);
            expect(() => realVectorSpace.crossProduct(vec1, vec2)).to.throw(EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        });

        it('cannot get the cross product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => realVectorSpace.crossProduct(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec4: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.crossProduct(vec3, vec4)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5: RealVector1D = 1;
            const vec6: RealVector1D = 0;
            expect(() => realVectorSpace.crossProduct(vec5, vec6)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
        });

        it('cannot get the cross product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(() => realVectorSpace.crossProduct(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec4: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProduct(vec3, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec5: RealVector1D = 1;
            const vec6: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProduct(vec5, vec6)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec7: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec8: RealVector1D = 1;
            expect(() => realVectorSpace.crossProduct(vec7, vec8)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec9: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec10: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(() => realVectorSpace.crossProduct(vec9, vec10)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot get the dot product of two RealVectors of different dimensions', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec4: RealVector1D = 1;
            expect(() => realVectorSpace.dot(vec1, vec2)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dot(vec2, vec1)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dot(vec1, vec3)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            expect(() => realVectorSpace.dot(vec1, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });

        it('cannot get the dot product of two RealVectors of dimension outside of RealVectorSpace dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => realVectorSpace.dot(vec1, vec2)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec4: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            expect(() => realVectorSpace.dot(vec3, vec4)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
            const vec5: RealVector1D = 1;
            const vec6: RealVector1D = 0;
            expect(() => realVectorSpace.dot(vec5, vec6)).to.throw(EM_REALVECTORS_NOT_IN_VECTORSPACE);
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