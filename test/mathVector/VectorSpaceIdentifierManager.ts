import { expect } from "chai";
import { VectorSpaceIdentifierManager } from "../../src/mathVector/internal/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { VECTOR_SPACE } from "../../src/namedConstants/VectorSpaceIdentifierManager";

describe('VectorSpaceIdentifierManager. Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    
    beforeEach(() => {
        // Reset the singleton before each test
        VectorSpaceIdentifierManager.reset();
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
        const projectiveRealVectorSpaces = allVectorSpaces[1];
        expect(projectiveRealVectorSpaces).to.eql(undefined);
        const projectiveComplexVectorSpaces = allVectorSpaces[1];
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
        const projectiveVS = new ProjectiveVectorSpace(3);
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
        // vectorSpace.registerRealVectorSpace(realVS);
        const vsIndex = vectorSpace.getVectorSpaceIndex(realVS);
        expect(vsIndex).to.eql(1); // The first registered vector space should have index 1
    });
});