import { ChartSceneController, CHART_TITLES } from "../chartcontrollers/ChartSceneController"
import { CurveModel } from "../models/CurveModel"

let chartFunctionA = false;
let chartFunctionB = false;
let chartCurvatureCrv = false;
let chartAbsCurvatureCurv = false;
let chartFunctionBsqrtScaled = false;
let noAddChart = false;

/* Get checkboxes IDs for the selection of function graphs*/
const checkBoxFunctionA = <HTMLButtonElement> document.getElementById("chkBoxFunctionA");
const checkBoxFunctionB = <HTMLButtonElement> document.getElementById("chkBoxFunctionB");
const checkBoxFunctionBsqrtScaled = <HTMLButtonElement> document.getElementById("chkBoxSqrtFunctionB");
const checkBoxCurvature = <HTMLButtonElement> document.getElementById("chkBoxCurvature");
const checkBoxAbsCurvature = <HTMLButtonElement> document.getElementById("chkBoxAbsCurvature");

export function chartEventListener(curveModel: CurveModel): ChartSceneController {

    function setupChartRenderingContexts() {
        const canvasChart1 = <HTMLCanvasElement> document.getElementById('chart1');
        const ctxChart1 = canvasChart1.getContext('2d');
        const canvasChart2 = <HTMLCanvasElement> document.getElementById('chart2');
        const ctxChart2 = canvasChart2.getContext('2d');
        const canvasChart3 = <HTMLCanvasElement> document.getElementById('chart3');
        const ctxChart3 = canvasChart3.getContext('2d');
        if(ctxChart1 !== null) chartRenderingContext.push(ctxChart1);
        if(ctxChart2 !== null) chartRenderingContext.push(ctxChart2);
        if(ctxChart3 !== null) chartRenderingContext.push(ctxChart3);
    }

    let chartRenderingContext: CanvasRenderingContext2D[] = [];
    setupChartRenderingContexts();
    const chartSceneController = new ChartSceneController(chartRenderingContext, curveModel);

    function uncheckCkbox() {
        console.log("uncheckChart " + chartSceneController.uncheckedChart)
        if(CHART_TITLES.indexOf(chartSceneController.uncheckedChart) !== -1) {
            noAddChart = true;
            switch(chartSceneController.uncheckedChart) {
                case CHART_TITLES[0]:
                    console.log("uncheck " +CHART_TITLES[0])
                    checkBoxFunctionA.click();
                    break;
                case CHART_TITLES[1]:
                    console.log("uncheck " +CHART_TITLES[1])
                    checkBoxFunctionB.click();
                    break;
                case CHART_TITLES[2]:
                    console.log("uncheck " +CHART_TITLES[2])
                    checkBoxCurvature.click();
                    break;
                case CHART_TITLES[3]:
                    console.log("uncheck " +CHART_TITLES[3])
                    checkBoxAbsCurvature.click();
                    break;
                case CHART_TITLES[4]:
                    console.log("uncheck " +CHART_TITLES[4])
                    checkBoxFunctionBsqrtScaled.click();
                    break;
            }
        }
        chartSceneController.resetUncheckedChart();
        noAddChart = false;
    }

    function chkboxFunctionA() {
        if(chartFunctionA) {
            chartFunctionA = false;
            if(!noAddChart) chartSceneController.addChart(CHART_TITLES[0]);
        } else {
            chartFunctionA = true;
            chartSceneController.addChart(CHART_TITLES[0]);
            uncheckCkbox();
        }
    }

    function chkboxFunctionB() {
        if(chartFunctionB) {
            chartFunctionB = false;
            if(!noAddChart) chartSceneController.addChart(CHART_TITLES[1]);
        } else {
            chartFunctionB = true;
            chartSceneController.addChart(CHART_TITLES[1]);
            uncheckCkbox();
        }
    }

    function chkboxCurvature() {
        if(chartCurvatureCrv) {
            chartCurvatureCrv = false;
            if(!noAddChart) chartSceneController.addChart(CHART_TITLES[2]);
        } else {
            chartCurvatureCrv = true;
            chartSceneController.addChart(CHART_TITLES[2]);
            uncheckCkbox();
        }
    }

    function chkboxAbsCurvature() {
        if(chartAbsCurvatureCurv) {
            chartAbsCurvatureCurv = false;
            if(!noAddChart) chartSceneController.addChart(CHART_TITLES[3]);
        } else {
            chartAbsCurvatureCurv = true;
            chartSceneController.addChart(CHART_TITLES[3]);
            uncheckCkbox();
        }
    }

    function chkboxFunctionBsqrtScaled() {
        if(chartFunctionBsqrtScaled) {
            chartFunctionBsqrtScaled = false;
            if(!noAddChart) chartSceneController.addChart(CHART_TITLES[4]);
        } else {
            chartFunctionBsqrtScaled = true;
            chartSceneController.addChart(CHART_TITLES[4]);
            uncheckCkbox();
        }
    }

    /* Add event handlers for checkbox processing */
    checkBoxFunctionA.addEventListener('click',chkboxFunctionA);
    checkBoxFunctionB.addEventListener('click',chkboxFunctionB);
    checkBoxFunctionBsqrtScaled.addEventListener('click',chkboxFunctionBsqrtScaled);
    checkBoxCurvature.addEventListener('click',chkboxCurvature);
    checkBoxAbsCurvature.addEventListener('click',chkboxAbsCurvature);

    return chartSceneController;
}

export function resetChartContext(chartSceneController: ChartSceneController, curveModel: CurveModel) {
    chartSceneController.restart(curveModel);
    noAddChart = true;
    if(chartFunctionA) checkBoxFunctionA.click();
    if(chartFunctionB) checkBoxFunctionB.click();
    if(chartCurvatureCrv) checkBoxCurvature.click();
    if(chartAbsCurvatureCurv) checkBoxAbsCurvature.click();
    if(chartFunctionBsqrtScaled) checkBoxFunctionBsqrtScaled.click();
    noAddChart = false;
}
