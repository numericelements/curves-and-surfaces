"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartController = void 0;
const chart_js_1 = require("chart.js");
const ChartSceneController_1 = require("./ChartSceneController");
class ChartController {
    constructor(chartTitle, canvasContext, chartHeight, chartWidth, chartXaxisLabel) {
        var _a;
        this.chartTitle = chartTitle;
        this.canvasContext = canvasContext;
        this.chartHeight = chartHeight;
        this.chartWidth = chartWidth;
        this.chartXaxisLabel = chartXaxisLabel;
        this.dataCP = [];
        this.dataSpline = [];
        this.datasetPolylineLabel = '';
        this.datasetCurveLabel = '';
        this.colorSpline = '';
        this.yAxisScale = ChartSceneController_1.CHART_AXIS_SCALE[0];
        if (chartXaxisLabel)
            this.chartXaxisLabel = chartXaxisLabel;
        else
            this.chartXaxisLabel = ChartSceneController_1.CHART_X_AXIS_NAME;
        this.chart = new chart_js_1.Chart(canvasContext, {
            type: 'scatter',
            data: {
                datasets: [{
                        label: ChartSceneController_1.DATASET_NAMES[1],
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
                            type: ChartSceneController_1.CHART_AXIS_SCALE[0],
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
            }
        });
        this.canvasElementChart = (_a = this.chart.canvas) === null || _a === void 0 ? void 0 : _a.parentNode;
        this.canvasElementChart.style.height = chartHeight;
        this.canvasElementChart.style.width = chartWidth;
    }
    addPolylineDataset(datasetLabel, dataPoints) {
        this.datasetPolylineLabel = datasetLabel;
        this.dataCP = [];
        dataPoints.forEach(element => {
            this.dataCP.push({ x: element.x, y: element.y });
        });
    }
    addCurvePointDataset(datasetLabel, curvePoints, color) {
        this.datasetCurveLabel = datasetLabel;
        let curveColor = 'rgba(';
        let colorCode = color.red.toString() + ', ' + color.green.toString() + ', ' + color.blue.toString() + ', ' + color.alpha.toString();
        this.colorSpline = curveColor.concat(colorCode, ')');
        this.dataSpline = [];
        curvePoints.forEach(element => {
            this.dataSpline.push({ x: element.x, y: element.y });
        });
    }
    setChartLabel(chartLabel) {
        this.chartTitle = chartLabel;
    }
    setYaxisScale(scaleType) {
        this.yAxisScale = scaleType;
    }
    dataCleanUp() {
        this.dataCP = [];
        this.dataSpline = [];
    }
    drawChart() {
        if (this.dataCP.length === 0) {
            this.chart.data.datasets = [{
                    label: this.datasetCurveLabel,
                    data: this.dataSpline,
                    fill: false,
                    showLine: true,
                    pointRadius: 0,
                    borderColor: this.colorSpline
                }];
        }
        else {
            this.chart.data.datasets = [{
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
                }];
        }
        this.chart.options = {
            title: {
                display: true,
                text: this.chartTitle
            },
            scales: {
                xAxes: [{
                        type: ChartSceneController_1.CHART_AXIS_SCALE[0],
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
    destroy() {
        this.chart.destroy();
    }
}
exports.ChartController = ChartController;
