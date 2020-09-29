import { createProgram } from "../webgl/cuon-utils";

export class ControlPolygonShaders {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
       'attribute vec3 a_Position; \n' +
       'void main() {\n' +
       '    gl_Position = vec4(a_Position, 1.0); \n' +
       '}\n';

   // Fragment shader program
   private readonly FSHADER_SOURCE = 
   /* JCL 2020/09/28 Add control management of the control polygon */
        'precision mediump float; \n' +
        'uniform vec4 fColor; \n' +
        'void main() {\n' +
        '    gl_FragColor = fColor; \n' +
        /*'     gl_FragColor = vec4(216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05); \n' +  */
        '}\n';

        //   open curve     '     gl_FragColor = vec4(216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05); \n' +
        //   closed curve       '     gl_FragColor = vec4(190.0/255.0, 190.0/255.0, 190.0/255.0, 0.95); \n' +


   public program: WebGLProgram | null

    constructor(public gl: WebGLRenderingContext) {
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }

    renderFrame(numberOfElements: number) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
    }


};
