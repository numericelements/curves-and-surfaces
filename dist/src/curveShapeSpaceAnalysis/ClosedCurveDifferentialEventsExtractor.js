"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveDifferentialEventsExtractor = void 0;
const PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const AbstractCurveDifferentialEventsExtractor_1 = require("./AbstractCurveDifferentialEventsExtractor");
class ClosedCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor_1.AbstractCurveDifferentialEventsExtractor {
    constructor(curveToAnalyze) {
        super(curveToAnalyze);
        this._inflectionParametricLocations = [];
        this._curvatureExtremaParametricLocations = [];
        this.curve = curveToAnalyze;
        this._inflectionLocationsEuclideanSpace = [];
        this._curvatureExtremaLocationsEuclideanSpace = [];
        this._transientCurvatureExtremaLocationsEuclideanSpace = [];
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        this.extractSeqOfDiffEvents();
    }
    get curvatureNumerator() {
        return this._curvatureNumerator;
    }
    get curvatureDerivativeNumerator() {
        return this._curvatureDerivativeNumerator;
    }
    get inflectionLocationsEuclideanSpace() {
        return this._inflectionLocationsEuclideanSpace;
    }
    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }
    get curvatureExtremaLocationsEuclideanSpace() {
        return this._curvatureExtremaLocationsEuclideanSpace;
    }
    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }
    get transientCurvatureExtremaLocationsEuclideanSpace() {
        return this._transientCurvatureExtremaLocationsEuclideanSpace;
    }
    extractSeqOfDiffEvents() {
        this._inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    }
    update(curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    }
}
exports.ClosedCurveDifferentialEventsExtractor = ClosedCurveDifferentialEventsExtractor;
