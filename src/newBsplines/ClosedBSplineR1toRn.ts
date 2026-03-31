import { RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractBSplineR1toRn, normalizeDescriptorsToControlPolygon } from "./AbstractBSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { BSplineEvaluator } from "./OpenBSplineR1toRn";
import { IVector } from "../mathVector/Vector";
import { ControlPoints } from "./BSplineR1toRnConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AlgorithmRegistry } from "./AlgorithmRegistry";
import { CurvePoint } from "./CurveEntitiesTypes";

export class ClosedBSplineR1toRn<V extends Vector, D extends number>
    extends AbstractBSplineR1toRn<V, D>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
    protected readonly _evaluator: BSplineEvaluator<V, D>;

    constructor(
        controlPolygon: ControlPolygon<V, D>,
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
    get controlPolygon(): ControlPolygon<V, D> {
        return this._controlPolygon;
    }
    get degree(): number {
        return this._degree;
    }

    // evaluate(u: number): readonly number[] {
    // evaluate(u: number): RealVector {
    evaluate(u: number): CurvePoint<V, D> {
        return this._evaluator.evaluate(u);
    }

    evaluateWithAlgorithm(u: number, algorithmName?: string): CurvePoint<V, D> {
        const name = algorithmName
            ?? AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");

        const evaluator = AlgorithmRegistry.createEvaluator(
            name,
            this._controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );

        return evaluator.evaluate(u);
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

    withControlPoints(controlPoints: ControlPoints<V, D>): ClosedBSplineR1toRn<V, D> {
        return this.withControlPolygon(
            ClosedBSplineR1toRn.toCanonicalControlPolygon(controlPoints as any) as ControlPolygon<V, D>
        );
    }

    euclideanDistances(): number[] {
        throw new Error("euclideanDistances: not yet implemented in this version");
    }
    moveControlPoint(index: number, displacement: IVector<D, V>): ClosedBSplineR1toRn<V, D> {
        return this.withControlPolygon(this._controlPolygon.withMovedControlPoint(index, displacement));
        // this.strategy.invalidate();
    }

    private static toCanonicalControlPolygon<V extends Vector, D extends number>(
        cp: ControlPoints<V, D>
    ): ControlPolygon<V, D> {
        if (cp instanceof ControlPolygon) return cp;
        if (cp instanceof ControlPolygonFromDescriptors) {
            return normalizeDescriptorsToControlPolygon(cp as any) as ControlPolygon<V, D>;
        }
        return normalizeDescriptorsToControlPolygon(
            new ControlPolygonFromDescriptors(cp as any)
        ) as ControlPolygon<V, D>;
    }

    private static toDescriptorPolygon<V extends Vector, D extends number>(
        cp: ControlPolygon<V, D>
    ): ControlPolygonFromDescriptors<V, D> {
        return new ControlPolygonFromDescriptors(cp as any) as ControlPolygonFromDescriptors<V, D>;
    }
}