"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertPolygon = exports.BezierR1toR2 = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const AbstractBSplineR1toR2_1 = require("../newBsplines/AbstractBSplineR1toR2");
class BezierR1toR2 {
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)]) {
        this._controlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(controlPoints);
        this._degree = this._controlPoints.length - 1;
    }
    get controlPoints() {
        return (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._controlPoints);
    }
    get degree() {
        return this._degree;
    }
    set controlPoints(controlPoints) {
        this._controlPoints = controlPoints;
        this._degree = this._controlPoints.length - 1;
    }
    clone() {
        let cloneControlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._controlPoints);
        return new BezierR1toR2(cloneControlPoints);
    }
    evaluate(u) {
        let result = new Vector2d_1.Vector2d(0, 0);
        if (u < 0.0 || u > 1.0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluate", "Parameter value for evaluation is outside the interval [0,1].");
            error.logMessage();
        }
        else {
            let vertices = [];
            vertices[0] = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._controlPoints);
            for (let i = 1; i < this._degree + 1; i++) {
                for (let j = 0; j < (this._degree + 1 - i); j++) {
                    vertices[i][j] = vertices[i - 1][j].multiply(1 - u).add(vertices[i - 1][j + 1].multiply(u));
                }
            }
            result = vertices[this._degree][0];
        }
        return result;
    }
    extend(u) {
        let result = new BezierR1toR2();
        if (u >= 0.0 && u <= 1.0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the interval [0,1].");
            error.logMessage();
        }
        else {
            let ctrlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._controlPoints);
            let reversed = false;
            if (u < 0.0) {
                ctrlPoints = revertPolygon(ctrlPoints);
                u = 1.0 - u;
                reversed = true;
            }
            let vertices = [];
            for (let i = 1; i < this._degree + 1; i++) {
                let controlPolygon = [];
                controlPolygon.push(ctrlPoints[ctrlPoints.length - 1 - i]);
                const vertex = ctrlPoints[ctrlPoints.length - 1 - i].multiply(1 - u).add(ctrlPoints[ctrlPoints.length - i].multiply(u));
                controlPolygon.push(vertex);
                for (let j = 1; j < i; j++) {
                    controlPolygon.push(controlPolygon[controlPolygon.length - 1].multiply(1 - u).add(vertices[i - 2][j - 1].multiply(u)));
                }
                vertices.push(controlPolygon);
            }
            if (reversed) {
                vertices[vertices.length - 1] = revertPolygon(vertices[vertices.length - 1]);
            }
            result = new BezierR1toR2(vertices[vertices.length - 1]);
        }
        return result;
    }
    generateBezierFromBSplineR1toR1(sx, sy) {
        let result = new BezierR1toR2();
        if (sx.length !== sy.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateBezierFromBSplineR1toR1", "Sizes of x and y component arrays are not equal. Impossible to generate the curve.");
            error.logMessage();
        }
        else {
            let controlPolygon = [];
            for (let i = 0; i < sx.length; i++) {
                let vertex = new Vector2d_1.Vector2d(sx[i], sy[i]);
                controlPolygon.push(vertex);
            }
            result.controlPoints = controlPolygon;
        }
        return result;
    }
}
exports.BezierR1toR2 = BezierR1toR2;
function revertPolygon(ctrlPoints) {
    let vertices = [];
    for (let i = 0; i < ctrlPoints.length; i++) {
        vertices.push(ctrlPoints[ctrlPoints.length - 1 - i]);
    }
    return vertices;
}
exports.revertPolygon = revertPolygon;
