"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CylindricalCoordinates = void 0;
/**
 * A three dimensional vector using cylindrical coordinates
 */
class CylindricalCoordinates {
    constructor(r = 0, theta = 0, z = 0) {
        this.r = r;
        this.theta = theta;
        this.z = z;
    }
    negative() {
        return new CylindricalCoordinates(-this.r, -this.theta, -this.z);
    }
    add(v) {
        return new CylindricalCoordinates(this.r + v.r, this.theta + v.theta, this.z + v.z);
    }
    multiply(value) {
        return new CylindricalCoordinates(this.r * value, this.theta * value, this.z * value);
    }
    substract(v) {
        return new CylindricalCoordinates(this.r - v.r, this.theta - v.theta, this.z - v.z);
    }
}
exports.CylindricalCoordinates = CylindricalCoordinates;
