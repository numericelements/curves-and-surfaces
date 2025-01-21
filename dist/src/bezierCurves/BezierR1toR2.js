"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertPolygon = exports.BezierR1toR2 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractBSplineR1toR2_1 = require("../newBsplines/AbstractBSplineR1toR2");
var BezierR1toR2 = /** @class */ (function () {
    function BezierR1toR2(controlPoints) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        this._controlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(controlPoints);
        this._degree = this._controlPoints.length - 1;
    }
    Object.defineProperty(BezierR1toR2.prototype, "controlPoints", {
        get: function () {
            return AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        },
        set: function (controlPoints) {
            this._controlPoints = controlPoints;
            this._degree = this._controlPoints.length - 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BezierR1toR2.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    BezierR1toR2.prototype.clone = function () {
        var cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new BezierR1toR2(cloneControlPoints);
    };
    BezierR1toR2.prototype.evaluate = function (u) {
        var result = new Vector2d_1.Vector2d(0, 0);
        if (u < 0.0 || u > 1.0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluate", "Parameter value for evaluation is outside the interval [0,1].");
            error.logMessage();
        }
        else {
            var vertices = [];
            vertices[0] = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
            for (var i = 1; i < this._degree + 1; i++) {
                for (var j = 0; j < (this._degree + 1 - i); j++) {
                    vertices[i][j] = vertices[i - 1][j].multiply(1 - u).add(vertices[i - 1][j + 1].multiply(u));
                }
            }
            result = vertices[this._degree][0];
        }
        return result;
    };
    BezierR1toR2.prototype.extend = function (u) {
        var result = new BezierR1toR2();
        if (u >= 0.0 && u <= 1.0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the interval [0,1].");
            error.logMessage();
        }
        else {
            var ctrlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
            var reversed = false;
            if (u < 0.0) {
                ctrlPoints = revertPolygon(ctrlPoints);
                u = 1.0 - u;
                reversed = true;
            }
            var vertices = [];
            for (var i = 1; i < this._degree + 1; i++) {
                var controlPolygon = [];
                controlPolygon.push(ctrlPoints[ctrlPoints.length - 1 - i]);
                var vertex = ctrlPoints[ctrlPoints.length - 1 - i].multiply(1 - u).add(ctrlPoints[ctrlPoints.length - i].multiply(u));
                controlPolygon.push(vertex);
                for (var j = 1; j < i; j++) {
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
    };
    BezierR1toR2.prototype.generateBezierFromBSplineR1toR1 = function (sx, sy) {
        var result = new BezierR1toR2();
        if (sx.length !== sy.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateBezierFromBSplineR1toR1", "Sizes of x and y component arrays are not equal. Impossible to generate the curve.");
            error.logMessage();
        }
        else {
            var controlPolygon = [];
            for (var i = 0; i < sx.length; i++) {
                var vertex = new Vector2d_1.Vector2d(sx[i], sy[i]);
                controlPolygon.push(vertex);
            }
            result.controlPoints = controlPolygon;
        }
        return result;
    };
    return BezierR1toR2;
}());
exports.BezierR1toR2 = BezierR1toR2;
function revertPolygon(ctrlPoints) {
    var vertices = [];
    for (var i = 0; i < ctrlPoints.length; i++) {
        vertices.push(ctrlPoints[ctrlPoints.length - 1 - i]);
    }
    return vertices;
}
exports.revertPolygon = revertPolygon;
