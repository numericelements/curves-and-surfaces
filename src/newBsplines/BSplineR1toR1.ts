import { decomposeFunction, findSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1, splineRecomposition } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { KnotIndexIncreasingSequence } from "./Knot";


/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
export class BSplineR1toR1 extends AbstractBSplineR1toR1 {

    protected _increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree, knots);
    }

    get knots() : number[] {
        const knots: number[] = [];
        for(const knot of this._increasingKnotSequence) {
            if(knot !== undefined) knots.push(knot);
        }
        return knots;
    }

    set knots(knots: number[]) {
        // this._knots = [...knots];
        // this._degree = this.computeDegree();
        this._degree = this.computeDegree(knots.length);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree, knots);
    }

    bernsteinDecomposition(): BernsteinDecompositionR1toR1 {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1(decomposeFunction(this));
    }

    clone(): BSplineR1toR1 {
        return new BSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative(): BSplineR1toR1 {
        let newControlPoints = [];
        let newKnots = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / 
                (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + this._degree + 1)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1))));
        }
        newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1),
        new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 2));
        return new BSplineR1toR1(newControlPoints, newKnots);
    }

    // derivative(): BSplineR1toR1 {
    //     let newControlPoints = [];
    //     let newKnots = [];
    //     for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
    //         newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
    //     }
    //     newKnots = this._knots.slice(1, this._knots.length - 1);
    //     return new BSplineR1toR1(newControlPoints, newKnots);
    // }

    elevateDegree(times: number = 1): void {
        
        const bds = this.bernsteinDecomposition();
        bds.elevateDegree();

        const knots = this.distinctKnots();


        const newSpline = splineRecomposition(bds, knots);

        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(findSpan(knots[i], this.knots, this.degree));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }

        this.controlPoints = newSpline.controlPoints;
        this.knots = newSpline.knots;
        this._degree = newSpline.degree;

    }

    removeKnot(indexFromFindSpan: number, tolerance: number = 10e-5): void {
        //Piegl and Tiller, The NURBS book, p : 185
    
        const index = indexFromFindSpan;

        // end knots are not removed
        if (index > this._degree && index < this.knots.length-this._degree - 1) {
            throw new Error("index out of range");
        }
        
        //const double tolerance = 1;
        
        const multiplicity = this.knotMultiplicity(index);
        
        const last = index - multiplicity;
        const first = index -this.degree;
        const offset = first -1;
        //std::vector<vectorType> local(2*degree+1);
        let local: number[] = [];
        local[0] = this.controlPoints[offset];
        local[last+1-offset] = this.controlPoints[last+1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        
        // Compute new control point for one removal step
        while (j>i){
            let alpha_i = (this.knots[index] - this.knots[i])/(this.knots[i+this.degree+1]-this.knots[i]);
            let alpha_j = (this.knots[index] - this.knots[j])/(this.knots[j+this.degree+1] - this.knots[j]);
            local[ii] = (this.controlPoints[i] - (local[ii-1] * (1.0-alpha_i))) / alpha_i  
            local[jj] = (this.controlPoints[j] - (local[jj+1] * (alpha_j))) / (1.0-alpha_j) 
            ++i;
            ++ii;
            --j;
            --jj;
        }
        
        if (j < i) {
            if ((local[ii-1] - (local[jj+1])) <= tolerance){
                removable = true;
            }
        }
        else {
            const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i+this.degree+1]-this.knots[i]) ;
            if ( ((this.controlPoints[i] - (local[ii+1] * (alpha_i))) + (local[ii-1] * (1.0- alpha_i))) <= tolerance) {
                removable = true;
            }
        }
        
        if (!removable) return;
        else {
            let indInc = first;
            let indDec = last;
            while (indDec > indInc) {
                this.controlPoints[indInc] = local[indInc-offset];
                this.controlPoints[indDec] = local[indDec-offset];
                ++indInc;
                --indDec;
            }
        }
        
        this.knots.splice(index, 1);
        
        const fout = (2*index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }

    moveControlPoint(i: number, delta: number): void {
        if (i < 0 || i >= this.controlPoints.length) {
            const error = new ErrorLog(this.constructor.name, "moveControlPoint", "Control point index is out of range.");
            error.logMessageToConsole();
            return;
        }
        this.controlPoints[i] += delta;
    }

    convertTocurve(): BSplineR1toR2 {
        let x = this.grevilleAbscissae();
        let cp: Array<Vector2d> = [];
        for (let i = 0; i < x.length; i +=1) {
            cp.push(new Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2(cp, this._knots.slice());

    }

    evaluateOutsideRefInterval(u: number): number {
        let result;
        const spline = this.clone();
        const knots = spline.distinctKnots().slice();
        if(u >= knots[0] && u <= knots[knots.length - 1]) {
            result = 0.0;
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessageToConsole();
        } else {
            const extendedSpline = spline.extend(u);
            if(u < knots[0]) {
                result = extendedSpline.evaluate(0.0);
            } else {
                result = extendedSpline.evaluate(knots[knots.length - 1]);
            }
        }
        return result;
    }

    extend(uAbsc: number): BSplineR1toR1 {
        let result = new BSplineR1toR1();
        const knots = this.distinctKnots().slice();
        if(uAbsc >= knots[0] && uAbsc <= knots[knots.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the knot interval.");
            error.logMessageToConsole();
        } else {
            let tempCurve = this.clone();
            let reversed = false;
            let u;
            if(uAbsc > knots[knots.length - 1]) {
                tempCurve = this.revertCurve();
                u = knots[knots.length - 1] - uAbsc;
                reversed = true;
            } else {
                u = uAbsc;
            }
            let tempCtrlPoly = tempCurve._controlPoints;
            let tempKnots = tempCurve._knots;
            let vertices: Array<Array<number>> = [];
            for(let i= 1; i < this._degree + 1; i++) {
                let controlPolygon = [];
                controlPolygon.push(tempCtrlPoly[i]);
                const u1 = (tempKnots[this._degree + i]  - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                const vertex = tempCtrlPoly[i - 1] * u1 + tempCtrlPoly[i] * u2;
                controlPolygon.splice(0, 0, vertex);
                for(let j = 1; j < i; j++) {
                    const u1 = (tempKnots[this._degree + i - j]  - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const vertex = vertices[i - 2][vertices[i - 2].length - 1 - j] * u1 + controlPolygon[0] * u2;
                    controlPolygon.splice(0, 0, vertex);
                }
                vertices.push(controlPolygon);
            }
            for(let k = 0; k < this._degree + 1; k++) {
                tempCtrlPoly[k] = vertices[vertices.length - 1][k];
                tempKnots[k] = u;
            }
            // const intervalSpan = tempKnots[tempKnots.length - 1] - tempKnots[0];
            const offset = tempKnots[0];
            for(let i = 0; i < tempKnots.length; i++) {
                // tempKnots[i] = tempKnots[tempKnots.length - 1] - (tempKnots[tempKnots.length - 1] - tempKnots[i]) / intervalSpan;
                tempKnots[i] = tempKnots[i] - offset;
            }
            result = new BSplineR1toR1(tempCtrlPoly, tempKnots);
            if(reversed) result = result.revertCurve();
        }
        return result;
    }

    revertCurve(): BSplineR1toR1 {
        let vertices = [];
        for(let i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 -i]);
        }
        let revertedKnotSequence: number[] = [];
        const intervalSpan = this._knots[this._knots.length - 1] - this._knots[0];
        for(let j = 0; j < this._knots.length; j++) {
            revertedKnotSequence.push(intervalSpan - this._knots[this._knots.length - 1 - j]);
        }
        let result = new BSplineR1toR1(vertices, revertedKnotSequence);
        return result;
    }

}
