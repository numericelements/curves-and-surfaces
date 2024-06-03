import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { IncreasingOpenKnotSequenceClosedCurve } from "./IncreasingOpenKnotSequenceClosedCurve";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { decomposeFunction, clampingFindSpan } from "./Piegl_Tiller_NURBS_Book";


/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
export class PeriodicBSplineR1toR1 extends AbstractBSplineR1toR1 {

    protected _increasingKnotSequence: IncreasingOpenKnotSequenceClosedCurve;

    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve(this._degree, knots);
    }

    get knots() : number[] {
        const knots: number[] = [];
        for(const knot of this._increasingKnotSequence) {
            if(knot !== undefined) knots.push(knot);
        }
        return knots;
    }

    get increasingKnotSequence(): IncreasingOpenKnotSequenceClosedCurve {
        return this._increasingKnotSequence;
    }

    bernsteinDecomposition(): BernsteinDecompositionR1toR1 {
        const s = this.clone();
        const degree = this._degree;
        let newControlPoints = [];
        let newKnots = [];
        if(degree === 0) {
            newControlPoints = s.controlPoints;
            newKnots = s.knots;
        } else {
            s.clamp(s.knots[degree]);
            s.clamp(s.knots[s.knots.length - degree - 1]);

            const indexKnotOrigin = s._increasingKnotSequence.getIndexKnotOrigin();
            const lastIndex = new KnotIndexIncreasingSequence(s._increasingKnotSequence.length() - indexKnotOrigin.knotIndex - 1);
            newControlPoints = s.controlPoints.slice(indexKnotOrigin.knotIndex, s.controlPoints.length - indexKnotOrigin.knotIndex);
            newKnots = s._increasingKnotSequence.extractSubsetOfAbscissae(indexKnotOrigin, lastIndex);
        }
        return new BernsteinDecompositionR1toR1(decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots)));
    }

    clone(): PeriodicBSplineR1toR1 {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._increasingKnotSequence.allAbscissae.slice());
    }

    derivative(): PeriodicBSplineR1toR1 {
        const newControlPoints = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            const indexIncSeq1 = new KnotIndexIncreasingSequence(i + this._degree + 1);
            const indexStrictIncSeq1 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq1);
            const indexIncSeq2 = new KnotIndexIncreasingSequence(i + 1);
            const indexStrictIncSeq2 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq2);
            if(indexStrictIncSeq1.knotIndex !== indexStrictIncSeq2.knotIndex) {
                const newCtrlPt = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree /
                    (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + this._degree + 1)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1))));
                    newControlPoints.push(newCtrlPt);
            }
        }
        const newKnots = this._increasingKnotSequence.decrementDegree().allAbscissae;
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }

    getBasisFunctionSpanWithKnotMultiplicityEqualDegreePlusOne(): boolean[] {
        let spanWithMultiplicityDegreePlusOne: Array<boolean> = [];
        for (let i = 0; i < this._controlPoints.length - 1; i++) {
            spanWithMultiplicityDegreePlusOne.push(false);
            const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(i + 1));
            const multiplicity = this.knotMultiplicity(indexStrictInc);
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
        return new BSplineR1toR2(cp, this._increasingKnotSequence.allAbscissae);

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