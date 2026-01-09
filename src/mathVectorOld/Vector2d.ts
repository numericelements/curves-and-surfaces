import { ErrorLog } from "../errorProcessing/ErrorLoging"
import { VectorInterface } from "./VectorInterface"

/**
 * A two dimensional vector
 */

export class Vector2d implements VectorInterface {

    private _x: number;
    private _y: number;

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

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    negative(): Vector2d  {
        return new Vector2d(-this._x, -this._y)
    }

    add(v: Vector2d): Vector2d {
        return new Vector2d(this._x + v.x, this._y + v.y)
    }

    multiply(value: number): Vector2d {
        return new Vector2d(this._x * value, this._y * value)
    }

    substract(v: Vector2d): Vector2d {
        return new Vector2d(this._x - v.x, this._y - v.y)
    }

    rotate90degrees(): Vector2d {
        return new Vector2d(-this._y, this._x)
    }
    
    normalize(): Vector2d {
        let norm = Math.sqrt(this._x * this._x + this._y * this._y)
        let x = this._x / norm
        let y = this._y / norm
        return new Vector2d(x, y)
    }

    dot(v: Vector2d): number {
        return this._x * v.x + this._y * v.y
    }

    crossPoduct(v: Vector2d): number {
        return this._x * v.y - this._y * v.x
    }

    distance(v: Vector2d): number {
        return Math.sqrt(Math.pow(this._x - v.x, 2) + Math.pow(this._y - v.y, 2))
    }

    norm(): number {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2))
    }

    clone(): Vector2d {
        return new Vector2d(this._x, this._y)
    }

    toArray(): number[] {
        let result = [this._x, this._y];
        return result;
    }

}

export function toVector2d(v: number[]): Vector2d {
    let result = new Vector2d;
    if(v.length !== 2) {
        const error = new ErrorLog("function", "toVector2d", "Incorrect length of array to convert to Vector2d object.");
        error.logMessage();
    } else {
        result.x = v[0];
        result.y = v[1];
    }
    return result;
}

export function scale(factor: number, v: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = []
    v.forEach(element => {
        result.push(element.multiply(factor))
    })
    return result
}

export function scaleX(factor: number, v: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = []
    v.forEach(element => {
        v.push(new Vector2d(element.x * factor, element.y))
    })
    return result
}

export function scaleY(factor: number, v: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = []
    v.forEach(element => {
        v.push(new Vector2d(element.x, element.y * factor))
    })
    return result
}

