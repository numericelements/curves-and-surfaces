import { IObserver } from "../designPatterns/Observer";
import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { ControlPointsShaders } from "../views/ControlPointsShaders";
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonShaders } from "../views/ControlPolygonShaders";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveShaders } from "../views/CurveShaders";
import { CurveView } from "../views/CurveView";
import { BSpline_R1_to_R1 } from "../bsplines/BSpline_R1_to_R1";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";
import { BSpline_R1_to_R2_DifferentialProperties } from "../bsplines/BSpline_R1_to_R2_DifferentialProperties";
import { Vector_2d } from "../mathematics/Vector_2d";
import { ChartController } from "./ChartController";


export class FunctionBSceneControllerSqrtScaled implements IRenderFrameObserver<BSpline_R1_to_R2_interface> {


    private spline: BSpline_R1_to_R2
    private readonly POINT_SEQUENCE_SIZE = 100


    constructor(private chartController: ChartController) {
        this.spline = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
    }

    update(message: BSpline_R1_to_R2): void {
        this.spline = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDerivativeNumerator().curve()
        let points = this.pointSequenceOnSpline();
        let scaledPoints: Vector_2d[] = [];
        points.forEach(element => {
            /* apply a non linear transformation to graphically emphasize the behavior of function B around 0 */
            if(element.y < 0.0)
            {
                element.y = - Math.sqrt(Math.abs(element.y));
            }
            else
            {
                 element.y = Math.sqrt(element.y);
            }
            scaledPoints.push(new Vector_2d(element.x, element.y))
        });

        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset('sqrt Function B', points, {red: 0, green: 0, blue: 200, alpha: 0.5});
        this.chartController.setChartLabel('Function (+/-)sqrt[abs(B(u))]');
        this.chartController.setYaxisScale('linear');
        this.chartController.drawChart();
    }

    reset(message: BSpline_R1_to_R2): void {
    }

    renderFrame() {
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