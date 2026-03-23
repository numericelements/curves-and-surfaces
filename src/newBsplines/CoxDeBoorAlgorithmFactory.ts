import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { AlgorithmFactory, AlgorithmFactoryInterface, BSplineEvaluator, CoxDeBoorProjectiveEvaluator, CoxDeBoorRealEvaluator } from "./OpenBSplineR1toRn";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";

export class CoxDeBoorAlgorithmFactory<V extends Vector = Vector, D extends number = number>
//  implements AlgorithmFactory {
    implements AlgorithmFactoryInterface<V, D> {

    createEvaluator(
        controlPolygon: ControlPolygonFromDescriptors,
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
        if (vectorSpace.constructor.name.some('Real')) return VectorSpaceType.REAL;
        if (vectorSpace.constructor.name.some('Projective') && vectorSpace.constructor.name.some('Complex')) return VectorSpaceType.PROJECTIVECOMPLEX;
        if (vectorSpace.constructor.name.some('Projective')) return VectorSpaceType.PROJECTIVE;
        if (vectorSpace.constructor.name.some('Complex')) return VectorSpaceType.COMPLEX;
        return VectorSpaceType.REAL; // Default
    }
}