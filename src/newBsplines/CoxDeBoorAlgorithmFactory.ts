import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { AlgorithmFactoryInterface, BSplineEvaluator } from "./OpenBSplineR1toRn";
import { Vector } from "../mathVector/interfaces/VectorInterfaces";
import { ControlPolygon } from "./ControlPolygon";
import { isComplexControlPolygon, isProjectiveComplexControlPolygon, isProjectiveControlPolygon, isRealControlPolygon } from "./AlgorithmBootstrap";
import { CoxDeBoorRealCoordinatesEvaluator } from "./CoxDeBoorRealCoordinatesEvaluator";
import { CoxDeBoorComplexCoordinatesEvaluator } from "./CoxDeBoorComplexCoordinatesEvaluator";
import { VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";

export class CoxDeBoorAlgorithmFactory implements AlgorithmFactoryInterface {

    createEvaluator(
        controlPolygon: ControlPolygon<Vector<any, VectorDesc>>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number
    ): BSplineEvaluator<Vector<any, VectorDesc>> {
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