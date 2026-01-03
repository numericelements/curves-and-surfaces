"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionASceneController = void 0;
const BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
const ChartSceneController_1 = require("./ChartSceneController");
const PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
const PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
class FunctionASceneController {
    constructor(chartController) {
        this.chartController = chartController;
        this.POINT_SEQUENCE_SIZE = ChartSceneController_1.NB_CURVE_POINTS;
        this.spline = new BSplineR1toR1_1.BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).convertTocurve();
    }
    update(message) {
        if (message instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.spline = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(message).curvatureNumerator().convertTocurve();
        }
        else if (message instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.spline = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(message).curvatureNumerator().convertTocurve();
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", "inconsistent class name to update the chart.");
            error.logMessage();
        }
        let points = this.pointSequenceOnSpline();
        this.chartController.dataCleanUp();
        this.chartController.addPolylineDataset(ChartSceneController_1.DATASET_NAMES[0], this.spline.controlPoints);
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[0], points, { red: 200, green: 0, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[0]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }
    reset(message) {
        console.log("reset chart FunctionA");
        let points = [];
        let curvePoints = [];
        this.chartController.addPolylineDataset(ChartSceneController_1.DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[ChartSceneController_1.CHART_AXES_NAMES.length - 1], curvePoints, { red: 100, green: 0, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[ChartSceneController_1.CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    }
    pointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        let result = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            result.push(point);
        }
        return result;
    }
}
exports.FunctionASceneController = FunctionASceneController;
