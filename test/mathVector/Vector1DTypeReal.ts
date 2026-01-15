import { expect } from "chai";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { Vector1DTypeReal } from "../../src/mathVector/Vector1DTypeReal";
import { EM_ISORTHOGONAL_NOT_APPLICABLE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../../src/namedConstants/Vectors";
import { REALVECTOR1D } from "../../src/namedConstants/VectorTypeTags";

describe('Vector 1D in real vector space: generation and operators in this vector space', () => {
    const dimension = 1;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';

    describe('Constructor', () => {
        it(`can generate a default real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal();
            expect(realVector.coordinates).to.eql([0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal(-1);
            expect(realVector.coordinates).to.eql([-1]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(-1);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(true);
            expect(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });

        it(`can generate a default real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector1DTypeReal(vSpace);
            expect(realVector.coordinates).to.eql([0]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(0);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });

        it(`can generate an arbitrary real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace(dimension);
            expect(vSpace.id).to.not.eql(defaultVectorSpaceID);
            expect(vSpace.id).to.not.eql(userSpecificVSID);
            const realVector = new Vector1DTypeReal(1, vSpace);
            expect(realVector.coordinates).to.eql([1]);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.getCoordinate(0)).to.eql(1);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
            expect(realVector.vectorSpace).to.eql(vSpace);
        });
    });

    describe('Accessors', () => {

        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(2, vSpace);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
        });

        it(`can get the coordinate of a vector as x parameter`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(2, vSpace);
            expect(realVector.x).to.eql(2);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.vectorType).to.eql(REALVECTOR1D);
            expect(realVector.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector.vectorSpace.isDefault).to.eql(false);
        });

        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal(3, vSpace);
            expect(realVector.dimension).to.eql(dimension);
            expect(realVector.descriptor).to.eql(realVector.x);
        });
    });

    describe('Methods', () => {

        it(`can get the vector descriptor as a string`, () => {
            const vSpace1 = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(3, vSpace1);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            expect(string).to.eql(REALVECTOR1D + `(${realVector1.x.toString()})` + ` ` + vSpace1.toString());
        });

        it(`check orthogonality property of vectors of dimension one is not available`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(1, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector1DTypeReal(0, vSpace);
            expect(() => realVector1.isOrthogonal(realVector2)).to.throw(EM_ISORTHOGONAL_NOT_APPLICABLE);
        });

        it(`cannot map a real 1D vector into a projective real vector`, () => {
            const vSpace = new RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal(1, vSpace);
            expect(realVector1.dimension).to.eql(dimension);
            expect(realVector1.vectorType).to.eql(REALVECTOR1D);
            expect(realVector1.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVector1.vectorSpace.isDefault).to.eql(false);
            expect(() => realVector1.toProjectiveVector()).to.throw(EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});