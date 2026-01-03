"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const Vectors_1 = require("../../src/namedConstants/Vectors");
const Vector4DTypeReal_1 = require("../../src/mathVector/Vector4DTypeReal");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
describe('Vector 4D in real vector space: generation and operators in this vector space', () => {
    const dimension = 4;
    let defaultVectorSpaceID = '';
    let userSpecificVSID = '';
    describe('Constructor', () => {
        it(`can generate a default real vector into the default 4D vector space`, () => {
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal();
            (0, chai_1.expect)(realVector.coordinates).to.eql([0, 0, 0, 0]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(1)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(2)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(3)).to.eql(0);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(true);
            defaultVectorSpaceID = realVector.vectorSpace.id;
        });
        it(`can generate an arbitrary real vector into the default 4D vector space`, () => {
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(-1, 2, 3, -4);
            (0, chai_1.expect)(realVector.coordinates).to.eql([-1, 2, 3, -4]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(-1);
            (0, chai_1.expect)(realVector.getCoordinate(1)).to.eql(2);
            (0, chai_1.expect)(realVector.getCoordinate(2)).to.eql(3);
            (0, chai_1.expect)(realVector.getCoordinate(3)).to.eql(-4);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVector.vectorSpace.id).to.eql(defaultVectorSpaceID);
        });
        it(`can generate a default real vector into a 4D vector space`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(vSpace);
            (0, chai_1.expect)(realVector.coordinates).to.eql([0, 0, 0, 0]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(1)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(2)).to.eql(0);
            (0, chai_1.expect)(realVector.getCoordinate(3)).to.eql(0);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(realVector.vectorSpace).to.eql(vSpace);
            userSpecificVSID = realVector.vectorSpace.id;
        });
        it(`can generate an arbitrary real vector into a 4D vector space`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            (0, chai_1.expect)(vSpace.id).to.not.eql(userSpecificVSID);
            (0, chai_1.expect)(vSpace.id).to.not.eql(defaultVectorSpaceID);
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(1, -2, 3, -6, vSpace);
            (0, chai_1.expect)(realVector.coordinates).to.eql([1, -2, 3, -6]);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.getCoordinate(0)).to.eql(1);
            (0, chai_1.expect)(realVector.getCoordinate(1)).to.eql(-2);
            (0, chai_1.expect)(realVector.getCoordinate(2)).to.eql(3);
            (0, chai_1.expect)(realVector.getCoordinate(3)).to.eql(-6);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(realVector.vectorSpace).to.eql(vSpace);
        });
    });
    describe('Accessors', () => {
        it(`can get the vector type of a vector`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(1, 2, -3, 5, vSpace);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
        });
        it(`can get the coordinates of a vector as x, y, z, t parameters`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(1, 2, -3, 5, vSpace);
            (0, chai_1.expect)(realVector.x).to.eql(1);
            (0, chai_1.expect)(realVector.y).to.eql(2);
            (0, chai_1.expect)(realVector.z).to.eql(-3);
            (0, chai_1.expect)(realVector.t).to.eql(5);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector.vectorSpace.isDefault).to.eql(false);
        });
        it(`can get the descriptor of a vector as vector type`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector = new Vector4DTypeReal_1.Vector4DTypeReal(1, 3, -1, 5, vSpace);
            (0, chai_1.expect)(realVector.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector.descriptor.type).to.eql(VectorTypeTags_1.REALVECTOR4D);
        });
    });
    describe('Methods', () => {
        it(`can get the vector data structure as a string`, () => {
            const coordinates = [1, 3, 5, 7];
            const vSpace1 = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace1);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const string = realVector1.toString();
            (0, chai_1.expect)(string).to.eql(VectorTypeTags_1.REALVECTOR4D + `(${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]}, ${coordinates[3]})` + ` ` + realVector1.vectorSpace.toString());
        });
        it(`cannot check the orthogonality of vectors belonging to different vector spaces`, () => {
            const coordinates = [1, 3, 5, 7];
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            (0, chai_1.expect)(() => realVector1.isOrthogonal(realVector2)).to.throw(Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
        });
        it(`can check that two vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates1[0], coordinates1[1], coordinates1[2], coordinates1[3], vSpace);
            (0, chai_1.expect)(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are orthogonal to each other using the default angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[2] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[3] + Vectors_1.LINEAR_TOL_VECTOR, vSpace);
            (0, chai_1.expect)(realVector1.isOrthogonal(realVector2)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not orthogonal to each other within the default angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates1[0], coordinates1[1] + Vectors_1.ANGULAR_TOL_VECTOR * 4, coordinates1[2], coordinates1[3] + Vectors_1.ANGULAR_TOL_VECTOR * 4, vSpace);
            (0, chai_1.expect)(realVector1.isOrthogonal(realVector2)).to.eql(false);
        });
        it(`can check that two angularly different vectors are orthogonal to each other using a user-specified angular tolerance`, () => {
            const coordinates = [1, 3, 6, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [-6, 2, -2, 3];
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates1[0] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[1] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[2] + Vectors_1.LINEAR_TOL_VECTOR, coordinates1[3] + Vectors_1.LINEAR_TOL_VECTOR, vSpace);
            (0, chai_1.expect)(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(true);
        });
        it(`can check that two angularly different vectors are not orthogonal to each other within a user-specified angular tolerance`, () => {
            const coordinates = [0, 3, 1, 4];
            const angularTolerance = 1e-4;
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates[0], coordinates[1], coordinates[2], coordinates[3], vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            const coordinates1 = [3, 0, 4, -1];
            const realVector2 = new Vector4DTypeReal_1.Vector4DTypeReal(coordinates1[0], coordinates1[1] + angularTolerance * 4, coordinates1[2], coordinates1[3] + angularTolerance * 4, vSpace);
            (0, chai_1.expect)(realVector1.isOrthogonal(realVector2, angularTolerance)).to.eql(false);
        });
        it(`cannot map a real 4D vector into a projective real vector`, () => {
            const vSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
            const realVector1 = new Vector4DTypeReal_1.Vector4DTypeReal(1, 2, 3, 4, vSpace);
            (0, chai_1.expect)(realVector1.dimension).to.eql(dimension);
            (0, chai_1.expect)(realVector1.vectorType).to.eql(VectorTypeTags_1.REALVECTOR4D);
            (0, chai_1.expect)(realVector1.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVector1.vectorSpace.isDefault).to.eql(false);
            (0, chai_1.expect)(() => realVector1.toProjectiveVector()).to.throw(Vectors_1.EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        });
    });
});
