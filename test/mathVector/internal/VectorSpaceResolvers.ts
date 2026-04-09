import { expect } from "chai";
import { VectorSpaceIdentifierManager } from "../../../src/mathVector/internal/VectorSpaceIdentifierManager";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../../src/namedConstants/RealVectorSpace";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { isRegisteredComplexVectorSpace, isRegisteredProjectiveComplexVectorSpace, isRegisteredProjectiveRealVectorSpace, isRegisteredRealVectorSpace, isRegisteredVectorSpace, resolveVectorSpace } from "../../../src/mathVector/internal/VectorSpaceResolvers";
import { INITIAL_VECTOR_SPACE_ID, VECTOR_SPACE } from "../../../src/namedConstants/VectorSpaceIdentifierManager";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { EM_VECTOR_SPACE_ALREADY_REGISTERED } from "../../../src/ErrorMessages/VectorSpaceResolvers";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../../src/namedConstants/ComplexVectorSpace";
import { ComplexVectorSpace } from "../../../src/mathVector/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, MIN_DIMENSION_PROJECTIVEREALVECTORSPACE } from "../../../src/namedConstants/ProjectiveRealVectorSpace";
import { ProjectiveRealVectorSpace } from "../../../src/mathVector/ProjectiveRealVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../../src/namedConstants/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../../src/mathVector/ProjectiveComplexVectorSpace";
import { EM_INVALID_VECTOR_SPACE_TYPE } from "../../../src/ErrorMessages/DefaultSpaceResolvers";

