"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractBSplineR1toR1 = exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION = void 0;
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION = 10e-8;
exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION = 1e6;
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
class AbstractBSplineR1toR1 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [0], knots = [0, 1]) {
        this._controlPoints = [];
        this._degree = 0;
        this._controlPoints = [...controlPoints];
        this._degree = this.computeDegree(knots.length);
    }
    computeDegree(knotLength) {
        let degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "computeDegree", "Negative degree BSplineR1toR1 are not supported.");
            error.logMessage();
        }
        return degree;
    }
    get degree() {
        return this._degree;
    }
    get controlPoints() {
        return [...this._controlPoints];
    }
    set controlPoints(controlPoints) {
        this._controlPoints = [...controlPoints];
        this._degree = this.computeDegree(this._increasingKnotSequence.length());
    }
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u) {
        const span = this._increasingKnotSequence.findSpan(u);
        const basis = (0, Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence)(span.knotIndex, u, this._increasingKnotSequence);
        let result = 0;
        for (let i = 0; i < this._degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span.knotIndex - this._degree + i];
        }
        return result;
    }
    distinctKnots() {
        return this._increasingKnotSequence.distinctAbscissae();
    }
    zeros(tolerance = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION) {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = this.clone();
        let greville = [];
        let maxError = tolerance * 2;
        let vertexIndex = [];
        let it = 0;
        while (maxError > tolerance && it < exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            it += 1;
            let maximum = 0;
            let newKnots = [];
            vertexIndex = findControlPointsFollowingSignChanges(spline);
            greville = spline.grevilleAbscissae();
            for (let v of vertexIndex) {
                let uLeft = greville[v - 1];
                let uRight = greville[v];
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft;
                }
                if (uRight - uLeft > tolerance) {
                    let lineZero = this.robustFindLineZero(uLeft, spline.controlPoints[v - 1], uRight, spline.controlPoints[v]);
                    newKnots.push(0.05 * (uLeft + uRight) / 2 + 0.95 * lineZero);
                }
            }
            for (let knot of newKnots) {
                spline.insertKnot(knot);
            }
            maxError = maximum;
        }
        let result = [];
        if (it === exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "zeros", "Maximum number of iterations reached when computing zeros of BSplineR1toR1");
            error.logMessage();
            return result;
        }
        vertexIndex = findControlPointsFollowingSignChanges(spline);
        for (let v of vertexIndex) {
            result.push(greville[v]);
        }
        return result;
    }
    grevilleAbscissae() {
        const result = [];
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0;
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree));
            for (const knot of subSequence) {
                sum += knot;
            }
            result.push(sum / this._degree);
        }
        return result;
    }
    insertKnot(u, times = 1) {
        if (times <= 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "insertKnot", "knot multiplicity prescribed equals zero or is negative. No knot insertion.");
            warning.logMessage();
            return;
        }
        const index = this._increasingKnotSequence.findSpan(u);
        let multiplicity = 0;
        const newControlPoints = [];
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
            }
            for (let i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                const updatedSeq = this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
                this._increasingKnotSequence = updatedSeq.clone();
            }
            else if (multiplicity === 0 && t === 0) {
                const updatedSeq = this._increasingKnotSequence.insertKnot(u, 1);
                this._increasingKnotSequence = updatedSeq.clone();
                const newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                const updatedSeq = this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
                this._increasingKnotSequence = updatedSeq.clone();
            }
            this._controlPoints = newControlPoints.slice();
        }
    }
    knotMultiplicity(index) {
        const result = this._increasingKnotSequence.knotMultiplicity(index);
        return result;
    }
    clamp(u) {
        // Piegl and Tiller, The NURBS book, p: 151
        const index = this._increasingKnotSequence.findSpan(u);
        const newControlPoints = [];
        let multiplicity = 0;
        const indexPlusDegree = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + this.degree);
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        else if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(indexPlusDegree)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            let temporary_mult = 0;
            let tempIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1);
            while (tempIndex.knotIndex >= (index.knotIndex + this._degree)) {
                const tempIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(tempIndex);
                if (this.knotMultiplicity(tempIndexStrictInc) > temporary_mult)
                    temporary_mult = this.knotMultiplicity(tempIndexStrictInc);
                tempIndex.knotIndex--;
            }
            // multiplicity = this.knotMultiplicity(index + this._degree);
            multiplicity = temporary_mult;
        }
        const times = this._degree - multiplicity + 1;
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if ((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                let subSequence = [];
                if ((index.knotIndex - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1));
                }
                for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    const offset = index.knotIndex - this._degree + 1;
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
                }
            }
            for (let i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            }
            else if (multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                const newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    }
    controlPolygonNumberOfSignChanges() {
        let result = 0;
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result += 1;
            }
        }
        return result;
    }
    controlPolygonZeros() {
        let result = [];
        let greville = this.grevilleAbscissae();
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result.push(this.findLineZero(greville[i], this._controlPoints[i], greville[i + 1], this._controlPoints[i + 1]));
            }
        }
        return result;
    }
    findLineZero(x1, y1, x2, y2) {
        // find the zero of the line y = ax + b
        let a = (y2 - y1) / (x2 - x1);
        let b = y1 - a * x1;
        return -b / a;
    }
    robustFindLineZero(x1, y1, x2, y2) {
        let result = this.findLineZero(x1, y1, x2, y2);
        if (isNaN(result)) {
            return x1;
        }
        return result;
    }
    zerosPolygonVsFunctionDiffViewer(tolerance = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION) {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = this.clone();
        // let spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice())
        let greville = spline.grevilleAbscissae();
        let maxError = tolerance * 2;
        let vertexIndex = [];
        let cpZeros = spline.controlPolygonNumberOfSignChanges();
        let result = [];
        let lastInsertedKnot = 0;
        while (maxError > tolerance) {
            let temp = spline.controlPolygonNumberOfSignChanges();
            if (cpZeros !== temp) {
                result.push(lastInsertedKnot);
            }
            cpZeros = temp;
            let cpLeft = spline.controlPoints[0];
            vertexIndex = [];
            let maximum = 0;
            for (let index = 1; index < spline.controlPoints.length; index += 1) {
                let cpRight = spline.controlPoints[index];
                if (cpLeft <= 0 && cpRight > 0) {
                    vertexIndex.push(index);
                }
                if (cpLeft >= 0 && cpRight < 0) {
                    vertexIndex.push(index);
                }
                cpLeft = cpRight;
            }
            for (let index of vertexIndex) {
                let uLeft = greville[index - 1];
                let uRight = greville[index];
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft;
                }
                if (uRight - uLeft > tolerance) {
                    lastInsertedKnot = (uLeft + uRight) / 2;
                    spline.insertKnot(lastInsertedKnot);
                    greville = spline.grevilleAbscissae();
                }
            }
            maxError = maximum;
        }
        return result;
    }
    getExtremumClosestToZero() {
        let locExtremum = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        let valExtremum = 0.0;
        const locExtrema = this.derivative().zeros();
        if (locExtrema.length > 1) {
            let closestVal = this.evaluate(locExtrema[0]);
            let locExtremum = locExtrema[0];
            for (let location = 1; location < locExtrema.length; location++) {
                const currentVal = this.evaluate(locExtrema[location]);
                if (Math.abs(currentVal) < Math.abs(closestVal)) {
                    closestVal = currentVal;
                    locExtremum = locExtrema[location];
                }
            }
            return { location: locExtremum, value: closestVal };
        }
        else if (locExtrema.length === 1) {
            return { location: locExtrema[0], value: this.evaluate(locExtrema[0]) };
        }
        return { location: locExtremum, value: valExtremum };
    }
}
exports.AbstractBSplineR1toR1 = AbstractBSplineR1toR1;
function findControlPointsFollowingSignChanges(spline) {
    let cpLeft = spline.controlPoints[0];
    let vertexIndex = [];
    for (let index = 1; index < spline.controlPoints.length; index += 1) {
        let cpRight = spline.controlPoints[index];
        if (cpLeft <= 0 && cpRight > 0) {
            vertexIndex.push(index);
        }
        if (cpLeft >= 0 && cpRight < 0) {
            vertexIndex.push(index);
        }
        cpLeft = cpRight;
    }
    if (spline.controlPoints[spline.controlPoints.length - 1] == 0) {
        vertexIndex.push(spline.controlPoints.length - 1);
    }
    return vertexIndex;
}
