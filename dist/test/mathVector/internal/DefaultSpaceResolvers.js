"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RealVectorSpace_1 = require("../../../src/namedConstants/RealVectorSpace");
const DefaultSpaceResolvers_1 = require("../../../src/mathVector/internal/DefaultSpaceResolvers");
const BSplineR1toRn_1 = require("../../../src/namedConstants/BSplineR1toRn");
const DefaultVectorSpaces_1 = require("../../../src/namedConstants/DefaultVectorSpaces");
const ComplexVectorSpace_1 = require("../../../src/namedConstants/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../../src/namedConstants/ProjectiveComplexVectorSpace");
const DefaultVectorSpaces_2 = require("../../../src/mathVector/internal/DefaultVectorSpaces");
const VectorSpaceIdentifierManager_1 = require("../../../src/namedConstants/VectorSpaceIdentifierManager");
const DefaultSpaceResolvers_2 = require("../../../src/ErrorMessages/DefaultSpaceResolvers");
describe('Resolvers for default vector space generation associated with a vector', () => {
    beforeEach(() => {
        // Reset the default vector space manager singleton before each test
        DefaultVectorSpaces_2.DefaultVectorSpaces.reset();
    });
    it(`can generate a default real vector space of dimensions ranging from ${RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE} to ${RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE}`, () => {
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultRealVectorSpace)(i);
            (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(realVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const realVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultRealVectorSpace)(i);
            (0, chai_1.expect)(realVectorSpace.id).to.eql(realVectorSpace1.id);
            (0, chai_1.expect)(realVectorSpace).to.eql(realVectorSpace1);
        }
    });
    it(`can generate a default complex vector space of dimensions ranging from ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} to ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultComplexVectorSpace)(i);
            (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(complexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const complexVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultComplexVectorSpace)(i);
            (0, chai_1.expect)(complexVectorSpace.id).to.eql(complexVectorSpace1.id);
            (0, chai_1.expect)(complexVectorSpace).to.eql(complexVectorSpace1);
        }
    });
    it(`can generate a default projective real vector space of dimensions ranging from ${ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE} to ${ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveRealVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultProjectiveRealVectorSpace)(i);
            (0, chai_1.expect)(projectiveRealVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveRealVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(projectiveRealVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
            (0, chai_1.expect)(projectiveRealVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const projectiveRealVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultProjectiveRealVectorSpace)(i);
            (0, chai_1.expect)(projectiveRealVectorSpace.id).to.eql(projectiveRealVectorSpace1.id);
            (0, chai_1.expect)(projectiveRealVectorSpace).to.eql(projectiveRealVectorSpace1);
        }
    });
    it(`can generate a default projective complex vector space of dimensions ranging from ${ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE} to ${ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultProjectiveComplexVectorSpace)(i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
            (0, chai_1.expect)(projectiveComplexVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const projectiveComplexVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultProjectiveComplexVectorSpace)(i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.id).to.eql(projectiveComplexVectorSpace1.id);
            (0, chai_1.expect)(projectiveComplexVectorSpace).to.eql(projectiveComplexVectorSpace1);
        }
    });
    it(`can resolve the default vector space for any real vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 2,
            spaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
            isDefault: true,
            name: 'mockRealVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)((0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace).includes(VectorSpaceIdentifierManager_1.DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
    });
    it(`can resolve the default vector space for any complex vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 1,
            spaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)((0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace).includes(VectorSpaceIdentifierManager_1.DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
    });
    it(`can resolve the default vector space for any projective real vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 3,
            spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)((0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace).includes(VectorSpaceIdentifierManager_1.DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
    });
    it(`can resolve the default vector space for any projective complex vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 2,
            spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)((0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace).includes(VectorSpaceIdentifierManager_1.DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
    });
    it(`cannot resolve the default vector space for any real vector space when a default real vector space of same dimension already exists`, () => {
        const dimension = 2;
        const realVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultRealVectorSpace)(dimension);
        (0, chai_1.expect)(realVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT + `${realVectorSpace.spaceType}_${realVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
            isDefault: true,
            name: 'mockRealVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace)).to.throw(DefaultSpaceResolvers_2.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });
    it(`cannot resolve the default vector space for any complex vector space when a default complex vector space of same dimension already exists`, () => {
        const dimension = 1;
        const complexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultComplexVectorSpace)(dimension);
        (0, chai_1.expect)(complexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT + `${complexVectorSpace.spaceType}_${complexVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace)).to.throw(DefaultSpaceResolvers_2.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });
    it(`cannot resolve the default vector space for any projective real vector space when a default projective vector space of same dimension already exists`, () => {
        const dimension = 3;
        const projectiveVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultProjectiveRealVectorSpace)(dimension);
        (0, chai_1.expect)(projectiveVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT + `${projectiveVectorSpace.spaceType}_${projectiveVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace)).to.throw(DefaultSpaceResolvers_2.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });
    it(`can resolve the default vector space for any projective complex vector space when a default projective complex vector space of same dimension already exists`, () => {
        const dimension = 2;
        const projectiveComplexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultProjectiveComplexVectorSpace)(dimension);
        (0, chai_1.expect)(projectiveComplexVectorSpace.id.includes(VectorSpaceIdentifierManager_1.DEFAULT + `${projectiveComplexVectorSpace.spaceType}_${projectiveComplexVectorSpace.dimension()}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID,
        };
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(mockVectorSpace)).to.throw(DefaultSpaceResolvers_2.EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });
    it(`can generate or get, if it already exists, the default vector space for any real vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        (0, chai_1.expect)(existingDefVS.length).to.eql(0);
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.REAL, i);
            (0, chai_1.expect)(realVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(realVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(realVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(realVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const realVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.REAL, i);
            (0, chai_1.expect)(realVectorSpace.id).to.eql(realVectorSpace1.id);
            (0, chai_1.expect)(realVectorSpace).to.eql(realVectorSpace1);
            const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            (0, chai_1.expect)(existingDefVS.length).to.eql(i - RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE + 1);
        }
    });
    it(`can generate or get, if it already exists, the default vector space for any complex vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        (0, chai_1.expect)(existingDefVS.length).to.eql(0);
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.COMPLEX, i);
            (0, chai_1.expect)(complexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(complexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(complexVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const complexVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.COMPLEX, i);
            (0, chai_1.expect)(complexVectorSpace.id).to.eql(complexVectorSpace1.id);
            (0, chai_1.expect)(complexVectorSpace).to.eql(complexVectorSpace1);
            const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            (0, chai_1.expect)(existingDefVS.length).to.eql(i - ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE + 1);
        }
    });
    it(`can generate or get, if it already exists, the default vector space for any projective real vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        (0, chai_1.expect)(existingDefVS.length).to.eql(0);
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveRealVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, i);
            (0, chai_1.expect)(projectiveRealVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveRealVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(projectiveRealVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
            (0, chai_1.expect)(projectiveRealVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const projectiveRealVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, i);
            (0, chai_1.expect)(projectiveRealVectorSpace.id).to.eql(projectiveRealVectorSpace1.id);
            (0, chai_1.expect)(projectiveRealVectorSpace).to.eql(projectiveRealVectorSpace1);
            const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            (0, chai_1.expect)(existingDefVS.length).to.eql(i - ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE + 1);
        }
    });
    it(`can generate or get, if it already exists, the default vector space for any projective complex vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        (0, chai_1.expect)(existingDefVS.length).to.eql(0);
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
            (0, chai_1.expect)(projectiveComplexVectorSpace.name).to.eql(DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            // uniqueness of the vector space identifier
            const projectiveComplexVectorSpace1 = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, i);
            (0, chai_1.expect)(projectiveComplexVectorSpace.id).to.eql(projectiveComplexVectorSpace1.id);
            (0, chai_1.expect)(projectiveComplexVectorSpace).to.eql(projectiveComplexVectorSpace1);
            const existingDefVS = DefaultVectorSpaces_2.DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            (0, chai_1.expect)(existingDefVS.length).to.eql(i - ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1);
        }
    });
    it(`cannot get the default vector space for a vector space type distinct from ${BSplineR1toRn_1.VectorSpaceType}`, () => {
        const dimension = 2;
        const incorrectVSType = "IncorrectType";
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(incorrectVSType, dimension)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_TYPE);
    });
    it(`cannot get a default real vector space for a vector space dimension outside the range ${RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE}, ${RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const dimensionMin = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE - 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultRealVectorSpace)(dimensionMin)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE + 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultRealVectorSpace)(dimensionMax)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
    });
    it(`cannot get a default complex vector space for a vector space dimension outside the range ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE}, ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimensionMin = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE - 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultComplexVectorSpace)(dimensionMin)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE + 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultComplexVectorSpace)(dimensionMax)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
    });
    it(`cannot get a default projective real vector space for a vector space dimension outside the range ${ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimensionMin = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultProjectiveRealVectorSpace)(dimensionMin)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultProjectiveRealVectorSpace)(dimensionMax)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
    });
    it(`cannot get a default projective complex vector space for a vector space dimension outside the range ${ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimensionMin = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultProjectiveComplexVectorSpace)(dimensionMin)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1;
        (0, chai_1.expect)(() => (0, DefaultSpaceResolvers_1.getDefaultProjectiveComplexVectorSpace)(dimensionMax)).to.throw(DefaultSpaceResolvers_2.EM_INVALID_VECTOR_SPACE_DIMENSION);
    });
});
