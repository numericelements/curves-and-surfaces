import { expect } from "chai";
import { VectorSpaceIdentifierManager } from "../../../src/mathVector/internal/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { ComplexVectorSpace } from "../../../src/mathVector/ComplexVectorSpace";
import { ProjectiveRealVectorSpace } from "../../../src/mathVector/ProjectiveRealVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../../src/mathVector/ProjectiveComplexVectorSpace";
import { INITIAL_VECTOR_SPACE_ID, VECTOR_SPACE, VSPACE_INDEX_INITIAL_VALUE } from "../../../src/namedConstants/VectorSpaceIdentifierManager";
import { EM_INVALID_VECTOR_SPACE_ID_STRUCTURE, EM_INVALID_VECTOR_SPACE_INDEX_VALUE } from "../../../src/ErrorMessages/VectorSpaceIdentifierManager";
import { EM_INVALID_VECTOR_SPACE_TYPE } from "../../../src/ErrorMessages/DefaultSpaceResolvers";

/**
 * Test helper class with protected access to VectorSpaceIdentifierManager internals
 * @internal
 */
class VectorSpaceIdentifierManagerTestHelper {
    private static testInstance: VectorSpaceIdentifierManager | null = null;

    static createTestInstance(nextIndex: number): VectorSpaceIdentifierManager {
        VectorSpaceIdentifierManager.reset();
        this.testInstance = VectorSpaceIdentifierManager.createInstanceForTesting(nextIndex);
        return this.testInstance;
    }

    static resetTestInstance(): void {
        this.testInstance = null;
        VectorSpaceIdentifierManager.reset();
    }
}

