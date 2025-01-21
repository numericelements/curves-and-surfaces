"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureSceneController = void 0;
var BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
var ChartSceneController_1 = require("./ChartSceneController");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
var PeriodicBSplineR1toR2DifferentialProperties_1 = require("../newBsplines/PeriodicBSplineR1toR2DifferentialProperties");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var CurvatureSceneController = /** @class */ (function () {
    function CurvatureSceneController(chartController) {
        this.chartController = chartController;
        this.POINT_SEQUENCE_SIZE = ChartSceneController_1.NB_CURVE_POINTS;
        this.splineNumerator = new BSplineR1toR1_1.BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).convertTocurve();
        this.splineDenominator = new BSplineR1toR1_1.BSplineR1toR1([0, 1, 0], [0, 0, 0, 1, 1, 1]).convertTocurve();
    }
    CurvatureSceneController.prototype.update = function (message) {
        if (message instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.splineNumerator = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(message).curvatureNumerator().convertTocurve();
            this.splineDenominator = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(message).curvatureDenominator().convertTocurve();
        }
        else if (message instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.splineNumerator = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(message).curvatureNumerator().convertTocurve();
            this.splineDenominator = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(message).curvatureDenominator().convertTocurve();
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", "inconsistent class name to update the chart.");
            error.logMessage();
        }
        var points = this.pointSequenceOnSpline();
        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[2], points, { red: 0, green: 200, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[2]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    };
    CurvatureSceneController.prototype.reset = function (message) {
        var points = [];
        var curvePoints = [];
        this.chartController.addPolylineDataset(ChartSceneController_1.DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[ChartSceneController_1.CHART_AXES_NAMES.length - 1], curvePoints, { red: 100, green: 0, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[ChartSceneController_1.CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    };
    CurvatureSceneController.prototype.pointSequenceOnSpline = function () {
        var start = this.splineNumerator.knots[this.splineNumerator.degree];
        var end = this.splineNumerator.knots[this.splineNumerator.knots.length - this.splineNumerator.degree - 1];
        var result = [];
        for (var i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            var pointNumerator = this.splineNumerator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            var pointDenominator = this.splineDenominator.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            var point = pointNumerator;
            point.y = point.y / Math.pow(pointDenominator.y, (3 / 2));
            result.push(point);
        }
        return result;
    };
    return CurvatureSceneController;
}());
exports.CurvatureSceneController = CurvatureSceneController;
