import { Vector_2d } from "../mathematics/Vector_2d"
/**
 * A two dimensional vector with a tag defined as an integer
 */

export class Tagged_Vector_2d {
    public tag: number;
    public vect: Vector_2d;

    constructor(vector: Vector_2d , tag: number = -1) {
        this.vect = new Vector_2d(vector.x, vector.y)
        this.tag = tag
    }

    negative() {
        let result = new Tagged_Vector_2d(this.vect, this.tag);
        result.vect.x = -result.vect.x;
        result.vect.y = -result.vect.y;
        return result;
    }

    multiply(value: number) {
        let result = new Tagged_Vector_2d(this.vect, this.tag);
        result.vect.x = result.vect.x * value;
        result.vect.y = result.vect.y * value;
        return result;
    }

    normalize() {
        let result = new Tagged_Vector_2d(this.vect, this.tag);
        let norm = Math.sqrt(this.vect.x * this.vect.x + this.vect.y * this.vect.y);
        result.vect.x = this.vect.x / norm;
        result.vect.y = this.vect.y / norm;
        return result;
    }

    distance(v: Tagged_Vector_2d) {
        'use strict';
        return Math.sqrt(Math.pow(this.vect.x - v.vect.x, 2) + Math.pow(this.vect.y - v.vect.y, 2));
    }

    norm() {
        'use strict';
        return Math.sqrt(Math.pow(this.vect.x, 2) + Math.pow(this.vect.y, 2));
    }

    sameTag(v: Tagged_Vector_2d): boolean {
        if(this.tag === v.tag) return true
        else return false
    }

}