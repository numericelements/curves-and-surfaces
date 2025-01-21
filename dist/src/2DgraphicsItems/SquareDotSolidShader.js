"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareDotSolidShader = void 0;
var cuon_utils_1 = require("../webgl/cuon-utils");
var SquareDotSolidShader = /** @class */ (function () {
    function SquareDotSolidShader(gl) {
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 
        // 'precision highp float; \n' +
        'precision mediump float; \n' +
            'uniform vec4 fColor; \n' +
            'void main() {\n' +
            '    gl_FragColor = fColor; \n' +
            '}\n';
        this.gl = gl;
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    SquareDotSolidShader.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return SquareDotSolidShader;
}());
exports.SquareDotSolidShader = SquareDotSolidShader;
