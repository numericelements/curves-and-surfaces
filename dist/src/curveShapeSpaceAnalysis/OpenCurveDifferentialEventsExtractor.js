"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCurveDifferentialEventsExtractor = void 0;
const BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const AbstractCurveDifferentialEventsExtractor_1 = require("./AbstractCurveDifferentialEventsExtractor");
class OpenCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor_1.AbstractCurveDifferentialEventsExtractor {
    constructor(curveToAnalyze) {
        super(curveToAnalyze);
        this._inflectionParametricLocations = [];
        this._curvatureNumeratorExtremaEstimators = [];
        this._curvatureExtremaParametricLocations = [];
        this._curvatureDerivativeNumeratorExtremaEstimators = [];
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }
    get curvatureNumerator() {
        return this._curvatureNumerator;
    }
    get curvatureDerivativeNumerator() {
        return this._curvatureDerivativeNumerator;
    }
    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }
    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }
    get curvatureNumeratorExtremaEstimators() {
        return this._curvatureNumeratorExtremaEstimators;
    }
    get curvatureDerivativeNumeratorExtremaEstimators() {
        return this._curvatureDerivativeNumeratorExtremaEstimators;
    }
    extractSeqOfDiffEvents() {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this.extractInflectionEstimators();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    }
    extractInflectionEstimators() {
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL));
        for (let i = 0; i < (this._inflectionParametricLocations.length - 1); i++) {
            const midAbscissa = this._inflectionParametricLocations[i + 1] - this._inflectionParametricLocations[i];
            this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(midAbscissa));
        }
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL));
    }
    extractCurvatureExtremaExtimators() {
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL));
        for (let i = 0; i < (this._curvatureExtremaParametricLocations.length - 1); i++) {
            const midAbscissa = this._curvatureExtremaParametricLocations[i + 1] - this._curvatureExtremaParametricLocations[i];
            this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(midAbscissa));
        }
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL));
    }
    update(curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }
}
exports.OpenCurveDifferentialEventsExtractor = OpenCurveDifferentialEventsExtractor;
