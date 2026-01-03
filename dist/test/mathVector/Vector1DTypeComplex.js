"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Vector1DTypeComplex_1 = require("../../src/mathVector/Vector1DTypeComplex");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const Complex_1 = require("../../src/mathVector/Complex");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('Vector 1D in complex vector space: generation and operators in this vector space', () => {
    const dimension = 1;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';
    describe('Constructor', () => {
        it(`can generate a default complex vector into the default 1D vector space`, () => {
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex();
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex()]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = complexVector.vectorSpace.id;
        });
        it(`can generate an arbitrary complex vector into the default 1D vector space using real and imaginary values`, () => {
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(-1, 2);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex(-1, 2)]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex(-1, 2));
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate a default complex vector into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex()]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = complexVector.vectorSpace.id;
        });
        it(`can generate an arbitrary complex vector into a 1D vector space using real and imaginary values`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(real, imaginary, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex(real, imaginary)]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex(real, imaginary));
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
        });
        it(`can generate an arbitrary complex vector from a Complex into the default 1D vector space`, () => {
            const complex = new Complex_1.Complex(-1, 2);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(complex);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate an arbitrary complex vector from a Complex into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const complex = new Complex_1.Complex(1, -2);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(complex, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
        });
    });
    describe('Accessors', () => {
        it(`can get the vector type of a vector`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(1, 2, vSpace);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
        });
        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(1, 2, vSpace);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
        });
        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(1, 2, vSpace);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
        });
        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(1, 2, vSpace);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace.dimension()).to.eql(dimension);
        });
        it(`can get the coordinates of a vector as real, imaginary parameters`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(1, 2, vSpace);
            (0, chai_1.expect)(complexVector.real).to.eql(1);
            (0, chai_1.expect)(complexVector.imaginary).to.eql(2);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
        });
        it(`can get the coordinates of a vector as a complex number`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complex = new Complex_1.Complex(1, 2);
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(complex, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
        });
        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const coordinates = [1, 3];
            const complexVector = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.descriptor.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(complexVector.descriptor.real).to.eql(coordinates[0]);
            (0, chai_1.expect)(complexVector.descriptor.imaginary).to.eql(coordinates[1]);
        });
    });
    describe('Methods', () => {
        // it(`cannot add a vector with another vector of different dimension`, () => {
        //     const coordinates = [1, 3];
        //     const complexVector1 = new Vector1DTypeComplex(coordinates[0], coordinates[1]);
        //     expect(complexVector1.dimension).to.eql(dimension);
        //     expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
        //     expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
        //     expect(complexVector1.vectorSpace.isDefault).to.eql(true);
        //     const complexVector2 = new Vector2DTypeComplex();
        //     expect(complexVector2.dimension).to.not.eql(complexVector1.dimension);
        //     expect(() => complexVector1.add(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        // });
        // it(`cannot subtract a vector from another vector of different dimension`, () => {
        //     const coordinates = [1, 3];
        //     const complexVector1 = new Vector1DTypeComplex(coordinates[0], coordinates[1]);
        //     expect(complexVector1.dimension).to.eql(dimension);
        //     expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
        //     expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
        //     expect(complexVector1.vectorSpace.isDefault).to.eql(true);
        //     const complexVector2 = new Vector2DTypeComplex();
        //     expect(complexVector2.dimension).to.not.eql(complexVector1.dimension);
        //     expect(() => complexVector1.subtract(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        // });
        it(`can compute the norm of a vector`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1]);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.norm();
            const sqSum = coordinates.reduce((sum, c) => sum + c * c, 0);
            (0, chai_1.expect)(result).to.be.closeTo(Math.sqrt(sqSum), GeneralPurpose_1.TOLERANCE_FLOAT);
        });
        it(`can get the vector descriptor as a string`, () => {
            const coordinates = [1, 3];
            const vSpace1 = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace1);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const string = complexVector1.toString();
            (0, chai_1.expect)(string).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D + `(${new Complex_1.Complex(coordinates[0], coordinates[1]).toString()})` + ` ` + complexVector1.vectorSpace.toString());
        });
        it(`cannot check the equality of vectors belonging to different vector spaces `, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1]);
            (0, chai_1.expect)(() => complexVector1.equals(complexVector2)).to.throw(Vectors_1.EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });
        it(`cannot check the parallelism of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1]);
            (0, chai_1.expect)(() => complexVector1.isParallel(complexVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });
        it(`cannot check the parallelism of vectors if the first one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [Vectors_1.LINEAR_TOL_VECTOR / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [1, 3];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates2[0], coordinates2[1], vSpace);
            (0, chai_1.expect)(() => complexVector1.isParallel(complexVector2)).to.throw(Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
        });
        it(`cannot check the parallelism of vectors if the second one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [Vectors_1.LINEAR_TOL_VECTOR / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates2[0], coordinates2[1], vSpace);
            (0, chai_1.expect)(() => complexVector1.isParallel(complexVector2)).to.throw(Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
        });
        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1]);
            (0, chai_1.expect)(() => complexVector1.isOrthogonal(complexVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });
        it(`can check that two vectors are parallel to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const realVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(realVector1.isParallel(complexVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are parallel to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const perturbedCoordinates = [coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(perturbedCoordinates[0], perturbedCoordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.isParallel(complexVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not parallel to each other within the default angular tolerance`, () => {
            const coordinates = [0, 2];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            // Empirical coefficient taking into account the cross influence of linear tolerance and angular tolerance
            const coef = 400;
            const coordinates1 = [coordinates[0] + Vectors_1.ANGULAR_TOL_VECTOR * coef, coordinates[1]];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(complexVector1.isParallel(complexVector2)).to.eql(false);
        });
        it(`can check that two angularly different vectors are parallel to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const perturbedCoordinates = [coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(perturbedCoordinates[0], perturbedCoordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.isParallel(complexVector2, angularTolerance)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not parallel to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [coordinates[0] + angularTolerance, coordinates[1], coordinates[2], coordinates[3]];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(complexVector1.isParallel(complexVector2)).to.eql(false);
        });
        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [0, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [2, 4];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates2[0], coordinates2[1]);
            (0, chai_1.expect)(() => complexVector1.isOrthogonal(complexVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });
        it(`cannot check the orthogonality of vectors if the first one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [Vectors_1.LINEAR_TOL_VECTOR / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [1, 3];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(() => complexVector1.isOrthogonal(complexVector2)).to.throw(Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
        });
        it(`cannot check the orthogonality of vectors if the second one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [Vectors_1.LINEAR_TOL_VECTOR / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(() => complexVector1.isOrthogonal(complexVector2)).to.throw(Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
        });
        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1], vSpace);
            (0, chai_1.expect)(complexVector1.isOrthogonal(complexVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR, vSpace);
            (0, chai_1.expect)(complexVector1.isOrthogonal(complexVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3];
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1] + Vectors_1.ANGULAR_TOL_VECTOR * 4, vSpace);
            (0, chai_1.expect)(complexVector1.isOrthogonal(complexVector2)).to.eql(false);
        });
        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR, vSpace);
            (0, chai_1.expect)(complexVector1.isOrthogonal(complexVector2, angularTolerance)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR1D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const complexVector2 = new Vector1DTypeComplex_1.Vector1DTypeComplex(coordinates1[0], coordinates1[1] + angularTolerance * 4, vSpace);
            (0, chai_1.expect)(complexVector1.isOrthogonal(complexVector2, angularTolerance)).to.eql(false);
        });
    });
});
