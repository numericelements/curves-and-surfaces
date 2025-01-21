"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetKnotAbscissaeToOrigin = exports.decomposeFunction = exports.basisFunctionsFromSequence = exports.basisFunctions = exports.clampingFindSpan = exports.findSpan = exports.WM_KNOT_SEQUENCE_ORIGIN_ALREADY_ZERO = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var KnotSequences_2 = require("../namedConstants/KnotSequences");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("./IncreasingPeriodicKnotSequenceClosedCurve");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
exports.WM_KNOT_SEQUENCE_ORIGIN_ALREADY_ZERO = "No need to reset the sequence of knot abscissae.";
/**
 * Returns the span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function findSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        console.log("u: " + u);
        console.log("knots: " + knots);
        console.log("degree: " + degree);
        // throw new Error("Error: parameter u is outside valid span");
        var error = new ErrorLoging_1.ErrorLog("function", "findSpan", "parameter u is outside valid span");
        error.logMessage();
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 2;
    }
    // Do binary search
    var low = degree;
    var high = knots.length - 1 - degree;
    var i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.findSpan = findSpan;
/**
 * Returns the span index used for clamping a periodic B-Spline
 * Note: The only difference with findSpan is the special case u = knots[-degree - 1]
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function clampingFindSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        var sameKnot = knots[knots.length - 1];
        var returnIndex = knots.length - degree - 1;
        for (var i_1 = knots.length - 2; i_1 > knots.length - degree - 2; i_1--) {
            if (sameKnot === knots[i_1]) {
                returnIndex = returnIndex - 1;
            }
            else {
                sameKnot = knots[i_1];
            }
        }
        console.log("findSpan index = " + (knots.length - degree - 1) + " returnIndex = " + returnIndex);
        // return knots.length - degree - 1;
        return returnIndex;
    }
    // Do binary search
    var low = degree;
    var high = knots.length - 1 - degree;
    var i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.clampingFindSpan = clampingFindSpan;
/**
 * Returns the basis functions values
 * @param span span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns the array of values evaluated at u
 */
function basisFunctions(span, u, knots, degree) {
    // Bibliographic reference : The NURBS BOOK, p.70
    var result = [1];
    var left = [];
    var right = [];
    for (var j = 1; j <= degree; j += 1) {
        left[j] = u - knots[span + 1 - j];
        right[j] = knots[span + j] - u;
        var saved = 0.0;
        for (var r = 0; r < j; r += 1) {
            var temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}
exports.basisFunctions = basisFunctions;
// export function basisFunctionsFromSequence(span: number, u: number, knotSequence: IncreasingOpenKnotSequenceInterface): number[] {
function basisFunctionsFromSequence(span, u, knotSequence) {
    // Bibliographic reference : The NURBS BOOK, p.70
    var result = [1];
    var left = [0];
    var right = [0];
    var strictIncSeqMaxIndex = knotSequence.distinctAbscissae().length - 1;
    var multiplicityLastKnot = knotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictIncSeqMaxIndex));
    var degree = knotSequence.maxMultiplicityOrder - 1;
    if (knotSequence instanceof IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve)
        degree = knotSequence.maxMultiplicityOrder;
    for (var j = 1; j <= degree; j += 1) {
        var knotRight = Infinity;
        var knotLeft = Infinity;
        if (!(knotSequence instanceof IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve)) {
            var indexRight = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(span + j);
            var indexLeft = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(span + 1 - j);
            knotRight = knotSequence.abscissaAtIndex(indexRight);
            knotLeft = knotSequence.abscissaAtIndex(indexLeft);
        }
        else {
            if ((span + j) >= knotSequence.allAbscissae.length - multiplicityLastKnot) {
                var indexRight = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence((span + j) - knotSequence.allAbscissae.length + multiplicityLastKnot);
                knotRight = knotSequence.abscissaAtIndex(indexRight) + knotSequence.getPeriod();
            }
            else {
                knotRight = knotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(span + j));
            }
            if ((span + 1 - j) < 0) {
                var indexLeft = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence((knotSequence.allAbscissae.length + (span + 1 - j) - multiplicityLastKnot));
                knotLeft = knotSequence.abscissaAtIndex(indexLeft) - knotSequence.getPeriod();
            }
            else {
                knotLeft = knotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(span + 1 - j));
            }
        }
        left[j] = u - knotLeft;
        right[j] = knotRight - u;
        var saved = 0.0;
        for (var r = 0; r < j; r += 1) {
            var temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}
exports.basisFunctionsFromSequence = basisFunctionsFromSequence;
/**
 * Decompose a BSpline function into Bézier segments
 */
