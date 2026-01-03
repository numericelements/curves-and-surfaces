"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestProjectiveVector = exports.createCommonProjectiveVectorSpaceTests = void 0;
const chai_1 = require("chai");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const Weight_1 = require("../../src/mathVector/Weight");
const Weight_2 = require("../../src/namedConstants/Weight");
const OptProblemOpenBSplineR1toR2_1 = require("../../src/bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2");
const ProjectiveVectorSpace_2 = require("../../src/ErrorMessages/ProjectiveVectorSpace");
const WeightManager_1 = require("../../src/ErrorMessages/WeightManager");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const VectorTypeTags_1 = require("../../src/namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
function createCommonProjectiveVectorSpaceTests(createProjectiveVectorSpace, dimension, vectorType, weightIndex) {
    describe('Common ProjectiveVector Space Tests', () => {
        it(`can check if two ProjectiveVectors are of same dimension ${dimension}D`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            (0, chai_1.expect)(vectorSpace.areSameDimension(vec1, vec2)).to.eql(true);
        });
        it(`can check if a ${vectorType} vector is not in the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            let vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            let vec2 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            if (vectorSpace.dimension() === ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
                vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
                vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(0, false) }] };
            }
            else {
                vec1 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(2) }] };
                vec2 = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(0, false) }] };
            }
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(false);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(false);
        });
        it(`can check if two ${vectorType} vectors share the same weight management status ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = createTestProjectiveVector(vectorType, 2, true);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const weight1 = vec1.coordinates[weightIndex];
            const weight2 = vec2.coordinates[weightIndex];
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });
        it(`can check if two ${vectorType} vectors share the same weight management status ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            let vec1 = createTestProjectiveVector(vectorType, 0, false);
            let vec2 = createTestProjectiveVector(vectorType, 2, true);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            let weight1 = vec1.coordinates[weightIndex];
            let weight2 = vec2.coordinates[weightIndex];
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            // Test other combinations
            vec1 = createTestProjectiveVector(vectorType, 2, true);
            vec2 = createTestProjectiveVector(vectorType, 0, false);
            (0, chai_1.expect)(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
            vec1 = createTestProjectiveVector(vectorType, 0, false);
            vec2 = createTestProjectiveVector(vectorType, 0, false);
            (0, chai_1.expect)(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });
        it(`can check that two ${vectorType} vectors share the same weight management status ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let vec1 = createTestProjectiveVector(vectorType, 0, false);
            let vec2 = createTestProjectiveVector(vectorType, 2, false);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec2)).to.eql(true);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            let weight1 = vec1.coordinates[weightIndex];
            let weight2 = vec2.coordinates[weightIndex];
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(vectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true);
        });
        it(`can get a default ${vectorType} vector in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            const vec1 = vectorSpace.defaultVect();
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec1)).to.eql(true);
            (0, chai_1.expect)(vec1.type).to.eql(vectorType);
            const weight = vec1.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
        });
        it(`can get a default ${vectorType} vector in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec = vectorSpace.defaultVect();
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            (0, chai_1.expect)(vec.type).to.eql(vectorType);
            const weight = vec.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
        });
        it(`can get a default ${vectorType} vector in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec = vectorSpace.defaultVect();
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(vec)).to.eql(true);
            (0, chai_1.expect)(vec.type).to.eql(vectorType);
            const weight = vec.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
        });
        it(`can add two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const weight_val = 2;
            const vec1 = createTestProjectiveVector(vectorType, weight_val, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.addDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(weight_val + OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
        });
        it(`can add two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveVector(vectorType, 0, false);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            const result1 = vectorSpace.addDescriptors(vec1, vec3);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
            const weight1 = result1.coordinates[weightIndex];
            (0, chai_1.expect)(weight1.weight.value).to.eql(0);
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(false);
        });
        it(`can add two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const vec3 = createTestProjectiveVector(vectorType, 0, false);
            const result = vectorSpace.addDescriptors(vec1, vec2);
            const result1 = vectorSpace.addDescriptors(vec1, vec3);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
            const weight1 = result1.coordinates[weightIndex];
            (0, chai_1.expect)(weight1.weight.value).to.eql(0);
            (0, chai_1.expect)(weight1.weight.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
        });
        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(1);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`cannot subtract two ${vectorType} vectors with same weights in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 1, true);
            const vec2 = vectorSpace.defaultVect();
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw(WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });
        it(`cannot subtract two ${vectorType} vectors with weights within ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} and a resulting weight negative, in the vector space, with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT - (ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec1, vec2)).to.throw(WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
        });
        it(`cannot subtract two ${vectorType} vectors producing a negative weight with absolute value greater than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(ProjectiveVectorSpace_2.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });
        it(`can subtract two ${vectorType} vectors with same weights in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ${vectorType} vectors with weights within ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT - (ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2), false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`cannot subtract two ${vectorType} vectors  producing a negative weight in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, false);
            const vec2 = vectorSpace.defaultVect();
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(ProjectiveVectorSpace_2.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });
        it(`can subtract two ${vectorType} vectors in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
        });
        it(`can subtract two ${vectorType} vectors with one having a null weight in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 0, false);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec2, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
        });
        it(`can subtract two ${vectorType} vectors with same weights in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT, true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`can subtract two ${vectorType} vectors with weights within ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, OptProblemOpenBSplineR1toR2_1.DEFAULT_WEIGHT - (ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 2), true);
            const vec2 = vectorSpace.defaultVect();
            const result = vectorSpace.subtractDescriptors(vec1, vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`cannot subtract two ${vectorType} vectors producing a negative weight in the vector space with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const vec2 = vectorSpace.defaultVect();
            (0, chai_1.expect)(() => vectorSpace.subtractDescriptors(vec2, vec1)).to.throw(ProjectiveVectorSpace_2.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
        });
        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(scale * 2);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
        });
        it(`cannot scale a ${vectorType} vector with a negative value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = -1;
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });
        it(`cannot scale a ${vectorType} vector with a null value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace();
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 0;
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(WeightManager_1.EM_SCALE_FACTOR_NULL);
        });
        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, 2, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(scale * 2);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`can scale a ${vectorType} vector with a real strictly positive value producing a weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} tolerance with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            let scale = ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.be.closeTo(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 3, GeneralPurpose_1.TOLERANCE_FLOAT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`cannot scale a ${vectorType} vector with a strictly negative value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            (0, chai_1.expect)(scale).to.be.lessThan(0);
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });
        it(`can scale a ${vectorType} vector with a null value with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`can scale a ${vectorType} vector with a strictly positive real value with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            const scale = 2;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(scale * Weight_2.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
        });
        it(`can scale a ${vectorType} vector with a real, strictly positive value, producing a weight smaller than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} tolerance with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, true);
            let scale = ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 3;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.be.closeTo(ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE / 3, GeneralPurpose_1.TOLERANCE_FLOAT);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(true);
        });
        it(`cannot scale a ${vectorType} vector with a strictly negative value with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, false);
            const scale = -2;
            (0, chai_1.expect)(scale).to.be.lessThan(0);
            (0, chai_1.expect)(() => vectorSpace.scaleDescriptor(scale, vec1)).to.throw(WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
        });
        it(`can scale a ${vectorType} vector with a null value with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const vec1 = createTestProjectiveVector(vectorType, Weight_2.DEFAULT_WEIGHT_VALUE, false);
            const scale = 0;
            const result = vectorSpace.scaleDescriptor(scale, vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(0);
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(false);
        });
        it(`can clone a ${vectorType} vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            (0, chai_1.expect)(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            (0, chai_1.expect)(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            (0, chai_1.expect)(vec1.coordinates[0]).to.eql(coord1);
        });
        it(`can clone a ${vectorType} vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, false);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            (0, chai_1.expect)(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            (0, chai_1.expect)(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            (0, chai_1.expect)(vec1.coordinates[0]).to.eql(coord1);
        });
        it(`can clone a ${vectorType} vector with weight management ${ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights}`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights);
            const value = 2;
            const vec1 = createTestProjectiveVector(vectorType, value, true);
            const coord1 = vec1.coordinates[0];
            let result = vectorSpace.cloneVector(vec1);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result)).to.eql(true);
            (0, chai_1.expect)(result.type).to.eql(vectorType);
            (0, chai_1.expect)(result.coordinates[0]).to.eql(vec1.coordinates[0]);
            (0, chai_1.expect)(result.coordinates[1]).to.eql(vec1.coordinates[1]);
            const weight = result.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.value).to.eql(value);
            const weight1 = vec1.coordinates[weightIndex];
            (0, chai_1.expect)(weight.weight.strictlyPositive).to.eql(weight1.weight.strictlyPositive);
            result.coordinates[0] = -1;
            (0, chai_1.expect)(vec1.coordinates[0]).to.eql(coord1);
            const vec2 = createTestProjectiveVector(vectorType, value, false);
            let result1 = vectorSpace.cloneVector(vec2);
            (0, chai_1.expect)(vectorSpace.isInVectorSpace(result1)).to.eql(true);
            (0, chai_1.expect)(result1.type).to.eql(vectorType);
            const weight2 = result1.coordinates[weightIndex];
            (0, chai_1.expect)(weight2.weight.value).to.eql(value);
            const weight3 = vec2.coordinates[weightIndex];
            (0, chai_1.expect)(weight2.weight.strictlyPositive).to.eql(weight3.weight.strictlyPositive);
        });
        it(`cannot create a ${vectorType} vector when the dimension of the coordinates array is not the same as the dimension of the vector space`, () => {
            const vectorSpace = createProjectiveVectorSpace(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(vectorSpace.weightManagement).to.eql(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
            (0, chai_1.expect)(() => vectorSpace.createVector([1, 2])).to.throw(ProjectiveVectorSpace_2.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
        });
    });
}
exports.createCommonProjectiveVectorSpaceTests = createCommonProjectiveVectorSpaceTests;
// Helper function to create test vectors
function createTestProjectiveVector(type, weightValue, strictlyPositive) {
    if (type === VectorTypeTags_1.PROJECTIVEVECTOR2D) {
        return {
            type: VectorTypeTags_1.PROJECTIVEVECTOR2D,
            coordinates: [1, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(weightValue, strictlyPositive) }]
        };
    }
    else {
        return {
            type: VectorTypeTags_1.PROJECTIVEVECTOR3D,
            coordinates: [1, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_1.Weight(weightValue, strictlyPositive) }]
        };
    }
}
exports.createTestProjectiveVector = createTestProjectiveVector;
