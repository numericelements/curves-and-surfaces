"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineSegmentShader = void 0;
const cuon_utils_1 = require("../webgl/cuon-utils");
class LineSegmentShader {
    constructor(gl) {
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 
        /* JCL 2020/09/28 Add control management of the control polygon */
        'precision mediump float; \n' +
            'uniform vec4 fColor; \n' +
            'void main() {\n' +
            '    gl_FragColor = fColor; \n' +
            /*'     gl_FragColor = vec4(216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05); \n' +  */
            '}\n';
        this.gl = gl;
        this.program = (0, cuon_utils_1.createProgram)(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfElements) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
    }
}
exports.LineSegmentShader = LineSegmentShader;
;
