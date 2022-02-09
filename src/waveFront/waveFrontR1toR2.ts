import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1";
import { BSplineR1toR1 } from "../bsplines/BSplineR1toR1";
import { BSplineR1toR2 } from "../bsplines/BSplineR1toR2";
import { RationalBSplineR1toR2 } from "../bsplines/RationalBSplineR1toR2";

export class WaveFrontR1toR2 {



    constructor(private mirror: BSplineR1toR1) {
    }

    /*
    computeWaveFront() : RationalBSplineR1toR2 {
        let m = this.mirror.clone()
        let mu = this.mirror.derivative()

        const bdm = new BernsteinDecompositionR1toR1(m.bernsteinDecomposition())
        const bdmu = new BernsteinDecompositionR1toR1(mu.bernsteinDecomposition())
        const bdmu2 = bdmu.multiply(bdmu)
        let mu2 = 

    }
    */

}