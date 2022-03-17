import { lookAt, perspective, identity_mat4, multiply, fromQuat, translate } from "../webgl/mat4";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { mat4_to_mat3 } from "../webgl/mat3";
import { setAxisAngle } from "../webgl/quat";
import { ControlPoints3dShadowShaders } from "./ControlPoints3dShadowShaders";
import { IObserver } from "../designPatterns/Observer";
import { Vector3d } from "../mathVector/Vector3d";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";


export class ControlPoints3dShadowView implements IObserver<BSplineR1toR3> {

    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint16Array = new Uint16Array([])
    public orientation: Float32Array = new Float32Array([0, 0, 0, 1])
    //private lightDirection = new Float32Array([0, 0, 1])


    constructor(private spline: BSplineR1toR3, private controlPoints3dShadowShaders: ControlPoints3dShadowShaders, private lightDirection: number[]) {

        this.updateVerticesAndIndices()

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPoints3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI/2)

    }

    renderFrame() {
        let gl = this.controlPoints3dShadowShaders.gl,
        a_Position = gl.getAttribLocation(<ControlPoints3dShadowShaders>this.controlPoints3dShadowShaders.program, 'a_Position'),
        a_Normal = gl.getAttribLocation(<ControlPoints3dShadowShaders>this.controlPoints3dShadowShaders.program, 'a_Normal'),
        a_Color = gl.getAttribLocation(<ControlPoints3dShadowShaders>this.controlPoints3dShadowShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT

        gl.useProgram(this.controlPoints3dShadowShaders.program)
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

        this.controlPoints3dShadowShaders.renderFrame(this.indices.length)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.useProgram(null)
    }

    updateVerticesAndIndices() {
        const radius = 0.015
        const sectorCount = 50
        const stackCount = 50

        let vertices: number[] = []
        let indices: number[] = []
        let startingIndex = 0

        for (let cp of this.spline.controlPoints) {
            let v = this.verticesForOneSphere(cp, radius, sectorCount, stackCount)
            let i = this.indicesForOneSphere(startingIndex, sectorCount, stackCount)
            vertices = [...vertices, ...v]
            indices = [...indices, ...i]
            startingIndex += v.length / 9
        }
        
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)

    }

    verticesForOneSphere(center: Vector3d, radius: number, sectorCount: number, stackCount: number) {
        //http://www.songho.ca/opengl/gl_sphere.html

        let x, y, z, xy: number // vertex position
        let nx, ny, nz: number // vertex normal
        let sectorAngle, stackAngle: number 
        const lengthInv = 1 / radius 
        const sectorStep = 2 * Math.PI / sectorCount

        const stackStep = Math.PI / stackCount
        let result: number[] = []

        for (let i = 0; i <= stackCount; i += 1) {

            stackAngle = Math.PI / 2 - i * stackStep  // starting from pi/2 to -pi/2
 
            xy = radius * Math.cos(stackAngle)
            z = radius * Math.sin(stackAngle)

            // add (sectorCout+1) vertices per stack
            // the first and last vertices have the same position and normal
            for (let j = 0; j <= sectorCount; j += 1) {
                sectorAngle = j * sectorStep  // starting for 0 to 2pi
                // vertex position (x, y, z)
                x = xy * Math.cos(sectorAngle)   // r * cos(u) * cos(v)
                y = xy * Math.sin(sectorAngle)   // r * cos(u) * sin(v)
                result.push(x + center.x)
                result.push(y + center.y)
                result.push(z + center.z)
                // normalized vertex normal (nx, ny, nz)
                nx = x * lengthInv
                ny = y * lengthInv
                nz = z * lengthInv
                result.push(nx)
                result.push(ny)
                result.push(nz)
                // Color
                result.push(0.5)
                result.push(0.5)
                result.push(0.5)
            }
        }
        return result
    }

    indicesForOneSphere(startingIndex: number, sectorCount: number, stackCount: number) {

        let result: number[] = []

        for (let i = 0; i < stackCount; i += 1) {
            let k1 = i * (sectorCount + 1)  // beginning of current stack
            let k2 = k1 + sectorCount + 1   // beginning of next stack
            for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
                if ( i != 0) {
                    result.push(k1 + startingIndex)
                    result.push(k2 + startingIndex)
                    result.push(k1 + 1 + startingIndex)
                }
                if ( i != (stackCount-1)) {
                    result.push(k1 + 1 + startingIndex)
                    result.push(k2 + startingIndex)
                    result.push(k2 + 1 + startingIndex)
                }
            }
        }
        return result

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

        let a_Position = gl.getAttribLocation(<ControlPoints3dShadowShaders> this.controlPoints3dShadowShaders.program, 'a_Position'),
            a_Normal = gl.getAttribLocation(<ControlPoints3dShadowShaders>this.controlPoints3dShadowShaders.program, 'a_Normal'),
            a_Color = gl.getAttribLocation(<ControlPoints3dShadowShaders>this.controlPoints3dShadowShaders.program, 'a_Color'),
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
        const gl = this.controlPoints3dShadowShaders.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    }

    setUniforms() {
        const gl = this.controlPoints3dShadowShaders.gl
        const translate1 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const translate2 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const model = multiply(translate2, multiply(fromQuat(this.orientation), translate1))
        const model =  multiply(fromQuat(this.orientation), translate1)

        //const model = identity_mat4()



        const view = this.viewMatrix()
        const projection = this.projectionMatrix()
        const mv = multiply(view, model)
        const mvp = multiply(projection, mv)

        const ambientLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "Ambient")
        const lightColorLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "LightColor")

        const modelViewProjectionMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "ModelViewProjectionMatrix")
        const normalMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "NormalMatrix")
        const lightDirectionLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "LightDirection")
        const halfVectorLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "LightDirection")
        const shininessLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "Shininess")
        const strengthLoc = gl.getUniformLocation(<WebGLProgram> this.controlPoints3dShadowShaders.program, "Strength")


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
        const canvas = this.controlPoints3dShadowShaders.gl.canvas as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        return perspective(fovy, rect.width/rect.height, 0.01, 20)
    }

    update(spline: BSplineR1toR3) {
        this.spline = spline
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

}