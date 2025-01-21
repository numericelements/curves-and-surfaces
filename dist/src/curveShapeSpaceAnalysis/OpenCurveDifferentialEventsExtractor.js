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
exports.OpenCurveDifferentialEventsExtractor = void 0;
var BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var AbstractCurveDifferentialEventsExtractor_1 = require("./AbstractCurveDifferentialEventsExtractor");
var OpenCurveDifferentialEventsExtractor = /** @class */ (function (_super) {
    __extends(OpenCurveDifferentialEventsExtractor, _super);
    function OpenCurveDifferentialEventsExtractor(curveToAnalyze) {
        var _this = _super.call(this, curveToAnalyze) || this;
        _this._inflectionParametricLocations = [];
        _this._curvatureNumeratorExtremaEstimators = [];
        _this._curvatureExtremaParametricLocations = [];
        _this._curvatureDerivativeNumeratorExtremaEstimators = [];
        _this.curve = curveToAnalyze;
        _this.curveDiffProperties = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(_this.curve);
        _this._curvatureNumerator = _this.curveDiffProperties.curvatureNumerator();
        _this._curvatureDerivativeNumerator = _this.curveDiffProperties.curvatureDerivativeNumerator();
        _this.extractSeqOfDiffEvents();
        _this.notifyObservers();
        return _this;
    }
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "curvatureNumerator", {
        get: function () {
            return this._curvatureNumerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "curvatureDerivativeNumerator", {
        get: function () {
            return this._curvatureDerivativeNumerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "inflectionParametricLocations", {
        get: function () {
            return this._inflectionParametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "curvatureExtremaParametricLocations", {
        get: function () {
            return this._curvatureExtremaParametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "curvatureNumeratorExtremaEstimators", {
        get: function () {
            return this._curvatureNumeratorExtremaEstimators;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveDifferentialEventsExtractor.prototype, "curvatureDerivativeNumeratorExtremaEstimators", {
        get: function () {
            return this._curvatureDerivativeNumeratorExtremaEstimators;
        },
        enumerable: false,
        configurable: true
    });
    OpenCurveDifferentialEventsExtractor.prototype.extractSeqOfDiffEvents = function () {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this.extractInflectionEstimators();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    };
    OpenCurveDifferentialEventsExtractor.prototype.extractInflectionEstimators = function () {
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL));
        for (var i = 0; i < (this._inflectionParametricLocations.length - 1); i++) {
            var midAbscissa = this._inflectionParametricLocations[i + 1] - this._inflectionParametricLocations[i];
            this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(midAbscissa));
        }
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL));
    };
    OpenCurveDifferentialEventsExtractor.prototype.extractCurvatureExtremaExtimators = function () {
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL));
        for (var i = 0; i < (this._curvatureExtremaParametricLocations.length - 1); i++) {
            var midAbscissa = this._curvatureExtremaParametricLocations[i + 1] - this._curvatureExtremaParametricLocations[i];
            this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(midAbscissa));
        }
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL));
    };
    OpenCurveDifferentialEventsExtractor.prototype.update = function (curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    };
    return OpenCurveDifferentialEventsExtractor;
}(AbstractCurveDifferentialEventsExtractor_1.AbstractCurveDifferentialEventsExtractor));
exports.OpenCurveDifferentialEventsExtractor = OpenCurveDifferentialEventsExtractor;
