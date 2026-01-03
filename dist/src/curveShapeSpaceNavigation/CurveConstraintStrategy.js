"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveConstraintClampedFirstAndLastControlPoint = exports.CurveConstraintClampedLastControlPoint = exports.CurveConstraintClampedFirstControlPoint = exports.CurveConstraintNoConstraint = exports.CurveConstraintStrategy = exports.TOL_LOCATION_CURVE_REFERENCE_POINTS = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const CurveConstraints_1 = require("./CurveConstraints");
const SquareMatrix_1 = require("../linearAlgebra/SquareMatrix");
const AbstractBSplineR1toR2_1 = require("../newBsplines/AbstractBSplineR1toR2");
exports.TOL_LOCATION_CURVE_REFERENCE_POINTS = 1.0E-6;
class CurveConstraintStrategy {
    constructor(curveConstraints) {
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this._currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this._constraintsNotSatisfied = false;
    }
    get constraintsNotSatisfied() {
        return this._constraintsNotSatisfied;
    }
    get currentCurve() {
        return this._currentCurve.clone();
    }
    get optimizedCurve() {
        return this._optimizedCurve.clone();
    }
    set optimizedCurve(optimizedCurve) {
        this._optimizedCurve = optimizedCurve.clone();
    }
    set currentCurve(currentCurve) {
        this._currentCurve = currentCurve.clone();
    }
}
exports.CurveConstraintStrategy = CurveConstraintStrategy;
class CurveConstraintNoConstraint extends CurveConstraintStrategy {
    constructor(curveConstraints) {
        super(curveConstraints);
        if (this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = CurveConstraints_1.ConstraintType.none;
        this._lastControlPoint = CurveConstraints_1.ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if (this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessage();
    }
    get firstControlPoint() {
        return this._firstControlPoint;
    }
    get lastControlPoint() {
        return this._lastControlPoint;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    updateCurve() {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    }
    locateCurveExtremityUnderConstraint(curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.none
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.none) {
            this.updateCurve();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    }
}
exports.CurveConstraintNoConstraint = CurveConstraintNoConstraint;
class CurveConstraintClampedFirstControlPoint extends CurveConstraintStrategy {
    constructor(curveConstraints) {
        var _a, _b;
        super(curveConstraints);
        if (this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = CurveConstraints_1.ConstraintType.location;
        this._lastControlPoint = CurveConstraints_1.ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if (this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = (_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this.displacementCurrentCurveControlPolygon = (_b = this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessage();
    }
    get firstControlPoint() {
        return this._firstControlPoint;
    }
    get lastControlPoint() {
        return this._lastControlPoint;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    set referencePtIndex(referencePtIndex) {
        this._referencePtIndex = referencePtIndex;
    }
    updateCurve() {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    }
    relocateCurveAfterOptimization() {
        this.updateCurve();
        let controlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._optimizedCurve.controlPoints);
        if (this._curveShapeSpaceNavigator !== undefined
            && this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            for (let controlP of controlPoints) {
                controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
                controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    }
    relocateCurveAfterOptimizationUsingKnotPts() {
        this.updateCurve();
        const knots = this.optimizedCurve.getDistinctKnots();
        const refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        let controlPoints = this._optimizedCurve.controlPoints;
        if (this._curveShapeSpaceNavigator !== undefined) {
            const displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            for (let controlP of controlPoints) {
                controlP.x -= displacement.x;
                controlP.y -= displacement.y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    }
    locateCurveExtremityUnderConstraint(curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.location
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.none) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    }
}
exports.CurveConstraintClampedFirstControlPoint = CurveConstraintClampedFirstControlPoint;
class CurveConstraintClampedLastControlPoint extends CurveConstraintStrategy {
    constructor(curveConstraints) {
        var _a, _b;
        super(curveConstraints);
        if (this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = CurveConstraints_1.ConstraintType.none;
        this._lastControlPoint = CurveConstraints_1.ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if (this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = (_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[1];
        this.displacementCurrentCurveControlPolygon = (_b = this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessage();
    }
    get firstControlPoint() {
        return this._firstControlPoint;
    }
    get lastControlPoint() {
        return this._lastControlPoint;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    set referencePtIndex(referencePtIndex) {
        this._referencePtIndex = referencePtIndex;
    }
    updateCurve() {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    }
    relocateCurveAfterOptimization() {
        this.updateCurve();
        let controlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._optimizedCurve.controlPoints);
        if (this._curveShapeSpaceNavigator !== undefined &&
            this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            for (let controlP of controlPoints) {
                controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    }
    relocateCurveAfterOptimizationUsingKnotPts() {
        this.updateCurve();
        const knots = this.optimizedCurve.getDistinctKnots();
        const refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        let controlPoints = this._optimizedCurve.controlPoints;
        if (this._curveShapeSpaceNavigator !== undefined) {
            const displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            for (let controlP of controlPoints) {
                controlP.x -= displacement.x;
                controlP.y -= displacement.y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    }
    locateCurveExtremityUnderConstraint(curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.none
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.location) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    }
}
exports.CurveConstraintClampedLastControlPoint = CurveConstraintClampedLastControlPoint;
class CurveConstraintClampedFirstAndLastControlPoint extends CurveConstraintStrategy {
    constructor(curveConstraints) {
        var _a, _b;
        super(curveConstraints);
        if (this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        }
        else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = CurveConstraints_1.ConstraintType.location;
        this._lastControlPoint = CurveConstraints_1.ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if (this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = (_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationCurveModel.optimizedCurve;
        }
        else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this._currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this.displacementCurrentCurveControlPolygon = (_b = this.curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessage();
    }
    get firstControlPoint() {
        return this._firstControlPoint;
    }
    get lastControlPoint() {
        return this._lastControlPoint;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    set referencePtIndex(referencePtIndex) {
        this._referencePtIndex = referencePtIndex;
    }
    updateCurve() {
        if (this._curveShapeSpaceNavigator !== undefined) {
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessage();
        }
    }
    setCurrentCurve(currentCurve) {
        this.currentCurve = currentCurve.clone();
    }
    relocateCurveAfterOptimization() {
        if (this._curveShapeSpaceNavigator !== undefined && this.displacementCurrentCurveControlPolygon !== undefined) {
            let controlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this.optimizedCurve.controlPoints);
            const nbControlPts = this.displacementCurrentCurveControlPolygon.length;
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            if (Math.abs(this.displacementCurrentCurveControlPolygon[nbControlPts - 1].substract(this.displacementCurrentCurveControlPolygon[0]).norm()) < exports.TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.displacementCurrentCurveControlPolygon[controlPoints.length - 1] = this.displacementCurrentCurveControlPolygon[0];
                for (let controlP of controlPoints) {
                    controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                }
                this._optimizedCurve.controlPoints = controlPoints;
            }
            else {
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                this.optimizedCurve = this.currentCurve.clone();
                this._constraintsNotSatisfied = true;
            }
        }
        return this.optimizedCurve;
    }
    relocateCurveAfterOptimizationUsingKnotPts() {
        this.updateCurve();
        const knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        const refPoint1 = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        const refPoint2 = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        const refDistance = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]).distance(this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]));
        const distance = refPoint2.distance(refPoint1);
        if (this._curveShapeSpaceNavigator !== undefined) {
            // if(Math.abs(displacement1.substract(displacement2).norm()) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
            if (Math.abs(distance - refDistance) < exports.TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.applyRigidBodyDisplacement();
            }
            else {
                // Scale the optimized curve to meet the distance constraint
                // const scaleFactor = refDistance / distance;
                // const scaledCurve = this._optimizedCurve.scale(scaleFactor);
                // this._optimizedCurve = scaledCurve.clone();
                // this.applyRigidBodyDisplacement();
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                const valid = this.curveConstraints.slideConstraintAlongCurve();
                if (valid) {
                    this.applyRigidBodyDisplacement();
                }
                else {
                    this._constraintsNotSatisfied = true;
                    this._optimizedCurve = this._currentCurve.clone();
                }
            }
        }
        return this.optimizedCurve;
    }
    applyRigidBodyDisplacement() {
        const knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        const refPt1currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]);
        const refPt2currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const pt2Pt1currentCurve = refPt2currentCurve.substract(refPt1currentCurve);
        const knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        if (knotsOptCurve[this._referencePtIndex] > knotsOptCurve[knotsOptCurve.length - 1] || knotsOptCurve[this._referencePtIndex] < knotsOptCurve[0]) {
            console.log("Clamped points out of range");
        }
        const refPt1optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        const refPt2optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const pt2Pt1optCurve = refPt2optCurve.substract(refPt1optCurve);
        const displacement = refPt1optCurve.substract(refPt1currentCurve);
        // use dot product to compute the angle because angle is very small and crossProduct can be less accurate
        const argument = pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm());
        let angle = Math.acos(pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if (isNaN(angle)) {
            // Redefine the angle when the argument of the acos is greater than one, due to roundoff errors in the evaluation
            // of the argument. The argument being close an angle of 0, using asin does not lead to roundoff errors near one.
            console.log('applyRigidBodyDisplacement. Angle computed through cosine is not applicable argument = ' + argument);
            angle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        }
        const signAngle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if (signAngle < 0.0)
            angle = -angle;
        const rotationMatrix = new SquareMatrix_1.SquareMatrix(2, [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle)]);
        const controlPointsOptCrv = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._optimizedCurve.controlPoints);
        let relocatedCtrlPts = [];
        for (const controlPt of controlPointsOptCrv) {
            relocatedCtrlPts.push(controlPt.substract(displacement));
        }
        for (let i = 0; i < controlPointsOptCrv.length; i++) {
            const vertexLoc = controlPointsOptCrv[i].substract(refPt1optCurve);
            const vertexRot = (0, Vector2d_1.toVector2d)(rotationMatrix.multiplyByVector(vertexLoc.toArray()));
            relocatedCtrlPts[i] = vertexRot.add(refPt1optCurve).substract(displacement);
        }
        this._optimizedCurve.controlPoints = relocatedCtrlPts;
    }
    locateCurveExtremityUnderConstraint(curveConstraints) {
        if (curveConstraints.firstControlPoint === CurveConstraints_1.ConstraintType.location
            && curveConstraints.lastControlPoint === CurveConstraints_1.ConstraintType.location) {
            // this.relocateCurveAfterOptimization();
            this.relocateCurveAfterOptimizationUsingKnotPts();
            if (this._curveShapeSpaceNavigator !== undefined) {
                this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                error.logMessage();
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessage();
        }
    }
}
exports.CurveConstraintClampedFirstAndLastControlPoint = CurveConstraintClampedFirstAndLastControlPoint;
