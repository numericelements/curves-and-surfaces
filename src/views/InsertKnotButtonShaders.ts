import { createProgram } from "../webgl/cuon-utils";

export class InsertKnotButtonShaders {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
    'attribute vec3 a_Position; \n' +
    'attribute vec2 a_Texture; \n' +
    'attribute vec3 a_Color; \n' +
    'varying vec2 v_Texture; \n' +
    'varying vec3 v_Color; \n' +
    'void main() {\n' +
    '    v_Texture = a_Texture; \n' +
    '    v_Color = a_Color; \n' +
    '    gl_Position = vec4(a_Position, 1.0); \n' +
    '}\n';

    // Fragment shader program
    private readonly FSHADER_SOURCE = 
    'precision highp float; \n' +
    'varying vec2 v_Texture; \n' +
    'varying vec3 v_Color; \n' +
    'void main() {\n' +
    '     float dist1 = distance(v_Texture, vec2(0.0, 0.0)); \n' +
    '     float dist2 = distance(v_Texture, vec2(0.9, 0.0)); \n' +
    '     float dist3 = distance(v_Texture, vec2(-0.9, 0.0)); \n' +
    '     if (dist1 < 0.25 || dist2 < 0.25 || dist3 < 0.25) { \n' +
    '     gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0); } \n ' +
    '     else if (v_Texture[0] > -0.9 && v_Texture[0] < 0.9 && v_Texture[1] < 0.1 && v_Texture[1] > -0.1) { \n' +
    '     gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0); } \n ' +
    '     else if ( distance(v_Texture, vec2(1.2, 0.7)) > 0.3 && v_Texture[0] > 1.2 && v_Texture[1] > 0.7 ) { \n' +
    '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
    '     else if ( distance(v_Texture, vec2(1.2, -0.7)) > 0.3 && v_Texture[0] > 1.2 && v_Texture[1] < -0.7 ) { \n' +
    '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
    '     else if ( distance(v_Texture, vec2(-1.2, 0.7)) > 0.3 && v_Texture[0] < -1.2 && v_Texture[1] > 0.7 ) { \n' +
    '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
    '     else if ( distance(v_Texture, vec2(-1.2, -0.7)) > 0.3 && v_Texture[0] < -1.2 && v_Texture[1] < -0.7 ) { \n' +
    '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
    '     else { \n' +
    '     /*gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); } */ \n' +
    '     gl_FragColor = vec4(v_Color, 1.0); } \n' +
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
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0)
        }
    }


};



