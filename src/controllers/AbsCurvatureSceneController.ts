import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { BSpline_R1_to_R1 } from "../mathematics/BSpline_R1_to_R1";
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";
import { Vector_2d } from "../mathematics/Vector_2d";
import { ChartController } from "./ChartController";


export class AbsCurvatureSceneController implements IRenderFrameObserver<BSpline_R1_to_R2_interface> {


    private splineNumerator: BSpline_R1_to_R2
    private splineDenominator: BSpline_R1_to_R2
    private readonly POINT_SEQUENCE_SIZE = 100

    constructor(private chartController: ChartController) {
        
        this.splineNumerator = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
        this.splineDenominator = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
    }



    update(message: BSpline_R1_to_R2): void {
        this.splineNumerator = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureNumerator().curve()
        this.splineDenominator = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDenominator().curve()
        let points = this.pointSequenceOnSpline()

        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset('Curvature', points, {red: 0, green: 200, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel('Curvature of curve');
        this.chartController.setYaxisScale('logarithmic');
        this.chartController.drawChart();
    }

    reset(message: BSpline_R1_to_R2): void{
        let points: Vector_2d[] = []
        let curvePoints: Vector_2d[] = []
        this.chartController.addPolylineDataset('tbd', points);
        this.chartController.addCurvePointDataset('tbd', curvePoints, {red: 100, green: 0, blue: 0, alpha: 0.5});
        this.chartController.setChartLabel('Graph tbd');
        this.chartController.setYaxisScale('linear');
        this.chartController.drawChart();

    }

    renderFrame() {
    }

    pointSequenceOnSpline() {
        const start = this.splineNumerator.knots[this.splineNumerator.degree]
        const end = this.splineNumerator.knots[this.splineNumerator.knots.length - this.splineNumerator.degree - 1]
        let result: Vector_2d[] = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let pointNumerator = this.splineNumerator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let pointDenominator = this.splineDenominator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let point = pointNumerator;
            point.y = point.y/Math.pow(pointDenominator.y, (3/2));
            point.y = Math.abs(point.y);
            result.push(point);
        }
        return result
    }
    
}