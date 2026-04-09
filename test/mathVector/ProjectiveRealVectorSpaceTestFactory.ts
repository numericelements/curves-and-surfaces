import { expect } from "chai";
import { ProjectiveRealVectorSpace } from "../../src/mathVector/ProjectiveRealVectorSpace";
import { MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { WeightDesc } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { DEFAULT_WEIGHT } from "../../src/bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2";
import { EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT } from "../../src/ErrorMessages/ProjectiveRealVectorSpace";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE } from "../../src/ErrorMessages/WeightManager";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D } from "../../src/namedConstants/VectorTypeTags";
import { WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { ProjectiveRealVectorOfDimension } from "../../src/mathVector/conditionalTypes/VectorDescriptorTypes";
import { ProjectiveRealVectorDesc } from "../../src/mathVector/utilityTypes/VectorDescriptorTypes";

export function createCommonProjectiveRealVectorSpaceTests<D extends 3 | 4>(
    createProjectiveVectorSpace: (dimension: D, weightManagement?: WeightManagement) => ProjectiveRealVectorSpace<D>,
    dimension: D,
    // vectorType: typeof PROJECTIVEVECTOR2D | typeof PROJECTIVEVECTOR3D,
    weightIndex: number
) {
    describe('Common ProjectiveRealVector Space Tests', () => {

        it(`can check if two ProjectiveRealVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            expect(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true)
        });

        it(`can check if a ${dimension}D vector is not in the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            let vec1: ProjectiveRealVectorDesc = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            let vec2: ProjectiveRealVectorDesc = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            if(vectorSpace.dimension() === MAX_DIMENSION_PROJECTIVEREALVECTORSPACE) {
                vec1 = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(2)}]};
                vec2 = {type: PROJECTIVEREALVECTOR2D, coordinates: [1, 0, {type: WEIGHT, weight: new Weight(0, false)}]};
            } else {
                vec1 = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(2)}]};
                vec2 = {type: PROJECTIVEREALVECTOR3D, coordinates: [1, 0, 0, {type: WEIGHT, weight: new Weight(0, false)}]};
            }
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(false);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(false);
        });

        it(`can check if two ${dimension}D vectors share the same weight management status ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = createTestProjectiveRealVector(dimension, 2, true);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            const weight2 = vec2.coordinates[weightIndex] as WeightDesc;
            expect(weight1.weight.strictlyPositive).to.eql(true);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });

        it(`can check if two ${dimension}D vectors share the same weight management status ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            let vec1 = createTestProjectiveRealVector(dimension, 0, false);
            let vec2 = createTestProjectiveRealVector(dimension, 2, true);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            let weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            let weight2 = vec2.coordinates[weightIndex] as WeightDesc;
            expect(weight1.weight.strictlyPositive).to.eql(false);
            expect(weight2.weight.strictlyPositive).to.eql(true);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            
            // Test other combinations
            vec1 = createTestProjectiveRealVector(dimension, 2, true);
            vec2 = createTestProjectiveRealVector(dimension, 0, false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            vec1 = createTestProjectiveRealVector(dimension, 0, false);
            vec2 = createTestProjectiveRealVector(dimension, 0, false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });

        it(`can check that two ${dimension}D vectors share the same weight management status ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            let vec1 = createTestProjectiveRealVector(dimension, 0, false);
            let vec2 = createTestProjectiveRealVector(dimension, 2, false);
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            let weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            let weight2 = vec2.coordinates[weightIndex] as WeightDesc;
            expect(weight1.weight.strictlyPositive).to.eql(false);
            expect(weight2.weight.strictlyPositive).to.eql(false);
            expect(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        });

        it(`can get a default ${dimension}D vector in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            const vec1 = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            const weight = vec1.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(true);
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
        });

        it(`can get a default ${dimension}D vector in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            const vec = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            const weight = vec.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(false);
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
        });

        it(`can get a default ${dimension}D vector in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            const vec = vectorSpace.defaultVect();
            expect(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            const weight = vec.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(true);
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
        });

        it(`can add two ${dimension}D vectors in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const weight_val = 2;
            const vec1 = createTestProjectiveRealVector(dimension, weight_val, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.addDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(weight_val + DEFAULT_WEIGHT);
        });

        it(`can add two ${dimension}D vectors in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveRealVector(dimension, 0, false);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            const result1 = vectorSpace.addDescriptors(vec1, vec3);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
            expect(weight.weight.strictlyPositive).to.eql(false);
            const weight1 = result1.coordinates[weightIndex] as WeightDesc;
            expect(weight1.weight.value).to.eql(0);
            expect(weight1.weight.strictlyPositive).to.eql(false);
        });

        it(`can add two ${dimension}D vectors in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveRealVector(dimension, 0, false);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            const result1 = vectorSpace.addDescriptors(vec1, vec3);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
            expect(weight.weight.strictlyPositive).to.eql(true);
            const weight1 = result1.coordinates[weightIndex] as WeightDesc;
            expect(weight1.weight.value).to.eql(0);
            expect(weight1.weight.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${dimension}D vectors in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
        });

        it(`can subtract two ${dimension}D vectors in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(1);
            expect(weight.weight.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${dimension}D vectors with same weights in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 1, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });

        it(`cannot subtract two ${dimension}D vectors with weights within ${NULL_WEIGHT_TOLERANCE} and a resulting weight negative, in the vector space, with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT - (NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });

        it(`cannot subtract two ${dimension}D vectors producing a negative weight with absolute value greater than ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can subtract two ${dimension}D vectors with same weights in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${dimension}D vectors with weights within ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT - (NULL_WEIGHT_TOLERANCE / 2), false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${dimension}D vectors  producing a negative weight in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, false);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can subtract two ${dimension}D vectors in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
            expect(weight.weight.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ${dimension}D vectors with one having a null weight in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec2, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(DEFAULT_WEIGHT);
            expect(weight.weight.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ${dimension}D vectors with same weights in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ${dimension}D vectors with weights within ${NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT - (NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false);
        });

        it(`cannot subtract two ${dimension}D vectors producing a negative weight in the vector space with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const vec2 = vectorSpace.defaultVect();
            expect(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(EM_PROJECTIVEREALVECTOR_WITH_NEGATIVE_WEIGHT);
        });

        it(`can scale a ${dimension}D vector with a strictly positive real value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(scale * 2);
            expect(weight.weight.strictlyPositive).to.eql(true)
        });

        it(`cannot scale a ${dimension}D vector with a negative value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const scale = -1;
            expect(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });

        it(`cannot scale a ${dimension}D vector with a null value with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const scale = 0;
            expect(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_SCALE_FACTOR_NULL);
        });

        it(`can scale a ${dimension}D vector with a strictly positive real value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(scale * 2);
            expect(weight.weight.strictlyPositive).to.eql(false)
        });

        it(`can scale a ${dimension}D vector with a real strictly positive value producing a weight smaller than ${NULL_WEIGHT_TOLERANCE} tolerance with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            let scale = NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 3, TOLERANCE_FLOAT);
            expect(weight.weight.strictlyPositive).to.eql(false)
        });

        it(`cannot scale a ${dimension}D vector with a strictly negative value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            expect(scale).to.be.lessThan(0);
            expect(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });

        it(`can scale a ${dimension}D vector with a null value with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false)
        });

        it(`can scale a ${dimension}D vector with a strictly positive real value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(scale * DEFAULT_WEIGHT_VALUE);
            expect(weight.weight.strictlyPositive).to.eql(true)
        });

        it(`can scale a ${dimension}D vector with a real, strictly positive value, producing a weight smaller than ${NULL_WEIGHT_TOLERANCE} tolerance with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, true);
            let scale = NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 3, TOLERANCE_FLOAT);
            expect(weight.weight.strictlyPositive).to.eql(true)
        });

        it(`cannot scale a ${dimension}D vector with a strictly negative value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            expect(scale).to.be.lessThan(0);
            expect(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });

        it(`can scale a ${dimension}D vector with a null value with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveRealVector(dimension, DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(0);
            expect(weight.weight.strictlyPositive).to.eql(false)
        });

        it(`can clone a ${dimension}D vector with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveRealVector(dimension, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
        });

        it(`can clone a ${dimension}D vector with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveRealVector(dimension, value, false);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
        });

        it(`can clone a ${dimension}D vector with weight management ${WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.SomeNullWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
            const value = 2;
            const vec1 = createTestProjectiveRealVector(dimension, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            expect(vectorSpace.isInVectorSpace(result)).to.eql(true);
            expect(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            expect(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex] as WeightDesc;
            expect(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            expect(vec1.coordinates[0]).to.eql(coord1);
            const vec2 = createTestProjectiveRealVector(dimension, value, false);
            let result1 = vectorSpace.cloneVector(vec2);
            expect(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight2 = result1.coordinates[weightIndex] as WeightDesc;
            expect(weight2.weight.value).to.eql(value);
            const weight3 = vec2.coordinates[weightIndex] as WeightDesc;
            expect(weight2.weight.strictlyPositive).to.eql(weight3.weight.strictlyPositive);
        });

        it(`cannot create a ${dimension}D vector when the dimension of the coordinates array is not the same as the dimension of the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace(dimension, WeightManagement.AllStrictlyPositiveWeights);
            expect(vectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            expect(() => vectorSpace.createVector([1, 2])).to.throw(EM_PROJECTIVEREALVECTOR_DIMENSION_OUT_RANGE);
        });

    });
}

// Helper function to create test vectors
export function createTestProjectiveRealVector<D extends 3 | 4>(
  dimension: D, 
  weightValue: number, 
  strictlyPositive: boolean
): ProjectiveRealVectorOfDimension<D> {
    switch(dimension) {
        case 3 as D:
            return {
                type: PROJECTIVEREALVECTOR2D, 
                coordinates: [ 1, 0, {type: WEIGHT, weight: new Weight(weightValue, strictlyPositive)}]
            } as ProjectiveRealVectorOfDimension<D>;
        case 4 as D:
            return {
                type: PROJECTIVEREALVECTOR3D, 
                coordinates: [ 1, 0, 0, {type: WEIGHT, weight: new Weight(weightValue, strictlyPositive)}]
            } as ProjectiveRealVectorOfDimension<D>;
        default:
            throw new Error(`Unsupported dimension: ${dimension}`);
    }
}
