import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { BSplineFromVectorParams } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { AbstractBSplineR1toRn, deriveBezierDegree, deriveDegree } from "./AbstractBSplineR1toRn";
import { BSPL_CP_NO_KNOT } from "./BSplineR1toRnConstructorInterface";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "./KnotSequenceConstructorInterface";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";

export class BSplineFromVectors<V extends Vector, D extends number>
    extends AbstractBSplineR1toRn<V, D>
{
    protected readonly _curveOrigin: number;
    protected readonly strategy?: AbstractOPenBSplineR1toRnStrategy<V, D>;
    private readonly _params: BSplineFromVectorParams<V, D>;

    constructor(params: BSplineFromVectorParams<V, D>) {
        const { controlPolygon, knotSequence } = params;

        // 2) derive degree (never ask user)
        const degree = deriveDegree(knotSequence.length(), controlPolygon.length);

        // 3) infer vector space from first control point (non-mutating)
        const firstCP = controlPolygon.controlPoints[0];
        const vectorSpace = firstCP.vectorSpace.spaceType as VectorSpaceType;
        const spaceDimension = firstCP.dimension as D;

        super(controlPolygon, knotSequence.distinctAbscissae(), degree, vectorSpace, spaceDimension);

        this._params = params;
        this._curveOrigin = knotSequence.distinctAbscissae()[knotSequence.indexKnotOrigin.knotIndex];

        // 4) inject evaluator strategy
        AlgorithmBootstrap.initialize();
        const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(
            vectorSpace,
            params.useCase ?? "general"
        );
        // this.strategy = AlgorithmBootstrap
        //     .getInstance()
        //     .getRecommendedAlgorithm(vectorSpace, spaceDimension, this);
                // TODO: assign this.strategy via AlgorithmRegistry.createEvaluator/create(...) once wiring is finalized
        void algorithmName;
        void spaceDimension;
    }

    
    withControlPolygon(controlPolygon: ControlPolygon<V, D>): BSplineFromVectors<V, D> {
        return new BSplineFromVectors<V, D>({
            ...this._params,
            controlPolygon
        });
    }

    withKnots(knots: number[]): BSplineFromVectors<V, D> {
        const knotSequence = new IncreasingOpenKnotSequenceOpenCurve(this.degree + 1, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots});
        return new BSplineFromVectors<V, D>({
            ...this._params,
            // knotSequence: this._params.knotSequence.withKnots(knots)
            knotSequence
        });
    }

    evaluate(u: number): readonly number[] {
        if (!this.strategy) {
            throw new Error("BSplineFromVectors: strategy is not initialized yet.");
        }
        const result = this.strategy.evaluate(u);
        if(typeof result === "number") {
            return [result];
        } else {
            return result;
        }
    }
}