"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveComplexVectorSpace2DStrategy = void 0;
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const Weight_1 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const ComplexNumberFactory_1 = require("./ComplexNumberFactory");
const ComplexWeight_1 = require("./ComplexWeight");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_2 = require("./Weight");
class ProjectiveComplexVectorSpace2DStrategy {
    // Implementation for 2D vectors
    getWeight(v) {
        return v.coordinates[1];
    }
    shareSameWeightManagement(v1, v2, weightManager) {
        if (this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[1].real;
            const weight2 = v2.coordinates[1].real;
            return weightManager.haveSameWeightManagement(weight1, weight2);
        }
        else {
            throw new RangeError();
        }
    }
    areSameDimension(v1, v2) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(v1) && (0, VectorSpaceUtilities_1.isVector2D)(v2))
            return true;
        return false;
    }
    isInVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(v))
            return true;
        return false;
    }
    createVector(coordinates, weightManager) {
        if (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights || (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            let vector = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: coordinates[0], imaginary: coordinates[1] }, { type: WeightTypeTags_1.COMPLEXWEIGHT,
                        real: weightManager.createWeightFromValueOnly(coordinates[2]), imaginary: weightManager.createWeightFromValueOnly(coordinates[3]) }] };
            return vector;
        }
        else {
            let vector = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: coordinates[0], imaginary: coordinates[1] }, { type: WeightTypeTags_1.COMPLEXWEIGHT,
                        real: weightManager.createWeightFromValueOnly(coordinates[2]), imaginary: weightManager.createWeightFromValueOnly(coordinates[3]) }] };
            return vector;
        }
    }
    defaultVect(weightManager) {
        let vector = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 1 }, { type: WeightTypeTags_1.COMPLEXWEIGHT,
                    real: weightManager.createWeightFromValueOnly(Weight_1.DEFAULT_WEIGHT_VALUE), imaginary: weightManager.createWeightFromValueOnly(Weight_1.DEFAULT_WEIGHT_VALUE) }] };
        return vector;
    }
    add(a, b, weightManager) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(a) && (0, VectorSpaceUtilities_1.isVector2D)(b)) {
            const complexWa = new ComplexWeight_1.ComplexWeight(a.coordinates[1].real, a.coordinates[1].imaginary);
            const complexWb = new ComplexWeight_1.ComplexWeight(b.coordinates[1].real, b.coordinates[1].imaginary);
            const sumWeights = weightManager.addComplexWeights(complexWa, complexWb);
            return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    (0, ComplexNumberFactory_1.addComplexUsingDescriptors)(a.coordinates[0], b.coordinates[0]),
                    { type: WeightTypeTags_1.COMPLEXWEIGHT, real: sumWeights.real, imaginary: sumWeights.imaginary }
                ]
            };
            // if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) {
            //     return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            //         addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
            //         addComplexWeightsUsingDescriptors(a.coordinates[1], b.coordinates[1])]
            //     };
            // } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            //     const complexWeight = addComplexWeightsUsingDescriptors(a.coordinates[1], b.coordinates[1]);
            //     complexWeight.real = new Weight(complexWeight.real.value, false);
            //     complexWeight.imaginary = new Weight(complexWeight.imaginary.value, false);
            //     return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            //         addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
            //         complexWeight]
            //     };
            // } else if(weightManager.weightManagement === WeightManagement.SomeNullWeights) {
            //     const complexWeight = addComplexWeightsUsingDescriptors(a.coordinates[1], b.coordinates[1]);
            //     if(complexWeight.real.strictlyPositive && !complexWeight.imaginary.strictlyPositive) {
            //         complexWeight.real = new Weight(complexWeight.real.value, false);
            //     } else if(!complexWeight.real.strictlyPositive && complexWeight.imaginary.strictlyPositive) {
            //         complexWeight.imaginary = new Weight(complexWeight.imaginary.value, false);
            //     }
            //     return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            //         addComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
            //         complexWeight]
            //     };
        }
        else {
            throw new RangeError();
        }
    }
    norm(v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v)) {
            let result = 0;
            result = Math.sqrt(v.coordinates[0].real * v.coordinates[0].real + v.coordinates[0].imaginary * v.coordinates[0].imaginary);
            result += v.coordinates[1].real.value * v.coordinates[1].real.value + v.coordinates[1].imaginary.value * v.coordinates[1].imaginary.value;
            result = Math.sqrt(result);
            return result;
        }
        else {
            throw new RangeError();
        }
    }
    scale(scaleFactor, vector, weightManager) {
        if (typeof scaleFactor === 'number') {
            if (vector.coordinates[1].real.strictlyPositive) {
                const scaledWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_2.Weight(vector.coordinates[1].real.value * scaleFactor), imaginary: new Weight_2.Weight(vector.coordinates[1].imaginary.value * scaleFactor) };
                return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor },
                        scaledWeight] };
            }
            else if (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
                const scaledWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_2.Weight(vector.coordinates[1].real.value * scaleFactor, false), imaginary: new Weight_2.Weight(vector.coordinates[1].imaginary.value * scaleFactor, false) };
                return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: vector.coordinates[0].real * scaleFactor, imaginary: vector.coordinates[0].imaginary * scaleFactor },
                        scaledWeight] };
            }
            else {
                throw new RangeError();
            }
        }
        else {
            const scaledWeight = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(scaleFactor, vector.coordinates[1]);
            if (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights && (!scaledWeight.real.strictlyPositive && scaledWeight.imaginary.strictlyPositive)) {
                scaledWeight.imaginary = new Weight_2.Weight(scaledWeight.imaginary.value, false);
            }
            else if (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights) {
                if (!scaledWeight.real.strictlyPositive || !scaledWeight.imaginary.strictlyPositive) {
                    throw new RangeError();
                }
            }
            return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(vector.coordinates[0], scaleFactor).real, imaginary: (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(vector.coordinates[0], scaleFactor).imaginary },
                    scaledWeight] };
        }
    }
    subtract(a, b, weightManager) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(a) && (0, VectorSpaceUtilities_1.isVector2D)(b)) {
            const complexWa = new ComplexWeight_1.ComplexWeight(a.coordinates[1].real, a.coordinates[1].imaginary);
            const complexWb = new ComplexWeight_1.ComplexWeight(b.coordinates[1].real, b.coordinates[1].imaginary);
            const sumWeights = weightManager.subtractComplexWeights(complexWa, complexWb);
            return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                    (0, ComplexNumberFactory_1.subtractComplexUsingDescriptors)(a.coordinates[0], b.coordinates[0]),
                    { type: WeightTypeTags_1.COMPLEXWEIGHT, real: sumWeights.real, imaginary: sumWeights.imaginary }
                ]
            };
            // if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) {
            //     return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            //         subtractComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
            //         subtractComplexWeightsUsingDescriptors(a.coordinates[1], b.coordinates[1])]
            //     };
            // } else if(weightManager.weightManagement === WeightManagement.AllPositiveWeights) {
            //     const complexWeight = subtractComplexWeightsUsingDescriptors(a.coordinates[1], b.coordinates[1]);
            //     if(complexWeight.real.strictlyPositive && !complexWeight.imaginary.strictlyPositive) {
            //         complexWeight.real = new Weight(complexWeight.real.value, false);
            //     } else if(!complexWeight.real.strictlyPositive && complexWeight.imaginary.strictlyPositive) {
            //         complexWeight.imaginary = new Weight(complexWeight.imaginary.value, false);
            //     }
            //     return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            //         subtractComplexUsingDescriptors(a.coordinates[0], b.coordinates[0]),
            //         complexWeight]
            //     };
        }
        else {
            throw new RangeError();
        }
    }
    clone(vector) {
        return { type: vector.type, coordinates: [
                { type: vector.coordinates[0].type, real: vector.coordinates[0].real, imaginary: vector.coordinates[0].imaginary },
                { type: vector.coordinates[1].type, real: vector.coordinates[1].real, imaginary: vector.coordinates[1].imaginary }
            ] };
    }
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector, weightManager) {
        let real = 0;
        let imaginary = 0;
        if (vector.coordinates[1].real.value === 0 && weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
            real = vector.coordinates[0].real;
        }
        else if (vector.coordinates[1].real.value > 0) {
            real = vector.coordinates[0].real / vector.coordinates[1].real.value;
        }
        else {
            throw new RangeError();
        }
        if (vector.coordinates[1].imaginary.value === 0 && weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
            imaginary = vector.coordinates[0].imaginary;
        }
        else if (vector.coordinates[1].imaginary.value > 0) {
            imaginary = vector.coordinates[0].imaginary / vector.coordinates[1].imaginary.value;
        }
        else {
            throw new RangeError();
        }
        return { type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginary };
    }
}
exports.ProjectiveComplexVectorSpace2DStrategy = ProjectiveComplexVectorSpace2DStrategy;
