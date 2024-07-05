import { findSpan, clampingFindSpan, basisFunctions, basisFunctionsFromSequence } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { BSplineR1toR2Interface as BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { OPEN_KNOT_SEQUENCE_ORIGIN } from "./AbstractOpenKnotSequenceCurve";
import { IncreasingKnotSequenceInterface } from "./IncreasingKnotSequenceInterface";

export enum curveSegment {BEFORE, AFTER};
export const TOL_KNOT_COINCIDENCE = 1.0E-8;

/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export abstract class AbstractBSplineR1toR2 implements BSplineR1toR2Interface {

    protected _controlPoints: Vector2d[];
    protected _degree: number;
    protected abstract _increasingKnotSequence: IncreasingKnotSequenceInterface;
    // protected abstract _increasingKnotSequence: IncreasingOpenKnotSequenceInterface;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._degree = this.computeDegree(knots.length);
    }

    computeDegree(knotLength: number): number {
        let degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            const error = new ErrorLog(this.constructor.name, "computeDegree", "Negative degree for BSplines is inconsistent.");
            error.logMessageToConsole();
        }
        return degree;
    }

    get controlPoints(): Vector2d[] {
        return deepCopyControlPoints(this._controlPoints);
    }

    get degree() : number {
        return this._degree;
    }

    abstract get freeControlPoints(): Vector2d[];

    set controlPoints(controlPoints: Vector2d[]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
    }

    abstract get knots() : number[];

    abstract set knots(knots: number[]);

    getControlPoint(index: number): Vector2d {
        return this._controlPoints[index].clone();
    }


    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number) : Vector2d {
        const span = this._increasingKnotSequence.findSpan(u);
        const basis = basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
        let result = new Vector2d(0, 0);
        for (let i = 0; i < this._degree + 1; i += 1) {
            if(basis[i] !== 0.0) {
                result.x += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].x;
                result.y += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].y;
            }
        }
        return result;
    }

    /**
     * Return a deep copy of this b-spline
     */
    abstract clone() : AbstractBSplineR1toR2;

    /**
     * Return a b-spline of derived class type
     */
    // hereunder former version of the method
    // protected abstract factory(controlPoints: readonly Vector2d[], knots: readonly number[]): AbstractBSplineR1toR2;
    protected abstract factory(controlPoints: Vector2d[], knots: number[]): AbstractBSplineR1toR2;

    abstract evaluateOutsideRefInterval(u: number): Vector2d;

    abstract elevateDegree(): void;

    abstract optimizerStep(step: number[]) : void;

    abstract scale(factor: number): AbstractBSplineR1toR2;

    abstract scaleX(factor: number): AbstractBSplineR1toR2;

    abstract scaleY(factor: number): AbstractBSplineR1toR2;

    abstract degreeIncrement(): AbstractBSplineR1toR2 | undefined;

    getControlPointsX(): number[] {
        let result: number[] = [];
        for (let cp of this._controlPoints) {
            result.push(cp.x);
        }
        return result;
    }

    getControlPointsY(): number[] {
        let result: number[] = [];
        for (let cp of this._controlPoints) {
            result.push(cp.y);
        }
        return result;
    }

    getDistinctKnots(): number[] {
        return this._increasingKnotSequence.distinctAbscissae();
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number): void {
        if (i < 0 || i >= this._controlPoints.length - this._degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this._controlPoints[i].x += deltaX;
        this._controlPoints[i].y += deltaY;
    }

    moveControlPoints(delta: Vector2d[]): BSplineR1toR2Interface {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        for (let i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.factory(controlPoints, this.knots);
    }

    setControlPointPosition(index: number, value: Vector2d): void {
        this._controlPoints[index] =  value;
    }

    resetKnotAbscissaToOrigin(knotAbscissa: number[]): number[] {
        let result: number[] = [];
        if(Math.abs(knotAbscissa[0]) < TOL_KNOT_COINCIDENCE) {
            result = knotAbscissa.slice();
            const warning = new WarningLog(this.constructor.name, "resetKnotAbscissaToOrigin", "No need to reset the sequence of knot abscissa");
            warning.logMessageToConsole();
        } else {
            result.push(OPEN_KNOT_SEQUENCE_ORIGIN);
            for(let i= 1; i < knotAbscissa.length; i++) {
                result.push(knotAbscissa[i] - knotAbscissa[0]);
            }
        }
        return result;
    }

    insertKnot(u: number, times: number = 1): void {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0 || times > (this._degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "insertKnot", "Inconsistent multiplicity order of the knot insertion. No insertion performed.");
            error.logMessageToConsole();
            return;
        }
        const index = this._increasingKnotSequence.findSpan(u);
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let multiplicity = 0;

        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        if((multiplicity + times) > (this._degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ",u, " multiplicity + times = ", (multiplicity + times));
            error.logMessageToConsole();
            return;
        }

        let newIndexStrictInc: KnotIndexStrictlyIncreasingSequence = new KnotIndexStrictlyIncreasingSequence();
        for (let t = 0; t < times; t += 1) {
            const newControlPoints = [];
            let upperBound = 1;
            if ((index.knotIndex - this._degree + 1) < this._controlPoints.length && (index.knotIndex - this._degree + 1) > 0) {
                upperBound = index.knotIndex - this._degree + 1
            } else if((index.knotIndex - this._degree + 1) > 0) {
                upperBound = this._controlPoints.length;
            }
            for (let i = 0; i < upperBound; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            let subSequence: number[] = [];
            if((index.knotIndex - this._degree + 1) >= 0) {
                if(index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                } else{
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            } else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0),
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }

            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                if(i > 0 && i < this._controlPoints.length) {
                    const offset = index.knotIndex - this._degree + 1;
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
            }
            let lowerBound = this._controlPoints.length - 1;
            if(index.knotIndex - multiplicity < this._controlPoints.length) lowerBound = index.knotIndex - multiplicity;
            for (let i = lowerBound; i < this._controlPoints.length; i += 1) {
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
            // index += 1;
        }

    }

    insertKnotBoehmAlgorithm(u: number, times: number = 1): void {
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0 || times > (this._degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithm", "The knot multiplicity prescribed is incompatible with the curve degree.");
            error.logMessageToConsole();
            return;
        }
        let index = this.findSpanBoehmAlgorithm(u);
        if(u > this._increasingKnotSequence.abscissaAtIndex(index)
            && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(index.knotIndex + 1))) {
            // if(times > )
        }
        let multiplicity = 0;
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }

        let newIndexStrictInc: KnotIndexStrictlyIncreasingSequence = new KnotIndexStrictlyIncreasingSequence();
        for (let t = 0; t < times; t += 1) {
            const newControlPoints = [];
            for (let i = 0; i < index.knotIndex; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            let subSequence: number[] = [];
            if((index.knotIndex - this._degree + 1) >= 0) {
                if(index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                } else{
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            } else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0),
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }

            // const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
            // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                if((i - 1) >= 0 && i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                } else if(i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = this._controlPoints[i].multiply(alpha);
                } else if((i - 1) >= 0) {
                    newControlPoints[i] = this._controlPoints[i - 1].multiply(1 - alpha);
                } else {

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
        }
    }

    findSpanBoehmAlgorithm(u: number): KnotIndexIncreasingSequence {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 1))) {
            return new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 2);
        }
        // Do binary search
        let low = 0;
        let high = this._increasingKnotSequence.length() - 1 - this._degree;
        let i = Math.floor((low + high) / 2);
    
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)) <= u && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1)))) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i))) {
                high = i;
            } else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
        }
        return new KnotIndexIncreasingSequence(i);
    }

    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        const result = this._increasingKnotSequence.knotMultiplicity(index);
        return result;
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

    isAbscissaCoincidingWithKnot(u: number): boolean {
        return this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u);
    }

    getFirstKnotIndexCoincidentWithAbscissa(u: number): KnotIndexIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        for(let i = 0; i < this._increasingKnotSequence.length(); i++) {
            if(Math.abs(u - this.knots[i]) < TOL_KNOT_COINCIDENCE) {
                index = i;
                break;
            }
        }
        if(index < this._degree || index > ( this._increasingKnotSequence.length() - 1 - this._degree)) {
            index = RETURN_ERROR_CODE;
        }
        return new KnotIndexIncreasingSequence(index);
    }

    clamp(u: number): void {
        // Piegl and Tiller, The NURBS book, p: 151

        const index = this._increasingKnotSequence.findSpan(u);
        let indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        const newControlPoints = [];

        let multiplicity = 0;
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < TOL_KNOT_COINCIDENCE) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }

        const times = this._degree - multiplicity + 1;
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                let subSequence: number[] = [];
                if((index.knotIndex + this._degree - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                    new KnotIndexIncreasingSequence(index.knotIndex + this._degree - multiplicity));
                } else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                    new KnotIndexIncreasingSequence(index.knotIndex + 1));
                }
                const offset = index.knotIndex - this._degree + 1;
                for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha))
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
                indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    }

    flattenControlPointsArray(): number[] {
        const controlPointsArray: number[][] = [];
        for(let i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y])
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, [])
    }

    /**
     * 
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSplineR1toR2 section
     */
    abstract extract(fromU: number, toU: number) : AbstractBSplineR1toR2;

}

export function deepCopyControlPoints(controlPoints: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}


