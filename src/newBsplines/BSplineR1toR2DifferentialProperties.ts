import { BSplineR1toR2 } from "./BSplineR1toR2"
import { AbstractBSplineR1toR2DifferentialProperties } from "./AbstractBSplineR1toR2DifferentialProperties"
import { BSplineR1toR1 } from "./BSplineR1toR1"


export class BSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties {

    constructor(spline: BSplineR1toR2) {
        super(spline);
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): BSplineR1toR1 {
        return new BSplineR1toR1(controlPoints, knots);
    }
}