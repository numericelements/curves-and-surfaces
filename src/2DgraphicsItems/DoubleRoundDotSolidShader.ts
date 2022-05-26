import { createProgram } from "../webgl/cuon-utils";



export class DoubleRoundDotSolidShader {

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
        '     if (dist > 0.4 && dist < 0.55 || dist > 0.75) discard; \n' +
        '     gl_FragColor = a_Color; \n' +
        '}\n';

    public program: WebGLProgram | null;
    private readonly gl: WebGLRenderingContext;


    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }

    renderFrame(numberOfElements: number): void {
        if(this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    }
}

