"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicBSplineR1toR1 = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const AbstractBSplineR1toR1_1 = require("./AbstractBSplineR1toR1");
const BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
const BSplineR1toR1_1 = require("./BSplineR1toR1");
const BSplineR1toR2_1 = require("./BSplineR1toR2");
const IncreasingOpenKnotSequenceClosedCurve_1 = require("./IncreasingOpenKnotSequenceClosedCurve");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
class PeriodicBSplineR1toR1 extends AbstractBSplineR1toR1_1.AbstractBSplineR1toR1 {
    constructor(controlPoints = [0], knots = [0, 1]) {
        super(controlPoints, knots);
        const maxMultiplicityOrder = this._degree + 1;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
    }
    get knots() {
        const knots = [];
        for (const knot of this._increasingKnotSequence) {
            if (knot !== undefined)
                knots.push(knot);
        }
        return knots;
    }
    get increasingKnotSequence() {
        return this._increasingKnotSequence;
    }
    bernsteinDecomposition() {
        const s = this.clone();
        const degree = this._degree;
        let newControlPoints = [];
        let newKnots = [];
        if (degree === 0) {
            newControlPoints = s.controlPoints;
            newKnots = s.knots;
        }
        else {
            s.clamp(s.knots[degree]);
            s.clamp(s.knots[s.knots.length - degree - 1]);
            const indexKnotOrigin = s._increasingKnotSequence.indexKnotOrigin;
            const lastIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(s._increasingKnotSequence.length() - indexKnotOrigin.knotIndex - 1);
            newControlPoints = s.controlPoints.slice(indexKnotOrigin.knotIndex, s.controlPoints.length - indexKnotOrigin.knotIndex);
            // newKnots = s._increasingKnotSequence.extractSubsetOfAbscissae(indexKnotOrigin, lastIndex);
            const indexInc = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexKnotOrigin);
            newKnots = s._increasingKnotSequence.extractSubsetOfAbscissae(indexInc, lastIndex);
        }
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1((0, Piegl_Tiller_NURBS_Book_1.decomposeFunction)(new BSplineR1toR1_1.BSplineR1toR1(newControlPoints, newKnots)));
    }
    clone() {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._increasingKnotSequence.allAbscissae.slice());
    }
    derivative() {
        const newControlPoints = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            const indexIncSeq1 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1);
            const indexStrictIncSeq1 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq1);
            const indexIncSeq2 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1);
            const indexStrictIncSeq2 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq2);
            if (indexStrictIncSeq1.knotIndex !== indexStrictIncSeq2.knotIndex) {
                const newCtrlPt = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree /
                    (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1))));
                newControlPoints.push(newCtrlPt);
            }
        }
        const newKnots = this._increasingKnotSequence.decrementMaxMultiplicityOrder().allAbscissae;
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }
    getBasisFunctionSpanWithKnotMultiplicityEqualDegreePlusOne() {
        let spanWithMultiplicityDegreePlusOne = [];
        for (let i = 0; i < this._controlPoints.length - 1; i++) {
            spanWithMultiplicityDegreePlusOne.push(false);
            const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1));
            const multiplicity = this.knotMultiplicity(indexStrictInc);
            if (multiplicity >= (this.degree + 1)) {
                spanWithMultiplicityDegreePlusOne[i - this.degree] = true;
            }
        }
        return spanWithMultiplicityDegreePlusOne;
    }
    curve() {
        let x = this.grevilleAbscissae();
        let cp = [];
        for (let i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._increasingKnotSequence.allAbscissae);
    }
    evaluateOutsideRefInterval(u) {
        let result = 0.0;
        const knots = this.distinctKnots().slice();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessage();
        }
        return result;
    }
}
exports.PeriodicBSplineR1toR1 = PeriodicBSplineR1toR1;
