"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoxDeBoorAlgorithmFactory = void 0;
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
class CoxDeBoorAlgorithmFactory {
    createEvaluator(controlPolygon, knotSequence, degree, vectorSpace) {
        // Determine vector space type from the vectorSpace parameter
        const vectorSpaceType = this.getVectorSpaceType(vectorSpace);
        switch (vectorSpaceType) {
            case BSplineR1toRn_1.VectorSpaceType.REAL:
                return new OpenBSplineR1toRn_1.CoxDeBoorRealEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
                return new OpenBSplineR1toRn_1.CoxDeBoorProjectiveEvaluator(controlPolygon, knotSequence, degree);
            // case VectorSpaceType.COMPLEX:
            //     return new CoxDeBoorComplexEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            // case VectorSpaceType.PROJECTIVECOMPLEX:
            //     return new CoxDeBoorComplexProjectiveEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            default:
                throw new Error(`Unsupported vector space type for Cox-de Boor algorithm`);
        }
    }
    getVectorSpaceType(vectorSpace) {
        // Determine type based on vectorSpace instance
        if (vectorSpace.constructor.name.includes('Real'))
            return BSplineR1toRn_1.VectorSpaceType.REAL;
        if (vectorSpace.constructor.name.includes('Projective') && vectorSpace.constructor.name.includes('Complex'))
            return BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX;
        if (vectorSpace.constructor.name.includes('Projective'))
            return BSplineR1toRn_1.VectorSpaceType.PROJECTIVE;
        if (vectorSpace.constructor.name.includes('Complex'))
            return BSplineR1toRn_1.VectorSpaceType.COMPLEX;
        return BSplineR1toRn_1.VectorSpaceType.REAL; // Default
    }
}
exports.CoxDeBoorAlgorithmFactory = CoxDeBoorAlgorithmFactory;
