import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "./BSplineR1toR1"
import { BSplineR1toR1Interface } from "./BSplineR1toR1Interface"


export abstract class AbstractBSplineR1toR2DifferentialProperties {

    protected _spline: BSplineR1toR2Interface;

    abstract bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1Interface;


    constructor(spline: BSplineR1toR2Interface) {
        this._spline = spline.clone();
    }

    protected expensiveComputation(spline: BSplineR1toR2Interface): {h1 : BernsteinDecompositionR1toR1,
                                                                    h2 : BernsteinDecompositionR1toR1,
                                                                    h3 : BernsteinDecompositionR1toR1,
                                                                    h4 : BernsteinDecompositionR1toR1 } {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const bdsxu = sxu.bernsteinDecomposition();
        const bdsyu = syu.bernsteinDecomposition();
        const bdsxuu = sxuu.bernsteinDecomposition();
        const bdsyuu = syuu.bernsteinDecomposition();
        const bdsxuuu = sxuuu.bernsteinDecomposition();
        const bdsyuuu = syuuu.bernsteinDecomposition();
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



    curvatureNumerator():BSplineR1toR1 {
        const e = this.expensiveComputation(this._spline);
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = e.h4.flattenControlPointsArray();
        const curvatureNumeratorDegree = 2 * this._spline.degree - 3;
        let knots = [];
        for (let knot of distinctKnots){
            for (let j = 0; j < curvatureNumeratorDegree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1(controlPoints, knots);
    }

    curvatureDenominator(): BSplineR1toR1 {
        const curve = this.h1();
        const controlPoints1 = curve.controlPoints;
        let knots = curve.knots;
        return new BSplineR1toR1(controlPoints1, knots);
    }

    h1():BSplineR1toR1 {
        const e = this.expensiveComputation(this._spline);
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = e.h1.flattenControlPointsArray();
        const h1Degree = 2 * this._spline.degree - 2;
        let knots = [];

        for (let knot of distinctKnots){
            for (let j = 0; j < h1Degree + 1; j += 1) {
                knots.push(knot);
            }
        }

        return new BSplineR1toR1(controlPoints, knots);
    }

    inflections(curvatureNumerator?: BSplineR1toR1): Vector2d[] {
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator();
        }
        const zeros = curvatureNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;

    }

    curvatureDerivativeNumerator(): BSplineR1toR1 {
        const e = this.expensiveComputation(this._spline);
        const bd_curvatureDerivativeNumerator = (e.h1.multiply(e.h2)).subtract(e.h3.multiply(e.h4).multiplyByScalar(3));
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = bd_curvatureDerivativeNumerator.flattenControlPointsArray();
        const curvatureDerivativeNumeratorDegree = 4 * this._spline.degree - 6;
        let knots = [];
        for (let knot of distinctKnots) {
            for (let j = 0; j < curvatureDerivativeNumeratorDegree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1(controlPoints, knots);
    }


    curvatureExtrema(_curvatureDerivativeNumerator?: BSplineR1toR1): Vector2d[] {
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = _curvatureDerivativeNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;
    }

    transitionCurvatureExtrema(_curvatureDerivativeNumerator?: BSplineR1toR1) {
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = _curvatureDerivativeNumerator.zerosPolygonVsFunctionDiffViewer()
        let result = []
        for (let z of zeros) {
            result.push(this._spline.evaluate(z))
        }
        return result
    }
}