describe('VectorSpaceIdentifierManager. Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    
    beforeEach(() => {
        // Reset the singleton before each test
        VectorSpaceIdentifierManager.reset();

        // Using the test helper, reset its instance as well
        VectorSpaceIdentifierManagerTestHelper.resetTestInstance();

    });

    it(`no instance of ${VectorSpaceIdentifierManager} is initially available`, () => {
        expect(VectorSpaceIdentifierManager.hasInstance()).to.eql(false);
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        expect(vectorSpace).to.not.eql(null);
        const allVectorSpaces = vectorSpace.getAllVectorSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        expect(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        expect(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[2];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[3];
        expect(projectiveComplexVectorSpaces).to.eql(undefined);
    });
    
    it(`generates a unique instance of ${VectorSpaceIdentifierManager}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const vectorSpace1 = VectorSpaceIdentifierManager.getInstance();
        expect(vectorSpace).to.eql(vectorSpace1);
    });
    
    it(`no instance of vector space is initially available`, () => {
        expect(VectorSpaceIdentifierManager.hasInstance()).to.eql(false);
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace(2)
        expect(vectorSpace.isARegisteredVectorSpace(realVS)).to.eql(true);
        const defaultVSId = new RealVectorSpace(1);
        expect(vectorSpace.isARegisteredVectorSpace(defaultVSId)).to.eql(true);
    });
    
    it(`generate vector space identifiers that differ from each other`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const vsId1 = vectorSpace.generateId();
        expect(vsId).to.not.eql(vsId1);
    });

    it(`cannot register an instance of a real vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace(2);
        expect(vectorSpace.isARegisteredVectorSpace(realVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerRealVectorSpace(realVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a complex vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const complexVS = new ComplexVectorSpace(1);
        expect(vectorSpace.isARegisteredVectorSpace(complexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerComplexVectorSpace(complexVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a projective real vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const projectiveVS = new ProjectiveRealVectorSpace(3);
        expect(vectorSpace.isARegisteredVectorSpace(projectiveVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveRealVectorSpace(projectiveVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a projective complex vector space that is already registered`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const projectiveComplexVS = new ProjectiveComplexVectorSpace(2);
        expect(vectorSpace.isARegisteredVectorSpace(projectiveComplexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`can generate a vector space identifier conforming to the reference structure`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const decomposedId = vsId.split('_');
        expect(decomposedId.length).to.eql(3);
        expect(decomposedId[0] + '_').to.eql(VECTOR_SPACE);
        expect(decomposedId[1]).to.match(/^\d+$/); // Check if the second part is a number
        expect(decomposedId[1]).to.eql('1'); // Check if the second part is '1' for the first generated ID
        expect(decomposedId[2]).to.match(/^\d+$/); // Check if the third part is a number
        const vsId1 = vectorSpace.generateId();
        const decomposedId1 = vsId1.split('_');
        expect(decomposedId1[1]).to.eql('2'); // Check if the second part is incremented
        const dateNow = parseInt(decomposedId[2], 10);
        const dateNow1 = parseInt(decomposedId1[2], 10);
        expect(dateNow1 >= dateNow).to.eql(true); // Check if the third part is strictly increasing
    });

    it(`can get the index of a real vector space if the index is not undefined`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const realVS = new RealVectorSpace(2);
        const vsIndex = vectorSpace.getVectorSpaceIndex(realVS);
        expect(vsIndex).to.eql(VSPACE_INDEX_INITIAL_VALUE); // The first registered vector space should have index 1
    });

    it(`cannot get the index of a vector space if the index has the initial value ${INITIAL_VECTOR_SPACE_ID}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, INITIAL_VECTOR_SPACE_ID) as ProjectiveRealVectorSpace<typeof dimension>;
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        expect(vsIndex).to.eql(undefined); // The first registered vector space should have index 1
    });

    it(`cannot get the index of a vector space if the index is not the third sub-string in the string forming the index`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, 'subString1_subString2') as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_VECTOR_SPACE_ID_STRUCTURE);
    });

    it(`cannot get the index of a vector space if the string index cannot be converted into a number`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, 'subString1_subString2_notANumber') as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot get the index of a vector space if the index is smaller than ${VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, 'subString1_subString2_0') as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, 'subString1_subString2_2') as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS1)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot register a vector space for a vector space type distinct from ${VectorSpaceType}`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const dimension = 2;
        const incorrectVSType = "IncorrectType" as VectorSpaceType;
        const projectiveVS = createMockVectorSpace(dimension, incorrectVSType, 'subString1_subString2_0') as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerVectorSpace(projectiveVS)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
    });

    it(`cannot register a real vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        let realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        const realVS2 = createMockVectorSpace(dimension, VectorSpaceType.REAL, `${VectorSpaceType.REAL}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as RealVectorSpace<typeof dimension>;
        realVS = realVS2;
        expect(vectorSpace.getVectorSpaceIndex(realVS)).to.eql(nextIndex);
        const realVS1 = createMockVectorSpace(dimension, VectorSpaceType.REAL, `${VectorSpaceType.REAL}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as RealVectorSpace<typeof dimension>;
        expect(vectorSpace.registerRealVectorSpace(realVS1)).to.eql(false);
    });

    it(`cannot register a real vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        const nextIndex1 = 4;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const realVS1 = createMockVectorSpace(dimension, VectorSpaceType.REAL, `${VectorSpaceType.REAL}_${dimension}_` + VECTOR_SPACE + nextIndex1.toString()) as RealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerRealVectorSpace(realVS1)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot register a real vector space if the vector space index value is smaller than the minimal value of ${VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        expect(nextIndex).to.be.lessThan(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });

    it(`can register a real vector space if the vector space index value is ${INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 2;
        const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const realVS1 = createMockVectorSpace(dimension, VectorSpaceType.REAL, `${VectorSpaceType.REAL}_${dimension}_` + VECTOR_SPACE + VSPACE_INDEX_INITIAL_VALUE.toString()) as RealVectorSpace<typeof dimension>;
        expect(vectorSpace.registerRealVectorSpace(realVS1)).to.eql(true);
    });

    it(`cannot register a complex vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        let complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        const complexVS2 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, `${VectorSpaceType.COMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ComplexVectorSpace<typeof dimension>;
        complexVS = complexVS2;
        expect(vectorSpace.getVectorSpaceIndex(complexVS)).to.eql(nextIndex);
        const complexVS1 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, `${VectorSpaceType.COMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerComplexVectorSpace(complexVS1)).to.eql(false);
    });

    it(`cannot register a complex vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        const nextIndex1 = 4;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const complexVS1 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, `${VectorSpaceType.COMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex1.toString()) as ComplexVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerComplexVectorSpace(complexVS1)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot register a complex vector space if the vector space index value is smaller than the minimal value of ${VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        expect(nextIndex).to.be.lessThan(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });

    it(`can register a complex vector space if the vector space index value is ${INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const complexVS1 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, `${VectorSpaceType.COMPLEX}_${dimension}_` + VECTOR_SPACE + VSPACE_INDEX_INITIAL_VALUE.toString()) as ComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerComplexVectorSpace(complexVS1)).to.eql(true);
    });

    it(`cannot register a projective real vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        let projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, INITIAL_VECTOR_SPACE_ID) as ProjectiveRealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        const projectiveVS2 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, `${VectorSpaceType.PROJECTIVEREAL}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ProjectiveRealVectorSpace<typeof dimension>;
        projectiveVS = projectiveVS2;
        expect(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.eql(nextIndex);
        const projectiveVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, `${VectorSpaceType.PROJECTIVEREAL}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ProjectiveRealVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.eql(false);
    });

    it(`cannot register a projective real vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, INITIAL_VECTOR_SPACE_ID) as ProjectiveRealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        const nextIndex1 = 4;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, `${VectorSpaceType.PROJECTIVEREAL}_${dimension}_` + VECTOR_SPACE + nextIndex1.toString()) as ProjectiveRealVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });
    
    it(`cannot register a projective real vector space if the vector space index value is smaller than the minimal value of ${VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        expect(nextIndex).to.be.lessThan(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, INITIAL_VECTOR_SPACE_ID) as ProjectiveRealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });

    it(`can register a projective real vector space if the vector space index value is ${INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, INITIAL_VECTOR_SPACE_ID) as ProjectiveRealVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const projectiveVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVEREAL, `${VectorSpaceType.PROJECTIVEREAL}_${dimension}_` + VECTOR_SPACE + VSPACE_INDEX_INITIAL_VALUE.toString()) as ProjectiveRealVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS1)).to.eql(true);
    });

    it(`cannot register a projective complex vector space if the vector space index value has already been used`, () => {
        const nextIndex = 5;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        let projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        const projectiveComplexVS2 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, `${VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ProjectiveComplexVectorSpace<typeof dimension>;
        projectiveComplexVS = projectiveComplexVS2;
        expect(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.eql(nextIndex);
        const projectiveComplexVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, `${VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex.toString()) as ProjectiveComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.eql(false);
    });

    it(`cannot register a projective complex vector space if the vector space index value is greater than the current value of the reference index`, () => {
        const nextIndex = 3;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        const nextIndex1 = 4;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const projectiveComplexVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, `${VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VECTOR_SPACE + nextIndex1.toString()) as ProjectiveComplexVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.throw(EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot register a projective complex vector space if the vector space index value is smaller than the minimal value of ${VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const nextIndex = 0;
        expect(nextIndex).to.be.lessThan(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });

    it(`can register a projective complex vector space if the vector space index value is ${INITIAL_VECTOR_SPACE_ID} or fall within the interval [${VSPACE_INDEX_INITIAL_VALUE}, this.nextIndex]`, () => {
        const nextIndex = 2;
        expect(nextIndex).to.be.greaterThanOrEqual(VSPACE_INDEX_INITIAL_VALUE);
        const dimension = 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = VectorSpaceIdentifierManagerTestHelper.createTestInstance(nextIndex);
        // register a vector space based on INITIAL_VECTOR_SPACE_ID id
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        // register a vector space based on an id with index value in the interval [VSPACE_INDEX_INITIAL_VALUE, nextIndex]
        const projectiveComplexVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, `${VectorSpaceType.PROJECTIVECOMPLEX}_${dimension}_` + VECTOR_SPACE + VSPACE_INDEX_INITIAL_VALUE.toString()) as ProjectiveComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS1)).to.eql(true);
    });
});

// Helper function to create mock spaces
export function createMockVectorSpace(dimension: number, spaceType: VectorSpaceType, id: string): { dimension: () => number; spaceType: VectorSpaceType; isDefault: boolean; id: string } {
    const mockSpace = {
        dimension: () => dimension,
        spaceType: spaceType,
        isDefault: false,
        id: id
    };
    return mockSpace;
}