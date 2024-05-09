import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { LOWER_BOUND_CURVE_INTERVAL } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { BSplineR1toR1 } from "./BSplineR1toR1";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { KnotIndexIncreasingSequence } from "./Knot";

/**
 * Returns the span index
 * @param u parameter
 * @param knots knot vector 
 * @param degree degree 
 * @returns span index i for which knots[i] ≤ u < knots[i+1] 
 */
export function findSpan(u: number, knots: Array<number>, degree: number): number {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        console.log("u: " + u);
        console.log("knots: " + knots);
        console.log("degree: " + degree);
        // throw new Error("Error: parameter u is outside valid span");
        let error = new ErrorLog("function", "findSpan", "parameter u is outside valid span");
        error.logMessageToConsole();
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 2;
    }
    // Do binary search
    let low = degree;
    let high = knots.length - 1 - degree;
    let i = Math.floor((low + high) / 2);

    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        } else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}

/**
 * Returns the span index used for clamping a periodic B-Spline
 * Note: The only difference with findSpan is the special case u = knots[-degree - 1]
 * @param u parameter
 * @param knots knot vector 
 * @param degree degree 
 * @returns span index i for which knots[i] ≤ u < knots[i+1] 
 */
export function clampingFindSpan(u: number, knots: Array<number>, degree: number): number {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        let sameKnot = knots[knots.length - 1];
        let returnIndex = knots.length - degree - 1;
        for(let i = knots.length - 2; i > knots.length - degree - 2; i--) {
            if(sameKnot === knots[i]) {
                returnIndex = returnIndex -1;
            } else {
                sameKnot = knots[i];
            }
        }
        console.log("findSpan index = " + (knots.length - degree - 1) + " returnIndex = " + returnIndex);
        // return knots.length - degree - 1;
        return returnIndex;
    }
    // Do binary search
    let low = degree;
    let high = knots.length - 1 - degree;
    let i = Math.floor((low + high) / 2);

    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        } else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}

/**
 * Returns the basis functions values
 * @param span span index 
 * @param u parameter
 * @param knots knot vector
 * @param degree degree 
 * @returns the array of values evaluated at u
 */
export function basisFunctions(span: number, u: number, knots: number[], degree: number): number[] {
    // Bibliographic reference : The NURBS BOOK, p.70
    let result: Array<number> = [1];
    let left: Array<number> = [];
    let right: Array<number> = [];
    for (let j = 1; j <= degree; j += 1) {
        left[j] = u - knots[span + 1 - j];
        right[j] = knots[span + j] - u;
        let saved = 0.0;
        for (let r = 0; r < j; r += 1) {
            let temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}
export function basisFunctionsFromSequence(span: number, u: number, knotSequence: IncreasingOpenKnotSequenceInterface): number[] {
    // Bibliographic reference : The NURBS BOOK, p.70
    let result: Array<number> = [1];
    let left: Array<number> = [];
    let right: Array<number> = [];
    for (let j = 1; j <= knotSequence.degree; j += 1) {
        left[j] = u - knotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(span + 1 - j));
        right[j] = knotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(span + j)) - u;
        let saved = 0.0;
        for (let r = 0; r < j; r += 1) {
            let temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}

/**
 * Decompose a BSpline function into Bézier segments
 */
export function decomposeFunction(spline: BSplineR1toR1): number[][] {
    //Piegl and Tiller, The NURBS book, p.173

    let result: number[][] = []

    const number_of_bezier_segments = spline.distinctKnots().length - 1
    for (let i = 0; i < number_of_bezier_segments; i += 1) {
        result.push([]);
    }

    let a = 0;
    let b = 0;
    let index = findSpan(LOWER_BOUND_CURVE_INTERVAL, spline.knots, spline.degree);
    if(spline.degree > 0) {
        for (let i = 0; i <= spline.degree; i += 1) {
            result[0][i] = spline.controlPoints[i];
        }
        a = spline.degree;
        b = spline.degree + 1;
    } else if(spline.degree === 0 && spline.knotMultiplicity(index) > 1) {
        console.log("multiplicity 0:",spline.knotMultiplicity(index));
        // result[0][0] = spline.controlPoints[0];
        // a = spline.degree;
        // b = spline.degree + 1;
        
        result[0][0] = spline.controlPoints[1];
        a = spline.degree + 1;
        b = spline.degree + 2;
    } else if(spline.degree === 0 && spline.knotMultiplicity(index) === 1) {
        result[0][0] = spline.controlPoints[0];
        a = spline.degree;
        b = spline.degree + 1;
    }

    let bezier_segment = 0;
    let alphas: number[] = [];
    while (b < spline.knots.length - 1) {
        let i = b;
        while (b < spline.knots.length - 1 && spline.knots[b + 1] === spline.knots[b]) {
            b += 1;
        }

        let mult = b - i + 1;
        if (mult < spline.degree) {
            let numer = spline.knots[b] - spline.knots[a]; // Numerator of alpha
            // Compute and store alphas
            for (let j = spline.degree; j > mult; j -= 1) {
                alphas[j - mult - 1] = numer / (spline.knots[a + j] - spline.knots[a]);
            }
            let r = spline.degree - mult; // insert knot r times
            for (let j = 1; j <= r; j += 1) {
                let save = r - j;
                let s = mult + j; // this many new controlPoints
                for (let k = spline.degree; k >= s; k -= 1) {
                    let alpha = alphas[k - s];
                    result[bezier_segment][k] = (result[bezier_segment][k] * alpha) + (result[bezier_segment][k - 1] * (1 - alpha));
                }
                if (b < spline.knots.length) {
                    result[bezier_segment + 1][save] = result[bezier_segment][spline.degree]; // next segment
                }
            }
        }

        bezier_segment += 1;  // Bezier segment completed

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
