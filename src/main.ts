//import { OvalCurveSceneController } from "./controllers/OvalCurveSceneController"
import { CurveSceneController } from "./controllers/CurveSceneController"
import {WebGLUtils} from "./webgl/webgl-utils"
import { ChartController } from "./controllers/ChartController"
import { FunctionASceneController } from "./controllers/FunctionASceneController"
import { FunctionBSceneController } from "./controllers/FunctionBSceneController"
import { FunctionBSceneControllerSqrtScaled } from "./controllers/FunctionBSceneControllerSqrtScaled"
import { CurvatureSceneController } from "./controllers/CurvatureSceneController"
import { AbsCurvatureSceneController } from "./controllers/AbsCurvatureSceneController"
import { IRenderFrameObserver } from "./designPatterns/RenderFrameObserver"
import { BSpline_R1_to_R2_interface } from "./bsplines/BSplineInterfaces"

import { CurveModel } from "./models/CurveModel"
import { createProgram } from "./webgl/cuon-utils";


export function main() {

    let VSHADER_SOURCE = 
        'attribute vec4 a_position;\n' +
        'attribute vec2 a_texcoord;\n' +
        'uniform mat4 u_matrix;\n' +
        'varying vec2 v_texcoord;\n' +
        'void main() {\n' +
        '   gl_Position = u_matrix * a_position;\n' +
        '   v_texcoord = a_texcoord;\n' +
        '}\n';
    
    let  FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'varying vec2 v_texcoord;\n' +
    'uniform sampler2D u_texture;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_texture, v_texcoord);\n' +
    '}\n';
    
    let canvas = <HTMLCanvasElement> document.getElementById("webgl")
    /* JCL Get icons of insert knot and insert control point functions */
    let iconKnotInsertion: HTMLImageElement;

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
    let inputDegree = <HTMLSelectElement> document.getElementById("curveDegree")
    let currentCurveDegree = "3"
    let inputNavigationMode = <HTMLSelectElement> document.getElementById("navigationMode")
    let currentNavigationMode = "0"
    /*let checkBoxFunctionA = document.querySelector('input[value="functionA"]');
    let checkBoxFunctionB = document.querySelector('input[value="functionB"]');*/

    /* JCL 2020/10/13 Get input IDs for file management purposes */
    let buttonFileLoad = <HTMLButtonElement> document.getElementById("buttonFileLoad")
    let buttonFileSave = <HTMLButtonElement> document.getElementById("buttonFileSave")
    let inputFileLoad = <HTMLInputElement>document.getElementById("inputFileLoad")
    let inputFileSave = <HTMLInputElement> document.getElementById("inputFileSave")
    let inputFileName = <HTMLInputElement> document.getElementById("inputFileName")
    let validateInput = <HTMLButtonElement> document.getElementById("validateInput")
    let labelFileExtension = <HTMLLabelElement> document.getElementById("labelFileExtension")
    let currentFileName: string = ""
    let fileR = new FileReader()
    //let imageFile: File

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

    /* JCL Test */
    let program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if (!program) {
        console.log('Failed to create program');
    }
    //gl.useProgram(program);
    let positionLocation = gl.getAttribLocation(program, "a_position");
    let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    // lookup uniforms
    let matrixLocation = gl.getUniformLocation(program, "u_matrix");
    let textureLocation = gl.getUniformLocation(program, "u_texture");
    // Create a buffer.
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    let positions = [
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coords
    let texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Put texcoords in the buffer
    let texcoords = [
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    let textureInfo = {
        width: 1,   // we don't know the size until it loads
        height: 1,
        texture: tex,
    };
    iconKnotInsertion = new Image();

    /*let canvasFunctionA = <HTMLCanvasElement> document.getElementById('chartjsFunctionA')
    let ctxFunctionA = canvasFunctionA.getContext('2d');*/

    let canvasChart1 = <HTMLCanvasElement> document.getElementById('chart1')
    let ctxChart1 = canvasChart1.getContext('2d');

    let canvasChart2 = <HTMLCanvasElement> document.getElementById('chart2')
    let ctxChart2 = canvasChart2.getContext('2d');

    let canvasChart3 = <HTMLCanvasElement> document.getElementById('chart3')
    let ctxChart3 = canvasChart3.getContext('2d');
   
    let chart1 = new ChartController('Graph1 tbd', ctxChart1!, '600px', '700px');
    let chart2 = new ChartController('Graph2 tbd', ctxChart2!, '600px', '700px');
    let chart3 = new ChartController('Graph3 tbd', ctxChart3!, '600px', '700px');

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

    /* JCL 2020/09/24 Add event processing with mouse double click for clamped control point selection/deselection */
    function mouse_double_click(ev: MouseEvent) {
        let c = mouse_get_NormalizedDeviceCoordinates(ev);
        let active_clamping = sceneController.dbleClick_event(c[0], c[1], 0.0005);
        sceneController.renderFrame();
        console.log("mouse_double_click: " + active_clamping);
        if(!active_clamping) toggleButtonCurveClamping.click();
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

    function keyDown(ev: KeyboardEvent) {
        const keyName = ev.key
        if(keyName === "Shift") sceneController.shiftKeyDown()
    }

    function keyUp(ev: KeyboardEvent) {
        const keyName = ev.key
        if(keyName === "Shift") sceneController.shiftKeyUp()
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
                        chart1 = new ChartController('Graph1 tbd', ctxChart1!, '600px', '700px');
                        break;
                    }
                    case 1: {
                        chart2.destroy();
                        chart2 = new ChartController('Graph2 tbd', ctxChart2!, '600px', '700px');
                        break;
                    }
                    case 2: {
                        chart3.destroy();
                        chart3 = new ChartController('Graph3 tbd', ctxChart3!, '600px', '700px');
                        break;
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

    function inputSelectDegree() {
        console.log("select:  " + inputDegree.value);
        let optionName = "option"
        let curveDegree: number;
        if(!isNaN(Number(inputDegree.value))){
            curveDegree = Number(inputDegree.value);
            currentCurveDegree = inputDegree.value;
            sceneController.inputSelectDegree(curveDegree);
            if(curveDegree > 3) {
                for(let i = 1; i < (curveDegree - 2); i += 1) {
                    console.log("select" + optionName + i.toString());
                    let option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                    if(option !== null) option.setAttribute("disabled", "");
                    else throw new Error('No id found to identify an Option in the Selector');
                }
            }
        } else {
              throw new Error('The selected option cannot be converted into a Number');
        }
    }

    function inputSelectNavigationMode() {
        console.log("select" + inputNavigationMode.value);
        let optionName = "option"
        let navigationMode: number;
        navigationMode = Number(inputNavigationMode.value);
        currentNavigationMode = inputNavigationMode.value;
        sceneController.inputSelectNavigationProcess(navigationMode);

    }

    function clickSelectDegree() {
        console.log("select Degree click");
        inputDegree.value = currentCurveDegree;
    }

    function clickNavigationMode() {
        console.log("select Navigation click");
        inputNavigationMode.value = currentNavigationMode;
    }

    function buttonFileLoadCurve(ev: MouseEvent) {
        if(inputFileLoad !== null) inputFileLoad.click();
        //ev.preventDefault();
    }

    function buttonFileSaveCurve(ev: MouseEvent) {
        if(currentFileName === "") {
            inputFileName.style.display = "inline";
            labelFileExtension.style.display = "inline";
            validateInput.style.display = "inline";
        }
        else {
            sceneController.saveCurveToFile(currentFileName);
        }
        ev.preventDefault();
    }

    function inputLoadFileCurve() {
        if(inputFileLoad !== null) {
            let aFileList = inputFileLoad.files;
            if(aFileList !== null && aFileList.length > 0) {
                if(aFileList.item(0)?.name !== undefined) {
                    let curveFile = aFileList.item(0);
                    if(curveFile !== null) {
                        inputFileLoad.value = ""
                        currentFileName = curveFile.name;
                        if(currentFileName.indexOf(".json") !== -1) {
                            fileR.readAsText(curveFile);
                        } else if(currentFileName.indexOf(".png") !== -1) {
                            console.log("read an image");
                            fileR.readAsArrayBuffer(curveFile);
                            iconKnotInsertion.src = currentFileName
                            //imageFile = curveFile
                        }
                    }
                }
            }
        }
    }

    function inputSaveFileCurve() {
    }

    function inputCurveFileName() {
    }

    function inputButtonValidate() {
        currentFileName = inputFileName.value;
        console.log("inputButtonValidate:" + inputFileName.value)
        inputFileName.style.display = "none";
        labelFileExtension.style.display = "none";
        validateInput.style.display = "none";
        sceneController.saveCurveToFile(currentFileName);
    }
    function processInputTexture() {
        textureInfo.width = iconKnotInsertion.width;
        textureInfo.height = iconKnotInsertion.height;
        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, iconKnotInsertion);
    }

    function processInputFile(ev: ProgressEvent) {
        if(ev.target !== null) console.log("Reading the file" + currentFileName);
        if(fileR.readyState === fileR.DONE) {
            if(fileR.result !== null) {
                let aString = "";
                if(typeof fileR.result === "string") {
                    aString = fileR.result.toString();
                } else {
                    /* JCL 2020/10/16 fileR.result is of type ArrayBuffer */
                    //Promise.all([createImageBitmap(imageFile)]).then(function(image){ iconKnotInsertion = image[0]})
                    //const requiredData = await Promise.all([createImageBitmap(imageFile)])
                    //iconKnotInsertion = requiredData[0]
                    //Promise.all([createImageBitmap(imageFile)])
                    if(currentFileName.indexOf(".png") !== -1) {
                        console.log("Input file is an image. No need to reinitialize curve controls.")
                        return
                    }
                    /*let string  = new String(fileR.result);
                    aString = string.toString();*/
                }
                let aSpline = sceneController.loadCurveFromFile(aString);

                if(typeof(aSpline) !== "undefined") {
                    /* JCL 2020/10/18 Reconfigure the degree selector */
                    let newCurveDegree = aSpline.degree;
                    if(newCurveDegree >= 3) {
                        let optionNumber = Number(currentCurveDegree) - 2;
                        let optionName = "option";
                        let option = <HTMLOptionElement> document.getElementById(optionName + optionNumber);
                        option.setAttribute("selected", "");
                        option = <HTMLOptionElement> document.getElementById(optionName + (newCurveDegree - 2).toString());
                        option.setAttribute("selected", "selected");
                        for(let i = 1; i < (newCurveDegree - 2); i += 1) {
                            let option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                            if(option !== null) option.setAttribute("disabled", "");
                            else throw new Error('No id found to identify an Option in the Selector');
                        }
                        for(let i = (newCurveDegree - 2); i <= 4; i += 1) {
                            let option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                            //if(option !== null) option.setAttribute("disabled", "disabled");
                            if(option !== null) option.removeAttribute("disabled");
                            else throw new Error('No id found to identify an Option in the Selector');
                        }
                        currentCurveDegree = newCurveDegree.toString();
                        inputDegree.click();
                    } else {
                        throw new Error("Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
                    }
                } else throw new Error("Unable to update the curve degree selector. Undefined curve model");

                /* JCL 2020/10/18 Reset all the active checkboxes */
                for(let item of stackOfAvailableCharts) {
                    switch (item) {
                        case "functionA": {
                            checkBoxFunctionA.click()
                            break;
                        }
                        case "functionB": {
                            checkBoxFunctionB.click()
                            break;
                        }
                        case "sqrtFunctionB": {
                            checkBoxFunctionBsqrtScaled.click()
                            break;
                        }
                        case "curvature": {
                            checkBoxCurvature.click()
                            break;
                        }
                        case "absCurvature": {
                            checkBoxAbsCurvature.click()
                            break;
                        }
                    }
                }
                stackOfAvailableCharts = ["available", "available", "available"];

                /* JCL 2020/10/15 Reinitialize the three graphs */
                chart1.destroy();
                chart1 = new ChartController('Graph1 tbd', ctxChart1!, '600px', '700px');
                chart2.destroy();
                chart2 = new ChartController('Graph2 tbd', ctxChart2!, '600px', '700px');
                chart3.destroy();
                chart3 = new ChartController('Graph3 tbd', ctxChart3!, '600px', '700px');

                /* JCL 2020/10/18 Reset the appropriate control buttons */
                if(!sceneController.sliding) {
                    toggleButtonSliding.click()
                }
                if(!sceneController.controlOfCurvatureExtrema) {
                    toggleButtonCurvatureExtrema.click()
                }
                if(!sceneController.controlOfInflection) {
                    toggleButtonInflection.click()
                }
                if(!sceneController.controlOfCurveClamping) {
                    toggleButtonCurveClamping.click()
                }
                if(typeof(aSpline) !== "undefined") {
                    sceneController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
                } else throw new Error("Unable to reset the curve context. Undefined curve model");
                // to be discussed
                //sceneController = new CurveSceneController(canvas, gl, , curveModel)

            } else {
                throw new Error('Error when reading the input file. Incorrect text format.');
            } 
        }
    };

    function drawImage(tex: any, texWidth: number, texHeight: number, dstX: number, dstY: number) {
        gl.bindTexture(gl.TEXTURE_2D, tex);

        // Tell WebGL to use our shader program pair
        gl.useProgram(program);

        // Setup the attributes to pull data from our buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        // this matrix will convert from pixels to clip space
        /*var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        // this matrix will translate our quad to dstX, dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // this matrix will scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, texWidth, texHeight, 1);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);*/

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(textureLocation, 0);

        // draw the quad (2 triangles, 6 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    
    function loadImageAndCreateTextureInfo(url: string) {
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));
    
        // let's assume all images are not a power of 2
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
        let textureInfo = {
          width: 1,   // we don't know the size until it loads
          height: 1,
          texture: tex,
        };
        let img = new Image();
        img.addEventListener('load', function() {
          textureInfo.width = img.width;
          textureInfo.height = img.height;
    
          gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        });
        img.src = url;
    
        return textureInfo;
    }

    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);
    /* JCL 2020/09/25 Add dble click event processing */
    canvas.addEventListener('dblclick', mouse_double_click, false);

    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema)
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections)
    toggleButtonSliding.addEventListener('click', toggleSliding)
    toggleButtonCurveClamping.addEventListener('click', toggleCurveClamping)

    /* JCL 2020/09/07 Add event handlers for checkbox processing */
    checkBoxFunctionA.addEventListener('click',chkboxFunctionA);
    checkBoxFunctionB.addEventListener('click',chkboxFunctionB);
    checkBoxFunctionBsqrtScaled.addEventListener('click',chkboxFunctionBsqrtScaled);
    checkBoxCurvature.addEventListener('click',chkboxCurvature);
    checkBoxAbsCurvature.addEventListener('click',chkboxAbsCurvature);

    /* JCL 2020/10/07 Add event handlers for curve degree selection processing */
    inputDegree.addEventListener('input', inputSelectDegree);
    inputDegree.addEventListener('click', clickSelectDegree);

    inputNavigationMode.addEventListener('input', inputSelectNavigationMode);
    inputNavigationMode.addEventListener('click', clickNavigationMode);

    /* JCL 2020/10/13 Add event handlers for file processing */
    buttonFileLoad.addEventListener('click', buttonFileLoadCurve);
    buttonFileSave.addEventListener('click', buttonFileSaveCurve);
    inputFileLoad.addEventListener('input', inputLoadFileCurve);
    inputFileSave.addEventListener('input', inputSaveFileCurve);
    inputFileName.addEventListener('input', inputCurveFileName);
    validateInput.addEventListener('click', inputButtonValidate);
    fileR.addEventListener('load', processInputFile);
    iconKnotInsertion.addEventListener('load', processInputTexture);

    document.body.addEventListener('keydown', keyDown);
    document.body.addEventListener('keyup', keyUp);
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