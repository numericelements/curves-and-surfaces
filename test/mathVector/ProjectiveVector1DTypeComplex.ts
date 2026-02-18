import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ProjectiveVector1DTypeComplex } from "../../src/mathVector/ProjectiveVector1DTypeComplex";
import { Complex } from "../../src/mathVector/Complex";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { Weight } from "../../src/mathVector/Weight";
import { MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../src/namedConstants/ProjectiveComplexVectorSpace";
import { ComplexWeight } from "../../src/mathVector/ComplexWeight";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_NORM_TOO_SMALL, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, EM_VECTORSPACE_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../../src/ErrorMessages/WeightManager";
import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL } from "../../src/ErrorMessages/ComplexOperators";
import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../../src/ErrorMessages/ComplexWeight";
import { EM_COMPLEX_WEIGHT_TOO_SMALL, EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX, EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../../src/ErrorMessages/ProjectiveComplexVectors";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXWEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { PROJECTIVECOMPLEXVECTOR1D } from "../../src/namedConstants/VectorTypeTags";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { TOLERANCE_MIN_MAGNITUDE } from "../../src/namedConstants/Complex";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { INITIAL_VECTOR_SPACE_ID } from "../../src/namedConstants/VectorSpaceIdentifierManager";
import { createMockVectorSpace } from "./internal/VectorSpaceIdentifierManager";

describe('Vector 1D in projective complex vector space: generation and operators in this vector space', () => {
    const dimension = 2;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    describe('Constructor', () => {
            let realWeight = new Weight(2);
            let imaginaryWeight = new Weight(5);
            let complexWeight = new ComplexWeight(realWeight, imaginaryWeight);

        it(`can generate a default projective complex vector into the default 2D vector space`, () => {
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex();
            expect(projectiveComplexVector.coordinates).to.eql([new Complex(), new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex());
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = projectiveComplexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary projective complex vector with default weight into the default 2D projective complex vector space`, () => {
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates.real, complexCoordinates.imaginary);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex weight into the default 2D projective complex vector space`, () => {
            const complexCoordinates = new Complex(-1, 3);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates.real, complexCoordinates.imaginary, realWeight, imaginaryWeight);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(complexWeight.real.value, complexWeight.imaginary.value)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(complexWeight.real.value, complexWeight.imaginary.value));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(realWeight.strictlyPositive);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(imaginaryWeight.strictlyPositive);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex value and default weight into the default 2D projective complex vector space`, () => {
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex value and weight into the default 2D projective complex vector space`, () => {
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates, complexWeight);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(complexWeight.real.value, complexWeight.imaginary.value)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(realWeight.value, imaginaryWeight.value));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
        });

        it(`can generate a default projective complex vector with a default complex weight into a user specific 2D vector space`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(vectorSpace);
            expect(projectiveComplexVector.coordinates).to.eql([new Complex(), new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex());
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with default weight into a user specific 2D complex vector space`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates.real, complexCoordinates.imaginary, vectorSpace);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate a projective complex vector with prescribed coordinates into a user specific 2D complex vector space`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const complexCoordinates = new Complex(-1, 3);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates.real, complexCoordinates.imaginary, realWeight, imaginaryWeight, vectorSpace);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(complexWeight.real.value, complexWeight.imaginary.value)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(complexWeight.real.value, complexWeight.imaginary.value));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(realWeight.strictlyPositive);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(imaginaryWeight.strictlyPositive);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex value and default weight into a user specific 2D projective complex vector space`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates, vectorSpace);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_IMAGINARY_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex value and weight into a user specific 2D projective complex vector space`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates, complexWeight, vectorSpace);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(complexWeight.real.value, complexWeight.imaginary.value)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(realWeight.value, imaginaryWeight.value));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate a default complex projective complex vector with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(vSpace);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            let weightMgmt = projectiveComplexVector.vectorSpace.weightManagement;
            expect(weightMgmt).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([new Complex(), new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex());
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
        });

        it(`can generate an arbitrary projective complex vector with prescribed real values and weights with weight management ${WeightManagement.SomeNullWeights} into a user specific 2D projective complex vector space and strictly positive status true`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            realWeight = new Weight(3);
            imaginaryWeight = new Weight(2);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(-1, 2, realWeight, imaginaryWeight, vectorSpace);
            const complex1 = new Complex(-1, 2);
            const complex2 = new Complex(realWeight.value, imaginaryWeight.value);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complex1, complex2]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complex1);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(complex2);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with prescribed real values and weights with weight management ${WeightManagement.SomeNullWeights} into a user specific 2D projective complex vector space and strictly positive status false`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            realWeight = new Weight(0, false);
            imaginaryWeight = new Weight(2, false);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(-1, 2, realWeight, imaginaryWeight, vectorSpace);
            const complex1 = new Complex(-1, 2);
            const complex2 = new Complex(realWeight.value, imaginaryWeight.value);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complex1, complex2]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complex1);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(complex2);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex values and weights with weight management ${WeightManagement.SomeNullWeights} into a user specific 2D projective complex vector space and strictly positive status true`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            realWeight = new Weight(3);
            imaginaryWeight = new Weight(2);
            const complex1 = new Complex(-1, 2);
            const complexW = new ComplexWeight(realWeight, imaginaryWeight);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex1, complexW, vectorSpace);
            const complex2 = new Complex(realWeight.value, imaginaryWeight.value);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complex1, complex2]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complex1);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(complex2);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        it(`can generate an arbitrary projective complex vector with prescribed complex values and weights with weight management ${WeightManagement.SomeNullWeights} into a user specific 2D projective complex vector space and strictly positive status false`, () => {
            const vectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            realWeight = new Weight(0, false);
            imaginaryWeight = new Weight(2, false);
            const complex1 = new Complex(-1, 2);
            const complexW = new ComplexWeight(realWeight, imaginaryWeight);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex1, complexW, vectorSpace);
            const complex2 = new Complex(realWeight.value, imaginaryWeight.value);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complex1, complex2]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complex1);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(complex2);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.real.value).to.eql(realWeight.value);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(false);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(imaginaryWeight.value);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace).to.eql(vectorSpace);
        });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
        //     expect(vSpace.isDefault).to.eql(true);
        //     expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        // });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false))).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        // });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.SomeNullWeights} into the default projective complex vector space`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
        //     expect(vSpace.isDefault).to.eql(true);
        //     expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        // });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into a user-defined projective complex vector space`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
        //     expect(vSpace.isDefault).to.eql(false);
        //     expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        // });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.SomeNullWeights} into a user-defined projective complex vector space`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
        //     expect(vSpace.isDefault).to.eql(false);
        //     expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        // });

        // Removed because the imaginary weight management is set free to fit with a default imaginary weight set to 0
        // it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.SomeNullWeights} into a user-defined projective complex vector space`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
        //     expect(vSpace.isDefault).to.eql(false);
        //     expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        //     expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2, false), new Weight(3), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        // });

        it(`cannot generate a projective complex vector using real weights of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2, false), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a complex projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2, false), new Weight(3, false))).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a complex projective complex vector using real weights of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2, false), new Weight(3, false), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of incorrect strictly positive status of imaginary weight with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2, false), new Weight(3), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)))).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2), new Weight(3)), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2), new Weight(3)), vSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot generate a default projective vector into a user-defined vector space if this vector space is not of type projective complex and of same dimension as the vector`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            const vSpace1 = new ProjectiveVectorSpace(3);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a default vector space if the user-specified coordinates are not a complex and a complex weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const complex = new Complex(0, 2);
            const complexW = new ComplexWeight();
            const weightR = new Weight(2);
            const weightI = new Weight(4);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace as unknown as ComplexWeight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex, complexW)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as Complex, complexW)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex, complexW)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, complex as unknown as ComplexWeight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex, complexW)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, 3 as unknown as ComplexWeight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weightR as unknown as Complex, complexW)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, weightI as unknown as ComplexWeight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a user-defined vector space if the user-specified coordinates are not a complex and a complex weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(0, 2);
            const complexW = new ComplexWeight();
            const weightR = new Weight(2);
            const weightI = new Weight(4);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace as unknown as ComplexWeight, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex, complexW, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace as unknown as ComplexWeight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex, complexW, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as Complex, complexW, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as Complex, complexW, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex, complexW, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, complex as unknown as ComplexWeight, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex, complexW, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, complex as unknown as ComplexWeight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex, complexW, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, 3 as unknown as ComplexWeight, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex, complexW, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, 3 as unknown as ComplexWeight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weightR as unknown as Complex, complexW, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, weightI as unknown as ComplexWeight, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(weightR as unknown as Complex, complexW, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, weightI as unknown as ComplexWeight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace1 as unknown as ComplexWeight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace1 as unknown as ComplexWeight, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, complexW, weightR as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a default vector space with a default complex weight if the user-specified coordinate is not a complex only`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const complexW = new ComplexWeight();
            const weight = new Weight(2);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weight as unknown as Complex)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a user-specified vector space with a default complex weight if the user-specified coordinate is not a complex only`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const complexW = new ComplexWeight();
            const weight = new Weight(2);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as Complex, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
       
            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as Complex, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(-1 as unknown as Complex, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weight as unknown as Complex, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(weight as unknown as Complex, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a default vector space if the user-specified coordinates are not a real and imaginary parts and the weight is not real and imaginary weights`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const weightR = new Weight(2);
            const weightI = new Weight(3);
            const complex = new Complex(-1, 3);
            const complexW = new ComplexWeight(new Weight(3), new Weight(2));
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, 1, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complex as unknown as number, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as number, 1, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complexW as unknown as number, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as number, 1, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace1 as unknown as number, weightR, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, 2 as unknown as Weight, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, 3 as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, complex as unknown as Weight, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, complex as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, complexW as unknown as Weight, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, complexW as unknown as Weight)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, vSpace1 as unknown as Weight, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, vSpace1 as unknown as Weight )).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, complexW as unknown as number, vSpace1 as unknown as Weight, weightI)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector into a user-defined vector space if the user-specified coordinates are not a real and imaginary parts and the weight is not real and imaginary weights`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const weightR = new Weight(2);
            const weightI = new Weight(3);
            const complex = new Complex(-1, 3);
            const complexW = new ComplexWeight(new Weight(3), new Weight(2));
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1, weightR, weightI, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number, weightR, weightI, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, 1, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complex as unknown as number, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as number, 1, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complexW as unknown as number, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as number, 1, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace1 as unknown as number, weightR, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, 2 as unknown as Weight, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, 3 as unknown as Weight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, complex as unknown as Weight, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, complex as unknown as Weight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, complexW as unknown as Weight, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, complexW as unknown as Weight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, vSpace1 as unknown as Weight, weightI, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, weightR, vSpace1 as unknown as Weight, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        })

        it(`cannot generate a projective complex vector into a default vector space if the user-specified coordinates are not a real and imaginary parts with a default complex weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const weight = new Weight(2);
            const complex = new Complex(-1, 3);
            const complexW = new ComplexWeight(new Weight(3), new Weight(2));
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complex as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complexW as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace1 as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weight as unknown as number, 1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, weight as unknown as number)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

    it(`cannot generate a projective complex vector into a user-defined vector space if the user-specified coordinates are not a real and imaginary parts with a default complex weight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new RealVectorSpace(dimension);
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const weight = new Weight(2);
            const complex = new Complex(-1, 3);
            const complexW = new ComplexWeight(new Weight(3), new Weight(2));
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number, vSpace as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as number, 1, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace as unknown as number, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, 1, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complex as unknown as number, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(complexW as unknown as number, 1, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, complexW as unknown as number, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace1 as unknown as number, 1, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, vSpace1 as unknown as number, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);

            expect(() =>  new ProjectiveVector1DTypeComplex(weight as unknown as number, 1, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            expect(() =>  new ProjectiveVector1DTypeComplex(0, weight as unknown as number, vSpace1)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        
            expect(() =>  new ProjectiveVector1DTypeComplex(0, 1, complexW as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
        });

        it(`can generate a user-defined complex projective vector into a user-defined vector space even if the vector space is type casted into a ComplexWeight`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 3);
            const defaultComplexWeight = new ComplexWeight();
            const defComplxWeightValues = new Complex(defaultComplexWeight.real.value, defaultComplexWeight.imaginary.value);
            expect(() =>  new ProjectiveVector1DTypeComplex(complex, vSpace as unknown as ComplexWeight)).to.not.throw();
            const vector = new ProjectiveVector1DTypeComplex(complex, vSpace as unknown as ComplexWeight);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(complex);
            expect(vector.getCoordinate(1)).to.eql(defComplxWeightValues);
            expect(vector.weight).to.eql(defaultComplexWeight);
        });

        it(`can generate a default complex projective vector into a user-defined vector space even if the vector space is type casted into a Complex`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const defaultComplexWeight = new ComplexWeight();
            const defComplxWeightValues = new Complex(defaultComplexWeight.real.value, defaultComplexWeight.imaginary.value);
            expect(() =>  new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex)).to.not.throw();
            const vector = new ProjectiveVector1DTypeComplex(vSpace as unknown as Complex);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(new Complex());
            expect(vector.getCoordinate(1)).to.eql(defComplxWeightValues);
            expect(vector.weight).to.eql(defaultComplexWeight);
        });

        it(`can generate a user-defined complex projective vector into a user-defined vector space even if the vector space is type casted into real and imaginary coordinates`, () => {
            // Use type casting as allowed by typescript even though they describe configurations that should be avoided
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 4);
            const defComplxWeight = new ComplexWeight();
            const defCmplxWeightValues = new Complex(defComplxWeight.real.value, defComplxWeight.imaginary.value)
            expect(() =>  new ProjectiveVector1DTypeComplex(complex as unknown as number, vSpace as unknown as number)).to.not.throw();
            const vector = new ProjectiveVector1DTypeComplex(complex as unknown as number, vSpace as unknown as number);
            expect(vector.vectorSpace).to.eql(vSpace);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.getCoordinate(0)).to.eql(complex);
            expect(vector.getCoordinate(1)).to.eql(defCmplxWeightValues);
            expect(vector.weight).to.eql(defComplxWeight);
        });
    });

    describe('Accessors', () => {
        it(`can get the vector type of a vector`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(1, 2, vSpace);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
        });

        it(`can get the dimension of the vector space where the vector is defined`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(1, 2, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
        });

        it(`can get the vector space type of the vector space where the vector is defined`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(1, 2, vSpace);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
        });

        it(`can get the vector space where the vector is defined`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(1, 2, vSpace);
            expect(projectiveComplexVector.vectorSpace).to.eql(vSpace);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.dimension()).to.eql(dimension);
        });

        it(`can get the coordinates of a vector as an array of complex numbers`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(1, -2);
            const complexW = new ComplexWeight(new Weight(2), new Weight());
            const weights = new Complex(complexW.real.value, complexW.imaginary.value);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.coordinates[0]).to.eql(complex);
            expect(projectiveComplexVector.coordinates[1]).to.eql(weights);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the homogeneous coordinates of a projective compplex vector as an array of complex numbers`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(5);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.homogeneousComplexCoordinates).to.eql([complex, new Complex(realW.value, imaginaryW.value)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a complex projective vector`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(1, 3);
            const realW = new Weight(2);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.descriptor.coordinates[0].type).to.eql(COMPLEX);
            expect(projectiveComplexVector.descriptor.coordinates[0].real).to.eql(complex.real);
            expect(projectiveComplexVector.descriptor.coordinates[0].imaginary).to.eql(complex.imaginary);
            expect(projectiveComplexVector.descriptor.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(projectiveComplexVector.descriptor.coordinates[1].real).to.eql(realW);
            expect(projectiveComplexVector.descriptor.coordinates[1].imaginary).to.eql(imaginaryW);
        });

        it(`can get the weight of a vector as a complex weight in a default vector space with weight management ` + WeightManagement.AllStrictlyPositiveWeights, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
            const complex = new Complex(1, -2);
            const complexW = new ComplexWeight(new Weight(2), new Weight());
            const weights = new Complex(complexW.real.value, complexW.imaginary.value);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(projectiveComplexVector.weight.imaginary.strictlyPositive)
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the weight of a vector as a complex weight in a default vector space with weight management ` + WeightManagement.AllPositiveWeights, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights)
            const complex = new Complex(1, -2);
            const complexW = new ComplexWeight(new Weight(2, false), new Weight(DEFAULT_WEIGHT_VALUE, false));
            const weights = new Complex(complexW.real.value, complexW.imaginary.value);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(projectiveComplexVector.weight.imaginary.strictlyPositive)
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the weight of a vector as a complex weight in a default vector space with weight management ` + WeightManagement.SomeNullWeights, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
            const complex = new Complex(1, -2);
            const complexW = new ComplexWeight(new Weight(2, false), new Weight(0, false));
            const weights = new Complex(complexW.real.value, complexW.imaginary.value);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(projectiveComplexVector.weight.imaginary.strictlyPositive)
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        });
    });

    describe('Methods', () => {

        it(`can get a coordinate of a vector as a complex number`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates = [complex, new Complex(realW.value, imaginaryW.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            for (let i = 0; i < dimension; i++) {
                expect(projectiveComplexVector.getCoordinate(i)).to.eql(coordinates[i]);
            }
        });

        it(`can get the vector descriptor as a string`, () => {
            const coordinates = new Complex(1, 3);
            const complexW = new ComplexWeight(new Weight(), new Weight(2))
            const vSpace1 = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(coordinates, complexW, vSpace1);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            const string = projectiveComplexVector.toString();
            expect(string).to.eql(PROJECTIVECOMPLEXVECTOR1D + `(${coordinates.toString()}, ${complexW.toString()})` + ` ` + projectiveComplexVector.vectorSpace.toString());
        });

        it(`cannot get a coordinate of a vector when the coordinate index is negative`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector.getCoordinate(-1)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`cannot get a coordinate of a vector when the coordinate index is greater than the vector space dimension`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector.getCoordinate(dimension)).to.throw(EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
        });

        it(`can clone a vector living into a user-specified vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates = [complex, new Complex(realW.value, imaginaryW.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            const newProjComplexVector = projectiveComplexVector.clone();
            expect(newProjComplexVector.dimension).to.eql(dimension);
            expect(newProjComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(newProjComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(newProjComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(newProjComplexVector.coordinates).to.eql(coordinates.slice(0, dimension));
            expect(newProjComplexVector.weight).to.eql(complexW);
        });

        it(`can clone a vector living into a user-specified vector space with ${WeightManagement.AllPositiveWeights} and a null weight`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const nullWeight = new Weight(0, false);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const complexW = new ComplexWeight(realW, nullWeight);
            const coordinates = [complex, new Complex(realW.value, nullWeight.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            const projCoordinates = coordinates.slice(0, dimension);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            const newProjComplexVector = projectiveComplexVector.clone();
            expect(newProjComplexVector.dimension).to.eql(dimension);
            expect(newProjComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(newProjComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(newProjComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(newProjComplexVector.coordinates).to.eql(projCoordinates);
            expect(newProjComplexVector.weight).to.eql(complexW);
        });

        it(`can clone a vector living into a default vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates = [complex, new Complex(realW.value, imaginaryW.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            const newProjComplexVector = projectiveComplexVector.clone();
            expect(newProjComplexVector.dimension).to.eql(dimension);
            expect(newProjComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(newProjComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(newProjComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(newProjComplexVector.coordinates).to.eql(coordinates.slice(0, dimension));
            expect(newProjComplexVector.weight).to.eql(complexW);
        });

        it(`can clone a vector living into a default vector space with ${WeightManagement.SomeNullWeights} and a null weight`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const nullWeight = new Weight(0, false);
            const complexW = new ComplexWeight(realW, nullWeight);
            const coordinates = [complex, new Complex(realW.value, nullWeight.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW,vSpace);
            const projCoordinates = coordinates.slice(0, dimension);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            const newProjComplexVector = projectiveComplexVector.clone();
            expect(newProjComplexVector.dimension).to.eql(dimension);
            expect(newProjComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(newProjComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(newProjComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(newProjComplexVector.coordinates).to.eql(projCoordinates);
            expect(newProjComplexVector.weight).to.eql(complexW);
        });

        it(`can add a vector with another complex projective vector in the same default vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add a vector with another complex projective vector in the same user-defined vector space with ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add a vector with another complex projective vector in the same default vector space with ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(0, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can add a vector with another complex projective vector in the same user-defined vector space with ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const complex = new Complex(-1, 2);
            const realW = new Weight(0, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can add a vector with another complex projective vector in the same default vector space with ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(0, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add a vector with another complex projective vector in the same user-defined vector space with ${WeightManagement.SomeNullWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const complex = new Complex(1, -2);
            const realW = new Weight(0, false);
            const imaginaryW = new Weight(3, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add a vector with another complex projective vector in the same default vector space with weight smaller than ${NULL_WEIGHT_TOLERANCE} with ${WeightManagement.AllStrictlyPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(3);
            const imaginaryW1 = new Weight();
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.getCoordinate(dimension - 1)).to.eql(coordinates1[1].add(coordinates2[1]));
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add a vector with another complex projective vector in the same default vector space with weight smaller than ${NULL_WEIGHT_TOLERANCE} with ${WeightManagement.AllPositiveWeights} without influence of NULL_WEIGHT_TOLERANCE`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const imaginaryW = new Weight(2, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false); 
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const result = projectiveComplexVector1.add(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].add(coordinates2[i]));
            }
            expect(result.getCoordinate(dimension - 1)).to.eql(coordinates1[1].add(coordinates2[1]));
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot add complex projective vectors with different weight statuses under ${WeightManagement.AllPositiveWeights} weight management and get a resulting vector with complex weight status strictly positive: false`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const imaginaryW = new Weight(2, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE); 
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            expect(() => new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace)).to.throw(EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
        });

        it(`cannot add a vector with another vector of same dimension but belonging to another vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const imaginaryW = new Weight(2, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false); 
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const vSpace2 = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vSpace2);
            expect(projectiveComplexVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector2.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => projectiveComplexVector1.add(projectiveComplexVector2)).to.throw(EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });

        it(`can subtract a vector from another complex projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(true);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can subtract a vector from another complex projective vector of same dimension in the same user-defined vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight();
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`can subtract a vector from another complex projective vector of same dimension in the same default vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(true);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(true);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract a vector from another complex projective vector of same dimension in the same user-defined vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract a vector from another complex projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into an arbitrary small positive weight`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue - NULL_WEIGHT_TOLERANCE);
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.getCoordinate(1).real).to.eql(realWeightValue - realW1.value);
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(true);
            expect(result.weight.imaginary.strictlyPositive).to.eql(true);
        });

        it(`cannot subtract a vector from another complex projective vector with weight management ${WeightManagement.AllStrictlyPositiveWeights} resulting into a negative weight difference even smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue);
            const imaginaryW = new Weight(4);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue + NULL_WEIGHT_TOLERANCE / 2);
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector1.subtract(projectiveComplexVector2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });

        it(`can subtract a vector from another complex projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue + NULL_WEIGHT_TOLERANCE / 2, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.getCoordinate(1).real).to.eql(0);
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract a vector from another complex projective vector with weight management ${WeightManagement.AllPositiveWeights} resulting into a negative weight difference larger than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue + NULL_WEIGHT_TOLERANCE, false);
            const imaginaryW1 = new Weight(3, false);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector1.subtract(projectiveComplexVector2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });

        it(`can subtract a vector from another complex projective vector with weight management ${WeightManagement.SomeNullWeights} when each vector has a different weight status. The resulting weight status being false when the resulting weight is strictly positive and smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue - NULL_WEIGHT_TOLERANCE / 2);
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.getCoordinate(1).real).to.eql(realWeightValue - realW1.value);
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract a vector from another projective vector with weight management ${WeightManagement.SomeNullWeights} resulting into a negative weight difference smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const complex = new Complex(-1, 2);
            const realWeightValue = 2;
            const realW = new Weight(realWeightValue, false);
            const imaginaryW = new Weight(4, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates1 = [complex, new Complex(realW.value, imaginaryW.value)]
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vectorSpace = projectiveComplexVector1.vectorSpace;
            const complex2 = new Complex(2, 1);
            const realW1 = new Weight(realWeightValue + NULL_WEIGHT_TOLERANCE / 2);
            const imaginaryW1 = new Weight(3);
            const complexW1 = new ComplexWeight(realW1, imaginaryW1);
            const coordinates2 = [complex2, new Complex(realW1.value, imaginaryW1.value)]
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace);
            expect(projectiveComplexVector2.vectorSpace.isDefault).to.eql(false);
            const result = projectiveComplexVector1.subtract(projectiveComplexVector2);
            for (let i = 0; i < dimension - 1; i++) {
                expect(result.getCoordinate(i)).to.eql(coordinates1[i].subtract(coordinates2[i]));
            }
            expect(result.getCoordinate(1).real).to.eql(0);
            expect(result.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(result.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(result.dimension).to.eql(dimension);
            expect(result.vectorSpace.isDefault).to.eql(false);
            expect(result.vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(result.weight.real.strictlyPositive).to.eql(false);
            expect(result.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot check the equality of vectors belonging to different vector spaces of same type `, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const projectiveComplexVector2 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(() => projectiveComplexVector1.equals(projectiveComplexVector2)).to.throw(EM_VECTORS_DIFFERENT_VECTOR_SPACES);
        });

        it(`cannot revert a vector because it would produce negative weights `, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector1.revert()).to.throw(EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX);
        });

        it(`can get the complex coordinates of a projective complex vector as an array of numbers`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const coordinates = [complex, new Complex(realW.value, imaginaryW.value)];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVector.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector.weight).to.eql(complexW);
            const coordInArray = projectiveComplexVector.toArray();
            expect(coordInArray[0]).to.eql(projectiveComplexVector.getCoordinate(0).real);
            expect(coordInArray[1]).to.eql(projectiveComplexVector.getCoordinate(0).imaginary);
            expect(coordInArray[2]).to.eql(projectiveComplexVector.getCoordinate(1).real);
            expect(coordInArray[3]).to.eql(projectiveComplexVector.getCoordinate(1).imaginary);
        });

        it(`can normalize a projective complex vector of a default vector space using the default tolerance`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            const normalizedProjectiveComplexVector = projectiveComplexVector1.normalize();
            const normProjVect = projectiveComplexVector1.norm();
            expect(normProjVect).to.be.greaterThan(LINEAR_TOL_VECTOR);
            expect(normalizedProjectiveComplexVector.dimension).to.eql(dimension);
            expect(normalizedProjectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(normalizedProjectiveComplexVector.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(normalizedProjectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            const normalizedWeight = normalizedProjectiveComplexVector.weight.toComplex();
            expect(normalizedWeight.real).to.be.closeTo(complexW.real.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedWeight.imaginary).to.be.closeTo(complexW.imaginary.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).real).to.be.closeTo(complex.real / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).imaginary).to.be.closeTo(complex.imaginary / normProjVect, TOLERANCE_FLOAT);
        });

        it(`can normalize a projective complex vector of a user-defined vector space using the default tolerance`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const normalizedProjectiveComplexVector = projectiveComplexVector1.normalize();
            const normProjVect = projectiveComplexVector1.norm();
            expect(normProjVect).to.be.greaterThan(LINEAR_TOL_VECTOR);
            expect(normalizedProjectiveComplexVector.dimension).to.eql(dimension);
            expect(normalizedProjectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(normalizedProjectiveComplexVector.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(normalizedProjectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            const normalizedWeight = normalizedProjectiveComplexVector.weight.toComplex();
            expect(normalizedWeight.real).to.be.closeTo(complexW.real.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedWeight.imaginary).to.be.closeTo(complexW.imaginary.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).real).to.be.closeTo(complex.real / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).imaginary).to.be.closeTo(complex.imaginary / normProjVect, TOLERANCE_FLOAT);
        });

        it(`cannot normalize a projective complex vector of a user-defined vector space when its norm is smaller than the default tolerance`, () => {
            const complex = new Complex(LINEAR_TOL_VECTOR / 2, 0);
            const realW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const imaginaryW = new Weight(LINEAR_TOL_VECTOR / 2, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const normProjVect = projectiveComplexVector1.norm();
            expect(normProjVect).to.be.lessThan(LINEAR_TOL_VECTOR);
            expect(() => projectiveComplexVector1.normalize()).to.throw(EM_NORM_TOO_SMALL);
        });

        it(`can normalize a projective complex vector of a default vector space using a custom tolerance`, () => {
            const complex = new Complex(LINEAR_TOL_VECTOR / 2, 0);
            const realW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const imaginaryW = new Weight(LINEAR_TOL_VECTOR / 2, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            const normalizedProjectiveComplexVector = projectiveComplexVector1.normalize(LINEAR_TOL_VECTOR / 10);
            const normProjVect = projectiveComplexVector1.norm();
            expect(normProjVect).to.be.lessThan(LINEAR_TOL_VECTOR);
            expect(normalizedProjectiveComplexVector.dimension).to.eql(dimension);
            expect(normalizedProjectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(normalizedProjectiveComplexVector.vectorSpace).to.eql(projectiveComplexVector1.vectorSpace);
            expect(normalizedProjectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            const normalizedWeight = normalizedProjectiveComplexVector.weight.toComplex();
            expect(normalizedWeight.real).to.be.closeTo(complexW.real.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedWeight.imaginary).to.be.closeTo(complexW.imaginary.value / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).real).to.be.closeTo(complex.real / normProjVect, TOLERANCE_FLOAT);
            expect(normalizedProjectiveComplexVector.getCoordinate(0).imaginary).to.be.closeTo(complex.imaginary / normProjVect, TOLERANCE_FLOAT);
        });

        it(`can apply the homogeneous transform to a projective complex vector of a user-defined vector space with a weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const cWeightAsComplex = complexW.toComplex();
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const scaledToRefComplexWeight = projectiveComplexVector1.homogeneousTransform();
            expect(scaledToRefComplexWeight.dimension).to.eql(dimension);
            expect(scaledToRefComplexWeight.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(scaledToRefComplexWeight.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.getCoordinate(0).real).to.closeTo(cWeightAsComplex.divide(complex).real, TOLERANCE_FLOAT);
            expect(scaledToRefComplexWeight.getCoordinate(0).imaginary).to.closeTo(cWeightAsComplex.divide(complex).imaginary, TOLERANCE_FLOAT);
        });

        it(`can apply the homogeneous transform to a projective complex vector with a weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const cWeightAsComplex = complexW.toComplex();
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const scaledToRefComplexWeight = projectiveComplexVector1.homogeneousTransform();
            expect(scaledToRefComplexWeight.dimension).to.eql(dimension);
            expect(scaledToRefComplexWeight.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(scaledToRefComplexWeight.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.getCoordinate(0).real).to.closeTo(cWeightAsComplex.divide(complex).real, TOLERANCE_FLOAT);
            expect(scaledToRefComplexWeight.getCoordinate(0).imaginary).to.closeTo(cWeightAsComplex.divide(complex).imaginary, TOLERANCE_FLOAT);
        });

        it(`can apply the homogeneous transform to a projective complex vector with a weight management ${WeightManagement.SomeNullWeights}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, true);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const cWeightAsComplex = complexW.toComplex();
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const scaledToRefComplexWeight = projectiveComplexVector1.homogeneousTransform();
            expect(scaledToRefComplexWeight.dimension).to.eql(dimension);
            expect(scaledToRefComplexWeight.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(scaledToRefComplexWeight.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(scaledToRefComplexWeight.getCoordinate(0).real).to.closeTo(cWeightAsComplex.divide(complex).real, TOLERANCE_FLOAT);
            expect(scaledToRefComplexWeight.getCoordinate(0).imaginary).to.closeTo(cWeightAsComplex.divide(complex).imaginary, TOLERANCE_FLOAT);
        });

        it(`cannot apply the homogeneous transform to a projective complex vector when its magnitude is smaller than tolerance ${TOLERANCE_MIN_MAGNITUDE}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(TOLERANCE_MIN_MAGNITUDE / 2, false);
            const imaginaryW = new Weight(0, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector.homogeneousTransform()).to.throw(EM_COMPLEX_WEIGHT_TOO_SMALL);
        });

        it(`cannot apply the homogeneous transform to a projective complex vector when its magnitude is smaller than tolerance ${TOLERANCE_MIN_MAGNITUDE}`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(TOLERANCE_MIN_MAGNITUDE / 2, false);
            const imaginaryW = new Weight(0, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
            expect(() => projectiveComplexVector.homogeneousTransform()).to.throw(EM_COMPLEX_WEIGHT_TOO_SMALL);
        });

        it(`can map a projective complex vector into a vector of a default complex vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const complex1D = projectiveComplexVector1.toComplexVector();
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(true);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).imaginary);
        });

        it(`can map a projective complex vector into a vector of a user-defined complex vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2, false);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const complexVS = new ComplexVectorSpace(1);
            const complex1D = projectiveComplexVector1.toComplexVector(complexVS);
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(false);
            expect(complex1D.vectorSpace).to.eql(complexVS);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).imaginary);
        });

        it(`can map a projective complex vector into a vector of a user-defined complex vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE);
            const complexW = new ComplexWeight(realW, imaginaryW);
            // const vSpace = new ProjectiveComplexVectorSpace(dimension);
            // expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            const complexVS = new ComplexVectorSpace(1);
            const complex1D = projectiveComplexVector1.toComplexVector(complexVS);
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(false);
            expect(complex1D.vectorSpace).to.eql(complexVS);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).imaginary);
        });

        it(`can map a projective complex vector into a vector of a default complex vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE);
            const complexW = new ComplexWeight(realW, imaginaryW);
            // const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            // expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            const complex1D = projectiveComplexVector1.toComplexVector();
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(true);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.homogeneousTransform().getCoordinate(0).imaginary);
        });

        it(`can map a projective complex vector with null complex weight into a vector of a default complex vector space`, () => {
            const complex = new Complex(-1, 2);
            const realW = new Weight(0, false);
            const imaginaryW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const complex1D = projectiveComplexVector1.toComplexVector();
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(true);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.getCoordinate(0).imaginary);
        });

        it(`can map a projective complex vector with null complex weight into a vector of a user-defined complex vector space`, () => {
            const complex = new Complex(-3, 4);
            const realW = new Weight(0, false);
            const imaginaryW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const projectiveComplexVector1 = new ProjectiveVector1DTypeComplex(complex, complexW, vSpace);
            expect(projectiveComplexVector1.vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(true);
            const complexVS = new ComplexVectorSpace(1);
            const complex1D = projectiveComplexVector1.toComplexVector(complexVS);
            expect(complex1D.dimension).to.eql(1);
            expect(complex1D.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complex1D.vectorSpace.isDefault).to.eql(false);
            expect(complex1D.getCoordinate(0).real).to.eql(projectiveComplexVector1.getCoordinate(0).real);
            expect(complex1D.getCoordinate(0).imaginary).to.eql(projectiveComplexVector1.getCoordinate(0).imaginary);
        });

        it(`can check the vector dimension against the vector space dimension`, () => {
            class CustomProjectiveComplexVector extends ProjectiveVector1DTypeComplex {
                constructor(coordinates: Complex, weight: ComplexWeight, vectorSpace?: ProjectiveComplexVectorSpace<2>) {
                    super(coordinates, weight, vectorSpace);
                }

                checkVectorSpaceDimensionConsistency(dimension: number, vectorSpace: ProjectiveComplexVectorSpace<2>): void {
                    super.checkVectorSpaceDimensionConsistency(dimension, vectorSpace);
                }
            }
            
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector1 = new CustomProjectiveComplexVector(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = createMockVectorSpace(1, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<2>;
            expect(() => projectiveComplexVector1.checkVectorSpaceDimensionConsistency(dimension, vSpace1)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });


        it(`can check the vector dimension and type against the vector space dimension`, () => {
            class CustomProjectiveComplexVector extends ProjectiveVector1DTypeComplex {
                constructor(coordinates: Complex, weight: ComplexWeight, vectorSpace?: ProjectiveComplexVectorSpace<2>) {
                    super(coordinates, weight, vectorSpace);
                }

                checkVectorSpaceConsistency(dimension: number, vectorSpace?: ProjectiveComplexVectorSpace<2>): void {
                    super.checkVectorSpaceConsistency(dimension, vectorSpace);
                }
            }
            
            const complex = new Complex(-1, 2);
            const realW = new Weight(2);
            const imaginaryW = new Weight();
            const complexW = new ComplexWeight(realW, imaginaryW);
            const vSpace = new ProjectiveComplexVectorSpace(dimension);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const projectiveComplexVector1 = new CustomProjectiveComplexVector(complex, complexW, vSpace);
            expect(projectiveComplexVector1.dimension).to.eql(dimension);
            expect(projectiveComplexVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector1.vectorSpace.isDefault).to.eql(false);
            const vSpace1 = createMockVectorSpace(1, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<2>;
            expect(() => projectiveComplexVector1.checkVectorSpaceConsistency(dimension, vSpace1)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
            const vSpace2 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<2>;
            expect(() =>projectiveComplexVector1.checkVectorSpaceConsistency(dimension, vSpace2)).to.throw(EM_VECTORSPACE_INCOMPATIBLE);
        });
    });
});