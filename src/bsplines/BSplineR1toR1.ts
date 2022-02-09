import { decomposeFunction } from "./Piegl_Tiller_NURBS_Book"
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1"
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";


/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
export class BSplineR1toR1 extends AbstractBSplineR1toR1 {

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }

    bernsteinDecomposition() {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1(decomposeFunction(this))
    }

    clone() {
        return new BSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative() {
        let newControlPoints = []
        let newKnots = []
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new BSplineR1toR1(newControlPoints, newKnots);
    }

}
