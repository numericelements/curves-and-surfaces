import { Vector_2d } from "../mathematics/Vector_2d";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import {TransitionDifferentialEventShaders} from "./TransitionDifferentialEventShaders"
import { IObserver } from "../designPatterns/Observer";
//import { PeriodicBSpline_R1_to_R2_DifferentialProperties } from "../mathematics/PeriodicBSpline_R1_to_R2_DifferentialProperties";
//import { PeriodicBSpline_R1_to_R2 } from "../mathematics/PeriodicBSpline_R1_to_R2";
import { BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";


export class TransitionCurvatureExtremaView implements IObserver<BSpline_R1_to_R2_interface> {

    private readonly z = 0
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint8Array = new Uint8Array([])
    private controlPoints: Vector_2d[]

    constructor(spline: BSpline_R1_to_R2_interface, private curvatureExtremaShaders: TransitionDifferentialEventShaders, private red: number, private green: number, private blue: number,  private alpha: number) {
        
        this.controlPoints = spline.visibleControlPoints()

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }

        this.update(spline)
    }

    updateVerticesAndIndices() {
        const size = 0.03
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

        let a_Position = gl.getAttribLocation(<TransitionDifferentialEventShaders> this.curvatureExtremaShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<TransitionDifferentialEventShaders>this.curvatureExtremaShaders.program, 'a_Texture'),
            //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);

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
        let gl = this.curvatureExtremaShaders.gl,
            a_Position = gl.getAttribLocation(<TransitionDifferentialEventShaders>this.curvatureExtremaShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<TransitionDifferentialEventShaders>this.curvatureExtremaShaders.program, 'a_Texture'),
            //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT,
            a_ColorLocation = gl.getUniformLocation(<WebGLProgram>this.curvatureExtremaShaders.program, "a_Color");

        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);

        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);

        this.curvatureExtremaShaders.renderFrame(this.indices.length);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }



    update(spline: BSpline_R1_to_R2_interface) {
        if (spline instanceof BSpline_R1_to_R2) {
            const splineDP = new BSpline_R1_to_R2_DifferentialProperties(spline)
            this.controlPoints = splineDP.transitionCurvatureExtrema()
            this.updateVerticesAndIndices()
            this.updateBuffers()
        }

    }

    reset(message: BSpline_R1_to_R2_interface): void {
    }

    updateBuffers() {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }


}