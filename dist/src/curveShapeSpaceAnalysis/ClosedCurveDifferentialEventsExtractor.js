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
exports.ClosedCurveDifferentialEventsExtractor = void 0;
var PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
var SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var AbstractCurveDifferentialEventsExtractor_1 = require("./AbstractCurveDifferentialEventsExtractor");
var ClosedCurveDifferentialEventsExtractor = /** @class */ (function (_super) {
    __extends(ClosedCurveDifferentialEventsExtractor, _super);
    function ClosedCurveDifferentialEventsExtractor(curveToAnalyze) {
        var _this = _super.call(this, curveToAnalyze) || this;
        _this._inflectionParametricLocations = [];
        _this._curvatureExtremaParametricLocations = [];
        _this.curve = curveToAnalyze;
        _this._inflectionLocationsEuclideanSpace = [];
        _this._curvatureExtremaLocationsEuclideanSpace = [];
        _this._transientCurvatureExtremaLocationsEuclideanSpace = [];
        _this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(_this.curve);
        _this._curvatureNumerator = _this.curveDiffProperties.curvatureNumerator();
        _this._curvatureDerivativeNumerator = _this.curveDiffProperties.curvatureDerivativeNumerator();
        _this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        _this.extractSeqOfDiffEvents();
        return _this;
    }
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "curvatureNumerator", {
        get: function () {
            return this._curvatureNumerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "curvatureDerivativeNumerator", {
        get: function () {
            return this._curvatureDerivativeNumerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "inflectionLocationsEuclideanSpace", {
        get: function () {
            return this._inflectionLocationsEuclideanSpace;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "inflectionParametricLocations", {
        get: function () {
            return this._inflectionParametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "curvatureExtremaLocationsEuclideanSpace", {
        get: function () {
            return this._curvatureExtremaLocationsEuclideanSpace;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "curvatureExtremaParametricLocations", {
        get: function () {
            return this._curvatureExtremaParametricLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDifferentialEventsExtractor.prototype, "transientCurvatureExtremaLocationsEuclideanSpace", {
        get: function () {
            return this._transientCurvatureExtremaLocationsEuclideanSpace;
        },
        enumerable: false,
        configurable: true
    });
    ClosedCurveDifferentialEventsExtractor.prototype.extractSeqOfDiffEvents = function () {
        this._inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    };
    ClosedCurveDifferentialEventsExtractor.prototype.update = function (curveToAnalyze) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    };
    return ClosedCurveDifferentialEventsExtractor;
}(AbstractCurveDifferentialEventsExtractor_1.AbstractCurveDifferentialEventsExtractor));
exports.ClosedCurveDifferentialEventsExtractor = ClosedCurveDifferentialEventsExtractor;
