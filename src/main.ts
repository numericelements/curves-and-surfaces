//import { OvalCurveSceneController } from "./controllers/OvalCurveSceneController"
import { CurveSceneController } from "./controllers/CurveSceneController"
import {WebGLUtils} from "./webgl/webgl-utils"
import { FunctionASceneController } from "./controllers/FunctionASceneController"
import { FunctionBSceneController } from "./controllers/FunctionBSceneController"
import { FunctionBSceneControllerSqrtScaled } from "./controllers/FunctionBSceneControllerSqrtScaled"
import { CurvatureSceneController } from "./controllers/CurvatureSceneController"
import { AbsCurvatureSceneController } from "./controllers/AbsCurvatureSceneController"
import { IRenderFrameObserver } from "./designPatterns/RenderFrameObserver"
import { BSpline_R1_to_R2_interface } from "./mathematics/BSplineInterfaces"

import { Chart } from "chart.js";


export function main() {
    
    let canvas = <HTMLCanvasElement> document.getElementById("webgl")

    /* JCL Get control button IDs for curve control*/
    let toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema")
    let toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections")
    let toggleButtonSliding = <HTMLButtonElement> document.getElementById("toggleButtonSliding")
    let toggleButtonCurveClamping = <HTMLButtonElement> document.getElementById("toggleButtonCurveClamping")

    /* JCL 2020/09/07 Get checkboxes IDs for the selection of function graphs*/
    let checkBoxFunctionA = <HTMLButtonElement> document.getElementById("chkBoxFunctionA")
    let checkBoxFunctionB = <HTMLButtonElement> document.getElementById("chkBoxFunctionB")
    let checkBoxFunctionBsqrtScaled = <HTMLButtonElement> document.getElementById("chkBoxSqrtFunctionB")
    let checkBoxCurvature = <HTMLButtonElement> document.getElementById("chkBoxCurvature")
    let checkBoxAbsCurvature = <HTMLButtonElement> document.getElementById("chkBoxAbsCurvature")
    /*let checkBoxFunctionA = document.querySelector('input[value="functionA"]');
    let checkBoxFunctionB = document.querySelector('input[value="functionB"]');*/

    /* JCL 2020/09/08 Set the reference parameters for the function graphs */
    const MAX_NB_GRAPHS = 3;
    let functionASceneController: IRenderFrameObserver<BSpline_R1_to_R2_interface>;
    let functionBSceneController: IRenderFrameObserver<BSpline_R1_to_R2_interface>;
    let functionBsqrtScaledSceneController: IRenderFrameObserver<BSpline_R1_to_R2_interface>;
    let curvatureSceneController: IRenderFrameObserver<BSpline_R1_to_R2_interface>;
    let absCurvatureSceneController: IRenderFrameObserver<BSpline_R1_to_R2_interface>;
    let stackOfAvailableCharts: Array<string> = ["available", "available", "available"];

    let gl = WebGLUtils().setupWebGL(canvas)

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }

    /*let canvasFunctionA = <HTMLCanvasElement> document.getElementById('chartjsFunctionA')
    let ctxFunctionA = canvasFunctionA.getContext('2d');*/

    let canvasChart1 = <HTMLCanvasElement> document.getElementById('chart1')
    let ctxChart1 = canvasChart1.getContext('2d');

    let canvasChart2 = <HTMLCanvasElement> document.getElementById('chart2')
    let ctxChart2 = canvasChart2.getContext('2d');

    let canvasChart3 = <HTMLCanvasElement> document.getElementById('chart3')
    let ctxChart3 = canvasChart3.getContext('2d');
   

    let chart1 = new Chart(ctxChart1!, {
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
                text: 'Graph1 tbd'
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
    });

    let chart2 = new Chart(ctxChart2!, {
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
                text: 'Graph2 tbd'
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
    });

    let chart3 = new Chart(ctxChart3!, {
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
                text: 'Graph3 tbd'
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'u parameter'
                    }
                }],
                yAxes: [{
                    type: 'linear'
                }]
            },
            animation: {
                duration: 0
            }
        }
    });


    let canvasElementChart1 = chart1.canvas?.parentNode as HTMLCanvasElement;
    canvasElementChart1.style.height = '600px'
    canvasElementChart1.style.width = '400px'

    let canvasElementChart2 = chart2.canvas?.parentNode as HTMLCanvasElement;
    canvasElementChart2.style.height = '600px'
    canvasElementChart2.style.width = '400px'

    let canvasElementChart3 = chart3.canvas?.parentNode as HTMLCanvasElement;
    canvasElementChart3.style.height = '600px'
    canvasElementChart3.style.width = '400px'

    /* JCL 2020/09/09 Generate the scenecontroller with the graphic area only in a first step to add scenecontrollers as required by the user*/
    let sceneController = new CurveSceneController(canvas, gl)

    /*let att = functionB.hasAttribute('display');
    let disp = functionB.getAttribute('display'); */
    let id = document.getElementById('chartjsFunctionB');
    let functionB = document.getElementById('chartjsFunctionB')?.style.display;
    console.log("state chart function B: " + functionB);
    /*if(id !== null) {
        let style = window.getComputedStyle(id, null);
        console.log("style chart function B: " + style.getPropertyValue("display"));
        style.setProperty("display", "none", "important");
        style = window.getComputedStyle(id, null);
        console.log("style chart function B bis: " + style.getPropertyValue("display"));
    }*/



    function mouse_get_NormalizedDeviceCoordinates(event: MouseEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev;

        ev = event;
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        return [x, y];
    }

    function touch_get_NormalizedDeviceCoordinates(event: TouchEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev;
 
        ev = event.touches[0];
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        return [x, y];
    }

    //function click(ev, canvas) {
    function mouse_click(ev: MouseEvent) {
        let c = mouse_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDown_event(c[0], c[1], 0.0005);
        sceneController.renderFrame();
        ev.preventDefault();
    }

    //function drag(ev, canvas) {
    function mouse_drag(ev: MouseEvent) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDragged_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();

    }

    function mouse_stop_drag(ev: MouseEvent) {
        sceneController.leftMouseUp_event();
        ev.preventDefault();
    }

    //function click(ev, canvas) {
    function touch_click(ev: TouchEvent) {
        let c = touch_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDown_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }

    //function drag(ev, canvas) {
    function touch_drag(ev: TouchEvent) {
        var c = touch_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDragged_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }

    function touch_stop_drag(ev: TouchEvent) {
        sceneController.leftMouseUp_event();
        ev.preventDefault();
    }

    function toggleControlOfCurvatureExtrema() {
        sceneController.toggleControlOfCurvatureExtrema()
    }

    function toggleControlOfInflections() {
        sceneController.toggleControlOfInflections()
    }

    function toggleSliding() {
        sceneController.toggleSliding()
    }

    function toggleCurveClamping() {
        sceneController.toggleCurveClamping()
    }

    /* JCL 2020/09/07 Add callbacks for checkbox processing */
    function chkboxFunctionA() {
        let chkboxValue: string = ""
        let functionSceneControllerToRemove: string = ""
        let eventToBeProcessed = sceneController.chkboxFunctionA();
        if(eventToBeProcessed.length < 2) {
            chkboxValue = eventToBeProcessed[0]
        }
        else {
            functionSceneControllerToRemove = eventToBeProcessed[0]
            chkboxValue = eventToBeProcessed[1]
        }
        /* JCL 2020/09/07 Remove functionSceneController indirectly through a message sending process to update the checkboxes */
        switch(functionSceneControllerToRemove) {
            case "-functionB": {
                checkBoxFunctionB.click();
                break;
            }
            case "-sqrtFunctionB": {
                checkBoxFunctionBsqrtScaled.click();
                break;
            }
            case "-curvature": {
                checkBoxCurvature.click();
                break;
            }
            case "-absCurvature": {
                checkBoxAbsCurvature.click();
                break;
            }
        }
        /* JCL 2020/09/07 Process the event related to the checkbox */
        switch(chkboxValue) {
            case "functionA": {
                let indexChart = stackOfAvailableCharts.indexOf("available")
                switch(indexChart) {
                    case 0: {
                        functionASceneController = new FunctionASceneController(chart1);
                        break;
                    }
                    case 1: {
                        functionASceneController = new FunctionASceneController(chart2);
                        break;
                    }
                    case 2: {
                        functionASceneController = new FunctionASceneController(chart3);
                        break;
                    }
                    default: {
                        console.log("Error: no available chart");
                        break;
                    }
                }
                stackOfAvailableCharts[indexChart] = "functionA"
                sceneController.addCurveObserver(functionASceneController)
                break;
            }
            case "-functionA": {
                let indexChart = stackOfAvailableCharts.indexOf("functionA")
                stackOfAvailableCharts[indexChart] = "available"
                sceneController.removeCurveObserver(functionASceneController)
                switch(indexChart) {
                    case 0: {
                        chart1.destroy();
                        chart1 = new Chart(ctxChart1!, {
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
                                    text: 'Graph1 tbd'
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
                        });
                        canvasElementChart1 = chart1.canvas?.parentNode as HTMLCanvasElement;
                        canvasElementChart1.style.height = '600px'
                        canvasElementChart1.style.width = '400px'
                        break;
                    }
                    case 1: {
                        chart2.destroy();
                        chart2 = new Chart(ctxChart2!, {
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
                                    text: 'Graph2 tbd'
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
                        });
                    }
                    case 2: {
                        chart3.destroy();
                        chart3 = new Chart(ctxChart3!, {
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
                                    text: 'Graph3 tbd'
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
                        });
                    }
                }

            }
        }
    }

    function chkboxFunctionB() {
        let chkboxValue: string = ""
        let functionSceneControllerToRemove: string = ""
        let eventToBeProcessed = sceneController.chkboxFunctionB();
        if(eventToBeProcessed.length < 2) {
            chkboxValue = eventToBeProcessed[0]
        }
        else {
            functionSceneControllerToRemove = eventToBeProcessed[0]
            chkboxValue = eventToBeProcessed[1]
        }
        /* JCL 2020/09/07 Remove functionSceneController indirectly through a message sending process to update the checkboxes */
        switch(functionSceneControllerToRemove) {
            case "-functionA": {
                checkBoxFunctionA.click();
                break;
            }
            case "-sqrtFunctionB": {
                checkBoxFunctionBsqrtScaled.click();
                break;
            }
            case "-curvature": {
                checkBoxCurvature.click();
                break;
            }
            case "-absCurvature": {
                checkBoxAbsCurvature.click();
                break;
            }
        }
        switch(chkboxValue) {
            case "functionB": {
                let indexChart = stackOfAvailableCharts.indexOf("available")
                switch(indexChart) {
                    case 0: {
                        functionBSceneController = new FunctionBSceneController(chart1);
                        break;
                    }
                    case 1: {
                        functionBSceneController = new FunctionBSceneController(chart2);
                        break;
                    }
                    case 2: {
                        functionBSceneController = new FunctionBSceneController(chart3);
                        break;
                    }
                    default: {
                        console.log("Error: no available chart");
                        break;
                    }
                }
                stackOfAvailableCharts[indexChart] = "functionB"
                sceneController.addCurveObserver(functionBSceneController)
                break;
            }
            case "-functionB": {
                let indexChart = stackOfAvailableCharts.indexOf("functionB")
                stackOfAvailableCharts[indexChart] = "available"
                sceneController.removeCurveObserver(functionBSceneController)
            }
        }
    }

    function chkboxFunctionBsqrtScaled() {
        let chkboxValue: string = ""
        let functionSceneControllerToRemove: string = ""
        let eventToBeProcessed = sceneController.chkboxFunctionBsqrtScaled();
        if(eventToBeProcessed.length < 2) {
            chkboxValue = eventToBeProcessed[0]
        }
        else {
            functionSceneControllerToRemove = eventToBeProcessed[0]
            chkboxValue = eventToBeProcessed[1]
        }
        switch(functionSceneControllerToRemove) {
            case "-functionA": {
                checkBoxFunctionA.click();
                break;
            }
            case "-functionB": {
                checkBoxFunctionB.click();
                break;
            }
            case "-curvature": {
                checkBoxCurvature.click();
                break;
            }
            case "-absCurvature": {
                checkBoxAbsCurvature.click();
                break;
            }
        }
        switch(chkboxValue) {
            case "sqrtFunctionB": {
                let indexChart = stackOfAvailableCharts.indexOf("available")
                switch(indexChart) {
                    case 0: {
                        functionBsqrtScaledSceneController = new FunctionBSceneControllerSqrtScaled(chart1);
                        break;
                    }
                    case 1: {
                        functionBsqrtScaledSceneController = new FunctionBSceneControllerSqrtScaled(chart2);
                        break;
                    }
                    case 2: {
                        functionBsqrtScaledSceneController = new FunctionBSceneControllerSqrtScaled(chart3);
                        break;
                    }
                    default: {
                        console.log("Error: no available chart");
                        break;
                    }
                }
                stackOfAvailableCharts[indexChart] = "sqrtFunctionB"
                sceneController.addCurveObserver(functionBsqrtScaledSceneController)
                break;
            }
            case "-sqrtFunctionB": {
                let indexChart = stackOfAvailableCharts.indexOf("sqrtFunctionB")
                stackOfAvailableCharts[indexChart] = "available"
                sceneController.removeCurveObserver(functionBsqrtScaledSceneController)
            }
        }
    }

    function chkboxCurvature() {
        let chkboxValue: string = ""
        let functionSceneControllerToRemove: string = ""
        let eventToBeProcessed = sceneController.chkboxCurvature();
        if(eventToBeProcessed.length < 2) {
            chkboxValue = eventToBeProcessed[0]
        }
        else {
            functionSceneControllerToRemove = eventToBeProcessed[0]
            chkboxValue = eventToBeProcessed[1]
        }
        switch(functionSceneControllerToRemove) {
            case "-functionA": {
                checkBoxFunctionA.click();
                break;
            }
            case "-functionB": {
                checkBoxFunctionB.click();
                break;
            }
            case "-sqrtFunctionB": {
                checkBoxFunctionBsqrtScaled.click();
                break;
            }
            case "-absCurvature": {
                checkBoxAbsCurvature.click();
                break;
            }
        }
        switch(chkboxValue) {
            case "curvature": {
                let indexChart = stackOfAvailableCharts.indexOf("available")
                switch(indexChart) {
                    case 0: {
                        curvatureSceneController = new CurvatureSceneController(chart1);
                        break;
                    }
                    case 1: {
                        curvatureSceneController = new CurvatureSceneController(chart2);
                        break;
                    }
                    case 2: {
                        curvatureSceneController = new CurvatureSceneController(chart3);
                        break;
                    }
                    default: {
                        console.log("Error: no available chart");
                        break;
                    }
                }
                stackOfAvailableCharts[indexChart] = "curvature"
                sceneController.addCurveObserver(curvatureSceneController)
                break;
            }
            case "-curvature": {
                let indexChart = stackOfAvailableCharts.indexOf("curvature")
                stackOfAvailableCharts[indexChart] = "available"
                sceneController.removeCurveObserver(curvatureSceneController)
            }
        }
    }

    function chkboxAbsCurvature() {
        let chkboxValue: string = ""
        let functionSceneControllerToRemove: string = ""
        let eventToBeProcessed = sceneController.chkboxAbsCurvature();
        if(eventToBeProcessed.length < 2) {
            chkboxValue = eventToBeProcessed[0]
        }
        else {
            functionSceneControllerToRemove = eventToBeProcessed[0]
            chkboxValue = eventToBeProcessed[1]
        }
        switch(functionSceneControllerToRemove) {
            case "-functionA": {
                checkBoxFunctionA.click();
                break;
            }
            case "-functionB": {
                checkBoxFunctionB.click();
                break;
            }
            case "-sqrtFunctionB": {
                checkBoxFunctionBsqrtScaled.click();
                break;
            }
            case "-curvature": {
                checkBoxCurvature.click();
                break;
            }
        }
        switch(chkboxValue) {
            case "absCurvature": {
                let indexChart = stackOfAvailableCharts.indexOf("available")
                switch(indexChart) {
                    case 0: {
                        absCurvatureSceneController = new AbsCurvatureSceneController(chart1);
                        break;
                    }
                    case 1: {
                        absCurvatureSceneController = new AbsCurvatureSceneController(chart2);
                        break;
                    }
                    case 2: {
                        absCurvatureSceneController = new AbsCurvatureSceneController(chart3);
                        break;
                    }
                    default: {
                        console.log("Error: no available chart");
                        break;
                    }
                }
                stackOfAvailableCharts[indexChart] = "absCurvature"
                sceneController.addCurveObserver(absCurvatureSceneController)
                break;
            }
            case "-absCurvature": {
                let indexChart = stackOfAvailableCharts.indexOf("absCurvature")
                stackOfAvailableCharts[indexChart] = "available"
                sceneController.removeCurveObserver(absCurvatureSceneController)
            }
        }
    }

    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);

    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema)
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections)
    toggleButtonSliding.addEventListener('click', toggleSliding)
    toggleButtonCurveClamping.addEventListener('click', toggleCurveClamping)

    /* JCL 2020/09/07 Add event handlers for checkbox processing */
    checkBoxFunctionA.addEventListener('click',chkboxFunctionA);
    checkBoxFunctionB.addEventListener('click',chkboxFunctionB);
    checkBoxFunctionBsqrtScaled.addEventListener('click',chkboxFunctionBsqrtScaled);
    checkBoxCurvature.addEventListener('click',chkboxCurvature);
    checkBoxAbsCurvature.addEventListener('click',chkboxAbsCurvature)


    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);

    sceneController.renderFrame()
   
}

main()