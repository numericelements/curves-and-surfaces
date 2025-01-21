"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3d = void 0;
/**
 * A three dimensional vector
 */
var Vector3d = /** @class */ (function () {
    function Vector3d(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3d.prototype.negative = function () {
        return new Vector3d(-this.x, -this.y, -this.z);
    };
    Vector3d.prototype.add = function (v) {
        return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
    };
    Vector3d.prototype.multiply = function (value) {
        return new Vector3d(this.x * value, this.y * value, this.z * value);
    };
    Vector3d.prototype.substract = function (v) {
        return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
    };
    Vector3d.prototype.normalize = function () {
        var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        var x = this.x / norm;
        var y = this.y / norm;
        var z = this.z / norm;
        return new Vector3d(x, y, z);
    };
    Vector3d.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    Vector3d.prototype.distance = function (v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    };
    Vector3d.prototype.norm = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    };
    Vector3d.prototype.clone = function () {
        return new Vector3d(this.x, this.y, this.z);
    };
    Vector3d.prototype.crossPoduct = function (v) {
        return new Vector3d(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    };
    return Vector3d;
}());
exports.Vector3d = Vector3d;