describe('Resolving and checking vector space registration for user-defined vector spaces associated with a vector', () => {

    beforeEach(() => {
        // Reset the default vector space manager singleton before each test
        VectorSpaceIdentifierManager.reset();
    });

    it(`can resolve a real vector space of dimensions ranging from ${MIN_DIMENSION_REALVECTORSPACE} to ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const mockVectorSpaces: Array <RealVectorSpace> = [];
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as RealVectorSpace<typeof dim>;
        }
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = resolveVectorSpace(mockVectorSpaces[i - 1]);
            expect(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            expect(realVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VECTOR_SPACE)).to.eql(true);
        }
    });

    it(`can resolve a complex vector space of dimensions ranging from ${MIN_DIMENSION_COMPLEXVECTORSPACE} to ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const mockVectorSpaces: Array <ComplexVectorSpace> = [];
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ComplexVectorSpace<typeof dim>;
        }
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = resolveVectorSpace(mockVectorSpaces[i - 1]);
            expect(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            expect(complexVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VECTOR_SPACE)).to.eql(true);
        }
    });

    it(`can resolve a projective real vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVEREALVECTORSPACE} to ${MAX_DIMENSION_PROJECTIVEREALVECTORSPACE}`, () => {
        const mockVectorSpaces: Array <ProjectiveRealVectorSpace> = [];
        for (let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 3] = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVEREAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveRealVectorSpace<typeof dim>;
        }
        for (let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
            const projectiveRealVectorSpace = resolveVectorSpace(mockVectorSpaces[i - 3]);
            expect(mockVectorSpaces[i - 3].isDefault).to.eql(false);
            expect(projectiveRealVectorSpace.includes(`${mockVectorSpaces[i - 3].spaceType}_${mockVectorSpaces[i - 3].dimension()}_` + VECTOR_SPACE)).to.eql(true);
        }
    });

    it(`can resolve a complex projective vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE} to ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const mockVectorSpaces: Array <ProjectiveComplexVectorSpace> = [];
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            mockVectorSpaces[i - 1] = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveComplexVectorSpace<typeof dim>;
        }
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = resolveVectorSpace(mockVectorSpaces[i - 1]);
            expect(mockVectorSpaces[i - 1].isDefault).to.eql(false);
            expect(projectiveComplexVectorSpace.includes(`${mockVectorSpaces[i - 1].spaceType}_${mockVectorSpaces[i - 1].dimension()}_` + VECTOR_SPACE)).to.eql(true);
        }
    });

    it(`cannot resolve a real vector space if it is already registered`, () => {
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const realVS = new RealVectorSpace(dim);
            expect(realVS.isDefault).to.eql(false);
            expect(realVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(realVS.dimension()).to.eql(dim);
            expect(realVS.id.includes(`${realVS.spaceType}_${realVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(() => resolveVectorSpace(realVS)).to.throw(EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });

    it(`cannot resolve a complex vector space if it is already registered`, () => {
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const complexVS = new ComplexVectorSpace(dim);
            expect(complexVS.isDefault).to.eql(false);
            expect(complexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(complexVS.dimension()).to.eql(dim);
            expect(complexVS.id.includes(`${complexVS.spaceType}_${complexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(() => resolveVectorSpace(complexVS)).to.throw(EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });

    it(`cannot resolve a projective vector space if it is already registered`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveRealVectorSpace(dim);
            expect(projectiveVS.isDefault).to.eql(false);
            expect(projectiveVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveVS.dimension()).to.eql(dim);
            expect(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(() => resolveVectorSpace(projectiveVS)).to.throw(EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });

    it(`cannot resolve a projective complex vector space if it is already registered`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(dim);
            expect(projectiveComplexVS.isDefault).to.eql(false);
            expect(projectiveComplexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveComplexVS.dimension()).to.eql(dim);
            expect(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(() => resolveVectorSpace(projectiveComplexVS)).to.throw(EM_VECTOR_SPACE_ALREADY_REGISTERED);
        }
    });

    it(`can check whether a real vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new RealVectorSpace(dim);
            expect(projectiveComplexVS.isDefault).to.eql(false);
            expect(projectiveComplexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveComplexVS.dimension()).to.eql(dim);
            expect(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredVectorSpace(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as RealVectorSpace<typeof dim>;
            expect(isRegisteredVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a complex vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ComplexVectorSpace(dim);
            expect(projectiveComplexVS.isDefault).to.eql(false);
            expect(projectiveComplexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveComplexVS.dimension()).to.eql(dim);
            expect(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredVectorSpace(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockComplexVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ComplexVectorSpace<typeof dim>;
            expect(isRegisteredVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a projective vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveRealVectorSpace(dim);
            expect(projectiveVS.isDefault).to.eql(false);
            expect(projectiveVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveVS.dimension()).to.eql(dim);
            expect(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredVectorSpace(projectiveVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVEREAL,
                isDefault: false,
                name: 'mockProjectiveRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveRealVectorSpace<typeof dim>;
            expect(isRegisteredVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a projective complex vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(dim);
            expect(projectiveComplexVS.isDefault).to.eql(false);
            expect(projectiveComplexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveComplexVS.dimension()).to.eql(dim);
            expect(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredVectorSpace(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockProjectiveComplexVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveComplexVectorSpace<typeof dim>;
            expect(isRegisteredVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`cannot check if a vector space is registered or not if its vector space type property is not of type ${VectorSpaceType.REAL}, ${VectorSpaceType.COMPLEX}, ${VectorSpaceType.PROJECTIVEREAL} or ${VectorSpaceType.PROJECTIVECOMPLEX}`, () => {
        const dim = 2;
        const mockVectorSpaceReal = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType' as VectorSpaceType,
            isDefault: false,
            name: 'mockVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID
        } as RealVectorSpace<typeof dim>;
        expect(() => isRegisteredVectorSpace(mockVectorSpaceReal)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
        
        const mockVectorSpaceComplex = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType' as VectorSpaceType,
            isDefault: false,
            name: 'mockVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID
        } as ComplexVectorSpace<typeof dim>;
        expect(() => isRegisteredVectorSpace(mockVectorSpaceComplex)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
        
        const mockVectorSpaceProjective = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType' as VectorSpaceType,
            isDefault: false,
            name: 'mockVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID
        } as ProjectiveRealVectorSpace<typeof dim>;
        expect(() => isRegisteredVectorSpace(mockVectorSpaceProjective)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);

        const mockVectorSpaceProjectiveComplex = {
            dimension: () => dim,
            spaceType: 'MockVectorSpaceType' as VectorSpaceType,
            isDefault: false,
            name: 'mockVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID
        } as ProjectiveComplexVectorSpace<typeof dim>;
        expect(() => isRegisteredVectorSpace(mockVectorSpaceProjectiveComplex)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
    });

    it(`can check whether a real vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const dim = i;
            const realVS = new RealVectorSpace(dim);
            expect(realVS.isDefault).to.eql(false);
            expect(realVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(realVS.dimension()).to.eql(dim);
            expect(realVS.id.includes(`${realVS.spaceType}_${realVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredRealVectorSpace(realVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.REAL,
                isDefault: false,
                name: 'mockRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as RealVectorSpace<typeof dim>;
            expect(isRegisteredRealVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a complex vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const dim = i;
            const complexVS = new ComplexVectorSpace(dim);
            expect(complexVS.isDefault).to.eql(false);
            expect(complexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(complexVS.dimension()).to.eql(dim);
            expect(complexVS.id.includes(`${complexVS.spaceType}_${complexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredComplexVectorSpace(complexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.COMPLEX,
                isDefault: false,
                name: 'mockComplexVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ComplexVectorSpace<typeof dim>;
            expect(isRegisteredComplexVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a projective vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; i++) {
            const dim = i;
            const projectiveVS = new ProjectiveRealVectorSpace(dim);
            expect(projectiveVS.isDefault).to.eql(false);
            expect(projectiveVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveVS.dimension()).to.eql(dim);
            expect(projectiveVS.id.includes(`${projectiveVS.spaceType}_${projectiveVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVEREAL,
                isDefault: false,
                name: 'mockProjectiveRealVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveRealVectorSpace<typeof dim>;
            expect(isRegisteredProjectiveRealVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });

    it(`can check whether a projective complex vector space is registered or not`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const dim = i;
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(dim);
            expect(projectiveComplexVS.isDefault).to.eql(false);
            expect(projectiveComplexVS.id).to.not.eql(INITIAL_VECTOR_SPACE_ID);
            expect(projectiveComplexVS.dimension()).to.eql(dim);
            expect(projectiveComplexVS.id.includes(`${projectiveComplexVS.spaceType}_${projectiveComplexVS.dimension()}_` + VECTOR_SPACE)).to.eql(true);
            expect(isRegisteredProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
            const mockVectorSpace = {
                dimension: () => dim,
                spaceType: VectorSpaceType.PROJECTIVECOMPLEX,
                isDefault: false,
                name: 'mockProjectiveComplexVectorSpace',
                id: INITIAL_VECTOR_SPACE_ID
            } as ProjectiveComplexVectorSpace<typeof dim>;
            expect(isRegisteredProjectiveComplexVectorSpace(mockVectorSpace)).to.eql(false);
        }
    });
});