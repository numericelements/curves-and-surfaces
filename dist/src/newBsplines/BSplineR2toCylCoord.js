"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSplineR2toCylCoord = void 0;
var CylindricalCoordinates_1 = require("../mathVector/CylindricalCoordinates");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector3d_1 = require("../mathVector/Vector3d");
/**
 * A B-Spline function from a two dimensional real space to a three dimensional real space
 */
var BSplineR2toCylCoord = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSplineR2toCylCoord(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [[new CylindricalCoordinates_1.CylindricalCoordinates(0, 0, 0)]]; }
        if (knots === void 0) { knots = [[0, 1], [0, 1]]; }
        //controlPoints[i][j]
        this._controlPoints = [];
        //knots[0] =  knots_i
        //knots[1] =  knots_j
        this._knots = [];
        //degree[0] = degree_i
        //degree[1] = degree_j
        this._degree = [0, 0];
        this._controlPoints = controlPoints;
        this._knots = knots;
        this._degree[0] = this._knots[0].length - this._controlPoints.length - 1;
        this._degree[1] = this._knots[1].length - this._controlPoints[0].length - 1;
        if (this._degree[0] < 0 || this._degree[1] < 0) {
            throw new Error("Negative degree BSpline_R2_to_R2 are not supported");
        }
    }
    Object.defineProperty(BSplineR2toCylCoord.prototype, "controlPoints", {
        get: function () {
            return this._controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    /**
 * B-Spline evaluation
 * @param u The parameter u
 * @param v The parameter v
 * @returns the value of the B-Spline at (u, v)
 */
    BSplineR2toCylCoord.prototype.evaluate = function (u, v) {
        var uSpan = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots[0], this._degree[0]);
        var uBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(uSpan, u, this._knots[0], this._degree[0]);
        var vSpan = Piegl_Tiller_NURBS_Book_1.findSpan(v, this._knots[1], this._degree[1]);
        var vBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(vSpan, v, this._knots[1], this._degree[1]);
        var uInd = uSpan - this._degree[0];
        var vInd = vSpan - this._degree[1];
        var result = new CylindricalCoordinates_1.CylindricalCoordinates(0, 0, 0);
        for (var j = 0; j <= this._degree[1]; j += 1) {
            var temp = new CylindricalCoordinates_1.CylindricalCoordinates(0, 0, 0);
            for (var i = 0; i <= this._degree[0]; i += 1) {
                temp = temp.add(this._controlPoints[uInd + i][vInd + j].multiply(uBasis[i]));
            }
            result = result.add(temp.multiply(vBasis[j]));
        }
        return result;
    };
    BSplineR2toCylCoord.prototype.evaluateInCartesianCoordinates = function (u, v) {
        var cc = this.evaluate(u, v);
        return new Vector3d_1.Vector3d(cc.r * Math.cos(cc.theta), cc.r * Math.sin(cc.theta), cc.z);
    };
    BSplineR2toCylCoord.prototype.normalInCartesianCoordinates = function (u, v) {
        var epsilon = 10e-7;
        var cartCoord = this.evaluateInCartesianCoordinates(u, v);
        var su;
        var sv;
        if (u + epsilon < this._knots[0][this._knots[0].length - 1 - this._degree[0]]) {
            su = this.evaluateInCartesianCoordinates(u + epsilon, v).substract(cartCoord);
        }
        else {
            su = cartCoord.substract(this.evaluateInCartesianCoordinates(u - epsilon, v));
        }
        if (v + epsilon < this._knots[1][this._knots[1].length - 1 - this._degree[1]]) {
            sv = this.evaluateInCartesianCoordinates(u, v + epsilon).substract(cartCoord);
        }
        else {
            sv = cartCoord.substract(this.evaluateInCartesianCoordinates(u, v - epsilon));
        }
        return su.crossPoduct(sv).normalize();
    };
    return BSplineR2toCylCoord;
}());
exports.BSplineR2toCylCoord = BSplineR2toCylCoord;
