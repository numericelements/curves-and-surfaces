"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ComplexVectorSpace_1 = require("../../src/namedConstants/ComplexVectorSpace");
const ComplexVectorSpace_2 = require("../../src/mathVector/ComplexVectorSpace");
const ComplexVectorSpace_3 = require("../../src/ErrorMessages/ComplexVectorSpace");
const ComplexVectorSpaceTestFactory_1 = require("./ComplexVectorSpaceTestFactory");
const Weight_1 = require("../../src/mathVector/Weight");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const VectorSpaceResolvers_1 = require("../../src/namedConstants/VectorSpaceResolvers");
const DefaultVectorSpaces_1 = require("../../src/namedConstants/DefaultVectorSpaces");
const DefaultVectorSpaces_2 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const VectorSpaceIdentifierManager_1 = require("../../src/namedConstants/VectorSpaceIdentifierManager");
const DefaultSpaceResolvers_1 = require("../../src/ErrorMessages/DefaultSpaceResolvers");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('ComplexVectorSpace', () => {
    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces_2.DefaultVectorSpaces.reset();
    });
    describe('Constructor', () => {
        it('can generate a ComplexVectorSpace dimension between ' + ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE + ' and ' + ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
            (0, chai_1.expect)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE)).to.not.throw();
            (0, chai_1.expect)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE)).to.not.throw();
        });
        it('cannot generate a ComplexVectorSpace outside dimension range', () => {
            (0, chai_1.expect)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it('can generate a ComplexVectorSpace and get its dimension', () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
        });
        it(`can check that a user specific Complex vector space has a default name containing ${VectorSpaceResolvers_1.COMPLEX_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(vectorSpace.name.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(false);
        });
        it(`can check that a default Complex vector space has a default name containing ${DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME}`, () => {
            const vectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(vectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it('can generate a ComplexVectorSpace specifying its dimension only. The resulting vector space is a user-specific vector space', () => {
            for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
                const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(i);
                (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(false);
                (0, chai_1.expect)(complexVectorSpace.name.includes(VectorSpaceResolvers_1.COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });
        it('can generate a default ComplexVectorSpace for any valid space dimension', () => {
            for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
                const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(i, true);
                (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(complexVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
            }
        });
        it('cannot generate more than one default ComplexVectorSpace of a given dimension', () => {
            for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
                const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(i, true);
                (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(i);
                (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(true);
                (0, chai_1.expect)(() => new ComplexVectorSpace_2.ComplexVectorSpace(i, true)).to.throw(DefaultSpaceResolvers_1.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
            }
        });
    });
    describe('Accesssors', () => {
        it(`can get the identifier of a user-defined ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(complexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        });
        it(`can get the identifier of a default ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(complexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT)).to.eql(true);
        });
        it(`can get the default name of a user-defined ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(complexVectorSpace.name.includes(VectorSpaceResolvers_1.COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the default name of a default ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(complexVectorSpace.name.includes(DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME)).to.eql(true);
        });
        it(`can get the status of a user-defined ComplexVectorSpace as not being default`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(false);
        });
        it(`can get the status of a default ComplexVectorSpace as being default`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(true);
        });
        it(`can get the vector space type of a user-defined ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(complexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
        });
        it(`can get the vector space type of a default ComplexVectorSpace`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, true);
            (0, chai_1.expect)(complexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
        });
    });
    describe('Methods', () => {
        it('can get the dimension of a ComplexVectorSpace', () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE - 1);
            (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE - 1);
        });
        // 1D CmplexVector Space Tests
        describe('1D Complex Vector Space', () => {
            (0, ComplexVectorSpaceTestFactory_1.createCommonComplexVectorSpaceTests)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE), ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE, ComplexTypeTag_1.COMPLEX);
        });
        // 2D CmplexVector Space Tests
        describe('2D Complex Vector Space', () => {
            (0, ComplexVectorSpaceTestFactory_1.createCommonComplexVectorSpaceTests)(() => new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE), ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE, VectorTypeTags_1.COMPLEXVECTOR2D);
        });
        it('can get the description of a complex vector space as a string', () => {
            for (const dim of [ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE, ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE]) {
                const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(dim);
                (0, chai_1.expect)(complexVectorSpace.toString()).to.eql(`${complexVectorSpace.name} [ID: ${complexVectorSpace.id}]`);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.name)).to.eql(true);
                (0, chai_1.expect)(complexVectorSpace.toString().includes(complexVectorSpace.id)).to.eql(true);
            }
        });
        it(`cannot generate a ${ComplexVectorSpace_2.ComplexVectorSpace} with a dimension lower than ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} or higher than  ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            (0, chai_1.expect)(() => {
                new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE - 1);
            }).to.throw(Error, ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => {
                new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE + 1);
            }).to.throw(Error, ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it(`cannot create a ComplexVector of dimension outside the dimension ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} of ${ComplexVectorSpace_2.ComplexVectorSpace}`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[0, 1], [1, 1], [3, 2]])).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[0, 1]])).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it(`cannot create a ComplexVector of dimension outside the dimension ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} of ${ComplexVectorSpace_2.ComplexVectorSpace}`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[0, 1], [1, 1]])).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([])).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });
        it(`cannot create a ComplexVector of dimension ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} if the dimension of the array defining the complex number is not 2`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[1]])).to.throw(ComplexVectorSpace_3.EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[1, 2, 3]])).to.throw(ComplexVectorSpace_3.EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
        });
        it(`cannot create a ComplexVector of dimension ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} if the dimension of the array defining the complex number is not 2`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[1, 1], [1]])).to.throw(ComplexVectorSpace_3.EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
            (0, chai_1.expect)(() => complexVectorSpace.createVector([[1, 1], [1, 2, 3]])).to.throw(ComplexVectorSpace_3.EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
        });
        it(`can check that two ComplexVectors are not of same dimension in ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE - 1);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can check that two ComplexVectors are not of same dimension in ${MAX_DIMENSION_COMPLEXVECTORSPACE} vector space', () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it('can check that two ComplexVectors of same dimension but not in the current Complex vector space are not declared as such', () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 1 }, { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }] };
            (0, chai_1.expect)(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false);
        });
        it(`cannot add two ComplexVectors not of same dimension in ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.addDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_DIFFERENT_DIM);
        });
        it(`cannot add two ComplexVectors not of same dimension in ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.addDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_DIFFERENT_DIM);
        });
        it('cannot add two ComplexVectors of same dimension but not in the current Complex vector space', () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 3, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.addDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
        });
        it('cannot substract two ComplexVectors not of same dimension', () => {
            const complexVectorSpace1 = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace1.subtractDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_DIFFERENT_DIM);
            const complexVectorSpace2 = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace2.subtractDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_DIFFERENT_DIM);
        });
        it('cannot subtract two ComplexVectors of same dimension but not in the current Complex vector space', () => {
            const complexVectorSpace2 = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const vec2 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 };
            (0, chai_1.expect)(() => complexVectorSpace2.subtractDescriptors(vec1, vec2)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
            const complexVectorSpace1 = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec3 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            const vec4 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 3, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace1.subtractDescriptors(vec3, vec4)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
        });
        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Real`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const scale = 2;
            (0, chai_1.expect)(() => complexVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Real`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            const scale = 2;
            (0, chai_1.expect)(() => complexVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Complex`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            const scale = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            (0, chai_1.expect)(() => complexVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Complex`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            const scale = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            (0, chai_1.expect)(() => complexVectorSpace.scaleDescriptor(scale, vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot generate the image of a ComplexVector of dimension ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} into a Real vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = complexVectorSpace.defaultVect();
            (0, chai_1.expect)(() => complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1)).to.throw(ComplexVectorSpace_3.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`cannot generate the image of a ComplexVector of dimension outside the Complex Vectorspace dimension ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} into a Real vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot generate the image of a ComplexVector of dimension ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE} into a Projective Complex vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = complexVectorSpace.defaultVect();
            (0, chai_1.expect)(() => complexVectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ComplexVectorSpace_3.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`cannot generate the image of a ComplexVector of dimension outside the Complex Vectorspace dimension ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} into a Projective Complex vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot clone a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 };
            (0, chai_1.expect)(() => complexVectorSpace.cloneVector(vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`cannot clone a ComplexVector of dimension outside the current Complex vector space ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 2 }, { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 0 }] };
            (0, chai_1.expect)(() => complexVectorSpace.cloneVector(vec1)).to.throw(ComplexVectorSpace_3.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
        });
        it(`can create a Complex weight from two stricly positive numbers`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(1, 2);
            (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(weight.real).to.eql(new Weight_1.Weight(1));
            (0, chai_1.expect)(weight.imaginary).to.eql(new Weight_1.Weight(2));
        });
        it(`can create a Complex weight from two positive numbers`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(0, 0);
            (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(weight.real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it(`can create a Complex weight from two numbers of absolute value  smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2, -ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2);
            (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
            (0, chai_1.expect)(weight.real).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary).to.eql(new Weight_1.Weight(0, false));
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it(`cannot create a Complex weight from a negative number defining the real weight `, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createComplexWeight(-1, 2)).to.throw(ComplexVectorSpace_3.EM_REALWEIGHT_NEGATIVE);
        });
        it(`cannot create a Complex weight from a negative number defining the imaginary weight `, () => {
            const complexVectorSpace = new ComplexVectorSpace_2.ComplexVectorSpace(ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE);
            (0, chai_1.expect)(() => complexVectorSpace.createComplexWeight(2, -2)).to.throw(ComplexVectorSpace_3.EM_IMAGINARYWEIGHT_NEGATIVE);
        });
    });
});
