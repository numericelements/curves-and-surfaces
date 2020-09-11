import { Vector_2d } from "../mathematics/Vector_2d";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import {ControlPointsShaders} from "../views/ControlPointsShaders"
import { IObserver } from "../designPatterns/Observer";


export class ControlPointsView implements IObserver<BSpline_R1_to_R2_interface> {

    private readonly z = 0
    private selectedControlPoint: number | null = null
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint8Array = new Uint8Array([])
    private controlPoints: Vector_2d[]

    constructor(private spline: BSpline_R1_to_R2_interface, private controlPointsShaders: ControlPointsShaders, private red: number, private blue: number, private green: number ) {
        
        this.controlPoints = spline.visibleControlPoints()

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPointsShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }

    updateVerticesAndIndices() {
        const size = 0.03
        //const size = 0.05

        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);

        for (let i = 0; i < this.controlPoints.length; i += 1) {
            let x = this.controlPoints[i].x;
            let y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;

            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;

            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;

            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;

            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }


    initVertexBuffers(gl: WebGLRenderingContext) {
        this.updateVerticesAndIndices();

        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        let a_Position = gl.getAttribLocation(<ControlPointsShaders> this.controlPointsShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<ControlPointsShaders>this.controlPointsShaders.program, 'a_Texture'),
            a_Color = gl.getAttribLocation(<ControlPointsShaders>this.controlPointsShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }

        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }


        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
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

    renderFrame() {
        
        let gl = this.controlPointsShaders.gl,
            a_Position = gl.getAttribLocation(<ControlPointsShaders>this.controlPointsShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<ControlPointsShaders>this.controlPointsShaders.program, 'a_Texture'),
            a_Color = gl.getAttribLocation(<ControlPointsShaders>this.controlPointsShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        gl.useProgram(this.controlPointsShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);


        this.controlPointsShaders.renderFrame(this.indices.length, this.selectedControlPoint);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }



    controlPointSelection(x: number, y: number, deltaSquared: number = 0.01) {
        //const deltaSquared = 0.01
        //const deltaSquared = 0.001
        let result = null
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            if (Math.pow(x - this.controlPoints[i].x, 2) + Math.pow(y - this.controlPoints[i].y, 2) < deltaSquared) {
                return i;
            }
        }
        return result;
    }

    update(spline: BSpline_R1_to_R2_interface) {
        this.controlPoints = spline.visibleControlPoints();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(message: BSpline_R1_to_R2_interface): void {
    }

    updatePoints(points: Vector_2d[]) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    updateBuffers() {
        var gl = this.controlPointsShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    getSelectedControlPoint() {
        return this.selectedControlPoint;
    }


    setSelected(controlPointIndex: number | null) {
        this.selectedControlPoint = controlPointIndex;
    }

}