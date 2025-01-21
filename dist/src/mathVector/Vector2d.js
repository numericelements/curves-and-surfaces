"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleY = exports.scaleX = exports.scale = exports.toVector2d = exports.Vector2d = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/**
 * A two dimensional vector
 */
var Vector2d = /** @class */ (function () {
    function Vector2d(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2d.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            this._x = x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2d.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            this._y = y;
        },
        enumerable: false,
        configurable: true
    });
    Vector2d.prototype.negative = function () {
        return new Vector2d(-this._x, -this._y);
    };
    Vector2d.prototype.add = function (v) {
        return new Vector2d(this._x + v.x, this._y + v.y);
    };
    Vector2d.prototype.multiply = function (value) {
        return new Vector2d(this._x * value, this._y * value);
    };
    Vector2d.prototype.substract = function (v) {
        return new Vector2d(this._x - v.x, this._y - v.y);
    };
    Vector2d.prototype.rotate90degrees = function () {
        return new Vector2d(-this._y, this._x);
    };
    Vector2d.prototype.normalize = function () {
        var norm = Math.sqrt(this._x * this._x + this._y * this._y);
        var x = this._x / norm;
        var y = this._y / norm;
        return new Vector2d(x, y);
    };
    Vector2d.prototype.dot = function (v) {
        return this._x * v.x + this._y * v.y;
    };
    Vector2d.prototype.crossPoduct = function (v) {
        return this._x * v.y - this._y * v.x;
    };
    Vector2d.prototype.distance = function (v) {
        return Math.sqrt(Math.pow(this._x - v.x, 2) + Math.pow(this._y - v.y, 2));
    };
    Vector2d.prototype.norm = function () {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
    };
    Vector2d.prototype.clone = function () {
        return new Vector2d(this._x, this._y);
    };
    Vector2d.prototype.toArray = function () {
        var result = [this._x, this._y];
        return result;
    };
    return Vector2d;
}());
exports.Vector2d = Vector2d;
function toVector2d(v) {
    var result = new Vector2d;
    if (v.length !== 2) {
        var error = new ErrorLoging_1.ErrorLog("function", "toVector2d", "Incorrect length of array to convert to Vector2d object.");
        error.logMessage();
    }
    else {
        result.x = v[0];
        result.y = v[1];
    }
    return result;
}
exports.toVector2d = toVector2d;
function scale(factor, v) {
    var result = [];
    v.forEach(function (element) {
        result.push(element.multiply(factor));
    });
    return result;
}
exports.scale = scale;
function scaleX(factor, v) {
    var result = [];
    v.forEach(function (element) {
        v.push(new Vector2d(element.x * factor, element.y));
    });
    return result;
}
exports.scaleX = scaleX;
function scaleY(factor, v) {
    var result = [];
    v.forEach(function (element) {
        v.push(new Vector2d(element.x, element.y * factor));
    });
    return result;
}
exports.scaleY = scaleY;
