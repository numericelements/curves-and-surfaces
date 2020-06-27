//import { OvalCurveSceneController } from "./controllers/OvalCurveSceneController"
import { CurveSceneController } from "./controllers/CurveSceneController"
import {WebGLUtils} from "./webgl/webgl-utils"
import { FunctionASceneController } from "./controllers/FunctionASceneController"
import { FunctionBSceneController } from "./controllers/FunctionBSceneController"

import Chart from 'chart.js'


export function main() {
    
    let canvas = <HTMLCanvasElement> document.getElementById("webgl")
    let toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema")
    let toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections")
    let toggleButtonSliding = <HTMLButtonElement> document.getElementById("toggleButtonSliding")

    let gl = WebGLUtils().setupWebGL(canvas)

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }



    let canvasFunctionA = <HTMLCanvasElement> document.getElementById('chartjsFunctionA')
    let ctxFunctionA = canvasFunctionA.getContext('2d');

    let canvasFunctionB = <HTMLCanvasElement> document.getElementById('chartjsFunctionB')
    let ctxFunctionB = canvasFunctionB.getContext('2d');

   

    let chartFunctionA = new Chart(ctxFunctionA!, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Function A',
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
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            animation: {
                duration: 0
            }
        }
    });

    let chartFunctionB = new Chart(ctxFunctionB!, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Function B',
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
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            animation: {
                duration: 0
            }
        }
    });

    let canvasElementFunctionA = chartFunctionA.canvas?.parentNode as HTMLCanvasElement;
    canvasElementFunctionA.style.height = '600px'
    canvasElementFunctionA.style.width = '300px' 

    let canvasElementFunctionB = chartFunctionB.canvas?.parentNode as HTMLCanvasElement;
    canvasElementFunctionB.style.height = '600px'
    canvasElementFunctionB.style.width = '300px' 
 

    let functionASceneController = new FunctionASceneController(chartFunctionA) 
    let functionBSceneController = new FunctionBSceneController(chartFunctionB)     
    let sceneController = new CurveSceneController(canvas, gl, [functionASceneController, functionBSceneController])


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


    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);

    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema)
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections)
    toggleButtonSliding.addEventListener('click', toggleSliding)


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