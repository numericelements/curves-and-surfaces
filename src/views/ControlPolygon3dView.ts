import { lookAt, perspective, identity_mat4, multiply, fromQuat, translate } from "../webgl/mat4";
import { mat4_to_mat3 } from "../webgl/mat3";
import { setAxisAngle } from "../webgl/quat";
import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { rotationMatrixFromTwoVectors } from "../mathVector/RotationMatrix";
import { ControlPolygon3dShaders } from "./ControlPolygon3dShaders";


export class ControlPolygon3dView implements IObserver<BSplineR1toR3> {

    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint16Array = new Uint16Array([])
    public orientation: Float32Array = new Float32Array([0, 0, 0, 1])
    //private lightDirection = new Float32Array([0, 0, 1])
    private controlPoints: Vector3d[]


    constructor(spline: BSplineR1toR3, private controlPolygon3dShaders: ControlPolygon3dShaders, private lightDirection: number[], private closed: boolean) {


        this.controlPoints = spline.freeControlPoints
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0])
        }

        this.updateVerticesAndIndices()

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPolygon3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI/2)

    }

    renderFrame() {
        let gl = this.controlPolygon3dShaders.gl,
        a_Position = gl.getAttribLocation(<ControlPolygon3dShaders>this.controlPolygon3dShaders.program, 'a_Position'),
        a_Normal = gl.getAttribLocation(<ControlPolygon3dShaders>this.controlPolygon3dShaders.program, 'a_Normal'),
        a_Color = gl.getAttribLocation(<ControlPolygon3dShaders>this.controlPolygon3dShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT

        gl.useProgram(this.controlPolygon3dShaders.program)
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

        this.controlPolygon3dShaders.renderFrame(this.indices.length)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.useProgram(null)
    }

    updateVerticesAndIndices() {
        const radius = 0.003
        const sectorCount = 20

        let vertices: number[] = []
        let indices: number[] = []
        let startingIndex = 0

        for (let i = 0; i < this.controlPoints.length - 1;  i += 1) {
            let v = this.verticesForOneCylinder(this.controlPoints[i], this.controlPoints[i+1], radius, sectorCount)
            let ind = this.indicesForOneCylinder(startingIndex, sectorCount)
            vertices = [...vertices, ...v]
            indices = [...indices, ...ind]
            startingIndex += v.length / 9
        }
        
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)

    }

    verticesForOneCylinder(centerTop: Vector3d, centerBottom: Vector3d, radius: number, sectorCount: number) {

        let axisVector = centerTop.substract(centerBottom).normalize()

        const circleTop = this.orientedCircle(centerTop, radius, axisVector, sectorCount)
        const circleBottom = this.orientedCircle(centerBottom, radius, axisVector, sectorCount)

        let result: number[] = []

        for (let i = 0; i < circleTop.vertices.length; i += 1) {
            // vertex position (x, y, z)
            result.push(circleTop.vertices[i].x)
            result.push(circleTop.vertices[i].y)
            result.push(circleTop.vertices[i].z)
            // normalized vertex normal (nx, ny, nz)
            result.push(circleTop.normals[i].x)
            result.push(circleTop.normals[i].y)
            result.push(circleTop.normals[i].z)
            // Color
            result.push(0.5)
            result.push(0.5)
            result.push(0.5)
        }

        for (let i = 0; i < circleBottom.vertices.length; i += 1) {
            // vertex position (x, y, z)
            result.push(circleBottom.vertices[i].x)
            result.push(circleBottom.vertices[i].y)
            result.push(circleBottom.vertices[i].z)
            // normalized vertex normal (nx, ny, nz)
            result.push(circleBottom.normals[i].x)
            result.push(circleBottom.normals[i].y)
            result.push(circleBottom.normals[i].z)
            // Color
            result.push(0.8)
            result.push(0.8)
            result.push(0.8)
        }

        return result
    }

    orientedCircle(center: Vector3d, radius: number, axisVector: Vector3d, sectorCount: number) {
        const n = axisVector.dot(new Vector3d(0, 0, 1))
        const sectorStep = 2 * Math.PI / sectorCount
        let vertices: Vector3d[] = []
        let normals: Vector3d[] = []
        if (n > 0) {
            const rotationMatrix = rotationMatrixFromTwoVectors(new Vector3d(0, 0, 1), axisVector)
            for (let j = 0; j <= sectorCount; j += 1) {
                let sectorAngle = j * sectorStep  // starting for 0 to 2pi
                // cicle in the plane xy 
                let x = radius * Math.cos(sectorAngle)
                let y = radius * Math.sin(sectorAngle)
                let v = rotationMatrix.multiplyByVector([x, y, 0])
                vertices.push(new Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z) )

                let nx = Math.cos(sectorAngle)
                let ny = Math.sin(sectorAngle)
                let nv = rotationMatrix.multiplyByVector([nx, ny, 0])
                normals.push(new Vector3d(nv[0], nv[1], nv[2]))
            }
        }
        else {
            const rotationMatrix = rotationMatrixFromTwoVectors(new Vector3d(0, 1, 0), axisVector)
            for (let j = 0; j <= sectorCount; j += 1) {
                let sectorAngle = j * sectorStep  // starting for 0 to 2pi
                // cicle in the plane xz 
                let x = radius * Math.cos(sectorAngle)  
                let z = radius * Math.sin(sectorAngle)
                let v = rotationMatrix.multiplyByVector([x, 0, z])
                vertices.push(new Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z) )

                let nx = Math.cos(sectorAngle)
                let nz = Math.sin(sectorAngle)
                let nv = rotationMatrix.multiplyByVector([nx, 0, nz])
                normals.push(new Vector3d(nv[0], nv[1], nv[2]))
            }
        }
        return {vertices: vertices, normals: normals}
    }

    indicesForOneCylinder(startingIndex: number, sectorCount: number) {
        let result: number[] = []
            let k1 = 0  // beginning of current stack
            let k2 = k1 + sectorCount + 1   // beginning of next stack
            for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
                    result.push(k1 + startingIndex)
                    result.push(k2 + startingIndex)
                    result.push(k1 + 1 + startingIndex)
                    result.push(k1 + 1 + startingIndex)
                    result.push(k2 + startingIndex)
                    result.push(k2 + 1 + startingIndex)
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

        let a_Position = gl.getAttribLocation(<ControlPolygon3dShaders> this.controlPolygon3dShaders.program, 'a_Position'),
            a_Normal = gl.getAttribLocation(<ControlPolygon3dShaders>this.controlPolygon3dShaders.program, 'a_Normal'),
            a_Color = gl.getAttribLocation(<ControlPolygon3dShaders>this.controlPolygon3dShaders.program, 'a_Color'),
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
        const gl = this.controlPolygon3dShaders.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    }

    setUniforms() {
        const gl = this.controlPolygon3dShaders.gl
        const translate1 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const translate2 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const model = multiply(translate2, multiply(fromQuat(this.orientation), translate1))
        const model =  multiply(fromQuat(this.orientation), translate1)



        const view = this.viewMatrix()
        const projection = this.projectionMatrix()
        const mv = multiply(view, model)
        const mvp = multiply(projection, mv)

        const ambientLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "Ambient")
        const lightColorLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "LightColor")

        const modelViewProjectionMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "ModelViewProjectionMatrix")
        const normalMatrixLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "NormalMatrix")
        const lightDirectionLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "LightDirection")
        const halfVectorLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "LightDirection")
        const shininessLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "Shininess")
        const strengthLoc = gl.getUniformLocation(<WebGLProgram> this.controlPolygon3dShaders.program, "Strength")


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
        const camera_position = new Float32Array([0, 0, 3.3])
        const look_at_origin = new Float32Array([0, -0.2, 0])
        const head_is_up = new Float32Array([0, 1, 0])
        return lookAt(camera_position, look_at_origin, head_is_up)
    }

    projectionMatrix() {
        const fovy = 20 * Math.PI / 180
        const canvas = this.controlPolygon3dShaders.gl.canvas as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        return perspective(fovy, rect.width/rect.height, 0.01, 20)
    }

    update(spline: BSplineR1toR3) {

        this.controlPoints = spline.freeControlPoints
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0])
        }
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

}

