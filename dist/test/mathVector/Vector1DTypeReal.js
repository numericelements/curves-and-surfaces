"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const Vector1DTypeReal_1 = require("../../src/mathVector/Vector1DTypeReal");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('Vector 1D in real vector space: generation and operators in this vector space', () => {
    const dimension = 1;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';
    describe('Constructor', () => {
        it(`can generate a default real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal();
            (0, chai_1.expect)(realVector.coordinates).to.eql([0]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(0);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });
        it(`can generate an arbitrary real vector into the default 1D vector space`, () => {
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(-1);
            (0, chai_1.expect)(realVector.coordinates).to.eql([-1]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(-1);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate a default real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(vSpace);
            (0, chai_1.expect)(realVector.coordinates).to.eql([0]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(0);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });
        it(`can generate an arbitrary real vector into a 1D vector space`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(1, vSpace);
            (0, chai_1.expect)(realVector.coordinates).to.eql([1]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(1);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(realVector.vectorSpace).to.eql(vSpace);
        });
    });
    describe('Accessors', () => {
        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(2, vSpace);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
        });
        it(`can get the coordinate of a vector as x parameter`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(2, vSpace);
            (0, chai_1.expect)(realVector.x).to.eql(2);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
        });
        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector1DTypeReal_1.Vector1DTypeReal(3, vSpace);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.descriptor).to.eql(realVector.x);
        });
    });
    describe('Methods', () => {
        it(`can get the vector descriptor as a string`, () => {
            const vSpace1 = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal_1.Vector1DTypeReal(3, vSpace1);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            (0, chai_1.expect)(string).to.eql(VectorTypeTags_1.REALVECTOR1D + `(${realVector1.x.toString()})` + ` ` + vSpace1.toString());
        });
        it(`check orthogonality property of vectors of dimension one is not available`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal_1.Vector1DTypeReal(1, vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector1DTypeReal_1.Vector1DTypeReal(0, vSpace);
            (0, chai_1.expect)(() => realVector1.isOrthogonal(realVector2)).to.throw(Vectors_1.EM_ISORTHOGONAL_NOT_APPLICABLE);
        });
        it(`cannot map a real 1D vector into a projective real vector`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector1DTypeReal_1.Vector1DTypeReal(1, vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR1D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(() => realVector1.toProjectiveVector()).to.throw(Vectors_1.EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});
