"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DefaultVectorSpaces_1 = require("../../src/mathVector/internal/DefaultVectorSpaces");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../src/namedConstants/RealVectorSpace");
const DefaultVectorSpaces_2 = require("../../src/namedConstants/DefaultVectorSpaces");
const ComplexVectorSpace_1 = require("../../src/namedConstants/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../src/namedConstants/ProjectiveComplexVectorSpace");
describe('DefaultVectorSpaces. Generation of default vector spaces', () => {
    beforeEach(() => {
        // Reset the singleton before each test
        DefaultVectorSpaces_1.DefaultVectorSpaces.reset();
    });
    it(`no instance of default real vector space is initially available`, () => {
        (0, chai_1.expect)(DefaultVectorSpaces_1.DefaultVectorSpaces.hasInstance()).to.eql(false);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        (0, chai_1.expect)(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[1];
        (0, chai_1.expect)(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[1];
        (0, chai_1.expect)(projectiveComplexVectorSpaces).to.eql(undefined);
    });
    it(`cannot generate an instance of a default real vector space with a space dimension ouside interval ${RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE}, ${RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getRealVectorSpace(RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw();
        (0, chai_1.expect)(() => vectorSpace.getRealVectorSpace(RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw();
    });
    // it(`cannot generate an instance of a default complex vector space with a space dimension ouside interval ${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
    //     const vectorSpace = DefaultVectorSpaces.getInstance();
    //     expect(() => vectorSpace.getComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw();
    //     expect(() => vectorSpace.getComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw();
    // });
    it(`cannot generate an instance of a default projective vector space with a space dimension ouside interval ${ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveVectorSpace(ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveVectorSpace(ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw();
    });
    it(`cannot generate an instance of a default projective complex vector space with a space dimension ouside interval ${ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw();
    });
    it(`can create instances for each default real vector space`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(realVectorSpaces).to.eql(undefined);
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getRealVectorSpace(i);
            (0, chai_1.expect)(defVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(defVectorSpace.name).to.eql(DefaultVectorSpaces_2.DEFAULT_REAL_VECTOR_SPACE_NAME + i);
            (0, chai_1.expect)(defVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(defVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            (0, chai_1.expect)(allVectorSpaces1.length).to.eql(i);
            const realVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1];
            (0, chai_1.expect)(realVectorSpaces1.isDefault).to.eql(true);
            (0, chai_1.expect)(realVectorSpaces1.name).to.eql(DefaultVectorSpaces_2.DEFAULT_REAL_VECTOR_SPACE_NAME + i.toString());
            (0, chai_1.expect)(realVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            (0, chai_1.expect)(realVectorSpaces1).to.eql(defVectorSpace);
        }
    });
    it(`can create instances for each default complex vector space`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const complexVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(complexVectorSpaces).to.eql(undefined);
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getComplexVectorSpace(i);
            (0, chai_1.expect)(defVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(defVectorSpace.name).to.eql(DefaultVectorSpaces_2.DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i);
            (0, chai_1.expect)(defVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(defVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            (0, chai_1.expect)(allVectorSpaces1.length).to.eql(i);
            const complexVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1];
            (0, chai_1.expect)(complexVectorSpaces1.isDefault).to.eql(true);
            (0, chai_1.expect)(complexVectorSpaces1.name).to.eql(DefaultVectorSpaces_2.DEFAULT_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            (0, chai_1.expect)(complexVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            (0, chai_1.expect)(complexVectorSpaces1).to.eql(defVectorSpace);
        }
    });
    it(`can create instances for each default projective real vector space`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveRealVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(projectiveRealVectorSpaces).to.eql(undefined);
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveVectorSpace(i);
            (0, chai_1.expect)(defVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(defVectorSpace.name).to.eql(DefaultVectorSpaces_2.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i);
            (0, chai_1.expect)(defVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(defVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            (0, chai_1.expect)(allVectorSpaces1.length + ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1).to.eql(i);
            const projectiveVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1];
            (0, chai_1.expect)(projectiveVectorSpaces1.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveVectorSpaces1.name).to.eql(DefaultVectorSpaces_2.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + i.toString());
            (0, chai_1.expect)(projectiveVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            (0, chai_1.expect)(projectiveVectorSpaces1).to.eql(defVectorSpace);
        }
    });
    it(`can create instances for each default projective complex vector space`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveComplexVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(projectiveComplexVectorSpaces).to.eql(undefined);
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveComplexVectorSpace(i);
            (0, chai_1.expect)(defVectorSpace.isDefault).to.eql(true);
            (0, chai_1.expect)(defVectorSpace.name).to.eql(DefaultVectorSpaces_2.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i);
            (0, chai_1.expect)(defVectorSpace.dimension()).to.eql(i);
            (0, chai_1.expect)(defVectorSpace.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
            const allVectorSpaces1 = vectorSpace.getAllDefaultSpaces();
            (0, chai_1.expect)(allVectorSpaces1.length).to.eql(i - ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1);
            const projectiveComplexVectorSpaces1 = allVectorSpaces1[allVectorSpaces1.length - 1];
            (0, chai_1.expect)(projectiveComplexVectorSpaces1.isDefault).to.eql(true);
            (0, chai_1.expect)(projectiveComplexVectorSpaces1.name).to.eql(DefaultVectorSpaces_2.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + i.toString());
            (0, chai_1.expect)(projectiveComplexVectorSpaces1.dimension()).to.eql(defVectorSpace.dimension());
            (0, chai_1.expect)(projectiveComplexVectorSpaces1).to.eql(defVectorSpace);
        }
    });
    it(`all vector spaces contained into DefaultVectorSpaces are default ones`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let i = RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE; i <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getRealVectorSpace(i);
        }
        for (let i = ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE; i <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getComplexVectorSpace(i);
        }
        for (let i = ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveVectorSpace(i);
        }
        for (let i = ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const defVectorSpace = vectorSpace.getProjectiveComplexVectorSpace(i);
        }
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        for (const vSpace of allVectorSpaces) {
            (0, chai_1.expect)(vectorSpace.isDefaultSpace(vSpace)).to.eql(true);
        }
    });
});
