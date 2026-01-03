"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedPlanarCurve = exports.OpenPlanarCurve = exports.CurveCategory = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const CurveModel_1 = require("../newModels/CurveModel");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
const ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
class CurveCategory {
    constructor(shapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._degreeChange = false;
        this._curveModelChange = true;
    }
    setNavigableCurve(shapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get curveModel() {
        return this._curveModel;
    }
    get degreeChange() {
        return this._degreeChange;
    }
    get curveModelChange() {
        return this._curveModelChange;
    }
    get curveModelDifferentialEventsLocations() {
        return this._curveModelDifferentialEventsLocations;
    }
    set curveModelChange(curveModelChange) {
        this._curveModelChange = curveModelChange;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    set curveModelDifferentialEventsLocations(curveModelDifferentialEventsLocations) {
        this._curveModelDifferentialEventsLocations = curveModelDifferentialEventsLocations;
    }
    set degreeChange(degreeChange) {
        this._degreeChange = degreeChange;
    }
}
exports.CurveCategory = CurveCategory;
class OpenPlanarCurve extends CurveCategory {
    constructor(shapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new CurveModel_1.CurveModel();
        this._curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.notifyObservers();
    }
    get curveModelDifferentialEvents() {
        return this._curveModelDifferentialEvents;
    }
    set curveModelDifferentialEvents(curveModelDifferentialEvents) {
        this._curveModelDifferentialEvents = curveModelDifferentialEvents;
    }
    setCurveCategory() {
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    }
    setNavigableCurveWithOpenPlanarCurve() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'no curve model to change there.');
        warning.logMessage();
    }
    setNavigableCurveWithClosedPlanarCurve() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'change to closed planar curves.');
        warning.logMessage();
        this._shapeNavigableCurve.changeCurveCategory(new ClosedPlanarCurve(this._shapeNavigableCurve));
    }
    /* JCL 2020/10/07 Add the curve degree elevation process */
    inputSelectDegree(curveDegree) {
        if (this.curveModel !== undefined) {
            if (curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let spline = this.curveModel.spline;
                while (spline.degree !== curveDegree) {
                    let tempSpline = spline.degreeIncrement();
                    if (tempSpline !== undefined) {
                        spline = tempSpline.clone();
                    }
                    else {
                        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectDegree", "Curve degree increment has not been successful. Carry on with the initial curve");
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
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessage();
        }
    }
}
exports.OpenPlanarCurve = OpenPlanarCurve;
class ClosedPlanarCurve extends CurveCategory {
    constructor(shapeNavigableCurve) {
        super(shapeNavigableCurve);
        this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
        this._curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(this._curveModel.spline);
        this._curveModel.registerObserver(this._curveModelDifferentialEvents, "control points");
        this._curveModelDifferentialEventsLocations = this._curveModelDifferentialEvents.crvDiffEventsLocations;
        this._shapeNavigableCurve.changeCurveCategory(this);
        this._shapeNavigableCurve.notifyObservers();
    }
    get curveModelDifferentialEvents() {
        return this._curveModelDifferentialEvents;
    }
    set curveModelDifferentialEvents(curveModelDifferentialEvents) {
        this._curveModelDifferentialEvents = curveModelDifferentialEvents;
    }
    setCurveCategory() {
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    }
    setNavigableCurveWithOpenPlanarCurve() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithOpenPlanarCurve', 'change to open planar curves.');
        warning.logMessage();
        this._shapeNavigableCurve.changeCurveCategory(new OpenPlanarCurve(this._shapeNavigableCurve));
    }
    setNavigableCurveWithClosedPlanarCurve() {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'setModelerWithClosedPlanarCurve', 'no curve model to change there.');
        warning.logMessage();
    }
    inputSelectDegree(curveDegree) {
        if (this.curveModel !== undefined) {
            if (curveDegree > this.curveModel.spline.degree) {
                this._degreeChange = true;
                let spline = this.curveModel.spline;
                // this.curveModel.spline.elevateDegree(curveDegree - this.curveModel.spline.degree);
                while (spline.degree !== curveDegree) {
                    let tempSpline = spline.degreeIncrement();
                    if (tempSpline !== undefined) {
                        spline = tempSpline.clone();
                    }
                    else {
                        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectDegree", "Curve degree increment has not been successful. Carry on with the initial curve");
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
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectDegree", "Unable to assign a new degree to the curve. Undefined curve model.");
            error.logMessage();
        }
    }
}
exports.ClosedPlanarCurve = ClosedPlanarCurve;
