"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmRegistry = exports.OpenBSplineR1toRn = exports.CoxDeBoorRealEvaluator = exports.CoxDeBoorProjectiveEvaluator = exports.CoxDeBoorEvaluator = exports.BSplineEvaluator = void 0;
const ProjectiveVectorSpace_1 = require("../mathVector/ProjectiveVectorSpace");
const RealVectorSpace_1 = require("../mathVector/RealVectorSpace");
const VectorSpaceUtilities_1 = require("../mathVector/VectorSpaceUtilities");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractBSplineR1toRn_1 = require("./AbstractBSplineR1toRn");
const AlgorithmBootstrap_1 = require("./AlgorithmBootstrap");
const BSplineR1toRnConstructorInterface_1 = require("./BSplineR1toRnConstructorInterface");
const ControlPolygon_1 = require("./ControlPolygon");
const CoxDeBoorAlgorithm_1 = require("./CoxDeBoorAlgorithm");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const OpenBSplineR1toRnComplexProjectiveVectorStrategy_1 = require("./OpenBSplineR1toRnComplexProjectiveVectorStrategy");
const OpenBSplineR1toRnComplexVectorStrategy_1 = require("./OpenBSplineR1toRnComplexVectorStrategy");
const OpenBSplineR1toRnRealProjectiveVectorStrategy_1 = require("./OpenBSplineR1toRnRealProjectiveVectorStrategy");
const OpenBSplineR1toRnRealVectorStrategy_1 = require("./OpenBSplineR1toRnRealVectorStrategy");
const StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("./StrictlyIncreasingOpenKnotSequenceOpenCurve");
class BSplineEvaluator {
    evaluate(parameter) {
        return 0;
    }
    ;
}
exports.BSplineEvaluator = BSplineEvaluator;
class CoxDeBoorEvaluator extends BSplineEvaluator {
    constructor(controlPolygon) {
        super();
        this.controlPolygon = controlPolygon;
        this._isDirty = true;
        this._flatCoordinates = null;
        // this.vectorSpace = new RealVectorSpace(controlPolygon.spaceDimension);
        this.vectorSpace = (0, RealVectorSpace_1.createRealVectorSpace)(controlPolygon.spaceDimension);
    }
    get flatCoordinates() {
        if (this._isDirty || !this._flatCoordinates) {
            // Fix: Actually implement the flattening
            const coords = [];
            for (let i = 0; i < this.controlPolygon.length; i++) {
                const vector = this.controlPolygon.getVector(i);
                if ((0, VectorSpaceUtilities_1.isVector2D)(vector) || (0, VectorSpaceUtilities_1.isVector3D)(vector) || (0, VectorSpaceUtilities_1.isVector4D)(vector)) {
                    coords.push(...vector.coordinates);
                }
                else {
                    coords.push(vector);
                }
            }
            this._flatCoordinates = new Float64Array(coords);
            this._isDirty = false;
        }
        return this._flatCoordinates;
    }
    evaluate(parameter) {
        // Ultra-efficient implementation
        const coords = this.flatCoordinates;
        // ... Cox-de Boor algorithm
        const resultCoords = this.coxDeBoorAlgorithm(parameter, coords);
        return this.vectorSpace.createVector(resultCoords);
    }
    invalidate() {
        this._isDirty = true;
    }
    coxDeBoorAlgorithm(u, controlPoints) {
        // Placeholder - implement actual algorithm
        const dim = this.vectorSpace.dimension();
        return new Array(dim).fill(0);
    }
}
exports.CoxDeBoorEvaluator = CoxDeBoorEvaluator;
class CoxDeBoorProjectiveEvaluator extends BSplineEvaluator {
    constructor(controlPolygon, knotSequence, degree) {
        super();
        this.controlPolygon = controlPolygon;
        this.knotSequence = knotSequence;
        this.degree = degree;
        this.vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(controlPolygon.spaceDimension);
    }
    evaluate(parameter) {
        // 1. Evaluate in projective space
        const projResult = this.evaluateProjective(parameter);
        // 2. Convert back to real space
        return this.vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(projResult);
    }
    evaluateProjective(parameter) {
        // Cox-de Boor algorithm for projective vectors
        // Handle weights properly
        return this.vectorSpace.createVector([]);
    }
}
exports.CoxDeBoorProjectiveEvaluator = CoxDeBoorProjectiveEvaluator;
/**
 * Performance-optimized evaluator for real vectors
 * Handles caching, coordinate flattening, and other optimizations
 */
