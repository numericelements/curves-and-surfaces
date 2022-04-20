import { CurveSceneController } from "./controllers/CurveSceneController"
import {WebGLUtils} from "./webgl/webgl-utils"
import { CurveModel } from "./newModels/CurveModel"
import { createProgram } from "./webgl/cuon-utils";
import { ErrorLog } from "./errorProcessing/ErrorLoging"
// import { chartEventListener } from "./chartviews/ChartEventListener";
// import { fileEventListener } from "./filecontrollers/FileEventListener";
// import { CurveShapeModelerUserInterface } from "./userInterfaceController/CurveShapeModelerUserInterface";
// import { curveModelEventListener } from "./curveModeler/CurveModelEventListener";
import { ChartEventListener, CurveModelerEventListener, FileEventListener, ShapeSpaceNavigationEventListener } from "./userInterfaceController/UserInterfaceEventListener";

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
    let imageFile: File

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

    const curveModelerEventListener = new CurveModelerEventListener();
    const sceneController = new CurveSceneController(canvas, gl, curveModelerEventListener);
    const shapeSpaceNavigationEventListener = new ShapeSpaceNavigationEventListener(curveModelerEventListener.curveModeler, sceneController);
    // const sceneController = new CurveSceneController(canvas, gl, curveModelerEventListener);
    const chartEventListener = new ChartEventListener(curveModelerEventListener.curveModeler);
    const fileEventListener = new FileEventListener(curveModelerEventListener, sceneController);


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
        // if(!active_clamping) curveShapeModelerUserInterface.toggleButtonCurveClamping.click();
        if(!active_clamping) curveModelerEventListener.toggleButtonCurveClamping.click();
        ev.preventDefault();
    }

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

    function touch_click(ev: TouchEvent) {
        let c = touch_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDown_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }

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

    function keyDown(ev: KeyboardEvent) {
        const keyName = ev.key
        if(keyName === "Shift") sceneController.shiftKeyDown()
    }

    function keyUp(ev: KeyboardEvent) {
        const keyName = ev.key
        if(keyName === "Shift") sceneController.shiftKeyUp()
    }

    // function inputSelectDegree() {
    //     console.log("select:  " + curveShapeModelerUserInterface.inputDegree.value);
    //     let optionName = "option"
    //     let curveDegree: number;
    //     if(!isNaN(Number(curveShapeModelerUserInterface.inputDegree.value))){
    //         curveDegree = Number(curveShapeModelerUserInterface.inputDegree.value);
    //         curveShapeModelerUserInterface.currentCurveDegree = curveShapeModelerUserInterface.inputDegree.value;
    //         sceneController.inputSelectDegree(curveDegree);
    //         if(curveDegree > 3) {
    //             for(let i = 1; i < (curveDegree - 2); i += 1) {
    //                 console.log("select" + optionName + i.toString());
    //                 let option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
    //                 if(option !== null) option.setAttribute("disabled", "");
    //                 else throw new Error('No id found to identify an Option in the Selector');
    //             }
    //         }
    //     } else {
    //           throw new Error('The selected option cannot be converted into a Number');
    //     }
    // }

    // function inputSelectNavigationMode() {
    //     console.log("select" + curveShapeModelerUserInterface.inputNavigationMode.value);
    //     let navigationMode: number;
    //     navigationMode = Number(curveShapeModelerUserInterface.inputNavigationMode.value);
    //     curveShapeModelerUserInterface.currentNavigationMode = curveShapeModelerUserInterface.inputNavigationMode.value;
    //     sceneController.inputSelectNavigationProcess(navigationMode);
    // }

    // function clickNavigationMode() {
    //     console.log("select Navigation click");
    //     curveShapeModelerUserInterface.inputNavigationMode.value = curveShapeModelerUserInterface.currentNavigationMode;
    // }

    function processInputTexture() {
        textureInfo.width = iconKnotInsertion.width;
        textureInfo.height = iconKnotInsertion.height;
        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, iconKnotInsertion);
    }

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

    /* JCL 2020/10/07 Add event handlers for curve degree selection processing */

    // curveShapeModelerUserInterface.inputNavigationMode.addEventListener('input', inputSelectNavigationMode);
    // curveShapeModelerUserInterface.inputNavigationMode.addEventListener('click', clickNavigationMode);

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