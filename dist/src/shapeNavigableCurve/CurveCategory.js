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
exports.ClosedPlanarCurve = exports.OpenPlanarCurve = exports.CurveCategory = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var CurveModel_1 = require("../newModels/CurveModel");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
var ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
var CurveCategory = /** @class */ (function () {
    function CurveCategory(shapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._degreeChange = false;
        this._curveModelChange = true;
    }
    CurveCategory.prototype.setNavigableCurve = function (shapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
    };
    Object.defineProperty(CurveCategory.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveCategory.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveCategory.prototype, "degreeChange", {
        get: function () {
            return this._degreeChange;
        },
        set: function (degreeChange) {
            this._degreeChange = degreeChange;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveCategory.prototype, "curveModelChange", {
        get: function () {
            return this._curveModelChange;
        },
        set: function (curveModelChange) {
            this._curveModelChange = curveModelChange;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveCategory.prototype, "curveModelDifferentialEventsLocations", {
        get: function () {
            return this._curveModelDifferentialEventsLocations;
        },
        set: function (curveModelDifferentialEventsLocations) {
            this._curveModelDifferentialEventsLocations = curveModelDifferentialEventsLocations;
        },
        enumerable: false,
        configurable: true
    });
    return CurveCategory;
}());
exports.CurveCategory = CurveCategory;
var OpenPlanarCurve = /** @class */ (function (_super) {
    __extends(OpenPlanarCurve, _super);
    function OpenPlanarCurve(shapeNavigableCurve) {
        var _this = _super.call(this, shapeNavigableCurve) || this;
        _this._curveModel = new CurveModel_1.CurveModel();
        _this._curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(_this._curveModel.spline);
        _this._curveModel.registerObserver(_this._curveModelDifferentialEvents, "control points");
        _this._curveModelDifferentialEventsLocations = _this._curveModelDifferentialEvents.crvDiffEventsLocations;
        _this._shapeNavigableCurve.changeCurveCategory(_this);
        _this._shapeNavigableCurve.notifyObservers();
        return _this;
    }
    Object.defineProperty(OpenPlanarCurve.prototype, "curveModelDifferentialEvents", {
        get: function () {
            return this._curveModelDifferentialEvents;
        },
        set: function (curveModelDifferentialEvents) {
            this._curveModelDifferentialEvents = curveModelDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    OpenPlanarCurve.prototype.setCurveCategory = function () {
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    };
    OpenPlanarCurve.prototype.setNavigableCurveWithOpenPlanarCurve = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessage();
    };
    OpenPlanarCurve.prototype.setNavigableCurveWithClosedPlanarCurve = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessage();
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    };
    /* JCL 2020/10/07 Add the curve degree elevation process */
    OpenPlanarCurve.prototype.inputSelectDegree = function (curveDegree) {
        if (this.curveModel !== undefined) {
            if (curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                var spline = this.curveModel.spline;
                while (spline.degree !== curveDegree) {
                    var tempSpline = spline.degreeIncrement();
                    if (tempSpline !== undefined) {
                        spline = tempSpline.clone();
                    }
                    else {
                        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectDegree", "Curve degree increment has not been successful. Carry on with the initial curve");
                        warning.logMessage();
                    }
                }
                this.curveModel.setSpline(spline);
            }
            this.curveModel.notifyObservers();
            this._shapeNavigableCurve.notifyObservers();
            this._degreeChange = false;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessage();
        }
    };
    return OpenPlanarCurve;
}(CurveCategory));
exports.OpenPlanarCurve = OpenPlanarCurve;
var ClosedPlanarCurve = /** @class */ (function (_super) {
    __extends(ClosedPlanarCurve, _super);
    function ClosedPlanarCurve(shapeNavigableCurve) {
        var _this = _super.call(this, shapeNavigableCurve) || this;
        _this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
        _this._curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(_this._curveModel.spline);
        _this._curveModel.registerObserver(_this._curveModelDifferentialEvents, "control points");
        _this._curveModelDifferentialEventsLocations = _this._curveModelDifferentialEvents.crvDiffEventsLocations;
        _this._shapeNavigableCurve.changeCurveCategory(_this);
        _this._shapeNavigableCurve.notifyObservers();
        return _this;
    }
    Object.defineProperty(ClosedPlanarCurve.prototype, "curveModelDifferentialEvents", {
        get: function () {
            return this._curveModelDifferentialEvents;
        },
        set: function (curveModelDifferentialEvents) {
            this._curveModelDifferentialEvents = curveModelDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    ClosedPlanarCurve.prototype.setCurveCategory = function () {
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    };
    ClosedPlanarCurve.prototype.setNavigableCurveWithOpenPlanarCurve = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessage();
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    };
    ClosedPlanarCurve.prototype.setNavigableCurveWithClosedPlanarCurve = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessage();
    };
    ClosedPlanarCurve.prototype.inputSelectDegree = function (curveDegree) {
        if (this.curveModel !== undefined) {
            if (curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                var spline = this.curveModel.spline;
                // this.curveModel.spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
                while (spline.degree !== curveDegree) {
                    var tempSpline = spline.degreeIncrement();
                    if (tempSpline !== undefined) {
                        spline = tempSpline.clone();
                    }
                    else {
                        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectDegree", "Curve degree increment has not been successful. Carry on with the initial curve");
                        warning.logMessage();
                    }
                }
                this.curveModel.setSpline(spline);
            }
            this.curveModel.notifyObservers();
            this._shapeNavigableCurve.notifyObservers();
            this._degreeChange = false;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessage();
        }
    };
    return ClosedPlanarCurve;
}(CurveCategory));
exports.ClosedPlanarCurve = ClosedPlanarCurve;
