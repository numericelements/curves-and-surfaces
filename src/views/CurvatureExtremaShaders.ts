import { createProgram } from "../webgl/cuon-utils";

export class CurvatureExtremaShaders {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
        'attribute vec3 a_Position; \n' +
        'attribute vec2 a_Texture; \n' +
        'varying vec2 v_Texture; \n' +
        'void main() {\n' +
        '    v_Texture = a_Texture; \n' +
        '    gl_Position = vec4(a_Position, 1.0); \n' +
        '}\n';

    // Fragment shader program
    private readonly FSHADER_SOURCE = 
        'precision highp float; \n' +
        'uniform vec4 a_Color; \n' +
        'varying vec2 v_Texture; \n' +
        'void main() {\n' +
        '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
        '     if (dist > 0.5) discard; \n' +
        '     gl_FragColor = a_Color; \n' +
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

