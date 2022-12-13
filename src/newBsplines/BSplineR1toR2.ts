import { clampingFindSpan, findSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { AbstractBSplineR1toR2, deepCopyControlPoints } from "./AbstractBSplineR1toR2"
import { BSplineR1toR1 } from "./BSplineR1toR1"
import { splineRecomposition } from "./BernsteinDecompositionR1toR1"
import { ActiveLocationControl } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2"

/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSplineR1toR2 extends AbstractBSplineR1toR2 {



    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
    }


    get freeControlPoints(): Vector2d[] {
        return this.controlPoints;
    }


    /**
     * Return a deep copy of this b-spline
     */
    clone() : BSplineR1toR2 {
        let cloneControlPoints = deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR2(cloneControlPoints, this._knots.slice());
    }


    optimizerStep(step: number[]): void {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
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
        const sx = new BSplineR1toR1(this.getControlPointsX(), this.knots);
        const sy = new BSplineR1toR1(this.getControlPointsY(), this.knots);
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
        let newSpline = new BSplineR1toR2(newcp, sxNew.knots);

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

    /* JCL 2020/10/06 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    degreeIncrement(): BSplineR1toR2 {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        let splineHigherDegree = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0]);
        if(this.knotMultiplicity(this.knots[0]) !== this.degree + 1 || this.knotMultiplicity(this.knots[this.knots.length - 1]) !== this.degree + 1) {
            for( let i = 1; i <= this.degree; i += 1) {
                let splineTemp = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
                let j = 0, k = 0;
                while(j < splineHigherDegree.knots.length) {
                    if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] < splineTemp.knots[k]) {
                        splineTemp.insertKnot(splineHigherDegree.knots[j]);
                    } else if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] > splineTemp.knots[k]) {
                        splineHigherDegree.insertKnot(splineTemp.knots[k]);
                    }
                    j += 1;
                    k += 1;
                }
                for( let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                    splineHigherDegree.controlPoints[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
                }
            }
            for(let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
                splineHigherDegree.controlPoints[j] = splineHigherDegree.controlPoints[j].multiply(1/(this.degree + 1));
            }
            console.log("degreeIncrease: " + splineHigherDegree.knots)
        }
        else throw new Error('incompatible knot vector of the input spline');
        return new BSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree.knots);
    }
    
    generateIntermediateSplinesForDegreeElevation(): {knotVectors: number[][], CPs: Array<Vector2d[]>} {
        const knotVectors: number[][] = [];
        const controlPolygons: Array<Vector2d[]> = [];
        for(let i = 0; i <= this.degree; i += 1) {
            let knotVector = this.knots.slice();
            let controlPolygon = this.controlPoints.slice();
            let k = 0;
            for(let j = i; j < this.knots.length; j += this.degree + 1) {
                knotVector.splice((j + k), 0, this.knots[j]);
                if(j < this.controlPoints.length) {
                    let controlPoint = this.controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            knotVectors.push(knotVector);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors : knotVectors,
            CPs : controlPolygons
        };
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

    // replaced by getDistinctKnots in AbstractBSplineR1toR2
    // distinctKnots(): number[] {
    //     let result = [this.knots[0]];
    //     let temp = result[0];
    //     for (let i = 1; i < this.knots.length; i += 1) {
    //         if (this.knots[i] !== temp) {
    //             result.push(this.knots[i]);
    //             temp = this.knots[i];
    //         }
    //     }
    //     return result;
    // }


    relocateAfterOptimization(step: Array<Vector2d>, activeLocationControl: ActiveLocationControl) {
        if(activeLocationControl !== ActiveLocationControl.stopDeforming) {
            let index = 0
            // if(activeLocationControl === ActiveLocationControl.firstControlPoint || activeLocationControl === ActiveLocationControl.both)
            // index = 0 covers the other configurations
            if(activeLocationControl === ActiveLocationControl.lastControlPoint) {
                index = this.controlPoints.length - 1
            }

            for (let ctrlPt of this.controlPoints) {
                ctrlPt.x -= step[index].x;
                ctrlPt.y -= step[index].y;
            }
            /*console.log("relocAfterOptim: index = " + index + " sx " + this.controlPoints[index].x + " sy " + this.controlPoints[index].y) */
        } else {
            for (let i = 0; i < this.controlPoints.length; i += 1) {
                this.controlPoints[i].x -= step[i].x;
                this.controlPoints[i].y -= step[i].y;
            }
            /*console.log("relocAfterOptim: relocate all ") */
        }

    }


}


export function create_BSplineR1toR2(controlPoints: number[][], knots: number[]): BSplineR1toR2 {
    let newControlPoints: Vector2d[] = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d(cp[0], cp[1]));
    }
    return new BSplineR1toR2(newControlPoints, knots);
}

export function create_BSplineR1toR2V2d(controlPoints: Vector2d[], knots: number[]): BSplineR1toR2 {
    return new BSplineR1toR2(controlPoints, knots);
}

export function convertToBsplR1_to_R2(spline: BSplineR1toR2): BSpline_R1_to_R2 {
    return new BSpline_R1_to_R2(spline.controlPoints, spline.knots);
}