class CoxDeBoorRealEvaluator extends BSplineEvaluator {
    constructor(controlPolygon, knotSequence, degree, vectorSpace) {
        super();
        this.controlPolygon = controlPolygon;
        this.knotSequence = knotSequence;
        this.degree = degree;
        // Performance optimization caches
        this._isDirty = true;
        this._flatCoordinates = null;
        this._lastParameter = NaN;
        this._lastResult = null;
        this.vectorSpace = vectorSpace;
        this.algorithm = new CoxDeBoorAlgorithm_1.CoxDeBoorAlgorithm(controlPolygon, knotSequence, degree);
    }
    evaluate(parameter) {
        // Performance optimization: check if same parameter
        if (!this._isDirty && parameter === this._lastParameter && this._lastResult) {
            return this._lastResult;
        }
        const coords = this.getFlatCoordinates();
        const resultCoords = this.algorithm.compute(parameter, coords);
        const result = this.vectorSpace.createVector(resultCoords);
        // Cache the result
        this._lastParameter = parameter;
        this._lastResult = result;
        return result;
    }
    getFlatCoordinates() {
        if (this._isDirty || !this._flatCoordinates) {
            const coords = [];
            for (let i = 0; i < this.controlPolygon.length; i++) {
                const vector = this.controlPolygon.getVector(i);
                if ((0, VectorSpaceUtilities_1.isVector2D)(vector) || (0, VectorSpaceUtilities_1.isVector3D)(vector) || (0, VectorSpaceUtilities_1.isVector4D)(vector)) {
                    coords.push(...vector.coordinates);
                }
                else {
                    coords.push(vector); // Handle scalar case
                }
            }
            this._flatCoordinates = new Float64Array(coords);
            this._isDirty = false;
        }
        return this._flatCoordinates;
    }
    invalidate() {
        this._isDirty = true;
        this._flatCoordinates = null;
        this._lastResult = null;
        this._lastParameter = NaN;
    }
}
exports.CoxDeBoorRealEvaluator = CoxDeBoorRealEvaluator;
class OpenBSplineR1toRn extends AbstractBSplineR1toRn_1.AbstractBSplineR1toRn {
    constructor(curveParameters) {
        super(curveParameters);
        this._performanceViews = new Map();
        this._curveOrigin = KnotSequences_1.KNOT_SEQUENCE_ORIGIN;
        // this.createStrategy(curveParameters);
        switch (this._vectorSpace) {
            case BSplineR1toRn_1.VectorSpaceType.REAL:
                this.strategy = new OpenBSplineR1toRnRealVectorStrategy_1.OpenBSplineR1toRnRealVectorStrategy(curveParameters, this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
                this.strategy = new OpenBSplineR1toRnComplexVectorStrategy_1.OpenBSplineR1toRnComplexVectorStrategy(curveParameters, this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
                this.strategy = new OpenBSplineR1toRnRealProjectiveVectorStrategy_1.OpenBSplineR1toRnRealProjectiveVectorStrategy(curveParameters, this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new OpenBSplineR1toRnComplexProjectiveVectorStrategy_1.OpenBSplineR1toRnComplexProjectiveVectorStrategy(curveParameters, this);
                break;
            default:
                throw new Error("Invalid vector space for OpenBSplineR1toRn constructor");
        }
        if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_NONUNIFORM) {
            if (curveParameters.controlPoints instanceof ControlPolygon_1.ControlPolygon) {
                this._controlPolygon = curveParameters.controlPoints;
            }
            else {
                this._controlPolygon = new ControlPolygon_1.ControlPolygon(curveParameters.controlPoints);
            }
            if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT) {
                this._degree = this._controlPolygon.length - 1;
                this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
            }
            else {
                this._degree = curveParameters.degree;
                if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM) {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1 });
                }
                else if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM_EUCLIDEAN) {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1 });
                }
                else {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1 });
                }
            }
        }
        else {
            throw new Error("Invalid curve parameters for OpenBSplineR1toRn constructor");
        }
    }
    get controlPolygon() {
        return this._controlPolygon;
    }
    get knotSequence() {
        return this._knotSequence;
    }
    set controlPolygon(controlPolygon) {
        this._controlPolygon = controlPolygon;
    }
    set knotSequence(knotSequence) {
        this._knotSequence = knotSequence;
    }
    euclideanDistances() {
        const distances = this.strategy.euclideanDistances();
        return distances;
    }
    evaluate(u) {
        const result = this.strategy.evaluate(u);
        // const result = this.strategy.getEvaluatorView('coxdeboor', () => new CoxDeBoorEvaluator(this._controlPolygon)).evaluate(u);
        // this.getEvaluator().evaluate(u);
        // this.getEvaluatorView('coxdeboor', () => new CoxDeBoorView(this._controlPolygon)).evaluate(u);
        return result;
    }
    /**
     * Evaluate using a specific algorithm
     */
    evaluateWithAlgorithm(u, algorithmName) {
        const algorithm = algorithmName || AlgorithmBootstrap_1.AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, 'general');
        return this.strategy.evaluateWithAlgorithm(u, algorithm);
    }
    /**
     * Get available algorithms for this curve's vector space
     */
    getAvailableAlgorithms() {
        return AlgorithmRegistry.getAvailableAlgorithms(this._vectorSpace);
    }
    /**
     * Switch to a different algorithm for future evaluations
     */
    setDefaultAlgorithm(algorithmName) {
        const available = this.getAvailableAlgorithms();
        if (available.indexOf(algorithmName) == -1) {
            throw new Error(`Algorithm '${algorithmName}' not available for vector space type ${this._vectorSpace}`);
        }
        this.strategy.setDefaultAlgorithm(algorithmName);
    }
    moveControlPoint(index, displacement) {
        this._controlPolygon.moveControlPoint(index, displacement);
        this.strategy.invalidate();
    }
}
exports.OpenBSplineR1toRn = OpenBSplineR1toRn;
class AlgorithmRegistry {
    static register(descriptor) {
        if (!this.algorithms.has(descriptor.name)) {
            this.algorithms.set(descriptor.name, new Map());
        }
        const algorithmMap = this.algorithms.get(descriptor.name);
        descriptor.vectorSpaceTypes.forEach(vectorType => {
            algorithmMap.set(vectorType, descriptor.factory);
        });
    }
    static getFactory(algorithmName, vectorSpaceType) {
        var _a;
        return (_a = this.algorithms.get(algorithmName)) === null || _a === void 0 ? void 0 : _a.get(vectorSpaceType);
    }
    static getAvailableAlgorithms(vectorSpaceType) {
        const algorithms = [];
        this.algorithms.forEach((vectorSpaceMap, algorithmName) => {
            if (!vectorSpaceType || vectorSpaceMap.has(vectorSpaceType)) {
                algorithms.push(algorithmName);
            }
        });
        return algorithms;
    }
    static getDefaultAlgorithm(vectorSpaceType) {
        // Return first available algorithm or 'coxdeboor' as fallback
        const available = this.getAvailableAlgorithms(vectorSpaceType);
        return available.indexOf('coxdeboor') !== -1 ? 'coxdeboor' : available[0] || 'coxdeboor';
    }
}
exports.AlgorithmRegistry = AlgorithmRegistry;
AlgorithmRegistry.algorithms = new Map();
