"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const file_saver_1 = require("file-saver");
class FileController {
    constructor(curveModeler, curveSceneController) {
        this.curveModeler = curveModeler;
        this._curveModel = curveModeler.curveCategory.curveModel;
        this._curveSceneController = curveSceneController;
    }
    get curveModel() {
        return this._curveModel;
    }
    /* JCL 2020/10/13 Add curve serialization to file */
    saveCurveToFile(currentFileName) {
        if (this._curveModel !== undefined) {
            const curveBlob = new Blob([JSON.stringify(this._curveModel.spline.knots) + JSON.stringify(this._curveModel.spline.controlPoints)], { type: "application/json", });
            (0, file_saver_1.saveAs)(curveBlob, currentFileName);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "saveCurveToFile", "Cannot save the current curve to a file. Undefined curve model.");
            error.logMessage();
        }
    }
    inconsistentFileFormatMessage() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "loadCurveFromFile", "inconsistent file format. Unable to load the curve.");
        warning.logMessage();
        return undefined;
    }
    loadCurveFromFile(aString) {
        const locationClosingBracket = aString.indexOf("]");
        if (locationClosingBracket <= 0)
            this.inconsistentFileFormatMessage();
        const knotVector = aString.slice(0, locationClosingBracket + 1);
        const knots = JSON.parse(knotVector);
        if (typeof (knots) !== "object" ||
            (typeof (knots) === "object" && typeof (knots[0]) !== "number"))
            this.inconsistentFileFormatMessage();
        const controlPointVector = aString.slice(locationClosingBracket + 1);
        const controlPoints = JSON.parse(controlPointVector);
        if (typeof (controlPoints) !== "object" ||
            (typeof (controlPoints) === "object" && typeof (controlPoints[0].x) !== "number"))
            this.inconsistentFileFormatMessage();
        let CPs = [];
        for (let cp of controlPoints) {
            CPs.push(new Vector2d_1.Vector2d(cp.x, cp.y));
        }
        const tmpSpline = (0, BSplineR1toR2_1.create_BSplineR1toR2V2d)(CPs, knots);
        return tmpSpline;
    }
    resetCurveContext(knots, controlPoints) {
        const newSpline = (0, BSplineR1toR2_1.create_BSplineR1toR2V2d)(controlPoints, knots);
        if (this._curveModel !== undefined) {
            this._curveModel.setSpline(newSpline);
            this.curveModeler.notifyObservers();
            this._curveSceneController.curveModel = this._curveModel;
            this._curveSceneController.initCurveSceneView();
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "resetCurveContext", "Cannot load the current file content into a curve model. Undefined curve model.");
            error.logMessage();
        }
    }
}
exports.FileController = FileController;
