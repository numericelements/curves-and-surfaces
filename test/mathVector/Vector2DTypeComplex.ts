import { expect } from "chai";
import { Vector2DTypeComplex } from "../../src/mathVector/Vector2DTypeComplex";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Complex } from "../../src/mathVector/Complex";
import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../../src/ErrorMessages/ComplexVectorSpace";
import { EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../../src/namedConstants/Vectors";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";

describe('Vector 2D in complex vector space: generation and operators in this vector space', () => {
    const dimension = 2;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default complex vector into the default 2D vector space`, () => {
            const complexVector = new Vector2DTypeComplex();
            expect(complexVector.coordinates).to.eql([new Complex(), new Complex()]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex());
            expect(complexVector.getCoordinate(1)).to.eql(new Complex());
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary complex vector into the default 2D vector space using real and imaginary values`, () => {
            const complexVector = new Vector2DTypeComplex(-1, 2, 3, -4);
            const complex1 = new Complex(-1, 2);
            const complex2 = new Complex(3, -4);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex1);
            expect(complexVector.getCoordinate(1)).to.eql(complex2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate an arbitrary complex vector into the default 2D vector space using complex numbers`, () => {
            const complex1 = new Complex(-1, 2);
            const complex2 = new Complex(3, -4);
            const complexVector = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex1);
            expect(complexVector.getCoordinate(1)).to.eql(complex2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension).id;
            expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default complex vector into a 2D vector space`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(vSpace);
            expect(complexVector.coordinates).to.eql([new Complex(), new Complex()]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex());
            expect(complexVector.getCoordinate(0)).to.eql(new Complex());
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary complex vector into a 2D vector space using real and imaginary values`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const real1 = 3;
            const imaginary1 = -4;
            const complex1 = new Complex(real, imaginary);
            const complex2 = new Complex(real1, imaginary1);
            const complexVector = new Vector2DTypeComplex(real, imaginary, real1, imaginary1, vSpace);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex1);
            expect(complexVector.getCoordinate(1)).to.eql(complex2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary complex vector into a 2D vector space using real and imaginary values into a default vector space`, () => {
            // Reset the default projective space manager singleton before the test
            DefaultVectorSpaces.reset();
            const real = 1;
            const imaginary = -2;
            const real1 = 3;
            const imaginary1 = -4;
            const complex1 = new Complex(real, imaginary);
            const complex2 = new Complex(real1, imaginary1);
            const complexVector = new Vector2DTypeComplex(real, imaginary, real1, imaginary1);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex1);
            expect(complexVector.getCoordinate(1)).to.eql(complex2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary complex vector into a 2D vector space using complex numbers`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const real1 = 3;
            const imaginary1 = -4;
            const complex1 = new Complex(real, imaginary);
            const complex2 = new Complex(real1, imaginary1);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex1);
            expect(complexVector.getCoordinate(1)).to.eql(complex2);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
        });

        // All these overloads are not supported by the API --- IGNORE ---
        // it(`cannot generate an arbitrary complex vector into a 2D vector space using a single complex number`, () => {
        //     const real = 1;
        //     const imaginary = -2;
        //     const complex1 = new Complex(real, imaginary);
        //     const complexVector = new Vector2DTypeComplex(complex1);
        //     expect(complexVector.coordinates).to.eql([complex1, new Complex()]);
        //     expect(complexVector.dimension).to.eql(dimension);
        //     expect(complexVector.getCoordinate(0)).to.eql(complex1);
        //     expect(complexVector.getCoordinate(1)).to.eql(new Complex());
        //     expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
        //     expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        //     expect(complexVector.vectorSpace.isDefault).to.eql(true);
        // });
        // it(`cannot generate an arbitrary complex vector into a 2D vector space using two real coordinates only`, () => {
        //     const real = 1;
        //     const imaginary = -2;
        //     const complex1 = new Complex(real, imaginary);
        //     const complexVector = new Vector2DTypeComplex(real, imaginary);
        //     expect(complexVector.coordinates).to.eql([complex1, new Complex()]);
        //     expect(complexVector.dimension).to.eql(dimension);
        //     expect(complexVector.getCoordinate(0)).to.eql(complex1);
        //     expect(complexVector.getCoordinate(1)).to.eql(new Complex());
        //     expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
        //     expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        //     expect(complexVector.vectorSpace.isDefault).to.eql(true);
        // });
        // it(`cannot generate an arbitrary complex vector into a 2D vector space using complex and real coordinates simultaneously`, () => {
        //     const vSpace = new ComplexVectorSpace(dimension);
        //     const real = 1;
        //     const imaginary = -2;
        //     const real1 = 3;
        //     const imaginary1 = -4;
        //     const complex1 = new Complex(real, imaginary);
        //     const complex2 = new Complex(real1, imaginary1);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0)).to.throw(EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0, 0)).to.throw(EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0, 0, vSpace)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, complex2, 0, 0, vSpace)).to.throw(EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES);
        // });
        // it(`cannot generate an arbitrary complex vector into a 2D vector space using one complex coordinate and real ones simultaneously`, () => {
        //     const vSpace = new ComplexVectorSpace(dimension);
        //     const real = 1;
        //     const imaginary = -2;
        //     const complex1 = new Complex(real, imaginary);
        //     expect(() => new Vector2DTypeComplex(complex1, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0, 0, vSpace)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(complex1, 0, 0, 0, vSpace)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        // });

        // it(`cannot generate an arbitrary complex vector into a 2D vector space using a first real coordinate and a complex one as second coordinate`, () => {
        //     const vSpace = new ComplexVectorSpace(dimension);
        //     const real = 1;
        //     const imaginary = -2;
        //     const complex1 = new Complex(real, imaginary);
        //     expect(() => new Vector2DTypeComplex(real, complex1)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, complex1)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0, 0, vSpace)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, complex1, 0, 0, vSpace)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        // });
        // it(`cannot generate an arbitrary complex vector into a 2D vector space using first and second real coordinates and subsequent parameters`, () => {
        //     const vSpace = new ComplexVectorSpace(dimension);
        //     const real = 1;
        //     const imaginary = -2;
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace, 0)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace, 0)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace, 0, vSpace)).to.throw(RangeError);
        //     expect(() => new Vector2DTypeComplex(real, imaginary, vSpace, 0, vSpace)).to.throw(EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
        // });

    });

    describe('Accessors', () => {
        const complex1 = new Complex(2, -3);
        const complex2 = new Complex(-4, 5);

        it(`can get the vector type of a vector`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
        });

        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.dimension).to.eql(dimension);
        });

        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        });

        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace.dimension()).to.eql(dimension);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.descriptor.type).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.descriptor.coordinates[0].type).to.eql(COMPLEX);
            expect(complexVector.descriptor.coordinates[0].real).to.eql(complex1.real);
            expect(complexVector.descriptor.coordinates[0].imaginary).to.eql(complex1.imaginary);
            expect(complexVector.descriptor.coordinates[1].type).to.eql(COMPLEX);
            expect(complexVector.descriptor.coordinates[1].real).to.eql(complex2.real);
            expect(complexVector.descriptor.coordinates[1].imaginary).to.eql(complex2.imaginary);
        });

        it(`can get the coordinates of a vector as an array of complex numbers`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector.coordinates).to.eql([complex1, complex2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
        });
    });

    describe('Methods', () => {
        const complex1 = new Complex(2, -3);
        const complex2 = new Complex(-4, 5);
        const complex3 = new Complex(1, 1);
        const complex4 = new Complex(3, -2);
        const coordinatesA = [complex1, complex2];
        const coordinatesB = [complex3, complex4];

        it(`cannot compute the norm of a vector because this method does not exist for complex vector space 2D`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.norm()).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE);
        });

        it(`can get the vector descriptor as a string`, () => {
            const vSpace1 = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace1);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const string = complexVector1.toString();
            expect(string).to.eql(COMPLEXVECTOR2D + `(${complex1.toString()}, ${complex2.toString()})` + ` ` + complexVector1.vectorSpace.toString());
        });

        it(`cannot normalize a complex vector because this method does not exist for complex vector space 2D`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.normalize()).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE);
        });

        it(`cannot check the equality of vectors belonging to different vector spaces `, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex(complex3, complex4);
            expect(() => complexVector1.equals(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });

        it(`cannot check the parallelism of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex(complex3, complex4, vSpace);
            expect(() => complexVector1.isParallel(complexVector2)).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE);
        });

        it(`cannot check the orthogonality of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex(complex3, complex4, vSpace);
            expect(() => complexVector1.isOrthogonal(complexVector2)).to.throw(EM_TRANSFORMATION_NOT_AVAILABLE);
        });

        it(`cannot get the dot product of vectors because this property is not available for 2D complex vectors`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector2DTypeComplex(complex3, complex4, vSpace);
            expect(() => complexVector1.dot(complexVector2)).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});