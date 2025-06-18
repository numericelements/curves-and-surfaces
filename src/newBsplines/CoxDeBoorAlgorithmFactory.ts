import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { ControlPolygon } from "./ControlPolygon";
import { AlgorithmFactory, BSplineEvaluator, CoxDeBoorProjectiveEvaluator, CoxDeBoorRealEvaluator } from "./OpenBSplineR1toRn";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";

export class CoxDeBoorAlgorithmFactory implements AlgorithmFactory {
    createEvaluator(
        controlPolygon: ControlPolygon,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: any
    ): BSplineEvaluator {
        
        // Determine vector space type from the vectorSpace parameter
        const vectorSpaceType = this.getVectorSpaceType(vectorSpace);
        
        switch (vectorSpaceType) {
            case VectorSpaceType.REAL:
                return new CoxDeBoorRealEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            case VectorSpaceType.PROJECTIVE:
                return new CoxDeBoorProjectiveEvaluator(controlPolygon, knotSequence, degree);
            // case VectorSpaceType.COMPLEX:
            //     return new CoxDeBoorComplexEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            // case VectorSpaceType.PROJECTIVECOMPLEX:
            //     return new CoxDeBoorComplexProjectiveEvaluator(controlPolygon, knotSequence, degree, vectorSpace);
            default:
                throw new Error(`Unsupported vector space type for Cox-de Boor algorithm`);
        }
    }

    private getVectorSpaceType(vectorSpace: any): VectorSpaceType {
        // Determine type based on vectorSpace instance
        if (vectorSpace.constructor.name.includes('Real')) return VectorSpaceType.REAL;
        if (vectorSpace.constructor.name.includes('Projective') && vectorSpace.constructor.name.includes('Complex')) return VectorSpaceType.PROJECTIVECOMPLEX;
        if (vectorSpace.constructor.name.includes('Projective')) return VectorSpaceType.PROJECTIVE;
        if (vectorSpace.constructor.name.includes('Complex')) return VectorSpaceType.COMPLEX;
        return VectorSpaceType.REAL; // Default
    }
}