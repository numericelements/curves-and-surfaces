import { BSplineR1toR2} from "./BSplineR1toR2"
import { Vector2d } from "../mathVector/Vector2d"
import { AbstractBSplineR1toR2, deepCopyControlPoints } from "./AbstractBSplineR1toR2"
import { clampingFindSpan } from "./Piegl_Tiller_NURBS_Book"


/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 */
export class PeriodicBSplineR1toR2 extends AbstractBSplineR1toR2  {


    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
     constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }


    get periodicControlPointsLength() {
        return this._controlPoints.length - this._degree
    }

    get freeControlPoints() {
        let periodicControlPoints = []
        for (let i = 0; i < this.periodicControlPointsLength; i += 1) {
            periodicControlPoints.push(this._controlPoints[i].clone())
        }
        return periodicControlPoints
    }

    getClampSpline() {
        const s = this.clone()
        const degree = this._degree
        s.clamp(s.knots[degree])
        s.clamp(s.knots[s.knots.length - degree - 1])
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree)
        const newKnots = s.knots.slice(degree, s.knots.length - degree)
        return new BSplineR1toR2(newControlPoints, newKnots)
    }


    /**
     * Return a deep copy of this b-spline
     */
     clone() : PeriodicBSplineR1toR2 {
        let cloneControlPoints = deepCopyControlPoints(this._controlPoints)
        return new PeriodicBSplineR1toR2(cloneControlPoints, this._knots.slice())
    }

    optimizerStep(step: number[]) {
        
        const n = this.periodicControlPointsLength
        for (let i = 0; i < n; i += 1) {
            this.moveControlPoint(i, step[i], step[i + n])
        }
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number) {
        
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range")
        }
        
        
        super.moveControlPoint(i, deltaX, deltaY)

        let n = this.periodicControlPointsLength
        if (i < this.degree) {
            super.setControlPointPosition(n + i, this.getControlPoint(i))
        }

    }

    /**
     * 
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
     extract(fromU: number, toU: number) {

        let spline = this.clone()
        spline.clamp(fromU)
        spline.clamp(toU)


        const newFromSpan = clampingFindSpan(fromU, spline._knots, spline._degree)
        const newToSpan = clampingFindSpan(toU, spline._knots, spline._degree)

        let newKnots : number[] = []
        let newControlPoints : Vector2d[] = []


        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i])
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y))
        }

        return new BSplineR1toR2(newControlPoints, newKnots)
    }



    getDistinctKnots() {
        const result = super.getDistinctKnots()
        return result.slice(this.degree, result.length - this.degree)
    }

    setControlPointPosition(i: number, value: Vector2d) {

        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range")
        }
        
        super.setControlPointPosition(i, value.clone())

        if (i < this._degree) {
            const j = this.periodicControlPointsLength + i
            super.setControlPointPosition(j, value.clone())
        }
        

    }

    insertKnot(u: number) {
        super.insertKnot(u, 1)
        if (u < this._knots[2 * this._degree]) {
            let newKnots : number[] = []
            let newControlPoints: Vector2d[]  = []
            for (let i = 0; i < this._knots.length - 2 * this._degree ; i += 1) {
                newKnots.push(this._knots[i])
            }
            const ui = newKnots[newKnots.length - 1]
            for (let i = 1; i < 2 * this._degree + 1; i += 1 ) {
                newKnots.push(ui + (this._knots[i] - this._knots[0]))
            }
            for (let i = 0; i < this._controlPoints.length - this._degree ; i += 1) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y))
            }
            for (let i = 0; i < this._degree; i += 1 ) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y))
            }
            this._controlPoints = newControlPoints
            this._knots = newKnots
        }
        if (u > this._knots[this._knots.length - 1 - 2 * this._degree]) {
            let newKnots : number[] = []
            let newControlPoints: Vector2d[]  = []
            const periodicIndex = this._knots.length - 1 - 2 * this._degree
            const ui = this._knots[periodicIndex]
            for (let i = 0; i < 2 * this._degree; i += 1) {
                newKnots.push(this._knots[1] + (this._knots[i + periodicIndex] - ui))
            }
            for (let i = 2 * this._degree; i < this._knots.length; i += 1 ) {
                newKnots.push(this._knots[i])
            }
            const cpi = this._controlPoints.length - this._degree
            for (let i = 0; i < this._degree; i += 1 ) {
                newControlPoints.push(new Vector2d(this._controlPoints[cpi + i].x, this._controlPoints[cpi + i].y))
            }
            for (let i = this._degree; i < this._controlPoints.length; i += 1) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y))
            }
            this._controlPoints = newControlPoints
            this._knots = newKnots
        } 
    }

}

export function create_PeriodicBSplineR1toR2(controlPoints: number[][], knots: number[]){
    let newControlPoints: Vector2d[] = []
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d(cp[0], cp[1]))
    }
    return new PeriodicBSplineR1toR2(newControlPoints, knots)
}