import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../src/ErrorMessages/RealVectorSpace";
import { RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { isVector1D, isVector2D, isVector3D, isVector4D } from "../../src/mathVector/VectorSpaceUtilities";

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

        it('can get a default RealVector of dimension ' + MAX_DIMENSION_REALVECTORSPACE, () => {
            const realVectorSpace = new RealVectorSpace(MAX_DIMENSION_REALVECTORSPACE);
            const vec1: RealVector = realVectorSpace.defaultVect();
            const vec4D = isVector4D(vec1);
            expect(vec4D).to.eql(true);
            expect(vec1).to.eql({type: REALVECTOR4D, coordinates: [0, 0, 0, 0]});
        });
    });

});