import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { BSpline_R1_to_R1 } from "../mathematics/BSpline_R1_to_R1";
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";
import { Chart } from "chart.js";
import { Vector_2d } from "../mathematics/Vector_2d";


export class CurvatureSceneController implements IRenderFrameObserver<BSpline_R1_to_R2_interface> {


    private splineNumerator: BSpline_R1_to_R2
    private splineDenominator: BSpline_R1_to_R2
    private readonly POINT_SEQUENCE_SIZE = 100

    constructor(private chart: Chart) {
        
        this.splineNumerator = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
        this.splineDenominator = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
    }



    update(message: BSpline_R1_to_R2): void {
        this.splineNumerator = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureNumerator().curve()
        this.splineDenominator = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDenominator().curve()

        let newDataSpline: Chart.ChartPoint[] = [] 
        let points = this.pointSequenceOnSpline()
        points.forEach(element => {
            newDataSpline.push({x: element.x, y: element.y})
        });

        this.chart.data.datasets! = [{
            label: 'Curvature',
            data: newDataSpline,
            fill: false,
            showLine: true,
            pointRadius: 0, 
            borderColor: 'rgba(0, 200, 0, 0.5)'
        }]
        this.chart.options! = {
            title: {
                display: true,
                text: 'Curvature of curve'
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

    reset(message: BSpline_R1_to_R2): void{
        this.chart.data.datasets! = [{
            label: 'tbd',
            data: [{
                x: 0,
                y: 0
            }],
            fill: false,
            lineTension: 0,
            showLine: true
           }]
        this.chart.options! = {
            title: {
                display: true,
                text: 'Graph tbd'
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
        const start = this.splineNumerator.knots[this.splineNumerator.degree]
        const end = this.splineNumerator.knots[this.splineNumerator.knots.length - this.splineNumerator.degree - 1]
        let result: Vector_2d[] = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let pointNumerator = this.splineNumerator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let pointDenominator = this.splineDenominator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            let point = pointNumerator;
            point.y = point.y/Math.pow(pointDenominator.y, (3/2));
            result.push(point);
        }
        return result
    }
    
}