import { Vector3d } from "../../mathVector/Vector3d"
import { ScaledBernsteinDecompositionR1toR1, unScaledSplineRecomposition } from "../R1toR1/ScaledBernsteinDecompositionR1toR1"
import { BSplineR1toR1 } from "../R1toR1/BSplineR1toR1"
import { IBSplineR1toR1 } from "../R1toR1/IBSplineR1toR1"
import { BSplineR1toR3 } from "./BSplineR1toR3"


export class BSplineR1toR3DifferentialProperties {

    protected _spline: BSplineR1toR3
    protected derivatives: {
        xu: ScaledBernsteinDecompositionR1toR1,
        yu: ScaledBernsteinDecompositionR1toR1,
        zu: ScaledBernsteinDecompositionR1toR1,
        xuu: ScaledBernsteinDecompositionR1toR1,
        yuu: ScaledBernsteinDecompositionR1toR1,
        zuu: ScaledBernsteinDecompositionR1toR1,
        xuuu: ScaledBernsteinDecompositionR1toR1,
        yuuu: ScaledBernsteinDecompositionR1toR1,
        zuuu: ScaledBernsteinDecompositionR1toR1}

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): IBSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots)
    }


    constructor(spline: BSplineR1toR3) {
        this._spline = spline.clone()
        this.derivatives = this.computeDerivatives(this._spline)
    }

    protected computeDerivatives(spline: BSplineR1toR3) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots)
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots)
        const sz = this.bSplineR1toR1Factory(spline.getControlPointsZ(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const szu = sz.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const szuu = szu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const szuuu = szuu.derivative()
        return {
            xu: sxu.scaledBernsteinDecomposition(),
            yu: syu.scaledBernsteinDecomposition(),
            zu: szu.scaledBernsteinDecomposition(),
            xuu: sxuu.scaledBernsteinDecomposition(),
            yuu: syuu.scaledBernsteinDecomposition(),
            zuu: szuu.scaledBernsteinDecomposition(),
            xuuu: sxuuu.scaledBernsteinDecomposition(),
            yuuu: syuuu.scaledBernsteinDecomposition(),
            zuuu: szuuu.scaledBernsteinDecomposition()
        };
    }

    torsionNumerator() {
        const s = this.derivatives
        const t1 = s.yu.multiply(s.zuu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.xu.multiply(s.zuu))
        const t3 = s.xu.multiply(s.yuu).subtract(s.xuu.multiply(s.yu))
        const distinctKnots = this._spline.getDistinctKnots()
        const result = s.xuuu.multiply(t1).add(s.yuuu.multiply(t2).add(s.zuuu.multiply(t3)))
        //return result.splineRecomposition(distinctKnots)
        return unScaledSplineRecomposition(result, distinctKnots)

    }

    curvatureSquaredNumerator() {
        const s = this.derivatives
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu))
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu))
        const result = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3)))
        const distinctKnots = this._spline.getDistinctKnots()
        //return result.splineRecomposition(distinctKnots)
        return unScaledSplineRecomposition(result, distinctKnots)
    }

    curvatureSquaredDerivativeNumerator() {
        const s = this.derivatives
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu))
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu))

        const t4 = s.zuuu.multiply(s.yu).subtract(s.yuuu.multiply(s.zu))
        const t5 = s.xuuu.multiply(s.zu).subtract(s.zuuu.multiply(s.xu))
        const t6 = s.yuuu.multiply(s.xu).subtract(s.xuuu.multiply(s.yu))
        const t7 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu))
        const t8 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu))

        const t9 = ((t1.multiply(t4)).add(t2.multiply(t5)).add(t3.multiply(t6))).multiply(t7)
        const t10 = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3))).multiply(t8)
        const result = t9.subtract(t10.multiplyByScalar(3))
        const distinctKnots = this._spline.getDistinctKnots()
        //return result.splineRecomposition(distinctKnots)
        return unScaledSplineRecomposition(result, distinctKnots)
    }

    curvatureDerivativeZeros() {
        const curvatureDerivative = this.curvatureSquaredDerivativeNumerator()
        const zeros = curvatureDerivative.zeros()
        let result = []
        for (let z of zeros) {
            result.push(this._spline.evaluate(z))
        }
        return result

    }

    torsionZeros() {
        const torsionNumerator = this.torsionNumerator()
        const zeros = torsionNumerator.zeros()
        let result = []
        for (let z of zeros) {
            result.push(this._spline.evaluate(z))
        }
        return result
    }

}


export interface Derivatives {
    x: ScaledBernsteinDecompositionR1toR1
    y: ScaledBernsteinDecompositionR1toR1
    z: ScaledBernsteinDecompositionR1toR1
    xu: ScaledBernsteinDecompositionR1toR1
    yu: ScaledBernsteinDecompositionR1toR1
    zu: ScaledBernsteinDecompositionR1toR1
    xuu: ScaledBernsteinDecompositionR1toR1
    yuu: ScaledBernsteinDecompositionR1toR1
    zuu: ScaledBernsteinDecompositionR1toR1
    xuuu: ScaledBernsteinDecompositionR1toR1
    yuuu: ScaledBernsteinDecompositionR1toR1
    zuuu: ScaledBernsteinDecompositionR1toR1
}