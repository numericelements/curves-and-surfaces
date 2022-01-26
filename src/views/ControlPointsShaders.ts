import { createProgram } from "../webgl/cuon-utils";


export class ControlPointsShaders {

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
        '//uniform bool selected; \n' +
        'varying vec2 v_Texture; \n' +
        'varying vec3 v_Color; \n' +
        'void main() {\n' +
        '     vec4 fColor = vec4(0.1, 0.1, 0.1, 0.0); \n' +
        '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
        '     vec4 color1 = vec4(v_Color, 0.35); \n' +
        '     vec4 color2 = vec4(v_Color, 0.9); \n' +
        '     float delta = 0.1; \n' +
        '     float alpha1 = smoothstep(0.35-delta, 0.35, dist); \n' +
        '     float alpha2 = smoothstep(0.65-delta, 0.65, dist); \n' +
        '     vec4 fColor1 = mix(color1, fColor, alpha1); \n' +
        '     vec4 fColor2 = mix(color2, fColor, alpha2); \n' +
        '     gl_FragColor = (fColor1+fColor2)/2.0; \n' +
        '}\n';

    public program: WebGLProgram | null


    constructor(public gl: WebGLRenderingContext) {
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)
        if (!this.program) {
            console.log('Failed to create program')
        }
        this.gl.useProgram(this.program)
    }

    renderFrame(numberOfElements: number, selectedControlPoint: number | null) {

        if(this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0)
            if (selectedControlPoint != -1 && selectedControlPoint !== null) {
                this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, selectedControlPoint * 6)
            }
        }

    }
}

