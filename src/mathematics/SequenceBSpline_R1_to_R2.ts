import { Vector_2d } from "./Vector_2d"
import { BSpline_R1_to_R2 } from "./BSpline_R1_to_R2";


/**
 * A set of B-Spline curves from a one dimensional real space to a two dimensional real space
 * Each B-Spline derives from an input B-Spline as needed to set up the degree elevation algorithm of Prautzsch
 */
export class SequenceBSpline_R1_to_R2 extends BSpline_R1_to_R2 {


    private controlPolygons: Array< Vector_2d [] > = []
    private knotVectors: Array< number[] > = []

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */

    setControlPoints(controlPoints: Vector_2d[]) {
        this.controlPoints = controlPoints
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints: Vector_2d[] = []
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            cloneControlPoints.push(new Vector_2d(this.controlPoints[i].x, this.controlPoints[i].y))
        }
        return new BSpline_R1_to_R2(cloneControlPoints, this.knots.slice());
    }



    /* JCL 2020/10/06 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    degreeIncrease(): BSpline_R1_to_R2 {
        let degree = this.degree
        this.generateIntermediateSplinesForDegreeElevation ()
        let splineHigherDegree = new BSpline_R1_to_R2(this.controlPolygons[0], this.knotVectors[0])
        if(this.knotMultiplicity(this.knots[0]) !== this.degree + 1 || this.knotMultiplicity(this.knots[this.knots.length - 1]) !== this.degree + 1) {
            for( let i = 1; i <= this.degree; i += 1) {
                let splineTemp = new BSpline_R1_to_R2(this.controlPolygons[i], this.knotVectors[i])
                let j = 0, k = 0
                while(j < splineHigherDegree.knots.length) {
                    if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] < splineTemp.knots[k]) {
                        splineTemp.insertKnot(splineHigherDegree.knots[j])
                    } else if(splineHigherDegree.knots[j] !== splineTemp.knots[k] && splineHigherDegree.knots[j] > splineTemp.knots[k]) {
                        splineHigherDegree.insertKnot(splineTemp.knots[k])
                    }
                    j += 1
                    k += 1
                }
                for( let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
                    splineHigherDegree.controlPoints[j] = splineHigherDegree.controlPoints[j].add(splineTemp.controlPoints[j])
                }
            }
            for(let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
                splineHigherDegree.controlPoints[j] = splineHigherDegree.controlPoints[j].multiply(1/(degree + 1))
            }
            console.log("degreeIncrease: " + splineHigherDegree.knots)
        }
        else throw new Error('incompatible knot vector of the input spline')
        return new BSpline_R1_to_R2(splineHigherDegree.controlPoints, splineHigherDegree.knots)
    }

    generateIntermediateSplinesForDegreeElevation() {
        for(let i = 0; i <= this.degree; i+= 1) {
            let knotVector = this.knots.slice()
            let controlPolygon = this.controlPoints.slice()
            let nullVector = []
            let k = 0
            for(let j = i; j < this.knots.length; j += this.degree + 1) {
                nullVector = knotVector.splice((j + k), 0, this.knots[j])
                if(j < this.controlPoints.length) {
                    let controlPoint = this.controlPoints[j]
                    nullVector = controlPolygon.splice((j + k), 0, controlPoint)
                }
                k += 1
            }
            this.knotVectors.push(knotVector)
            this.controlPolygons.push(controlPolygon)
        }
    }

}
