import { RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractBSplineR1toRn, normalizeDescriptorsToControlPolygon } from "./AbstractBSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { BSplineEvaluator } from "./OpenBSplineR1toRn";
import { IVector } from "../mathVector/Vector";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AlgorithmRegistry } from "./AlgorithmRegistry";

export class ClosedBSplineR1toRn<IV extends IVector<any, Vector>>
    extends AbstractBSplineR1toRn<IV>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
    protected readonly _evaluator: BSplineEvaluator<IV>;

    constructor(
        controlPolygon: ControlPolygon<IV>,
        knotSequence: StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
        degree: number,
        vectorSpace: VectorSpaceType,
        spaceDimension: number
    ) {
        const knots = knotSequence.distinctAbscissae();
        super(controlPolygon, knotSequence, degree, vectorSpace, spaceDimension);

        this._knotSequence = knotSequence;
        this._curveOrigin = KNOT_SEQUENCE_ORIGIN;

        AlgorithmBootstrap.initialize();
        const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(vectorSpace, "general");
        this._evaluator = AlgorithmRegistry.createEvaluator(
            algorithmName,
            this._controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );
    }

    get curveOrigin(): number { return this._curveOrigin; }
    get knotSequence(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve { return this._knotSequence; }
    get controlPolygon(): ControlPolygon<IV> {
        return this._controlPolygon;
    }
    get degree(): number {
        return this._degree;
    }

    evaluate(u: number): IV {
        return this._evaluator.evaluate(u);
    }

    evaluateWithAlgorithm(u: number, algorithmName?: string): IV {
        const name = algorithmName
            ?? AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");

        const evaluator = AlgorithmRegistry.createEvaluator(
            name,
            this._controlPolygon as ControlPolygon<IVector<any, Vector>>,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );

        return evaluator.evaluate(u) as IV;
    }

    getAvailableAlgorithms(): string[] {
        return AlgorithmRegistry.getAvailableAlgorithms(this._vectorSpace);
    }

    setDefaultAlgorithm(vectorSpaceType: VectorSpaceType, algorithmName: string): void {
        const available = this.getAvailableAlgorithms();
        if (available.indexOf(algorithmName) == -1) {
            throw new Error(`Algorithm '${algorithmName}' not available for vector space type ${this._vectorSpace}`);
        }
        AlgorithmRegistry.setDefaultAlgorithm(vectorSpaceType, algorithmName);
    }

    withControlPolygon(controlPolygon: ControlPolygon<IV>): ClosedBSplineR1toRn<IV> {
        return new ClosedBSplineR1toRn<IV>(
            controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withKnots(knots: readonly number[]): ClosedBSplineR1toRn<IV> {
        const knotSequence = this._knotSequence.insertKnot(knots as any);
        return new ClosedBSplineR1toRn<IV>(
            this._controlPolygon,
            knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withControlPoints(controlPoints: ControlPolygonFromDescriptors | ControlPolygon<IV>): ClosedBSplineR1toRn<IV> {
        return this.withControlPolygon(
            ClosedBSplineR1toRn.toCanonicalControlPolygon(controlPoints as any) as ControlPolygon<IV>
        );
    }

    euclideanDistances(): number[] {
        throw new Error("euclideanDistances: not yet implemented in this version");
    }
    moveControlPoint(index: number, displacement: IV): ClosedBSplineR1toRn<IV> {
        return this.withControlPolygon(this._controlPolygon.withMovedControlPoint(index, displacement));
        // this.strategy.invalidate();
    }

    private static toCanonicalControlPolygon<IV extends IVector<any, Vector>>(
        cp: ControlPolygonFromDescriptors | ControlPolygon<IV>
    ): ControlPolygon<IV> {
        if (cp instanceof ControlPolygon) return cp;
        if (cp instanceof ControlPolygonFromDescriptors) {
            return normalizeDescriptorsToControlPolygon(cp as any) as ControlPolygon<IV>;
        }
        return normalizeDescriptorsToControlPolygon(
            new ControlPolygonFromDescriptors(cp as any)
        ) as ControlPolygon<IV>;
    }

    private static toDescriptorPolygon<IV extends IVector<any, Vector>>(
        cp: ControlPolygon<IV>
    ): ControlPolygonFromDescriptors {
        return new ControlPolygonFromDescriptors(cp as any);
    }
}