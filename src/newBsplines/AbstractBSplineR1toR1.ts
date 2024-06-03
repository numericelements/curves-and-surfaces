import { findSpan, clampingFindSpan, basisFunctions, basisFunctionsFromSequence } from "./Piegl_Tiller_NURBS_Book"
import { BSplineR1toR1Interface } from "./BSplineR1toR1Interface"
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1"
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";

export const CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION = 10e-8;
export const MAX_ITERATIONS_FOR_ZEROS_COMPUTATION = 1e6;
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
export abstract class AbstractBSplineR1toR1 implements BSplineR1toR1Interface {

    protected _controlPoints: number[] = [];
    protected _degree: number = 0;
    protected abstract _increasingKnotSequence: IncreasingOpenKnotSequenceInterface;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        this._controlPoints = [...controlPoints];
        this._degree = this.computeDegree(knots.length);
    }

    computeDegree(knotLength: number): number {
        let degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            const error = new ErrorLog(this.constructor.name, "computeDegree", "Negative degree BSplineR1toR1 are not supported.");
            error.logMessageToConsole();
        }
        return degree;
    }

    get degree() : number {
        return this._degree;
    }

    get controlPoints() : number[] {
        return [...this._controlPoints]
    }

    set controlPoints(controlPoints: number[]) {
        this._controlPoints = [...controlPoints];
        this._degree = this.computeDegree(this._increasingKnotSequence.length());
    }

    abstract get knots() : number[];

    abstract set knots(knots: number[]);


    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number): number {
        const span = this._increasingKnotSequence.findSpan(u);
        const basis = basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
        let result = 0;
        for (let i = 0; i < this._degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span.knotIndex - this._degree + i];
        }
        return result; 
    }

    abstract evaluateOutsideRefInterval(u: number): number;

    abstract derivative() : AbstractBSplineR1toR1;

    abstract bernsteinDecomposition() : BernsteinDecompositionR1toR1;

    distinctKnots(): number[] {
        return this._increasingKnotSequence.distinctAbscissae();
    }

    zeros(tolerance: number = CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION): number[] {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = this.clone();
        let greville : number[] = [];
        let maxError = tolerance * 2;
        let vertexIndex : number[] = [];

        let it = 0;

        while (maxError > tolerance && it < MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            it += 1
            let maximum = 0
            let newKnots : number[] = []

            vertexIndex = findControlPointsFollowingSignChanges(spline)
            greville = spline.grevilleAbscissae()

            for (let v of vertexIndex) {
                let uLeft = greville[v - 1] 
                let uRight = greville[v]
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft
                }
                if (uRight - uLeft > tolerance) {
                    let lineZero = this.robustFindLineZero(uLeft, spline.controlPoints[v-1], uRight, spline.controlPoints[v])
                    newKnots.push(0.05 * (uLeft + uRight) / 2 + 0.95 * lineZero)
                }
            }
            for (let knot of newKnots) {
                spline.insertKnot(knot)
            }
            maxError = maximum
        }
        let result: number[] = []
        if(it === MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            const error = new ErrorLog(this.constructor.name, "zeros", "Maximum number of iterations reached when computing zeros of BSplineR1toR1");
            error.logMessageToConsole();
            return result;
        }

        vertexIndex = findControlPointsFollowingSignChanges(spline)
        for (let v of vertexIndex) {
            result.push(greville[v])
        }
        return result
    }

    grevilleAbscissae(): number[] {
        const result = [];
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0;
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(i + 1),
                    new KnotIndexIncreasingSequence(i + this._degree));
            for (const knot of subSequence) {
                sum += knot;
            }
            result.push(sum / this._degree);
        }
        return result;
    }

    insertKnot(u: number, times: number = 1): void {
        if (times <= 0) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "knot multiplicity prescribed equals zero or is negative. No knot insertion.");
            warning.logMessageToConsole();
            return;
        }
        const index = this._increasingKnotSequence.findSpan(u);
        let multiplicity = 0;
        const newControlPoints = [];

        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
                && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.KnotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        if((multiplicity + times) > (this._degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ",u, " multiplicity + times = ", (multiplicity + times));
            error.logMessageToConsole();
            return;
        }

        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let newIndexStrictInc: KnotIndexStrictlyIncreasingSequence = new KnotIndexStrictlyIncreasingSequence();
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
            }
            for (let i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if(multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            } else if(multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                const newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            } else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            this._controlPoints = newControlPoints.slice();
        }
    }

    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        const result = this._increasingKnotSequence.knotMultiplicity(index);
        return result;
    }

    /**
     * Return a deep copy of this b-spline
     */
    abstract clone() : AbstractBSplineR1toR1;

    clamp(u: number): void {
        // Piegl and Tiller, The NURBS book, p: 151

        const index = this._increasingKnotSequence.findSpan(u);
        const newControlPoints = [];
        let multiplicity = 0;
        const indexPlusDegree = new KnotIndexIncreasingSequence(index.knotIndex + this.degree);

        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
                && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.KnotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        } else if(this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(indexPlusDegree)) < KNOT_COINCIDENCE_TOLERANCE) {
            let temporary_mult = 0;
            let tempIndex = new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1);
            while(tempIndex.knotIndex >= (index.knotIndex + this._degree)) {
                const tempIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(tempIndex);
                if(this.knotMultiplicity(tempIndexStrictInc) > temporary_mult) temporary_mult = this.knotMultiplicity(tempIndexStrictInc);
                tempIndex.knotIndex--;
            }
            // multiplicity = this.knotMultiplicity(index + this._degree);
            multiplicity = temporary_mult;
        }

        const times = this._degree - multiplicity + 1;
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let newIndexStrictInc: KnotIndexStrictlyIncreasingSequence = new KnotIndexStrictlyIncreasingSequence();
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                let subSequence: number[] = [];
                if((index.knotIndex - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                    new KnotIndexIncreasingSequence(index.knotIndex - multiplicity));
                } else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                    new KnotIndexIncreasingSequence(index.knotIndex + 1));
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
            if(multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            } else if(multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                const newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            } else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    }


    controlPolygonNumberOfSignChanges(): number {
        let result = 0;
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !==  Math.sign(this._controlPoints[i + 1])) {
                result += 1;
            }
        }
        return result;
    }

    controlPolygonZeros(): number[] {
        let result: Array<number> = [];
        let greville = this.grevilleAbscissae();
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !==  Math.sign(this._controlPoints[i + 1])) {
                result.push(this.findLineZero(  greville[i], 
                                                this._controlPoints[i],  
                                                greville[i + 1], 
                                                this._controlPoints[i + 1]));
            }
        }
        return result;
    }

    findLineZero(x1: number, y1: number, x2: number, y2: number): number {
        // find the zero of the line y = ax + b
        let a = (y2 - y1) / (x2 - x1)
        let b = y1 - a * x1
        return -b / a
    }

    robustFindLineZero(x1: number, y1: number, x2: number, y2: number): number {
        let result = this.findLineZero(x1, y1, x2, y2);
        if (isNaN(result)) {
            return x1;
        }
        return result;
    }

    
    zerosPolygonVsFunctionDiffViewer(tolerance: number = CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION): number[] {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = this.clone();
        // let spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice())
        let greville = spline.grevilleAbscissae()
        let maxError = tolerance * 2
        let vertexIndex = []

        let cpZeros = spline.controlPolygonNumberOfSignChanges()
        let result: Array<number> = []
        let lastInsertedKnot = 0

        while (maxError > tolerance) {
            let temp = spline.controlPolygonNumberOfSignChanges()
            if ( cpZeros !== temp ) {
                result.push(lastInsertedKnot)
            }
            cpZeros = temp

            let cpLeft = spline.controlPoints[0]
            vertexIndex = []
            let maximum = 0
            for (let index = 1; index < spline.controlPoints.length; index += 1) {
                let cpRight = spline.controlPoints[index]
                if (cpLeft <= 0 && cpRight > 0) {
                    vertexIndex.push(index)
                }
                if (cpLeft >= 0 && cpRight < 0) {
                    vertexIndex.push(index)
                }
                cpLeft = cpRight
            }
            for (let index of vertexIndex) {
                let uLeft = greville[index - 1]
                let uRight = greville[index]
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft
                }
                if (uRight - uLeft > tolerance) {
                    lastInsertedKnot = (uLeft + uRight) / 2
                    spline.insertKnot(lastInsertedKnot)
                    greville = spline.grevilleAbscissae()
                }

            }
            maxError = maximum
        }
        return result
    }
    
    getExtremumClosestToZero(): {location: number, value: number} {
        let locExtremum = RETURN_ERROR_CODE;
        let valExtremum = 0.0;
        const locExtrema = this.derivative().zeros();
        if(locExtrema.length > 1) {
            let closestVal = this.evaluate(locExtrema[0]);
            let locExtremum = locExtrema[0];
            for(let location = 1; location < locExtrema.length; location++) {
                const currentVal = this.evaluate(locExtrema[location]);
                if(Math.abs(currentVal) < Math.abs(closestVal)) {
                    closestVal = currentVal;
                    locExtremum = locExtrema[location];
                }
            }
            return {location: locExtremum, value: closestVal};
        } else if(locExtrema.length === 1) {
            return {location: locExtrema[0], value: this.evaluate(locExtrema[0])};
        }
        return {location: locExtremum, value: valExtremum};
    }

}


function findControlPointsFollowingSignChanges(spline: AbstractBSplineR1toR1) {

    let cpLeft = spline.controlPoints[0]
    let vertexIndex = []

    for (let index = 1; index < spline.controlPoints.length; index += 1) {
        let cpRight = spline.controlPoints[index]
        if (cpLeft <= 0 && cpRight > 0) {
            vertexIndex.push(index)
        }
        if (cpLeft >= 0 && cpRight < 0) {
            vertexIndex.push(index)
        }
        cpLeft = cpRight
    }

    if (spline.controlPoints[spline.controlPoints.length - 1] == 0) {
        vertexIndex.push(spline.controlPoints.length - 1)
    }

    return vertexIndex
}