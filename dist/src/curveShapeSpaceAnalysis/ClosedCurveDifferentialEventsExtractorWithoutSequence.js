"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveDifferentialEventsExtractorWithoutSequence = void 0;
var PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
var SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var ClosedCurveDifferentialEventsExtractor_1 = require("./ClosedCurveDifferentialEventsExtractor");
var ClosedCurveDifferentialEventsExtractorWithoutSequence = /** @class */ (function (_super) {
    __extends(ClosedCurveDifferentialEventsExtractorWithoutSequence, _super);
    function ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze) {
        var _this = _super.call(this, curveToAnalyze) || this;
        _this.curve = curveToAnalyze;
        _this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        _this.extractSeqOfDiffEvents();
        _this.notifyObservers();
        return _this;
    }
    ClosedCurveDifferentialEventsExtractorWithoutSequence.prototype.extractSeqOfDiffEvents = function () {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        return this._sequenceOfDifferentialEvents;
    };
    ClosedCurveDifferentialEventsExtractorWithoutSequence.prototype.update = function (curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        // this.notifyObservers();
    };
    return ClosedCurveDifferentialEventsExtractorWithoutSequence;
}(ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor));
exports.ClosedCurveDifferentialEventsExtractorWithoutSequence = ClosedCurveDifferentialEventsExtractorWithoutSequence;
