import { RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { AlgorithmRegistry, BSplineEvaluator } from "./OpenBSplineR1toRn";

export class ClosedBSplineR1toRn<V extends Vector, D extends number>
    extends AbstractBSplineR1toRn<V, D>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingOpenKnotSequenceClosedCurve;
    protected readonly _evaluator: BSplineEvaluator;

    constructor(
        controlPolygon: ControlPolygon<V, D>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceClosedCurve,
        degree: number,
        vectorSpace: VectorSpaceType,
        spaceDimension: number
    ) {
        const knots = knotSequence.distinctAbscissae();
        super(controlPolygon, knots, degree, vectorSpace, spaceDimension);

        this._knotSequence = knotSequence;
        this._curveOrigin = knots[knotSequence.indexKnotOrigin.knotIndex];

        AlgorithmBootstrap.initialize();
        const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(vectorSpace, "general");
        this._evaluator = AlgorithmRegistry.createEvaluator(
            algorithmName,
            new ControlPolygonFromDescriptors(controlPolygon as any) as any,
            knotSequence as any,
            degree,
            null,
            vectorSpace
        );
    }

    get curveOrigin(): number { return this._curveOrigin; }
    get knotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve { return this._knotSequence; }

    // evaluate(u: number): readonly number[] {
    evaluate(u: number): RealVector {
        return this._evaluator.evaluate(u);
    }

    withControlPolygon(controlPolygon: ControlPolygon<V, D>): ClosedBSplineR1toRn<V, D> {
        return new ClosedBSplineR1toRn<V, D>(
            controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withKnots(knots: readonly number[]): ClosedBSplineR1toRn<V, D> {
        const knotSequence = this._knotSequence.insertKnot(knots as any);
        return new ClosedBSplineR1toRn<V, D>(
            this._controlPolygon,
            knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }
}