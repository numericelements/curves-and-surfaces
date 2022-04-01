import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { Vector2d } from "../mathVector/Vector2d";
import { ChartController } from "./ChartController";
import { CHART_AXES_NAMES, CHART_AXIS_SCALE, CHART_TITLES, DATASET_NAMES, NB_CURVE_POINTS } from "./ChartSceneController";
import { IObserver } from "../designPatterns/Observer";
import { type } from "os";
import { AbstractBSplineR1toR2 } from "../newBsplines/AbstractBSplineR1toR2";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";


export class AbsCurvatureSceneController implements IObserver<BSplineR1toR2Interface> {


    private splineNumerator: AbstractBSplineR1toR2;
    private splineDenominator: AbstractBSplineR1toR2;
    private readonly POINT_SEQUENCE_SIZE = NB_CURVE_POINTS;

    constructor(private chartController: ChartController) {
        
        this.splineNumerator = new BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve();
        this.splineDenominator = new BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve();
    }



    update(message: BSplineR1toR2): void {
        this.splineNumerator = new BSplineR1toR2DifferentialProperties(message).curvatureNumerator().curve()
        this.splineDenominator = new BSplineR1toR2DifferentialProperties(message).curvatureDenominator().curve()

        let points = this.pointSequenceOnSpline()

        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[3], points, {red: 0, green: 200, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[3]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[1]);
        this.chartController.drawChart();
    }

    reset(message: BSplineR1toR2): void{
        let points: Vector2d[] = []
        let curvePoints: Vector2d[] = []
        this.chartController.addPolylineDataset(DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(CHART_AXES_NAMES[CHART_AXES_NAMES.length - 1], curvePoints, {red: 100, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel(CHART_TITLES[CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();

    }

    pointSequenceOnSpline(): Vector2d[] {
        const start = this.splineNumerator.knots[this.splineNumerator.degree]
        const end = this.splineNumerator.knots[this.splineNumerator.knots.length - this.splineNumerator.degree - 1]
        let result: Vector2d[] = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let pointNumerator = this.splineNumerator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let pointDenominator = this.splineDenominator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let point = pointNumerator;
            point.y = point.y/Math.pow(pointDenominator.y, (3/2));
            point.y = Math.abs(point.y);
            result.push(point);
        }
        return result;
    }
    
}