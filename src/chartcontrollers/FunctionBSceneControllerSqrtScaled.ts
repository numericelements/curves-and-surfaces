import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { Vector2d } from "../mathVector/Vector2d";
import { ChartController } from "./ChartController";
import { CHART_AXES_NAMES, CHART_AXIS_SCALE, CHART_TITLES, DATASET_NAMES, NB_CURVE_POINTS } from "./ChartSceneController";
import { IObserver } from "../newDesignPatterns/Observer";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { ErrorLog } from "../errorProcessing/ErrorLoging";


export class FunctionBSceneControllerSqrtScaled implements IObserver<BSplineR1toR2Interface> {


    private spline: BSplineR1toR2;
    private readonly POINT_SEQUENCE_SIZE = NB_CURVE_POINTS;


    constructor(private chartController: ChartController) {
        this.spline = new BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve();
    }

    update(message: BSplineR1toR2Interface): void {
        if(message instanceof BSplineR1toR2) {
            this.spline = new BSplineR1toR2DifferentialProperties(message).curvatureDerivativeNumerator().curve();
        } else if(message instanceof PeriodicBSplineR1toR2) {
            this.spline = new PeriodicBSplineR1toR2DifferentialProperties(message).curvatureDerivativeNumerator().curve();
        } else {
            const error = new ErrorLog(this.constructor.name, "update", "inconsistent class name to update the chart.");
            error.logMessageToConsole();
        }

        let points = this.pointSequenceOnSpline();
        points.forEach(element => {
            /* apply a non linear transformation to graphically emphasize the behavior of function B around 0 */
            if(element.y < 0.0) {
                element.y = - Math.sqrt(Math.abs(element.y));
            } else {
                 element.y = Math.sqrt(element.y);
            }
        });

        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[4], points, {red: 0, green: 0, blue: 200, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[4]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }

    reset(message: BSplineR1toR2Interface): void {
        let points: Vector2d[] = [];
        let curvePoints: Vector2d[] = [];
        this.chartController.addPolylineDataset(DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[CHART_AXES_NAMES.length - 1], curvePoints, {red: 100, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }

    pointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        let result: Vector2d[] = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            result.push(point);
        }
        return result;
    }
    
}