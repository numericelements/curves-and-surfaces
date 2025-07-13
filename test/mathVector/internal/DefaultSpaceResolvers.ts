import { expect } from "chai";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../../src/namedConstants/RealVectorSpace";
import { getDefaultComplexVectorSpace, getDefaultProjectiveComplexVectorSpace, getDefaultProjectiveRealVectorSpace, getDefaultRealVectorSpace, resolveDefaultVectorSpace } from "../../../src/mathVector/internal/DefaultSpaceResolvers";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../../src/namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../../src/namedConstants/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../../src/namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../../src/namedConstants/ProjectiveComplexVectorSpace";

describe('Resolvers for default vector space generation associated with a vector', () => {
    it(`can generate a default real vector space of dimensions ranging from ${MIN_DIMENSION_REALVECTORSPACE}} to ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVectorSpace = getDefaultRealVectorSpace(i);
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

    it(`can generate a default complex vector space of dimensions ranging from ${MIN_DIMENSION_COMPLEXVECTORSPACE}} to ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVectorSpace = getDefaultComplexVectorSpace(i);
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

    it(`can generate a default projective real vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}} to ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveRealVectorSpace = getDefaultProjectiveRealVectorSpace(i);
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

    it(`can generate a default projective complex vector space of dimensions ranging from ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}} to ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVectorSpace = getDefaultProjectiveComplexVectorSpace(i);
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

    it(`can resolve the default vector space for any real vector space `, () => {
        expect(resolveDefaultVectorSpace(VectorSpaceType.REAL, MIN_DIMENSION_REALVECTORSPACE)).to.eql(getDefaultRealVectorSpace(MIN_DIMENSION_REALVECTORSPACE));
        const realVectorSpace = resolveDefaultVectorSpace(VectorSpaceType.REAL, MIN_DIMENSION_REALVECTORSPACE);
        expect(realVectorSpace.isDefault).to.eql(true);
        expect(realVectorSpace.dimension()).to.eql(MIN_DIMENSION_REALVECTORSPACE);
        expect(realVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
    });

    it(`can resolve the default vector space for any complex vector space `, () => {
        expect(resolveDefaultVectorSpace(VectorSpaceType.COMPLEX, MAX_DIMENSION_COMPLEXVECTORSPACE)).to.eql(getDefaultComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE));
        const complexVectorSpace = resolveDefaultVectorSpace(VectorSpaceType.COMPLEX, MAX_DIMENSION_COMPLEXVECTORSPACE);
        expect(complexVectorSpace.isDefault).to.eql(true);
        expect(complexVectorSpace.dimension()).to.eql(MAX_DIMENSION_COMPLEXVECTORSPACE);
        expect(complexVectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
    });

    it(`can resolve the default vector space for any projective real vector space `, () => {
        expect(resolveDefaultVectorSpace(VectorSpaceType.PROJECTIVE, MIN_DIMENSION_PROJECTIVEVECTORSPACE)).to.eql(getDefaultProjectiveRealVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE));
        const projectiveRealVectorSpace = resolveDefaultVectorSpace(VectorSpaceType.PROJECTIVE, MIN_DIMENSION_PROJECTIVEVECTORSPACE);
        expect(projectiveRealVectorSpace.isDefault).to.eql(true);
        expect(projectiveRealVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVEVECTORSPACE);
        expect(projectiveRealVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
    });

    it(`can resolve the default vector space for any projective complex vector space `, () => {
        expect(resolveDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.eql(getDefaultProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE));
        const projectiveComplexVectorSpace = resolveDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
        expect(projectiveComplexVectorSpace.isDefault).to.eql(true);
        expect(projectiveComplexVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
        expect(projectiveComplexVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
    });
});