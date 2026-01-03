"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3d = void 0;
/**
 * A three dimensional vector
 */
class Vector3d {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    negative() {
        return new Vector3d(-this.x, -this.y, -this.z);
    }
    add(v) {
        return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    multiply(value) {
        return new Vector3d(this.x * value, this.y * value, this.z * value);
    }
    substract(v) {
        return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    normalize() {
        let norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        let x = this.x / norm;
        let y = this.y / norm;
        let z = this.z / norm;
        return new Vector3d(x, y, z);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    distance(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    clone() {
        return new Vector3d(this.x, this.y, this.z);
    }
    crossPoduct(v) {
        return new Vector3d(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
}
exports.Vector3d = Vector3d;
