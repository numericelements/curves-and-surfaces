import { BSpline_R1_to_R2 } from "./BSpline_R1_to_R2"
import { BSpline_R1_to_R1 } from "./BSpline_R1_to_R1"
import { BernsteinDecomposition_R1_to_R1 } from "./BernsteinDecomposition_R1_to_R1"


/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSpline_R1_to_R2_DifferentialProperties {


    constructor(readonly spline: BSpline_R1_to_R2) {
    }

    expensiveComputation(spline: BSpline_R1_to_R2) {
        const sx = new BSpline_R1_to_R1(spline.getControlPointsX(), spline.knots);
        const sy = new BSpline_R1_to_R1(spline.getControlPointsY(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const bdsxu = new BernsteinDecomposition_R1_to_R1(sxu.bernsteinDecomposition());
        const bdsyu = new BernsteinDecomposition_R1_to_R1(syu.bernsteinDecomposition());
        const bdsxuu = new BernsteinDecomposition_R1_to_R1(sxuu.bernsteinDecomposition());
        const bdsyuu = new BernsteinDecomposition_R1_to_R1(syuu.bernsteinDecomposition());
        const bdsxuuu = new BernsteinDecomposition_R1_to_R1(sxuuu.bernsteinDecomposition());
        const bdsyuuu = new BernsteinDecomposition_R1_to_R1(syuuu.bernsteinDecomposition());
        const h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)));
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)));
        const h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)));
        const h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)));
        return {
            h1 : h1,
            h2 : h2,
            h3 : h3,
            h4 : h4
        };
    }



    curvatureNumerator() {
        const e = this.expensiveComputation(this.spline)
        const distinctKnots = this.spline.distinctKnots()
        const controlPoints = e.h4.flattenControlPointsArray()
        const curvatureNumeratorDegree = 2 * this.spline.degree - 3
        let knots = []
        for (let i = 0; i < distinctKnots.length; i += 1) {
            for (let j = 0; j < curvatureNumeratorDegree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1(controlPoints, knots)

    }

    h1() {
        const e = this.expensiveComputation(this.spline)
        const distinctKnots = this.spline.distinctKnots()
        const controlPoints = e.h1.flattenControlPointsArray()
        const h1Degree = 2 * this.spline.degree - 2
        let knots = []
        for (let i = 0; i < distinctKnots.length; i += 1) {
            for (let j = 0; j < h1Degree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1(controlPoints, knots)

    }

    inflections(curvatureNumerator?: BSpline_R1_to_R1) {
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator()
        }
        const zeros = curvatureNumerator.zeros()
        let result = []
        for (let i = 0; i < zeros.length; i += 1) {
            result.push(this.spline.evaluate(zeros[i]))
        }
        return result

    }


    curvatureDerivativeNumerator() {
        const e = this.expensiveComputation(this.spline)
        const bd_curvatureDerivativeNumerator = (e.h1.multiply(e.h2)).subtract(e.h3.multiply(e.h4).multiplyByScalar(3))
        const distinctKnots = this.spline.distinctKnots()
        const controlPoints = bd_curvatureDerivativeNumerator.flattenControlPointsArray()
        const curvatureDerivativeNumeratorDegree = 4 * this.spline.degree - 6
        let knots = []
        for (let i = 0; i < distinctKnots.length; i += 1) {
            for (let j = 0; j < curvatureDerivativeNumeratorDegree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1(controlPoints, knots)
    }


    curvatureExtrema(curvatureDerivativeNumerator?: BSpline_R1_to_R1) {
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator()
        }
        const zeros = curvatureDerivativeNumerator.zeros()
        let result = []
        for (let i = 0; i < zeros.length; i += 1) {
            result.push(this.spline.evaluate(zeros[i]))
        }
        return result
    }

}