import { Vector_2d } from "../mathematics/Vector_2d"
import { BSpline_R1_to_R2 } from "./BSpline_R1_to_R2";


/**
 * A set of B-Spline curves from a one dimensional real space to a two dimensional real space
 * Each B-Spline derives from an input B-Spline as needed to set up the degree elevation algorithm of Prautzsch
 */

export class BSpline_R1_to_R2_degree_Raising {


    private controlPolygons: Array< Vector_2d [] > = []
    private knotVectors: Array< number[] > = []
    private bSpline: BSpline_R1_to_R2

    constructor(controlPoints: Vector_2d[], knots: Array<number>) {
        this.bSpline = new BSpline_R1_to_R2(controlPoints, knots)
    }

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */


    /* JCL 2020/10/06 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    degreeIncrease(): BSpline_R1_to_R2 {
        let degree = this.bSpline.degree
        this.generateIntermediateSplinesForDegreeElevation ()
        let splineHigherDegree = new BSpline_R1_to_R2(this.controlPolygons[0], this.knotVectors[0])
        if(this.bSpline.knotMultiplicity(this.bSpline.knots[0]) !== this.bSpline.degree + 1 || this.bSpline.knotMultiplicity(this.bSpline.knots[this.bSpline.knots.length - 1]) !== this.bSpline.degree + 1) {
            for( let i = 1; i <= this.bSpline.degree; i += 1) {
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
                for( let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                    splineHigherDegree.controlPoints[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind])
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
        for(let i = 0; i <= this.bSpline.degree; i+= 1) {
            let knotVector = this.bSpline.knots.slice()
            let controlPolygon = this.bSpline.controlPoints.slice()
            let k = 0
            for(let j = i; j < this.bSpline.knots.length; j += this.bSpline.degree + 1) {
                knotVector.splice((j + k), 0, this.bSpline.knots[j])
                if(j < this.bSpline.controlPoints.length) {
                    let controlPoint = this.bSpline.controlPoints[j]
                    controlPolygon.splice((j + k), 0, controlPoint)
                }
                k += 1
            }
            this.knotVectors.push(knotVector)
            this.controlPolygons.push(controlPolygon)
        }
    }

}
