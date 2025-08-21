import { expect } from "chai";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_COMPLEXVECTORS_DIFFERENT_DIM, EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_IMAGINARYWEIGHT_NEGATIVE, EM_INPUT_ARRAY_INCONSISTENT_LENGTH, EM_REALWEIGHT_NEGATIVE, EM_TRANSFORMATION_NOT_AVAILABLE } from "../../src/ErrorMessages/ComplexVectorSpace";
import { Complex, COMPLEX, ComplexVector1D, ComplexVector2D, COMPLEXVECTOR2D, COMPLEXWEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { createCommonComplexVectorSpaceTests } from "./ComplexVectorSpaceTestFactory";
import { Weight } from "../../src/mathVector/Weight";
import { NULL_WEIGHT_TOLERANCE } from "../../src/namedConstants/ProjectiveVectorSpace";

describe('ComplexVectorSpace', () => {

    describe('Constructor', () => {

        it('can generate a valid ComplexVectorSpace dimension between ' + MIN_DIMENSION_COMPLEXVECTORSPACE + ' and ' + MAX_DIMENSION_COMPLEXVECTORSPACE, () => {
            expect(() => new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE)).to.not.throw()
            expect(() => new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a ComplexVectorSpace outside dimension range', () => {
            expect(() => new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a valid ComplexVectorSpace and get its dimension', () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            expect(complexVectorSpace.dimension()).to.eql(MIN_DIMENSION_COMPLEXVECTORSPACE)
        });
    });

    describe('Methods', () => {
        it('can get the dimension of a ComplexVectorSpace', () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE - 1);
            expect(complexVectorSpace.dimension()).to.eql(MAX_DIMENSION_COMPLEXVECTORSPACE - 1)
        });


        // 2D CmplexVector Space Tests
        describe('2D Vector Space', () => {
            createCommonComplexVectorSpaceTests(
                () => new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE),
                MIN_DIMENSION_COMPLEXVECTORSPACE,
                COMPLEX
            );
            
        });
        
        // 4D CmplexVector Space Tests
        describe('4D Vector Space', () => {
            createCommonComplexVectorSpaceTests(
                () => new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE),
                MAX_DIMENSION_COMPLEXVECTORSPACE,
                COMPLEXVECTOR2D
            );
            
        });

        it(`cannot generate a ${ComplexVectorSpace} with a dimension lower than ${MIN_DIMENSION_COMPLEXVECTORSPACE} or higher than  ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            expect(() => {
                new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE - 1);
                }).to.throw(Error, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            expect(() => {
                new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE + 1);
                }).to.throw(Error, EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });

        it(`cannot create a ComplexVector of dimension outside the dimension ${MAX_DIMENSION_COMPLEXVECTORSPACE} of ${ComplexVectorSpace}`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createVector([[0, 1], [1, 1], [3, 2]])).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            expect(() => complexVectorSpace.createVector([[0, 1]])).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });

        it(`cannot create a ComplexVector of dimension outside the dimension ${MIN_DIMENSION_COMPLEXVECTORSPACE} of ${ComplexVectorSpace}`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createVector([[0, 1], [1, 1]])).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            expect(() => complexVectorSpace.createVector([])).to.throw(EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
        });

        it(`cannot create a ComplexVector of dimension ${MIN_DIMENSION_COMPLEXVECTORSPACE} if the dimension of the array defining the complex number is not 2`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createVector([[1]])).to.throw(EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
            expect(() => complexVectorSpace.createVector([[1, 2, 3]])).to.throw(EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
        });

        it(`cannot create a ComplexVector of dimension ${MAX_DIMENSION_COMPLEXVECTORSPACE} if the dimension of the array defining the complex number is not 2`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createVector([[1, 1], [1]])).to.throw(EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
            expect(() => complexVectorSpace.createVector([[1, 1], [1, 2, 3]])).to.throw(EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
        });

        it(`can check that two ComplexVectors are not of same dimension in ${MIN_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE - 1);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ComplexVectors are not of same dimension in ${MAX_DIMENSION_COMPLEXVECTORSPACE} vector space', () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it('can check that two ComplexVectors of same dimension but not in the current Complex vector space are not declared as such', () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEX, real: 0, imaginary: 2}]};
            expect(complexVectorSpace.areSameDimension(vec1, vec2)).to.eql(false)
        });

        it(`cannot add two ComplexVectors not of same dimension in ${MIN_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace.addRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_DIFFERENT_DIM)
        });

        it(`cannot add two ComplexVectors not of same dimension in ${MAX_DIMENSION_COMPLEXVECTORSPACE} vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace.addRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_DIFFERENT_DIM)
        });

        it('cannot add two ComplexVectors of same dimension but not in the current Complex vector space', () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 2, imaginary: 2}, {type: COMPLEX, real: 3, imaginary: 0}]};
            expect(() => complexVectorSpace.addRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE)
        });

        it('cannot substract two ComplexVectors not of same dimension', () => {
            const complexVectorSpace1 = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace1.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_DIFFERENT_DIM)

            const complexVectorSpace2 = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace2.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_DIFFERENT_DIM)
        });

        it('cannot subtract two ComplexVectors of same dimension but not in the current Complex vector space', () => {
            const complexVectorSpace2 = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const vec2: ComplexVector1D = {type: COMPLEX, real: 1, imaginary: 0};
            expect(() => complexVectorSpace2.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE)
            
            const complexVectorSpace1 = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec3: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            const vec4: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 2, imaginary: 2}, {type: COMPLEX, real: 3, imaginary: 0}]};
            expect(() => complexVectorSpace1.subtractRaw(vec3, vec4)).to.throw(EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE)
        });

        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${MAX_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Real`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const scale = 2;
            expect(() => complexVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${MIN_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Real`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            const scale = 2;
            expect(() => complexVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${MAX_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Complex`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            const scale: Complex = {type: COMPLEX, real: 0, imaginary: 2};
            expect(() => complexVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot scale a ComplexVector of dimension outside the current Complex vector space ${MIN_DIMENSION_COMPLEXVECTORSPACE} when the scale factor is Complex`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            const scale: Complex = {type: COMPLEX, real: 0, imaginary: 2};
            expect(() => complexVectorSpace.scaleRaw(scale, vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate the image of a ComplexVector of dimension ${MAX_DIMENSION_COMPLEXVECTORSPACE} into a Real vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = complexVectorSpace.defaultVect();
            expect(() => complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE)
        });

        it(`cannot generate the image of a ComplexVector of dimension outside the Complex Vectorspace dimension ${MIN_DIMENSION_COMPLEXVECTORSPACE} into a Real vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot generate the image of a ComplexVector of dimension ${MAX_DIMENSION_COMPLEXVECTORSPACE} into a Projective Complex vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1 = complexVectorSpace.defaultVect();
            expect(() => complexVectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE)
        });

        it(`cannot generate the image of a ComplexVector of dimension outside the Complex Vectorspace dimension ${MIN_DIMENSION_COMPLEXVECTORSPACE} into a Projective Complex vector space`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ComplexVector of dimension outside the current Complex vector space ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector1D = {type: COMPLEX, real: 0, imaginary: 2};
            expect(() => complexVectorSpace.cloneRaw(vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`cannot clone a ComplexVector of dimension outside the current Complex vector space ${MIN_DIMENSION_COMPLEXVECTORSPACE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const vec1: ComplexVector2D = {type: COMPLEXVECTOR2D, coordinates: [{type: COMPLEX, real: 0, imaginary: 2}, {type: COMPLEX, real: 1, imaginary: 0}]};
            expect(() => complexVectorSpace.cloneRaw(vec1)).to.throw(EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE)
        });

        it(`can create a Complex weight from two stricly positive numbers`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(1, 2);
            expect(weight.type).to.eql(COMPLEXWEIGHT);
            expect(weight.real).to.eql(new Weight(1));
            expect(weight.imaginary).to.eql(new Weight(2));
        });

        it(`can create a Complex weight from two positive numbers`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(0, 0);
            expect(weight.type).to.eql(COMPLEXWEIGHT);
            expect(weight.real).to.eql(new Weight(0, false));
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary).to.eql(new Weight(0, false));
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can create a Complex weight from two numbers of absolute value  smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            const weight = complexVectorSpace.createComplexWeight(NULL_WEIGHT_TOLERANCE / 2, - NULL_WEIGHT_TOLERANCE / 2);
            expect(weight.type).to.eql(COMPLEXWEIGHT);
            expect(weight.real).to.eql(new Weight(0, false));
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary).to.eql(new Weight(0, false));
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot create a Complex weight from a negative number defining the real weight `, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createComplexWeight(-1, 2)).to.throw(EM_REALWEIGHT_NEGATIVE);
        });

        it(`cannot create a Complex weight from a negative number defining the imaginary weight `, () => {
            const complexVectorSpace = new ComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE);
            expect(() => complexVectorSpace.createComplexWeight(2, -2)).to.throw(EM_IMAGINARYWEIGHT_NEGATIVE);
        });

    });

});