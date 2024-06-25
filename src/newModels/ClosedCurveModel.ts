import { Vector2d } from "../mathVector/Vector2d";
import { PeriodicBSplineR1toR2withOpenKnotSequence, create_PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence"
// import { OptimizationProblemPeriodicBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2"
// import { Optimizer } from "../optimizers/Optimizer"
import { AbstractCurveModel } from "./AbstractCurveModel"



export class ClosedCurveModel extends AbstractCurveModel {

    protected _spline: PeriodicBSplineR1toR2withOpenKnotSequence;
    // protected optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2;

    constructor() {
        super();
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2] ];
        let cp1: number[][] = [];
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]]);
        }

        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this._spline = create_PeriodicBSplineR1toR2(cp1, knots);


        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)

       console.log("end constructor ClosedCurveModel")
    }

    get isClosed(): boolean {
        return true;
    }

    get spline(): PeriodicBSplineR1toR2withOpenKnotSequence {
        return this._spline.clone();
    }
    
    setSpline(spline: PeriodicBSplineR1toR2withOpenKnotSequence): void {
        this._spline = spline;
        this.notifyObservers();
    }

    addControlPoint(controlPointIndex: number | null): void {
        let cp = controlPointIndex
        if (cp != null) {
            if (cp === 0) { cp += 1}
            if (cp === this._spline.freeControlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this._spline.grevilleAbscissae()
            let meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp+1]) / 2
            if (meanGA < this._spline.knots[this._spline.degree]) {
                let index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                let index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._spline.insertKnot(meanGA)
        }
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setActiveControl(): void {
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }
    
    setControlPoints(controlPoints: Vector2d[]) {
        this.spline.controlPoints = controlPoints;
        //this.notifyObservers()
    }
}