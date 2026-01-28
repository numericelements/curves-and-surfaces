import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { complexVector1D, complexVector2D, projectiveRealVector3D, realVector1D, realVector2D, realVector3D, realVector4D } from "../../src/mathVector/VectorFactory";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { Complex } from "../../src/mathVector/Complex";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { PROJECTIVEVECTOR2D } from "../../src/namedConstants/VectorTypeTags";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE } from "../../src/namedConstants/Vectors";

describe('Vector factory to create real, projective real, complex, and projective complex vectors into corresponding vector spaces that can be either default ones or user-specified ones', () => {

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    const dimension1 = 1;

    it('can create a real 1D vector in a default real vector space with default coordinate', () => {
        const vector = realVector1D();
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 1D vector in a user-defined real vector space with default coordinate', () => {
        const vSpace = new RealVectorSpace(dimension1);
        const vector = realVector1D(vSpace);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a real 1D vector in a default real vector space with user-defined coordinate', () => {
        const coordinate = 5;
        const vector = realVector1D(coordinate);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 1D vector in a user-defined real vector space with user-defined coordinate', () => {
        const vSpace = new RealVectorSpace(dimension1);
        const coordinate = 5;
        const vector = realVector1D(coordinate, vSpace);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    const dimension2 = 2;

    it('can create a real 2D vector in a default real vector space with default coordinate', () => {
        const vector = realVector2D();
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 2D vector in a user-defined real vector space with default coordinate', () => {
        const vSpace = new RealVectorSpace(dimension2);
        const vector = realVector2D(vSpace);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a real 2D vector in a default real vector space with user-defined coordinate', () => {
        const coordinate1 = 5;
        const coordinate2 = -2;
        const vector = realVector2D(coordinate1, coordinate2);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 2D vector in a user-defined real vector space with user-defined coordinate', () => {
        const vSpace = new RealVectorSpace(dimension2);
        const coordinate1 = -5;
        const coordinate2 = 2;
        const vector = realVector2D(coordinate1, coordinate2, vSpace);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    const dimension3 = 3;

    it('can create a real 3D vector in a default real vector space with default coordinate', () => {
        const vector = realVector3D();
        expect(vector.dimension).to.eql(dimension3);
        expect(vector.vectorSpace.dimension()).to.eql(dimension3);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.getCoordinate(2)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 3D vector in a user-defined real vector space with default coordinate', () => {
        const vSpace = new RealVectorSpace(dimension3);
        const vector = realVector3D(vSpace);
        expect(vector.dimension).to.eql(dimension3);
        expect(vector.vectorSpace.dimension()).to.eql(dimension3);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.getCoordinate(2)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a real 3D vector in a default real vector space with user-defined coordinate', () => {
        const coordinate1 = 5;
        const coordinate2 = -2;
        const coordinate3 = 3;
        const vector = realVector3D(coordinate1, coordinate2, coordinate3);
        expect(vector.dimension).to.eql(dimension3);
        expect(vector.vectorSpace.dimension()).to.eql(dimension3);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.getCoordinate(2)).to.eql(coordinate3);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 3D vector in a user-defined real vector space with user-defined coordinate', () => {
        const vSpace = new RealVectorSpace(dimension3);
        const coordinate1 = -5;
        const coordinate2 = 2;
        const coordinate3 = 1;
        const vector = realVector3D(coordinate1, coordinate2, coordinate3, vSpace);
        expect(vector.dimension).to.eql(dimension3);
        expect(vector.vectorSpace.dimension()).to.eql(dimension3);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.getCoordinate(2)).to.eql(coordinate3);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    const dimension4 = 4;

    it('can create a real 4D vector in a default real vector space with default coordinate', () => {
        const vector = realVector4D();
        expect(vector.dimension).to.eql(dimension4);
        expect(vector.vectorSpace.dimension()).to.eql(dimension4);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.getCoordinate(2)).to.eql(0);
        expect(vector.getCoordinate(3)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 4D vector in a user-defined real vector space with default coordinate', () => {
        const vSpace = new RealVectorSpace(dimension4);
        const vector = realVector4D(vSpace);
        expect(vector.dimension).to.eql(dimension4);
        expect(vector.vectorSpace.dimension()).to.eql(dimension4);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.getCoordinate(1)).to.eql(0);
        expect(vector.getCoordinate(2)).to.eql(0);
        expect(vector.getCoordinate(3)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a real 4D vector in a default real vector space with user-defined coordinate', () => {
        const coordinate1 = 5;
        const coordinate2 = -2;
        const coordinate3 = 3;
        const coordinate4 = 7;
        const vector = realVector4D(coordinate1, coordinate2, coordinate3, coordinate4);
        expect(vector.dimension).to.eql(dimension4);
        expect(vector.vectorSpace.dimension()).to.eql(dimension4);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.getCoordinate(2)).to.eql(coordinate3);
        expect(vector.getCoordinate(3)).to.eql(coordinate4);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 4D vector in a user-defined real vector space with user-defined coordinate', () => {
        const vSpace = new RealVectorSpace(dimension4);
        const coordinate1 = -5;
        const coordinate2 = 2;
        const coordinate3 = 1;
        const coordinate4 = 8;
        const vector = realVector4D(coordinate1, coordinate2, coordinate3, coordinate4, vSpace);
        expect(vector.dimension).to.eql(dimension4);
        expect(vector.vectorSpace.dimension()).to.eql(dimension4);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.getCoordinate(2)).to.eql(coordinate3);
        expect(vector.getCoordinate(3)).to.eql(coordinate4);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    // Complex vectors
    it('can create a complex 1D vector in a default complex vector space with default coordinate', () => {
        const vector = complexVector1D();
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(new Complex());
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 1D vector in a user-defined complex vector space with default coordinate', () => {
        const vSpace = new ComplexVectorSpace(dimension1);
        const vector = complexVector1D(vSpace);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(new Complex());
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a complex 1D vector in a default complex vector space with user-defined complex coordinate', () => {
        const coordinate = new Complex(5, 0);
        const vector = complexVector1D(coordinate);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 1D vector in a user-defined complex vector space with user-defined complex coordinate', () => {
        const vSpace = new ComplexVectorSpace(dimension1);
        const coordinate = new Complex(5, 0);
        const vector = complexVector1D(coordinate, vSpace);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });

    it('can create a complex 1D vector in a default complex vector space with user-defined real, imaginary coordinates', () => {
        const real = 4;
        const imaginary = -3;
        const vector = complexVector1D(real, imaginary);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(new Complex(real, imaginary));
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 1D vector in a user-defined complex vector space with user-defined real, imaginary coordinates', () => {
        const vSpace = new ComplexVectorSpace(dimension1);
        const real = 4;
        const imaginary = -3;
        const vector = complexVector1D(real, imaginary, vSpace);
        expect(vector.dimension).to.eql(dimension1);
        expect(vector.vectorSpace.dimension()).to.eql(dimension1);
        expect(vector.getCoordinate(0)).to.eql(new Complex(real, imaginary));
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });


    it('can create a complex 2D vector in a default complex vector space with default coordinate', () => {
        const vector = complexVector2D();
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(new Complex());
        expect(vector.getCoordinate(1)).to.eql(new Complex());
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 2D vector in a user-defined complex vector space with default coordinate', () => {
        const vSpace = new ComplexVectorSpace(dimension2);
        const vector = complexVector2D(vSpace);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(new Complex());
        expect(vector.getCoordinate(1)).to.eql(new Complex());
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
        expect(vector.vectorSpace).to.eql(vSpace);
    });

    it('can create a complex 2D vector in a default complex vector space with user-defined complex coordinate', () => {
        const coordinate1 = new Complex(5, 0);
        const coordinate2 = new Complex(0, 3);
        const vector = complexVector2D(coordinate1, coordinate2);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 2D vector in a user-defined complex vector space with user-defined complex coordinate', () => {
        const vSpace = new ComplexVectorSpace(dimension2);
        const coordinate1 = new Complex(5, 0);
        const coordinate2 = new Complex(0, 3);
        const vector = complexVector2D(coordinate1, coordinate2, vSpace);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(coordinate1);
        expect(vector.getCoordinate(1)).to.eql(coordinate2);
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });

    it('can create a complex 2D vector in a default complex vector space with user-defined real, imaginary coordinates', () => {
        const real1 = 4;
        const imaginary1 = -3;
        const real2 = 2;
        const imaginary2 = 5;
        const vector = complexVector2D(real1, imaginary1, real2, imaginary2);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(new Complex(real1, imaginary1));
        expect(vector.getCoordinate(1)).to.eql(new Complex(real2, imaginary2));
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a complex 2D vector in a user-defined complex vector space with user-defined real, imaginary coordinates', () => {
        const vSpace = new ComplexVectorSpace(dimension2);
        const real1 = 4;
        const imaginary1 = -3;
        const real2 = 2;
        const imaginary2 = 5;
        const vector = complexVector2D(real1, imaginary1, real2, imaginary2, vSpace);
        expect(vector.dimension).to.eql(dimension2);
        expect(vector.vectorSpace.dimension()).to.eql(dimension2);
        expect(vector.getCoordinate(0)).to.eql(new Complex(real1, imaginary1));
        expect(vector.getCoordinate(1)).to.eql(new Complex(real2, imaginary2));
        expect(vector.spaceType).to.eql(VectorSpaceType.COMPLEX);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });

    // Projective real vectors
    it(`can generate a default projective real vector into the default 3D projective vector space`, () => {
        const projRealVector = projectiveRealVector3D();
        expect(projRealVector.coordinates.length).to.eql(dimension3);
        expect(projRealVector.coordinates).to.eql([0, 0, 1]);
        expect(projRealVector.dimension).to.eql(dimension3);
        expect(projRealVector.getCoordinate(0)).to.eql(0);
        expect(projRealVector.getCoordinate(1)).to.eql(0);
        expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
        expect(projRealVector.weight.strictlyPositive).to.eql(true);
        expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.isDefault).to.eql(true);
    });

    it(`can generate a default projective real vector with a default weight into a user-defined 3D vector space`, () => {
        const vSpace = new ProjectiveVectorSpace(dimension3);
        const projRealVector = projectiveRealVector3D(vSpace);
        expect(projRealVector.coordinates.length).to.eql(dimension3);
        expect(projRealVector.coordinates).to.eql([0, 0, 1]);
        expect(projRealVector.dimension).to.eql(dimension3);
        expect(projRealVector.getCoordinate(0)).to.eql(0);
        expect(projRealVector.getCoordinate(1)).to.eql(0);
        expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
        expect(projRealVector.weight.strictlyPositive).to.eql(true);
        expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector.vectorSpace).to.eql(vSpace);
    });

    it(`can generate an arbitrary projective real vector with default weight into the default 3D projective vector space`, () => {
        const x = -1;
        const y = 2;
        const projRealVector = projectiveRealVector3D(x, y);
        expect(projRealVector.coordinates.length).to.eql(dimension3);
        expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
        expect(projRealVector.dimension).to.eql(dimension3);
        expect(projRealVector.getCoordinate(0)).to.eql(x);
        expect(projRealVector.getCoordinate(1)).to.eql(y);
        expect(projRealVector.getCoordinate(2)).to.eql(new Weight().value);
        expect(projRealVector.weight.strictlyPositive).to.eql(true);
        expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.isDefault).to.eql(true);
    });


    it(`can generate an arbitrary projective real vector with default weight into a user-defined 3D vector space`, () => {
        const x = 0;
        const y = -2;
        const vSpace = new ProjectiveVectorSpace(dimension3);
        const projRealVector = projectiveRealVector3D(x, y, vSpace);
        expect(projRealVector.coordinates.length).to.eql(dimension3);
        expect(projRealVector.coordinates).to.eql([x, y, DEFAULT_WEIGHT_VALUE]);
        expect(projRealVector.dimension).to.eql(dimension3);
        expect(projRealVector.getCoordinate(0)).to.eql(x);
        expect(projRealVector.getCoordinate(1)).to.eql(y);
        expect(projRealVector.getCoordinate(2)).to.eql(DEFAULT_WEIGHT_VALUE);
        expect(projRealVector.weight.strictlyPositive).to.eql(true);
        expect(projRealVector.weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector.vectorSpace).to.eql(vSpace);
    });


    it(`can generate an arbitrary projective real vector with prescribed weight into a user-defined 3D vector space`, () => {
        const weight = new Weight(2);
        const x = 0;
        const y = -2;
        const vSpace = new ProjectiveVectorSpace(dimension3);
        const projRealVector = projectiveRealVector3D(x, y, weight, vSpace);
        expect(projRealVector.coordinates.length).to.eql(dimension3);
        expect(projRealVector.coordinates).to.eql([x, y, weight.value]);
        expect(projRealVector.dimension).to.eql(dimension3);
        expect(projRealVector.getCoordinate(0)).to.eql(x);
        expect(projRealVector.getCoordinate(1)).to.eql(y);
        expect(projRealVector.getCoordinate(2)).to.eql(weight.value);
        expect(projRealVector.weight.strictlyPositive).to.eql(true);
        expect(projRealVector.weight.value).to.eql(weight.value);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.isDefault).to.eql(false);
        expect(projRealVector.vectorSpace).to.eql(vSpace);
    });

    it(`cannot generate a projective real vector with a strictly positive weight with weight management ${WeightManagement.AllPositiveWeights} and default 3D projective real vector space`, () => {
        const vSpace = new ProjectiveVectorSpace(dimension3, WeightManagement.AllPositiveWeights, true);
        expect(vSpace.isDefault).to.eql(true);
        expect(() =>  projectiveRealVector3D(1, 2, new Weight(3, true), vSpace)).to.throw(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
        expect(() =>  projectiveRealVector3D(1, 2, new Weight(3, true), vSpace)).to.throw('projectiveRealVector3D');
    });

    it(`cannot generate a consistent projective real vector into a user-defined non projective vector space`, () => {
        const x = 1;
        // Here we use a real vector space that is not projective to show that type casting is necessary to bypass typescript checks
        const vSpace = new RealVectorSpace(dimension3);
        expect(vSpace.isDefault).to.eql(false);
        // Such type casting must be avoided by the users because they don't throw errors at compile time and at runtime
        expect(() =>  projectiveRealVector3D(x, 2, new Weight(), vSpace as unknown as ProjectiveVectorSpace<3>)).to.not.throw();
        const projRealVector = projectiveRealVector3D(x, 2, new Weight(), vSpace as unknown as ProjectiveVectorSpace<3>);
        // But the generated vector is not consistent though the user coordinates are correctly set
        expect(projRealVector.getCoordinate(0)).to.eql(x);
        expect(projRealVector.vectorType).to.eql(PROJECTIVEVECTOR2D);
        expect(projRealVector.vectorSpace.spaceType).to.not.eql(VectorSpaceType.PROJECTIVE);
        expect(projRealVector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
    });
});