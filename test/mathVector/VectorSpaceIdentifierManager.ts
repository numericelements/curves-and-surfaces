import { expect } from "chai";
import { VectorSpaceIdentifierManager } from "../../src/mathVector/internal/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";

describe('Manager of vector space ids ensuring their uniqueness and distinguishing default vector spaces from others', () => {
    it(`no instance of real vector space is initially available`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
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
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const realVS = new RealVectorSpace(2)
        expect(vectorSpace.isAnExistingVectorSpace(realVS)).to.eql(true);
        const defaultVSId = new RealVectorSpace(1);
        expect(vectorSpace.isAnExistingVectorSpace(defaultVSId)).to.eql(true);
    });
    
    it(`generate vector space identifiers that differ from each other`, () => {
        const vectorSpace = VectorSpaceIdentifierManager.getInstance();
        const vsId = vectorSpace.generateId();
        const vsId1 = vectorSpace.generateId();
        expect(vsId).to.not.eql(vsId1);
    });
});