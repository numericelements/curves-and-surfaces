import { findSpan, clampingFindSpan } from "./Piegl_Tiller_NURBS_Book"
import { basisFunctions } from "./Piegl_Tiller_NURBS_Book"
import { decomposeFunction } from "./Piegl_Tiller_NURBS_Book"
import { Vector_2d } from "./Vector_2d"
import { BSpline_R1_to_R2 } from "./BSpline_R1_to_R2"


/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
export class BSpline_R1_to_R1 {

    private _controlPoints: Array<number> = []
    private _knots: Array<number> = []
    private _degree: number = 0

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Array<number> = [0], knots: Array<number> = [0, 1]) {
        this._controlPoints = controlPoints
        this._knots = knots
        this._degree = this._knots.length - this._controlPoints.length - 1;
        if (this._degree < 0) {
            throw new Error("Negative degree BSpline_R1_to_R1 are not supported")
        }
    }

    get controlPoints() : Array<number> {
        return this._controlPoints
    }

    set controlPoints(controlPoints: Array<number>) {
        this._controlPoints = controlPoints
    }

    get knots() : Array<number> {
        return this._knots
    }

    set knots(knots: Array<number>) {
        this._knots = knots
    }

    get degree() : number {
        return this._degree
    }

    setControlPoint(index: number, value: number) {
        this._controlPoints[index] =  value;
    }

    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u: number) {
        const span = findSpan(u, this._knots, this._degree)
        const basis = basisFunctions(span, u, this._knots, this._degree)
        let result = 0
        for (let i = 0; i < this.degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span - this._degree + i];
        }
        return result; 
    }

    derivative() {
        let newControlPoints = []
        let newKnots = []
        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this.controlPoints[i + 1] - (this.controlPoints[i])) * (this.degree / (this.knots[i + this.degree + 1] - this.knots[i + 1]));
        }
        newKnots = this.knots.slice(1, this.knots.length - 1);
        return new BSpline_R1_to_R1(newControlPoints, newKnots);
    }

    bernsteinDecomposition() {
        // Piegl_Tiller_NURBS_BOOK.ts
        return decomposeFunction(this);
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



    zeros(tolerance: number = 10e-8) {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice())
        let greville = spline.grevilleAbscissae()
        let maxError = tolerance * 2
        let vertexIndex = []

        while (maxError > tolerance) {
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
            for (let i = 0; i < vertexIndex.length; i += 1) {
                let uLeft = greville[vertexIndex[i] - 1]
                let uRight = greville[vertexIndex[i]]
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft
                }
                if (uRight - uLeft > tolerance) {
                    spline.insertKnot((uLeft + uRight) / 2)
                    greville = spline.grevilleAbscissae()
                }

            }
            maxError = maximum
        }

        let result = []
        for (let i = 0; i < vertexIndex.length; i += 1) {
            result.push(greville[vertexIndex[i]])
        }
        return result
    }

    grevilleAbscissae() {
        let result = []
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this.degree + 1; j += 1) {
                sum += this.knots[j];
            }
            result.push(sum / this.degree);
        }
        return result;
    }

    insertKnot(u: number, times: number = 1) {
        if (times <= 0) {
            return
        }
        let index = findSpan(u, this.knots, this.degree)
        let multiplicity = 0
        let newControlPoints = []

        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i]
            }
            for (let i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i])
                newControlPoints[i] = this.controlPoints[i - 1] * (1 - alpha) + this.controlPoints[i] * alpha
            }
            for (let i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i]
            }
            this.knots.splice(index + 1, 0, u)
            this.controlPoints = newControlPoints.slice()
        }
    }

    knotMultiplicity(indexFromFindSpan: number) {
        let result = 0
        let i = 0
        while (this.knots[indexFromFindSpan + i] === this.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        return new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice());
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
                newControlPoints[i] = this.controlPoints[i - 1] * (1 - alpha) + this.controlPoints[i] * alpha;
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


    controlPolygonNumberOfSignChanges() {
        let result = 0
        let greville = this.grevilleAbscissae()
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !==  Math.sign(this._controlPoints[i + 1])) {
                result += 1
            }
        }
        return result
    }

    controlPolygonZeros() {
        let result: Array<number> = []
        let greville = this.grevilleAbscissae()
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !==  Math.sign(this._controlPoints[i + 1])) {
                result.push(this.findLineZero(  greville[i], 
                                                this.controlPoints[i],  
                                                greville[i + 1], 
                                                this.controlPoints[i + 1]))
            }
        }
        return result
    }

    findLineZero(x1: number, y1: number, x2: number, y2: number) {
        // find the zero of the line y = ax + b
        let a = (y2 - y1) / (x2 - x1)
        let b = y1 - a * x1
        return -b / a
    }

    zerosPolygonVsFunctionDiffViewer(tolerance: number = 10e-8) {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice())
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
            for (let i = 0; i < vertexIndex.length; i += 1) {
                let uLeft = greville[vertexIndex[i] - 1]
                let uRight = greville[vertexIndex[i]]
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

        /*
        let result = []
        for (let i = 0; i < vertexIndex.length; i += 1) {
            result.push(greville[vertexIndex[i]])
        }
        */
        return result
    }

    curve() {
        let x = this.grevilleAbscissae()
        let cp: Array<Vector_2d> = []
        for (let i = 0; i < x.length; i +=1) {
            cp.push(new Vector_2d(x[i], this._controlPoints[i]))
        }
        return new BSpline_R1_to_R2(cp, this.knots.slice());

    }


}