import { expect } from "chai";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector, PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, WEIGHT, Weight_Interface } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { DEFAULT_WEIGHT } from "../../src/bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT } from "../../src/ErrorMessages/ProjectiveVectorSpace";
import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NEGATIVE, EM_SCALE_FACTOR_NEGATIVE_OR_NULL } from "../../src/ErrorMessages/WeightManager";

export function createCommonProjectiveVectorSpaceTests(
    createProjectiveVectorSpace: (weightManagement?: WeightManagement) => ProjectiveVectorSpace,
    dimension: number,
    vectorType: typeof PROJECTIVEVECTOR2D | typeof PROJECTIVEVECTOR3D,
    weightIndex: number
) {
    describe('Common ProjectiveVector Space Tests', () => {

        it(`can check if two ProjectiveVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a ${vectorType} vector is not in the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            let vec1: ProjectiveVector = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
            let vec2: ProjectiveVector = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
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
            const vectorSpace = createProjectiveVectorSpace();
            
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = createTestProjectiveVector(vectorType, 2, true);
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
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            
            let vec1 = createTestProjectiveVector(vectorType, 0, false);
            let vec2 = createTestProjectiveVector(vectorType, 2, true);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            let weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
            let weight2 = vec2.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.strictlyPositive).to.eql(false);
            expect(weight2.value.strictlyPositive).to.eql(true);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            
            // Test other combinations
            vec1 = createTestProjectiveVector(vectorType, 2, true);
            vec2 = createTestProjectiveVector(vectorType, 0, false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            vec1 = createTestProjectiveVector(vectorType, 0, false);
            vec2 = createTestProjectiveVector(vectorType, 0, false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });

        it(`can check that two ${vectorType} vectors share the same weight management status ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            
            let vec1 = createTestProjectiveVector(vectorType, 0, false);
            let vec2 = createTestProjectiveVector(vectorType, 2, false);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            let weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
            let weight2 = vec2.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.strictlyPositive).to.eql(false);
            expect(weight2.value.strictlyPositive).to.eql(false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        });

        it(`can get a default ${vectorType} vector in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            const vec1 = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vec1.type).to.eql(vectorType);
            const weight = vec1.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(true);
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
        });

        it(`can get a default ${vectorType} vector in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            const vec = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            expect(vec.type).to.eql(vectorType);
            const weight = vec.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(false);
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
        });

        it(`can get a default ${vectorType} vector in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            const vec = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            expect(vec.type).to.eql(vectorType);
            const weight = vec.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(true);
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
        });

        it(`can add two ${vectorType} vectors in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight_val = 2;
            const vec1 = createTestProjectiveVector(vectorType, weight_val, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.addRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(weight_val + DEFAULT_WEIGHT);
        });

        it(`can add two ${vectorType} vectors in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveVector(vectorType, 0, false);
            const result = vectorSpace.addRaw(vec1, vec2);
            const result1 = vectorSpace.addRaw(vec1, vec3);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
            expect(weight.value.strictlyPositive).to.eql(false);
            const weight1 = result1.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.weight).to.eql(0);
            expect(weight1.value.strictlyPositive).to.eql(false);
        });

        it(`can add two ${vectorType} vectors in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveVector(vectorType, 0, false);
            const result = vectorSpace.addRaw(vec1, vec2);
            const result1 = vectorSpace.addRaw(vec1, vec3);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
            expect(weight.value.strictlyPositive).to.eql(true);
            const weight1 = result1.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.weight).to.eql(0);
            expect(weight1.value.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
        });

        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(1);
            expect(weight.value.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${vectorType} vectors with same weights in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 1, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });

        it(`cannot subtract two ${vectorType} vectors with weights within ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT + (NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });

        it(`cannot subtract two ${vectorType} vectors  producing a negative weight in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractRaw(vec2, vec1)).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can subtract two ${vectorType} vectors with same weights in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${vectorType} vectors with weights within ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT - (NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${vectorType} vectors  producing a negative weight in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractRaw(vec2, vec1)).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
            expect(weight.value.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ${vectorType} vectors with one having a null weight in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec2, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(DEFAULT_WEIGHT);
            expect(weight.value.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ${vectorType} vectors with same weights in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${vectorType} vectors with weights within ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT - (NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractRaw(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${vectorType} vectors producing a negative weight in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractRaw(vec2, vec1)).to.throw(EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(scale * 2);
            expect(weight.value.strictlyPositive).to.eql(true)
        });

        it(`cannot scale a ${vectorType} vector with a negative value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = -1;
            expect(() => vectorSpace.scaleRaw(scale, vec1)).to.throw(EM_SCALE_FACTOR_NEGATIVE_OR_NULL);
        });

        it(`cannot scale a ${vectorType} vector with a null value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 0;
            expect(() => vectorSpace.scaleRaw(scale, vec1)).to.throw(EM_SCALE_FACTOR_NEGATIVE_OR_NULL);
        });

        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(scale * 2);
            expect(weight.value.strictlyPositive).to.eql(false)
        });

        it(`can scale a ${vectorType} vector with a real value producing a weight smaller than ${NULL_WEIGHT_TOLERANCE} tolerance with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
            let scale = NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false)
            scale = - NULL_WEIGHT_TOLERANCE / 3;
            const result1 = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            expect(result1.type).to.eql(vectorType);
            const weight1 = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.weight).to.eql(0);
            expect(weight1.value.strictlyPositive).to.eql(false)
        });

        it(`cannot scale a ${vectorType} vector with a negative value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            expect(() => vectorSpace.scaleRaw(scale, vec1)).to.throw(EM_SCALE_FACTOR_NEGATIVE);
        });

        it(`can scale a ${vectorType} vector with a null value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false)
        });

        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
            const scale = 2;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(scale * DEFAULT_WEIGHT_VALUE);
            expect(weight.value.strictlyPositive).to.eql(true)
        });

        it(`can scale a ${vectorType} vector with a real value producing a weight smaller than ${NULL_WEIGHT_TOLERANCE} tolerance with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, true);
            let scale = NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false)
            scale = - NULL_WEIGHT_TOLERANCE / 3;
            const result1 = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            expect(result1.type).to.eql(vectorType);
            const weight1 = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight1.value.weight).to.eql(0);
            expect(weight1.value.strictlyPositive).to.eql(false)
        });

        it(`cannot scale a ${vectorType} vector with a negative value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            expect(() => vectorSpace.scaleRaw(scale, vec1)).to.throw(EM_SCALE_FACTOR_NEGATIVE);
        });

        it(`can scale a ${vectorType} vector with a null value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleRaw(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(0);
            expect(weight.value.strictlyPositive).to.eql(false)
        });

        it(`can clone a ${vectorType} vector with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneRaw(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(weight1.value.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
        });

        it(`can clone a ${vectorType} vector with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, false);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneRaw(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(weight1.value.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
        });

        it(`can clone a ${vectorType} vector with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneRaw(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.type).to.eql(vectorType);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.weight).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as Weight_Interface;
            expect(weight.value.strictlyPositive).to.eql(weight1.value.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
            const vec2 = createTestProjectiveVector(vectorType, value, false);
            let result1 = vectorSpace.cloneRaw(vec2);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            expect(result1.type).to.eql(vectorType);
            const weight2 = result1.coordinates[weightIndex] as Weight_Interface;
            expect(weight2.value.weight).to.eql(value);
            const weight3 = vec2.coordinates[weightIndex] as Weight_Interface;
            expect(weight2.value.strictlyPositive).to.eql(weight3.value.strictlyPositive);
        });

        it(`cannot create a ${vectorType} vector when the dimension of the coordinates array is not the same as the dimension of the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace(WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => vectorSpace.createVector([1, 2])).to.throw(EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });

    });
}

// Helper function to create test vectors
export function createTestProjectiveVector(
  type: typeof PROJECTIVEVECTOR2D | typeof PROJECTIVEVECTOR3D, 
  weightValue: number, 
  strictlyPositive: boolean
): ProjectiveVector {
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
