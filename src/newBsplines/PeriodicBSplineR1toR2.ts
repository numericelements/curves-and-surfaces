import { Vector2d } from "../mathVector/Vector2d"
import { AbstractBSplineR1toR2, deepCopyControlPoints } from "./AbstractBSplineR1toR2"
import { splineRecomposition } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2"
import { PeriodicBSplineR1toR1 } from "./PeriodicBSplineR1toR1";
import { clampingFindSpan, findSpan } from "./Piegl_Tiller_NURBS_Book"


/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 */
export class PeriodicBSplineR1toR2 extends AbstractBSplineR1toR2  {


    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
    }


    get periodicControlPointsLength(): number {
        return this._controlPoints.length - this._degree;
    }

    get freeControlPoints(): Vector2d[] {
        let periodicControlPoints = [];
        for (let i = 0; i < this.periodicControlPointsLength; i += 1) {
            periodicControlPoints.push(this._controlPoints[i].clone());
        }
        return periodicControlPoints;
    }

    getClampSpline(): BSplineR1toR2 {
        const s = this.clone();
        const degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        const newKnots = s.knots.slice(degree, s.knots.length - degree);
        return new BSplineR1toR2(newControlPoints, newKnots);
    }


    /**
     * Return a deep copy of this b-spline
     */
    clone() : PeriodicBSplineR1toR2 {
        let cloneControlPoints = deepCopyControlPoints(this._controlPoints);
        return new PeriodicBSplineR1toR2(cloneControlPoints, this._knots.slice());
    }

    optimizerStep(step: number[]): void {
        
        const n = this.periodicControlPointsLength;
        for (let i = 0; i < n; i += 1) {
            this.moveControlPoint(i, step[i], step[i + n]);
        }
    }

    moveControlPoint(i: number, deltaX: number, deltaY: number): void {
        
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        
        
        super.moveControlPoint(i, deltaX, deltaY);

        let n = this.periodicControlPointsLength;
        if (i < this.degree) {
            super.setControlPointPosition(n + i, this.getControlPoint(i));
        }

    }

    /**
     * 
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU: number, toU: number): BSplineR1toR2 {

        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);


        const newFromSpan = clampingFindSpan(fromU, spline._knots, spline._degree);
        const newToSpan = clampingFindSpan(toU, spline._knots, spline._degree);

        let newKnots : number[] = [];
        let newControlPoints : Vector2d[] = [];


        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }

        return new BSplineR1toR2(newControlPoints, newKnots);
    }

    elevateDegree(times: number = 1): void {
        const sx = new PeriodicBSplineR1toR1(this.getControlPointsX(), this.knots);
        const sy = new PeriodicBSplineR1toR1(this.getControlPointsY(), this.knots);
        const bdsx = sx.bernsteinDecomposition();
        const bdsy = sy.bernsteinDecomposition();
        bdsx.elevateDegree();
        bdsy.elevateDegree();

        const knots = this.getDistinctKnots();


        const sxNew = splineRecomposition(bdsx, knots);
        const syNew = splineRecomposition(bdsy, knots);

        let newcp: Vector2d[] = [];
        for (let i = 0; i < sxNew.controlPoints.length; i += 1) {
            newcp.push(new Vector2d(sxNew.controlPoints[i], syNew.controlPoints[i]));
        }
        let newSpline = new PeriodicBSplineR1toR2(newcp, sxNew.knots);

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

    // Probably not compatible with periodic BSplines -> to be modified
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
        let local: Vector2d[] = [];
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
            local[ii] = (this.controlPoints[i].substract(local[ii-1].multiply(1.0-alpha_i))).multiply(1 / alpha_i ) 
            local[jj] = (this.controlPoints[j].substract(local[jj+1].multiply(alpha_j))).multiply(1 / (1.0-alpha_j) )
            ++i;
            ++ii;
            --j;
            --jj;
        }
        
        if (j < i) {
            if ((local[ii-1].substract(local[jj+1])).norm() <= tolerance){
                removable = true;
            }
        }
        else {
            const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i+this.degree+1]-this.knots[i]) ;
            if ( ((this.controlPoints[i].substract((local[ii+1].multiply(alpha_i)))).add (local[ii-1].multiply(1.0- alpha_i))).norm() <= tolerance) {
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

    getDistinctKnots(): number[] {
        const result = super.getDistinctKnots();
        return result.slice(this.degree, result.length - this.degree);
    }

    setControlPointPosition(i: number, value: Vector2d): void {

        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        
        super.setControlPointPosition(i, value.clone());

        if (i < this._degree) {
            const j = this.periodicControlPointsLength + i;
            super.setControlPointPosition(j, value.clone());
        }
        
    }

    insertKnot(u: number): void {
        super.insertKnot(u, 1);
        if (u < this._knots[2 * this._degree]) {
            let newKnots : number[] = [];
            let newControlPoints: Vector2d[]  = [];
            for (let i = 0; i < this._knots.length - 2 * this._degree ; i += 1) {
                newKnots.push(this._knots[i]);
            }
            const ui = newKnots[newKnots.length - 1];
            for (let i = 1; i < 2 * this._degree + 1; i += 1 ) {
                newKnots.push(ui + (this._knots[i] - this._knots[0]));
            }
            for (let i = 0; i < this._controlPoints.length - this._degree ; i += 1) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            for (let i = 0; i < this._degree; i += 1 ) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            this._controlPoints = newControlPoints;
            this._knots = newKnots;
        }
        if (u > this._knots[this._knots.length - 1 - 2 * this._degree]) {
            let newKnots : number[] = [];
            let newControlPoints: Vector2d[]  = [];
            const periodicIndex = this._knots.length - 1 - 2 * this._degree;
            const ui = this._knots[periodicIndex];
            for (let i = 0; i < 2 * this._degree; i += 1) {
                newKnots.push(this._knots[1] + (this._knots[i + periodicIndex] - ui));
            }
            for (let i = 2 * this._degree; i < this._knots.length; i += 1 ) {
                newKnots.push(this._knots[i]);
            }
            const cpi = this._controlPoints.length - this._degree;
            for (let i = 0; i < this._degree; i += 1 ) {
                newControlPoints.push(new Vector2d(this._controlPoints[cpi + i].x, this._controlPoints[cpi + i].y));
            }
            for (let i = this._degree; i < this._controlPoints.length; i += 1) {
                newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            this._controlPoints = newControlPoints;
            this._knots = newKnots;
        } 
    }

}

export function create_PeriodicBSplineR1toR2(controlPoints: number[][], knots: number[]): PeriodicBSplineR1toR2 {
    let newControlPoints: Vector2d[] = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d(cp[0], cp[1]));
    }
    return new PeriodicBSplineR1toR2(newControlPoints, knots);
}