import { clampingFindSpan, findSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { AbstractBSplineR1toR2, curveSegment, deepCopyControlPoints } from "./AbstractBSplineR1toR2"
import { BSplineR1toR1 } from "./BSplineR1toR1"
import { splineRecomposition } from "./BernsteinDecompositionR1toR1"
import { ErrorLog } from "../errorProcessing/ErrorLoging"
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve"

/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSplineR1toR2 extends AbstractBSplineR1toR2 {

    protected _increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree, knots);
    }

    get knots() : number[] {
        return this._increasingKnotSequence.allAbscissae;
    }

    get increasingKnotSequence(): IncreasingOpenKnotSequenceOpenCurve {
        return this._increasingKnotSequence;
    }

    get freeControlPoints(): Vector2d[] {
        return this.controlPoints;
    }

    set knots(knots: number[]) {
        // this._knots = [...knots];
        // this._degree = this.computeDegree();
        this._degree = this.computeDegree(knots.length);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree, knots);
    }

    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    protected factory(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        return new BSplineR1toR2(controlPoints, knots)
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
        for(let i = 1; i <= this.degree; i += 1) {
            let splineTemp = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
            let j = 0, k = 0;
            while(j < splineHigherDegree.knots.length) {
                if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] < splineTemp.knots[k]) {
                    // splineTemp.insertKnot(splineHigherDegree.knots[j]);
                    splineTemp.insertKnotBoehmAlgorithm(splineHigherDegree.knots[j], 1);
                } else if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] > splineTemp.knots[k]) {
                    // splineHigherDegree.insertKnot(splineTemp.knots[k]);
                    splineHigherDegree.insertKnotBoehmAlgorithm(splineTemp.knots[k], 1);
                }
                j += 1;
                k += 1;
            }
            let tempCPs: Vector2d[] = [];
            for(let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        let tempHigherDegCP: Vector2d[] = [];
        for(let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j].multiply(1/(this.degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        console.log("degreeIncrease: " + splineHigherDegree.knots);
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

    scale(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleY(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x, element.y * factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleX(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x * factor, element.y))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    extend(uAbsc: number): BSplineR1toR2 {
        let result = new BSplineR1toR2();
        const knots = this.getDistinctKnots();
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
            let vertices: Array<Array<Vector2d>> = [];
            for(let i= 1; i < this._degree + 1; i++) {
                let controlPolygon: Array<Vector2d> = [];
                controlPolygon.push(tempCtrlPoly[i]);
                const u1 = (tempKnots[this._degree + i]  - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                const vertex = tempCtrlPoly[i - 1].multiply(u1).add(tempCtrlPoly[i].multiply(u2));
                controlPolygon.splice(0, 0, vertex);
                for(let j = 1; j < i; j++) {
                    const u1 = (tempKnots[this._degree + i - j]  - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const vertex = vertices[i - 2][vertices[i - 2].length - 1 - j].multiply(u1).add(controlPolygon[0].multiply(u2));
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
            result = new BSplineR1toR2(tempCtrlPoly, tempKnots);
            if(reversed) result = result.revertCurve();
        }
        return result;
    }

    splitAt(u: number, segmentLocation: curveSegment): BSplineR1toR2 {
        let result = this.clone();
        if(result.increasingKnotSequence.isAbscissaCoincidingWithKnot(u)) {
            const error = new ErrorLog(this.constructor.name, "splitAt", "Method not configured to split a curve at an existing knot");
            error.logMessageToConsole();
        } else {
            result.insertKnot(u, result._degree + 1);
            const knotSequence = result.knots;
            const newControlPolygon: Vector2d[] = [];
            const newKnots: number[] = [];
            let knotIndex = result._degree + 1;
            while(knotSequence[knotIndex] !== u && knotIndex < knotSequence.length) {
                knotIndex++;
            }
            const indexBound = knotIndex + result._degree + 1;
            if(segmentLocation === curveSegment.BEFORE) {
                for(let i = 0; i < knotIndex; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for(let i = 0; i < indexBound; i++) {
                    newKnots.push(result.knots[i]);
                }
                // result._controlPoints = newControlPolygon;
                // result._knots = newKnots;
                result = new BSplineR1toR2(newControlPolygon, newKnots);
            } else if(segmentLocation === curveSegment.AFTER) {
                for(let i = knotIndex; i < result._controlPoints.length; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for(let i = knotIndex; i < result.knots.length; i++) {
                    newKnots.push(result.knots[i]);
                }
                const offset = u;
                for(let i = 0; i < newKnots.length; i++) {
                    // newKnots[i] = newKnots[newKnots.length - 1] - (newKnots[newKnots.length - 1] - newKnots[i]) / intervalSpan;
                    newKnots[i] = newKnots[i] - offset;
                }
                // result._controlPoints = newControlPolygon;
                // result._knots = newKnots;
                result = new BSplineR1toR2(newControlPolygon, newKnots);
            } else {
                const error = new ErrorLog(this.constructor.name, "splitAt", "undefined specification of curve interval to be extracted.");
                error.logMessageToConsole();
            }
        }
        return result;
    }
    // splitAt(u: number, segmentLocation: curveSegment): BSplineR1toR2 {
    //     const result = this.clone();
    //     const knotValues = result.getDistinctKnots();
    //     if(knotValues.indexOf(u) !== -1) {
    //         const error = new ErrorLog(this.constructor.name, "splitAt", "Method not configured to split a curve at an existing knot");
    //         error.logMessageToConsole();
    //     } else {
    //         result.insertKnot(u, result._degree + 1);
    //         const knotSequence = result._knots;
    //         let newControlPolygon: Vector2d[] = [];
    //         let newKnots: number[] = [];
    //         let knotIndex = result._degree + 1;
    //         while(knotSequence[knotIndex] !== u && knotIndex < knotSequence.length) {
    //             knotIndex++;
    //         }
    //         const indexBound = knotIndex + result._degree + 1;
    //         if(segmentLocation === curveSegment.BEFORE) {
    //             for(let i = 0; i < knotIndex; i++) {
    //                 newControlPolygon.push(result._controlPoints[i]);
    //             }
    //             for(let i = 0; i < indexBound; i++) {
    //                 newKnots.push(result._knots[i]);
    //             }
    //             result._controlPoints = newControlPolygon;
    //             result._knots = newKnots;
    //         } else if(segmentLocation === curveSegment.AFTER) {
    //             for(let i = knotIndex; i < result._controlPoints.length; i++) {
    //                 newControlPolygon.push(result._controlPoints[i]);
    //             }
    //             for(let i = knotIndex; i < result._knots.length; i++) {
    //                 newKnots.push(result._knots[i]);
    //             }
    //             const offset = u;
    //             for(let i = 0; i < newKnots.length; i++) {
    //                 // newKnots[i] = newKnots[newKnots.length - 1] - (newKnots[newKnots.length - 1] - newKnots[i]) / intervalSpan;
    //                 newKnots[i] = newKnots[i] - offset;
    //             }
    //             result._controlPoints = newControlPolygon;
    //             result._knots = newKnots;
    //         } else {
    //             const error = new ErrorLog(this.constructor.name, "splitAt", "undefined specification of curve interval to be extracted.");
    //             error.logMessageToConsole();
    //         }
    //     }
    //     return result;
    // }

    evaluateOutsideRefInterval(u: number): Vector2d {
        let result = new Vector2d();
        const spline = this.clone();
        const knots = spline.getDistinctKnots();
        if(u >= knots[0] && u <= knots[knots.length - 1]) {
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

    revertCurve(): BSplineR1toR2 {
        let vertices: Array<Vector2d> = [];
        for(let i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 -i]);
        }
        let revertedKnotSequence: number[] = [];
        const intervalSpan = this._knots[this._knots.length - 1] - this._knots[0];
        for(let j = 0; j < this._knots.length; j++) {
            revertedKnotSequence.push(intervalSpan - this._knots[this._knots.length - 1 - j]);
        }
        let result = new BSplineR1toR2(vertices, revertedKnotSequence);
        return result;
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

        //const newFromSpan = findSpan(from, spline._knots, spline._degree)
        //const newToSpan = findSpan(to, spline._knots, spline._degree)

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

        return new BSplineR1toR2(newControlPoints, newKnots);
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

// export function convertToBsplR1_to_R2(spline: BSplineR1toR2): BSpline_R1_to_R2 {
//     return new BSpline_R1_to_R2(spline.controlPoints, spline.knots);
// }

