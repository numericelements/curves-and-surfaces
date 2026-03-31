import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { AlgorithmFactoryInterface, BSplineEvaluator } from "./OpenBSplineR1toRn";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { isComplexControlPolygon, isProjectiveComplexControlPolygon, isProjectiveControlPolygon, isRealControlPolygon } from "./AlgorithmBootstrap";
import { CoxDeBoorRealCoordinatesEvaluator } from "./CoxDeBoorRealCoordinatesEvaluator";
import { CoxDeBoorComplexCoordinatesEvaluator } from "./CoxDeBoorComplexCoordinatesEvaluator";

export class CoxDeBoorAlgorithmFactory implements AlgorithmFactoryInterface {

    createEvaluator(
        controlPolygon: ControlPolygon<Vector, number>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number
    ): BSplineEvaluator<Vector, number> {
        if (isRealControlPolygon(controlPolygon)) {
            return new CoxDeBoorRealCoordinatesEvaluator(controlPolygon, knotSequence, degree);
        } else if (isProjectiveControlPolygon(controlPolygon)) {
            return new CoxDeBoorRealCoordinatesEvaluator(controlPolygon, knotSequence, degree);
        } else if (isComplexControlPolygon(controlPolygon)) {
            return new CoxDeBoorComplexCoordinatesEvaluator(controlPolygon, knotSequence, degree);
        } else if (isProjectiveComplexControlPolygon(controlPolygon)) {
            return new CoxDeBoorComplexCoordinatesEvaluator(controlPolygon, knotSequence, degree);
        } else {
            throw new Error(`Unsupported vector space type for Cox-de Boor algorithm`);
        }
    }
}