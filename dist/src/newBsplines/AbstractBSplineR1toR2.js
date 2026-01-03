"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyControlPoints = exports.AbstractBSplineR1toR2 = exports.TOL_KNOT_COINCIDENCE = exports.curveSegment = void 0;
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const Vector2d_1 = require("../mathVector/Vector2d");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
var curveSegment;
(function (curveSegment) {
    curveSegment[curveSegment["BEFORE"] = 0] = "BEFORE";
    curveSegment[curveSegment["AFTER"] = 1] = "AFTER";
})(curveSegment = exports.curveSegment || (exports.curveSegment = {}));
;
exports.TOL_KNOT_COINCIDENCE = 1.0E-8;
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
class AbstractBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._degree = this.computeDegree(knots.length);
        this.abstractConstructorInputParamAssessment(knots);
    }
    abstractConstructorInputParamAssessment(knots) {
        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
        let invalid = false;
        if (this.degree < 0) {
            error.addMessage("Negative degree for periodic B-Spline cannot be processed.");
            invalid = true;
        }
        else if (knots.length < (this.degree + 1)) {
            error.addMessage("Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            invalid = true;
        }
        if (invalid) {
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    computeDegree(knotLength) {
        let degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "computeDegree", "Negative degree for BSplines is inconsistent.");
            error.logMessage();
        }
        return degree;
    }
    get controlPoints() {
        return deepCopyControlPoints(this._controlPoints);
    }
    get degree() {
        return this._degree;
    }
    set controlPoints(controlPoints) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
    }
    getControlPoint(index) {
        return this._controlPoints[index].clone();
    }
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u) {
        const span = this._increasingKnotSequence.findSpan(u);
        const basis = (0, Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence)(span.knotIndex, u, this._increasingKnotSequence);
        let result = new Vector2d_1.Vector2d(0, 0);
        for (let i = 0; i < this._degree + 1; i += 1) {
            if (basis[i] !== 0.0) {
                result.x += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].x;
                result.y += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].y;
            }
        }
        return result;
    }
    scaleInputParamAssessment(factor) {
        if (factor <= 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "scaleInputParamAssessment", "Scale factor is negative or null. Cannot generate the scaled curve.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    getControlPointsX() {
        let result = [];
        for (let cp of this._controlPoints) {
            result.push(cp.x);
        }
        return result;
    }
    getControlPointsY() {
        let result = [];
        for (let cp of this._controlPoints) {
            result.push(cp.y);
        }
        return result;
    }
    getDistinctKnots() {
        return this._increasingKnotSequence.distinctAbscissae();
    }
    moveControlPoint(CPindex, deltaX, deltaY) {
        try {
            this.controlPointIndexInputParamAssessment(CPindex, "moveControlPoint");
            this._controlPoints[CPindex].x += deltaX;
            this._controlPoints[CPindex].y += deltaY;
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
        }
    }
    moveControlPoints(delta) {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        for (let i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.create(controlPoints, this.knots);
    }
    controlPointIndexInputParamAssessment(index, methodName) {
        if (index < 0 || index >= this._controlPoints.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, methodName, "Control point index is out of range: control point location cannot be prescribed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    }
    setControlPointPosition(index, value) {
        try {
            this.controlPointIndexInputParamAssessment(index, "setControlPointPosition");
            this._controlPoints[index] = value;
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
        }
    }
    // resetKnotAbscissaToOrigin(knotAbscissa: number[]): number[] {
    //     let result: number[] = [];
    //     if(Math.abs(knotAbscissa[0]) < TOL_KNOT_COINCIDENCE) {
    //         result = knotAbscissa.slice();
    //         const warning = new WarningLog(this.constructor.name, "resetKnotAbscissaToOrigin", "No need to reset the sequence of knot abscissa");
    //         warning.logMessage();
    //     } else {
    //         result.push(OPEN_KNOT_SEQUENCE_ORIGIN);
    //         for(let i= 1; i < knotAbscissa.length; i++) {
    //             result.push(knotAbscissa[i] - knotAbscissa[0]);
    //         }
    //     }
    //     return result;
    // }
    insertKnot(u, times = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0 || times > (this._degree + 1)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "Inconsistent multiplicity order of the knot insertion. No insertion performed.");
            error.logMessage();
            return;
        }
        const index = this._increasingKnotSequence.findSpan(u);
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let multiplicity = 0;
        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        let newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (let t = 0; t < times; t += 1) {
            const newControlPoints = [];
            let upperBound = 1;
            if ((index.knotIndex - this._degree + 1) < this._controlPoints.length && (index.knotIndex - this._degree + 1) > 0) {
                upperBound = index.knotIndex - this._degree + 1;
            }
            else if ((index.knotIndex - this._degree + 1) > 0) {
                upperBound = this._controlPoints.length;
            }
            for (let i = 0; i < upperBound; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            let subSequence = [];
            if ((index.knotIndex - this._degree + 1) >= 0) {
                if (index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            }
            else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), 
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                if (i > 0 && i < this._controlPoints.length) {
                    const offset = index.knotIndex - this._degree + 1;
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
            }
            let lowerBound = this._controlPoints.length - 1;
            if (index.knotIndex - multiplicity < this._controlPoints.length)
                lowerBound = index.knotIndex - multiplicity;
            for (let i = lowerBound; i < this._controlPoints.length; i += 1) {
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
            // index += 1;
        }
    }
    insertKnotBoehmAlgorithm(u, times = 1) {
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0 || times > (this._degree + 1)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithm", "The knot multiplicity prescribed is incompatible with the curve degree.");
            error.logMessage();
            return;
        }
        let index = this.findSpanBoehmAlgorithm(u);
        if (u > this._increasingKnotSequence.abscissaAtIndex(index)
            && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1))) {
            // if(times > )
        }
        let multiplicity = 0;
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        let newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (let t = 0; t < times; t += 1) {
            const newControlPoints = [];
            for (let i = 0; i < index.knotIndex; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            let subSequence = [];
            if ((index.knotIndex - this._degree + 1) >= 0) {
                if (index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            }
            else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), 
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }
            // const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
            // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                if ((i - 1) >= 0 && i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
                else if (i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = this._controlPoints[i].multiply(alpha);
                }
                else if ((i - 1) >= 0) {
                    newControlPoints[i] = this._controlPoints[i - 1].multiply(1 - alpha);
                }
                else {
                }
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
            multiplicity++;
            index.knotIndex++;
        }
    }
    findSpanBoehmAlgorithm(u) {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 1))) {
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 2);
        }
        // Do binary search
        let low = 0;
        let high = this._increasingKnotSequence.length() - 1 - this._degree;
        let i = Math.floor((low + high) / 2);
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i)) <= u && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)))) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i))) {
                high = i;
            }
            else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
    }
    knotMultiplicity(index) {
        const result = this._increasingKnotSequence.knotMultiplicity(index);
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
    isAbscissaCoincidingWithKnot(u) {
        return this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u);
    }
    getFirstKnotIndexCoincidentWithAbscissa(u) {
        let index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        for (let i = 0; i < this._increasingKnotSequence.length(); i++) {
            if (Math.abs(u - this.knots[i]) < exports.TOL_KNOT_COINCIDENCE) {
                index = i;
                break;
            }
        }
        if (index < this._degree || index > (this._increasingKnotSequence.length() - 1 - this._degree)) {
            index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    }
    clamp(u) {
        // Piegl and Tiller, The NURBS book, p: 151
        const index = this._increasingKnotSequence.findSpan(u);
        let indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        const newControlPoints = [];
        let multiplicity = 0;
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < exports.TOL_KNOT_COINCIDENCE) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        const times = this._degree - multiplicity + 1;
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if ((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                let subSequence = [];
                if ((index.knotIndex + this._degree - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + this._degree - multiplicity));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1));
                }
                const offset = index.knotIndex - this._degree + 1;
                for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
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
                indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    }
    flattenControlPointsArray() {
        const controlPointsArray = [];
        for (let i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y]);
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    }
}
exports.AbstractBSplineR1toR2 = AbstractBSplineR1toR2;
function deepCopyControlPoints(controlPoints) {
    let result = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;
