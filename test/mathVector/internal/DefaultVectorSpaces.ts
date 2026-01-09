import { expect } from "chai";
import { DefaultVectorSpaces } from "../../../src/mathVector/internal/DefaultVectorSpaces";
import { RealVectorSpace } from "../../../src/mathVector/RealVectorSpace";
import { ComplexVectorSpace } from "../../../src/mathVector/ComplexVectorSpace";
import { ProjectiveVectorSpace } from "../../../src/mathVector/ProjectiveVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../../src/mathVector/ProjectiveComplexVectorSpace";
import { DEFAULT, INITIAL_VECTOR_SPACE_ID, VECTOR_SPACE } from "../../../src/namedConstants/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../../src/namedConstants/BSplineR1toRn";
import { EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE, EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE, EM_INVALID_VECTOR_SPACE_TYPE } from "../../../src/ErrorMessages/DefaultSpaceResolvers";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME, DEFAULT_VSPACE_INDEX_INITIAL_VALUE } from "../../../src/namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../../src/namedConstants/RealVectorSpace";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../../src/namedConstants/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../../src/namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../../src/namedConstants/ProjectiveComplexVectorSpace";
import { EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/RealVectorSpace";
import { EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ComplexVectorSpace";
import { EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ProjectiveVectorSpace";
import { EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION } from "../../../src/ErrorMessages/ProjectiveComplexVectorSpace";

describe('DefaultVectorSpaces. Identifier Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    
    beforeEach(() => {
        // Reset the singleton before each test
        DefaultVectorSpaces.reset();
    });

    it(`no instance of ${DefaultVectorSpaces} is initially available`, () => {
        expect(DefaultVectorSpaces.hasInstance()).to.eql(false);
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace).to.not.eql(null);
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        expect(realVectorSpaces).to.eql(undefined);
        const complexVectorSpaces = allVectorSpaces[1];
        expect(complexVectorSpaces).to.eql(undefined);
        const projectiveRealVectorSpaces = allVectorSpaces[2];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[3];
        expect(projectiveComplexVectorSpaces).to.eql(undefined);
    });

    it(`generates a unique instance of ${DefaultVectorSpaces}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const vectorSpace1 = DefaultVectorSpaces.getInstance();
        expect(vectorSpace).to.eql(vectorSpace1);
    });

    it(`no instance of default vector space is initially available`, () => {
        expect(DefaultVectorSpaces.hasInstance()).to.eql(false);
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const realVS = new RealVectorSpace(2, true);
        expect(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
        const defaultVSId = new RealVectorSpace(1, true);
        expect(vectorSpace.isDefaultSpace(defaultVSId)).to.eql(true);
    });

    it(`generate default vector space identifiers that differ from each other`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const vsId = vectorSpace.generateId();
        const vsId1 = vectorSpace.generateId();
        expect(vsId).to.not.eql(vsId1);
    });

    it(`cannot register an instance of a default real vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const realVS = new RealVectorSpace(2, true);
        expect(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerRealVectorSpace(realVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a default complex vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const complexVS = new ComplexVectorSpace(1, true);
        expect(vectorSpace.isDefaultSpace(complexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerComplexVectorSpace(complexVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a default projective real vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const projectiveVS = new ProjectiveVectorSpace(3, true);
        expect(vectorSpace.isDefaultSpace(projectiveVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveRealVectorSpace(projectiveVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`cannot register an instance of a default projective complex vector space that is already registered`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const projectiveComplexVS = new ProjectiveComplexVectorSpace(2, true);
        expect(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.eql(DEFAULT_VSPACE_INDEX_INITIAL_VALUE);
        expect(vectorSpace.isDefaultSpace(projectiveComplexVS)).to.eql(true);
        const hasbeenRegistered = vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS);
        expect(hasbeenRegistered).to.eql(false);
    });

    it(`can generate a vector space identifier conforming to the reference structure`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
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

    it(`can get the index of a projective real vector space if the index is not undefined`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const projectiveVS = new ProjectiveVectorSpace(3, true);
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        expect(vsIndex).to.eql(1); // The first registered vector space should have index 1
    });

    it(`cannot get the index of a vector space if the index has the initial value ${INITIAL_VECTOR_SPACE_ID}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, INITIAL_VECTOR_SPACE_ID) as ProjectiveVectorSpace<typeof dimension>;
        const vsIndex = vectorSpace.getVectorSpaceIndex(projectiveVS);
        expect(vsIndex).to.eql(undefined); // The first registered vector space should have index 1
    });

    it(`cannot get the index of a vector space if the index is not the fourth sub-string in the string forming the index`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3') as ProjectiveVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE);
    });

    it(`cannot get the index of a vector space if the string index cannot be converted into a number`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_notANumber') as ProjectiveVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot get the index of a vector space if the index is smaller than ${DEFAULT_VSPACE_INDEX_INITIAL_VALUE}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const dimension = 3;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_0') as ProjectiveVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS)).to.throw(EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
        const projectiveVS1 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, 'subString1_subString2_subString3_2') as ProjectiveVectorSpace<typeof dimension>;
        expect(() => vectorSpace.getVectorSpaceIndex(projectiveVS1)).to.throw(EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    });

    it(`cannot register a default vector space for a vector space type distinct from ${VectorSpaceType}`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const dimension = 2;
        const incorrectVSType = "IncorrectType" as VectorSpaceType;
        const realVS = createMockVectorSpace(dimension, incorrectVSType, 'subString1_subString2_subString3_0') as ProjectiveVectorSpace<typeof dimension>;
        expect(() => vectorSpace.registerVectorSpace(realVS)).to.throw(EM_INVALID_VECTOR_SPACE_TYPE);
    });

    it(`cannot register a real vector space if the vector space dimension value has already been used`, () => {
        const dimension = 2;
        let realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
        expect(vectorSpace.getVectorSpaceIndex(realVS)).to.be.eql(undefined);
        const realVS2 = createMockVectorSpace(dimension, VectorSpaceType.REAL, DEFAULT + `${VectorSpaceType.REAL}_${dimension}_` + VECTOR_SPACE + DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString()) as RealVectorSpace<typeof dimension>;
        expect(vectorSpace.registerRealVectorSpace(realVS2)).to.eql(false);
    });

    it(`cannot register a real vector space if the vector space dimension is greater than the max dimension ${MAX_DIMENSION_REALVECTORSPACE}`, () => {
        const dimension = MAX_DIMENSION_REALVECTORSPACE + 1;
        const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });

    it(`cannot register a real vector space if the vector space dimension is smaller than the minimal dimension ${MIN_DIMENSION_REALVECTORSPACE}`, () => {
        const dimension = MIN_DIMENSION_REALVECTORSPACE - 1;
        const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(false);
    });

    it(`can register a real vector space if the vector space dimension fall within the interval [${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        for(let dimension = MIN_DIMENSION_REALVECTORSPACE; dimension <= MAX_DIMENSION_REALVECTORSPACE; dimension++) {
            const realVS = createMockVectorSpace(dimension, VectorSpaceType.REAL, INITIAL_VECTOR_SPACE_ID) as RealVectorSpace<typeof dimension>;
            expect(vectorSpace.registerRealVectorSpace(realVS)).to.eql(true);
            expect(vectorSpace.getVectorSpaceIndex(realVS)).to.be.eql(undefined);
        }
    });

    it(`cannot register a complex vector space if the vector space dimension value has already been used`, () => {
        const dimension = MIN_DIMENSION_COMPLEXVECTORSPACE;
        let complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
        expect(vectorSpace.getVectorSpaceIndex(complexVS)).to.be.eql(undefined);
        const complexVS2 = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, DEFAULT + `${VectorSpaceType.COMPLEX}_${dimension}_` + VECTOR_SPACE + DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString()) as ComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerComplexVectorSpace(complexVS2)).to.eql(false);
    });

    it(`cannot register a complex vector space if the vector space dimension is greater than the max dimension ${MAX_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimension = MAX_DIMENSION_COMPLEXVECTORSPACE + 1;
        const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });

    it(`cannot register a complex vector space if the vector space dimension is smaller than the minimal dimension ${MIN_DIMENSION_COMPLEXVECTORSPACE}`, () => {
        const dimension = MIN_DIMENSION_COMPLEXVECTORSPACE - 1;
        const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(false);
    });

    it(`can register a complex vector space if the vector space dimension fall within the interval [${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        for(let dimension = MIN_DIMENSION_COMPLEXVECTORSPACE; dimension <= MAX_DIMENSION_COMPLEXVECTORSPACE; dimension++) {
            const complexVS = createMockVectorSpace(dimension, VectorSpaceType.COMPLEX, INITIAL_VECTOR_SPACE_ID) as ComplexVectorSpace<typeof dimension>;
            expect(vectorSpace.registerComplexVectorSpace(complexVS)).to.eql(true);
            expect(vectorSpace.getVectorSpaceIndex(complexVS)).to.be.eql(undefined);
        }
    });

    it(`cannot register a projective real vector space if the vector space dimension value has already been used`, () => {
        const dimension = MIN_DIMENSION_PROJECTIVEVECTORSPACE;
        let projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, INITIAL_VECTOR_SPACE_ID) as ProjectiveVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
        expect(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.be.eql(undefined);
        const projectiveVS2 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, DEFAULT + `${VectorSpaceType.PROJECTIVE}_${dimension}_` + VECTOR_SPACE + DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString()) as ProjectiveVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS2)).to.eql(false);
    });

    it(`cannot register a projective real vector space if the vector space dimension is greater than the max dimension ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimension = MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, INITIAL_VECTOR_SPACE_ID) as ProjectiveVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });

    it(`cannot register a projective real vector space if the vector space dimension is smaller than the minimal dimension ${MIN_DIMENSION_PROJECTIVEVECTORSPACE}`, () => {
        const dimension = MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1;
        const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, INITIAL_VECTOR_SPACE_ID) as ProjectiveVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(false);
    });

    it(`can register a projective real vector space if the vector space dimension fall within the interval [${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        for(let dimension = MIN_DIMENSION_PROJECTIVEVECTORSPACE; dimension <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; dimension++) {
            const projectiveVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, INITIAL_VECTOR_SPACE_ID) as ProjectiveVectorSpace<typeof dimension>;
            expect(vectorSpace.registerProjectiveRealVectorSpace(projectiveVS)).to.eql(true);
            expect(vectorSpace.getVectorSpaceIndex(projectiveVS)).to.be.eql(undefined);
        }
    });

    it(`cannot register a projective complex vector space if the vector space dimension value has already been used`, () => {
        const dimension = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE;
        let projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
        expect(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.be.eql(undefined);
        const projectiveComplexVS2 = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVE, DEFAULT + `${VectorSpaceType.PROJECTIVE}_${dimension}_` + VECTOR_SPACE + DEFAULT_VSPACE_INDEX_INITIAL_VALUE.toString()) as ProjectiveComplexVectorSpace<typeof dimension>;
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS2)).to.eql(false);
    });

    it(`cannot register a projective complex vector space if the vector space dimension is greater than the max dimension ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimension = MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });

    it(`cannot register a projective complex vector space if the vector space dimension is smaller than the minimal dimension ${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}`, () => {
        const dimension = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1;
        const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(false);
    });

    it(`can register a projective complex vector space if the vector space dimension fall within the interval [${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        for(let dimension = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension++) {
            const projectiveComplexVS = createMockVectorSpace(dimension, VectorSpaceType.PROJECTIVECOMPLEX, INITIAL_VECTOR_SPACE_ID) as ProjectiveComplexVectorSpace<typeof dimension>;
            expect(vectorSpace.registerProjectiveComplexVectorSpace(projectiveComplexVS)).to.eql(true);
            expect(vectorSpace.getVectorSpaceIndex(projectiveComplexVS)).to.be.eql(undefined);
        }
    });

    it(`cannot get a real vector space for a space dimension outside the interval [${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getRealVectorSpace(MIN_DIMENSION_REALVECTORSPACE - 1)).to.throw(RangeError);
        expect(() => vectorSpace.getRealVectorSpace(MAX_DIMENSION_REALVECTORSPACE + 1)).to.throw(RangeError);
    });

    it(`cannot get a complex vector space for a space dimension outside the interval [${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getComplexVectorSpace(MIN_DIMENSION_COMPLEXVECTORSPACE - 1)).to.throw(RangeError);
        expect(() => vectorSpace.getComplexVectorSpace(MAX_DIMENSION_COMPLEXVECTORSPACE + 1)).to.throw(RangeError);
    });

    it(`cannot get a projective real vector space for a space dimension outside the interval [${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getProjectiveVectorSpace(MIN_DIMENSION_PROJECTIVEVECTORSPACE - 1)).to.throw(RangeError);
        expect(() => vectorSpace.getProjectiveVectorSpace(MAX_DIMENSION_PROJECTIVEVECTORSPACE + 1)).to.throw(RangeError);
    });

    it(`cannot get a projective complex vector space for a space dimension outside the interval [${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        expect(() => vectorSpace.getProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw(RangeError);
        expect(() => vectorSpace.getProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw(RangeError);
    });

    it(`cannot get a real vector space for a space dimension within the interval [${MIN_DIMENSION_REALVECTORSPACE}, ${MAX_DIMENSION_REALVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const realVectorSpaces = allVectorSpaces[0];
        expect(realVectorSpaces).to.eql(undefined);
        for(let dimension = MIN_DIMENSION_REALVECTORSPACE; dimension <= MAX_DIMENSION_REALVECTORSPACE; dimension++) {
            expect(() => vectorSpace.getRealVectorSpace(dimension)).to.throw(EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION);
        }
    });

    it(`cannot get a complex vector space for a space dimension within the interval [${MIN_DIMENSION_COMPLEXVECTORSPACE}, ${MAX_DIMENSION_COMPLEXVECTORSPACE}]`, () => {  
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const complexVectorSpaces = allVectorSpaces[0];
        expect(complexVectorSpaces).to.eql(undefined);
        for(let dimension = MIN_DIMENSION_COMPLEXVECTORSPACE; dimension <= MAX_DIMENSION_COMPLEXVECTORSPACE; dimension++) {
            expect(() => vectorSpace.getComplexVectorSpace(dimension)).to.throw(EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION);
        }
    });
    it(`cannot get a projective real vector space for a space dimension within the interval [${MIN_DIMENSION_PROJECTIVEVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVEVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveRealVectorSpaces = allVectorSpaces[0];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        for(let dimension = MIN_DIMENSION_PROJECTIVEVECTORSPACE; dimension <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; dimension++) {
            expect(() => vectorSpace.getProjectiveVectorSpace(dimension)).to.throw(EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION);
        }
    });

    it(`cannot get a projective complex vector space for a space dimension within the interval [${MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}, ${MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE}]`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        const projectiveComplexVectorSpaces = allVectorSpaces[0];
        expect(projectiveComplexVectorSpaces).to.eql(undefined);
        for(let dimension = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; dimension++) {
            expect(() => vectorSpace.getProjectiveComplexVectorSpace(dimension)).to.throw(EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION);
        }
    });

    it(`all vector spaces contained into DefaultVectorSpaces are default ones`, () => {
        const vectorSpace = DefaultVectorSpaces.getInstance();
        for (let i = MIN_DIMENSION_REALVECTORSPACE; i <= MAX_DIMENSION_REALVECTORSPACE; i++) {
            const realVS = new RealVectorSpace(i, true);
            expect(vectorSpace.isDefaultSpace(realVS)).to.eql(true);
            const defVectorSpace = vectorSpace.getRealVectorSpace(i);
        }
        for (let i = MIN_DIMENSION_COMPLEXVECTORSPACE; i <= MAX_DIMENSION_COMPLEXVECTORSPACE; i++) {
            const complexVS = new ComplexVectorSpace(i, true);
            expect(vectorSpace.isDefaultSpace(complexVS)).to.eql(true);
            const defVectorSpace = vectorSpace.getComplexVectorSpace(i);
        }
        for (let i = MIN_DIMENSION_PROJECTIVEVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; i++) {
            const projectiveVS = new ProjectiveVectorSpace(i, true);
            expect(vectorSpace.isDefaultSpace(projectiveVS)).to.eql(true);
            const defVectorSpace = vectorSpace.getProjectiveVectorSpace(i);
        }
        for (let i = MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE; i++) {
            const projectiveComplexVS = new ProjectiveComplexVectorSpace(i, true);
            expect(vectorSpace.isDefaultSpace(projectiveComplexVS)).to.eql(true);
            const defVectorSpace = vectorSpace.getProjectiveComplexVectorSpace(i);
        }
        const allVectorSpaces = vectorSpace.getAllDefaultSpaces();
        for (const vSpace of allVectorSpaces) {
            expect(vectorSpace.isDefaultSpace(vSpace)).to.eql(true);
        }
    });
});


// Helper function to create mock spaces
function createMockVectorSpace(dimension: number, spaceType: VectorSpaceType, id: string): { dimension: () => number; spaceType: VectorSpaceType; isDefault: boolean; id: string } {
    const mockSpace = {
        dimension: () => dimension,
        spaceType: spaceType,
        isDefault: true,
        name: 'mockVectorSpace',
        id: id
    };
    return mockSpace;
}