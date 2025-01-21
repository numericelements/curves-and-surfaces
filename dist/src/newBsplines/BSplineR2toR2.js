"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSpline_R2_to_R2 = exports.BSplineR2toR2 = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var BSplineR1toR2_1 = require("./BSplineR1toR2");
/**
 * A B-Spline function from a two dimensional real space to a two dimensional real space
 */
var BSplineR2toR2 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSplineR2toR2(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [[new Vector2d_1.Vector2d(0, 0)]]; }
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
    Object.defineProperty(BSplineR2toR2.prototype, "controlPoints", {
        get: function () {
            return this._controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    BSplineR2toR2.prototype.visibleControlPoints = function () {
        return this.controlPoints;
    };
    Object.defineProperty(BSplineR2toR2.prototype, "knots", {
        get: function () {
            return this._knots;
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
    BSplineR2toR2.prototype.evaluate = function (u, v) {
        var uSpan = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots[0], this._degree[0]);
        var uBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(uSpan, u, this._knots[0], this._degree[0]);
        var vSpan = Piegl_Tiller_NURBS_Book_1.findSpan(v, this._knots[1], this._degree[1]);
        var vBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(vSpan, v, this._knots[1], this._degree[1]);
        var uInd = uSpan - this._degree[0];
        var vInd = vSpan - this._degree[1];
        var result = new Vector2d_1.Vector2d(0, 0);
        for (var j = 0; j <= this._degree[1]; j += 1) {
            var temp = new Vector2d_1.Vector2d(0, 0);
            for (var i = 0; i <= this._degree[0]; i += 1) {
                temp = temp.add(this._controlPoints[uInd + i][vInd + j].multiply(uBasis[i]));
            }
            result = result.add(temp.multiply(vBasis[j]));
        }
        return result;
    };
    BSplineR2toR2.prototype.moveControlPoint = function (indices, deltaX, deltaY) {
        this.controlPoints[indices.i][indices.j].x += deltaX;
        this.controlPoints[indices.i][indices.j].y += deltaY;
        //console.log(deltaX)
    };
    BSplineR2toR2.prototype.uGrevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this._degree[0] + 1; j += 1) {
                sum += this._knots[0][j];
            }
            result.push(sum / this._degree[0]);
        }
        return result;
    };
    BSplineR2toR2.prototype.vGrevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this.controlPoints[0].length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this._degree[1] + 1; j += 1) {
                sum += this.knots[1][j];
            }
            result.push(sum / this._degree[1]);
        }
        return result;
    };
    BSplineR2toR2.prototype.insertKnotU = function (u, times) {
        if (times === void 0) { times = 1; }
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots[0], this._degree[0]);
        var multiplicity = 0;
        if (u === this._knots[0][index]) {
            multiplicity = this.knotMultiplicityU(index);
        }
        for (var t = 0; t < times; t += 1) {
            var m = this.controlPoints.length;
            var n = this.controlPoints[0].length;
            var newControlPoints = [];
            for (var i = 0; i < m + 1; i += 1) {
                newControlPoints.push([]);
            }
            for (var j = 0; j < n; j += 1) {
                for (var i = 0; i < index - this._degree[0] + 1; i += 1) {
                    newControlPoints[i][j] = this.controlPoints[i][j];
                }
                for (var i = index - this._degree[0] + 1; i <= index - multiplicity; i += 1) {
                    var alpha = (u - this._knots[0][i]) / (this._knots[0][i + this._degree[0]] - this._knots[0][i]);
                    newControlPoints[i][j] = this.controlPoints[i - 1][j].multiply(1 - alpha).add(this.controlPoints[i][j].multiply(alpha));
                }
                for (var i = index - multiplicity; i < m; i += 1) {
                    newControlPoints[i + 1][j] = this.controlPoints[i][j];
                }
            }
            //update knots
            this._knots[0].splice(index + 1, 0, u);
            this._controlPoints = newControlPoints;
        }
    };
    BSplineR2toR2.prototype.insertKnotV = function (v, times) {
        if (times === void 0) { times = 1; }
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(v, this._knots[1], this._degree[1]);
        var multiplicity = 0;
        if (v === this._knots[1][index]) {
            multiplicity = this.knotMultiplicityU(index);
        }
        for (var t = 0; t < times; t += 1) {
            var m = this.controlPoints.length;
            var n = this.controlPoints[0].length;
            var newControlPoints = [];
            for (var i = 0; i < m; i += 1) {
                newControlPoints.push([]);
            }
            for (var i = 0; i < m; i += 1) {
                for (var j = 0; j < index - this._degree[1] + 1; j += 1) {
                    newControlPoints[i][j] = this.controlPoints[i][j];
                }
                for (var j = index - this._degree[1] + 1; j <= index - multiplicity; j += 1) {
                    var alpha = (v - this._knots[1][j]) / (this._knots[1][j + this._degree[1]] - this._knots[1][j]);
                    newControlPoints[i][j] = this.controlPoints[i][j - 1].multiply(1 - alpha).add(this.controlPoints[i][j].multiply(alpha));
                }
                for (var j = index - multiplicity; j < n; j += 1) {
                    newControlPoints[i][j + 1] = this.controlPoints[i][j];
                }
            }
            //update knots
            this._knots[1].splice(index + 1, 0, v);
            this._controlPoints = newControlPoints;
        }
    };
    BSplineR2toR2.prototype.knotMultiplicityU = function (indexFromFindSpan) {
        var result = 0, i = 0;
        while (this._knots[0][indexFromFindSpan + i] === this._knots[0][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    BSplineR2toR2.prototype.knotMultiplicityV = function (indexFromFindSpan) {
        var result = 0, i = 0;
        while (this._knots[1][indexFromFindSpan + i] === this._knots[1][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    BSplineR2toR2.prototype.elevateDegreeU = function () {
        var m = this.controlPoints.length;
        var n = this.controlPoints[0].length;
        var splines = [];
        for (var j = 0; j < n; j += 1) {
            var cp = [];
            for (var i = 0; i < m; i += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots[0]));
        }
        for (var i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[0] = splines[0].knots;
        this._degree[0] = splines[0].degree;
        var newControlPoints = [];
        /*
        for (let j = 0; j < this.controlPoints[0].length; j += 1 ) {
            newControlPoints.push([])
            for (let i = 0; i < splines[0].controlPoints.length; i += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i])
            }
        }
        */
        /*
       for (let j = 0; j < this.controlPoints[0].length; j += 1) {
            newControlPoints.push([])
            for (let i = 0; i < splines[0].controlPoints.length; i += 1 ) {
                newControlPoints[j].push(splines[j].controlPoints[i])
            }
        }
        */
        /*
        for (let i = 0; i < splines.length; i += 1 ) {
            newControlPoints.push([])
            for (let j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j])
            }
        }
        */
        for (var i = 0; i < splines[0].controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (var j = 0; j < splines.length; j += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i]);
            }
        }
        this._controlPoints = newControlPoints;
    };
    BSplineR2toR2.prototype.elevateDegreeV = function () {
        var m = this.controlPoints.length;
        var n = this.controlPoints[0].length;
        var splines = [];
        for (var i = 0; i < m; i += 1) {
            var cp = [];
            for (var j = 0; j < n; j += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots[1]));
        }
        for (var i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[1] = splines[0].knots;
        this._degree[1] = splines[0].degree;
        var newControlPoints = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (var j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j]);
            }
        }
        this._controlPoints = newControlPoints;
    };
    return BSplineR2toR2;
}());
exports.BSplineR2toR2 = BSplineR2toR2;
function create_BSpline_R2_to_R2(controlPoints, knots) {
    var newControlPoints = [];
    var n = controlPoints.length;
    var m = controlPoints[0].length;
    for (var i = 0; i < n; i += 1) {
        newControlPoints.push([]);
        for (var j = 0; j < m; j += 1) {
            newControlPoints[i].push(new Vector2d_1.Vector2d(controlPoints[i][j][0], controlPoints[i][j][1]));
        }
    }
    return new BSplineR2toR2(newControlPoints, knots);
}
exports.create_BSpline_R2_to_R2 = create_BSpline_R2_to_R2;
