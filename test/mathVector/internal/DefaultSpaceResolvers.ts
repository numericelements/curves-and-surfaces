import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../../src/namedConstants/RealVectorSpace";
import { getDefaultComplexVectorSpace, getDefaultProjectiveComplexVectorSpace, getDefaultProjectiveRealVectorSpace, getDefaultRealVectorSpace, getDefaultVectorSpace, resolveDefaultVectorSpace } from "../../../src/mathVector/internal/DefaultSpaceResolvers";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../../src/namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../../src/namedConstants/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../../src/namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../../src/namedConstants/ProjectiveComplexVectorSpace";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { DefaultVectorSpaces } from "../../../src/mathVector/internal/DefaultVectorSpaces";
import { DEFAULT, INITIAL_VECTOR_SPACE_ID, VECTOR_SPACE } from "../../../src/namedConstants/VectorSpaceIdentifierManager";
import { ComplexVectorSpace } from "../../../src/mathVector/ComplexVectorSpace";
import { ProjectiveVectorSpace } from "../../../src/mathVector/ProjectiveVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../../src/mathVector/ProjectiveComplexVectorSpace";
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED, EM_INVALID_VECTOR_SPACE_DIMENSION, EM_INVALID_VECTOR_SPACE_TYPE } from "../../../src/ErrorMessages/DefaultSpaceResolvers";
import { EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/RealVectorSpace";
import { EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ComplexVectorSpace";
import { EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ProjectiveVectorSpace";
import { EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ProjectiveComplexVectorSpace";

describe('Resolvers for default vector space generation associated with a vector', () => {

    beforeEach(() => {
        // Reset the default vector space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    it(`can get a default real vector space of dimensions ranging from ${MIN_DIMENSION_REALVECTORSPACE} to ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = new RealVectorSpace(i, true);
            expect(realVectorSpace.isDefault).to.eql(true);
            expect(realVectorSpace.dimension()).to.eql(i);
            expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVectorSpace.name).to.eql(DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const realVectorSpace1 = getDefaultRealVectorSpace(i);
            expect(realVectorSpace.id).to.eql(realVectorSpace1.id);
            expect(realVectorSpace).to.eql(realVectorSpace1);
        }
    });

    it(`can get a default complex vector space of dimensions ranging from ${MIN_DIMENSION_COMPLEXVECTORSPACE} to ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = new ComplexVectorSpace(i, true);
            expect(complexVectorSpace.isDefault).to.eql(true);
            expect(complexVectorSpace.dimension()).to.eql(i);
            expect(complexVectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVectorSpace.name).to.eql(DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const complexVectorSpace1 = getDefaultComplexVectorSpace(i);
            expect(complexVectorSpace.id).to.eql(complexVectorSpace1.id);
            expect(complexVectorSpace).to.eql(complexVectorSpace1);
        }
    });

    it(`can get a default projective real vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVEVECTORSPACE} to ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveRealVectorSpace = new ProjectiveVectorSpace(i, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace.dimension()).to.eql(i);
            expect(projectiveRealVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveRealVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const projectiveRealVectorSpace1 = getDefaultProjectiveRealVectorSpace(i);
            expect(projectiveRealVectorSpace.id).to.eql(projectiveRealVectorSpace1.id);
            expect(projectiveRealVectorSpace).to.eql(projectiveRealVectorSpace1);
        }
    });

    it(`can get a default projective complex vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE} to ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(i, true);
            expect(projectiveComplexVectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVectorSpace.dimension()).to.eql(i);
            expect(projectiveComplexVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const projectiveComplexVectorSpace1 = getDefaultProjectiveComplexVectorSpace(i);
            expect(projectiveComplexVectorSpace.id).to.eql(projectiveComplexVectorSpace1.id);
            expect(projectiveComplexVectorSpace).to.eql(projectiveComplexVectorSpace1);
        }
    });

    it('cannot get a vector space of unknown type', () => {
        expect(() => getDefaultVectorSpace(VectorSpaceType.UNKNOWN_VECTORSPACE, 2)).to.throw(RangeError);
        expect(() => getDefaultVectorSpace(VectorSpaceType.UNKNOWN_VECTORSPACE, 2)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
    });

    it(`can resolve the default vector space for any real vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 2,
            spaceType: VectorSpaceType.REAL,
            isDefault: true,
            name: 'mockRealVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as RealVectorSpace<2>;
        expect(resolveDefaultVectorSpace(mockVectorSpace).includes(DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
    });

    it(`can resolve the default vector space for any complex vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 1,
            spaceType: VectorSpaceType.COMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ComplexVectorSpace<1>;
        expect(resolveDefaultVectorSpace(mockVectorSpace).includes(DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
    });

    it(`can resolve the default vector space for any projective real vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 3,
            spaceType: VectorSpaceType.PROJECTIVE,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ProjectiveVectorSpace<3>;
        expect(resolveDefaultVectorSpace(mockVectorSpace).includes(DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
    });

    it(`can resolve the default vector space for any projective complex vector space and generate its id`, () => {
        const mockVectorSpace = {
            dimension: () => 2,
            spaceType: VectorSpaceType.PROJECTIVECOMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ProjectiveComplexVectorSpace<2>;
        expect(resolveDefaultVectorSpace(mockVectorSpace).includes(DEFAULT + `${mockVectorSpace.spaceType}_${mockVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
    });

    it(`cannot resolve the default vector space for any real vector space when a default real vector space of same dimension already exists`, () => {
        const dimension = 2;
        const realVectorSpace = new RealVectorSpace(dimension, true);
        expect(realVectorSpace.id.includes(DEFAULT + `${realVectorSpace.spaceType}_${realVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: VectorSpaceType.REAL,
            isDefault: true,
            name: 'mockRealVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as RealVectorSpace<2>;
        expect(() => resolveDefaultVectorSpace(mockVectorSpace)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });

    it(`cannot resolve the default vector space for any complex vector space when a default complex vector space of same dimension already exists`, () => {
        const dimension = 1;
        const complexVectorSpace = new ComplexVectorSpace(dimension, true);
        expect(complexVectorSpace.id.includes(DEFAULT + `${complexVectorSpace.spaceType}_${complexVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: VectorSpaceType.COMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ComplexVectorSpace<1>;
        expect(() => resolveDefaultVectorSpace(mockVectorSpace)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });

    it(`cannot resolve the default vector space for any projective real vector space when a default projective vector space of same dimension already exists`, () => {
        const dimension = 3;
        const projectiveVectorSpace = new ProjectiveVectorSpace(dimension, true);
        expect(projectiveVectorSpace.id.includes(DEFAULT + `${projectiveVectorSpace.spaceType}_${projectiveVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: VectorSpaceType.PROJECTIVE,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ProjectiveVectorSpace<3>;
        expect(() => resolveDefaultVectorSpace(mockVectorSpace)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });

    it(`can resolve the default vector space for any projective complex vector space when a default projective complex vector space of same dimension already exists`, () => {
        const dimension = 2;
        const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(dimension, true);
        expect(projectiveComplexVectorSpace.id.includes(DEFAULT + `${projectiveComplexVectorSpace.spaceType}_${projectiveComplexVectorSpace.dimension()}_` + VECTOR_SPACE)).to.eql(true);
        const mockVectorSpace = {
            dimension: () => dimension,
            spaceType: VectorSpaceType.PROJECTIVECOMPLEX,
            isDefault: true,
            name: 'mockComplexVectorSpace',
            id: INITIAL_VECTOR_SPACE_ID,
        } as ProjectiveComplexVectorSpace<2>;
        expect(() => resolveDefaultVectorSpace(mockVectorSpace)).to.throw(EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED);
    });

    it(`can generate or get, if it already exists, the default vector space for any real vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        expect(existingDefVS.length).to.eql(0);
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = new RealVectorSpace(i, true);
            expect(realVectorSpace.isDefault).to.eql(true);
            expect(realVectorSpace.dimension()).to.eql(i);
            expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(realVectorSpace.name).to.eql(DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const realVectorSpace1 = getDefaultVectorSpace(VectorSpaceType.REAL, i);
            expect(realVectorSpace.id).to.eql(realVectorSpace1.id);
            expect(realVectorSpace).to.eql(realVectorSpace1);

            const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            expect(existingDefVS.length).to.eql(i - MIN_DIMENSION_REALVECTORSPACE + 1);
        }
    });

    it(`can generate or get, if it already exists, the default vector space for any complex vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        expect(existingDefVS.length).to.eql(0);
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = new ComplexVectorSpace(i, true);
            expect(complexVectorSpace.isDefault).to.eql(true);
            expect(complexVectorSpace.dimension()).to.eql(i);
            expect(complexVectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(complexVectorSpace.name).to.eql(DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const complexVectorSpace1 = getDefaultVectorSpace(VectorSpaceType.COMPLEX, i);
            expect(complexVectorSpace.id).to.eql(complexVectorSpace1.id);
            expect(complexVectorSpace).to.eql(complexVectorSpace1);

            const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            expect(existingDefVS.length).to.eql(i - MIN_DIMENSION_COMPLEXVECTORSPACE + 1);
        }
    });

    it(`can generate or get, if it already exists, the default vector space for any projective real vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        expect(existingDefVS.length).to.eql(0);
        for (let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveRealVectorSpace = new ProjectiveVectorSpace(i, true);
            expect(projectiveRealVectorSpace.isDefault).to.eql(true);
            expect(projectiveRealVectorSpace.dimension()).to.eql(i);
            expect(projectiveRealVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(projectiveRealVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const projectiveRealVectorSpace1 = getDefaultVectorSpace(VectorSpaceType.PROJECTIVE, i);
            expect(projectiveRealVectorSpace.id).to.eql(projectiveRealVectorSpace1.id);
            expect(projectiveRealVectorSpace).to.eql(projectiveRealVectorSpace1);

            const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            expect(existingDefVS.length).to.eql(i - MIN_DIMENSION_PROJECTIVEVECTORSPACE + 1);
        }
    });

    it(`can generate or get, if it already exists, the default vector space for any projective complex vector space of every valid dimension with a generic call`, () => {
        const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
        expect(existingDefVS.length).to.eql(0);
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = new ProjectiveComplexVectorSpace(i, true);
            expect(projectiveComplexVectorSpace.isDefault).to.eql(true);
            expect(projectiveComplexVectorSpace.dimension()).to.eql(i);
            expect(projectiveComplexVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(projectiveComplexVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());

            // uniqueness of the vector space identifier
            const projectiveComplexVectorSpace1 = getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, i);
            expect(projectiveComplexVectorSpace.id).to.eql(projectiveComplexVectorSpace1.id);
            expect(projectiveComplexVectorSpace).to.eql(projectiveComplexVectorSpace1);

            const existingDefVS = DefaultVectorSpaces.getInstance().getAllDefaultSpaces();
            expect(existingDefVS.length).to.eql(i - MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1);
        }
    });

    it(`cannot get the default vector space for a vector space type distinct from ${VectorSpaceType}`, () => {
        const dimension = 2;
        const incorrectVSType = "IncorrectType" as VectorSpaceType;
        expect(() => getDefaultVectorSpace(incorrectVSType, dimension)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
    });

    it(`cannot get a default real vector space for a vector space dimension outside the range ${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const dimensionMin = MIN_DIMENSION_REALVECTORSPACE - 1;
        expect(() => getDefaultRealVectorSpace(dimensionMin)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = MAX_DIMENSION_REALVECTORSPACE + 1;
        expect(() => getDefaultRealVectorSpace(dimensionMax)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
    });

    it(`cannot get a default real vector space if there is no such vector space of dimension within the range ${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        expect(() => getDefaultRealVectorSpace(MIN_DIMENSION_REALVECTORSPACE)).to.throw(EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION);
    });

    it(`cannot get a default complex vector space for a vector space dimension outside the range ${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimensionMin = MIN_DIMENSION_COMPLEXVECTORSPACE - 1;
        expect(() => getDefaultComplexVectorSpace(dimensionMin)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = MAX_DIMENSION_COMPLEXVECTORSPACE + 1;
        expect(() => getDefaultComplexVectorSpace(dimensionMax)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
    });

    it(`cannot get a default complex vector space if there is no such vector space of dimension within the range ${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        expect(() => getDefaultComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE)).to.throw(EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION);
    });

    it(`cannot get a default projective real vector space for a vector space dimension outside the range ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimensionMin = MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1;
        expect(() => getDefaultProjectiveRealVectorSpace(dimensionMin)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        expect(() => getDefaultProjectiveRealVectorSpace(dimensionMax)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
    });

    it(`cannot get a default projective real vector space if there is no such vector space of dimension within the range ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        expect(() => getDefaultProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE)).to.throw(EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION);
    });

    it(`cannot get a default projective complex vector space for a vector space dimension outside the range ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimensionMin = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1;
        expect(() => getDefaultProjectiveComplexVectorSpace(dimensionMin)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
        const dimensionMax = MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1;
        expect(() => getDefaultProjectiveComplexVectorSpace(dimensionMax)).to.throw(EM_INVALID_VECTOR_SPACE_DIMENSION);
    });

    it(`cannot get a default projective complex vector space if there is no such vector space of dimension within the range ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        expect(() => getDefaultProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.throw(EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION);
    });
});