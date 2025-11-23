import { expect } from "chai";
import { Vector1DTypeComplex } from "../../src/mathVector/Vector1DTypeComplex";
import { COMPLEX, COMPLEXVECTOR1D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Vector2DTypeComplex } from "../../src/mathVector/Vector2DTypeComplex";
import { EM_VECTORS_DIFFERENT_DIM } from "../../src/namedConstants/Vectors";

describe('Vector 1D in complex vector space: generation and operators in this vector space', () => {
    const dimension = 1;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default complex vector into the default 1D vector space`, () => {
            const complexVector = new Vector1DTypeComplex();
            // expect(complexVector.coordinates).to.eql([{ type: COMPLEX, real: 0, imaginary: 0 }]);
            expect(complexVector.coordinates).to.eql([0, 0]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql({ type: COMPLEX, real: 0, imaginary: 0 });
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into the default 1D vector space`, () => {
            const complexVector = new Vector1DTypeComplex(-1, 2);
            // expect(complexVector.coordinates).to.eql([{ type: COMPLEX, real: -1, imaginary: 2 }]);
            expect(complexVector.coordinates).to.eql([-1, 2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql({ type: COMPLEX, real: -1, imaginary: 2 });
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default real vector into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(vSpace);
            // expect(complexVector.coordinates).to.eql([{ type: COMPLEX, real: 0, imaginary: 0 }]);
            expect(complexVector.coordinates).to.eql([0, 0]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql({ type: COMPLEX, real: 0, imaginary: 0 });
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const complexVector = new Vector1DTypeComplex(1, -2, vSpace);
            // expect(complexVector.coordinates).to.eql([{ type: COMPLEX, real: 1, imaginary: -2 }]);
            expect(complexVector.coordinates).to.eql([1, -2]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql({ type: COMPLEX, real: 1, imaginary: -2 });
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(1, 2, vSpace);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
        });

        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(1, 2, vSpace);
            expect(complexVector.dimension).to.eql(dimension);
        });

        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(1, 2, vSpace);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        });

        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(1, 2, vSpace);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace.dimension()).to.eql(dimension);
        });

        it(`can get the coordinates of a vector as real, imaginary parameters`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DTypeComplex(1, 2, vSpace);
            expect(complexVector.real).to.eql(1);
            expect(complexVector.imaginary).to.eql(2);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const coordinates = [1, 3]
            const complexVector = new Vector1DTypeComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.descriptor.type).to.eql(COMPLEX);
            expect(complexVector.descriptor.real).to.eql(coordinates[0]);
            expect(complexVector.descriptor.imaginary).to.eql(coordinates[1]);
        });
    });

    describe('Methods', () => {

        it(`cannot add a vector with another vector of different dimension`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DTypeComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const complexVector2 = new Vector2DTypeComplex(2);
            expect(complexVector2.dimension).to.not.eql(complexVector1.dimension);
            expect(() => complexVector1.add(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

        it(`cannot subtract a vector from another vector of different dimension`, () => {
            const coordinates = [1, 3];
            const realVector1 = new Vector1DTypeComplex(coordinates[0], coordinates[1]);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(realVector1.vectorSpace.isDefault).to.eql(true);
            const realVector2 = new Vector2DTypeComplex(2);
            expect(realVector2.dimension).to.not.eql(realVector1.dimension);
            expect(() => realVector1.subtract(realVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });
    });
});