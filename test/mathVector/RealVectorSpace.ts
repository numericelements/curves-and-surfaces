import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1, EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4, EM_REALVECTOR_DIMENSION_INCOMPATIBLE, EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE, EM_REALVECTOR_NOT_IN_VECTORSPACE, EM_REALVECTORS_DIFFERENT_DIM, EM_REALVECTORS_NOT_IN_VECTORSPACE, EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/RealVectorSpace";
import { Complex, COMPLEX, ComplexVector, ProjectiveVector, ProjectiveVector2D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D, WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";
import { Weight } from "../../src/mathVector/Weight";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";

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

        it('can check if two RealVectors are of same dimension 1D', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = 0;
            const vec2: RealVector1D = 1;
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors are of same dimension 2D', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors are of same dimension 3D', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE - 1);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 0, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check if two RealVectors are of same dimension 4D', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 1]};
            expect(realVectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it('can check that two RealVectors are not of same dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 0]};
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

        it('can check if a RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE + ' is in the RealVectorSpace of same dimension', () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector = realVectorSpace.defaultVect();
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it('can check if a RealVector of dimension 2 is in the RealVectorSpace of same dimension', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it('can check if a RealVector of dimension 3 is in the RealVectorSpace of same dimension', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true)
        });

        it('can check if a RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE + ' is in the RealVectorSpace of same dimension', () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            expect(realVectorSpace.isInVectorSpace(vec1)).to.eql(true)
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

        it('can add two RealVectors of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 1;
            const vec2 = 2;
            const vec3 = realVectorSpace.add(vec1, vec2);
            const vec1D = isVector1D(vec3);
            expect(vec1D).to.eql(true);
            expect(vec3).to.eql(vec1 + vec2);
        });

        it('can add two RealVectors of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            const vec3 = realVectorSpace.add(vec1, vec2);
            const vec2D = isVector2D(vec3);
            expect(vec2D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR2D, coordinates: [1, 1]});
        });

        it('can add two RealVectors of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const vec3 = realVectorSpace.add(vec1, vec2);
            const vec3D = isVector3D(vec3);
            expect(vec3D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR3D, coordinates: [1, 1, 0]});
        });

        it('can add two RealVectors of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 1]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            const vec3 = realVectorSpace.add(vec1, vec2);
            const vec4D = isVector4D(vec3);
            expect(vec4D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR4D, coordinates: [1, 1, 0, 2]});
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
            const vec3: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 1]};
            expect(() => realVectorSpace.add(vec1, vec3)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
            const vec4: RealVector1D = 0;
            expect(() => realVectorSpace.add(vec1, vec4)).to.throw(EM_REALVECTORS_DIFFERENT_DIM);
        });
        
        it('can scale a RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 1;
            const scaleFactor = 2;
            const vec2 = realVectorSpace.scale(vec1, scaleFactor);
            const vec1D = isVector1D(vec2);
            expect(vec1D).to.eql(true);
            expect(vec2).to.eql(vec1 * scaleFactor);
        });

        it('can scale a RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const scaleFactor = 2;
            const vec2 = realVectorSpace.scale(scaleFactor, vec1);
            const vec2D = isVector2D(vec2);
            expect(vec2D).to.eql(true);
            expect(vec2).to.eql({type: REALVECTOR2D, coordinates: [2, 0]});
        });

        it('can scale a RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 2, 3]};
            const scaleFactor = 2;
            const vec2 = realVectorSpace.scale(scaleFactor, vec1);
            const vec3D = isVector3D(vec2);
            expect(vec3D).to.eql(true);
            expect(vec2).to.eql({type: REALVECTOR3D, coordinates: [2, 4, 6]});
        });

        it('can scale a RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 2, 3, 4]};
            const scaleFactor = 2;
            const vec2 = realVectorSpace.scale(scaleFactor, vec1);
            const vec4D = isVector4D(vec2);
            expect(vec4D).to.eql(true);
            expect(vec2).to.eql({type: REALVECTOR4D, coordinates: [2, 4, 6, 8]});
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

        it('can subtract two RealVectors of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 1;
            const vec2 = 2;
            const vec3 = realVectorSpace.subtract(vec1, vec2);
            const vec1D = isVector1D(vec3);
            expect(vec1D).to.eql(true);
            expect(vec3).to.eql(vec1 - vec2);
        });

        it('can subtract two RealVectors of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            const vec3 = realVectorSpace.subtract(vec1, vec2);
            const vec2D = isVector2D(vec3);
            expect(vec2D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR2D, coordinates: [1, -1]});
        });
        it('can subtract two RealVectors of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 1]};
            const vec3 = realVectorSpace.subtract(vec1, vec2);
            const vec3D = isVector3D(vec3);
            expect(vec3D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR3D, coordinates: [1, -1, 0]});
        });

        it('can subtract two RealVectors of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 1, 1]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 1, 2]};
            const vec3 = realVectorSpace.subtract(vec1, vec2);
            const vec4D = isVector4D(vec3);
            expect(vec4D).to.eql(true);
            expect(vec3).to.eql({type: REALVECTOR4D, coordinates: [1, -1, 0, -1]});
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

        it('can clone a RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = 1;
            const vec2 = realVectorSpace.clone(vec1);
            const vec1D = isVector1D(vec2);
            expect(vec1D).to.eql(true);
            expect(vec2).to.eql(vec1);
        });

        it('can clone a RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2 = realVectorSpace.clone(vec1);
            const vec2D = isVector2D(vec2);
            expect(vec2D).to.eql(true);
            expect(vec2).to.eql(vec1);
        });

        it('can clone a RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec2 = realVectorSpace.clone(vec1);
            const vec3D = isVector3D(vec2);
            expect(vec3D).to.eql(true);
            expect(vec2).to.eql(vec1);
        });

        it('can clone a RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 1, 1]};
            const vec2 = realVectorSpace.clone(vec1);
            const vec4D = isVector4D(vec2);
            expect(vec4D).to.eql(true);
            expect(vec2).to.eql(vec1);
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

        it('can get the norm of a RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = -1;
            const norm = realVectorSpace.norm(vec1);
            expect(norm).to.eql(1);
        });

        it('can get the norm of a RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 1]};
            const norm = realVectorSpace.norm(vec1);
            expect(norm).to.eql(Math.sqrt(2));
        });
        it('can get the norm of a RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 1, 1]};
            const norm = realVectorSpace.norm(vec1);
            expect(norm).to.eql(Math.sqrt(3));
        });
        it('can get the norm of a RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 1, 1, 1]};
            const norm = realVectorSpace.norm(vec1);
            expect(norm).to.eql(2);
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

        it('can get the normalized vector of a RealVector of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector1D = -2;
            const norm = realVectorSpace.normalize(vec1);
            const vec1D = isVector1D(norm);
            expect(vec1D).to.eql(true);
            expect(norm).to.eql(-1);
        });

        it('can get the normalized vector of a RealVector of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 2]};
            const normalized = realVectorSpace.normalize(vec1);
            const vec2D = isVector2D(normalized);
            expect(vec2D).to.eql(true);
            expect(normalized).to.eql({type: REALVECTOR2D, coordinates: [1/realVectorSpace.norm(vec1), 2/realVectorSpace.norm(vec1)]});
        });

        it('can get the normalized vector of a RealVector of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 2, 3]};
            const normalized = realVectorSpace.normalize(vec1);
            const vec3D = isVector3D(normalized);
            expect(vec3D).to.eql(true);
            expect(normalized).to.eql({type: REALVECTOR3D, coordinates: [1/realVectorSpace.norm(vec1), 2/realVectorSpace.norm(vec1), 3/realVectorSpace.norm(vec1)]});
        });

        it('can get the normalized vector of a RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 2, 3, 4]};
            const normalized = realVectorSpace.normalize(vec1);
            const vec4D = isVector4D(normalized);
            expect(vec4D).to.eql(true);
            expect(normalized).to.eql({type: REALVECTOR4D, coordinates: [1/realVectorSpace.norm(vec1), 2/realVectorSpace.norm(vec1), 3/realVectorSpace.norm(vec1), 4/realVectorSpace.norm(vec1)]});
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

        it('can get the cross product of two RealVectors of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 0]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            const crossProduct = realVectorSpace.crossProduct(vec1, vec2);
            let vec1D = isVector1D(crossProduct);
            expect(vec1D).to.eql(true);
            expect(crossProduct).to.eql(1);

            const vec3: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 1]};
            const vec4: RealVector2D = {type: REALVECTOR2D, coordinates: [0, 1]};
            const crossProduct1 = realVectorSpace.crossProduct(vec3, vec4);
            vec1D = isVector1D(crossProduct1);
            expect(vec1D).to.eql(true);
            expect(crossProduct1).to.eql(Math.sqrt(2) * Math.sin(Math.PI/4));
        });

        it('can get the cross product of two RealVectors of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const crossProduct = realVectorSpace.crossProduct(vec1, vec2);
            let vec3D = isVector3D(crossProduct);
            expect(vec3D).to.eql(true);
            expect(crossProduct).to.eql({type: REALVECTOR3D, coordinates: [0, 0, 1]});

            const vec3: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 1, 0]};
            const vec4: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 0]};
            const crossProduct1 = realVectorSpace.crossProduct(vec3, vec4);
            vec3D = isVector3D(crossProduct1);
            expect(vec3D).to.eql(true);
            expect(crossProduct1).to.eql({type: REALVECTOR3D, coordinates: [0, 0, Math.sqrt(2) * Math.sin(Math.PI/4)]});

            const vec5: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 1, 1]};
            const vec6: RealVector3D = {type: REALVECTOR3D, coordinates: [0, 0, 1]};
            const crossProduct2 = realVectorSpace.crossProduct(vec5, vec6);
            vec3D = isVector3D(crossProduct2);
            expect(vec3D).to.eql(true);
            expect(crossProduct2).to.eql({type: REALVECTOR3D, coordinates: [Math.sqrt(2) * Math.sin(Math.PI/4), 0, 0]});

            const vec7: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 1]};
            const vec8: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 0, 0]};
            const crossProduct3 = realVectorSpace.crossProduct(vec7, vec8);
            vec3D = isVector3D(crossProduct3);
            expect(vec3D).to.eql(true);
            expect(crossProduct3).to.eql({type: REALVECTOR3D, coordinates: [0, Math.sqrt(2) * Math.sin(Math.PI/4), 0]});
        });

        it('cannot get the cross product of two RealVectors of dimension 4', () => {
            const realVectorSpace = new RealVectorSpace(4);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 0, 0, 0]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [0, 1, 0, 0]};
            let vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(() => realVectorSpace.crossProduct(vec1, vec2)).to.throw(EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
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

        it('can get the dot product of two RealVectors of dimension ' + MIN_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MIN_DIMENSION_REALVECTORSPACE);
            const vec1 = 1;
            const vec2 = 2;
            const vec1D = isVector1D(vec1);
            expect(vec1D).to.eql(true);
            const scalarProduct = realVectorSpace.dot(vec1, vec2);
            expect(scalarProduct).to.eql(2);
        });

        it('can get the dot product of two RealVectors of dimension 2', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [1, 2]};
            const vec2: RealVector2D = {type: REALVECTOR2D, coordinates: [3, 4]};
            const scalarProduct = realVectorSpace.dot(vec1, vec2);
            expect(scalarProduct).to.eql(11);
        });

        it('can get the dot product of two RealVectors of dimension 3', () => {
            const realVectorSpace = new RealVectorSpace(3);
            const vec1: RealVector3D = {type: REALVECTOR3D, coordinates: [1, 2, 3]};
            const vec2: RealVector3D = {type: REALVECTOR3D, coordinates: [4, 5, 6]};
            const scalarProduct = realVectorSpace.dot(vec1, vec2);
            expect(scalarProduct).to.eql(32);
        });

        it('can get the dot product of two RealVectors of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector4D = {type: REALVECTOR4D, coordinates: [1, 2, 3, 4]};
            const vec2: RealVector4D = {type: REALVECTOR4D, coordinates: [5, 6, 7, 8]};
            const scalarProduct = realVectorSpace.dot(vec1, vec2);
            expect(scalarProduct).to.eql(70);
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
        it('can transform a 2D RealVector into a ProjectiveRealVector with custom weight', () => {
            const realVectorSpace = new RealVectorSpace(2);
            const x = 1;
            const y = 2;
            const vec1: RealVector2D = {type: REALVECTOR2D, coordinates: [x, y]};
            const weight = new Weight(3);
            const vec2: ProjectiveVector = realVectorSpace.fromRealVectorSpaceToProjectiveVectorSpace(vec1, weight);
            expect(vec2.type).to.eql(PROJECTIVEVECTOR2D);
            expect(vec2.coordinates).to.eql([x * weight.weight, y * weight.weight, {type: WEIGHT, value: weight}]);
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
            expect(vec2).to.eql({type: COMPLEX, real: 1, imaginery: 2});
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
    });

});