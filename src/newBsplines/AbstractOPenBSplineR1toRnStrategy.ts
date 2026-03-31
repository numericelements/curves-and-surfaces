import { IVector } from "../mathVector/Vector";
import { RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { CurvePoint } from "./CurveEntitiesTypes";
import { NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { BSplineEvaluator, OpenBSplineR1toRn } from "./OpenBSplineR1toRn";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";

export abstract class AbstractOPenBSplineR1toRnStrategy<V extends Vector, D extends number> {

    protected _isDirty: boolean = true;
    private _evaluatorCache: Map<string, BSplineEvaluator<V, D>> = new Map();
    // protected openBSplineR1toRn: OpenBSplineR1toRn<V, D>;
    protected _defaultAlgorithm: string = 'coxdeboor';
    // strategy owns its own working copy: mutable, derived from the immutable curve
    protected readonly _controlPoints: ReadonlyArray<IVector<D, V>>;
    // protected readonly _knots: readonly number[];
    protected readonly _degree: number;

    // constructor(curveParameters: BSpline_type, openBSplineR1toRn: OpenBSplineR1toRn<V, D>) {
    //     this.openBSplineR1toRn = openBSplineR1toRn;
    //     this.initializeControlPolygonAndKnots(curveParameters);
    // }
    constructor(protected readonly curve: AbstractBSplineR1toRn<V, D>) {
        // initialize from immutable curve getters (read only, no write)
        // this.initializeControlPolygonAndKnots();
        this._controlPoints = curve.controlPoints;
        // this._knots = curve.knots;
        this._degree = curve.degree;
    }

    // protected initializeControlPolygonAndKnots(): void {
    //     // read from curve getters: never write into curve properties
    //     this._controlPoints = this.curve.controlPoints;
    //     this._knots = this.curve.knots;
    //     this._degree = this.curve.degree;
    // }

    withCurve(curve: AbstractBSplineR1toRn<V, D>): this {
        // return new strategy instance bound to new curve
        return new (this.constructor as new (curve: AbstractBSplineR1toRn<V, D>) => this)(curve);
    }

    // private initializeControlPolygonAndKnots(curveParameters: BSpline_type): void {
    //     if(curveParameters.type === BSPL_CP_NO_KNOT || curveParameters.type === BSPL_CP_DEG_UNIFORM ||
    //         curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSPL_CP_DEG_NONUNIFORM) {
    //         if(curveParameters.controlPoints instanceof ControlPolygonFromDescriptors) {
    //             this.openBSplineR1toRn.controlPolygon = curveParameters.controlPoints;
    //         } else {
    //             // this.openBSplineR1toRn.controlPolygon = new ControlPolygonFromDescriptors(curveParameters.controlPoints);
    //         }
    //         if(curveParameters.type === BSPL_CP_NO_KNOT) {
    //             this.openBSplineR1toRn.degree = this.openBSplineR1toRn.controlPolygon.length - 1;
    //             this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, {type: NO_KNOT_OPEN_CURVE});
    //         } else {
    //             this.openBSplineR1toRn.degree = curveParameters.degree;
    //             if(curveParameters.type === BSPL_CP_DEG_UNIFORM) {
    //                 this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1});
    //             } else if(curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN) {
    //                 this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1});
    //             } else {
    //                 this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1});
    //             }
    //         }
    //     } else {
    //         throw new Error("Invalid curve parameters for OpenBSplineR1toRn constructor");
    //     }
    // }

    evaluateWithAlgorithm(u: number, algorithmName: string): CurvePoint<V, D> {
        const evaluator = this.getEvaluatorView(algorithmName);
        return evaluator.evaluate(u);
    }

    setDefaultAlgorithm(algorithmName: string): void {
        this._defaultAlgorithm = algorithmName;
        // Clear cache to force recreation with new algorithm
        this.invalidate();
    }

    abstract evaluate(u: number): CurvePoint<V, D>;

    // evaluate(u: number): RealVector {
    //     return this.evaluateWithAlgorithm(u, this._defaultAlgorithm);
    // }

    protected abstract createEvaluator(algorithmName: string): BSplineEvaluator<V, D>;

    getEvaluatorView<T extends BSplineEvaluator<V, D>>(algorithmName: string): T {
        if (this._isDirty || !this._evaluatorCache.has(algorithmName)) {
            const evaluator = this.createEvaluator(algorithmName);
            this._evaluatorCache.set(algorithmName, evaluator);
            this._isDirty = false;
        }
        return this._evaluatorCache.get(algorithmName) as T;
    }

    invalidate(): void {
        this._isDirty = true;
        // Invalidate all cached evaluators
        this._evaluatorCache.forEach(evaluator => {
            if ('invalidate' in evaluator) {
                (evaluator as any).invalidate();
            }
        });
    }
}