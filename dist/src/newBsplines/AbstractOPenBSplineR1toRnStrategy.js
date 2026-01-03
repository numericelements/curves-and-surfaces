"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractOPenBSplineR1toRnStrategy = void 0;
const BSplineR1toRnConstructorInterface_1 = require("./BSplineR1toRnConstructorInterface");
const ControlPolygon_1 = require("./ControlPolygon");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("./StrictlyIncreasingOpenKnotSequenceOpenCurve");
class AbstractOPenBSplineR1toRnStrategy {
    constructor(curveParameters, openBSplineR1toRn) {
        this._isDirty = true;
        this._evaluatorCache = new Map();
        this._defaultAlgorithm = 'coxdeboor';
        this.openBSplineR1toRn = openBSplineR1toRn;
        this.initializeControlPolygonAndKnots(curveParameters);
    }
    initializeControlPolygonAndKnots(curveParameters) {
        if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_NONUNIFORM) {
            if (curveParameters.controlPoints instanceof ControlPolygon_1.ControlPolygon) {
                this.openBSplineR1toRn.controlPolygon = curveParameters.controlPoints;
            }
            else {
                this.openBSplineR1toRn.controlPolygon = new ControlPolygon_1.ControlPolygon(curveParameters.controlPoints);
            }
            if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT) {
                this.openBSplineR1toRn.degree = this.openBSplineR1toRn.controlPolygon.length - 1;
                this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
            }
            else {
                this.openBSplineR1toRn.degree = curveParameters.degree;
                if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM) {
                    this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1 });
                }
                else if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM_EUCLIDEAN) {
                    this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1 });
                }
                else {
                    this.openBSplineR1toRn.knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this.openBSplineR1toRn.degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: this.openBSplineR1toRn.controlPolygon.length - 1 });
                }
            }
        }
        else {
            throw new Error("Invalid curve parameters for OpenBSplineR1toRn constructor");
        }
    }
    evaluateWithAlgorithm(u, algorithmName) {
        const evaluator = this.getEvaluatorView(algorithmName);
        return evaluator.evaluate(u);
    }
    setDefaultAlgorithm(algorithmName) {
        this._defaultAlgorithm = algorithmName;
        // Clear cache to force recreation with new algorithm
        this.invalidate();
    }
    evaluate(u) {
        return this.evaluateWithAlgorithm(u, this._defaultAlgorithm);
    }
    getEvaluatorView(algorithmName) {
        if (this._isDirty || !this._evaluatorCache.has(algorithmName)) {
            const evaluator = this.createEvaluator(algorithmName);
            this._evaluatorCache.set(algorithmName, evaluator);
            this._isDirty = false;
        }
        return this._evaluatorCache.get(algorithmName);
    }
    invalidate() {
        this._isDirty = true;
        // Invalidate all cached evaluators
        this._evaluatorCache.forEach(evaluator => {
            if ('invalidate' in evaluator) {
                evaluator.invalidate();
            }
        });
    }
}
exports.AbstractOPenBSplineR1toRnStrategy = AbstractOPenBSplineR1toRnStrategy;
