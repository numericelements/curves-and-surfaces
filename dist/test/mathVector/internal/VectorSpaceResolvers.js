"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VectorSpaceIdentifierManager_1 = require("../../../src/mathVector/internal/VectorSpaceIdentifierManager");
const RealVectorSpace_1 = require("../../../src/namedConstants/RealVectorSpace");
const BSplineR1toRn_1 = require("../../../src/namedConstants/BSplineR1toRn");
const VectorSpaceResolvers_1 = require("../../../src/mathVector/internal/VectorSpaceResolvers");
const VectorSpaceIdentifierManager_2 = require("../../../src/namedConstants/VectorSpaceIdentifierManager");
const RealVectorSpace_2 = require("../../../src/mathVector/RealVectorSpace");
const VectorSpaceResolvers_2 = require("../../../src/ErrorMessages/VectorSpaceResolvers");
const ComplexVectorSpace_1 = require("../../../src/namedConstants/ComplexVectorSpace");
const ComplexVectorSpace_2 = require("../../../src/mathVector/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveVectorSpace_2 = require("../../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../../src/namedConstants/ProjectiveComplexVectorSpace");
const ProjectiveComplexVectorSpace_2 = require("../../../src/mathVector/ProjectiveComplexVectorSpace");
const DefaultSpaceResolvers_1 = require("../../../src/ErrorMessages/DefaultSpaceResolvers");
describe('Resolving and checking vector space registration for user-defined vector spaces associated with a vector', () => {
    beforeEach(() => {
        // Reset the default vector space manager singleton before each test
        VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.reset();
    });
    it(`can resolve a real vector space of dimensions ranging from ${RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE} to ${RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const mockVectorSpaces = [];
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
        }
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = (0, VectorSpaceResolvers_1.resolveVectorSpace)(mockVectorSpaces[i - 1]);
            (0, chai_1.expect)(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            (0, chai_1.expect)(realVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
        }
    });
    it(`can resolve a complex vector space of dimensions ranging from ${ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE} to ${ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const mockVectorSpaces = [];
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
        }
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = (0, VectorSpaceResolvers_1.resolveVectorSpace)(mockVectorSpaces[i - 1]);
            (0, chai_1.expect)(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            (0, chai_1.expect)(complexVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
        }
    });
    it(`can resolve a projective real vector space of dimensions ranging from ${ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE} to ${ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const mockVectorSpaces = [];
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 3] = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
        }
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveVectorSpace = (0, VectorSpaceResolvers_1.resolveVectorSpace)(mockVectorSpaces[i - 3]);
            (0, chai_1.expect)(mockVectorSpaces[i - 3].isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveVectorSpace.includes(`${mockVectorSpaces[i - 3].spaceType}_${mockVectorSpaces[i - 3].dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
        }
    });
    it(`can resolve a complex projective vector space of dimensions ranging from ${ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE} to ${ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const mockVectorSpaces = [];
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
        }
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = (0, VectorSpaceResolvers_1.resolveVectorSpace)(mockVectorSpaces[i - 1]);
            (0, chai_1.expect)(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
        }
    });
    it(`cannot resolve a real vector space if it is already registered`, () => {
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const realVS = new RealVectorSpace_2.RealVectorSpace(dim);
            (0, chai_1.expect)(realVS.isDefault).to.eql(false);
            (0, chai_1.expect)(realVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(realVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(realVS.id.includes(`${realVS.spaceType}_${realVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.resolveVectorSpace)(realVS)).to.throw(VectorSpaceResolvers_2.EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });
    it(`cannot resolve a complex vector space if it is already registered`, () => {
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const complexVS = new ComplexVectorSpace_2.ComplexVectorSpace(dim);
            (0, chai_1.expect)(complexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(complexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(complexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(complexVS.id.includes(`${complexVS.spaceType}_${complexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.resolveVectorSpace)(complexVS)).to.throw(VectorSpaceResolvers_2.EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });
    it(`cannot resolve a projective vector space if it is already registered`, () => {
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dim);
            (0, chai_1.expect)(projectiveVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.resolveVectorSpace)(projectiveVS)).to.throw(VectorSpaceResolvers_2.EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });
    it(`cannot resolve a projective complex vector space if it is already registered`, () => {
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.resolveVectorSpace)(projectiveComplexVS)).to.throw(VectorSpaceResolvers_2.EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });
    it(`can check whether a real vector space is registered or not`, () => {
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new RealVectorSpace_2.RealVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a complex vector space is registered or not`, () => {
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ComplexVectorSpace_2.ComplexVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockComplexVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a projective vector space is registered or not`, () => {
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dim);
            (0, chai_1.expect)(projectiveVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(projectiveVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
                isDefault: false,
                name: 'mockProjectiveVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a projective complex vector space is registered or not`, () => {
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockProjectiveComplexVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`cannot check if a vector space is registered or not if its vector space type property is not of type ${BSplineR1toRn_1.VectorSpaceType.REAL}, ${BSplineR1toRn_1.VectorSpaceType.COMPLEX}, ${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE} or ${BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX}`, () => {
        const dim = 2;
        const mockVectorSpaceReal = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType',
            isDefault: false,
            name: 'mockVectorSpace',
            id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
        };
        (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpaceReal)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
        const mockVectorSpaceComplex = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType',
            isDefault: false,
            name: 'mockVectorSpace',
            id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
        };
        (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpaceComplex)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
        const mockVectorSpaceProjective = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType',
            isDefault: false,
            name: 'mockVectorSpace',
            id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
        };
        (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpaceProjective)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
        const mockVectorSpaceProjectiveComplex = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType',
            isDefault: false,
            name: 'mockVectorSpace',
            id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
        };
        (0, chai_1.expect)(() => (0, VectorSpaceResolvers_1.isRegisteredVectorSpace)(mockVectorSpaceProjectiveComplex)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
    });
    it(`can check whether a real vector space is registered or not`, () => {
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new RealVectorSpace_2.RealVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredRealVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredRealVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a complex vector space is registered or not`, () => {
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ComplexVectorSpace_2.ComplexVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredComplexVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockComplexVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredComplexVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a projective vector space is registered or not`, () => {
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveVectorSpace_2.ProjectiveVectorSpace(dim);
            (0, chai_1.expect)(projectiveVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredProjectiveRealVectorSpace)(projectiveVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
                isDefault: false,
                name: 'mockProjectiveVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredProjectiveRealVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
    it(`can check whether a projective complex vector space is registered or not`, () => {
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace_2.ProjectiveComplexVectorSpace(dim);
            (0, chai_1.expect)(projectiveComplexVS.isDefault).to.eql(false);
            (0, chai_1.expect)(projectiveComplexVS.id).to.not.eql(VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dim);
            (0, chai_1.expect)(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE)).to.eql(true);
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredProjectiveComplexVectorSpace)(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockProjectiveComplexVectorSpace',
                id: VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID
            };
            (0, chai_1.expect)((0, VectorSpaceResolvers_1.isRegisteredProjectiveComplexVectorSpace)(mockVectorSpace)).to.eql(false);
        }
    });
});
