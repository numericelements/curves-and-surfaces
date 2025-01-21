"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSpline_R2_to_R1 = exports.BSpline_R2_to_R1 = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
/**
 * A B-Spline function from a two dimensional real space to a one dimensional real space
 */
var BSpline_R2_to_R1 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSpline_R2_to_R1(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [[0]]; }
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
    Object.defineProperty(BSpline_R2_to_R1.prototype, "controlPoints", {
        get: function () {
            //return this._controlPoints
            return this.cloneControlPoints();
        },
        enumerable: false,
        configurable: true
    });
    BSpline_R2_to_R1.prototype.visibleControlPoints = function () {
        return this.controlPoints;
    };
    Object.defineProperty(BSpline_R2_to_R1.prototype, "knots", {
        get: function () {
            //return this._knots
            return this.cloneKnots();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSpline_R2_to_R1.prototype, "degree", {
        get: function () {
            return this._degree;
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
    BSpline_R2_to_R1.prototype.evaluate = function (u, v) {
        var uSpan = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots[0], this._degree[0]);
        var uBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(uSpan, u, this._knots[0], this._degree[0]);
        var vSpan = Piegl_Tiller_NURBS_Book_1.findSpan(v, this._knots[1], this._degree[1]);
        var vBasis = Piegl_Tiller_NURBS_Book_1.basisFunctions(vSpan, v, this._knots[1], this._degree[1]);
        var uInd = uSpan - this._degree[0];
        var vInd = vSpan - this._degree[1];
        var result = 0;
        for (var j = 0; j <= this._degree[1]; j += 1) {
            var temp = 0;
            for (var i = 0; i <= this._degree[0]; i += 1) {
                temp += (this._controlPoints[uInd + i][vInd + j] * (uBasis[i]));
            }
            result = result + (temp * (vBasis[j]));
        }
        return result;
    };
    BSpline_R2_to_R1.prototype.moveControlPoint = function (indices, delta) {
        this._controlPoints[indices.i][indices.j] += delta;
    };
    BSpline_R2_to_R1.prototype.uGrevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this._degree[0] + 1; j += 1) {
                sum += this._knots[0][j];
            }
            result.push(sum / this._degree[0]);
        }
        return result;
    };
    BSpline_R2_to_R1.prototype.vGrevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this._controlPoints[0].length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this._degree[1] + 1; j += 1) {
                sum += this._knots[1][j];
            }
            result.push(sum / this._degree[1]);
        }
        return result;
    };
    BSpline_R2_to_R1.prototype.insertKnotU = function (u, times) {
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
            var m = this._controlPoints.length;
            var n = this._controlPoints[0].length;
            var newControlPoints = [];
            for (var i = 0; i < m + 1; i += 1) {
                newControlPoints.push([]);
            }
            for (var j = 0; j < n; j += 1) {
                for (var i = 0; i < index - this._degree[0] + 1; i += 1) {
                    newControlPoints[i][j] = this._controlPoints[i][j];
                }
                for (var i = index - this._degree[0] + 1; i <= index - multiplicity; i += 1) {
                    var alpha = (u - this._knots[0][i]) / (this._knots[0][i + this._degree[0]] - this._knots[0][i]);
                    newControlPoints[i][j] = this._controlPoints[i - 1][j] * (1 - alpha) + (this._controlPoints[i][j] * (alpha));
                }
                for (var i = index - multiplicity; i < m; i += 1) {
                    newControlPoints[i + 1][j] = this._controlPoints[i][j];
                }
            }
            //update knots
            this._knots[0].splice(index + 1, 0, u);
            this._controlPoints = newControlPoints;
        }
    };
    BSpline_R2_to_R1.prototype.insertKnotV = function (v, times) {
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
            var m = this._controlPoints.length;
            var n = this._controlPoints[0].length;
            var newControlPoints = [];
            for (var i = 0; i < m; i += 1) {
                newControlPoints.push([]);
            }
            for (var i = 0; i < m; i += 1) {
                for (var j = 0; j < index - this._degree[1] + 1; j += 1) {
                    newControlPoints[i][j] = this._controlPoints[i][j];
                }
                for (var j = index - this._degree[1] + 1; j <= index - multiplicity; j += 1) {
                    var alpha = (v - this._knots[1][j]) / (this._knots[1][j + this._degree[1]] - this._knots[1][j]);
                    newControlPoints[i][j] = this._controlPoints[i][j - 1] * (1 - alpha) + (this._controlPoints[i][j] * (alpha));
                }
                for (var j = index - multiplicity; j < n; j += 1) {
                    newControlPoints[i][j + 1] = this._controlPoints[i][j];
                }
            }
            //update knots
            this._knots[1].splice(index + 1, 0, v);
            this._controlPoints = newControlPoints;
        }
    };
    BSpline_R2_to_R1.prototype.knotMultiplicityU = function (indexFromFindSpan) {
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
    BSpline_R2_to_R1.prototype.knotMultiplicityV = function (indexFromFindSpan) {
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
    BSpline_R2_to_R1.prototype.elevateDegreeU = function () {
        var m = this._controlPoints.length;
        var n = this._controlPoints[0].length;
        var splines = [];
        for (var j = 0; j < n; j += 1) {
            var cp = [];
            for (var i = 0; i < m; i += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR1_1.BSplineR1toR1(cp, this._knots[0]));
        }
        for (var i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[0] = splines[0].knots;
        this._degree[0] = splines[0].degree;
        var newControlPoints = [];
        for (var i = 0; i < splines[0].controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (var j = 0; j < splines.length; j += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i]);
            }
        }
        this._controlPoints = newControlPoints;
    };
    BSpline_R2_to_R1.prototype.elevateDegreeV = function () {
        var m = this._controlPoints.length;
        var n = this._controlPoints[0].length;
        var splines = [];
        for (var i = 0; i < m; i += 1) {
            var cp = [];
            for (var j = 0; j < n; j += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR1_1.BSplineR1toR1(cp, this._knots[1]));
        }
        for (var i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[1] = splines[0].knots;
        this._degree[1] = splines[0].degree;
        var newControlPoints = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (var j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j]);
            }
        }
        this._controlPoints = newControlPoints;
    };
    /**
     * Return a deep copy of this b-spline
     */
    BSpline_R2_to_R1.prototype.clone = function () {
        var cloneControlPoints = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            cloneControlPoints.push([]);
            for (var j = 0; j < this._controlPoints[0].length; j += 1) {
                cloneControlPoints[i].push(this._controlPoints[i][j]);
            }
        }
        var cloneKnots = [[], []];
        cloneKnots[0] = this._knots[0].slice();
        cloneKnots[1] = this._knots[1].slice();
        //const cloneKnots = [this._knots[0].slice(), this._knots[1].slice]
        return new BSpline_R2_to_R1(cloneControlPoints, cloneKnots);
    };
    BSpline_R2_to_R1.prototype.cloneKnots = function () {
        var result = [[], []];
        result[0] = this._knots[0].slice();
        result[1] = this._knots[1].slice();
        return result;
    };
    BSpline_R2_to_R1.prototype.cloneControlPoints = function () {
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            result.push([]);
            for (var j = 0; j < this._controlPoints[0].length; j += 1) {
                result[i].push(this._controlPoints[i][j]);
            }
        }
        return result;
    };
    BSpline_R2_to_R1.prototype.integralU = function () {
        // See : Carl de Boor, A Practical Guide to Splines p. 128
        var newControlPoints = [];
        for (var i = 0; i < this._controlPoints.length + 1; i += 1) {
            newControlPoints.push([]);
        }
        for (var j = 0; j < this._controlPoints[0].length; j += 1) {
            newControlPoints[0].push(0);
        }
        for (var k = 0; k < this._controlPoints[0].length; k += 1) {
            for (var i = 0; i < this._controlPoints.length; i += 1) {
                var temp = 0;
                for (var j = 0; j <= i; j += 1) {
                    temp += (this._knots[0][j + this.degree[0] + 1] - this._knots[0][j]) * this._controlPoints[j][k];
                }
                newControlPoints[i + 1][k] = temp / (this.degree[0] + 1);
            }
        }
        // The knot set matches the original curve except for one extra knot at either end due to the increased in degree
        var newKnots = [[], []];
        newKnots[0].push(this._knots[0][0]);
        for (var i = 0; i < this._knots[0].length; i += 1) {
            newKnots[0].push(this._knots[0][i]);
        }
        newKnots[0].push(this._knots[0][this._knots[0].length - 1]);
        newKnots[1] = this._knots[1].slice();
        return new BSpline_R2_to_R1(newControlPoints, newKnots);
    };
    return BSpline_R2_to_R1;
}());
exports.BSpline_R2_to_R1 = BSpline_R2_to_R1;
function create_BSpline_R2_to_R1(controlPoints, knots) {
    var newControlPoints = [];
    var n = controlPoints.length;
    var m = controlPoints[0].length;
    for (var i = 0; i < n; i += 1) {
        newControlPoints.push([]);
        for (var j = 0; j < m; j += 1) {
            newControlPoints[i].push(controlPoints[i][j]);
        }
    }
    return new BSpline_R2_to_R1(newControlPoints, knots);
}
exports.create_BSpline_R2_to_R1 = create_BSpline_R2_to_R1;
