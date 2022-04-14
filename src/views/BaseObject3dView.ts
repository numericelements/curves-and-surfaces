import { lookAt, perspective, identity_mat4, multiply, fromQuat, translate } from "../webgl/mat4";
import { mat4_to_mat3 } from "../webgl/mat3";
import { setAxisAngle } from "../webgl/quat";
import { Object3dShaders } from "./Object3dShaders";
import { Vector3d } from "../mathVector/Vector3d";
import { SquareMatrix } from "../linearAlgebra/SquareMatrix";


export abstract class BaseObject3dView {

    protected vertexBuffer: WebGLBuffer | null = null
    protected indexBuffer: WebGLBuffer | null = null
    protected vertices: Float32Array = new Float32Array([])
    protected indices: Uint16Array = new Uint16Array([])
    public orientation: Float32Array = new Float32Array([0, 0, 0, 1])

    private camera_position = new Float32Array([0, 0, 3.3])
    private look_at_origin = new Float32Array([0, -0.2, 0])
    //private look_at_origin = new Float32Array([0, 0, 0])

    private head_is_up = new Float32Array([0, 1, 0])
    private fovy = 20 * Math.PI / 180

    constructor(protected object3dShaders: Object3dShaders, protected lightDirection: number[]) {
        this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI/2)
        //this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), 0)

    }

    abstract updateVerticesAndIndices(): void

    
    renderFrame() {
        let gl = this.object3dShaders.gl,
        a_Position = gl.getAttribLocation(<Object3dShaders>this.object3dShaders.program, 'a_Position'),
        a_Normal = gl.getAttribLocation(<Object3dShaders>this.object3dShaders.program, 'a_Normal'),
        a_Color = gl.getAttribLocation(<Object3dShaders>this.object3dShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT
        gl.useProgram(this.object3dShaders.program)
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
        this.object3dShaders.renderFrame(this.indices.length)
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
        let a_Position = gl.getAttribLocation(<Object3dShaders> this.object3dShaders.program, 'a_Position'),
            a_Normal = gl.getAttribLocation(<Object3dShaders>this.object3dShaders.program, 'a_Normal'),
            a_Color = gl.getAttribLocation(<Object3dShaders>this.object3dShaders.program, 'a_Color'),
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
        const gl = this.object3dShaders.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    }

    getModelTransformationMatrix() {
        const model = fromQuat(this.orientation)
        const m = [model[0], model[4], model[8], model[1], model[5], model[9], model[2], model[6], model[10]]
        return new SquareMatrix(3, m )
    }

    setUniforms() {
        const gl = this.object3dShaders.gl
        const translate1 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        const model =  multiply(fromQuat(this.orientation), translate1)
        const view = this.viewMatrix()
        const projection = this.projectionMatrix()
        const mv = multiply(view, model)
        const mvp = multiply(projection, mv)
        const ambientLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "Ambient")
        const lightColorLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "LightColor")
        const modelViewProjectionMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "ModelViewProjectionMatrix")
        const normalMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "NormalMatrix")
        const lightDirectionLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "LightDirection")
        const halfVectorLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "LightDirection")
        const shininessLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "Shininess")
        const strengthLoc = gl.getUniformLocation(<WebGLProgram> this.object3dShaders.program, "Strength")
        gl.uniformMatrix4fv(modelViewProjectionMatrixLoc, false, mvp)
        gl.uniformMatrix3fv(normalMatrixLoc, false, mat4_to_mat3(mv))
        gl.uniform3f(lightDirectionLoc, this.lightDirection[0], this.lightDirection[1], this.lightDirection[2])
        gl.uniform3f(lightColorLoc, 1, 1, 1)
        gl.uniform3f(ambientLoc, 0.1, 0.1, 0.1)
        const hvX = this.lightDirection[0]
        const hvY = this.lightDirection[1]
        const hvZ = this.lightDirection[2] + 1
        const norm = Math.sqrt( hvX*hvX + hvY*hvY+ hvZ*hvZ )
        gl.uniform3f(halfVectorLoc, hvX / norm, hvY / norm, hvZ / norm)
        gl.uniform1f(shininessLoc, 50)
        gl.uniform1f(strengthLoc, 20)

    }

    viewMatrix() {
        return lookAt(this.camera_position, this.look_at_origin, this.head_is_up)
    }

    projectionMatrix() {
        const canvas = this.object3dShaders.gl.canvas as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        return perspective(this.fovy, rect.width/rect.height, 0.01, 20)
    }

    pickingLine(ndcX: number, ndcY: number) {
        //https://jsantell.com/model-view-projection/
        const canvas = this.object3dShaders.gl.canvas as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        const p1 = new Vector3d(this.camera_position[0], this.camera_position[1], this.camera_position[2])
        const pOrigin = new Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2])
        const v1 = pOrigin.substract(p1)
        const v2 = new Vector3d(this.head_is_up[0], this.head_is_up[1], this.head_is_up[2])
        const v3 = (v1).crossPoduct(v2)
        const top = v1.axisAngleRotation(v3, this.fovy / 2)
        const bottom = v1.axisAngleRotation(v3, - this.fovy / 2)
        const center = top.add(bottom).multiply(0.5)
        const right = v1.axisAngleRotation(v2, - this.fovy / 2)
        const v4 = right.substract(center).multiply(ndcX * rect.width/rect.height)
        const v5 = top.substract(center).multiply(ndcY)
        const p2 = v4.add(v5).add(center).add(p1)
        return {p1: p1, p2: p2}
    }

    distanceToCamera(point: Vector3d) {
        const p1 = this.getCameraPosition()
        const pOrigin = new Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2])
        const v1 = pOrigin.substract(p1)
        // returns null if the point is behind the camera
        if ((point.substract(p1)).dot(v1) < 0) {
            return null
        }
        return point.substract(p1).norm()
    }

    getCameraPosition() {
        return new Vector3d(this.camera_position[0], this.camera_position[1], this.camera_position[2])
    }

    getLookAtOrigin() {
        return new Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2])
    }




    

}

