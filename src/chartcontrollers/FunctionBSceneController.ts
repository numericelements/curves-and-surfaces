import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { BSpline_R1_to_R1 } from "../bsplines/BSpline_R1_to_R1";
import { BSpline_R1_to_R2_DifferentialProperties } from "../bsplines/BSpline_R1_to_R2_DifferentialProperties";
import { Vector_2d } from "../mathematics/Vector_2d";
import { ChartController } from "./ChartController";
import { CHART_AXES_NAMES, CHART_AXIS_SCALE, CHART_TITLES, DATASET_NAMES, NB_CURVE_POINTS } from "./ChartSceneController";
import { IObserver } from "../designPatterns/Observer";


export class FunctionBSceneController implements IObserver<BSpline_R1_to_R2_interface> {


    private spline: BSpline_R1_to_R2
    private readonly POINT_SEQUENCE_SIZE = NB_CURVE_POINTS

    constructor(private chartController: ChartController) {
        this.spline = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
    }

    update(message: BSpline_R1_to_R2): void {
        this.spline = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDerivativeNumerator().curve()
        let points = this.pointSequenceOnSpline()

        this.chartController.dataCleanUp();
        this.chartController.addPolylineDataset(DATASET_NAMES[0], this.spline.controlPoints);
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[1], points, {red: 0, green: 0, blue: 200, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }

    reset(message: BSpline_R1_to_R2): void{
        let points: Vector_2d[] = []
        let curvePoints: Vector_2d[] = []
        this.chartController.addPolylineDataset(DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[CHART_AXES_NAMES.length - 1], curvePoints, {red: 100, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }

    pointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree]
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1]
        let result: Vector_2d[] = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            result.push(point);
        }
        return result
    }

}