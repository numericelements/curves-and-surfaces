import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { COMPLEX, COMPLEXWEIGHT, PROJECTIVECOMPLEXVECTOR1D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ProjectiveVector1DTypeComplex } from "../../src/mathVector/ProjectiveVector1DTypeComplex";
import { Complex } from "../../src/mathVector/Complex";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { Weight } from "../../src/mathVector/Weight";
import { MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../src/namedConstants/ProjectiveComplexVectorSpace";
import { ComplexWeight } from "../../src/mathVector/ComplexWeight";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_NOT_IN_SAME_VECTORSPACE } from "../../src/namedConstants/Vectors";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../../src/ErrorMessages/WeightManager";
import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL } from "../../src/ErrorMessages/ComplexOperators";
import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../../src/ErrorMessages/ComplexWeight";
import { EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../../src/ErrorMessages/ProjectiveComplexVectors";

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
            expect(projectiveComplexVector.coordinates).to.eql([new Complex(), new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex());
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = projectiveComplexVector.vectorSpace.id;
        });

        it(`can generate an arbitrary projective complex vector with default weight into the default 2D projective complex vector space`, () => {
            const complexCoordinates = new Complex(-1, 4);
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complexCoordinates.real, complexCoordinates.imaginary);
            expect(projectiveComplexVector.coordinates.length).to.eql(dimension);
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projectiveComplexVector.coordinates).to.eql([new Complex(), new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(new Complex());
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
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
            expect(projectiveComplexVector.coordinates).to.eql([complexCoordinates, new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE)]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.getCoordinate(0)).to.eql(complexCoordinates);
            expect(projectiveComplexVector.getCoordinate(1)).to.eql(new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE));
            expect(projectiveComplexVector.weight.real.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(projectiveComplexVector.weight.imaginary.strictlyPositive).to.eql(true);
            expect(projectiveComplexVector.weight.imaginary.value).to.eql(DEFAULT_WEIGHT_VALUE);
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

        it(`can generate a default complex projective real vector with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
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

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false))).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.SomeNullWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

        it(`cannot generate a projective complex vector using real weights of diffrent strictly positive status with prescribed weight management ${WeightManagement.SomeNullWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            expect(() => new ProjectiveVector1DTypeComplex(1, -2, new Weight(2), new Weight(3, false), vSpace)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });

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
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllStrictlyPositiveWeights} into the default projective complex vector space`, () => {
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2, false), new Weight(3, false)))).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into a user-defined projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vSpace.isDefault).to.eql(false);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2), new Weight(3)), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        });

        it(`cannot generate a projective complex vector using a complex weight of incorrect strictly positive status with prescribed weight management ${WeightManagement.AllPositiveWeights} into the default projective complex vector space`, () => {
            const vSpace = new ProjectiveComplexVectorSpace(dimension, WeightManagement.AllPositiveWeights, true);
            expect(vSpace.isDefault).to.eql(true);
            expect(vSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            expect(() => new ProjectiveVector1DTypeComplex(new Complex(1, -2), new ComplexWeight(new Weight(2), new Weight(3)), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
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

        // it(`can get the coordinates of a vector as a complex number`, () => {
        //     const vSpace = new ProjectiveComplexVectorSpace(dimension);
        //     const complex = new Complex(1, 2);
        //     const projectiveComplexVector = new ProjectiveVector1DTypeComplex(complex, vSpace);
        //     expect(projectiveComplexVector.coordinates).to.eql([complex]);
        //     expect(projectiveComplexVector.dimension).to.eql(dimension);
        //     expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
        //     expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
        //     expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(false);
        // });

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
        it(`cannot add a vector with another vector of different dimension`, () => {
            const coordinates = [1, 3];
            const projectiveComplexVector = new ProjectiveVector1DTypeComplex(coordinates[0], coordinates[1]);
            expect(projectiveComplexVector.dimension).to.eql(dimension);
            expect(projectiveComplexVector.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveComplexVector.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVector.vectorSpace.isDefault).to.eql(true);
            // const complexVector2 = new Vector2DTypeComplex();
            // expect(complexVector2.dimension).to.not.eql(complexVector1.dimension);
            // expect(() => complexVector1.add(complexVector2)).to.throw(EM_VECTORS_DIFFERENT_DIM);
        });

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
            const projectiveVector1 = new ProjectiveVector1DTypeComplex(coordinates, complexW, vSpace1);
            expect(projectiveVector1.dimension).to.eql(dimension);
            expect(projectiveVector1.vectorType).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(projectiveVector1.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveVector1.vectorSpace.isDefault).to.eql(false);
            const string = projectiveVector1.toString();
            expect(string).to.eql(PROJECTIVECOMPLEXVECTOR1D + `(${coordinates.toString()}, ${complexW.toString()})`);
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
            expect(() => new ProjectiveVector1DTypeComplex(complex2, complexW1, vectorSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
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
    });
});