import { findSpan, clampingFindSpan, basisFunctions, basisFunctionsFromSequence } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { BSplineR1toR2Interface as BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "./PeriodicBSplineR1toR2";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";

export enum curveSegment {BEFORE, AFTER};
export const TOL_KNOT_COINCIDENCE = 1.0E-8;

/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export abstract class AbstractBSplineR1toR2 implements BSplineR1toR2Interface {

    protected _controlPoints: Vector2d[];
    protected _knots: number[];
    protected _degree: number;
    protected abstract _increasingKnotSequence: IncreasingOpenKnotSequenceInterface;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._knots = [...knots];
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

    // computeDegree(): number {
    //     let degree = this._knots.length - this._controlPoints.length - 1;
    //     if (degree < 0) {
    //         const error = new ErrorLog(this.constructor.name, "computeDegree", "Negative degree for BSplines is inconsistent.");
    //         error.logMessageToConsole();
    //     }
    //     return degree;
    // }

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
    // get knots() : number[] {
    //     return [...this._knots];
    // }

    abstract set knots(knots: number[]);
    // set knots(knots: number[]) {
    //     this._knots = [...knots];
    //     this._degree = this.computeDegree();
    // }

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
            result.x += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].y;
        }
        return result;
    }
    // evaluate(u: number) : Vector2d {
    //     const span = findSpan(u, this._knots, this._degree);
    //     const basis = basisFunctions(span, u, this._knots, this._degree);
    //     let result = new Vector2d(0, 0);
    //     for (let i = 0; i < this._degree + 1; i += 1) {
    //         result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
    //         result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
    //     }
    //     return result;
    // }

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

    abstract degreeIncrement(): AbstractBSplineR1toR2;

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
    // getDistinctKnots(): number[] {
    //     let result: number[] = [this._knots[0]];
    //     let temp = result[0];
    //     for (let i = 1; i < this._knots.length; i += 1) {
    //         if (this._knots[i] !== temp) {
    //             result.push(this._knots[i]);
    //             temp = this._knots[i];
    //         }
    //     }
    //     return result;
    // }

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
    // moveControlPoints(delta: Vector2d[]): AbstractBSplineR1toR2 {
    //     const n = this._controlPoints.length;
    //     if (delta.length !== n) {
    //         throw new Error("Array of unexpected dimension");
    //     }
    //     let controlPoints = this._controlPoints;
    //     for (let i = 0; i < n; i += 1) {
    //         controlPoints[i] = controlPoints[i].add(delta[i]);
    //     }
    //     return this.factory(controlPoints, this._knots);
    // }

    setControlPointPosition(index: number, value: Vector2d): void {
        this._controlPoints[index] =  value;
    }

    insertKnot(u: number, times: number = 1): void {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0 || times > (this._degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "insertKnot", "Inconsistent multiplicity order of the knot insertion. No insertion performed.");
            error.logMessageToConsole();
            return;
        }
        
        const index = this._increasingKnotSequence.findSpan(u);
        let multiplicity = 0;

        if (this._increasingKnotSequence.KnotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(index.knotIndex);
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
            const newControlPoints = [];
            for (let i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
            new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
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
            // index += 1;
        }

    }
    // insertKnot(u: number, times: number = 1): void {
    //     // Piegl and Tiller, The NURBS book, p: 151
    //     if (times <= 0 || times > (this._degree + 1)) {
    //         return;
    //     }
        
    //     let index = findSpan(u, this._knots, this._degree);
    //     let multiplicity = 0;

    //     if (u === this._knots[index]) {
    //         multiplicity = this.knotMultiplicity(index);
    //     }

    //     for (let t = 0; t < times; t += 1) {
    //         let newControlPoints = [];
    //         for (let i = 0; i < index - this._degree + 1; i += 1) {
    //             newControlPoints[i] = this._controlPoints[i];
    //         }
    //         for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
    //             let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
    //             newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
    //         }
    //         for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
    //             newControlPoints[i + 1] = this._controlPoints[i];
    //         }
    //         this._knots.splice(index + 1, 0, u);
    //         this._controlPoints = newControlPoints.slice();
    //         multiplicity += 1;
    //         index += 1;
    //     }

    // }
    // insertKnot(u: number, times: number = 1): void {
    //     // Piegl and Tiller, The NURBS book, p: 151
    //     if (times <= 0 || times > (this._degree + 1)) {
    //         return;
    //     }
        
    //     let index = findSpan(u, this._knots, this._degree);
    //     let multiplicity = 0;

    //     if (u === this._knots[index]) {
    //         multiplicity = this.knotMultiplicity(index);
    //     }

    //     for (let t = 0; t < times; t += 1) {
    //         let newControlPoints = [];
    //         for (let i = 0; i < index - this._degree + 1; i += 1) {
    //             newControlPoints[i] = this._controlPoints[i];
    //         }
    //         for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
    //             let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
    //             newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
    //         }
    //         for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
    //             newControlPoints[i + 1] = this._controlPoints[i];
    //         }
    //         this._knots.splice(index + 1, 0, u);
    //         this._controlPoints = newControlPoints.slice();
    //         multiplicity += 1;
    //         index += 1;
    //     }

    // }

    insertKnotBoehmAlgorithm(u: number, times: number = 1): void {
        // Uses Boehm algorithm without restristion on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0) {
            return;
        }
        let index = this.findSpanBoehmAlgorithm(u, this._knots, this._degree);
        if(u > this._knots[index] && u < this._knots[index + 1]) {
            // if(times > )
        }
        let multiplicity = 0;

        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    }

    findSpanBoehmAlgorithm(u: number, knots: Array<number>, degree: number): number {
        // Special case
        if (u === knots[knots.length - degree - 1]) {
            return knots.length - degree - 2;
        }
        // Do binary search
        let low = 0;
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

    knotMultiplicity(indexFromFindSpan: number): number {
        let result: number = 0;
        let i = 0;
        while (this._knots[indexFromFindSpan + i] === this._knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    grevilleAbscissae(): number[] {
        let result = [];
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this._degree + 1; j += 1) {
                sum += this._knots[j];
            }
            result.push(sum / this._degree);
        }
        return result;
    }

    isAbscissaCoincidingWithKnot(u: number): boolean {
        let coincident = false;
        const knots = this.getDistinctKnots();
        for(let knot of knots) {
            if(Math.abs(u - knot) < TOL_KNOT_COINCIDENCE) coincident = true;
        }
        return coincident;
    }

    getFirstKnotIndexCoincidentWithAbscissa(u: number): number {
        let index = RETURN_ERROR_CODE;
        for(let i = 0; i < this._knots.length; i++) {
            if(Math.abs(u - this._knots[i]) < TOL_KNOT_COINCIDENCE) {
                index = i;
                break;
            }
        }
        if(index < this._degree || index > (this._knots.length - 1 - this._degree)) {
            index = RETURN_ERROR_CODE;
        }
        return index;
    }


    clamp(u: number): void {
        // Piegl and Tiller, The NURBS book, p: 151

        let index = clampingFindSpan(u, this._knots, this._degree);
        let newControlPoints = [];

        let multiplicity = 0;
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        const times = this._degree - multiplicity + 1;

        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha))
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
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


