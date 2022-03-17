import { decomposeFunction, findSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR1 } from "./AbstractBSplineR1toR1";
import { BernsteinDecompositionR1toR1, splineRecomposition } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";


/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
export class BSplineR1toR1 extends AbstractBSplineR1toR1 {

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: number[] = [0], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }

    bernsteinDecomposition() {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1(decomposeFunction(this))
    }

    clone() {
        return new BSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }

    derivative() {
        let newControlPoints = []
        let newKnots = []
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new BSplineR1toR1(newControlPoints, newKnots);
    }

    elevateDegree(times: number = 1) {
        
        const bds = this.bernsteinDecomposition()
        bds.elevateDegree()

        const knots = this.distinctKnots()


        const newSpline = splineRecomposition(bds, knots)

        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(findSpan(knots[i], this.knots, this.degree))
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree))
            }
        }

        this.controlPoints = newSpline.controlPoints
        this.knots = newSpline.knots
        this._degree = newSpline.degree

    }

    removeKnot(indexFromFindSpan: number, tolerance: number = 10e-5) {
        //Piegl and Tiller, The NURBS book, p : 185
    
        const index = indexFromFindSpan

        // end knots are not removed
        if (index > this._degree && index < this.knots.length-this._degree - 1) {
            throw new Error("index out of range")
        }
        
        //const double tolerance = 1;
        
        const multiplicity = this.knotMultiplicity(index);
        
        const last = index - multiplicity
        const first = index -this.degree
        const offset = first -1;
        //std::vector<vectorType> local(2*degree+1);
        let local: number[] = []
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
            if ( ((this.controlPoints[i] - ((local[ii+1] * (alpha_i)))) + (local[ii-1] * (1.0- alpha_i))) <= tolerance) {
                removable = true;
            }
        }
        
        if (removable == false) return;
        else {
            let i = first;
            let j = last;
            while (j > i) {
                this.controlPoints[i] = local[i-offset];
                this.controlPoints[j] = local[j-offset];
                ++i;
                --j;
            }
        }
        
        this.knots.splice(index, 1)
        
        const fout = (2*index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }

    moveControlPoint(i: number, delta: number) {
        if (i < 0 || i >= this.controlPoints.length) {
            throw new Error("Control point indentifier is out of range")
        }
        this.controlPoints[i] += delta;
    }

    curve() {
        let x = this.grevilleAbscissae()
        let cp: Array<Vector2d> = []
        for (let i = 0; i < x.length; i +=1) {
            cp.push(new Vector2d(x[i], this._controlPoints[i]))
        }
        return new BSplineR1toR2(cp, this._knots.slice());

    }


}
