/**
 * A three dimensional vector using cylindrical coordinates
 */
 export class CylindricalCoordinates {

    constructor(public r = 0, public theta = 0, public z = 0) {}

    negative() {
        return new CylindricalCoordinates(-this.r, -this.theta, -this.z);
    }

    add(v: CylindricalCoordinates) {
        return new CylindricalCoordinates(this.r+v.r, this.theta+v.theta, this.z+v.z)
    }

    multiply(value: number) {
        return new CylindricalCoordinates(this.r*value, this.theta*value, this.z*value)
    }

    substract(v: CylindricalCoordinates) {
        return new CylindricalCoordinates(this.r - v.r, this.theta - v.theta, this.z - v.z)
    }


}