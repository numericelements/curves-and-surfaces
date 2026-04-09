import { expect } from "chai";
import { Vector1DComplex } from "../../src/mathVector/Vector1DComplex";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { ANGULAR_TOL_VECTOR, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { Complex } from "../../src/mathVector/Complex";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR1D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, REALVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";

describe('Vector 1D in complex vector space: generation and operators in this vector space', () => {
    const dimension = 1;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default complex vector into the default 1D vector space`, () => {
            const complexVector = new Vector1DComplex();
            expect(complexVector.coordinates).to.eql([new Complex()]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex());
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary complex vector into the default 1D vector space using real and imaginary values`, () => {
            const complexVector = new Vector1DComplex(-1, 2);
            expect(complexVector.coordinates).to.eql([new Complex(-1, 2)]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex(-1, 2));
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default complex vector into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(vSpace);
            expect(complexVector.coordinates).to.eql([new Complex()]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex());
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = complexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary complex vector into a 1D vector space using real and imaginary values`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const real = 1;
            const imaginary = -2;
            const complexVector = new Vector1DComplex(real, imaginary, vSpace);
            expect(complexVector.coordinates).to.eql([new Complex(real, imaginary)]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(new Complex(real, imaginary));
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
        });

        it(`can generate an arbitrary complex vector from a Complex into the default 1D vector space`, () => {
            const complex = new Complex(-1, 2);
            const complexVector = new Vector1DComplex(complex);
            expect(complexVector.coordinates).to.eql([complex]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(true);
            const defaultVectorSpace = DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension);
            if(defaultVectorSpace !== undefined) {
                defaultVectorSpaceID = defaultVectorSpace.id;
                expect(complexVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
            }
        });

        it(`can generate an arbitrary complex vector from a Complex into a 1D vector space`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const complex = new Complex(1, -2);
            const complexVector = new Vector1DComplex(complex, vSpace);
            expect(complexVector.coordinates).to.eql([complex]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.getCoordinate(0)).to.eql(complex);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace).to.eql(vSpace);
        });


        it(`cannot generate a default complex vector into a user-defined vector space if this vector space is not of type complex and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(vSpace as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(3);
            expect(() =>  new Vector1DComplex(vSpace1 as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a default vector space if the user-specified coordinates are not numbers`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(0, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector1DComplex(vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a user-specified vector space if the user-specified coordinates are not numbers and/or the vector space is not of type complex and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(0, -2, vSpace as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace1 = new ComplexVectorSpace(2);
            expect(() =>  new Vector1DComplex(0, -2, vSpace1 as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector1DComplex(vSpace as unknown as number, -2, vSpace1 as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace2 = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(vSpace as unknown as number, -2, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector1DComplex(0, vSpace as unknown as number, vSpace2)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a default complex vector into a user-defined vector space if this vector space is followed by other parameters`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(vSpace as unknown as Complex, vSpace)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new Vector1DComplex(vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a complex vector into a default vector space if the user-specified coordinate is not a complex`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ComplexVectorSpace(2);
            expect(() =>  new Vector1DComplex(vSpace as unknown as Complex)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            expect(() =>  new Vector1DComplex(0 as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new RealVectorSpace(2);
            expect(() =>  new Vector1DComplex(vSpace1 as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`can generate a default complex vector into a user-defined vector space if this vector space is type casted into a complex`, () => {
            // Use type casting as allowed by typescript even though this configuration is not making sense
            const vSpace = new ComplexVectorSpace(dimension);
            expect(() =>  new Vector1DComplex(vSpace as unknown as Complex)).to.not.throw();
            const vector = new Vector1DComplex(vSpace as unknown as Complex);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(new Complex());
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(1, 2, vSpace);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
        });

        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(1, 2, vSpace);
            expect(complexVector.dimension).to.eql(dimension);
        });

        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(1, 2, vSpace);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        });

        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(1, 2, vSpace);
            expect(complexVector.vectorSpace).to.eql(vSpace);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
            expect(complexVector.vectorSpace.dimension()).to.eql(dimension);
        });

        it(`can get the coordinates of a vector as real, imaginary parameters`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector = new Vector1DComplex(1, 2, vSpace);
            expect(complexVector.real).to.eql(1);
            expect(complexVector.imaginary).to.eql(2);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the coordinates of a vector as a complex number`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const complex = new Complex(1, 2);
            const complexVector = new Vector1DComplex(complex, vSpace);
            expect(complexVector.coordinates).to.eql([complex]);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new ComplexVectorSpace(dimension);
            const coordinates = [1, 3]
            const complexVector = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector.dimension).to.eql(dimension);
            expect(complexVector.descriptor.type).to.eql(COMPLEX);
            expect(complexVector.descriptor.real).to.eql(coordinates[0]);
            expect(complexVector.descriptor.imaginary).to.eql(coordinates[1]);
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

        it(`can get the real part of a component of a complex vector`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.getReal(0);
            expect(result).to.be.eql(coordinates[0]);
        });

        it(`cannot get the real part of a component of a complex vector using an index outside the correct range`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getReal(1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`cannot get the real part of a component of a complex vector using a negative index`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getReal(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`can get the imaginary part of a component of a complex vector`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.getImaginary(0);
            expect(result).to.be.eql(coordinates[1]);
        });

        it(`cannot get the imaginary part of a component of a complex vector using an index outside the correct range`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getImaginary(1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`cannot get the imaginary part of a component of a complex vector using a negative index`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            expect(() => complexVector1.getImaginary(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`can compute the norm of a vector`, () => {
            const coordinates = [1, 3];
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(true);
            const result = complexVector1.norm();
            const sqSum = coordinates.reduce((sum, c) => sum + c * c, 0);
            expect(result).to.be.closeTo(Math.sqrt(sqSum), TOLERANCE_FLOAT);
        });

        it(`can get the vector descriptor as a string`, () => {
            const coordinates = [1, 3];
            const vSpace1 = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace1);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const string = complexVector1.toString();
            expect(string).to.eql(COMPLEXVECTOR1D + `(${new Complex(coordinates[0], coordinates[1]).toString()})` + ` ` + complexVector1.vectorSpace.toString());
        });

        it(`cannot check the equality of vectors belonging to different vector spaces `, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(() => complexVector1.equals(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });

        it(`cannot check the parallelism of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(() => complexVector1.isParallel(complexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`cannot check the parallelism of vectors if the first one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [1, 3];
            const complexVector2 = new Vector1DComplex(coordinates2[0], coordinates2[1], vSpace);
            expect(() => complexVector1.isParallel(complexVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
        });

        it(`cannot check the parallelism of vectors if the second one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0];
            const complexVector2 = new Vector1DComplex(coordinates2[0], coordinates2[1], vSpace);
            expect(() => complexVector1.isParallel(complexVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
        });

        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVector2 = new Vector1DComplex(coordinates[0], coordinates[1]);
            expect(() => complexVector1.isOrthogonal(complexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can check that two vectors are parallel to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const realVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(realVector1.isParallel(complexVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are parallel to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const perturbedCoordinates = [coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR];
            const complexVector2 = new Vector1DComplex(perturbedCoordinates[0], perturbedCoordinates[1], vSpace);
            expect(complexVector1.isParallel(complexVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not parallel to each other within the default angular tolerance`, () => {
            const coordinates = [0, 2];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            // Empirical coefficient taking into account the cross influence of linear tolerance and angular tolerance
            const coef = 400;
            const coordinates1 = [coordinates[0] + ANGULAR_TOL_VECTOR * coef, coordinates[1]];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(complexVector1.isParallel(complexVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are parallel to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [2, 6];
            const perturbedCoordinates = [coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR];
            const complexVector2 = new Vector1DComplex(perturbedCoordinates[0], perturbedCoordinates[1], vSpace);
            expect(complexVector1.isParallel(complexVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not parallel to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [coordinates[0] + angularTolerance, coordinates[1], coordinates[2], coordinates[3]];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(complexVector1.isParallel(complexVector2)).to.eql(false);
        });


        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [0, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 =  new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates2 = [2, 4];
            const complexVector2 = new Vector1DComplex(coordinates2[0], coordinates2[1]);
            expect(() => complexVector1.isOrthogonal(complexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`cannot check the orthogonality of vectors if the first one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [1, 3];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(() => complexVector1.isOrthogonal(complexVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
        });

        it(`cannot check the orthogonality of vectors if the second one has a norm smaller than the linear tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [LINEAR_TOL_VECTOR / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, 0, 0, 0];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(() => complexVector1.isOrthogonal(complexVector2)).to.throw(EM_VECTOR_NORM_TOO_SMALL);
        });

        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1], vSpace);
            expect(complexVector1.isOrthogonal(complexVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DComplex(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, vSpace);
            expect(complexVector1.isOrthogonal(complexVector2)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1] + ANGULAR_TOL_VECTOR * 4, vSpace);
            expect(complexVector1.isOrthogonal(complexVector2)).to.eql(false);
        });

        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2];
            const complexVector2 = new Vector1DComplex(coordinates1[0] + LINEAR_TOL_VECTOR, coordinates1[1] + LINEAR_TOL_VECTOR, vSpace);
            expect(complexVector1.isOrthogonal(complexVector2, angularTolerance)).to.eql(true);
        });

        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3];
            const angularTolerance = 1e-4;
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            expect(complexVector1.dimension).to.eql(dimension);
            expect(complexVector1.vectorType).to.eql(COMPLEXVECTOR1D);
            expect(complexVector1.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0];
            const complexVector2 = new Vector1DComplex(coordinates1[0], coordinates1[1] + angularTolerance * 4, vSpace);
            expect(complexVector1.isOrthogonal(complexVector2, angularTolerance)).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a projective complex vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector();
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a projective complex vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights, true);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace).to.eql(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a projective complex vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights, true);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace).to.eql(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a custom projective complex vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(2);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.vectorSpace).to.eql(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a custom projective complex vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.AllPositiveWeights);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.vectorSpace).to.eql(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D projective complex vector of a custom projective complex vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(2, WeightManagement.SomeNullWeights);
            const projectiveComplexVector = complexVector1.toProjectiveComplexVector(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.dimension).to.eql(2);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.vectorSpace).to.eql(projectiveComplexVectorSpace);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex(coordinates[0], coordinates[1]));
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 2D real vector of a default real vector space`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const realVector = complexVector1.toRealVector();
            expect(realVector.dimension).to.eql(2);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
        });

        it(`can map a 1D complex vector into a 2D real vector of a custom real vector space`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const realVSpace = new RealVectorSpace(2);
            const realVector = complexVector1.toRealVector(realVSpace);
            expect(realVector.dimension).to.eql(2);
            expect(realVector.vectorType).to.eql(REALVECTOR2D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(realVector.getCoordinate(1)).to.eql(coordinates[1]);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVector = complexVector1.toProjectiveRealVector();
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);            
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(3, WeightManagement.AllPositiveWeights, true);
            const projectiveRealVector = complexVector1.toProjectiveRealVector(projectiveRealVectorSpace);
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);            
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            DefaultVectorSpaces.reset();
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(3, WeightManagement.SomeNullWeights, true);
            const projectiveRealVector = complexVector1.toProjectiveRealVector(projectiveRealVectorSpace);
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);            
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a custom projective vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(3, WeightManagement.AllStrictlyPositiveWeights);
            const projectiveRealVector = complexVector1.toProjectiveRealVector(projectiveRealVectorSpace);
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveRealVector.vectorSpace).to.eql(projectiveRealVectorSpace);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a custom projective vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(3, WeightManagement.AllPositiveWeights);
            const projectiveRealVector = complexVector1.toProjectiveRealVector(projectiveRealVectorSpace);
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveRealVector.vectorSpace).to.eql(projectiveRealVectorSpace);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(false);
        });

        it(`can map a 1D complex vector into a 3D projective vector of a custom projective vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const coordinates = [1, 3];
            const vSpace = new ComplexVectorSpace(dimension);
            const complexVector1 = new Vector1DComplex(coordinates[0], coordinates[1], vSpace);
            const projectiveRealVectorSpace = new ProjectiveRealVectorSpace(3, WeightManagement.SomeNullWeights);
            const projectiveRealVector = complexVector1.toProjectiveRealVector(projectiveRealVectorSpace);
            expect(projectiveRealVector.dimension).to.eql(3);
            expect(projectiveRealVector.vectorType).to.eql(PROJECTIVEREALVECTOR2D);
            expect(projectiveRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVEREAL);
            expect(projectiveRealVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveRealVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveRealVector.vectorSpace).to.eql(projectiveRealVectorSpace);
            expect(projectiveRealVector.getCoordinate(0)).to.eql(coordinates[0]);
            expect(projectiveRealVector.getCoordinate(1)).to.eql(coordinates[1]);
            expect(projectiveRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveRealVector.weight.strictlyPositive).to.eql(true);
        });
    });
});