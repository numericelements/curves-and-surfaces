import { createProgram } from "../webgl/cuon-utils";


export class CurveKnotsShaders {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
        'attribute vec3 a_Position; \n' +
        'void main() {\n' +
        '    gl_Position = vec4(a_Position, 1.0); \n' +
        '}\n';

    // Fragment shader program
    private readonly FSHADER_SOURCE = 
        // 'precision highp float; \n' +
        'precision mediump float; \n' +
        'uniform vec4 fColor; \n' +
        'void main() {\n' +
        '    gl_FragColor = fColor; \n' +
        '}\n';


    public program: WebGLProgram | null


    constructor(public gl: WebGLRenderingContext) {
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }

    renderFrame(numberOfElements: number) {

        if(this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }

    }
}

