import { clampingFindSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector3d } from "../mathVector/Vector3d"
import { AbstractBSplineR1toR3, deepCopyControlPoints } from "./AbstractBSplineR1toR3"


/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSplineR1toR3 extends AbstractBSplineR1toR3 {


    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }


    get freeControlPoints(): Vector3d[] {
        return this.controlPoints
    }


    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = deepCopyControlPoints(this._controlPoints)
        return new BSplineR1toR3(cloneControlPoints, this._knots.slice())
    }


    optimizerStep(step: number[]) {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i]
            this._controlPoints[i].y += step[i + this._controlPoints.length]
            this._controlPoints[i].z += step[i + 2 * this._controlPoints.length]
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
        let newControlPoints : Vector3d[] = []


        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i])
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector3d(spline._controlPoints[i].x, spline._controlPoints[i].y))
        }

        return new BSplineR1toR3(newControlPoints, newKnots)
    }


}


export function create_BSplineR1toR3(controlPoints: number[][], knots: number[]){
    let newControlPoints: Vector3d[] = []
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector3d(cp[0], cp[1], cp[2]))
    }
    return new BSplineR1toR3(newControlPoints, knots)
}

