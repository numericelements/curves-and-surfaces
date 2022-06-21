import { createProgram } from "../webgl/cuon-utils";

export class PolylineShader {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
        'attribute vec3 a_Position; \n' +
        'void main() {\n' +
        '    gl_Position = vec4(a_Position, 1.0); \n' +
        '}\n';

   // Fragment shader program
   private readonly FSHADER_SOURCE = 
        'precision mediump float; \n' +
        'uniform vec4 fColor; \n' +
        'void main() {\n' +
        '    gl_FragColor = fColor; \n' +
        '}\n';

   public program: WebGLProgram | null;
   private readonly gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }

    renderFrame(numberOfVertices: number): void {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, numberOfVertices);
    }
};
