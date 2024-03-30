import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { decomposeFunction, clampingFindSpan } from "./Piegl_Tiller_NURBS_Book";


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
        let newControlPoints = [];
        let newKnots = [];
        if(degree === 0) {
            const index = clampingFindSpan(s.knots[0], s.knots, s.degree);
            let multiplicity = 0;
            if (s.knots[0] === s.knots[index]) multiplicity = this.knotMultiplicity(index);
            if(multiplicity > 1) {
                newControlPoints = s.controlPoints.slice(multiplicity - 1, s.controlPoints.length - multiplicity + 1);
                newKnots = s.knots.slice(multiplicity - 1, s.knots.length - multiplicity + 1);
            } else {
                newControlPoints = s.controlPoints;
                newKnots = s.knots;
            }
        } else {
            let multiplicityBoundary = this.knotMultiplicity(this._degree);
            if(multiplicityBoundary > 1) {
                for(let i = 1; i < multiplicityBoundary; i++) {
                    const firstKnot = s._knots[0];
                    s._knots.splice(0, 0, firstKnot - 1);
                    const lastKnot = s._knots[s._knots.length - 1];
                    s._knots.splice(s._knots.length, 0, lastKnot + 1);
                    s._controlPoints.splice(0, 0, 0.0);
                    s._controlPoints.splice(s._controlPoints.length, 0, 0.0);
                }
            }
            s.clamp(s.knots[degree]);
            // s.clamp(s.knots[s.knots.length - (i - 1) - 1]);
            s.clamp(s.knots[s.knots.length - degree - 1]);

            if(multiplicityBoundary > 1) {
                s._knots.splice(0, (multiplicityBoundary - 1));
                s._knots.splice(s._knots.length - (multiplicityBoundary - 1), (multiplicityBoundary - 1));
                s._controlPoints.splice(0, (multiplicityBoundary - 1));
                s._controlPoints.splice(s._controlPoints.length - (multiplicityBoundary - 1), (multiplicityBoundary - 1));
            }
            let currentKnot = s.knots[0];
            let i = 1;
            while(currentKnot !== s.knots[i] && i <= s.degree) {
                currentKnot = s.knots[i];
                i++;
            }
            // newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
            // newKnots = s.knots.slice(degree, s.knots.length - degree);
            newControlPoints = s.controlPoints.slice((i - 1), s.controlPoints.length - (i - 1));
            newKnots = s.knots.slice((i - 1), s.knots.length - (i - 1));
        }
        return new BernsteinDecompositionR1toR1(decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots)));
    }

    clone(): PeriodicBSplineR1toR1 {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative(): PeriodicBSplineR1toR1 {
        let newControlPoints = [];
        let newKnots = [];
        const spanWithMultiplicityDegreePlusOne = this.getBasisFunctionSpanWithKnotMultiplicityEqualDegreePlusOne();
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if(spanWithMultiplicityDegreePlusOne[i]) {
                newControlPoints[i] = 0.0;
            } else {
                newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
            }
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }

    getBasisFunctionSpanWithKnotMultiplicityEqualDegreePlusOne(): boolean[] {
        let spanWithMultiplicityDegreePlusOne: Array<boolean> = [];
        for (let i = 0; i < this._controlPoints.length - 1; i++) {
            spanWithMultiplicityDegreePlusOne.push(false);
            const multiplicity = this.knotMultiplicity((i + 1));
            if(multiplicity >= (this.degree + 1)) {
                spanWithMultiplicityDegreePlusOne[i - this.degree] = true;
            }
        }
        return spanWithMultiplicityDegreePlusOne;
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