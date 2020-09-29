/**
 * A two dimensional vector
 */

export class Vector_2d {

    constructor(public x = 0, public y = 0) {}

    negative() {
        return new Vector_2d(-this.x, -this.y);
    }

    add(v: Vector_2d) {
        return new Vector_2d(this.x+v.x, this.y+v.y)
    }

    multiply(value: number) {
        return new Vector_2d(this.x*value, this.y*value)
    }

    substract(v: Vector_2d) {
        return new Vector_2d(this.x - v.x, this.y - v.y);
    }
    rotate90degrees() {
        return new Vector_2d(-this.y, this.x);
    }
    normalize() {
        let x, y, norm;
        norm = Math.sqrt(this.x * this.x + this.y * this.y);
        x = this.x / norm;
        y = this.y / norm;
        return new Vector_2d(x, y);
    }

    dot(v: Vector_2d) {
        'use strict';
        return this.x * v.x + this.y * v.y;
    }

    distance(v: Vector_2d) {
        'use strict';
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}