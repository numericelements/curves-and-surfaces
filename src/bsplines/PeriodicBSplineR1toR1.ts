import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1"
import { decomposeFunction } from "./Piegl_Tiller_NURBS_Book";


/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
export class PeriodicBSplineR1toR1 extends AbstractBSplineR1toR1 {


    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }

    bernsteinDecomposition() {
        const s = this.clone()
        const degree = this._degree
        s.clamp(s.knots[degree])
        s.clamp(s.knots[s.knots.length - degree - 1])
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree)
        const newKnots = s.knots.slice(degree, s.knots.length - degree)
        //return decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots))
        return new BernsteinDecompositionR1toR1(decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots)))
    }

    clone() {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative() {
        let newControlPoints = []
        let newKnots = []
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }



}