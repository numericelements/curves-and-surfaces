import { createProgram } from "../webgl/cuon-utils";


export class Object3dShadowShaders {

    // Vertex shader program
    private readonly VSHADER_SOURCE = 
        'attribute vec3 a_Position; \n' +
        'attribute vec3 a_Normal; \n' +
        'attribute vec3 a_Color; \n' +
        'uniform mat4 ModelViewProjectionMatrix; \n' +
        'uniform mat3 NormalMatrix; \n' +
        'varying vec3 normal; \n' +
        'varying vec4 color; \n' +
        'void main() {\n' +
        '    normal = normalize(NormalMatrix * a_Normal); \n' +
        '    color = vec4(a_Color, 1.0); \n' +
        '    vec4 position = ModelViewProjectionMatrix * vec4(a_Position, 1.0); \n' +
        '    gl_Position = vec4(position.x, position.y*0.0 - 1.5, position.z, position.w); \n' +
        '}\n';

   // Fragment shader program
   private readonly FSHADER_SOURCE = 
        'precision mediump float; \n' +
        'uniform vec3 Ambient; \n' +
        'uniform vec3 LightColor; \n' +
        'uniform vec3 LightDirection; \n' +
        'uniform vec3 HalfVector; \n' +
        'uniform float Shininess; \n' +
        'uniform float Strength; \n' +
        'varying vec3 normal; \n' +
        'varying vec4 color; \n' +
        'void main() {\n' +
        '   float diffuse = abs(dot(normal, LightDirection)); \n' +
        '   float specular = abs(dot(normal, HalfVector)); \n' +
        '   specular = pow(specular, Shininess); \n' +
        '   vec3 scatteredLight = Ambient + LightColor*diffuse; \n' +
        '   vec3 reflectedLight = LightColor*specular*Strength; \n' +
        '   vec3 rgb = min(color.rgb*scatteredLight + reflectedLight, vec3(1.0)); \n' +
        '   gl_FragColor = vec4(rgb, color.a); \n' +
        '   gl_FragColor = vec4(0.1, 0.1, 0.1, 1); \n' +
        '}\n';



   public program: WebGLProgram | null

    constructor(public gl: WebGLRenderingContext) {
        this.program = createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }

    renderFrame(numberOfIndices: number) {
       this.gl.drawElements(this.gl.TRIANGLES, numberOfIndices, this.gl.UNSIGNED_SHORT, 0);
    }


}