import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { decomposeFunction } from "./Piegl_Tiller_NURBS_Book";


/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
export class PeriodicBSplineR1toR1 extends AbstractBSplineR1toR1 {


    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
    }

    bernsteinDecomposition(): BernsteinDecompositionR1toR1 {
        const s = this.clone();
        const degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        const newKnots = s.knots.slice(degree, s.knots.length - degree);
        return new BernsteinDecompositionR1toR1(decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots)));
    }

    clone(): PeriodicBSplineR1toR1 {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative(): PeriodicBSplineR1toR1 {
        let newControlPoints = [];
        let newKnots = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }

    curve(): BSplineR1toR2 {
        let x = this.grevilleAbscissae();
        let cp: Array<Vector2d> = [];
        for (let i = 0; i < x.length; i +=1) {
            cp.push(new Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2(cp, this._knots.slice());

    }

    evaluateOutsideRefInterval(u: number): number {
        let result = 0.0;
        const knots = this.distinctKnots().slice();
        if(u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessageToConsole();
        } else {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessageToConsole();
        }
        return result;
    }

}