function decomposeFunction(spline) {
    //Piegl and Tiller, The NURBS book, p.173
    var result = [];
    var number_of_bezier_segments = spline.distinctKnots().length - 1;
    for (var i = 0; i < number_of_bezier_segments; i += 1) {
        result.push([]);
    }
    var a = 0;
    var b = 0;
    var index = findSpan(ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL, spline.knots, spline.degree);
    var indexIncSeq = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    var indexStrictIncSeq = spline.increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq);
    if (spline.degree > 0) {
        for (var i = 0; i <= spline.degree; i += 1) {
            result[0][i] = spline.controlPoints[i];
        }
        a = spline.degree;
        b = spline.degree + 1;
    }
    else if (spline.degree === 0 && spline.knotMultiplicity(indexStrictIncSeq) > 1) {
        console.log("multiplicity 0:", spline.knotMultiplicity(indexStrictIncSeq));
        // result[0][0] = spline.controlPoints[0];
        // a = spline.degree;
        // b = spline.degree + 1;
        result[0][0] = spline.controlPoints[1];
        a = spline.degree + 1;
        b = spline.degree + 2;
    }
    else if (spline.degree === 0 && spline.knotMultiplicity(indexStrictIncSeq) === 1) {
        result[0][0] = spline.controlPoints[0];
        a = spline.degree;
        b = spline.degree + 1;
    }
    var bezier_segment = 0;
    var alphas = [];
    while (b < spline.knots.length - 1) {
        var i = b;
        while (b < spline.knots.length - 1 && spline.knots[b + 1] === spline.knots[b]) {
            b += 1;
        }
        var mult = b - i + 1;
        if (mult < spline.degree) {
            var numer = spline.knots[b] - spline.knots[a]; // Numerator of alpha
            // Compute and store alphas
            for (var j = spline.degree; j > mult; j -= 1) {
                alphas[j - mult - 1] = numer / (spline.knots[a + j] - spline.knots[a]);
            }
            var r = spline.degree - mult; // insert knot r times
            for (var j = 1; j <= r; j += 1) {
                var save = r - j;
                var s = mult + j; // this many new controlPoints
                for (var k = spline.degree; k >= s; k -= 1) {
                    var alpha = alphas[k - s];
                    result[bezier_segment][k] = (result[bezier_segment][k] * alpha) + (result[bezier_segment][k - 1] * (1 - alpha));
                }
                if (b < spline.knots.length) {
                    result[bezier_segment + 1][save] = result[bezier_segment][spline.degree]; // next segment
                }
            }
        }
        bezier_segment += 1; // Bezier segment completed
        if (b < spline.knots.length - 1) {
            //initialize next bezier_segment
            for (i = Math.max(0, spline.degree - mult); i <= spline.degree; i += 1) {
                result[bezier_segment][i] = spline.controlPoints[b - spline.degree + i];
            }
            a = b;
            b += 1;
        }
    }
    return result;
}
exports.decomposeFunction = decomposeFunction;
// export function resetKnotAbscissaeToOrigin(knotAbscissa: number[]): number[] {
function resetKnotAbscissaeToOrigin(knotAbscissa, indexOrigin) {
    if (indexOrigin === void 0) { indexOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0); }
    if (indexOrigin.knotIndex < 0 || indexOrigin.knotIndex >= knotAbscissa.length) {
        var error = new ErrorLoging_1.ErrorLog("function", "resetKnotAbscissaToOrigin", "Knot index out of bounds. Cannot reset knot abscissae to origin.");
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
    // for(let i = 1; i < knotAbscissa.length; i++) {
    //     const diff = knotAbscissa[i] - knotAbscissa[i - 1];
    //     if(diff < KNOT_COINCIDENCE_TOLERANCE || diff < 0) {
    //         const error = new ErrorLog("function", "resetKnotAbscissaToOrigin", "Knot abscissae are either too close to each other or not strictly increasing. Cannot reset knot abscissae to origin.");
    //         console.log(error.generateMessageString());
    //         throw new Error(error.generateMessageString());
    //     }
    // }
    var result = [];
    // if(Math.abs(knotAbscissa[0]) < (OPEN_KNOT_SEQUENCE_ORIGIN + KNOT_COINCIDENCE_TOLERANCE)) {
    if (Math.abs(knotAbscissa[indexOrigin.knotIndex]) < (KnotSequences_2.KNOT_SEQUENCE_ORIGIN + KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE)) {
        result = knotAbscissa.slice();
        var warning = new ErrorLoging_1.WarningLog("function", "resetKnotAbscissaToOrigin", exports.WM_KNOT_SEQUENCE_ORIGIN_ALREADY_ZERO);
        warning.logMessage();
    }
    else {
        // result.push(OPEN_KNOT_SEQUENCE_ORIGIN);
        // for(let i = 1; i < knotAbscissa.length; i++) {
        //     result.push(knotAbscissa[i] - knotAbscissa[indexOrigin.knotIndex]);
        // }
        for (var i = 0; i < knotAbscissa.length; i++) {
            var newAbscissa = knotAbscissa[i] - knotAbscissa[indexOrigin.knotIndex];
            if (Math.abs(newAbscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                newAbscissa = KnotSequences_2.KNOT_SEQUENCE_ORIGIN;
            }
            result.push(newAbscissa);
        }
    }
    return result;
}
exports.resetKnotAbscissaeToOrigin = resetKnotAbscissaeToOrigin;
