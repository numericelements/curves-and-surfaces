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
exports.ClosedCurveDummyAnalyzer = exports.ClosedCurveAnalyzer = exports.OPenCurveDummyAnalyzer = exports.OpenCurveAnalyzer = exports.AbstractCurveAnalyzer = void 0;
var SequenceOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var OpenCurveDifferentialEventsExtractor_1 = require("./OpenCurveDifferentialEventsExtractor");
var ExtremumLocationClassifiier_1 = require("./ExtremumLocationClassifiier");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveDifferentialEventsExtractor_1 = require("./ClosedCurveDifferentialEventsExtractor");
var OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("./OpenCurveDifferentialEventsExtractorWithoutSequence");
var ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("./ClosedCurveDifferentialEventsExtractorWithoutSequence");
var BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
var AbstractCurveAnalyzer = /** @class */ (function () {
    function AbstractCurveAnalyzer(curveToAnalyze, navigationCurveModel) {
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._curveCurvatureCntrlPolygon = [];
        this._curvatureCrtlPtsClosestToZero = [];
        this._curvatureSignChanges = [];
        this._curvatureDerivativeSignChanges = [];
        this._curveCurvatureDerivativeCntrlPolygon = [];
        this._curvatureDerivCrtlPtsClosestToZero = [];
    }
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureSignChanges", {
        get: function () {
            return this._curvatureSignChanges.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curveCurvatureCntrlPolygon", {
        get: function () {
            return this._curveCurvatureCntrlPolygon.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureCrtlPtsClosestToZero", {
        get: function () {
            return this._curvatureCrtlPtsClosestToZero.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureDerivativeSignChanges", {
        get: function () {
            return this._curvatureDerivativeSignChanges.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curveCurvatureDerivativeCntrlPolygon", {
        get: function () {
            return this._curveCurvatureDerivativeCntrlPolygon.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureDerivCrtlPtsClosestToZero", {
        get: function () {
            return this._curvatureDerivCrtlPtsClosestToZero.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureNumerator", {
        get: function () {
            return this._curvatureNumerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveAnalyzer.prototype, "curvatureDerivativeNumerator", {
        get: function () {
            return this._curvatureDerivativeNumerator;
        },
        enumerable: false,
        configurable: true
    });
    AbstractCurveAnalyzer.prototype.getGlobalExtremmumOffAxis = function (controlPoints) {
        var localMinima = new ExtremumLocationClassifiier_1.ExtremumLocationClassifier(controlPoints);
        var validGlobalMinimum = localMinima.getGlobalMinimum();
        var localMaxima = new ExtremumLocationClassifiier_1.ExtremumLocationClassifier(controlPoints);
        var validGlobalMaximum = localMaxima.getGlobalMaximum();
        if (validGlobalMinimum && validGlobalMaximum && Math.abs(localMinima.globalExtremum.value) > Math.abs(localMaxima.globalExtremum.value)) {
            return localMaxima.globalExtremum;
        }
        else if (validGlobalMinimum && validGlobalMaximum) {
            return localMinima.globalExtremum;
        }
        else if (validGlobalMinimum) {
            return localMinima.globalExtremum;
        }
        else if (validGlobalMaximum) {
            return localMaxima.globalExtremum;
        }
        else
            return { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
    };
    AbstractCurveAnalyzer.prototype.getControlPointsSign = function (controlPoints) {
        var result = [];
        for (var i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    };
    AbstractCurveAnalyzer.prototype.getSignChangesControlPolygon = function (controlPointsSigns) {
        var signChangesControlPolygon = [];
        var previousSign = controlPointsSigns[0];
        for (var i = 1, n = controlPointsSigns.length; i < n; i += 1) {
            if (previousSign !== controlPointsSigns[i]) {
                signChangesControlPolygon.push(i - 1);
            }
            previousSign = controlPointsSigns[i];
        }
        return signChangesControlPolygon;
    };
    AbstractCurveAnalyzer.prototype.updateCurrent = function () {
        this.curve = this.navigationCurveModel.currentCurve;
        this.update();
    };
    AbstractCurveAnalyzer.prototype.updateOptimized = function () {
        this.curve = this.navigationCurveModel.optimizedCurve;
        this.update();
    };
    return AbstractCurveAnalyzer;
}());
exports.AbstractCurveAnalyzer = AbstractCurveAnalyzer;
var OpenCurveAnalyzer = /** @class */ (function (_super) {
    __extends(OpenCurveAnalyzer, _super);
    function OpenCurveAnalyzer(curveToAnalyze, navigationCurveModel, slidingEventsAtExtremities) {
        var _this = _super.call(this, curveToAnalyze, navigationCurveModel) || this;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        _this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this.curve = curveToAnalyze;
        _this.navigationCurveModel = navigationCurveModel;
        _this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        _this.navigationState = navigationCurveModel.navigationState;
        _this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        _this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        var diffEventsExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(_this.curve);
        _this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        _this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (_this._curveControlState) {
            _this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
            _this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            _this.globalExtremumOffAxisCurvaturePoly = _this.getGlobalExtremmumOffAxis(_this._curveCurvatureCntrlPolygon);
            _this._curvatureSignChanges = _this.getSignChangesControlPolygon(_this._curveCurvatureCntrlPolygon);
            _this.computeCurvatureCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessage();
        }
        _this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (_this._curveControlState) {
            _this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
            _this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            _this.globalExtremumOffAxisCurvatureDerivPoly = _this.getGlobalExtremmumOffAxis(_this._curveCurvatureDerivativeCntrlPolygon);
            _this._curvatureDerivativeSignChanges = _this.getSignChangesControlPolygon(_this._curveCurvatureDerivativeCntrlPolygon);
            _this.computeCurvatureDerivCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Cannot initialize consistently curvature deriv control polygon.');
            warning.logMessage();
        }
        return _this;
    }
    Object.defineProperty(OpenCurveAnalyzer.prototype, "sequenceOfDifferentialEvents", {
        get: function () {
            return SequenceOfDifferentialEvents_1.deepCopySequenceOfDifferentialEvents(this._sequenceOfDifferentialEvents);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveAnalyzer.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveAnalyzer.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenCurveAnalyzer.prototype, "slidingEventsAtExtremities", {
        get: function () {
            return this._slidingEventsAtExtremities;
        },
        set: function (slidingEventsAtExtremities) {
            this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        },
        enumerable: false,
        configurable: true
    });
    OpenCurveAnalyzer.prototype.setStrategyForSlidingEventsAtExtremitities = function (slidingEventsAtExtremities) {
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    };
    OpenCurveAnalyzer.prototype.computeCurvatureCPClosestToZero = function () {
        this._slidingEventsAtExtremities.getCurvatureCrtlPtsClosestToZero(this);
    };
    OpenCurveAnalyzer.prototype.computeCurvatureDerivCPClosestToZero = function () {
        this._slidingEventsAtExtremities.getCurvatureDerivCrtlPtsClosestToZero(this);
    };
    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }
    OpenCurveAnalyzer.prototype.update = function () {
        // this.curve = this.navigationCurveModel.currentCurve;
        var diffEventsExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    };
    return OpenCurveAnalyzer;
}(AbstractCurveAnalyzer));
exports.OpenCurveAnalyzer = OpenCurveAnalyzer;
var OPenCurveDummyAnalyzer = /** @class */ (function (_super) {
    __extends(OPenCurveDummyAnalyzer, _super);
    function OPenCurveDummyAnalyzer(curveToAnalyze, navigationCurveModel, slidingEventsAtExtremities) {
        var _this = _super.call(this, curveToAnalyze, navigationCurveModel) || this;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        _this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this.curve = curveToAnalyze;
        _this.navigationCurveModel = navigationCurveModel;
        _this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        _this.navigationState = navigationCurveModel.navigationState;
        _this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        _this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        var diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(_this.curve);
        _this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        _this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        _this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        return _this;
    }
    Object.defineProperty(OPenCurveDummyAnalyzer.prototype, "sequenceOfDifferentialEvents", {
        get: function () {
            return this._sequenceOfDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OPenCurveDummyAnalyzer.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OPenCurveDummyAnalyzer.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    OPenCurveDummyAnalyzer.prototype.computeCurvatureCPClosestToZero = function () {
    };
    OPenCurveDummyAnalyzer.prototype.computeCurvatureDerivCPClosestToZero = function () {
    };
    OPenCurveDummyAnalyzer.prototype.update = function () {
        // this.curve = this.navigationCurveModel.currentCurve;
        var diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    };
    return OPenCurveDummyAnalyzer;
}(AbstractCurveAnalyzer));
exports.OPenCurveDummyAnalyzer = OPenCurveDummyAnalyzer;
var ClosedCurveAnalyzer = /** @class */ (function (_super) {
    __extends(ClosedCurveAnalyzer, _super);
    function ClosedCurveAnalyzer(curveToAnalyze, navigationCurveModel) {
        var _this = _super.call(this, curveToAnalyze, navigationCurveModel) || this;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        _this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this.curve = curveToAnalyze;
        _this.navigationCurveModel = navigationCurveModel;
        _this.navigationState = navigationCurveModel.navigationState;
        _this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        _this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        var diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(_this.curve);
        _this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        _this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (_this._curveControlState) {
            _this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            _this.globalExtremumOffAxisCurvaturePoly = _this.getGlobalExtremmumOffAxis(_this._curveCurvatureCntrlPolygon);
            _this._curvatureSignChanges = _this.getSignChangesControlPolygon(_this._curveCurvatureCntrlPolygon);
            _this.computeCurvatureCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessage();
        }
        _this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (_this._curveControlState) {
            _this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            _this.globalExtremumOffAxisCurvatureDerivPoly = _this.getGlobalExtremmumOffAxis(_this._curveCurvatureDerivativeCntrlPolygon);
            _this._curvatureDerivativeSignChanges = _this.getSignChangesControlPolygon(_this._curveCurvatureDerivativeCntrlPolygon);
            _this.computeCurvatureDerivCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'Cannot initialize consistently curvature deriv control polygon.');
            warning.logMessage();
        }
        return _this;
    }
    Object.defineProperty(ClosedCurveAnalyzer.prototype, "sequenceOfDifferentialEvents", {
        get: function () {
            return this._sequenceOfDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveAnalyzer.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveAnalyzer.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }
    ClosedCurveAnalyzer.prototype.computeCurvatureCPClosestToZero = function () {
    };
    ClosedCurveAnalyzer.prototype.computeCurvatureDerivCPClosestToZero = function () {
    };
    ClosedCurveAnalyzer.prototype.update = function () {
        // this.curve = this.navigationCurveModel.currentCurve;
        var diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    };
    return ClosedCurveAnalyzer;
}(AbstractCurveAnalyzer));
exports.ClosedCurveAnalyzer = ClosedCurveAnalyzer;
var ClosedCurveDummyAnalyzer = /** @class */ (function (_super) {
    __extends(ClosedCurveDummyAnalyzer, _super);
    function ClosedCurveDummyAnalyzer(curveToAnalyze, navigationCurveModel) {
        var _this = _super.call(this, curveToAnalyze, navigationCurveModel) || this;
        var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        _this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        _this.curve = curveToAnalyze;
        _this.navigationCurveModel = navigationCurveModel;
        _this.navigationState = navigationCurveModel.navigationState;
        _this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        _this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        _this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        var diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(_this.curve);
        _this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        _this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        return _this;
    }
    Object.defineProperty(ClosedCurveDummyAnalyzer.prototype, "sequenceOfDifferentialEvents", {
        get: function () {
            return this._sequenceOfDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDummyAnalyzer.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveDummyAnalyzer.prototype, "shapeSpaceDescriptor", {
        get: function () {
            return this._shapeSpaceDescriptor;
        },
        enumerable: false,
        configurable: true
    });
    ClosedCurveDummyAnalyzer.prototype.computeCurvatureCPClosestToZero = function () {
    };
    ClosedCurveDummyAnalyzer.prototype.computeCurvatureDerivCPClosestToZero = function () {
    };
    ClosedCurveDummyAnalyzer.prototype.update = function () {
        // this.curve = this.navigationCurveModel.currentCurve;
        var diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    };
    return ClosedCurveDummyAnalyzer;
}(AbstractCurveAnalyzer));
exports.ClosedCurveDummyAnalyzer = ClosedCurveDummyAnalyzer;
