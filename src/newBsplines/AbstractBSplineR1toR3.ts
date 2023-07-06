import { findSpan, clampingFindSpan, basisFunctions } from "./Piegl_Tiller_NURBS_Book"
import { BSplineR1toRxInterface } from "./BSplineR1toRxInterface"
import { Vector3d } from "../mathVector/Vector3d"
import { VectorInterface } from "../mathVector/VectorInterface"


/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export abstract class AbstractBSplineR1toR3 implements BSplineR1toRxInterface<Vector3d> {

    protected _controlPoints: Vector3d[];
    protected _knots: number[];
    protected _degree: number;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 0)], knots: number[] = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._knots = [...knots];
        this._degree = this.computeDegree();
    }

    computeDegree(): number {
        let degree = this._knots.length - this._controlPoints.length - 1;
        if (degree < 0) {
            throw new Error("Negative degree BSplineR1toR1 are not supported");
        }
        return degree
    }

    
    get controlPoints(): Vector3d[] {
        return deepCopyControlPoints(this._controlPoints);
    }
    

    abstract get freeControlPoints(): Vector3d[];

    set controlPoints(controlPoints: Vector3d[]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
    }

    get knots() : number[] {
        return [...this._knots];
    }

    set knots(knots: number[]) {
        this._knots = [...knots];
        this._degree = this.computeDegree();
    }

    get degree() : number {
        return this._degree;
    }


    getControlPoint(index: number) {
        return this._controlPoints[index].clone();
    }


    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number) : VectorInterface {
        const span = findSpan(u, this._knots, this._degree);
        const basis = basisFunctions(span, u, this._knots, this._degree);
        let result = new Vector3d(0, 0, 0);
        for (let i = 0; i < this._degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
            result.z += basis[i] * this._controlPoints[span - this._degree + i].z;
        }
        return result;
    }

    /**
     * Return a deep copy of this b-spline
     */
    abstract clone() : AbstractBSplineR1toR3;

    /**
     * Return a b-spline of derived class type
     */
    // hereunder former version of the method
    // protected abstract factory(controlPoints: readonly Vector3d[], knots: readonly number[]): AbstractBSplineR1toR3;
    protected abstract factory(controlPoints: Vector3d[], knots: number[]): AbstractBSplineR1toR3;

    abstract optimizerStep(step: number[]) : void;

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
        let result: number[] = [this._knots[0]];
        let temp = result[0];
        for (let i = 1; i < this._knots.length; i += 1) {
            if (this._knots[i] !== temp) {
                result.push(this._knots[i]);
                temp = this._knots[i];
            }
        }
        return result;
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number): void {
        if (i < 0 || i >= this._controlPoints.length - this._degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this._controlPoints[i].x += deltaX;
        this._controlPoints[i].y += deltaY;
    }

    moveControlPoints(delta: Vector3d[]): AbstractBSplineR1toR3 {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        for (let i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.factory(controlPoints, this._knots);
    }

    setControlPointPosition(index: number, value: Vector3d): void {
        this._controlPoints[index] =  value;
    }

    insertKnot(u: number, times: number = 1): void {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        
        let index = findSpan(u, this._knots, this._degree);
        let multiplicity = 0;

        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index - this._degree + 1; i += 1) {
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

    /**
     * 
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    abstract extract(fromU: number, toU: number) : AbstractBSplineR1toR3;

}

export function deepCopyControlPoints(controlPoints: Vector3d[]): Vector3d[] {
    let result: Vector3d[] = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}

