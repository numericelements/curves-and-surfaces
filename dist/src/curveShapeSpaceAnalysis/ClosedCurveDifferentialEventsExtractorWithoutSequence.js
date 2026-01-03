"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveDifferentialEventsExtractorWithoutSequence = void 0;
const PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const ClosedCurveDifferentialEventsExtractor_1 = require("./ClosedCurveDifferentialEventsExtractor");
class ClosedCurveDifferentialEventsExtractorWithoutSequence extends ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor {
    constructor(curveToAnalyze) {
        super(curveToAnalyze);
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }
    extractSeqOfDiffEvents() {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        return this._sequenceOfDifferentialEvents;
    }
    update(curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        // this.notifyObservers();
    }
}
exports.ClosedCurveDifferentialEventsExtractorWithoutSequence = ClosedCurveDifferentialEventsExtractorWithoutSequence;
