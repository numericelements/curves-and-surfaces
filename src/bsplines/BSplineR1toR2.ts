import { findSpan, clampingFindSpan, basisFunctions } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathematics/Vector2d"
import { BSplineR1toR2Interface as BSplineR1toR2Interface } from "./BSplineInterfaces"


/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSplineR1toR2 implements BSplineR1toR2Interface {

    private _controlPoints: Vector2d[] = []
    private _knots: number[] = []
    private _degree: number = 0

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        this._controlPoints = JSON.parse(JSON.stringify(controlPoints))
        this._knots = [...knots]
        this._degree = this._knots.length - this._controlPoints.length - 1;
        if (this._degree < 0) {
            throw new Error("Negative degree BSpline_R1_to_R2 are not supported")
        }
    }

    get controlPoints() : Vector2d[] {
        return this._controlPoints
    }

    visibleControlPoints() {
        return this.controlPoints
    }

    set controlPoints(controlPoints: Vector2d[]) {
        this._controlPoints = controlPoints
    }

    get knots() : number[] {
        return this._knots
    }

    set knots(knots: number[]) {
        this._knots = knots
    }

    get degree() : number {
        return this._degree
    }

    setControlPoint(index: number, value: Vector2d) {
        this._controlPoints[index] =  JSON.parse(JSON.stringify(value))
    }

    setControlPoints(controlPoints: Vector2d[]) {
        this._controlPoints = JSON.parse(JSON.stringify(controlPoints))
    }

    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number) {
        const span = findSpan(u, this._knots, this._degree)
        const basis = basisFunctions(span, u, this._knots, this._degree)
        let result = new Vector2d(0, 0)
        for (let i = 0; i < this.degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
        }
        return result; 
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints: Vector2d[] = []
        for (let cp of this.controlPoints) {
            cloneControlPoints.push(new Vector2d(cp.x, cp.y))
        }
        return new BSplineR1toR2(cloneControlPoints, this.knots.slice());
    }


    optimizerStep(step: number[]) {
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            this.controlPoints[i].x += step[i];
            this.controlPoints[i].y += step[i + this.controlPoints.length];
        }
    }

    getControlPointsX() {
        let result = []
        for (let cp of this.controlPoints) {
            result.push(cp.x);
        }
        return result;
    }

    getControlPointsY() {
        let result = []
        for (let cp of this.controlPoints) {
            result.push(cp.y);
        }
        return result;
    }

    distinctKnots() {
        let result = [this.knots[0]]
        let temp = result[0]
        for (let i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number) {
        if (i < 0 || i >= this.controlPoints.length - this.degree) {
            throw new Error("Control point indentifier is out of range")
        }
        this.controlPoints[i].x += deltaX;
        this.controlPoints[i].y += deltaY;
    }

    insertKnot(u: number, times: number = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        
        let index = findSpan(u, this.knots, this.degree)
        let multiplicity = 0

        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (let i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = (this.controlPoints[i - 1].multiply(1 - alpha)).add(this.controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }

    }

    knotMultiplicity(indexFromFindSpan: number) {
        let result = 0,
            i = 0;
        while (this.knots[indexFromFindSpan + i] === this.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    grevilleAbscissae() {
        let result = [],
        i,
        j,
        sum;
    for (i = 0; i < this.controlPoints.length; i += 1) {
        sum = 0;
        for (j = i + 1; j < i + this.degree + 1; j += 1) {
            sum += this.knots[j];
        }
        result.push(sum / this.degree);
    }
    return result;
    }


    clamp(u: number) {
        // Piegl and Tiller, The NURBS book, p: 151

        let index = clampingFindSpan(u, this.knots, this.degree)
        let newControlPoints = []

        let multiplicity = 0
        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        const times = this.degree - multiplicity + 1;

        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (let i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = (this.controlPoints[i - 1].multiply(1 - alpha)).add(this.controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this.knots.splice(index + 1, 0, u);
            this.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }

    }

    /**
     * 
     * @param from Parametric position where the section start
     * @param to Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    section(from: number, to: number) {

        let spline = this.clone()
        spline.clamp(from)
        spline.clamp(to)


        const newFromSpan = clampingFindSpan(from, spline._knots, spline._degree)
        const newToSpan = clampingFindSpan(to, spline._knots, spline._degree)

        let newKnots : number[] = []
        let newControlPoints : Vector2d[] = []


        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i])
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y))
        }

        return new BSplineR1toR2(newControlPoints, newKnots)
    }

    move(deltaX: number, deltaY: number) {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(element.add(new Vector2d(deltaX, deltaY)))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scale(factor: number) {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleY(factor: number) {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x, element.y * factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleX(factor: number) {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x * factor, element.y))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    renewCurve(newControlPoints: Vector2d[], newKnotSequence: number[]) {
        this._controlPoints = JSON.parse(JSON.stringify(newControlPoints))
        this._knots = [...newKnotSequence]
        this._degree = this._knots.length - this._controlPoints.length - 1;
    }

}

