"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var file_saver_1 = require("file-saver");
var FileController = /** @class */ (function () {
    function FileController(curveModeler, curveSceneController) {
        this.curveModeler = curveModeler;
        this._curveModel = curveModeler.curveCategory.curveModel;
        this._curveSceneController = curveSceneController;
    }
    Object.defineProperty(FileController.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        enumerable: false,
        configurable: true
    });
    /* JCL 2020/10/13 Add curve serialization to file */
    FileController.prototype.saveCurveToFile = function (currentFileName) {
        if (this._curveModel !== undefined) {
            var curveBlob = new Blob([JSON.stringify(this._curveModel.spline.knots) + JSON.stringify(this._curveModel.spline.controlPoints)], { type: "application/json", });
            file_saver_1.saveAs(curveBlob, currentFileName);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "saveCurveToFile", "Cannot save the current curve to a file. Undefined curve model.");
            error.logMessage();
        }
    };
    FileController.prototype.inconsistentFileFormatMessage = function () {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "loadCurveFromFile", "inconsistent file format. Unable to load the curve.");
        warning.logMessage();
        return undefined;
    };
    FileController.prototype.loadCurveFromFile = function (aString) {
        var e_1, _a;
        var locationClosingBracket = aString.indexOf("]");
        if (locationClosingBracket <= 0)
            this.inconsistentFileFormatMessage();
        var knotVector = aString.slice(0, locationClosingBracket + 1);
        var knots = JSON.parse(knotVector);
        if (typeof (knots) !== "object" ||
            (typeof (knots) === "object" && typeof (knots[0]) !== "number"))
            this.inconsistentFileFormatMessage();
        var controlPointVector = aString.slice(locationClosingBracket + 1);
        var controlPoints = JSON.parse(controlPointVector);
        if (typeof (controlPoints) !== "object" ||
            (typeof (controlPoints) === "object" && typeof (controlPoints[0].x) !== "number"))
            this.inconsistentFileFormatMessage();
        var CPs = [];
        try {
            for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
                var cp = controlPoints_1_1.value;
                CPs.push(new Vector2d_1.Vector2d(cp.x, cp.y));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var tmpSpline = BSplineR1toR2_1.create_BSplineR1toR2V2d(CPs, knots);
        return tmpSpline;
    };
    FileController.prototype.resetCurveContext = function (knots, controlPoints) {
        var newSpline = BSplineR1toR2_1.create_BSplineR1toR2V2d(controlPoints, knots);
        if (this._curveModel !== undefined) {
            this._curveModel.setSpline(newSpline);
            this.curveModeler.notifyObservers();
            this._curveSceneController.curveModel = this._curveModel;
            this._curveSceneController.initCurveSceneView();
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "resetCurveContext", "Cannot load the current file content into a curve model. Undefined curve model.");
            error.logMessage();
        }
    };
    return FileController;
}());
exports.FileController = FileController;
