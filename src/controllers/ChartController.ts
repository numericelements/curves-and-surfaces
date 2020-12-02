import { Chart } from "chart.js";
import { Vector_2d } from "../mathematics/Vector_2d";

export class ChartController {

    public chart: Chart
    private canvasElementChart: HTMLCanvasElement
    private datasetPolylineLabel: string
    private datasetCurveLabel: string
    private dataCP: Chart.ChartPoint[] = []
    private dataSpline: Chart.ChartPoint[] = []
    private colorSpline: string
    private yAxisScale: string

    constructor(public chartTitle: string, private canvasContext: CanvasRenderingContext2D, private chartHeight: string, private chartWidth: string, public chartXaxisLabel?: string) {
        
        this.datasetPolylineLabel = '';
        this.datasetCurveLabel = '';
        this.colorSpline = '';
        this.yAxisScale = 'linear';
        if(chartXaxisLabel) this.chartXaxisLabel = chartXaxisLabel
            else this.chartXaxisLabel = 'u parameter';

        this.chart = new Chart(canvasContext!, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'tbd',
                    data: [{
                        x: 0,
                        y: 0
                    }],
                    fill: false,
                    lineTension: 0,
                    showLine: true
                }]
            },
            options: {
                title: {
                    display: true,
                    text: chartTitle
                },
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: this.chartXaxisLabel
                        }
                    }]
                },
                animation: {
                    duration: 0
                }
            }
        });
        this.canvasElementChart = this.chart.canvas?.parentNode as HTMLCanvasElement;
        this.canvasElementChart.style.height = chartHeight;
        this.canvasElementChart.style.width = chartWidth;

    }

    addPolylineDataset(datasetLabel: string, dataPoints: Vector_2d[]): void {
        this.datasetPolylineLabel = datasetLabel;

        this.dataCP = [];
        dataPoints.forEach(element => {
            this.dataCP.push({x: element.x, y: element.y})
        });
    }

    addCurvePointDataset(datasetLabel: string, curvePoints:  Vector_2d[], color: {red: number, green: number, blue: number, alpha: number}): void {
        this.datasetCurveLabel = datasetLabel;

        let curveColor: string = 'rgba(';
        let colorCode: string = color.red.toString() + ', ' + color.green.toString() + ', ' + color.blue.toString() + ', ' + color.alpha.toString();
        this.colorSpline = curveColor.concat(colorCode, ')');

        this.dataSpline = [];
        curvePoints.forEach(element => {
            this.dataSpline.push({x: element.x, y: element.y})
        });
    }

    setChartLabel(chartLabel: string): void {
        this.chartTitle = chartLabel;
    }

    setYaxisScale(scaleType: string): void {
        this.yAxisScale = scaleType;
    }

    dataCleanUp() {
        this.dataCP = [];
        this.dataSpline = [];
    }

    drawChart() {
        if(this.dataCP.length === 0) {
            this.chart.data.datasets! = [{
                label: this.datasetCurveLabel,
                data: this.dataSpline,
                fill: false,
                showLine: true,
                pointRadius: 0, 
                borderColor: this.colorSpline
            }];
        } else {
            this.chart.data.datasets! = [{
                label: this.datasetPolylineLabel,
                data: this.dataCP,
                fill: false,
                lineTension: 0,
                showLine: true
            },
            {
                label: this.datasetCurveLabel,
                data: this.dataSpline,
                fill: false,
                showLine: true,
                pointRadius: 0, 
                borderColor: this.colorSpline
            }]
        }

        this.chart.options! = {
            title: {
                display: true,
                text: this.chartTitle
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: this.chartXaxisLabel
                    }
                }],
                yAxes: [{
                    type: this.yAxisScale
                }]
            },
            animation: {
                duration: 0
            }
        };

        this.chart.update();
    }

    destroy(): void {
        this.chart.destroy();
    }

}