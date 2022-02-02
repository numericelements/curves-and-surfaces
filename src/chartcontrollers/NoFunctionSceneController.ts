import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { ChartController } from "./ChartController";
import { Vector_2d } from "../mathematics/Vector_2d";
import { CHART_AXES_NAMES, CHART_AXIS_SCALE, CHART_TITLES, DATASET_NAMES } from "./ChartSceneController";
import { IObserver } from "../designPatterns/Observer";

export class NoFunctionSceneController implements IObserver<BSpline_R1_to_R2_interface> {

    constructor(private chartController: ChartController) {
    }

    update(message: BSpline_R1_to_R2): void {
        let points: Vector_2d[] = []
        points.push(new Vector_2d(0.0, 0.0))
        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[CHART_AXES_NAMES.length - 1], points, {red: 0, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }

    reset(message: BSpline_R1_to_R2): void{
        let points: Vector_2d[] = []
        let curvePoints: Vector_2d[] = []
        this.chartController.addPolylineDataset(DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[CHART_AXES_NAMES.length - 1], curvePoints, {red: 0, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }
    
}