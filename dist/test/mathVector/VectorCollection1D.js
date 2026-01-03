"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VectorCollection1D_1 = require("../../src/mathVector/VectorCollection1D");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../src/mathVector/ProjectiveVectorSpace");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('VectorCollection1D', () => {
    describe('Constructor', () => {
        it('can generate a valid VectorCollection1D without input data', () => {
            (0, chai_1.expect)(() => new VectorCollection1D_1.VectorCollection1D()).to.not.throw();
        });
        it('generates a valid VectorCollection1D with a null length array without input data', () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D();
            (0, chai_1.expect)(vectorCollection.length).to.eql(0);
        });
        it(`generates a valid VectorCollection1D without input data. Corresponding vector space dimension is invalid and vector space type is UNKNOWN_VECTORSPACE and vector type is ${VectorTypeTags_1.UNDEFINED_VECTORTYPE}`, () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D();
            (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(BSplineR1toRn_1.INVALID_VS_DIMENSION);
            (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.UNDEFINED_VECTORTYPE);
            (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.UNKNOWN_VECTORSPACE);
        });
        it(`generates a valid VectorCollection1D without input data. Corresponding vector collection has null length`, () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D();
            (0, chai_1.expect)(vectorCollection.vectorCollection).to.eql([]);
            (0, chai_1.expect)(vectorCollection.length).to.eql(0);
        });
        it('can generate a valid VectorCollection1D with an input array of null length', () => {
            (0, chai_1.expect)(() => new VectorCollection1D_1.VectorCollection1D([])).to.not.throw();
        });
        it('generates a valid VectorCollection1D with a null length array with a null length array as input', () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D([]);
            (0, chai_1.expect)(vectorCollection.length).to.eql(0);
        });
        it(`generates a valid VectorCollection1D with a null length array as input. Corresponding vector space dimension is invalid and vector space type is UNKNOWN_VECTORSPACE and vector type is ${VectorTypeTags_1.UNDEFINED_VECTORTYPE}`, () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D([]);
            (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(BSplineR1toRn_1.INVALID_VS_DIMENSION);
            (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.UNDEFINED_VECTORTYPE);
            (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.UNKNOWN_VECTORSPACE);
        });
        it(`generates a valid VectorCollection1D with a null length array as input. Corresponding vector collection has null length`, () => {
            const vectorCollection = new VectorCollection1D_1.VectorCollection1D([]);
            (0, chai_1.expect)(vectorCollection.vectorCollection).to.eql([]);
            (0, chai_1.expect)(vectorCollection.length).to.eql(0);
        });
        describe('Real vector space', () => {
            it('can generate a valid VectorCollection1D with an input array of length 1. Use type assertion to fix typescript limitation with type inferencing for number[]', () => {
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([1.5]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR1D);
                (0, chai_1.expect)(vectorCollection.vectorCollection).to.eql([1.5]);
            });
            it(`can generate a valid VectorCollection1D with an input array of length greater than one that defauts to ${VectorTypeTags_1.REALVECTOR1D} type collection. Consistent type inference is achieved`, () => {
                const vectors = [1, 2, 1.5];
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D(vectors);
                (0, chai_1.expect)(vectorCollection.length).to.eql(3);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR1D);
                (0, chai_1.expect)(typeof vectorCollection.vectorCollection[0]).to.eql('number');
                let i = 0;
                for (const vec of vectors) {
                    (0, chai_1.expect)(vectorCollection.vectorCollection[i]).to.eql(vec);
                    i++;
                }
            });
            it(`can generate a valid VectorCollection1D with an input array of length greater than one that defauts to ${VectorTypeTags_1.REALVECTOR1D} type collection. Use type assertion`, () => {
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([1, 2, 1.5]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(3);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR1D);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.REALVECTOR1D} of length 1`, () => {
                const realVS = new RealVectorSpace_1.RealVectorSpace(1);
                const vec1D = realVS.createVector([1]);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec1D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR1D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(1);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.REALVECTOR2D} of length 1`, () => {
                const realVS = new RealVectorSpace_1.RealVectorSpace(2);
                const vec2D = realVS.createVector([1, 2]);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec2D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(2);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR2D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.REALVECTOR3D} of length 1`, () => {
                const realVS = new RealVectorSpace_1.RealVectorSpace(3);
                const vec3D = realVS.createVector([1, 2, 3]);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec3D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(3);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR3D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec3D);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.REALVECTOR4D} of length 1`, () => {
                const realVS = new RealVectorSpace_1.RealVectorSpace(4);
                const vec4D = realVS.createVector([1, 2, 3, 0]);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec4D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(4);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR4D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec4D);
            });
        });
        describe('Complex vector space', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.COMPLEXVECTOR1D} of length 1`, () => {
                const complexVS = new ComplexVectorSpace_1.ComplexVectorSpace(1);
                const vec1D = complexVS.createVector([[1, 0]]);
                (0, chai_1.expect)(vec1D).to.eql({ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 });
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec1D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(vectorCollection.type).to.eql(ComplexTypeTag_1.COMPLEX);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec1D);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.COMPLEXVECTOR2D} of length 1`, () => {
                const complexVS = new ComplexVectorSpace_1.ComplexVectorSpace(2);
                const vec2D = complexVS.createVector([[1, 0], [-1, 1.5]]);
                (0, chai_1.expect)(vec2D).to.eql({ type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }, { type: ComplexTypeTag_1.COMPLEX, real: -1, imaginary: 1.5 }] });
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec2D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(2);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });
        });
        describe('Projective vector space', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.PROJECTIVEVECTOR2D} of length 1`, () => {
                const projectiveVS = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(3);
                const vec2D = projectiveVS.createVector([1, 0, 1]);
                (0, chai_1.expect)(vec2D.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
                (0, chai_1.expect)(vec2D.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(vec2D.coordinates[1]).to.eql(0);
                const weight = vec2D.coordinates[2];
                (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(weight.weight.value).to.eql(1);
                (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec2D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(3);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR2D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec2D);
            });
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.PROJECTIVEVECTOR3D} of length 1`, () => {
                const complexVS = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(4);
                const vec3D = complexVS.createVector([1, 0, -1, 1.5]);
                (0, chai_1.expect)(vec3D.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(vec3D.coordinates[0]).to.eql(1);
                (0, chai_1.expect)(vec3D.coordinates[1]).to.eql(0);
                (0, chai_1.expect)(vec3D.coordinates[2]).to.eql(-1);
                const weight = vec3D.coordinates[3];
                (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.WEIGHT);
                (0, chai_1.expect)(weight.weight.value).to.eql(1.5);
                (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
                const vectorCollection = new VectorCollection1D_1.VectorCollection1D([vec3D]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(1);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(4);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.PROJECTIVEVECTOR3D);
                (0, chai_1.expect)(vectorCollection.vectorCollection[0]).to.eql(vec3D);
            });
        });
        describe('Factory function', () => {
            it(`can generate a valid VectorCollection1D with an input array of ${VectorTypeTags_1.REALVECTOR1D}`, () => {
                const vectorCollection = (0, VectorCollection1D_1.createVectorCollection1D)([0, 1, 2]);
                (0, chai_1.expect)(vectorCollection.length).to.eql(3);
                (0, chai_1.expect)(vectorCollection.spaceDimension).to.eql(1);
                (0, chai_1.expect)(vectorCollection.vectorSpaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
                (0, chai_1.expect)(vectorCollection.type).to.eql(VectorTypeTags_1.REALVECTOR1D);
            });
        });
    });
});
