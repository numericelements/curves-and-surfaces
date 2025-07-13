import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/DefaultVectorSpaces";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../src/namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../src/namedConstants/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";

describe('Generation of default vector spaces', () => {
    it(`no instance of default real vector space is initially available`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        expect(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        expect(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[1];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[1];
        expect(projectiveComplexVectorSpaces).to.eql(undefined);
    });

    it(`cannot generate an instance of a default real vector space with a space dimension ouside interval ${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getRealVectorSpace(MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw();
        expect(() => vectorSpace.getRealVectorSpace(MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw();
    });

    it(`cannot generate an instance of a default complex vector space with a space dimension ouside interval ${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw();
        expect(() => vectorSpace.getComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw();
    });

    it(`cannot generate an instance of a default projective vector space with a space dimension ouside interval ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw();
        expect(() => vectorSpace.getProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw();
    });

    it(`cannot generate an instance of a default projective complex vector space with a space dimension ouside interval ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw();
        expect(() => vectorSpace.getProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw();
    });

    const vectorSpace = DefaultVectorSpaces.getInstance();

    it(`can create instances for each default real vector space`, () => {
        // const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        expect(realVectorSpaces).to.eql(undefined);
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getRealVectorSpace(i);
            expect(defVectorSpace.isDefault).to.eql(true);
            expect(defVectorSpace.name).to.eql(DEFAULT_REAL_VECTOR_SPACE_NAME + i);
            expect(defVectorSpace.dimension()).to.eql(i);
            expect(defVectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            expect(allVectorSpaces1.length).to.eql(i);
            const realVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1] as RealVectorSpace;
            expect(realVectorSpaces1.isDefault).to.eql(true);
            expect(realVectorSpaces1.name).to.eql(DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());
            expect(realVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            expect(realVectorSpaces1).to.eql(defVectorSpace);
        }
    });

    it(`can create instances for each default complex vector space`, () => {
        const currentLength = MAX_DIMENSION_REALVECTORSPACE;
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const complexVectorSpaces = allVectorSpaces[currentLength];
        expect(complexVectorSpaces).to.eql(undefined);
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getComplexVectorSpace(i);
            expect(defVectorSpace.isDefault).to.eql(true);
            expect(defVectorSpace.name).to.eql(DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i);
            expect(defVectorSpace.dimension()).to.eql(i);
            expect(defVectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            expect(allVectorSpaces1.length - currentLength).to.eql(i);
            const complexVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1] as ComplexVectorSpace;
            expect(complexVectorSpaces1.isDefault).to.eql(true);
            expect(complexVectorSpaces1.name).to.eql(DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            expect(complexVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            expect(complexVectorSpaces1).to.eql(defVectorSpace);
        }
    });

    it(`can create instances for each default projective real vector space`, () => {
        const currentLength = MAX_DIMENSION_REALVECTORSPACE + MAX_DIMENSION_COMPLEXVECTORSPACE;
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveRealVectorSpaces = allVectorSpaces[currentLength];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        for (let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveVectorSpace(i);
            expect(defVectorSpace.isDefault).to.eql(true);
            expect(defVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i);
            expect(defVectorSpace.dimension()).to.eql(i);
            expect(defVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            expect(allVectorSpaces1.length - currentLength + MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1).to.eql(i);
            const projectiveVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1] as ProjectiveVectorSpace;
            expect(projectiveVectorSpaces1.isDefault).to.eql(true);
            expect(projectiveVectorSpaces1.name).to.eql(DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());
            expect(projectiveVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            expect(projectiveVectorSpaces1).to.eql(defVectorSpace);
        }
    });

    it(`can create instances for each default projective complex vector space`, () => {
        const currentLength = MAX_DIMENSION_REALVECTORSPACE + MAX_DIMENSION_COMPLEXVECTORSPACE + 
            (MAX_DIMENSION_PROJECTIVEVECTORSPACE - MIN_DIMENSION_PROJECTIVEVECTORSPACE + 1) ;
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveComplexVectorSpaces = allVectorSpaces[currentLength];
        expect(projectiveComplexVectorSpaces).to.eql(undefined);
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveComplexVectorSpace(i);
            expect(defVectorSpace.isDefault).to.eql(true);
            expect(defVectorSpace.name).to.eql(DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i);
            expect(defVectorSpace.dimension()).to.eql(i);
            expect(defVectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            expect(allVectorSpaces1.length - currentLength + MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1).to.eql(i);
            const projectiveComplexVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1] as ProjectiveComplexVectorSpace;
            expect(projectiveComplexVectorSpaces1.isDefault).to.eql(true);
            expect(projectiveComplexVectorSpaces1.name).to.eql(DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            expect(projectiveComplexVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            expect(projectiveComplexVectorSpaces1).to.eql(defVectorSpace);
        }
    });

    it(`all vector spaces constained into DefaultVectorSpaces are default ones`, () => {
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        for (const vSpace of allVectorSpaces) {
            expect(vectorSpace.isDefaultSpace(vSpace)).to.eql(true);
        }
    });
});