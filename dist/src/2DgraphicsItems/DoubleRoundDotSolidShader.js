"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleRoundDotSolidShader = void 0;
var cuon_utils_1 = require("../webgl/cuon-utils");
var DoubleRoundDotSolidShader = /** @class */ (function () {
    function DoubleRoundDotSolidShader(gl) {
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            'uniform vec4 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     if (dist > 0.4 && dist < 0.55 || dist > 0.75) discard; \n' +
            '     gl_FragColor = a_Color; \n' +
            '}\n';
        this.gl = gl;
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    DoubleRoundDotSolidShader.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return DoubleRoundDotSolidShader;
}());
exports.DoubleRoundDotSolidShader = DoubleRoundDotSolidShader;
