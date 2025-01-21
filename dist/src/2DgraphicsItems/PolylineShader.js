"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolylineShader = void 0;
var cuon_utils_1 = require("../webgl/cuon-utils");
var PolylineShader = /** @class */ (function () {
    function PolylineShader(gl) {
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
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
    PolylineShader.prototype.renderFrame = function (numberOfVertices) {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, numberOfVertices);
    };
    return PolylineShader;
}());
exports.PolylineShader = PolylineShader;
;
