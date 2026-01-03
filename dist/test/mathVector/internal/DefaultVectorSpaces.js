"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DefaultVectorSpaces_1 = require("../../../src/mathVector/internal/DefaultVectorSpaces");
const RealVectorSpace_1 = require("../../../src/mathVector/RealVectorSpace");
const ComplexVectorSpace_1 = require("../../../src/mathVector/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../../src/mathVector/ProjectiveComplexVectorSpace");
const VectorSpaceIdentifierManager_1 = require("../../../src/namedConstants/VectorSpaceIdentifierManager");
const BSplineR1toRn_1 = require("../../../src/namedConstants/BSplineR1toRn");
const DefaultSpaceResolvers_1 = require("../../../src/ErrorMessages/DefaultSpaceResolvers");
const DefaultVectorSpaces_2 = require("../../../src/namedConstants/DefaultVectorSpaces");
const RealVectorSpace_2 = require("../../../src/namedConstants/RealVectorSpace");
const ComplexVectorSpace_2 = require("../../../src/namedConstants/ComplexVectorSpace");
const ProjectiveVectorSpace_2 = require("../../../src/namedConstants/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_2 = require("../../../src/namedConstants/ProjectiveComplexVectorSpace");
describe('DefaultVectorSpaces. Identifier Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    beforeEach(() => {
        // Reset the singleton before each test
        DefaultVectorSpaces_1.DefaultVectorSpaces.reset();
    });
    it(`no instance of ${DefaultVectorSpaces_1.DefaultVectorSpaces} is initially available`, () => {
        (0, chai_1.expect)(DefaultVectorSpaces_1.DefaultVectorSpaces.hasInstance()).to.eql(false);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace).to.not.eql(null);
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        (0, chai_1.expect)(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[2];
        (0, chai_1.expect)(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[3];
        (0, chai_1.expect)(projectiveComplexVectorSpaces).to.eql(undefined);
    });
    it(`generates a unique instance of ${DefaultVectorSpaces_1.DefaultVectorSpaces}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const vectorSpace1 = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace).to.eql(vectorSpace1);
    });
    it(`no instance of default vector space is initially available`, () => {
        (0, chai_1.expect)(DefaultVectorSpaces_1.DefaultVectorSpaces.hasInstance()).to.eql(false);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const realVS = new RealVectorSpace_1.RealVectorSpace(2, true);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
        const defaultVSId = new RealVectorSpace_1.RealVectorSpace(1, true);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(defaultVSId)).to.eql(true);
    });
    it(`generate default vector space identifiers that differ from each other`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const vsId = vectorSpace.generateId();
        const vsId1 = vectorSpace.generateId();
        (0, chai_1.expect)(vsId).to.not.eql(vsId1);
    });
    it(`cannot register an instance of a default real vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const realVS = new RealVectorSpace_1.RealVectorSpace(2, true);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerRealVectorSpace(realVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a default complex vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const complexVS = new ComplexVectorSpace_1.ComplexVectorSpace(1, true);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(complexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerComplexVectorSpace(complexVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a default projective real vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const projectiveVS = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(3, true);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(projectiveVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveRealVectorSpace(projectiveVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a default projective complex vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const projectiveComplexVS = new ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace(2, true);
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.eql(DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE);
        (0, chai_1.expect)(vectorSpace.isDefaultSpace(projectiveComplexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`can generate a vector space identifier conforming to the reference structure`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const vsId = vectorSpace.generateId();
        const decomposedId = vsId.split('_');
        (0, chai_1.expect)(decomposedId.length).to.eql(3);
        (0, chai_1.expect)(decomposedId[0] + '_').to.eql(VectorSpaceIdentifierManager_1.VECTOR_SPACE);
        (0, chai_1.expect)(decomposedId[1]).to.match(/^\d+$/); // Check if the second part is a number
        (0, chai_1.expect)(decomposedId[1]).to.eql('1'); // Check if the second part is '1' for the first generated ID
        (0, chai_1.expect)(decomposedId[2]).to.match(/^\d+$/); // Check if the third part is a number
        const vsId1 = vectorSpace.generateId();
        const decomposedId1 = vsId1.split('_');
        (0, chai_1.expect)(decomposedId1[1]).to.eql('2'); // Check if the second part is incremented
        const dateNow = parseInt(decomposedId[2], 10);
        const dateNow1 = parseInt(decomposedId1[2], 10);
        (0, chai_1.expect)(dateNow1 >= dateNow).to.eql(true); // Check if the third part is strictly increasing
    });
    it(`can get the index of a real vector space if the index is not undefined`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const projectiveVS = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(3, true);
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        (0, chai_1.expect)(vsIndex).to.eql(1); // The first registered vector space should have index 1
    });
    it(`cannot get the index of a vector space if the index has the initial value ${VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        (0, chai_1.expect)(vsIndex).to.eql(undefined); // The first registered vector space should have index 1
    });
    it(`cannot get the index of a vector space if the index is not the fourth sub-string in the string forming the index`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE);
    });
    it(`cannot get the index of a vector space if the string index cannot be converted into a number`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_notANumber');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot get the index of a vector space if the index is smaller than ${DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_0');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_2');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS1)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a default vector space for a vector space type distinct from ${BSplineR1toRn_1.VectorSpaceType}`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        const dimension = 2;
        const incorrectVSType = "IncorrectType";
        const realVS = createMockVectorSpace(dimension, incorrectVSType, 'subString1_subString2_subString3_0');
        (0, chai_1.expect)(() => vectorSpace.registerVectorSpace(realVS)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
    });
    it(`cannot register a real vector space if the vector space dimension value has already been used`, () => {
        const dimension = 2;
        let realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(realVS)).to.be.eql(undefined);
        const realVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_1.DEFAULT + `${BSplineR1toRn_1.VectorSpaceType.REAL}_${dimension}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE + DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS2)).to.eql(false);
    });
    it(`cannot register a real vector space if the vector space dimension is greater than the max dimension ${RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const dimension = RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE + 1;
        const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });
    it(`cannot register a real vector space if the vector space dimension is smaller than the minimal dimension ${RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE}`, () => {
        const dimension = RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE - 1;
        const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });
    it(`can register a real vector space if the vector space dimension fall within the interval [${RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE}, ${RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE; dimension <= RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE; dimension++) {
            const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(realVS)).to.be.eql(undefined);
        }
    });
    it(`cannot register a complex vector space if the vector space dimension value has already been used`, () => {
        const dimension = ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE;
        let complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(complexVS)).to.be.eql(undefined);
        const complexVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_1.DEFAULT + `${BSplineR1toRn_1.VectorSpaceType.COMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE + DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS2)).to.eql(false);
    });
    it(`cannot register a complex vector space if the vector space dimension is greater than the max dimension ${ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimension = ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE + 1;
        const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });
    it(`cannot register a complex vector space if the vector space dimension is smaller than the minimal dimension ${ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimension = ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE - 1;
        const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });
    it(`can register a complex vector space if the vector space dimension fall within the interval [${ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE}, ${ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE; dimension <= ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE; dimension++) {
            const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(complexVS)).to.be.eql(undefined);
        }
    });
    it(`cannot register a projective real vector space if the vector space dimension value has already been used`, () => {
        const dimension = ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE;
        let projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.be.eql(undefined);
        const projectiveVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.DEFAULT + `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE + DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS2)).to.eql(false);
    });
    it(`cannot register a projective real vector space if the vector space dimension is greater than the max dimension ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimension = ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });
    it(`cannot register a projective real vector space if the vector space dimension is smaller than the minimal dimension ${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimension = ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });
    it(`can register a projective real vector space if the vector space dimension fall within the interval [${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE; dimension <= ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE; dimension++) {
            const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.be.eql(undefined);
        }
    });
    it(`cannot register a projective complex vector space if the vector space dimension value has already been used`, () => {
        const dimension = ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE;
        let projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.be.eql(undefined);
        const projectiveComplexVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_1.DEFAULT + `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_1.VECTOR_SPACE + DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS2)).to.eql(false);
    });
    it(`cannot register a projective complex vector space if the vector space dimension is greater than the max dimension ${ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimension = ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });
    it(`cannot register a projective complex vector space if the vector space dimension is smaller than the minimal dimension ${ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimension = ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });
    it(`can register a projective complex vector space if the vector space dimension fall within the interval [${ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension <= ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension++) {
            const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID);
            (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.be.eql(undefined);
        }
    });
    it(`cannot get a real vector space for a space dimension outside the interval [${RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE}, ${RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getRealVectorSpace(RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw(RangeError);
        (0, chai_1.expect)(() => vectorSpace.getRealVectorSpace(RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw(RangeError);
    });
    it(`cannot get a complex vector space for a space dimension outside the interval [${ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE}, ${ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getComplexVectorSpace(ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw(RangeError);
        (0, chai_1.expect)(() => vectorSpace.getComplexVectorSpace(ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw(RangeError);
    });
    it(`cannot get a projective real vector space for a space dimension outside the interval [${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveVectorSpace(ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw(RangeError);
        (0, chai_1.expect)(() => vectorSpace.getProjectiveVectorSpace(ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw(RangeError);
    });
    it(`cannot get a projective complex vector space for a space dimension outside the interval [${ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        (0, chai_1.expect)(() => vectorSpace.getProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw(RangeError);
        (0, chai_1.expect)(() => vectorSpace.getProjectiveComplexVectorSpace(ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw(RangeError);
    });
    it(`can get a real vector space for a space dimension within the interval [${RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE}, ${RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE; dimension <= RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE; dimension++) {
            const realVS = vectorSpace.getRealVectorSpace(dimension);
            (0, chai_1.expect)(realVS).to.not.eql(undefined);
            (0, chai_1.expect)(realVS.dimension()).to.eql(dimension);
            (0, chai_1.expect)(realVS.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
            (0, chai_1.expect)(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(realVS)).to.eql(DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE + dimension - RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE);
        }
    });
    it(`can get a complex vector space for a space dimension within the interval [${ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE}, ${ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE; dimension <= ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE; dimension++) {
            const complexVS = vectorSpace.getComplexVectorSpace(dimension);
            (0, chai_1.expect)(complexVS).to.not.eql(undefined);
            (0, chai_1.expect)(complexVS.dimension()).to.eql(dimension);
            (0, chai_1.expect)(complexVS.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.COMPLEX);
            (0, chai_1.expect)(vectorSpace.isDefaultSpace(complexVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(complexVS)).to.eql(DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE + dimension - ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE);
        }
    });
    it(`can get a projective real vector space for a space dimension within the interval [${ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE; dimension <= ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE; dimension++) {
            const projectiveVS = vectorSpace.getProjectiveVectorSpace(dimension);
            (0, chai_1.expect)(projectiveVS).to.not.eql(undefined);
            (0, chai_1.expect)(projectiveVS.dimension()).to.eql(dimension);
            (0, chai_1.expect)(projectiveVS.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVE);
            (0, chai_1.expect)(vectorSpace.isDefaultSpace(projectiveVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.eql(DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE + dimension - ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE);
        }
    });
    it(`can get a projective complex vector space for a space dimension within the interval [${ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces_1.DefaultVectorSpaces.getInstance();
        for (let dimension = ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension <= ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension++) {
            const projectiveComplexVS = vectorSpace.getProjectiveComplexVectorSpace(dimension);
            (0, chai_1.expect)(projectiveComplexVS).to.not.eql(undefined);
            (0, chai_1.expect)(projectiveComplexVS.dimension()).to.eql(dimension);
            (0, chai_1.expect)(projectiveComplexVS.spaceType).to.eql(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX);
            (0, chai_1.expect)(vectorSpace.isDefaultSpace(projectiveComplexVS)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.eql(DefaultVectorSpaces_2.DEFAULT_VSPACE_INDEX_INITIAL_VALUE + dimension - ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
        }
    });
});
// Helper function to create mock spaces
function createMockVectorSpace(dimension, spaceType, id) {
    const mockSpace = {
        dimension: () => dimension,
        spaceType: spaceType,
        isDefault: true,
        name: 'mockVectorSpace',
        id: id
    };
    return mockSpace;
}
