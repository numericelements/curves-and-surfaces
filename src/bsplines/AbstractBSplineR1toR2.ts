import { findSpan, clampingFindSpan, basisFunctions } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { BSplineR1toR2Interface as BSplineR1toR2Interface } from "./BSplineR1toR2Interface"


/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export abstract class AbstractBSplineR1toR2 implements BSplineR1toR2Interface {

    protected _controlPoints: Vector2d[]
    protected _knots: number[]
    protected _degree: number

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints)
        this._knots = [...knots]
        this._degree = this.computeDegree()
    }

    computeDegree() {
        let degree = this._knots.length - this._controlPoints.length - 1
        if (degree < 0) {
            throw new Error("Negative degree BSplineR1toR1 are not supported")
        }
        return degree
    }

    get controlPoints(): Vector2d[] {
        return deepCopyControlPoints(this._controlPoints)
    }

    abstract get freeControlPoints(): Vector2d[] 

    set controlPoints(controlPoints: Vector2d[]) {
        this._controlPoints = deepCopyControlPoints(controlPoints)
    }

    get knots() : number[] {
        return [...this._knots]
    }

    set knots(knots: number[]) {
        this._knots = [...knots]
        this._degree = this.computeDegree()
    }

    get degree() : number {
        return this._degree
    }


    getControlPoint(index: number) {
        return this._controlPoints[index].clone()
    }


    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number) : Vector2d {
        const span = findSpan(u, this._knots, this._degree)
        const basis = basisFunctions(span, u, this._knots, this._degree)
        let result = new Vector2d(0, 0)
        for (let i = 0; i < this._degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y
        }
        return result
    }

    /**
     * Return a deep copy of this b-spline
     */
    abstract clone() : AbstractBSplineR1toR2


    abstract optimizerStep(step: number[]) : void

    getControlPointsX() {
        let result: number[] = []
        for (let cp of this._controlPoints) {
            result.push(cp.x)
        }
        return result
    }

    getControlPointsY() {
        let result: number[] = []
        for (let cp of this._controlPoints) {
            result.push(cp.y)
        }
        return result
    }

    getDistinctKnots() {
        let result: number[] = [this._knots[0]]
        let temp = result[0]
        for (let i = 1; i < this._knots.length; i += 1) {
            if (this._knots[i] !== temp) {
                result.push(this._knots[i])
                temp = this._knots[i]
            }
        }
        return result
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number) {
        if (i < 0 || i >= this._controlPoints.length - this._degree) {
            throw new Error("Control point indentifier is out of range")
        }
        this._controlPoints[i].x += deltaX
        this._controlPoints[i].y += deltaY
    }


    setControlPointPosition(index: number, value: Vector2d) {
        this._controlPoints[index] =  value
    }

    insertKnot(u: number, times: number = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return
        }
        
        let index = findSpan(u, this._knots, this._degree)
        let multiplicity = 0

        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index)
        }

        for (let t = 0; t < times; t += 1) {
            let newControlPoints = []
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i]
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i])
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha))
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i]
            }
            this._knots.splice(index + 1, 0, u)
            this._controlPoints = newControlPoints.slice()
            multiplicity += 1
            index += 1
        }

    }

    knotMultiplicity(indexFromFindSpan: number) {
        let result: number = 0
        let i = 0
        while (this._knots[indexFromFindSpan + i] === this._knots[indexFromFindSpan]) {
            i -= 1
            result += 1
            if (indexFromFindSpan + i < 0) {
                break
            }
        }
        return result
    }

    grevilleAbscissae() {
        let result = []
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0
            for (let j = i + 1; j < i + this._degree + 1; j += 1) {
                sum += this._knots[j]
            }
            result.push(sum / this._degree)
        }
        return result
    }


    clamp(u: number) {
        // Piegl and Tiller, The NURBS book, p: 151

        let index = clampingFindSpan(u, this._knots, this._degree)
        let newControlPoints = []

        let multiplicity = 0
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index)
        }

        const times = this._degree - multiplicity + 1;

        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i]
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha))
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i]
            }
            this._knots.splice(index + 1, 0, u)
            this._controlPoints = newControlPoints.slice()
            multiplicity += 1
            index += 1
        }

    }

    /**
     * 
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    abstract extract(fromU: number, toU: number) : AbstractBSplineR1toR2

}

export function deepCopyControlPoints(controlPoints: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = []
    for (let cp of controlPoints) {
        result.push(cp.clone())
    }
    return result
}


