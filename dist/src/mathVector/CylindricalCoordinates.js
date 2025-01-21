"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CylindricalCoordinates = void 0;
/**
 * A three dimensional vector using cylindrical coordinates
 */
var CylindricalCoordinates = /** @class */ (function () {
    function CylindricalCoordinates(r, theta, z) {
        if (r === void 0) { r = 0; }
        if (theta === void 0) { theta = 0; }
        if (z === void 0) { z = 0; }
        this.r = r;
        this.theta = theta;
        this.z = z;
    }
    CylindricalCoordinates.prototype.negative = function () {
        return new CylindricalCoordinates(-this.r, -this.theta, -this.z);
    };
    CylindricalCoordinates.prototype.add = function (v) {
        return new CylindricalCoordinates(this.r + v.r, this.theta + v.theta, this.z + v.z);
    };
    CylindricalCoordinates.prototype.multiply = function (value) {
        return new CylindricalCoordinates(this.r * value, this.theta * value, this.z * value);
    };
    CylindricalCoordinates.prototype.substract = function (v) {
        return new CylindricalCoordinates(this.r - v.r, this.theta - v.theta, this.z - v.z);
    };
    return CylindricalCoordinates;
}());
exports.CylindricalCoordinates = CylindricalCoordinates;
