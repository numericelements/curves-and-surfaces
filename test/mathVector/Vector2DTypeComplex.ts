import { expect } from "chai";
import { Vector2DTypeComplex } from "../../src/mathVector/Vector2DTypeComplex";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Complex } from "../../src/mathVector/Complex";
import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../../src/ErrorMessages/ComplexVectorSpace";
import { EM_NORM_TOO_SMALL, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";

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
            const defaultVectorSpace = DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension);
            if(defaultVectorSpace !== undefined) {
                defaultVectorSpaceID = defaultVectorSpace.id;
                expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
            }
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


        it(`cannot generate a default complex vector into a user-defined vector space if this vector space is not of type complex and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new Vector2DTypeComplex(vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a default vector space if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeComplex(0, 1, -2, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(1, 2, vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, vSpace as unknown as number, 3, 2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as number, 1, -1, -3)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new Vector2DTypeComplex(0, 1, -2, new Complex() as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(1, 2, new Complex() as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, new Complex() as unknown as number, 3, 2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex() as unknown as number, 1, -1, -3)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a real vector into a user-specified vector space if the user-specified coordinates are not numbers and/or the vector space is not of type complex and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector2DTypeComplex(0, -2, 1, 4, vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new ComplexVectorSpace(1);
            expect(() =>  new Vector2DTypeComplex(0, -2, 1, vSpace as unknown as number, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, -2, vSpace as unknown as number, -2, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, vSpace as unknown as number, -2, 3, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as number, -2, 3, 1, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            expect(() =>  new Vector2DTypeComplex(0, -2, 1, new Complex() as unknown as number, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, -2, new Complex() as unknown as number, -2, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, new Complex() as unknown as number, -2, 3, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex() as unknown as number, -2, 3, 1, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            const vSpace2 = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as number, -2, 1, 0, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, vSpace as unknown as number, -2, 1, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, 1, vSpace as unknown as number, 0, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, 1, -3, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new Vector2DTypeComplex(new Complex() as unknown as number, -2, 1, 0, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, new Complex() as unknown as number, -2, 1, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, 1, new Complex() as unknown as number, 0, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(0, 1, -3, new Complex() as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a default real vector into a user-defined vector space if this vector space is followed by other parameters`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as Complex, new Complex())).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as number, 1, 2, 3)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a default vector space if the user-specified coordinates are not a complex`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(1);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as Complex, new Complex(1, 1))).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, 1), vSpace as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            expect(() =>  new Vector2DTypeComplex(0 as unknown as Complex, new Complex(1, -1))).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, -1), 10 as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector2DTypeComplex(vSpace1 as unknown as Complex, new Complex(1, 1))).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, 1), vSpace1 as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a user-defined vector space if the user-specified coordinates are not a complex`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(1);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, -1), new Complex(1, 1), 1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, -1), new Complex(1, 1), vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, 1), vSpace as unknown as Complex, vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(vSpace as unknown as Complex, new Complex(1, 1), vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new Vector2DTypeComplex(0 as unknown as Complex, new Complex(1, -1), vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, -1), 10 as unknown as Complex, vSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector2DTypeComplex(vSpace1 as unknown as Complex, new Complex(1, 1), vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector2DTypeComplex(new Complex(1, 1), vSpace1 as unknown as Complex, vSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

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

        it(`can get the real part of a component of a complex vector`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.getReal(0);
            expect(result).to.be.eql(complex1.real);
            const result1 = complexVector1.getReal(1);
            expect(result1).to.be.eql(complex2.real);
        });

        it(`cannot get the real part of a component of a complex vector using an index outside the correct range`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getReal(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`cannot get the real part of a component of a complex vector using a negative index`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getReal(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`can get the imaginary part of a component of a complex vector`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.getImaginary(0);
            expect(result).to.be.eql(complex1.imaginary);
            const result1 = complexVector1.getImaginary(1);
            expect(result1).to.be.eql(complex2.imaginary);
        });

        it(`cannot get the imaginary part of a component of a complex vector using an index outside the correct range`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getImaginary(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`cannot get the imaginary part of a component of a complex vector using a negative index`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getImaginary(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`can compute the norm of a vector in 2D complex vector space`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(complexVector1.norm()).to.eql(Math.sqrt(complex1.magnitude() ** 2 + complex2.magnitude() ** 2));
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

        it(`can normalize a complex vector into a 2D default complex vector space using the default tolerance`, () => {
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const normalizedVector = complexVector1.normalize();
            expect(normalizedVector.dimension).to.eql(dimension);
            expect(normalizedVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(normalizedVector.vectorSpace.isDefault).to.eql(true);
            const norm = complexVector1.norm();
            expect(normalizedVector.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].real).to.be.closeTo(complex1.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].imaginary).to.be.closeTo(complex1.imaginary / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].real).to.be.closeTo(complex2.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].imaginary).to.be.closeTo(complex2.imaginary / norm, TOLERANCE_FLOAT);
        });

        it(`cannot normalize a complex vector into a 2D default complex vector space when its norm is smaller than the default tolerance`, () => {
            const smallComplex1 = new Complex(LINEAR_TOL_VECTOR / 2, 0);
            const smallComplex2 = new Complex(0, LINEAR_TOL_VECTOR / 2);
            const complexVector1 = new Vector2DTypeComplex(smallComplex1, smallComplex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(complexVector1.norm()).to.be.lessThan(LINEAR_TOL_VECTOR);
            expect(() => complexVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`can normalize a complex vector into a 2D default complex vector space using a custom tolerance`, () => {
            const smallComplex1 = new Complex(LINEAR_TOL_VECTOR / 2, 0);
            const smallComplex2 = new Complex(0, LINEAR_TOL_VECTOR / 2);
            const complexVector1 = new Vector2DTypeComplex(smallComplex1, smallComplex2);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const normalizedVector = complexVector1.normalize(LINEAR_TOL_VECTOR / 10);
            expect(normalizedVector.dimension).to.eql(dimension);
            expect(normalizedVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(normalizedVector.vectorSpace.isDefault).to.eql(true);
            const norm = complexVector1.norm();
            expect(normalizedVector.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].real).to.be.closeTo(smallComplex1.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].imaginary).to.be.closeTo(smallComplex1.imaginary / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].real).to.be.closeTo(smallComplex2.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].imaginary).to.be.closeTo(smallComplex2.imaginary / norm, TOLERANCE_FLOAT);
        });

        it(`can normalize a complex vector into a 2D user-defined complex vector space using the default tolerance`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            expect(complexVector1.vectorSpace).to.eql(vSpace);
            const normalizedVector = complexVector1.normalize();
            expect(normalizedVector.dimension).to.eql(dimension);
            expect(normalizedVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(normalizedVector.vectorSpace.isDefault).to.eql(false);
            expect(normalizedVector.vectorSpace).to.eql(vSpace);
            const norm = complexVector1.norm();
            expect(normalizedVector.norm()).to.be.closeTo(1, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].real).to.be.closeTo(complex1.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[0].imaginary).to.be.closeTo(complex1.imaginary / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].real).to.be.closeTo(complex2.real / norm, TOLERANCE_FLOAT);
            expect(normalizedVector.coordinates[1].imaginary).to.be.closeTo(complex2.imaginary / norm, TOLERANCE_FLOAT);
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

        it(`cannot map a complex 2D vector into a projective complex vector`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector2DTypeComplex(1, 2, 3, 5, vSpace);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(() => complexVector.toProjectiveComplexVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });

        it(`can map a 2D complex vector into a 4D real vector of a default real vector space`, () => {
            DefaultVectorSpaces.reset();
            const complex1 = new Complex(1, 3);
            const complex2 = new Complex(2, 4);
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            const realVector = complexVector1.toRealVector();
            expect(realVector.dimension).to.eql(4);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(complex1.real);
            expect(realVector.getCoordinate(1)).to.eql(complex1.imaginary);
            expect(realVector.getCoordinate(2)).to.eql(complex2.real);
            expect(realVector.getCoordinate(3)).to.eql(complex2.imaginary);
        });

        it(`can map a 2D complex vector into a 4D real vector of a custom real vector space`, () => {
            DefaultVectorSpaces.reset();
            const complex1 = new Complex(1, 3);
            const complex2 = new Complex(2, 4);
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(complex1, complex2, vSpace);
            const realVSpace = new RealVectorSpace(4);
            const realVector = complexVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(4);
            expect(realVector.vectorType).to.eql(REALVECTOR4D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.getCoordinate(0)).to.eql(complex1.real);
            expect(realVector.getCoordinate(1)).to.eql(complex1.imaginary);
            expect(realVector.getCoordinate(2)).to.eql(complex2.real);
            expect(realVector.getCoordinate(3)).to.eql(complex2.imaginary);
        });

        it(`cannot map a complex 2D vector into a projective complex vector`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector2DTypeComplex(1, 2, 3, 5, vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR2D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => complexVector1.toProjectiveVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});