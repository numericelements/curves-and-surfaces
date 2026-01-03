"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleY = exports.scaleX = exports.scale = exports.toVector2d = exports.Vector2d = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/**
 * A two dimensional vector
 */
class Vector2d {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
    negative() {
        return new Vector2d(-this._x, -this._y);
    }
    add(v) {
        return new Vector2d(this._x + v.x, this._y + v.y);
    }
    multiply(value) {
        return new Vector2d(this._x * value, this._y * value);
    }
    substract(v) {
        return new Vector2d(this._x - v.x, this._y - v.y);
    }
    rotate90degrees() {
        return new Vector2d(-this._y, this._x);
    }
    normalize() {
        let norm = Math.sqrt(this._x * this._x + this._y * this._y);
        let x = this._x / norm;
        let y = this._y / norm;
        return new Vector2d(x, y);
    }
    dot(v) {
        return this._x * v.x + this._y * v.y;
    }
    crossPoduct(v) {
        return this._x * v.y - this._y * v.x;
    }
    distance(v) {
        return Math.sqrt(Math.pow(this._x - v.x, 2) + Math.pow(this._y - v.y, 2));
    }
    norm() {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
    }
    clone() {
        return new Vector2d(this._x, this._y);
    }
    toArray() {
        let result = [this._x, this._y];
        return result;
    }
}
exports.Vector2d = Vector2d;
function toVector2d(v) {
    let result = new Vector2d;
    if (v.length !== 2) {
        const error = new ErrorLoging_1.ErrorLog("function", "toVector2d", "Incorrect length of array to convert to Vector2d object.");
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
    let result = [];
    v.forEach(element => {
        result.push(element.multiply(factor));
    });
    return result;
}
exports.scale = scale;
function scaleX(factor, v) {
    let result = [];
    v.forEach(element => {
        v.push(new Vector2d(element.x * factor, element.y));
    });
    return result;
}
exports.scaleX = scaleX;
function scaleY(factor, v) {
    let result = [];
    v.forEach(element => {
        v.push(new Vector2d(element.x, element.y * factor));
    });
    return result;
}
exports.scaleY = scaleY;
