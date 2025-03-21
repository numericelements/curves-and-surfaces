import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector, PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, WEIGHT, Weight_Interface } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";

export function createCommonVectorSpaceTests(
    createVectorSpace: (weightManagement?: WeightManagement) => ProjectiveVectorSpace,
    dimension: number,
    vectorType: typeof PROJECTIVEVECTOR2D | typeof PROJECTIVEVECTOR3D,
    weightIndex: number
) {
  describe('Common Vector Space Tests', () => {

    it(`can check if two ProjectiveVectors are of same dimension ${dimension}D`, () => {
        const vectorSpace = createVectorSpace();
        const vec1 = createTestVector(vectorType, 2, true);
        const vec2 = createTestVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
        expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
    });

    it(`can check if a ${vectorType} vector is not in the vector space`, () => {
        const vectorSpace = createVectorSpace();
        let vec1: ProjectiveVector = createTestVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
        let vec2: ProjectiveVector = createTestVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
        if(vectorSpace.dimension() === MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            vec1 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(2)}]};
            vec2 = {type: PROJECTIVEVECTOR2D, coordinates: [1, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        } else {
            vec1 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(2)}]};
            vec2 = {type: PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, value: new Weight(0, false)}]};
        }
        expect(vectorSpace.isInVectorSpace(vec1)).to.eql(false);
        expect(vectorSpace.isInVectorSpace(vec2)).to.eql(false);
    });

    it(`can check if two ${vectorType} vectors share the same weight management status ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
      const vectorSpace = createVectorSpace();
      
      const vec1 = createTestVector(vectorType, 2, true);
      const vec2 = createTestVector(vectorType, 2, true);
      expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
      expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
      expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
      const weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
      const weight2 = vec2.coordinates[weightIndex] as Weight_Interface;
      expect(weight1.value.strictlyPositive).to.eql(true);
      expect(weight2.value.strictlyPositive).to.eql(true);
      expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
    });

    it(`can check if two ${vectorType} vectors share the same weight management status ${WeightManagement.SomeNullWeights}`, () => {
      const vectorSpace = createVectorSpace(WeightManagement.SomeNullWeights);
      
      let vec1 = createTestVector(vectorType, 0, false);
      let vec2 = createTestVector(vectorType, 2, true);
      expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
      expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
      expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
      let weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
      let weight2 = vec2.coordinates[weightIndex] as Weight_Interface;
      expect(weight1.value.strictlyPositive).to.eql(false);
      expect(weight2.value.strictlyPositive).to.eql(true);
      expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
      
      // Test other combinations
      vec1 = createTestVector(vectorType, 2, true);
      vec2 = createTestVector(vectorType, 0, false);
      expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
      vec1 = createTestVector(vectorType, 0, false);
      vec2 = createTestVector(vectorType, 0, false);
      expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
    });

    it(`can check that two ${vectorType} vectors share the same weight management status ${WeightManagement.AllPositiveWeights}`, () => {
        const vectorSpace = createVectorSpace(WeightManagement.AllPositiveWeights);
        
        let vec1 = createTestVector(vectorType, 0, false);
        let vec2 = createTestVector(vectorType, 2, false);
        expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
        expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
        expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        let weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
        let weight2 = vec2.coordinates[weightIndex] as Weight_Interface;
        expect(weight1.value.strictlyPositive).to.eql(false);
        expect(weight2.value.strictlyPositive).to.eql(false);
        expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
    });

    it(`can get a default ${vectorType} vector in the vector space`, () => {
      const vectorSpace = createVectorSpace();
      const vec = vectorSpace.defaultVect();
      
      expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
      expect(vec.type).to.eql(vectorType);
      
      const weight = vec.coordinates[weightIndex] as Weight_Interface;
      expect(weight.value.strictlyPositive).to.eql(true);
    });

    it(`can add two ${vectorType} vectors in the vector space`, () => {
      const vectorSpace = createVectorSpace();
      const vec1 = createTestVector(vectorType, 2, true);
      const vec2 = vectorSpace.defaultVect();
      const result = vectorSpace.add(vec1, vec2);
      
      expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
      expect(result.type).to.eql(vectorType);
      
      // Check coordinates based on vector type
      if (vectorType === PROJECTIVEVECTOR2D && result.type === PROJECTIVEVECTOR2D) {
        expect(result.coordinates[0]).to.eql(1);
        expect(result.coordinates[1]).to.eql(0);
        const weight = result.coordinates[2] as Weight_Interface;
        expect(weight.value.weight).to.eql(3);
      } else if (vectorType === PROJECTIVEVECTOR3D && result.type === PROJECTIVEVECTOR3D) {
        expect(result.coordinates[0]).to.eql(1);
        expect(result.coordinates[1]).to.eql(0);
        expect(result.coordinates[2]).to.eql(0);
        const weight = result.coordinates[3] as Weight_Interface;
        expect(weight.value.weight).to.eql(3);
      }
    });
  });
}

// Helper function to create test vectors
function createTestVector(
  type: typeof PROJECTIVEVECTOR2D | typeof PROJECTIVEVECTOR3D, 
  weightValue: number, 
  strictlyPositive: boolean
) {
  if (type === PROJECTIVEVECTOR2D) {
    return {
      type: PROJECTIVEVECTOR2D, 
      coordinates: [ 1, 0, {type: WEIGHT, value: new Weight(weightValue, strictlyPositive)}]
    } as ProjectiveVector2D;
  } else {
    return {
      type: PROJECTIVEVECTOR3D, 
      coordinates: [ 1, 0, 0, {type: WEIGHT, value: new Weight(weightValue, strictlyPositive)}]
    } as ProjectiveVector3D;
  }
}
