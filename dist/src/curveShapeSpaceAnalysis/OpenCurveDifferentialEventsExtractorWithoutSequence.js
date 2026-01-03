"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCurveDifferentialEventsExtractorWithoutSequence = void 0;
const BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const OpenCurveDifferentialEventsExtractor_1 = require("./OpenCurveDifferentialEventsExtractor");
class OpenCurveDifferentialEventsExtractorWithoutSequence extends OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor {
    constructor(curveToAnalyze) {
        super(curveToAnalyze);
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
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }
}
exports.OpenCurveDifferentialEventsExtractorWithoutSequence = OpenCurveDifferentialEventsExtractorWithoutSequence;
