import { IObserver } from "../designPatterns/Observer";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { ControlPointsShaders } from "../views/ControlPointsShaders";
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonShaders } from "../views/ControlPolygonShaders";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveShaders } from "../views/CurveShaders";
import { CurveView } from "../views/CurveView";
import { BSpline_R1_to_R1 } from "../mathematics/BSpline_R1_to_R1";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";
import { Chart } from "chart.js";
import { Vector_2d } from "../mathematics/Vector_2d";


export class FunctionBSceneControllerSqrtScaled implements IRenderFrameObserver<BSpline_R1_to_R2_interface> {


    private spline: BSpline_R1_to_R2
    private readonly POINT_SEQUENCE_SIZE = 100



    constructor(private chart: Chart) {
        this.spline = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
    }

    update(message: BSpline_R1_to_R2): void {
        this.spline = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDerivativeNumerator().curve()

       /*let newDataCP: Chart.ChartPoint[] = [] 
       this.spline.controlPoints.forEach(element => {
           newDataCP.push({x: element.x, y: element.y})
       });
       */

       let newDataSpline: Chart.ChartPoint[] = [] 
       let points = this.pointSequenceOnSpline()
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
           newDataSpline.push({x: element.x, y: element.y})
       });


       this.chart.data.datasets! = [
       {
           label: 'sqrt Function B',
           data: newDataSpline,
           fill: false,
           showLine: true,
           pointRadius: 0, 
           borderColor: 'rgba(000, 0, 200, 0.5)'
       }]

       this.chart.options! = {
        title: {
            display: true,
            text: 'Function (+/-)sqrt[abs(B(u))]'
        },
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'u parameter'
                }
            }]
        },
        animation: {
            duration: 0
        }
   }

       this.chart.update()

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