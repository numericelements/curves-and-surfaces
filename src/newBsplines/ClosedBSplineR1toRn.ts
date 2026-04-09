import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractBSplineR1toRn, normalizeDescriptorsToControlPolygon } from "./AbstractBSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { BSplineEvaluator } from "./OpenBSplineR1toRn";
import { Vector } from "../mathVector/interfaces/VectorInterfaces";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AlgorithmRegistry } from "./AlgorithmRegistry";
import { VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";

export class ClosedBSplineR1toRn<V extends Vector<any, VectorDesc>>
    extends AbstractBSplineR1toRn<V>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
    protected readonly _evaluator: BSplineEvaluator<V>;

    constructor(
        controlPolygon: ControlPolygon<V>,
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
    get controlPolygon(): ControlPolygon<V> {
        return this._controlPolygon;
    }
    get degree(): number {
        return this._degree;
    }

    evaluate(u: number): V {
        return this._evaluator.evaluate(u);
    }

    evaluateWithAlgorithm(u: number, algorithmName?: string): V {
        const name = algorithmName
            ?? AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");

        const evaluator = AlgorithmRegistry.createEvaluator(
            name,
            this._controlPolygon as ControlPolygon<Vector<any, VectorDesc>>,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );

        return evaluator.evaluate(u) as V;
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

    withControlPolygon(controlPolygon: ControlPolygon<V>): ClosedBSplineR1toRn<V> {
        return new ClosedBSplineR1toRn<V>(
            controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withKnots(knots: readonly number[]): ClosedBSplineR1toRn<V> {
        const knotSequence = this._knotSequence.insertKnot(knots as any);
        return new ClosedBSplineR1toRn<V>(
            this._controlPolygon,
            knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withControlPoints(controlPoints: ControlPolygonFromDescriptors | ControlPolygon<V>): ClosedBSplineR1toRn<V> {
        return this.withControlPolygon(
            ClosedBSplineR1toRn.toCanonicalControlPolygon(controlPoints as any) as ControlPolygon<V>
        );
    }

    euclideanDistances(): number[] {
        throw new Error("euclideanDistances: not yet implemented in this version");
    }
    moveControlPoint(index: number, displacement: V): ClosedBSplineR1toRn<V> {
        return this.withControlPolygon(this._controlPolygon.withMovedControlPoint(index, displacement));
        // this.strategy.invalidate();
    }

    private static toCanonicalControlPolygon<IV extends Vector<any, VectorDesc>>(
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

    private static toDescriptorPolygon<IV extends Vector<any, VectorDesc>>(
        cp: ControlPolygon<IV>
    ): ControlPolygonFromDescriptors {
        return new ControlPolygonFromDescriptors(cp as any);
    }
}