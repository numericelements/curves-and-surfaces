import { expect } from "chai";
import { createVectorCollection1D, VectorDescriptorCollection1D } from "../../src/mathVector/VectorDescriptorCollection1D";
import { INVALID_VS_DIMENSION, VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR1D, COMPLEXVECTOR2D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR1D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, UNDEFINED_VECTORTYPE } from "../../src/namedConstants/VectorTypeTags";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('VectorCollection1D', () => {

    describe('Constructor', () => {
        it('can generate a valid VectorCollection1D without input data', () => {
            expect(() => new VectorDescriptorCollection1D()).to.not.throw()
        });

        it('generates a valid VectorCollection1D with a null length array without input data', () => {
            const vectorCollection = new VectorDescriptorCollection1D();
            expect(vectorCollection.length).to.eql(0);
        });

        it(`generates a valid VectorCollection1D without input data. Corresponding vector space dimension is invalid and vector space type is UNKNOWN_VECTORSPACE and vector type is ${UNDEFINED_VECTORTYPE}`, () => {
            const vectorCollection = new VectorDescriptorCollection1D();
            expect(vectorCollection.spaceDimension).to.eql(INVALID_VS_DIMENSION);
            expect(vectorCollection.type).to.eql(UNDEFINED_VECTORTYPE);
            expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.UNKNOWN_VECTORSPACE);
        });

        it(`generates a valid VectorCollection1D without input data. Corresponding vector collection has null length`, () => {
            const vectorCollection = new VectorDescriptorCollection1D();
            expect(vectorCollection.vectorCollection).to.eql([]);
            expect(vectorCollection.length).to.eql(0);
        });

        it('can generate a valid VectorCollection1D with an input array of null length', () => {
            expect(() => new VectorDescriptorCollection1D([])).to.not.throw()
        });

        it('generates a valid VectorCollection1D with a null length array with a null length array as input', () => {
            const vectorCollection = new VectorDescriptorCollection1D([]);
            expect(vectorCollection.length).to.eql(0);
        });

        it(`generates a valid VectorCollection1D with a null length array as input. Corresponding vector space dimension is invalid and vector space type is UNKNOWN_VECTORSPACE and vector type is ${UNDEFINED_VECTORTYPE}`, () => {
            const vectorCollection = new VectorDescriptorCollection1D([]);
            expect(vectorCollection.spaceDimension).to.eql(INVALID_VS_DIMENSION);
            expect(vectorCollection.type).to.eql(UNDEFINED_VECTORTYPE);
            expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.UNKNOWN_VECTORSPACE);
        });

        it(`generates a valid VectorCollection1D with a null length array as input. Corresponding vector collection has null length`, () => {
            const vectorCollection = new VectorDescriptorCollection1D([]);
            expect(vectorCollection.vectorCollection).to.eql([]);
            expect(vectorCollection.length).to.eql(0);
        });

        describe('Real vector space', () => {

            it('can generate a valid VectorCollection1D with an input array of length 1. Use type assertion to fix typescript limitation with type inferencing for number[]', () => {
                const vectorCollection = new VectorDescriptorCollection1D([1.5] as number[]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR1D);
                expect(vectorCollection.vectorCollection).to.eql([1.5]);
            });

            it(`can generate a valid VectorCollection1D with an input array of length greater than one that defauts to ${REALVECTOR1D} type collection. Consistent type inference is achieved`, () => {
                const vectors = [1, 2, 1.5];
                const vectorCollection = new VectorDescriptorCollection1D(vectors);
                expect(vectorCollection.length).to.eql(3);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR1D);
                expect(typeof vectorCollection.vectorCollection[0]).to.eql('number');
                let i = 0;
                for (const vec of vectors) {
                    expect(vectorCollection.vectorCollection[i]).to.eql(vec);
                    i++;
                }
            });

            it(`can generate a valid VectorCollection1D with an input array of length greater than one that defauts to ${REALVECTOR1D} type collection. Use type assertion`, () => {
                const vectorCollection = new VectorDescriptorCollection1D([1, 2, 1.5] as number[]);
                expect(vectorCollection.length).to.eql(3);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR1D);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${REALVECTOR1D} of length 1`, () => {
                const realVS = new RealVectorSpace(1);
                const vec1D = realVS.createVector([1]);
                const vectorCollection = new VectorDescriptorCollection1D([vec1D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR1D);
                expect(vectorCollection.vectorCollection[0]).to.eql(1);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${REALVECTOR2D} of length 1`, () => {
                const realVS = new RealVectorSpace(2);
                const vec2D = realVS.createVector([1, 2]);
                const vectorCollection = new VectorDescriptorCollection1D([vec2D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(2);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR2D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${REALVECTOR3D} of length 1`, () => {
                const realVS = new RealVectorSpace(3);
                const vec3D = realVS.createVector([1, 2, 3]);
                const vectorCollection = new VectorDescriptorCollection1D([vec3D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(3);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR3D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec3D);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${REALVECTOR4D} of length 1`, () => {
                const realVS = new RealVectorSpace(4);
                const vec4D = realVS.createVector([1, 2, 3, 0]);
                const vectorCollection = new VectorDescriptorCollection1D([vec4D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(4);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR4D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec4D);
            });
        });

        describe('Complex vector space', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${COMPLEXVECTOR1D} of length 1`, () => {
                const complexVS = new ComplexVectorSpace(1);
                const vec1D = complexVS.createVector([[1, 0]]);
                expect(vec1D).to.eql({type: COMPLEX, real: 1, imaginary: 0});
                const vectorCollection = new VectorDescriptorCollection1D([vec1D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(vectorCollection.type).to.eql(COMPLEX);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec1D);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${COMPLEXVECTOR2D} of length 1`, () => {
                const complexVS = new ComplexVectorSpace(2);
                const vec2D = complexVS.createVector([[1, 0], [-1, 1.5]]);
                expect(vec2D).to.eql({type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 1, imaginary: 0}, {type: COMPLEX, real: -1, imaginary: 1.5}]});
                const vectorCollection = new VectorDescriptorCollection1D([vec2D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(2);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.COMPLEX);
                expect(vectorCollection.type).to.eql(COMPLEXVECTOR2D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });
        });

        describe('Projective vector space', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${PROJECTIVEVECTOR2D} of length 1`, () => {
                const projectiveVS = new ProjectiveVectorSpace(3);
                const vec2D = projectiveVS.createVector([1, 0, 1]);
                expect(vec2D.type).to.eql(PROJECTIVEVECTOR2D);
                expect(vec2D.coordinates[0]).to.eql(1);
                expect(vec2D.coordinates[1]).to.eql(0);
                const weight = vec2D.coordinates[2];
                expect(weight.type).to.eql(WEIGHT);
                expect(weight.weight.value).to.eql(1);
                expect(weight.weight.strictlyPositive).to.eql(true);
                const vectorCollection = new VectorDescriptorCollection1D([vec2D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(3);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(vectorCollection.type).to.eql(PROJECTIVEVECTOR2D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });

            it(`can generate a valid VectorCollection1D with an input array of ${PROJECTIVEVECTOR3D} of length 1`, () => {
                const complexVS = new ProjectiveVectorSpace(4);
                const vec3D = complexVS.createVector([1, 0, -1, 1.5]);
                expect(vec3D.type).to.eql(PROJECTIVEVECTOR3D);
                expect(vec3D.coordinates[0]).to.eql(1);
                expect(vec3D.coordinates[1]).to.eql(0);
                expect(vec3D.coordinates[2]).to.eql(-1);
                const weight = vec3D.coordinates[3]
                expect(weight.type).to.eql(WEIGHT);
                expect(weight.weight.value).to.eql(1.5);
                expect(weight.weight.strictlyPositive).to.eql(true);
                const vectorCollection = new VectorDescriptorCollection1D([vec3D]);
                expect(vectorCollection.length).to.eql(1);
                expect(vectorCollection.spaceDimension).to.eql(4);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.PROJECTIVE);
                expect(vectorCollection.type).to.eql(PROJECTIVEVECTOR3D);
                expect(vectorCollection.vectorCollection[0]).to.eql(vec3D);
            });
        });

        describe('Factory function', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${REALVECTOR1D}`, () => {
                const vectorCollection = createVectorCollection1D([0, 1, 2]);
                expect(vectorCollection.length).to.eql(3);
                expect(vectorCollection.spaceDimension).to.eql(1);
                expect(vectorCollection.vectorSpaceType).to.eql(VectorSpaceType.REAL);
                expect(vectorCollection.type).to.eql(REALVECTOR1D);
            });
        });

    });
});