"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Vector2DTypeComplex_1 = require("../../src/mathVector/Vector2DTypeComplex");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const ComplexVectorSpace_1 = require("../../src/mathVector/ComplexVectorSpace");
const Complex_1 = require("../../src/mathVector/Complex");
const ComplexVectorSpace_2 = require("../../src/ErrorMessages/ComplexVectorSpace");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('Vector 1D in complex vector space: generation and operators in this vector space', () => {
    const dimension = 2;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';
    // test('debug imports', () => {
    //     // require to observe runtime values (works with CommonJS jest)
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     const ACV = require('../../src/mathVector/AbstractComplexVector').AbstractComplexVector;
    //     // eslint-disable-next-line no-console
    //     console.log('AbstractComplexVector is', ACV);
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     const V2 = require('../../src/mathVector/Vector2DTypeComplex').Vector2DTypeComplex;
    //     // eslint-disable-next-line no-console
    //     console.log('Vector2DTypeComplex is', V2);
    // });
    describe('Constructor', () => {
        it(`can generate a default complex vector into the default 2D vector space`, () => {
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex();
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex(), new Complex_1.Complex()]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.getCoordinate(1)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = complexVector.vectorSpace.id;
        });
        it(`can generate an arbitrary complex vector into the default 2D vector space using real and imaginary values`, () => {
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(-1, 2, 3, -4);
            const complex1 = new Complex_1.Complex(-1, 2);
            const complex2 = new Complex_1.Complex(3, -4);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex1, complex2]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex1);
            (0, chai_1.expect)(complexVector.getCoordinate(1)).to.eql(complex2);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate an arbitrary complex vector into the default 2D vector space using complex numbers`, () => {
            const complex1 = new Complex_1.Complex(-1, 2);
            const complex2 = new Complex_1.Complex(3, -4);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex1, complex2]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex1);
            (0, chai_1.expect)(complexVector.getCoordinate(1)).to.eql(complex2);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate a default complex vector into a 2D vector space`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([new Complex_1.Complex(), new Complex_1.Complex()]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(new Complex_1.Complex());
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = complexVector.vectorSpace.id;
        });
        it(`can generate an arbitrary complex vector into a 2D vector space using real and imaginary values`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const real1 = 3;
            const imaginary1 = -4;
            const complex1 = new Complex_1.Complex(real, imaginary);
            const complex2 = new Complex_1.Complex(real1, imaginary1);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(real, imaginary, real1, imaginary1, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex1, complex2]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex1);
            (0, chai_1.expect)(complexVector.getCoordinate(1)).to.eql(complex2);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
        });
        it(`can generate an arbitrary complex vector into a 2D vector space using complex numbers`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const real1 = 3;
            const imaginary1 = -4;
            const complex1 = new Complex_1.Complex(real, imaginary);
            const complex2 = new Complex_1.Complex(real1, imaginary1);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex1, complex2]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.getCoordinate(0)).to.eql(complex1);
            (0, chai_1.expect)(complexVector.getCoordinate(1)).to.eql(complex2);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
        });
    });
    describe('Accessors', () => {
        const complex1 = new Complex_1.Complex(2, -3);
        const complex2 = new Complex_1.Complex(-4, 5);
        it(`can get the vector type of a vector`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
        });
        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
        });
        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
        });
        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.vectorSpace).to.eql(vSpace);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVector.vectorSpace.dimension()).to.eql(dimension);
        });
        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.descriptor.type).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[0].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[0].real).to.eql(complex1.real);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[0].imaginary).to.eql(complex1.imaginary);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[1].type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[1].real).to.eql(complex2.real);
            (0, chai_1.expect)(complexVector.descriptor.coordinates[1].imaginary).to.eql(complex2.imaginary);
        });
        it(`can get the coordinates of a vector as an array of complex numbers`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector.coordinates).to.eql([complex1, complex2]);
            (0, chai_1.expect)(complexVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector.vectorSpace.isDefault).to.eql(false);
        });
    });
    describe('Methods', () => {
        const complex1 = new Complex_1.Complex(2, -3);
        const complex2 = new Complex_1.Complex(-4, 5);
        const complex3 = new Complex_1.Complex(1, 1);
        const complex4 = new Complex_1.Complex(3, -2);
        const coordinatesA = [complex1, complex2];
        const coordinatesB = [complex3, complex4];
        it(`cannot compute the norm of a vector because this method does not exist for complex vector space 2D`, () => {
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(() => complexVector1.norm()).to.throw(ComplexVectorSpace_2.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`can get the vector descriptor as a string`, () => {
            const vSpace1 = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace1);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const string = complexVector1.toString();
            (0, chai_1.expect)(string).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D + `(${complex1.toString()}, ${complex2.toString()})` + ` ` + complexVector1.vectorSpace.toString());
        });
        it(`cannot normalize a complex vector because this method does not exist for complex vector space 2D`, () => {
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(() => complexVector1.normalize()).to.throw(ComplexVectorSpace_2.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`cannot check the equality of vectors belonging to different vector spaces `, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex3, complex4);
            (0, chai_1.expect)(() => complexVector1.equals(complexVector2)).to.throw(Vectors_1.EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });
        it(`cannot check the parallelism of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex3, complex4, vSpace);
            (0, chai_1.expect)(() => complexVector1.isParallel(complexVector2)).to.throw(ComplexVectorSpace_2.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`cannot check the orthogonality of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex3, complex4, vSpace);
            (0, chai_1.expect)(() => complexVector1.isOrthogonal(complexVector2)).to.throw(ComplexVectorSpace_2.EM_TRANSFORMATION_NOT_AVAILABLE);
        });
        it(`cannot get the dot product of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace_1.ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex1, complex2, vSpace);
            (0, chai_1.expect)(complexVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(complexVector1.vectorType).to.eql(VectorTypeTags_1.COMPLEXVECTOR2D);
            (0, chai_1.expect)(complexVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex_1.Vector2DTypeComplex(complex3, complex4, vSpace);
            (0, chai_1.expect)(() => complexVector1.dot(complexVector2)).to.throw(Vectors_1.EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});
