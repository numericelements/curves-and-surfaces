import { PeriodicBSplineR1toR2 } from "./PeriodicBSplineR1toR2"
import { PeriodicBSplineR1toR1 } from "./PeriodicBSplineR1toR1"
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1"
import { AbstractBSplineR1toR2DifferentialProperties } from "./AbstractBSplineR1toR2DifferentialProperties"
import { BSplineR1toR1 } from "./BSplineR1toR1"



export class PeriodicBSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties {

    constructor(spline: PeriodicBSplineR1toR2) {
        super(spline)
    }

    expensiveComputation(spline: PeriodicBSplineR1toR2) {
        const sx = new PeriodicBSplineR1toR1(spline.getControlPointsX(), spline.knots) 
        const sy = new PeriodicBSplineR1toR1(spline.getControlPointsY(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const bdsxu = new BernsteinDecompositionR1toR1(sxu.bernsteinDecomposition())
        const bdsyu = new BernsteinDecompositionR1toR1(syu.bernsteinDecomposition())
        const bdsxuu = new BernsteinDecompositionR1toR1(sxuu.bernsteinDecomposition())
        const bdsyuu = new BernsteinDecompositionR1toR1(syuu.bernsteinDecomposition())
        const bdsxuuu = new BernsteinDecompositionR1toR1(sxuuu.bernsteinDecomposition())
        const bdsyuuu = new BernsteinDecompositionR1toR1(syuuu.bernsteinDecomposition())
        const h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)))
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)))
        const h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)))
        const h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)))
        return {
            h1 : h1,
            h2 : h2,
            h3 : h3,
            h4 : h4
        }
    }

    /*
    curvatureExtrema(_curvatureDerivativeNumerator?: BSplineR1toR1) {
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator()
        }
        const zeros = _curvatureDerivativeNumerator.zeros()
        let result = []
        for (let z of zeros) {
            result.push(this._spline.evaluate(z))
        }
        return result
    }
    */

    curvatureExtrema(curvatureDerivativeNumerator?: BSplineR1toR1) {
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator()
        }
        const zeros = curvatureDerivativeNumerator.zeros(10e-3)
        let result = []
        for (let z of zeros) {
            result.push(this._spline.evaluate(z))
        }
        const a = curvatureDerivativeNumerator.controlPoints[0]
        const b = curvatureDerivativeNumerator.controlPoints[curvatureDerivativeNumerator.controlPoints.length - 1]
        if (a * b < 0 ) { // a and b have different sign
            const u = curvatureDerivativeNumerator.knots[curvatureDerivativeNumerator.knots.length - 1]
            result.push(this._spline.evaluate(u))
        }
        return result;
    }

}