import { lookAt, perspective, identity_mat4, multiply, fromQuat, translate } from "../webgl/mat4";
import { mat4_to_mat3 } from "../webgl/mat3";
import { setAxisAngle } from "../webgl/quat";
import { Object3dShadowShaders } from "./Object3dShadowShaders";


export abstract class BaseObject3dShadowView {

    protected vertexBuffer: WebGLBuffer | null = null
    protected indexBuffer: WebGLBuffer | null = null
    protected vertices: Float32Array = new Float32Array([])
    protected indices: Uint16Array = new Uint16Array([])
    public orientation: Float32Array = new Float32Array([0, 0, 0, 1])

    constructor(protected object3dShadowShaders: Object3dShadowShaders, protected lightDirection: number[]) {
        this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI/2)
    }

    abstract updateVerticesAndIndices(): void

    
    renderFrame() {
        let gl = this.object3dShadowShaders.gl,
        a_Position = gl.getAttribLocation(<Object3dShadowShaders>this.object3dShadowShaders.program, 'a_Position'),
        a_Normal = gl.getAttribLocation(<Object3dShadowShaders>this.object3dShadowShaders.program, 'a_Normal'),
        a_Color = gl.getAttribLocation(<Object3dShadowShaders>this.object3dShadowShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT

        gl.useProgram(this.object3dShadowShaders.program)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0)
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3)
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6)
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position)
        gl.enableVertexAttribArray(a_Normal)
        gl.enableVertexAttribArray(a_Color)
        this.setUniforms()

        this.object3dShadowShaders.renderFrame(this.indices.length)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.useProgram(null)
    }

    

    initVertexBuffers(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer()
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }

        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        let a_Position = gl.getAttribLocation(<Object3dShadowShaders> this.object3dShadowShaders.program, 'a_Position'),
            a_Normal = gl.getAttribLocation(<Object3dShadowShaders>this.object3dShadowShaders.program, 'a_Normal'),
            a_Color = gl.getAttribLocation(<Object3dShadowShaders>this.object3dShadowShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;



        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        if (a_Normal < 0) {
            console.log('Failed to get the storage location of a_Normal');
            return -1;
        }

        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }


        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Normal);
        gl.enableVertexAttribArray(a_Color);

        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return this.indices.length;
    }

    updateBuffers() {
        const gl = this.object3dShadowShaders.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    }

    setUniforms() {
        const gl = this.object3dShadowShaders.gl
        const translate1 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const translate2 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const model = multiply(translate2, multiply(fromQuat(this.orientation), translate1))
        const model =  multiply(fromQuat(this.orientation), translate1)

        //const model = identity_mat4()



        const view = this.viewMatrix()
        const projection = this.projectionMatrix()
        const mv = multiply(view, model)
        const mvp = multiply(projection, mv)

        const ambientLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "Ambient")
        const lightColorLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "LightColor")

        const modelViewProjectionMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "ModelViewProjectionMatrix")
        const normalMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "NormalMatrix")
        const lightDirectionLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "LightDirection")
        const halfVectorLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "LightDirection")
        const shininessLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "Shininess")
        const strengthLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShadowShaders.program, "Strength")


        gl.uniformMatrix4fv(modelViewProjectionMatrixLoc, false, mvp)
        gl.uniformMatrix3fv(normalMatrixLoc, false, mat4_to_mat3(mv))
        gl.uniform3f(lightDirectionLoc, this.lightDirection[0], this.lightDirection[1], this.lightDirection[2])
        gl.uniform3f(lightColorLoc, 1, 1, 1)
        gl.uniform3f(ambientLoc, 0.5, 0.5, 0.5)


        const hvX = this.lightDirection[0]
        const hvY = this.lightDirection[1]
        const hvZ = this.lightDirection[2] + 1
        const norm = Math.sqrt( hvX*hvX + hvY*hvY+ hvZ*hvZ )
        gl.uniform3f(halfVectorLoc, hvX / norm, hvY / norm, hvZ / norm)
        gl.uniform1f(shininessLoc, 50)
        gl.uniform1f(strengthLoc, 20)

    }

    viewMatrix() {
        const camera_position = new Float32Array([0, 0, 3.3])
        const look_at_origin = new Float32Array([0, -0.2, 0])
        const head_is_up = new Float32Array([0, 1, 0])
        return lookAt(camera_position, look_at_origin, head_is_up)
    }

    projectionMatrix() {
        const fovy = 20 * Math.PI / 180
        const canvas = this.object3dShadowShaders.gl.canvas as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        return perspective(fovy, rect.width/rect.height, 0.01, 20)
    }
    

}