"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeNavigableCurve = exports.MAX_CLAMPED_POINTS = exports.NO_CONSTRAINT = void 0;
const CurveCategory_1 = require("./CurveCategory");
const CurveConstraints_1 = require("../curveShapeSpaceNavigation/CurveConstraints");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
exports.NO_CONSTRAINT = -1;
exports.MAX_CLAMPED_POINTS = 2;
class ShapeNavigableCurve {
    constructor() {
        this._clampedPoints = [];
        this._clampedPointsPreviousState = [];
        this.observers = [];
        this._curveShapeSpaceNavigator = undefined;
        // Initializes controlOfCurveClamping in accordance with the navigation mode:
        //      mode 0: controlOfCurveClamping =  false,
        //      mode 1, mode 2: controlOfCurveClamping = true
        this._controlOfCurveClamping = false;
        this._curveCategory = new CurveCategory_1.OpenPlanarCurve(this);
        this._curveCategory.curveModelChange = false;
        this._curveConstraints = new CurveConstraints_1.CurveConstraints(this);
        this._crvConstraintAtExtremitiesStgy = this._curveConstraints.curveConstraintStrategy;
        // No clamped point set to be consistent with the navigation mode at initialization
        this._clampedPoints.push(exports.NO_CONSTRAINT);
        this._clampedPoints.push(exports.NO_CONSTRAINT);
        this._clampedPointsPreviousState = this._clampedPoints;
    }
    changeCurveCategory(category) {
        this._curveCategory = category;
    }
    changeCurveConstraintStrategy(state) {
        this._crvConstraintAtExtremitiesStgy = state;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    get curveCategory() {
        return this._curveCategory;
    }
    get crvConstraintAtExtremitiesStgy() {
        return this._crvConstraintAtExtremitiesStgy;
    }
    get controlOfCurveClamping() {
        return this._controlOfCurveClamping;
    }
    get clampedPoints() {
        return this._clampedPoints;
    }
    get clampedPointsPreviousState() {
        return this._clampedPointsPreviousState;
    }
    get curveConstraints() {
        return this._curveConstraints;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    set clampedPoints(clampedPoints) {
        this._clampedPoints = clampedPoints;
    }
    set clampedPointsPreviousState(clampedPointsPreviousState) {
        this._clampedPointsPreviousState = clampedPointsPreviousState;
    }
    set controlOfCurveClamping(controlOfCurveClamping) {
        this._controlOfCurveClamping = controlOfCurveClamping;
    }
    inputSelectCurveCategory(crvCategoryID) {
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectCurveCategoryProcess", crvCategoryID.toString());
        warning.logMessage();
        switch (crvCategoryID) {
            case 0: {
                this._curveCategory.setNavigableCurveWithOpenPlanarCurve();
                break;
            }
            case 1: {
                this._curveCategory.setNavigableCurveWithClosedPlanarCurve();
                break;
            }
            default: {
                let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectCurveCategoryProcess", "no available curve category.");
                error.logMessage();
                break;
            }
        }
        this._curveCategory.curveModelChange = false;
    }
    /* JCL 2020/09/24 Monitor rigid body movements of the curve in accordance with the button status */
    toggleCurveClamping() {
        if (this._curveShapeSpaceNavigator == undefined
            || this._curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
            || this._curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toggleCurveClamping", "Cannot handle clamping because no curve shape space navigator is available or no shape constraint is active.");
            error.logMessage();
        }
        else {
            this._controlOfCurveClamping = !this._controlOfCurveClamping;
            console.log("control of curve clamping: " + this._controlOfCurveClamping);
            if (this._controlOfCurveClamping) {
                this._clampedPoints = this._clampedPointsPreviousState;
            }
            else {
                // Store the previous constraint state for restoration. Other actions take place when updating objects through observers
                this._clampedPointsPreviousState = this._clampedPoints;
            }
            this.notifyObservers();
        }
    }
    registerObserver(observer) {
        this.observers.push(observer);
        console.log("ShapeNavigableCurve: registerObs: " + observer.constructor.name);
    }
    removeObserver(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }
    notifyObservers() {
        for (let observer of this.observers) {
            console.log("ShapeNavigableCurve: update: " + observer.constructor.name);
            observer.update(this._curveCategory.curveModel);
        }
    }
    updateClampedPointsAfterKnotInsertion(knotParametricLocation) {
        const knots = this._curveCategory.curveModel.spline.getDistinctKnots();
        let i = 0;
        while (i < knots.length && knots[i] < knotParametricLocation) {
            i++;
        }
        const knotIndex = i;
        if (this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] === exports.NO_CONSTRAINT) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "updateClampedPointsAfterKnotInsertion", "No need to update clamped point indices.");
            warning.logMessage();
        }
        else if ((this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] !== exports.NO_CONSTRAINT)
            || (this._clampedPoints[0] !== exports.NO_CONSTRAINT && this._clampedPoints[1] === exports.NO_CONSTRAINT)) {
            if (this._clampedPoints[0] === exports.NO_CONSTRAINT && this._clampedPoints[1] >= knotIndex)
                this._clampedPoints[1] += 1;
            if (this._clampedPoints[1] === exports.NO_CONSTRAINT && this._clampedPoints[0] >= knotIndex)
                this._clampedPoints[0] += 1;
        }
        else {
            if (this._clampedPoints[0] >= knotIndex)
                this._clampedPoints[0] += 1;
            if (this._clampedPoints[1] >= knotIndex)
                this._clampedPoints[1] += 1;
        }
    }
}
exports.ShapeNavigableCurve = ShapeNavigableCurve;
