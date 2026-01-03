"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VectorSpaceIdentifierManager_1 = require("../../../src/mathVector/internal/VectorSpaceIdentifierManager");
const BSplineR1toRn_1 = require("../../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../../src/mathVector/RealVectorSpace");
const ComplexVectorSpace_1 = require("../../../src/mathVector/ComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../../src/mathVector/ProjectiveVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../../../src/mathVector/ProjectiveComplexVectorSpace");
const VectorSpaceIdentifierManager_2 = require("../../../src/namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceIdentifierManager_3 = require("../../../src/ErrorMessages/VectorSpaceIdentifierManager");
const DefaultSpaceResolvers_1 = require("../../../src/ErrorMessages/DefaultSpaceResolvers");
/**
 * Test helper class with protected access to VectorSpaceIdentifierManager internals
 * @internal
 */
class VectorSpaceIdentifierManagerTestHelper {
    static createTestInstance(nextIndex) {
        VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.reset();
        this.testInstance = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.createInstanceForTesting(nextIndex);
        return this.testInstance;
    }
    static resetTestInstance() {
        this.testInstance = null;
        VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.reset();
    }
}
VectorSpaceIdentifierManagerTestHelper.testInstance = null;
describe('VectorSpaceIdentifierManager. Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    beforeEach(() => {
        // Reset the singleton before each test
        VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.reset();
        // Using the test helper, reset its instance as well
        VectorSpaceIdentifierManagerTestHelper.resetTestInstance();
    });
    it(`no instance of ${VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager} is initially available`, () => {
        (0, chai_1.expect)(VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.hasInstance()).to.eql(false);
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        (0, chai_1.expect)(vectorSpace).to.not.eql(null);
        const allVectorSpaces = vectorSpace.getAllVectorSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        (0, chai_1.expect)(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        (0, chai_1.expect)(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[2];
        (0, chai_1.expect)(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[3];
        (0, chai_1.expect)(projectiveComplexVectorSpaces).to.eql(undefined);
    });
    it(`generates a unique instance of ${VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const vectorSpace1 = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        (0, chai_1.expect)(vectorSpace).to.eql(vectorSpace1);
    });
    it(`no instance of vector space is initially available`, () => {
        (0, chai_1.expect)(VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.hasInstance()).to.eql(false);
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace_1.RealVectorSpace(2);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(realVS)).to.eql(true);
        const defaultVSId = new RealVectorSpace_1.RealVectorSpace(1);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(defaultVSId)).to.eql(true);
    });
    it(`generate vector space identifiers that differ from each other`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const vsId1 = vectorSpace.generateId();
        (0, chai_1.expect)(vsId).to.not.eql(vsId1);
    });
    it(`cannot register an instance of a real vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace_1.RealVectorSpace(2);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(realVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerRealVectorSpace(realVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a complex vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const complexVS = new ComplexVectorSpace_1.ComplexVectorSpace(1);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(complexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerComplexVectorSpace(complexVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a projective real vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const projectiveVS = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(3);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(projectiveVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveRealVectorSpace(projectiveVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`cannot register an instance of a projective complex vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const projectiveComplexVS = new ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace(2);
        (0, chai_1.expect)(vectorSpace.isARegisteredVectorSpace(projectiveComplexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS);
        (0, chai_1.expect)(hasbeenRegistered).to.eql(false);
    });
    it(`can generate a vector space identifier conforming to the reference structure`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const decomposedId = vsId.split('_');
        (0, chai_1.expect)(decomposedId.length).to.eql(3);
        (0, chai_1.expect)(decomposedId[0] + '_').to.eql(VectorSpaceIdentifierManager_2.VECTOR_SPACE);
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
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace_1.RealVectorSpace(2);
        const vsIndex = vectorSpace.getVectorSpaceIndex(realVS);
        (0, chai_1.expect)(vsIndex).to.eql(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE); // The first registered vector space should have index 1
    });
    it(`cannot get the index of a vector space if the index has the initial value ${VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        (0, chai_1.expect)(vsIndex).to.eql(undefined); // The first registered vector space should have index 1
    });
    it(`cannot get the index of a vector space if the index is not the third sub-string in the string forming the index`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_ID_STRUCTURE);
    });
    it(`cannot get the index of a vector space if the string index cannot be converted into a number`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_notANumber');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot get the index of a vector space if the index is smaller than ${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_0');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, 'subString1_subString2_2');
        (0, chai_1.expect)(() => vectorSpace.getVectorSpaceIndex(projectiveVS1)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a vector space for a vector space type distinct from ${BSplineR1toRn_1.VectorSpaceType}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager_1.VectorSpaceIdentifierManager.getInstance();
        const dimension = 2;
        const incorrectVSType = "IncorrectType";
        const projectiveVS = createMockVectorSpace(dimension, incorrectVSType, 'subString1_subString2_0');
        (0, chai_1.expect)(() => vectorSpace.registerVectorSpace(projectiveVS)).to.throw(DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
    });
    it(`cannot register a real vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        let realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        const realVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, `${BSplineR1toRn_1.VectorSpaceType.REAL}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        realVS = realVS2;
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(realVS)).to.eql(nextIndex);
        const realVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, `${BSplineR1toRn_1.VectorSpaceType.REAL}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS1)).to.eql(false);
    });
    it(`cannot register a real vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        const nextIndex1 = 4;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const realVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, `${BSplineR1toRn_1.VectorSpaceType.REAL}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex1.toString());
        (0, chai_1.expect)(() => vectorSpace.registerRealVectorSpace(realVS1)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a real vector space if the vector space index value is smaller than the minimal value of ${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        (0, chai_1.expect)(nextIndex).to.be.lessThan(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });
    it(`can register a real vector space if the vector space index value is ${VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const realVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.REAL, `${BSplineR1toRn_1.VectorSpaceType.REAL}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerRealVectorSpace(realVS1)).to.eql(true);
    });
    it(`cannot register a complex vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        let complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        const complexVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, `${BSplineR1toRn_1.VectorSpaceType.COMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        complexVS = complexVS2;
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(complexVS)).to.eql(nextIndex);
        const complexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, `${BSplineR1toRn_1.VectorSpaceType.COMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS1)).to.eql(false);
    });
    it(`cannot register a complex vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        const nextIndex1 = 4;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const complexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, `${BSplineR1toRn_1.VectorSpaceType.COMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex1.toString());
        (0, chai_1.expect)(() => vectorSpace.registerComplexVectorSpace(complexVS1)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a complex vector space if the vector space index value is smaller than the minimal value of ${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        (0, chai_1.expect)(nextIndex).to.be.lessThan(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });
    it(`can register a complex vector space if the vector space index value is ${VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const complexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.COMPLEX, `${BSplineR1toRn_1.VectorSpaceType.COMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerComplexVectorSpace(complexVS1)).to.eql(true);
    });
    it(`cannot register a projective real vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        let projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        const projectiveVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        projectiveVS = projectiveVS2;
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.eql(nextIndex);
        const projectiveVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.eql(false);
    });
    it(`cannot register a projective real vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        const nextIndex1 = 4;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex1.toString());
        (0, chai_1.expect)(() => vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a projective real vector space if the vector space index value is smaller than the minimal value of ${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        (0, chai_1.expect)(nextIndex).to.be.lessThan(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });
    it(`can register a projective real vector space if the vector space index value is ${VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const projectiveVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVE, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVE}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.eql(true);
    });
    it(`cannot register a projective complex vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        let projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        const projectiveComplexVS2 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        projectiveComplexVS = projectiveComplexVS2;
        (0, chai_1.expect)(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.eql(nextIndex);
        const projectiveComplexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.eql(false);
    });
    it(`cannot register a projective complex vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        const nextIndex1 = 4;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const projectiveComplexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + nextIndex1.toString());
        (0, chai_1.expect)(() => vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.throw(VectorSpaceIdentifierManager_3.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    it(`cannot register a projective complex vector space if the vector space index value is smaller than the minimal value of ${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        (0, chai_1.expect)(nextIndex).to.be.lessThan(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });
    it(`can register a projective complex vector space if the vector space index value is ${VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        (0, chai_1.expect)(nextIndex).to.be.greaterThanOrEqual(VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID);
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const projectiveComplexVS1 = createMockVectorSpace(dimension, BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, `${BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VectorSpaceIdentifierManager_2.VECTOR_SPACE + VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE.toString());
        (0, chai_1.expect)(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.eql(true);
    });
});
// Helper function to create mock spaces
function createMockVectorSpace(dimension, spaceType, id) {
    const mockSpace = {
        dimension: () => dimension,
        spaceType: spaceType,
        isDefault: false,
        id: id
    };
    return mockSpace;
}
