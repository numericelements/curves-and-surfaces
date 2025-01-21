"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoFunctionSceneController = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
var ChartSceneController_1 = require("./ChartSceneController");
var NoFunctionSceneController = /** @class */ (function () {
    function NoFunctionSceneController(chartController) {
        this.chartController = chartController;
    }
    NoFunctionSceneController.prototype.update = function (message) {
        var points = [];
        points.push(new Vector2d_1.Vector2d(0.0, 0.0));
        this.chartController.dataCleanUp();
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[ChartSceneController_1.CHART_AXES_NAMES.length - 1], points, { red: 0, green: 0, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[ChartSceneController_1.CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    };
    NoFunctionSceneController.prototype.reset = function (message) {
        var points = [];
        var curvePoints = [];
        this.chartController.addPolylineDataset(ChartSceneController_1.DATASET_NAMES[1], points);
        this.chartController.addCurvePointDataset(ChartSceneController_1.CHART_AXES_NAMES[ChartSceneController_1.CHART_AXES_NAMES.length - 1], curvePoints, { red: 0, green: 0, blue: 0, alpha: 0.5 });
        this.chartController.setChartLabel(ChartSceneController_1.CHART_TITLES[ChartSceneController_1.CHART_TITLES.length - 1]);
        this.chartController.setYaxisScale(ChartSceneController_1.CHART_AXIS_SCALE[0]);
        this.chartController.drawChart();
    };
    return NoFunctionSceneController;
}());
exports.NoFunctionSceneController = NoFunctionSceneController;
